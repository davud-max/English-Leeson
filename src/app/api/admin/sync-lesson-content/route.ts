import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {    
    const lessonsToSync = [21, 22, 23, 24, 25, 26, 27];
    const updates = [];
    
    for (const lessonOrder of lessonsToSync) {
      // Получаем слайды из API
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://english-leeson-production.up.railway.app'}/api/lessons/${lessonOrder}`);
      
      if (!response.ok) {
        updates.push({ order: lessonOrder, status: 'API error' });
        continue;
      }
      
      const data = await response.json();
      const slides = data.lesson?.slides;
      
      if (!slides || !Array.isArray(slides) || slides.length === 0) {
        updates.push({ order: lessonOrder, status: 'no slides from API' });
        continue;
      }
      
      // Находим урок в базе
      const lesson = await prisma.lesson.findFirst({
        where: { order: lessonOrder },
        select: { id: true }
      });
      
      if (!lesson) {
        updates.push({ order: lessonOrder, status: 'not found in DB' });
        continue;
      }
      
      // Объединяем контент всех слайдов
      const fullContent = slides
        .map((slide: any) => slide.content)
        .filter(Boolean)
        .join('\n\n---\n\n');
      
      // Сохраняем слайды и контент в базу
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { 
          slides: slides as any,
          content: fullContent 
        }
      });
      
      updates.push({
        order: lessonOrder,
        status: 'updated',
        slidesCount: slides.length,
        contentLength: fullContent.length
      });
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${updates.length} lessons`,
      updates
    });
  } catch (error) {
    console.error('Error syncing content:', error);
    return NextResponse.json(
      { error: 'Failed to sync content', details: String(error) },
      { status: 500 }
    );
  }
}
