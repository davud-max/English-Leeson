import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Все уроки из статического массива
const LESSONS_DATA = [
  { order: 1, title: '📐 Terms and Definitions', description: 'How knowledge is born. Fundamental terms: point, line, plane, space.', duration: 40 },
  { order: 2, title: '🔢 What Is Counting?', description: 'The origin of counting. Group, numeral, digit.', duration: 30 },
  { order: 3, title: '📊 What Is a Formula?', description: 'The emergence of the concept of a parameter.', duration: 30 },
  { order: 4, title: '🧠 Abstraction and Rules', description: 'Human beings and thinking. Abstraction and knowledge.', duration: 25 },
  { order: 5, title: '🎭 Human Activity: Praxeology', description: 'What kind of activity is worthy of a human being?', duration: 25 },
  { order: 6, title: '💼 Human Activity and Economics', description: 'From communication to law. Levels of civilization.', duration: 25 },
  { order: 7, title: '💰 The Fair and the Coin', description: 'How money, markets, and banks emerged.', duration: 25 },
  { order: 8, title: '🧠 Theory of Cognitive Resonance', description: 'How does thought arise?', duration: 25 },
  { order: 9, title: '📖 Sacred Text and Reality', description: 'Heaven and earth, water and light.', duration: 25 },
  { order: 10, title: '📻 How Thought Finds Us', description: 'The radio receiver model of consciousness.', duration: 30 },
  { order: 11, title: '🔢 The Number 666', description: 'A philosophical interpretation of the number of the Beast.', duration: 25 },
  { order: 12, title: '⬆️ Three Steps to Heaven', description: 'The number 666 as a formula of ascent.', duration: 28 },
  { order: 13, title: '🌍 The Sixth Human Level', description: 'The transition from external law to internal law.', duration: 30 },
  { order: 14, title: '🌌 How Consciousness Creates', description: 'The act of primary distinction.', duration: 30 },
  { order: 15, title: '🌐 A Theory of Everything', description: 'A philosophical hypothesis about reality.', duration: 25 },
  { order: 16, title: '➖ Minus-Space', description: 'Abstraction as the substance of the world.', duration: 20 },
  { order: 17, title: '🎯 The Human Path', description: 'A synthesis of all lessons.', duration: 30 },
  { order: 18, title: '🔄 Cycles of Understanding', description: 'How knowledge spirals upward.', duration: 25 },
  { order: 19, title: '🌊 Waves of Consciousness', description: 'The rhythm of thought.', duration: 25 },
  { order: 20, title: '⚡ The Spark of Insight', description: 'Moments of clarity.', duration: 25 },
  { order: 21, title: '👁️ Observation, Terms and Counting', description: 'The foundation of knowledge.', duration: 25 },
  { order: 22, title: '📖 Formulas, Abstraction and Rules', description: '', duration: 25 },
  { order: 23, title: '📖 Human Activity, Law and Civilization', description: '', duration: 25 },
  { order: 24, title: '📖 The Birth of Money and Banks', description: '', duration: 25 },
  { order: 25, title: '📖 Lesson 25', description: '', duration: 25 },
  { order: 26, title: '📖 Lesson 26', description: '', duration: 25 },
  { order: 27, title: '📖 Lesson 27', description: '', duration: 25 },
];

export async function POST() {
  try {
    // Получаем или создаём курс
    let course = await prisma.course.findFirst();
    if (!course) {
      course = await prisma.course.create({
        data: {
          title: 'Algorithms of Thinking and Cognition',
          description: 'A comprehensive course on thinking and cognition',
          price: 30,
          currency: 'USD',
          published: true,
        },
      });
    }

    // Получаем существующие уроки
    const existingLessons = await prisma.lesson.findMany({
      select: { order: true },
    });
    const existingOrders = new Set(existingLessons.map(l => l.order));

    // Добавляем недостающие уроки
    const lessonsToCreate = LESSONS_DATA.filter(l => !existingOrders.has(l.order));
    
    let created = 0;
    for (const lesson of lessonsToCreate) {
      await prisma.lesson.create({
        data: {
          courseId: course.id,
          order: lesson.order,
          title: lesson.title,
          description: lesson.description,
          content: `# ${lesson.title}\n\nLesson content here...`,
          duration: lesson.duration,
          published: true,
        },
      });
      created++;
    }

    // Получаем итоговое количество
    const totalLessons = await prisma.lesson.count();

    return NextResponse.json({
      success: true,
      message: `Synced! Created ${created} new lessons. Total: ${totalLessons}`,
      created,
      total: totalLessons,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}

// GET для проверки статуса
export async function GET() {
  try {
    const count = await prisma.lesson.count();
    const lessons = await prisma.lesson.findMany({
      select: { order: true, title: true },
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json({
      total: count,
      expected: LESSONS_DATA.length,
      missing: LESSONS_DATA.length - count,
      lessons: lessons.map(l => `${l.order}: ${l.title}`),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check' }, { status: 500 });
  }
}
