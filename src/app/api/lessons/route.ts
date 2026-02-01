import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/lessons - получить список всех опубликованных уроков
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        order: true,
        title: true,
        description: true,
        duration: true,
        emoji: true,
        color: true,
        available: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ 
      success: true,
      lessons,
      total: lessons.length,
      available: lessons.filter(l => l.available).length,
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
