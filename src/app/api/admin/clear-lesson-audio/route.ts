import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'davud-max/English-Leeson';
const GITHUB_BRANCH = 'main';

interface ClearRequest {
  lessonNumber: number;
  lessonId?: string;
}

export async function POST(request: Request) {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured. Add GITHUB_TOKEN to environment variables.' },
        { status: 500 }
      );
    }

    const body: ClearRequest = await request.json();
    const { lessonNumber, lessonId } = body;

    if (!lessonNumber) {
      return NextResponse.json(
        { error: 'lessonNumber is required' },
        { status: 400 }
      );
    }

    let deletedCount = 0;
    const errors: string[] = [];
    const folders = [`lesson${lessonNumber}`];
    if (lessonId && lessonId.trim()) {
      folders.push(`lesson-${lessonId.trim()}`);
    }

    for (const folder of folders) {
      const folderPath = `public/audio/${folder}`;
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
        if (listResponse.status === 404) continue;
        const errorData = await listResponse.json().catch(() => ({ message: `HTTP ${listResponse.status}` }));
        errors.push(`Failed to list ${folder}: ${errorData.message}`);
        continue;
      }

      const files = await listResponse.json();
      const mp3Files = Array.isArray(files)
        ? files.filter((f: { name: string }) => f.name.endsWith('.mp3'))
        : [];

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
                message: `Delete old audio: ${file.name}`,
                sha: file.sha,
                branch: GITHUB_BRANCH,
              }),
            }
          );

          if (deleteResponse.ok) {
            deletedCount++;
          } else {
            const errorData = await deleteResponse.json().catch(() => ({ message: `HTTP ${deleteResponse.status}` }));
            errors.push(`Failed to delete ${file.name}: ${errorData.message}`);
          }

          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (e) {
          errors.push(`Error deleting ${file.name}: ${(e as Error).message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      folders,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error clearing lesson audio:', error);
    return NextResponse.json(
      { error: 'Failed to clear audio: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
