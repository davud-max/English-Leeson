import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'davud-max/English-Leeson';
const GITHUB_BRANCH = 'main';

interface ClearRequest {
  lessonNumber: number;
  adminKey: string;
}

export async function POST(request: Request) {
  try {
    const body: ClearRequest = await request.json();
    const { lessonNumber, adminKey } = body;

    // Verify admin key
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 403 }
      );
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    if (!lessonNumber) {
      return NextResponse.json(
        { error: 'lessonNumber is required' },
        { status: 400 }
      );
    }

    const folderPath = `public/audio/questions/lesson${lessonNumber}`;
    
    // Get list of files in folder
    const listResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${folderPath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!listResponse.ok) {
      if (listResponse.status === 404) {
        return NextResponse.json({
          success: true,
          deleted: 0,
          message: 'Folder does not exist, nothing to delete',
        });
      }
      const errorData = await listResponse.json();
      throw new Error(`GitHub API error: ${errorData.message}`);
    }

    const files = await listResponse.json();
    
    // Filter only .mp3 files
    const mp3Files = Array.isArray(files) 
      ? files.filter((f: { name: string }) => f.name.endsWith('.mp3'))
      : [];

    let deletedCount = 0;
    const errors: string[] = [];

    // Delete each file
    for (const file of mp3Files) {
      try {
        const deleteResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/contents/${file.path}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Delete old question audio: ${file.name}`,
              sha: file.sha,
              branch: GITHUB_BRANCH,
            }),
          }
        );

        if (deleteResponse.ok) {
          deletedCount++;
        } else {
          const errorData = await deleteResponse.json();
          errors.push(`Failed to delete ${file.name}: ${errorData.message}`);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        errors.push(`Error deleting ${file.name}: ${(e as Error).message}`);
      }
    }

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      total: mp3Files.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error clearing question audio:', error);
    return NextResponse.json(
      { error: 'Failed to clear audio: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
