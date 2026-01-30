import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/lessons - получить список всех уроков
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        number: true,
        title: true,
      },
      orderBy: {
        number: 'asc',
      },
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
