import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'davud-max/English-Leeson';
const GITHUB_BRANCH = 'main';

// GET /api/admin/lessons - получить список всех уроков
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        order: true,
        title: true,
        description: true,
        content: true,
        duration: true,
        published: true,
        emoji: true,
        color: true,
        available: true,
        slides: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Форматируем с дефолтными значениями
    const formattedLessons = lessons.map(lesson => ({
      id: lesson.id,
      order: lesson.order,
      title: lesson.title || '',
      description: lesson.description || '',
      content: lesson.content || '',
      duration: lesson.duration || 25,
      published: lesson.published ?? true,
      emoji: lesson.emoji || '📖',
      color: lesson.color || 'from-blue-500 to-indigo-600',
      available: lesson.available ?? true,
      slides: lesson.slides,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    }));

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST /api/admin/lessons - создать новый урок
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Получаем или создаём курс
    let course = await prisma.course.findFirst();
    if (!course) {
      course = await prisma.course.create({
        data: {
          title: 'Algorithms of Thinking and Cognition',
          description: 'A comprehensive course on thinking and cognition',
          price: 30,
          currency: 'USD',
          published: true,
        },
      });
    }
    
    const maxOrder = await prisma.lesson.aggregate({
      where: { courseId: course.id },
      _max: { order: true },
    });
    const maxValue = maxOrder._max.order || 0;
    const requestedOrder = Number(body.order) || maxValue + 1;
    const normalizedOrder = Math.max(1, Math.min(requestedOrder, maxValue + 1));

    // Keep order-based audio folders aligned when inserting inside the sequence.
    // If inserting at the end there is nothing to shift.
    const shouldShiftAudio = normalizedOrder <= maxValue;
    if (shouldShiftAudio) {
      await shiftOrderBasedFoldersForInsert(normalizedOrder, maxValue);
    }

    const lesson = await prisma.$transaction(async (tx) => {
      // Shift lessons down (descending) to avoid unique(order) collisions.
      const lessonsToShift = await tx.lesson.findMany({
        where: {
          courseId: course.id,
          order: { gte: normalizedOrder },
        },
        select: { id: true, order: true },
        orderBy: { order: 'desc' },
      });

      for (const item of lessonsToShift) {
        await tx.lesson.update({
          where: { id: item.id },
          data: { order: item.order + 1 },
        });
      }

      return tx.lesson.create({
        data: {
          courseId: course.id,
          order: normalizedOrder,
          title: body.title || `New Lesson ${normalizedOrder}`,
          description: body.description || '',
          content: body.content || '',
          duration: body.duration || 25,
          published: body.published ?? true,
          emoji: body.emoji || '📖',
          color: body.color || 'from-blue-500 to-indigo-600',
          available: body.available ?? true,
          slides: body.slides || null,
        },
      });
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}

type RepoEntry = {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha?: string;
};

async function shiftOrderBasedFoldersForInsert(startOrder: number, maxOrder: number) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required to shift audio folders on insert');
  }

  // Move from the end to avoid overwrite collisions (lesson10 -> lesson11, etc).
  for (let order = maxOrder; order >= startOrder; order--) {
    await moveFolderFiles(`public/audio/lesson${order}`, `public/audio/lesson${order + 1}`, `Shift audio lesson${order} -> lesson${order + 1}`);
    await moveFolderFiles(`public/audio/questions/lesson${order}`, `public/audio/questions/lesson${order + 1}`, `Shift question audio lesson${order} -> lesson${order + 1}`);
  }
}

async function moveFolderFiles(fromFolder: string, toFolder: string, message: string) {
  const files = await listFolderFiles(fromFolder);
  if (!files.length) return;

  for (const file of files) {
    const targetPath = `${toFolder}/${file.name}`;
    const sourcePath = `${fromFolder}/${file.name}`;
    const contentBase64 = await readFileBase64(sourcePath);
    if (!contentBase64) continue;

    await upsertFileBase64(targetPath, contentBase64, `${message}: ${file.name}`);
    await deleteFile(sourcePath, file.sha, `${message}: remove ${file.name}`);
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
}

async function listFolderFiles(folderPath: string): Promise<RepoEntry[]> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${folderPath}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.filter((entry) => entry.type === 'file').map((entry) => ({
    name: entry.name,
    path: entry.path,
    type: entry.type,
    sha: entry.sha,
  }));
}

async function readFileBase64(filePath: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return typeof data.content === 'string' ? data.content.replace(/\n/g, '') : null;
}

async function upsertFileBase64(filePath: string, contentBase64: string, message: string) {
  let existingSha: string | undefined;
  const existing = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (existing.ok) {
    const data = await existing.json();
    existingSha = data.sha;
  }

  const body: Record<string, string> = {
    message,
    content: contentBase64,
    branch: GITHUB_BRANCH,
  };
  if (existingSha) body.sha = existingSha;

  const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const txt = await putRes.text();
    throw new Error(`GitHub upsert failed for ${filePath}: ${putRes.status} ${txt}`);
  }
}

async function deleteFile(filePath: string, sha: string | undefined, message: string) {
  let resolvedSha = sha;
  if (!resolvedSha) {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    if (!res.ok) return;
    const data = await res.json();
    resolvedSha = data.sha;
  }
  if (!resolvedSha) return;

  const delRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sha: resolvedSha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!delRes.ok) {
    const txt = await delRes.text();
    throw new Error(`GitHub delete failed for ${filePath}: ${delRes.status} ${txt}`);
  }
}
