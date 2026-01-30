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
        number: true,
        title: true,
        content: true,
        audioText: true, // Поле для текста озвучки (если есть)
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}
