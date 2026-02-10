import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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

    // Проверяем авторизацию
    const session = await getServerSession(authOptions);
    
    // Получаем урок
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

    // Проверяем есть ли доступ к курсу
    let hasAccess = false;
    
    if (session?.user?.id) {
      // Проверяем enrollment или покупку
      const enrollment = await prisma.enrollment.findFirst({
        where: { userId: session.user.id },
      });
      
      const purchase = await prisma.purchase.findFirst({
        where: { 
          userId: session.user.id,
          status: 'COMPLETED',
        },
      });
      
      hasAccess = !!(enrollment || purchase);
    }

    // Если нет доступа - возвращаем только превью
    if (!hasAccess) {
      return NextResponse.json({
        success: true,
        hasAccess: false,
        lesson: {
          id: lesson.id,
          order: lesson.order,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          emoji: lesson.emoji,
          color: lesson.color,
          // НЕ отдаём content и slides
          content: null,
          slides: null,
        },
        navigation: null,
      });
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
      hasAccess: true,
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
