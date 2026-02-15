import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'davud-max/English-Leeson';
const GITHUB_BRANCH = 'main';

interface UploadRequest {
  lessonId?: string;
  audioKey?: string;
  lessonNumber?: number;
  slideNumber: number;
  audioBase64: string;
}

export async function POST(request: Request) {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured. Add GITHUB_TOKEN to environment variables.' },
        { status: 500 }
      );
    }

    const body: UploadRequest = await request.json();
    const { lessonId, audioKey, lessonNumber, slideNumber, audioBase64 } = body;

    if (!slideNumber || !audioBase64 || (!lessonId && !audioKey && !lessonNumber)) {
      return NextResponse.json(
        { error: 'slideNumber, audioBase64 and lessonId/audioKey/lessonNumber are required' },
        { status: 400 }
      );
    }

    let resolvedAudioFolder = '';
    let resolvedLessonLabel = '';

    if (audioKey) {
      resolvedAudioFolder = audioKey;
      resolvedLessonLabel = audioKey;
    } else if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { id: true, order: true },
      });
      if (!lesson) {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
      }
      resolvedAudioFolder = `lesson-${lesson.id}`;
      resolvedLessonLabel = `lesson-${lesson.order}`;
    } else {
      resolvedAudioFolder = `lesson${lessonNumber}`;
      resolvedLessonLabel = `lesson-${lessonNumber}`;
    }

    const filePath = `public/audio/${resolvedAudioFolder}/slide${slideNumber}.mp3`;
    const result = await uploadWithRetry(filePath, audioBase64, resolvedLessonLabel, slideNumber);

    return NextResponse.json({
      success: true,
      path: filePath,
      sha: result.content.sha,
      url: result.content.html_url,
    });
  } catch (error) {
    console.error('Error uploading audio:', error);
    return NextResponse.json(
      { error: 'Failed to upload audio: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// GET - проверка статуса API
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    hasGitHubToken: !!GITHUB_TOKEN,
    tokenLength: GITHUB_TOKEN?.length || 0,
    tokenPrefix: GITHUB_TOKEN ? GITHUB_TOKEN.substring(0, 10) + '...' : 'not set',
    repo: GITHUB_REPO,
    branch: GITHUB_BRANCH,
  });
}

async function getExistingSha(filePath: string): Promise<string | null> {
  const checkResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  );

  if (!checkResponse.ok) return null;
  const data = await checkResponse.json();
  return data.sha || null;
}

async function uploadWithRetry(
  filePath: string,
  audioBase64: string,
  lessonLabel: string,
  slideNumber: number
) {
  const maxAttempts = 5;
  let lastError = '';

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const existingSha = await getExistingSha(filePath);

    const uploadBody: Record<string, string> = {
      message: `Update audio: ${lessonLabel}, slide ${slideNumber}`,
      content: audioBase64,
      branch: GITHUB_BRANCH,
    };
    if (existingSha) uploadBody.sha = existingSha;

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

    if (uploadResponse.ok) {
      return uploadResponse.json();
    }

    const bodyText = await uploadResponse.text();
    lastError = `GitHub API error ${uploadResponse.status}: ${bodyText}`;

    const retryable = [409, 422, 429, 500, 502, 503, 504].includes(uploadResponse.status);
    if (!retryable || attempt === maxAttempts) {
      throw new Error(lastError);
    }

    await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
  }

  throw new Error(lastError || 'Upload failed');
}
