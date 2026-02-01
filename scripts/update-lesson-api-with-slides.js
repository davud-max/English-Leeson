const fs = require('fs');
const path = require('path');

/**
 * Скрипт для обновления API урока, чтобы оно возвращало информацию о слайдах
 * на основе существующих аудио-файлов
 */

function updateLessonApiWithSlides() {
  console.log('🔧 Updating lesson API to include dynamic slides based on audio files...\n');

  // Путь к существующему API файлу
  const apiFilePath = path.join(__dirname, '..', 'api', 'lessons', '[id]', 'route.ts');
  
  if (!fs.existsSync(apiFilePath)) {
    console.error('❌ Original API file not found at:', apiFilePath);
    console.log('Trying alternative path...');
    
    // Попробуем найти файл в другой возможной директории
    const altApiFilePath = path.join(__dirname, '..', 'src', 'app', 'api', 'lessons', '[order]', 'route.ts');
    
    if (fs.existsSync(altApiFilePath)) {
      updateApiFile(altApiFilePath, '[order]');
    } else {
      console.error('❌ No lesson API route file found in expected locations');
      console.log('Expected paths:');
      console.log('  -', apiFilePath);
      console.log('  -', altApiFilePath);
      return;
    }
  } else {
    updateApiFile(apiFilePath, '[id]');
  }
}

function updateApiFile(apiFilePath, paramPattern) {
  console.log(`📝 Updating API file: ${apiFilePath}\n`);
  
  // Читаем существующий файл
  const originalContent = fs.readFileSync(apiFilePath, 'utf-8');
  
  // Создаем обновленный контент с поддержкой динамических слайдов
  const updatedContent = `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

// GET /api/lessons/[${paramPattern}] - получить урок по номеру с динамическими слайдами на основе аудио-файлов
export async function GET(
  request: Request,
  { params }: { params: { ${paramPattern.replace('[', '').replace(']', '')}: string } }
) {
  try {
    const orderNum = parseInt(params.${paramPattern.replace('[', '').replace(']', '')});
    
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
        // Не выбираем slides из базы данных, будем генерировать динамически
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Динамически определяем количество слайдов на основе аудио-файлов
    const audioDir = path.join(process.cwd(), 'public', 'audio', \`lesson\${orderNum}\`);
    let slides = null;
    
    if (fs.existsSync(audioDir)) {
      const audioFiles = fs.readdirSync(audioDir)
        .filter(file => file.startsWith('slide') && file.endsWith('.mp3'))
        .sort((a, b) => {
          // Сортировка файлов по номеру слайда (slide1.mp3, slide2.mp3, и т.д.)
          const numA = parseInt(a.match(/\\d+/)?.[0] || '0');
          const numB = parseInt(b.match(/\\d+/)?.[0] || '0');
          return numA - numB;
        });
        
      if (audioFiles.length > 0) {
        // Создаем слайды на основе количества аудио-файлов
        slides = audioFiles.map((file, index) => {
          const slideNumber = index + 1;
          return {
            id: slideNumber,
            title: \`Slide \${slideNumber}\`,
            content: \`Content for slide \${slideNumber} of lesson \${orderNum}\`,
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
}`;

  // Записываем обновленный контент в файл
  fs.writeFileSync(apiFilePath, updatedContent);
  
  console.log(`✅ Successfully updated lesson API to include dynamic slides`);
  console.log(`📁 File: ${apiFilePath}`);
  console.log(`🔄 The API will now dynamically generate slides based on existing audio files`);
}

// Запускаем функцию
updateLessonApiWithSlides();