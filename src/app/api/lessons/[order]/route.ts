import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/lessons/[order] - получить урок по номеру
export async function GET(
  request: Request,
  { params }: { params: { order: string } }
) {
  try {
    const orderNum = parseInt(params.order);
    
    if (isNaN(orderNum)) {
      return NextResponse.json(
        { error: 'Invalid lesson number' },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        order: orderNum,
        published: true,
      },
      select: {
        id: true,
        order: true,
        title: true,
        description: true,
        content: true,
        duration: true,
        emoji: true,
        color: true,
        available: true,
        slides: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Получаем соседние уроки для навигации
    const [prevLesson, nextLesson] = await Promise.all([
      prisma.lesson.findFirst({
        where: { order: orderNum - 1, published: true },
        select: { order: true, title: true },
      }),
      prisma.lesson.findFirst({
        where: { order: orderNum + 1, published: true },
        select: { order: true, title: true },
      }),
    ]);

    // Получаем общее количество уроков
    const totalLessons = await prisma.lesson.count({
      where: { published: true },
    });

    return NextResponse.json({
      success: true,
      lesson,
      navigation: {
        prev: prevLesson,
        next: nextLesson,
        total: totalLessons,
      },
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}
