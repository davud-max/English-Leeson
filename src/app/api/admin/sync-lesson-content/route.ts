import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {    
    const lessonsToSync = [21, 22, 23, 24, 25, 26, 27];
    const updates = [];
    
    for (const lessonOrder of lessonsToSync) {
      // Читаем статический файл урока
      const filePath = path.join(process.cwd(), 'src', 'app', '(course)', 'lessons', String(lessonOrder), 'page.tsx');
      
      if (!fs.existsSync(filePath)) {
        updates.push({ order: lessonOrder, status: 'file not found' });
        continue;
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Извлекаем массив слайдов из кода
      const contentMatches = fileContent.matchAll(/content: `([\s\S]*?)`,/g);
      const slides = [];
      let slideId = 1;
      
      for (const match of contentMatches) {
        const content = match[1];
        if (content && content.length > 10) {
          slides.push({
            id: slideId++,
            title: `Part ${slideId - 1}`,
            content: content,
            emoji: '📖',
            duration: 20000
          });
        }
      }
      
      if (slides.length === 0) {
        updates.push({ order: lessonOrder, status: 'no content extracted' });
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
