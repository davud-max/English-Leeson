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
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Форматируем с дефолтными значениями для совместимости
    const formattedLessons = lessons.map(lesson => ({
      id: lesson.id,
      order: lesson.order,
      title: lesson.title || '',
      description: lesson.description || '',
      content: lesson.content || '',
      duration: lesson.duration || 25,
      published: lesson.published ?? false,
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
    
    const lesson = await prisma.lesson.create({
      data: {
        order: body.order,
        title: body.title,
        description: body.description || '',
        content: body.content || '',
        duration: body.duration || 25,
        published: body.published || false,
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
