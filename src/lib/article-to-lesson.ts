export type GeneratedLessonSlide = {
  title: string
  content: string
  emoji?: string
  audioText?: string
}

export type GeneratedLesson = {
  title: string
  description?: string
  durationMinutes?: number
  slides: GeneratedLessonSlide[]
}

function cleanJsonText(raw: string) {
  return raw.replace(/```json\s*|\s*```/g, '').trim()
}

export async function generateLessonFromText(args: {
  text: string
  targetSlides?: number
  language?: 'en'
  maxChars?: number
}): Promise<GeneratedLesson> {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }

  const language = args.language || 'en'
  const targetSlides = Number.isFinite(args.targetSlides) ? Math.max(6, Math.min(24, Number(args.targetSlides))) : 14
  const maxChars = Number.isFinite(args.maxChars) ? Math.max(2000, Math.min(40_000, Number(args.maxChars))) : 18_000
  const source = (args.text || '').slice(0, maxChars)

  const prompt = `You are an expert instructional designer and educator.

TASK
Convert the SOURCE TEXT into a clear, engaging video-lesson script split into ${targetSlides} short slides.

STYLE (IMPORTANT)
- This must be a TEACHING LESSON, not an academic paper.
- Remove citations, JEL codes, bibliography, email/author lines, and academic framing.
- Keep each slide focused on ONE idea.
- Use simple language, short paragraphs, and examples.
- Use Markdown for formatting (headings, lists, **bold**, > quotes).
- Include at least:
  1) Hook/introduction
  2) Key definitions
  3) One concrete example (contract + incentives)
  4) A short recap
  5) A final practical assignment

OUTPUT (STRICT JSON ONLY)
{
  "title": "Lesson title (${language})",
  "description": "1-2 sentence description",
  "durationMinutes": 25,
  "slides": [
    {
      "title": "Slide title",
      "emoji": "📜",
      "content": "Markdown content (short)",
      "audioText": "Plain text for narration (no markdown)"
    }
  ]
}

SOURCE TEXT:
${source}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.error?.message || `Claude API error: ${response.status}`)
  }

  const data = await response.json()
  const claudeText = data.content?.[0]?.text || ''
  const parsed = JSON.parse(cleanJsonText(claudeText)) as GeneratedLesson

  if (!parsed?.title || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
    throw new Error('Failed to generate lesson JSON')
  }

  return parsed
}

