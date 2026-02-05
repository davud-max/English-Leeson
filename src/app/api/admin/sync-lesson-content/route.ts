import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Список всех уроков которые существуют в статических файлах
    const allLessons = [9, 10, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27];
    const updates = [];
    
    for (const lessonOrder of allLessons) {
      // Читаем статический файл урока
      const filePath = path.join(process.cwd(), 'src', 'app', '(course)', 'lessons', String(lessonOrder), 'page.tsx');
      
      if (!fs.existsSync(filePath)) {
        updates.push({ order: lessonOrder, status: 'file not found', path: filePath });
        continue;
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Извлекаем массив слайдов из кода - УЛУЧШЕННЫЙ ПАРСИНГ
      const slidesArrayMatch = fileContent.match(/const LESSON_\d+_SLIDES = \[([\s\S]*?)\];/);
      
      if (!slidesArrayMatch) {
        updates.push({ order: lessonOrder, status: 'slides array not found' });
        continue;
      }
      
      // Парсим слайды
      const slidesText = slidesArrayMatch[1];
      const slides = [];
      
      // Ищем все объекты слайдов
      const slideMatches = slidesText.matchAll(/\{[\s\S]*?id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)",[\s\S]*?content:\s*"([\s\S]*?)",[\s\S]*?emoji:\s*"([^"]+)",[\s\S]*?duration:\s*(\d+)[\s\S]*?\}/g);
      
      for (const match of slideMatches) {
        const [, id, title, content, emoji, duration] = match;
        
        if (content && content.length > 10) {
          slides.push({
            id: parseInt(id),
            title: title,
            content: content.replace(/\\n/g, '\n').replace(/\\"/g, '"'), // Убираем экранирование
            emoji: emoji,
            duration: parseInt(duration)
          });
        }
      }
      
      if (slides.length === 0) {
        updates.push({ order: lessonOrder, status: 'no slides parsed' });
        continue;
      }
      
      // Находим урок в базе
      const lesson = await prisma.lesson.findFirst({
        where: { order: lessonOrder },
        select: { id: true, title: true }
      });
      
      if (!lesson) {
        updates.push({ order: lessonOrder, status: 'not found in DB - run /api/admin/sync-lessons first' });
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
        title: lesson.title,
        status: '✅ updated',
        slidesCount: slides.length,
        contentLength: fullContent.length
      });
    }

    const successCount = updates.filter(u => u.status === '✅ updated').length;

    return NextResponse.json({
      success: true,
      message: `✅ Синхронизировано ${successCount} из ${allLessons.length} уроков`,
      totalProcessed: updates.length,
      successCount,
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

// GET - проверка статуса
export async function GET() {
  try {
    const allLessons = [9, 10, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27];
    const status = [];
    
    for (const lessonOrder of allLessons) {
      const lesson = await prisma.lesson.findFirst({
        where: { order: lessonOrder },
        select: { 
          order: true, 
          title: true, 
          slides: true,
          content: true
        }
      });
      
      status.push({
        order: lessonOrder,
        title: lesson?.title || 'Not in DB',
        hasSlidesInDB: !!lesson?.slides,
        slidesCount: lesson?.slides ? (lesson.slides as any[]).length : 0,
        hasContent: !!lesson?.content,
        contentLength: lesson?.content?.length || 0
      });
    }
    
    const synced = status.filter(s => s.hasSlidesInDB).length;
    
    return NextResponse.json({
      total: allLessons.length,
      synced,
      needsSync: allLessons.length - synced,
      status
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check' }, { status: 500 });
  }
}
