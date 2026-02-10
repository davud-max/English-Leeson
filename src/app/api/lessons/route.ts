import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/lessons - получить список всех опубликованных уроков
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Проверяем, является ли пользователь администратором
    const isAdmin = session?.user?.role === 'ADMIN';
    
    // Если пользователь не авторизован, возвращаем пустой список
    if (!session) {
      return NextResponse.json({ 
        success: true,
        lessons: [],
        total: 0,
        available: 0,
      });
    }
    
    // Если пользователь админ, показываем все уроки
    if (isAdmin) {
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
    }
    
    // Для обычных пользователей проверяем наличие покупки
    const userHasPurchased = await prisma.purchase.findFirst({
      where: {
        userId: session!.user.id,
        status: 'COMPLETED',
      },
    });
    
    // Если пользователь не приобрел курс, возвращаем пустой список
    if (!userHasPurchased) {
      return NextResponse.json({ 
        success: true,
        lessons: [],
        total: 0,
        available: 0,
      });
    }
    
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
