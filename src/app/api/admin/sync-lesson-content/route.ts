import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        order: {
          gte: 21,
          lte: 27
        }
      },
      select: {
        id: true,
        order: true,
        title: true,
        slides: true
      }
    });

    const updates = [];
    
    for (const lesson of lessons) {
      if (lesson.slides && Array.isArray(lesson.slides) && lesson.slides.length > 0) {
        // Объединяем контент всех слайдов
        const fullContent = lesson.slides
          .map((slide: any) => slide.content)
          .filter(Boolean)
          .join('\n\n---\n\n');
        
        if (fullContent) {
          await prisma.lesson.update({
            where: { id: lesson.id },
            data: { content: fullContent }
          });
          
          updates.push({
            order: lesson.order,
            title: lesson.title,
            contentLength: fullContent.length
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated content for ${updates.length} lessons`,
      updates
    });
  } catch (error) {
    console.error('Error syncing content:', error);
    return NextResponse.json(
      { error: 'Failed to sync content' },
      { status: 500 }
    );
  }
}
