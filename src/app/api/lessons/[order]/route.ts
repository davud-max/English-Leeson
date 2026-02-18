import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getLegacyLessonContent } from '@/lib/legacy-lesson-content';

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
    const devBypassAuth = process.env.DEV_BYPASS_AUTH === '1';
    
    // Проверяем, является ли пользователь администратором
    const isAdmin = session?.user?.role === 'ADMIN' || devBypassAuth;
    
    // Если пользователь не авторизован, возвращаем ошибку
    if (!session && !devBypassAuth) {
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

    const legacyLesson = getLegacyLessonContent(orderNum);

    if (!lesson && !legacyLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // If DB lesson is missing or does not contain usable slide/content data, use legacy fallback.
    const hasValidDbSlides = Array.isArray(lesson?.slides) && lesson!.slides.length > 0;
    const hasValidDbContent = Boolean(lesson?.content && lesson.content.trim().length > 0);

    let lessonWithSlides = lesson
      ? {
          ...lesson,
          slides: lesson.slides,
        }
      : null;

    if (!lessonWithSlides && legacyLesson) {
      lessonWithSlides = {
        id: `legacy-${orderNum}`,
        order: legacyLesson.order,
        title: legacyLesson.title,
        description: legacyLesson.slides[0]?.content.slice(0, 160) || `Lesson ${orderNum}`,
        content: legacyLesson.slides.map(slide => slide.content).join('\n\n---\n\n'),
        duration: Math.max(1, Math.round(legacyLesson.slides.reduce((sum, s) => sum + s.duration, 0) / 60000)),
        emoji: legacyLesson.slides[0]?.emoji || '📖',
        color: 'from-amber-600 to-stone-700',
        available: true,
        slides: legacyLesson.slides,
      };
    } else if (lessonWithSlides) {
      if (!hasValidDbSlides && legacyLesson) {
        lessonWithSlides.slides = legacyLesson.slides;
      } else if (!hasValidDbSlides) {
        const slideCount = SLIDES_CONFIG[orderNum] || 1;
        lessonWithSlides.slides = Array.from({ length: slideCount }, (_, index) => ({
          id: index + 1,
          title: `Part ${index + 1}`,
          content: lessonWithSlides?.content || `Content for part ${index + 1}`,
          emoji: lessonWithSlides?.emoji || '📖',
          duration: 30000
        }));
      }

      if (!hasValidDbContent && legacyLesson) {
        lessonWithSlides.content = legacyLesson.slides.map(slide => slide.content).join('\n\n---\n\n');
      }
    }

    // Force a stable audio mapping: use lesson-id folders for DB lessons.
    // Keep order-based fallback only for legacy lessons that don't have DB ids.
    if (lessonWithSlides?.id && Array.isArray(lessonWithSlides.slides)) {
      const isLegacyLesson = String(lessonWithSlides.id).startsWith('legacy-');
      lessonWithSlides.slides = lessonWithSlides.slides.map((slide: any, index: number) => {
        const safeSlide = slide && typeof slide === 'object' ? slide : {};
        const fallbackOrderUrl = `/audio/lesson${orderNum}/slide${index + 1}.mp3`;

        return {
          ...safeSlide,
          audioUrl: isLegacyLesson
            ? (typeof safeSlide.audioUrl === 'string' && safeSlide.audioUrl.length > 0
                ? safeSlide.audioUrl
                : fallbackOrderUrl)
            : `https://raw.githubusercontent.com/davud-max/English-Leeson/main/public/audio/lesson-${lessonWithSlides!.id}/slide${index + 1}.mp3`,
        };
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
