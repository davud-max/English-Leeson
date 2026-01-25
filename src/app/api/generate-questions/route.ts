// API route for generating quiz questions using Claude AI
// /api/generate-questions/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { lessonId, count = 5, difficulty = 'mixed', lessonContent, lessonTitle } = await request.json();

    if (!lessonId || !lessonContent) {
      return NextResponse.json({ error: 'Lesson ID and content are required' }, { status: 400 });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Clean content - limit length
    const content = lessonContent.substring(0, 8000);

    // Prepare difficulty instructions
    let difficultyInstructions = '';
    if (difficulty === 'easy') {
      difficultyInstructions = `All questions should be BEGINNER level:
- Simple, direct questions about basic concepts
- Answers can be found directly in the lesson text
- No deep analysis required`;
    } else if (difficulty === 'hard') {
      difficultyInstructions = `All questions should be ADVANCED level:
- Complex questions requiring analysis and understanding of connections
- May require synthesis of information from different parts of the lesson
- Questions on application, comparison, generalization`;
    } else {
      difficultyInstructions = `Create questions of MIXED difficulty:
- Half should be beginner level (easy): simple, direct questions
- Half should be advanced level (hard): complex, analytical questions`;
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
}`;

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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Claude API error');
    }

    const data = await response.json();
    const claudeText = data.content[0]?.text || '';
    
    // Parse JSON from response
    const cleanedText = claudeText.replace(/```json\s*|\s*```/g, '').trim();
    const questionsData = JSON.parse(cleanedText);

    if (!questionsData?.questions) {
      return NextResponse.json({ error: 'Failed to parse questions' }, { status: 500 });
    }

    // Process questions
    const questions = questionsData.questions.map((q: { question: string; correct_answer: string; difficulty?: string; points?: number }, index: number) => ({
      id: index + 1,
      question: q.question,
      correct_answer: q.correct_answer,
      difficulty: q.difficulty || 'easy',
      points: q.points || (q.difficulty === 'hard' ? 15 : 5),
    }));

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
