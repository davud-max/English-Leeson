const fs = require('fs');
const path = require('path');

/**
 * Скрипт для создания кастомного API маршрута, который будет
 * возвращать информацию о слайдах на основе существующих аудио-файлов
 */
function fixLessonSlidesStructure() {
  console.log('🔧 Creating dynamic lesson slides API based on existing audio files...\n');

  // Получаем список уроков из папки аудио
  const audioDir = path.join(__dirname, '..', 'public', 'audio');
  const lessonDirs = fs.readdirSync(audioDir).filter(item => {
    return fs.statSync(path.join(audioDir, item)).isDirectory() && item.startsWith('lesson');
  });

  // Извлекаем номера уроков из названий папок
  const lessonNumbers = lessonDirs.map(dir => {
    const match = dir.match(/lesson(\d+)/);
    return match ? parseInt(match[1]) : null;
  }).filter(num => num !== null).sort((a, b) => a - b);

  console.log(`📋 Found ${lessonNumbers.length} lessons with audio folders\n`);

  // Создаем директорию для нового API, если её нет
  const newApiDir = path.join(__dirname, '..', 'src', 'app', 'api', 'dynamic-lessons');
  if (!fs.existsSync(newApiDir)) {
    fs.mkdirSync(newApiDir, { recursive: true });
  }

  // Создаем новый маршрут API
  const newRoutePath = path.join(newApiDir, '[order]', 'route.ts');
  
  // Создаем содержимое для нового API маршрута
  const newRouteContent = `
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

// GET /api/dynamic-lessons/[order] - получить урок по номеру с динамическими слайдами на основе аудио-файлов
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
}
`;
  
  fs.writeFileSync(newRoutePath, newRouteContent);
  console.log('✅ Created new dynamic API route at:', newRoutePath);
  
  // Также создаем обновленный компонент урока, который будет использовать новый API
  updateLessonComponent(lessonNumbers);
  
  console.log('\n✅ Finished creating dynamic lesson slides system.');
  console.log('\n💡 Next steps:');
  console.log('   1. Update the lesson page component to use /api/dynamic-lessons/[order] instead of /api/lessons/[order]');
  console.log('   2. Or update the existing API route to include dynamic slides');
}

/**
 * Обновляет структуру слайдов в файле урока
 */
function updateLessonSlides(filePath, fileContent, lessonNumber, audioCount) {
  // Генерируем новый массив слайдов
  const slidesArray = generateSlidesArray(lessonNumber, audioCount);
  
  // Проверяем, есть ли уже какой-то массив слайдов в файле
  const existingSlidesMatch = fileContent.match(new RegExp(`const\\s+LESSON_${lessonNumber}_SLIDES\\s*=\\s*\\[(.|\\n)*?\\]\\s*;`, 'g'));
  
  let newContent = fileContent;
  
  if (existingSlidesMatch) {
    // Заменяем существующий массив
    newContent = fileContent.replace(
      new RegExp(`const\\s+LESSON_${lessonNumber}_SLIDES\\s*=\\s*\\[(.|\\n)*?\\]\\s*;`, 'g'),
      slidesArray
    );
  } else {
    // Добавляем новый массив после импортов
    const importsEnd = fileContent.indexOf('\n}', fileContent.indexOf('import'));
    if (importsEnd !== -1) {
      // Найдем конец блока импортов
      const nextLineBreak = fileContent.indexOf('\n', importsEnd + 2);
      const insertPosition = nextLineBreak !== -1 ? nextLineBreak + 1 : importsEnd + 2;
      
      newContent = fileContent.slice(0, insertPosition) + '\n' + slidesArray + '\n\n' + fileContent.slice(insertPosition);
    } else {
      // Если не нашли место для импортов, добавляем в начало после 'use client'
      if (fileContent.startsWith("'use client'")) {
        const firstNewLine = fileContent.indexOf('\n', 12); // После 'use client'
        newContent = fileContent.slice(0, firstNewLine + 1) + slidesArray + '\n\n' + fileContent.slice(firstNewLine + 1);
      } else {
        // Если нет 'use client', добавляем в начало
        newContent = slidesArray + '\n\n' + fileContent;
      }
    }
  }
  
  // Записываем обновленный контент в файл
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`  ✅ Updated lesson ${lessonNumber} with ${audioCount} slides`);
}

/**
 * Генерирует массив слайдов для урока
 */
function generateSlidesArray(lessonNumber, count) {
  const slides = [];
  
  for (let i = 1; i <= count; i++) {
    slides.push(`  {
    id: ${i},
    title: "Slide ${i}",
    content: "Content for slide ${i} of lesson ${lessonNumber}",
    emoji: "📖",
    duration: 30000
  }`);
  }
  
  return `const LESSON_${lessonNumber}_SLIDES = [
${slides.join(',\n')}
];`;
}

// Запускаем функцию
fixLessonSlidesStructure();