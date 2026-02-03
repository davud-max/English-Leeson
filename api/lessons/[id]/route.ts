import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

// GET /api/lessons/[order] - получить урок по номеру с динамическими слайдами на основе аудио-файлов
export async function GET(
  request: Request,
  { params }: { params: { order: string } }
) {
  try {
    const orderNum = parseInt(params.order);
    
    if (isNaN(orderNum)) {
      return NextResponse.json(
        { error: 'Invalid lesson number' },
        { status: 400 }
      );
    }

    // Получаем урок из базы данных
    const lesson = await prisma.lesson.findFirst({
      where: {
        order: orderNum,
        published: true,
      },
      select: {
        id: true,
        order: true,
        title: true,
        description: true,
        content: true,
        duration: true,
        emoji: true,
        color: true,
        available: true,
        slides: true, // Выбираем slides из базы данных
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Если в базе данных уже есть слайды, используем их
    let slides = (lesson as any).slides;

    if (!slides || slides === null || (Array.isArray(slides) && slides.length === 0)) {
      // Динамически определяем количество слайдов на основе аудио-файлов только если их нет в базе
      const audioDir = path.join(process.cwd(), 'public', 'audio', `lesson${orderNum}`);
      
      if (fs.existsSync(audioDir)) {
      const audioFiles = fs.readdirSync(audioDir)
        .filter(file => file.startsWith('slide') && file.endsWith('.mp3'))
        .sort((a, b) => {
          // Сортировка файлов по номеру слайда (slide1.mp3, slide2.mp3, и т.д.)
          const numA = parseInt(a.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.match(/\d+/)?.[0] || '0');
          return numA - numB;
        });
        
      if (audioFiles.length > 0) {
        // Создаем слайды на основе количества аудио-файлов
        slides = audioFiles.map((file, index) => {
          const slideNumber = index + 1;
          return {
            id: slideNumber,
            title: `Slide ${slideNumber}`,
            content: `Content for slide ${slideNumber} of lesson ${orderNum}`,
            emoji: lesson.emoji || '📖',
            duration: 30000
          };
        });
      }
    }
    
    // Если слайды не были созданы из аудио-файлов, создаем один общий слайд
    if (!slides) {
      slides = [{
        id: 1,
        title: lesson.title,
        content: lesson.content,
        emoji: lesson.emoji || '📖',
        duration: 30000,
      }];
    }
  }

    // Добавляем слайды к уроку
    const lessonWithSlides = {
      ...lesson,
      slides
    };

    // Получаем соседние уроки для навигации
    const [prevLesson, nextLesson] = await Promise.all([
      prisma.lesson.findFirst({
        where: { order: orderNum - 1, published: true },
        select: { order: true, title: true },
      }),
      prisma.lesson.findFirst({
        where: { order: orderNum + 1, published: true },
        select: { order: true, title: true },
      }),
    ]);

    const navigation = {
      prev: prevLesson,
      next: nextLesson,
      total: await prisma.lesson.count({ where: { published: true } })
    };

    return NextResponse.json({ lesson: lessonWithSlides, navigation });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}