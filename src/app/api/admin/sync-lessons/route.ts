import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Данные всех уроков для синхронизации
const LESSONS_DATA = [
  { order: 1, title: '📐 Terms and Definitions', description: 'How knowledge is born. Fundamental terms: point, line, plane, space.', duration: 40, emoji: '📐', color: 'from-blue-500 to-indigo-600', available: true },
  { order: 2, title: '🔢 What Is Counting?', description: 'The origin of counting. Group, numeral, digit.', duration: 30, emoji: '🔢', color: 'from-green-500 to-emerald-600', available: true },
  { order: 3, title: '📊 What Is a Formula?', description: 'The emergence of the concept of a parameter.', duration: 30, emoji: '📊', color: 'from-purple-500 to-violet-600', available: true },
  { order: 4, title: '🧠 Abstraction and Rules', description: 'Human beings and thinking. Abstraction and knowledge.', duration: 25, emoji: '🧠', color: 'from-indigo-500 to-purple-600', available: true },
  { order: 5, title: '🎭 Human Activity: Praxeology', description: 'What kind of activity is worthy of a human being?', duration: 25, emoji: '🎭', color: 'from-orange-500 to-red-600', available: true },
  { order: 6, title: '💼 Human Activity and Economics', description: 'From communication to law. Levels of civilization.', duration: 25, emoji: '💼', color: 'from-teal-500 to-cyan-600', available: true },
  { order: 7, title: '💰 The Fair and the Coin', description: 'How money, markets, and banks emerged.', duration: 25, emoji: '💰', color: 'from-yellow-500 to-amber-600', available: true },
  { order: 8, title: '🧠 Theory of Cognitive Resonance', description: 'How does thought arise?', duration: 25, emoji: '🧠', color: 'from-emerald-500 to-teal-600', available: true },
  { order: 9, title: '📖 Sacred Text and Reality', description: 'Heaven and earth, water and light.', duration: 25, emoji: '📖', color: 'from-sky-500 to-blue-600', available: true },
  { order: 10, title: '📻 How Thought Finds Us', description: 'The radio receiver model of consciousness.', duration: 30, emoji: '📻', color: 'from-fuchsia-500 to-pink-600', available: true },
  { order: 11, title: '🔢 The Number 666', description: 'A philosophical interpretation of the number of the Beast.', duration: 25, emoji: '🔢', color: 'from-red-500 to-rose-600', available: true },
  { order: 12, title: '⬆️ Three Steps to Heaven', description: 'The number 666 as a formula of ascent.', duration: 28, emoji: '⬆️', color: 'from-violet-500 to-purple-600', available: true },
  { order: 13, title: '🌍 The Sixth Human Level', description: 'The transition from external law to internal law.', duration: 30, emoji: '🌍', color: 'from-emerald-500 to-teal-600', available: true },
  { order: 14, title: '🌌 How Consciousness Creates', description: 'The act of primary distinction.', duration: 30, emoji: '🌌', color: 'from-indigo-500 to-blue-600', available: true },
  { order: 15, title: '🌐 A Theory of Everything', description: 'A philosophical hypothesis about reality.', duration: 25, emoji: '🌐', color: 'from-cyan-500 to-teal-600', available: true },
  { order: 16, title: '➖ Minus-Space', description: 'Abstraction as the substance of the world.', duration: 20, emoji: '➖', color: 'from-gray-500 to-slate-600', available: true },
  { order: 17, title: '🎯 The Human Path', description: 'A synthesis of all lessons.', duration: 30, emoji: '🎯', color: 'from-amber-500 to-orange-600', available: true },
  { order: 18, title: '🔄 Cycles of Understanding', description: 'How knowledge spirals upward.', duration: 25, emoji: '🔄', color: 'from-rose-500 to-pink-600', available: true },
  { order: 19, title: '🌊 Waves of Consciousness', description: 'The rhythm of thought.', duration: 25, emoji: '🌊', color: 'from-sky-500 to-cyan-600', available: true },
  { order: 20, title: '⚡ The Spark of Insight', description: 'Moments of clarity.', duration: 25, emoji: '⚡', color: 'from-yellow-500 to-orange-600', available: true },
  { order: 21, title: '👁️ Observation, Terms and Counting', description: 'The foundation of knowledge.', duration: 25, emoji: '👁️', color: 'from-emerald-500 to-green-600', available: true },
  { order: 22, title: '📖 Formulas, Abstraction and Rules', description: 'Advanced concepts in abstraction.', duration: 25, emoji: '📖', color: 'from-blue-500 to-indigo-600', available: true },
  { order: 23, title: '📖 Human Activity, Law and Civilization', description: 'The structure of human society.', duration: 25, emoji: '📖', color: 'from-purple-500 to-violet-600', available: true },
  { order: 24, title: '📖 The Birth of Money and Banks', description: 'Economic foundations of civilization.', duration: 25, emoji: '📖', color: 'from-amber-500 to-yellow-600', available: true },
  { order: 25, title: '📖 Lesson 25', description: 'Advanced topics.', duration: 25, emoji: '📖', color: 'from-teal-500 to-cyan-600', available: true },
];

// POST - Полная синхронизация уроков
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

    let created = 0;
    let updated = 0;

    for (const lessonData of LESSONS_DATA) {
      // Проверяем существует ли урок
      const existing = await prisma.lesson.findFirst({
        where: { order: lessonData.order },
      });

      if (existing) {
        // Обновляем существующий урок (emoji, color, available, description)
        await prisma.lesson.update({
          where: { id: existing.id },
          data: {
            emoji: lessonData.emoji,
            color: lessonData.color,
            available: lessonData.available,
            description: existing.description || lessonData.description,
            duration: lessonData.duration,
          },
        });
        updated++;
      } else {
        // Создаём новый урок
        await prisma.lesson.create({
          data: {
            courseId: course.id,
            order: lessonData.order,
            title: lessonData.title,
            description: lessonData.description,
            content: `# ${lessonData.title}\n\nLesson content here...`,
            duration: lessonData.duration,
            published: true,
            emoji: lessonData.emoji,
            color: lessonData.color,
            available: lessonData.available,
          },
        });
        created++;
      }
    }

    const total = await prisma.lesson.count();

    return NextResponse.json({
      success: true,
      message: `Synced! Created: ${created}, Updated: ${updated}. Total: ${total}`,
      created,
      updated,
      total,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}

// GET - Проверка статуса
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      select: { order: true, title: true, emoji: true, color: true, available: true },
      orderBy: { order: 'asc' },
    });
    
    const total = lessons.length;
    const available = lessons.filter(l => l.available).length;
    
    return NextResponse.json({
      total,
      available,
      expected: LESSONS_DATA.length,
      missing: LESSONS_DATA.length - total,
      lessons: lessons.map(l => ({
        order: l.order,
        title: l.title,
        emoji: l.emoji || '📖',
        available: l.available,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check' }, { status: 500 });
  }
}
