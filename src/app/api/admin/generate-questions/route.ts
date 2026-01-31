// Admin API: Generate quiz questions using Claude AI and save to GitHub
// Only accessible by admin

import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'davud-max/English-Leeson';
const GITHUB_BRANCH = 'main';

export async function POST(request: NextRequest) {
  try {
    const { lessonId, count = 5, difficulty = 'mixed', lessonContent, lessonTitle, adminKey } = await request.json()

    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!lessonId || !lessonContent) {
      return NextResponse.json({ error: 'Lesson ID and content are required' }, { status: 400 })
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
    
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Clean content - limit length
    const content = lessonContent.substring(0, 8000)

    // Prepare difficulty instructions
    let difficultyInstructions = ''
    if (difficulty === 'easy') {
      difficultyInstructions = `All questions should be BEGINNER level:
- Simple, direct questions about basic concepts
- Answers can be found directly in the lesson text
- No deep analysis required`
    } else if (difficulty === 'hard') {
      difficultyInstructions = `All questions should be ADVANCED level:
- Complex questions requiring analysis and understanding of connections
- May require synthesis of information from different parts of the lesson
- Questions on application, comparison, generalization`
    } else {
      difficultyInstructions = `Create questions of MIXED difficulty:
- Half should be beginner level (easy): simple, direct questions
- Half should be advanced level (hard): complex, analytical questions`
    }

    // Generate questions using Claude
    const prompt = `You are an experienced teacher. Based on the following lesson, create ${count} quiz questions.

LESSON: ${lessonTitle || `Lesson ${lessonId}`}

LESSON CONTENT:
${content}

DIFFICULTY REQUIREMENTS:
${difficultyInstructions}

GENERAL REQUIREMENTS:
1. Create exactly ${count} questions
2. Questions should test understanding of key concepts from the Theory of Abstraction
3. Correct answers should be brief (1-3 sentences)
4. Points: easy = 5 points, hard = 15 points
5. Questions and answers must be in English

RESPONSE FORMAT (STRICTLY JSON, no text before or after):
{
  "questions": [
    {
      "question": "question text?",
      "correct_answer": "correct answer",
      "difficulty": "easy or hard",
      "points": 5 or 15
    }
  ]
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Claude API error')
    }

    const data = await response.json()
    const claudeText = data.content[0]?.text || ''
    
    // Parse JSON from response
    const cleanedText = claudeText.replace(/```json\s*|\s*```/g, '').trim()
    const questionsData = JSON.parse(cleanedText)

    if (!questionsData?.questions) {
      return NextResponse.json({ error: 'Failed to parse questions' }, { status: 500 })
    }

    // Process questions
    const questions = questionsData.questions.map((q: { question: string; correct_answer: string; difficulty?: string; points?: number }, index: number) => ({
      id: index + 1,
      question: q.question,
      correct_answer: q.correct_answer,
      difficulty: q.difficulty || 'easy',
      points: q.points || (q.difficulty === 'hard' ? 15 : 5),
    }))

    // Save to GitHub
    const jsonContent = JSON.stringify({
      lessonId,
      lessonTitle,
      generatedAt: new Date().toISOString(),
      questions,
    }, null, 2);

    const filePath = `public/data/questions/lesson${lessonId}.json`;
    
    // Check if GITHUB_TOKEN is configured
    if (!GITHUB_TOKEN) {
      console.warn('GITHUB_TOKEN not configured, skipping file save to GitHub');
      return NextResponse.json({
        success: true,
        message: `Generated ${questions.length} questions (not saved - GITHUB_TOKEN missing)`,
        questions,
        count: questions.length,
        savedToGitHub: false,
      });
    }

    try {
      // Check if file exists to get SHA
      let existingSha: string | null = null;
      try {
        const checkResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
          {
            headers: {
              'Authorization': `Bearer ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );
        
        if (checkResponse.ok) {
          const fileData = await checkResponse.json();
          existingSha = fileData.sha;
        }
      } catch {
        // File doesn't exist - that's OK
      }

      // Upload to GitHub
      const uploadBody: Record<string, string> = {
        message: `Update questions for lesson ${lessonId}`,
        content: Buffer.from(jsonContent).toString('base64'),
        branch: GITHUB_BRANCH,
      };

      if (existingSha) {
        uploadBody.sha = existingSha;
      }

      const uploadResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadBody),
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('GitHub upload failed:', errorText);
        throw new Error(`GitHub API error: ${uploadResponse.status}`);
      }

      console.log(`✅ Questions saved to GitHub: ${filePath}`);

      return NextResponse.json({
        success: true,
        message: `Generated and saved ${questions.length} questions for lesson ${lessonId}`,
        questions,
        count: questions.length,
        savedToGitHub: true,
        filePath,
      });

    } catch (githubError) {
      console.error('GitHub save error:', githubError);
      // Return questions even if GitHub save failed
      return NextResponse.json({
        success: true,
        message: `Generated ${questions.length} questions (GitHub save failed)`,
        questions,
        count: questions.length,
        savedToGitHub: false,
        githubError: (githubError as Error).message,
      });
    }

  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate questions: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
