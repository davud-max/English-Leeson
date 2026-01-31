import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'davud-max/English-Leeson';
const GITHUB_BRANCH = 'main';

interface UploadRequest {
  lessonNumber: number;
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
    const { lessonNumber, slideNumber, audioBase64 } = body;

    if (!lessonNumber || !slideNumber || !audioBase64) {
      return NextResponse.json(
        { error: 'lessonNumber, slideNumber, and audioBase64 are required' },
        { status: 400 }
      );
    }

    const filePath = `public/audio/lesson${lessonNumber}/slide${slideNumber}.mp3`;
    
    // Проверяем существует ли файл (чтобы получить SHA для обновления)
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
        const data = await checkResponse.json();
        existingSha = data.sha;
      }
    } catch (e) {
      // Файл не существует - это нормально
    }

    // Загружаем/обновляем файл
    const uploadBody: Record<string, string> = {
      message: `Update audio: lesson ${lessonNumber}, slide ${slideNumber}`,
      content: audioBase64,
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
      const errorData = await uploadResponse.json();
      throw new Error(`GitHub API error: ${errorData.message}`);
    }

    const result = await uploadResponse.json();

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
