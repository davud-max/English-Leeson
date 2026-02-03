import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Читаем аудиофайлы из папки
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'lesson16');
    
    if (!fs.existsSync(audioDir)) {
      return NextResponse.json(
        { error: 'Audio directory not found' },
        { status: 404 }
      );
    }

    const audioFiles = fs.readdirSync(audioDir)
      .filter(file => file.startsWith('slide') && file.endsWith('.mp3'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    // Создаём слайды из аудиофайлов
    const slides = audioFiles.map((file, index) => {
      const slideNumber = index + 1;
      return {
        id: slideNumber,
        title: `Slide ${slideNumber}`,
        content: `Content for slide ${slideNumber} of lesson 16`,
        emoji: '➖',
        duration: 30000
      };
    });

    // Сохраняем в базу данных
    const result = await prisma.lesson.update({
      where: { id: 'cmks5saj0000v11nt8a2ati54' },
      data: { slides: slides as any }
    });
    
    return NextResponse.json({
      success: true,
      message: `Generated and saved ${slides.length} slides for lesson ${result.order}: ${result.title}`,
      slidesCount: slides.length
    });
  } catch (error) {
    console.error('Error generating slides:', error);
    return NextResponse.json(
      { error: 'Failed to generate slides' },
      { status: 500 }
    );
  }
}
