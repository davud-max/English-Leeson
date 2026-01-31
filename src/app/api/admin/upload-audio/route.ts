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
  console.log('=== UPLOAD AUDIO API CALLED ===');
  
  try {
    // Проверка токена
    if (!GITHUB_TOKEN) {
      console.error('❌ GITHUB_TOKEN is not set!');
      return NextResponse.json(
        { error: 'GitHub token not configured. Add GITHUB_TOKEN to environment variables.' },
        { status: 500 }
      );
    }
    
    console.log('✅ GITHUB_TOKEN exists, length:', GITHUB_TOKEN.length);
    console.log('✅ Token prefix:', GITHUB_TOKEN.substring(0, 10) + '...');

    const body: UploadRequest = await request.json();
    const { lessonNumber, slideNumber, audioBase64 } = body;

    console.log(`📁 Uploading: lesson${lessonNumber}/slide${slideNumber}.mp3`);
    console.log(`📊 Audio base64 length: ${audioBase64?.length || 0}`);

    if (!lessonNumber || !slideNumber || !audioBase64) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'lessonNumber, slideNumber, and audioBase64 are required' },
        { status: 400 }
      );
    }

    const filePath = `public/audio/lesson${lessonNumber}/slide${slideNumber}.mp3`;
    console.log(`📂 File path: ${filePath}`);
    
    // Проверяем существует ли файл (чтобы получить SHA для обновления)
    let existingSha: string | null = null;
    try {
      const checkUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
      console.log(`🔍 Checking existing file: ${checkUrl}`);
      
      const checkResponse = await fetch(checkUrl, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      console.log(`🔍 Check response status: ${checkResponse.status}`);
      
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        existingSha = data.sha;
        console.log(`✅ File exists, SHA: ${existingSha}`);
      } else {
        console.log(`📄 File does not exist yet (status: ${checkResponse.status})`);
      }
    } catch (e) {
      console.log(`📄 File check error (probably doesn't exist):`, e);
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

    const uploadUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
    console.log(`📤 Uploading to: ${uploadUrl}`);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadBody),
    });

    console.log(`📤 Upload response status: ${uploadResponse.status}`);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`❌ GitHub API error: ${uploadResponse.status} - ${errorText}`);
      throw new Error(`GitHub API error: ${uploadResponse.status} - ${errorText}`);
    }

    const result = await uploadResponse.json();
    console.log(`✅ Upload successful! File SHA: ${result.content?.sha}`);

    return NextResponse.json({
      success: true,
      path: filePath,
      sha: result.content.sha,
      url: result.content.html_url,
    });
  } catch (error) {
    console.error('❌ Error uploading audio:', error);
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
