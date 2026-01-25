// Admin API: Translate lesson content from Russian to English using Claude AI
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, type, adminKey } = await request.json()

    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
    
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    let prompt = ''
    
    if (type === 'title') {
      // Translate title only
      prompt = `Translate this Russian title to English. Return ONLY the translated title, nothing else:

"${text}"`
    } else if (type === 'content') {
      // Translate and format content
      prompt = `You are translating educational content about "Theory of Abstraction" and cognitive philosophy from Russian to English.

TASK: Translate the following Russian text to English and format it properly.

FORMATTING RULES:
1. Use **bold** for key concepts and important terms
2. Use > for important quotes or key statements (blockquotes)
3. Keep paragraphs short and readable
4. If the text contains enumerated points, format them as a proper list
5. Preserve any existing structure and emphasis
6. Make the translation academically clear but accessible
7. The translation should sound natural in English, not literal

RUSSIAN TEXT:
${text}

Return ONLY the translated and formatted English text in Markdown format. Do not include any explanations or notes.`
    } else if (type === 'audio') {
      // Translate for TTS (plain text, no markdown)
      prompt = `Translate this Russian text to English for text-to-speech narration.

RULES:
1. Translate accurately but naturally
2. NO markdown formatting (no **, no >, no # etc.)
3. Write in plain readable sentences
4. The text will be read aloud, so it should flow naturally when spoken
5. Expand abbreviations if any
6. Numbers should be written as words where appropriate

RUSSIAN TEXT:
${text}

Return ONLY the plain English text suitable for TTS, nothing else.`
    } else if (type === 'full_lesson') {
      // Translate entire lesson content with structure
      prompt = `You are translating an educational lesson about "Theory of Abstraction" from Russian to English.

TASK: Translate the following Russian lesson text and structure it into clear sections.

OUTPUT FORMAT (JSON):
{
  "title": "English lesson title",
  "slides": [
    {
      "title": "Section/slide title in English",
      "content": "Formatted content with **bold** for key terms and > for quotes",
      "audioText": "Plain text version for TTS narration (no markdown)"
    }
  ]
}

FORMATTING RULES FOR CONTENT:
1. Use **bold** for key concepts and important philosophical terms
2. Use > for important statements and definitions (blockquotes)
3. Keep paragraphs concise
4. Each slide should focus on ONE main idea
5. Natural, academic English

RUSSIAN TEXT:
${text}

Return ONLY valid JSON, no explanations.`
    } else {
      return NextResponse.json({ error: 'Invalid type. Use: title, content, audio, or full_lesson' }, { status: 400 })
    }

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
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Claude API error')
    }

    const data = await response.json()
    const translatedText = data.content[0]?.text || ''

    // For full_lesson type, parse JSON
    if (type === 'full_lesson') {
      try {
        const cleanedText = translatedText.replace(/```json\s*|\s*```/g, '').trim()
        const parsed = JSON.parse(cleanedText)
        return NextResponse.json({
          success: true,
          type,
          result: parsed,
        })
      } catch {
        return NextResponse.json({
          success: true,
          type,
          result: translatedText,
          parseError: true,
        })
      }
    }

    return NextResponse.json({
      success: true,
      type,
      result: translatedText.trim(),
    })

  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
