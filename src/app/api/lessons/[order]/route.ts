import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getLegacyLessonContent } from '@/lib/legacy-lesson-content';
import { getFreeLessons } from '@/lib/free-lessons';

export const dynamic = 'force-dynamic';
const MAX_PUBLIC_LESSON_ORDER = 21;

// Статический конфиг количества слайдов (из /public/data/slides-config.json)
const SLIDES_CONFIG: Record<number, number> = {
  1: 20,
  2: 11,
  3: 11,
  4: 11,
  5: 21,
  6: 12,
  7: 26,
  8: 23,
  9: 6,
  10: 7,
  11: 6,
  12: 6,
  13: 8,
  14: 6,
  15: 6,
  16: 19,
  17: 32,
  18: 27,
  19: 31,
  20: 10,
  21: 18
};

// GET /api/lessons/[order] - получить урок по номеру
export async function GET(
  request: Request,
  { params }: { params: { order: string } }
) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      console.error('getServerSession error (non-fatal):', e);
    }
    const devBypassAuth = process.env.DEV_BYPASS_AUTH === '1';
    
    // Проверяем, является ли пользователь администратором
    const isAdmin = session?.user?.role === 'ADMIN' || devBypassAuth;
    
    const orderNum = parseInt(params.order);
    
    if (isNaN(orderNum)) {
      return NextResponse.json(
        { error: 'Invalid lesson number' },
        { status: 400 }
      );
    }

    if (orderNum < 1 || orderNum > MAX_PUBLIC_LESSON_ORDER) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    const FREE_LESSONS = await getFreeLessons();
    const isFreeLesson = FREE_LESSONS.includes(orderNum);
    
    // Если пользователь не авторизован и урок не бесплатный, возвращаем ошибку
    if (!session && !devBypassAuth && !isFreeLesson) {
      return NextResponse.json(
        { error: 'Access denied. Please log in to access lessons.' },
        { status: 401 }
      );
    }
    
    // Если пользователь админ или урок бесплатный, пропускаем проверку покупки
    if (!isAdmin && !isFreeLesson) {
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

    // Check if lesson is available (admins bypass this check)
    if (!isAdmin && lesson && !lesson.available) {
      return NextResponse.json(
        { error: 'This lesson is not yet available.' },
        { status: 403 }
      );
    }

    // All lessons now served from DB. Legacy fallback only if DB has no data.
    const shouldForceLegacy = false;

    // If DB lesson is missing or does not contain usable slide/content data, use legacy fallback.
    const hasValidDbSlides = Array.isArray(lesson?.slides) && lesson!.slides.length > 0;
    const hasValidDbContent = Boolean(lesson?.content && lesson.content.trim().length > 0);

    let lessonWithSlides = lesson
      ? {
          ...lesson,
          slides: lesson.slides,
        }
      : null;

    if ((!lessonWithSlides || shouldForceLegacy) && legacyLesson) {
      lessonWithSlides = {
        id: lesson?.id || `legacy-${orderNum}`,
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

    // Use audioUrl from DB slides as-is (set by admin editor or SQL migration).
    // Only fill in missing audioUrl with stable lesson-id based paths.
    if (lessonWithSlides && Array.isArray(lessonWithSlides.slides)) {
      const cacheBust = Date.now();

      lessonWithSlides.slides = lessonWithSlides.slides.map((slide: any, index: number) => {
        const safeSlide = slide && typeof slide === 'object' ? slide : {};
        // If slide already has audioUrl from DB, keep it
        if (safeSlide.audioUrl && typeof safeSlide.audioUrl === 'string' && safeSlide.audioUrl.trim()) {
          return safeSlide;
        }
        // Otherwise use stable lesson-id path
        const stableAudioUrl =
          lesson?.id
            ? `/audio/lesson-${lesson.id}/slide${index + 1}.mp3?v=${cacheBust}`
            : `/audio/lesson${orderNum}/slide${index + 1}.mp3?v=${cacheBust}`;
        return {
          ...safeSlide,
          audioUrl: stableAudioUrl,
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
      where: { published: true, order: { lte: MAX_PUBLIC_LESSON_ORDER } },
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
