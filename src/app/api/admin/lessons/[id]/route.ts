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
      select: { id: true, courseId: true, order: true, slides: true },
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
    const currentSlides = Array.isArray(currentLesson.slides) ? (currentLesson.slides as any[]) : [];
    let firstAudioInvalidateIndex: number | null = null;
    if (body.slides !== undefined && Array.isArray(body.slides)) {
      const normalizedSlides = normalizeSlidesForStorage(body.slides);
      updateData.slides = normalizedSlides;
      firstAudioInvalidateIndex = findFirstChangedSlideIndex(currentSlides, normalizedSlides);
    }

    let lesson;
    const requestedOrder =
      body.order !== undefined && body.order !== null ? Number(body.order) : currentLesson.order;
    const hasOrderChange = Number.isFinite(requestedOrder) && requestedOrder !== currentLesson.order;

    if (hasOrderChange) {
      // Audio URLs are absolute and stored per-slide. No rewriting needed on reorder.
      // Each slide keeps its own audioUrl regardless of order changes.

      const maxOrder = await prisma.lesson.aggregate({
        where: { courseId: currentLesson.courseId },
        _max: { order: true },
      });
      const targetOrder = Math.max(1, Math.min(requestedOrder, maxOrder._max.order || currentLesson.order));

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

        const updatedLesson = await tx.lesson.update({
          where: { id: currentLesson.id },
          data: {
            ...updateData,
            order: targetOrder,
          },
        });
        
        // Save to history if LessonHistory model exists
        // NOTE: Uncomment after applying database migration
        /*
        try {
          await tx.lessonHistory.create({
            data: {
              lessonId: currentLesson.id,
              title: updatedLesson.title,
              description: updatedLesson.description,
              content: updatedLesson.content,
              slides: updatedLesson.slides as any, // Type assertion to handle JSON type
              duration: updatedLesson.duration,
              published: updatedLesson.published,
              emoji: updatedLesson.emoji,
              color: updatedLesson.color,
              available: updatedLesson.available,
              // changedById: userId // в реальном приложении нужно добавить ID пользователя
            }
          });
        } catch (historyError) {
          console.warn('Could not save to lesson history:', (historyError as Error).message);
          // Continue anyway, as the main update was successful
        }
        */
        
        return updatedLesson;
      });
    } else {
      lesson = await prisma.$transaction(async (tx) => {
        const updatedLesson = await tx.lesson.update({
          where: { id: params.id },
          data: updateData,
        });
        
        // Save to history if LessonHistory model exists
        // NOTE: Uncomment after applying database migration
        /*
        try {
          await tx.lessonHistory.create({
            data: {
              lessonId: params.id,
              title: updatedLesson.title,
              description: updatedLesson.description,
              content: updatedLesson.content,
              slides: updatedLesson.slides as any, // Type assertion to handle JSON type
              duration: updatedLesson.duration,
              published: updatedLesson.published,
              emoji: updatedLesson.emoji,
              color: updatedLesson.color,
              available: updatedLesson.available,
              // changedById: userId // в реальном приложении нужно добавить ID пользователя
            }
          });
        } catch (historyError) {
          console.warn('Could not save to lesson history:', (historyError as Error).message);
          // Continue anyway, as the main update was successful
        }
        */
        
        return updatedLesson;
      });
    }

    if (firstAudioInvalidateIndex !== null && firstAudioInvalidateIndex >= 0) {
      try {
        await deleteStableAudioFromIndex(currentLesson.id, firstAudioInvalidateIndex + 1);
      } catch (e) {
        console.warn('Failed to invalidate stale lesson audio:', (e as Error).message);
      }
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

function normalizeSlidesForStorage(slides: any[]): any[] {
  return slides.map((raw, index) => {
    const base = raw && typeof raw === 'object' ? raw : {};
    return {
      ...base,
      id: index + 1,
      title: typeof base.title === 'string' ? base.title : `Part ${index + 1}`,
      content: typeof base.content === 'string' ? base.content : '',
      emoji: typeof base.emoji === 'string' ? base.emoji : '📖',
      duration: typeof base.duration === 'number' ? base.duration : 30000,
      audioUrl: typeof base.audioUrl === 'string' && base.audioUrl.trim().length > 0 ? base.audioUrl.trim() : undefined,
    };
  });
}

function normalizedContent(slide: any): string {
  const text = slide && typeof slide.content === 'string' ? slide.content : '';
  return text.replace(/\s+/g, ' ').trim();
}

function findFirstChangedSlideIndex(currentSlides: any[], nextSlides: any[]): number | null {
  const maxLen = Math.max(currentSlides.length, nextSlides.length);
  for (let i = 0; i < maxLen; i++) {
    const cur = currentSlides[i];
    const nxt = nextSlides[i];
    if (!cur || !nxt) return i;
    if (normalizedContent(cur) !== normalizedContent(nxt)) return i;
  }
  return null;
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

async function deleteStableAudioFromIndex(lessonId: string, fromSlideNumber: number) {
  if (!GITHUB_TOKEN) return;
  const folder = `lesson-${lessonId}`;
  const entries = await listFolderEntries(folder);
  const deletable = entries.filter((entry) => {
    if (entry.type !== 'file') return false;
    const match = entry.name.match(/^slide(\d+)\.mp3$/);
    if (!match) return false;
    return Number(match[1]) >= fromSlideNumber;
  });

  for (const file of deletable) {
    await deleteFileByPath(`public/audio/${folder}/${file.name}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function deleteFileByPath(path: string) {
  const existing = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (!existing.ok) return;

  const data = await existing.json();
  const sha = data?.sha;
  if (!sha) return;

  const del = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Invalidate stale audio ${path}`,
      sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!del.ok) {
    const txt = await del.text();
    throw new Error(`Failed to delete ${path}: ${del.status} ${txt}`);
  }
}

// DELETE /api/admin/lessons/[id] - удалить урок
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      select: { id: true, courseId: true, order: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Delete dependent records first (outside transaction for safety)
    await prisma.progress.deleteMany({
      where: { lessonId: params.id },
    });

    try {
      await prisma.lessonHistory.deleteMany({
        where: { lessonId: params.id },
      });
    } catch (e) {
      // LessonHistory table may not exist yet
    }

    await prisma.$transaction(async (tx) => {
      await tx.lesson.delete({
        where: { id: params.id },
      });

      // Shift orders one by one (ascending) to avoid unique constraint collision
      const lessonsToShift = await tx.lesson.findMany({
        where: {
          courseId: lesson.courseId,
          order: { gt: lesson.order },
        },
        select: { id: true, order: true },
        orderBy: { order: 'asc' },
      });

      for (const item of lessonsToShift) {
        await tx.lesson.update({
          where: { id: item.id },
          data: { order: item.order - 1 },
        });
      }
    });

    return NextResponse.json({ success: true, deletedId: lesson.id, deletedOrder: lesson.order });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Error deleting lesson:', errMsg);
    return NextResponse.json(
      { error: 'Failed to delete lesson', details: errMsg },
      { status: 500 }
    );
  }
}
