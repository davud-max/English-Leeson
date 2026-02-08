#!/bin/bash

echo "🔍 ПРОВЕРКА PRODUCTION БД - Уроки 21-27"
echo "========================================="
echo ""

cd /Users/davudzulumkhanov/thinking-course-en

echo "📊 Запрос к production базе данных..."
echo ""

# Создаём временный скрипт проверки
cat > /tmp/check-lessons-prod.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkLessons() {
  try {
    console.log('📊 Checking lessons 21-27 in production DB...\n')
    
    const lessons = await prisma.lesson.findMany({
      where: {
        order: { gte: 21, lte: 27 }
      },
      select: {
        order: true,
        title: true,
        published: true,
        available: true,
      },
      orderBy: { order: 'asc' }
    })
    
    if (lessons.length === 0) {
      console.log('❌ NO LESSONS 21-27 FOUND IN DATABASE!')
      console.log('   This is why the title does not appear.\n')
      console.log('💡 Solution: Run "npx tsx scripts/add-lessons-21-27.ts"\n')
    } else {
      console.log(`✅ Found ${lessons.length} lessons:\n`)
      lessons.forEach(l => {
        const pub = l.published ? '✅ Published' : '❌ Unpublished'
        const avail = l.available ? '✅ Available' : '⚠️  Unavailable'
        console.log(`   Lesson ${l.order}: ${l.title}`)
        console.log(`      ${pub}, ${avail}\n`)
      })
    }
    
    // Check total lessons
    const total = await prisma.lesson.count()
    const published = await prisma.lesson.count({ where: { published: true } })
    
    console.log(`📈 Total lessons in DB: ${total}`)
    console.log(`📢 Published lessons: ${published}\n`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkLessons()
EOF

# Запускаем проверку
npx tsx /tmp/check-lessons-prod.ts

echo ""
echo "================================================"
echo "🎯 РЕЗУЛЬТАТ ДИАГНОСТИКИ"
echo "================================================"
echo ""
echo "Если уроков 21-27 НЕТ → Запусти:"
echo "  npx tsx scripts/add-lessons-21-27.ts"
echo ""
echo "Если уроки ЕСТЬ, но unpublished → Запусти:"
echo "  npx tsx scripts/add-lessons-21-27.ts"
echo "  (скрипт их опубликует)"
echo ""
echo "Если уроки ЕСТЬ и published → Проблема в кэше:"
echo "  1. Hard reload: Cmd+Shift+R"
echo "  2. Incognito mode"
echo "  3. Очисти Railway build cache"
echo ""
