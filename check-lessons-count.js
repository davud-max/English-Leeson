const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLessons() {
  try {
    console.log('🔍 Checking lessons in database...\n');
    
    // Get all lessons
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        order: true,
        title: true,
        published: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    console.log(`📊 Total lessons in database: ${lessons.length}\n`);
    
    const published = lessons.filter(l => l.published);
    const unpublished = lessons.filter(l => !l.published);
    
    console.log(`✅ Published: ${published.length}`);
    console.log(`❌ Unpublished: ${unpublished.length}\n`);
    
    console.log('📚 All lessons:\n');
    lessons.forEach(lesson => {
      const status = lesson.published ? '✅' : '❌';
      console.log(`${status} #${lesson.order}: ${lesson.title}`);
    });
    
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLessons();
