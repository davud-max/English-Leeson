import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type RestorableLesson = {
  id: string;
  courseId: string;
  order: number;
  title: string;
  description: string;
  content: string;
  duration: number;
  published: boolean;
  emoji?: string;
  color?: string;
  available?: boolean;
  slides?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lesson: RestorableLesson | null = body?.lesson ?? null;

    if (!lesson || !lesson.id || !lesson.courseId || !Number.isFinite(Number(lesson.order))) {
      return NextResponse.json({ error: 'Invalid lesson payload' }, { status: 400 });
    }

    const restoreOrder = Math.max(1, Number(lesson.order));

    const existingById = await prisma.lesson.findUnique({
      where: { id: lesson.id },
      select: { id: true },
    });

    if (existingById) {
      return NextResponse.json({ error: 'Lesson already exists' }, { status: 409 });
    }

    const restored = await prisma.$transaction(async (tx) => {
      const lessonsToShift = await tx.lesson.findMany({
        where: {
          courseId: lesson.courseId,
          order: { gte: restoreOrder },
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
          id: lesson.id,
          courseId: lesson.courseId,
          order: restoreOrder,
          title: lesson.title || `Restored lesson ${restoreOrder}`,
          description: lesson.description || '',
          content: lesson.content || '',
          duration: Number(lesson.duration) || 25,
          published: lesson.published ?? true,
          emoji: lesson.emoji || '📖',
          color: lesson.color || 'from-blue-500 to-indigo-600',
          available: lesson.available ?? true,
          slides:
            lesson.slides === undefined
              ? undefined
              : lesson.slides === null
                ? Prisma.JsonNull
                : (lesson.slides as Prisma.InputJsonValue),
        },
      });
    });

    return NextResponse.json({ success: true, lesson: restored });
  } catch (error) {
    console.error('Error restoring lesson:', error);
    return NextResponse.json({ error: 'Failed to restore lesson' }, { status: 500 });
  }
}
