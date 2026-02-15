import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'davud-max/English-Leeson';
const GITHUB_BRANCH = 'main';

// GET /api/admin/lessons/[id] - получить урок по ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/lessons/[id] - обновить урок
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const currentLesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      select: { id: true, courseId: true, order: true },
    });

    if (!currentLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.emoji !== undefined) updateData.emoji = body.emoji;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.available !== undefined) updateData.available = body.available;
    if (body.slides !== undefined) updateData.slides = body.slides;

    let lesson;
    const requestedOrder =
      body.order !== undefined && body.order !== null ? Number(body.order) : currentLesson.order;
    const hasOrderChange = Number.isFinite(requestedOrder) && requestedOrder !== currentLesson.order;

    if (hasOrderChange) {
      const maxOrder = await prisma.lesson.aggregate({
        where: { courseId: currentLesson.courseId },
        _max: { order: true },
      });
      const targetOrder = Math.max(1, Math.min(requestedOrder, maxOrder._max.order || currentLesson.order));

      // Preserve audio mapping by copying legacy order-based audio into stable id-based folders
      // for all lessons that will be shifted.
      const rangeFilter =
        targetOrder > currentLesson.order
          ? { gt: currentLesson.order, lte: targetOrder }
          : { gte: targetOrder, lt: currentLesson.order };

      const affectedNeighbors =
        targetOrder === currentLesson.order
          ? []
          : await prisma.lesson.findMany({
              where: {
                courseId: currentLesson.courseId,
                order: rangeFilter,
              },
              select: { id: true, order: true },
            });

      await ensureStableAudioForLessons([
        { id: currentLesson.id, order: currentLesson.order },
        ...affectedNeighbors,
      ]);

      lesson = await prisma.$transaction(async (tx) => {
        // Free current slot.
        await tx.lesson.update({
          where: { id: currentLesson.id },
          data: { order: 0 },
        });

        if (targetOrder > currentLesson.order) {
          const toShiftDown = await tx.lesson.findMany({
            where: {
              courseId: currentLesson.courseId,
              order: { gt: currentLesson.order, lte: targetOrder },
            },
            select: { id: true, order: true },
            orderBy: { order: 'asc' },
          });
          for (const item of toShiftDown) {
            await tx.lesson.update({
              where: { id: item.id },
              data: { order: item.order - 1 },
            });
          }
        } else if (targetOrder < currentLesson.order) {
          const toShiftUp = await tx.lesson.findMany({
            where: {
              courseId: currentLesson.courseId,
              order: { gte: targetOrder, lt: currentLesson.order },
            },
            select: { id: true, order: true },
            orderBy: { order: 'desc' },
          });
          for (const item of toShiftUp) {
            await tx.lesson.update({
              where: { id: item.id },
              data: { order: item.order + 1 },
            });
          }
        }

        return tx.lesson.update({
          where: { id: currentLesson.id },
          data: {
            ...updateData,
            order: targetOrder,
          },
        });
      });
    } else {
      lesson = await prisma.lesson.update({
        where: { id: params.id },
        data: updateData,
      });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

type LessonRef = { id: string; order: number };

async function ensureStableAudioForLessons(lessons: LessonRef[]) {
  if (!lessons.length) return;
  if (!GITHUB_TOKEN) return;

  for (const lesson of lessons) {
    const stableFolder = `lesson-${lesson.id}`;
    const legacyFolder = `lesson${lesson.order}`;

    const stableFiles = await listFolderEntries(stableFolder);
    if (stableFiles.length > 0) continue;

    const legacyFiles = await listFolderEntries(legacyFolder);
    const slideFiles = legacyFiles.filter((f) => f.type === 'file' && /^slide\d+\.mp3$/.test(f.name));
    if (!slideFiles.length) continue;

    for (const file of slideFiles) {
      const sourcePath = `public/audio/${legacyFolder}/${file.name}`;
      const targetPath = `public/audio/${stableFolder}/${file.name}`;
      const contentBase64 = await readFileBase64(sourcePath);
      if (!contentBase64) continue;
      await uploadBase64(targetPath, contentBase64, `Migrate stable audio for lesson ${lesson.id}`);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  }
}

async function listFolderEntries(folder: string): Promise<Array<{ name: string; type: string }>> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/public/audio/${folder}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function readFileBase64(path: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
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

async function uploadBase64(path: string, contentBase64: string, message: string) {
  let existingSha: string | undefined;
  const existing = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
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

  const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
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
    throw new Error(`Audio migration upload failed: ${putRes.status} ${txt}`);
  }
}

// DELETE /api/admin/lessons/[id] - удалить урок
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lesson.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}
