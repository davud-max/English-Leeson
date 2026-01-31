import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/lessons/[id] - получить детали урока
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        order: true,
        title: true,
        content: true,
        description: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Преобразуем для совместимости с фронтендом
    // Используем content как audioText (текст для озвучки)
    return NextResponse.json({ 
      lesson: {
        id: lesson.id,
        number: lesson.order,
        title: lesson.title,
        content: lesson.content,
        audioText: lesson.content, // Используем content как текст для озвучки
      }
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}
