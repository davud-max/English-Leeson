#!/usr/bin/env node

// Скрипт для получения информации об уроке 9 из базы данных
// Примечание: Этот скрипт будет работать только если у вас есть доступ к базе данных

const { PrismaClient } = require('@prisma/client');

// Используем базу данных из переменной окружения
const prisma = new PrismaClient();

async function checkLesson9() {
  try {
    console.log('🔍 Checking lesson 9 in database...\n');
    
    // Получаем урок 9
    const lesson = await prisma.lesson.findUnique({
      where: { 
        order: 9  // Предполагаем, что урок 9 имеет order=9
      },
    });

    if (lesson) {
      console.log('📚 Lesson 9 Details:');
      console.log('====================');
      console.log(`ID: ${lesson.id}`);
      console.log(`Order: ${lesson.order}`);
      console.log(`Title: ${lesson.title}`);
      console.log(`Description: ${lesson.description}`);
      console.log(`Published: ${lesson.published}`);
      console.log(`Available: ${lesson.available}`);
      console.log(`Emoji: ${lesson.emoji}`);
      console.log(`Color: ${lesson.color}`);
      console.log(`Duration: ${lesson.duration} minutes`);
      console.log('');
      
      console.log(`Content preview (${lesson.content ? lesson.content.length : 0} chars):`);
      if (lesson.content) {
        console.log(lesson.content.substring(0, 500) + (lesson.content.length > 500 ? '...' : ''));
      } else {
        console.log('(no content)');
      }
      console.log('');
      
      if (lesson.slides) {
        console.log(`Slides: ${lesson.slides.length}`);
        lesson.slides.forEach((slide, index) => {
          console.log(`\n--- Slide ${index + 1} ---`);
          console.log(`ID: ${slide.id || 'N/A'}`);
          console.log(`Title: ${slide.title}`);
          console.log(`Emoji: ${slide.emoji || 'N/A'}`);
          console.log(`Duration: ${slide.duration || 'N/A'}`);
          console.log(`Content preview (${slide.content ? slide.content.length : 0} chars):`);
          if (slide.content) {
            console.log(slide.content.substring(0, 300) + (slide.content.length > 300 ? '...' : ''));
          } else {
            console.log('(no content)');
          }
        });
      } else {
        console.log('No slides data');
      }
    } else {
      console.log('❌ Lesson 9 (order: 9) not found in the database.');
      
      // Попробуем найти урок с ключевыми словами
      console.log('\n🔍 Trying to find lesson with Genesis-related content...');
      
      const genesisLessons = await prisma.lesson.findMany({
        where: {
          OR: [
            {
              title: {
                contains: 'Genesis',
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: 'Genesis',
                mode: 'insensitive'
              }
            },
            {
              content: {
                contains: 'Genesis',
                mode: 'insensitive'
              }
            },
            {
              title: {
                contains: 'Heaven and earth',
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: 'Heaven and earth',
                mode: 'insensitive'
              }
            },
            {
              content: {
                contains: 'Heaven and earth',
                mode: 'insensitive'
              }
            }
          ]
        }
      });
      
      if (genesisLessons.length > 0) {
        console.log(`\n✅ Found ${genesisLessons.length} lesson(s) with Genesis-related content:`);
        genesisLessons.forEach(lesson => {
          console.log(`\n--- Lesson ${lesson.order}: ${lesson.title} ---`);
          console.log(`Description: ${lesson.description}`);
        });
      } else {
        console.log('\n❌ No lessons found with Genesis-related content.');
        
        // Попробуем найти уроки с подобным описанием
        console.log('\n🔍 Looking for lessons with similar description...');
        const similarLessons = await prisma.lesson.findMany({
          where: {
            description: {
              contains: 'water and light',
              mode: 'insensitive'
            }
          }
        });
        
        if (similarLessons.length > 0) {
          console.log(`\n✅ Found ${similarLessons.length} lesson(s) with "water and light" in description:`);
          similarLessons.forEach(lesson => {
            console.log(`\n--- Lesson ${lesson.order}: ${lesson.title} ---`);
            console.log(`Description: ${lesson.description}`);
          });
        } else {
          console.log('\n❌ No lessons found with "water and light" in description.');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error accessing database:', error.message);
    console.log('\n💡 This error typically occurs because:');
    console.log('   - Database is hosted remotely (e.g., Railway) and not accessible locally');
    console.log('   - Environment variables are not configured for local access');
    console.log('   - Database credentials are missing or incorrect');
  } finally {
    await prisma.$disconnect();
  }
}

checkLesson9();