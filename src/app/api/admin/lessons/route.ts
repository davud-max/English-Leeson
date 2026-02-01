import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        order: body.order,
        title: body.title,
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

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
