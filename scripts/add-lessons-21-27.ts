import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Данные для уроков 21-27 (взяты из slides-config.json)
const LESSONS_21_27 = [
  { 
    order: 21, 
    title: 'Advanced Lesson 21', 
    description: 'Advanced concepts continuation',
    duration: 25,
    slideCount: 19 
  },
  { 
    order: 22, 
    title: 'Advanced Lesson 22', 
    description: 'Deep dive into advanced topics',
    duration: 30,
    slideCount: 26 
  },
  { 
    order: 23, 
    title: 'Advanced Lesson 23', 
    description: 'Further exploration',
    duration: 25,
    slideCount: 19 
  },
  { 
    order: 24, 
    title: 'Advanced Lesson 24', 
    description: 'Continued learning',
    duration: 20,
    slideCount: 15 
  },
  { 
    order: 25, 
    title: 'Advanced Lesson 25', 
    description: 'Advanced principles',
    duration: 30,
    slideCount: 26 
  },
  { 
    order: 26, 
    title: 'Advanced Lesson 26', 
    description: 'Final advanced topics',
    duration: 25,
    slideCount: 23 
  },
  { 
    order: 27, 
    title: 'Advanced Lesson 27', 
    description: 'Course conclusion',
    duration: 30,
    slideCount: 25 
  },
]

async function addLessons21to27() {
  try {
    console.log('🔍 Checking for main course...\n')
    
    const course = await prisma.course.findFirst()
    
    if (!course) {
      console.error('❌ No course found! Run seed first.')
      process.exit(1)
    }
    
    console.log(`✅ Found course: ${course.title}\n`)
    console.log('📝 Adding lessons 21-27...\n')
    
    for (const lessonData of LESSONS_21_27) {
      // Check if lesson exists
      const existing = await prisma.lesson.findFirst({
        where: {
          courseId: course.id,
          order: lessonData.order,
        },
      })
      
      if (existing) {
        // Update if unpublished
        if (!existing.published) {
          await prisma.lesson.update({
            where: { id: existing.id },
            data: { published: true },
          })
          console.log(`✅ Lesson ${lessonData.order} published: ${existing.title}`)
        } else {
          console.log(`⏭️  Lesson ${lessonData.order} already exists: ${existing.title}`)
        }
        continue
      }
      
      // Create new lesson
      const lesson = await prisma.lesson.create({
        data: {
          courseId: course.id,
          order: lessonData.order,
          title: lessonData.title,
          description: lessonData.description,
          content: `# ${lessonData.title}\n\n${lessonData.description}\n\nContent coming soon...`,
          duration: lessonData.duration,
          published: true,  // ← ВАЖНО!
          emoji: '📖',
          color: 'from-blue-500 to-indigo-600',
          available: true,
          slides: null,
        },
      })
      
      console.log(`✅ Created Lesson ${lessonData.order}: ${lesson.title}`)
    }
    
    console.log('\n✅ All lessons 21-27 added successfully!\n')
    
    // Verify
    const allLessons = await prisma.lesson.findMany({
      where: {
        published: true,
        order: { gte: 21, lte: 27 }
      },
      select: { order: true, title: true, published: true },
      orderBy: { order: 'asc' }
    })
    
    console.log('📊 Verification - Published lessons 21-27:')
    allLessons.forEach(l => {
      console.log(`   ${l.published ? '✅' : '❌'} Lesson ${l.order}: ${l.title}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

addLessons21to27()
