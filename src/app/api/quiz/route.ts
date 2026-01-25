// API route for checking quiz answers using Claude AI
// /api/quiz/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, question, correctAnswer, userAnswer } = await request.json();

    if (action !== 'check_answer') {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    if (!question || !userAnswer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    // Normalize texts for simple comparison
    const normalizedCorrect = correctAnswer?.toLowerCase().trim().replace(/[^\p{L}\p{N}\s]/gu, '') || '';
    const normalizedUser = userAnswer.toLowerCase().trim().replace(/[^\p{L}\p{N}\s]/gu, '');

    // Exact match
    if (normalizedCorrect === normalizedUser) {
      return NextResponse.json({
        success: true,
        is_correct: true,
        score: 100,
        feedback: 'Excellent! Absolutely correct answer!',
      });
    }

    // Check for key words match
    const correctWords = normalizedCorrect.split(' ').filter((w: string) => w.length > 2);
    let matchedWords = 0;
    for (const word of correctWords) {
      if (normalizedUser.includes(word)) {
        matchedWords++;
      }
    }
    const simpleScore = correctWords.length > 0 ? Math.round((matchedWords / correctWords.length) * 100) : 0;

    // If simple check gives high result
    if (simpleScore >= 80) {
      return NextResponse.json({
        success: true,
        is_correct: true,
        score: simpleScore,
        feedback: 'Correct! You identified the main concepts.',
      });
    }

    // Use AI for more complex checking
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (ANTHROPIC_API_KEY) {
      try {
        const prompt = `You are checking a student's answer to a question.

QUESTION: ${question}
REFERENCE ANSWER: ${correctAnswer || 'Not provided'}
STUDENT'S ANSWER: ${userAnswer}

Evaluate the student's answer on a scale from 0 to 100:
- 80-100 = correct answer (student understood the essence)
- 50-79 = partially correct
- 0-49 = incorrect

Respond ONLY with JSON (no markdown):
{"score": number, "feedback": "brief comment in English up to 30 words"}`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 300,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let text = data.content[0]?.text || '';
          text = text.replace(/```json\s*|\s*```/g, '');
          
          const jsonMatch = text.match(/\{[^}]+\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            if (typeof result.score === 'number') {
              return NextResponse.json({
                success: true,
                is_correct: result.score >= 70,
                score: result.score,
                feedback: result.feedback || 'Answer checked',
              });
            }
          }
        }
      } catch (aiError) {
        console.error('AI check error:', aiError);
        // Fall through to simple check
      }
    }

    // Fallback to simple check
    if (simpleScore >= 50) {
      return NextResponse.json({
        success: true,
        is_correct: false,
        score: simpleScore,
        feedback: 'Partially correct. Try to expand your answer.',
      });
    }

    return NextResponse.json({
      success: true,
      is_correct: false,
      score: simpleScore,
      feedback: 'Incorrect. Review the lesson material and try again.',
    });

  } catch (error) {
    console.error('Error checking answer:', error);
    return NextResponse.json(
      { error: 'Failed to check answer: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
