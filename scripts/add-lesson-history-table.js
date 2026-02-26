/**
 * Скрипт для ручного добавления таблицы истории уроков в продакшен базу данных
 * Используйте этот скрипт, если автоматическая миграция не сработала
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function createLessonHistoryTable() {
  console.log('Checking if LessonHistory table exists...');
  
  try {
    // Проверяем, существует ли таблица
    await prisma.$queryRaw`SELECT 1 FROM "LessonHistory" LIMIT 1`;
    console.log('✅ LessonHistory table already exists');
  } catch (error) {
    console.log('❌ LessonHistory table does not exist, creating...');
    
    try {
      // Создаем таблицу вручную
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "LessonHistory" (
          "id" TEXT NOT NULL,
          "lessonId" TEXT NOT NULL,
          "title" VARCHAR(255) NOT NULL,
          "description" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "slides" JSONB,
          "duration" INTEGER NOT NULL DEFAULT 0,
          "published" BOOLEAN NOT NULL DEFAULT false,
          "emoji" VARCHAR(10) NOT NULL DEFAULT '📖',
          "color" VARCHAR(50) NOT NULL DEFAULT 'from-blue-500 to-indigo-600',
          "available" BOOLEAN NOT NULL DEFAULT false,
          "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "changedById" TEXT,

          CONSTRAINT "LessonHistory_pkey" PRIMARY KEY ("id")
        );
      `;
      
      // Создаем индекс
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "LessonHistory_lessonId_changedAt_idx" ON "LessonHistory"("lessonId", "changedAt");
      `;
      
      // Создаем внешние ключи
      try {
        await prisma.$executeRaw`
          ALTER TABLE "LessonHistory" 
          ADD CONSTRAINT "LessonHistory_lessonId_fkey" 
          FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE;
        `;
      } catch (fkError) {
        console.log('Foreign key for lessonId may already exist or constraint error:', fkError.message);
      }
      
      try {
        await prisma.$executeRaw`
          ALTER TABLE "LessonHistory" 
          ADD CONSTRAINT "LessonHistory_changedById_fkey" 
          FOREIGN KEY ("changedById") REFERENCES "User"("id") 
          ON DELETE SET NULL ON UPDATE CASCADE;
        `;
      } catch (fkError) {
        console.log('Foreign key for changedById may already exist or constraint error:', fkError.message);
      }
      
      console.log('✅ LessonHistory table created successfully');
    } catch (createError) {
      console.error('❌ Error creating LessonHistory table:', createError);
      throw createError;
    }
  }
  
  // Проверяем, существует ли столбец history в таблице Lesson (обратная связь)
  try {
    await prisma.$queryRaw`SELECT history FROM "Lesson" LIMIT 1`;
    console.log('✅ History relation already exists in Lesson model');
  } catch (error) {
    console.log('ℹ️ History relation may not be directly visible in table (Prisma virtual relation)');
  }
  
  console.log('✅ Script completed successfully');
}

async function main() {
  try {
    await createLessonHistoryTable();
  } catch (error) {
    console.error('❌ Error in main function:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { createLessonHistoryTable };