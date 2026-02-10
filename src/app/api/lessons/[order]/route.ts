import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Статический конфиг количества слайдов (из /public/data/slides-config.json)
const SLIDES_CONFIG: Record<number, number> = {
  1: 1,
  2: 11,
  3: 14,
  4: 14,
  5: 13,
  6: 12,
  7: 9,
  8: 12,
  9: 6,
  10: 7,
  11: 6,
  12: 6,
  13: 8,
  14: 10,
  15: 43,
  21: 19,
  22: 26,
  23: 19,
  24: 15,
  25: 26,
  26: 23,
  27: 25
};

// GET /api/lessons/[order] - получить урок по номеру
export async function GET(
  request: Request,
  { params }: { params: { order: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Проверяем, является ли пользователь администратором
    const isAdmin = session?.user?.role === 'ADMIN';
    
    // Если пользователь не авторизован, возвращаем ошибку
    if (!session) {
      return NextResponse.json(
        { error: 'Access denied. Please log in to access lessons.' },
        { status: 401 }
      );
    }
    
    const orderNum = parseInt(params.order);
    
    if (isNaN(orderNum)) {
      return NextResponse.json(
        { error: 'Invalid lesson number' },
        { status: 400 }
      );
    }
    
    // Если пользователь админ, пропускаем проверку покупки
    if (!isAdmin) {
      // Для обычных пользователей проверяем наличие покупки
      const userHasPurchased = await prisma.purchase.findFirst({
        where: {
          userId: session!.user.id,
          status: 'COMPLETED',
        },
      });
      
      // Если пользователь не приобрел курс, возвращаем ошибку
      if (!userHasPurchased) {
        return NextResponse.json(
          { error: 'Access denied. Please purchase the course to access lessons.' },
          { status: 403 }
        );
      }
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

    // Если слайды не заполнены в базе - создаём на основе конфига
    let slides = lesson.slides;
    
    if (!slides || (Array.isArray(slides) && slides.length === 0)) {
      const slideCount = SLIDES_CONFIG[orderNum] || 1;
      
      slides = Array.from({ length: slideCount }, (_, index) => ({
        id: index + 1,
        title: `Part ${index + 1}`,
        content: lesson.content || `Content for part ${index + 1}`,
        emoji: lesson.emoji || '📖',
        duration: 30000
      }));
    }

    // Добавляем слайды к уроку
    const lessonWithSlides = {
      ...lesson,
      slides
    };

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
      lesson: lessonWithSlides,
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
