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
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Преобразуем order в number для совместимости с фронтендом
    const formattedLessons = lessons.map(lesson => ({
      id: lesson.id,
      number: lesson.order,
      title: lesson.title,
    }));

    return NextResponse.json({ lessons: formattedLessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
