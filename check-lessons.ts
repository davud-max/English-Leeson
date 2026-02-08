import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkLessons() {
  try {
    console.log('🔍 Checking lessons in Railway database...\n')
    
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        order: true,
        title: true,
        published: true,
        emoji: true,
      },
      orderBy: {
        order: 'asc',
      },
    })

    const published = lessons.filter(l => l.published)
    const unpublished = lessons.filter(l => !l.published)
    
    console.log(`📊 TOTAL LESSONS: ${lessons.length}`)
    console.log(`✅ Published: ${published.length}`)
    console.log(`❌ Unpublished: ${unpublished.length}`)
    console.log('\n' + '='.repeat(60) + '\n')
    
    console.log('📚 ALL LESSONS:\n')
    lessons.forEach((lesson, index) => {
      const status = lesson.published ? '✅' : '❌'
      const emoji = lesson.emoji || '📖'
      console.log(`${status} ${emoji} Lesson ${lesson.order}: ${lesson.title}`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('\n✅ Check complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkLessons()
