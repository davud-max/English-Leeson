import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/lessons - получить список всех опубликованных уроков
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const devBypassAuth = process.env.DEV_BYPASS_AUTH === '1';
    
    // Проверяем, является ли пользователь администратором
    const isAdmin = session?.user?.role === 'ADMIN' || devBypassAuth;
    
    // Если пользователь не авторизован, показываем список с меткой locked (кроме бесплатных)
    const FREE_LESSONS = [1];
    
    if (!session && !devBypassAuth) {
      const lessons = await prisma.lesson.findMany({
        where: { published: true },
        select: {
          id: true, order: true, title: true, description: true,
          duration: true, emoji: true, color: true, available: true,
        },
        orderBy: { order: 'asc' },
      });
      
      return NextResponse.json({ 
        success: true,
        lessons: lessons.map(l => ({ ...l, locked: !FREE_LESSONS.includes(l.order) })),
        total: lessons.length,
        available: lessons.filter(l => l.available).length,
        hasPurchased: false,
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
    
    // Если пользователь не приобрел курс, показываем все уроки с меткой locked кроме бесплатных
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

    const FREE_LESSONS = [1]; // Lesson 1 is free
    
    const lessonsWithAccess = lessons.map(lesson => ({
      ...lesson,
      locked: !userHasPurchased && !FREE_LESSONS.includes(lesson.order),
    }));

    return NextResponse.json({ 
      success: true,
      lessons: lessonsWithAccess,
      total: lessons.length,
      available: lessons.filter(l => l.available).length,
      hasPurchased: !!userHasPurchased,
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
