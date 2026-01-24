import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const LESSON_DESCRIPTIONS = [
  { order: 1, title: 'Terms and Definitions', description: 'How knowledge is born. Fundamental terms: point, line, plane, space. Two opposing movements of thought.', duration: 40 },
  { order: 2, title: 'What Is Counting?', description: 'The origin of counting. Group, numeral, digit. Counting on fingers: dozen, score, gross. Natural numbers.', duration: 30 },
  { order: 3, title: 'What Is a Formula?', description: 'The emergence of the concept of a parameter. Relationships between quantities and formulae. The number π.', duration: 30 },
  { order: 4, title: 'Abstraction and Rules', description: 'Human beings and thinking. Abstraction and knowledge. Literacy as rule-based action.', duration: 25 },
  { order: 5, title: 'Human Activity: Praxeology, Economics, and Imitation', description: 'What kind of activity is worthy of a human being? How can creation be distinguished from imitation?', duration: 25 },
  { order: 6, title: 'Human Activity and Economics', description: 'From communication to law. Levels of civilization. Goals and goods. Ethics and experience.', duration: 25 },
  { order: 7, title: 'The Fair and the Coin: The Birth of Money', description: 'How money, markets, and banks emerged from the exchange of gifts between tribes.', duration: 25 },
  { order: 8, title: 'Theory of Cognitive Resonance', description: 'How does thought arise? Two circuits of consciousness and the mechanism of resonance.', duration: 25 },
  { order: 9, title: 'The Creation of the World: Biblical Cosmogony', description: 'Heaven and earth, water and light — a philosophical analysis of the first chapter of Genesis.', duration: 20 },
  { order: 10, title: 'Cognitive Resonance II', description: 'How we think. Continuation of the topic.', duration: 25 },
  { order: 11, title: 'The Number 666', description: 'A philosophical interpretation of the number of the Beast through the theory of abstraction.', duration: 20 },
  { order: 12, title: 'Three Steps to Heaven: 666', description: 'The number 666 as a formula of ascent.', duration: 22 },
  { order: 13, title: 'The Sixth Human Level', description: 'The transition from external law to internal law.', duration: 25 },
  { order: 14, title: 'How Consciousness Creates the World', description: 'The act of primary distinction. The triad: Being, Consciousness, and the Act of Distinction.', duration: 20 },
  { order: 15, title: 'A Theory of Everything', description: 'A philosophical hypothesis about the fundamental nature of reality beyond space.', duration: 25 },
  { order: 16, title: 'Minus-Space', description: 'Abstraction as the substance of the world.', duration: 20 },
  { order: 17, title: 'The Human Path Through Abstraction', description: 'A synthesis of all lessons: from the capacity to distinguish to the comprehension of unity.', duration: 30 },
]

export async function POST() {
  try {
    // Step 1: Test database connection
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('Database connected!')

    // Step 2: Create or get course
    console.log('Looking for existing course...')
    let course = await prisma.course.findFirst()
    console.log('Existing course:', course)
    
    if (!course) {
      console.log('Creating new course...')
      course = await prisma.course.create({
        data: {
          id: 'main-course',
          title: 'Algorithms of Thinking and Cognition',
          description: 'A Philosophical Course for the Development of Critical Thinking',
          price: 30,
          currency: 'USD',
          published: true,
        }
      })
      console.log('Course created:', course)
    }

    // Step 3: Create lessons
    let created = 0
    let skipped = 0
    const errors: string[] = []

    for (const lessonData of LESSON_DESCRIPTIONS) {
      try {
        const existing = await prisma.lesson.findFirst({
          where: {
            courseId: course.id,
            order: lessonData.order,
          }
        })

        if (existing) {
          skipped++
          continue
        }

        await prisma.lesson.create({
          data: {
            courseId: course.id,
            order: lessonData.order,
            title: lessonData.title,
            description: lessonData.description,
            content: `# ${lessonData.title}\n\n${lessonData.description}\n\nContent coming soon...`,
            duration: lessonData.duration,
            published: lessonData.order <= 8,
          }
        })
        created++
        console.log(`Created lesson ${lessonData.order}: ${lessonData.title}`)
      } catch (lessonError) {
        const errMsg = `Lesson ${lessonData.order}: ${String(lessonError)}`
        errors.push(errMsg)
        console.error(errMsg)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seed complete: ${created} lessons created, ${skipped} skipped`,
      courseId: course.id,
      created,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Seed error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json({ 
      error: 'Seed failed', 
      message: errorMessage,
      stack: errorStack,
      type: error instanceof Error ? error.constructor.name : typeof error,
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Test connection and show database status
    await prisma.$connect()
    
    const courseCount = await prisma.course.count()
    const lessonCount = await prisma.lesson.count()
    
    return NextResponse.json({ 
      message: 'POST to this endpoint to seed the database',
      lessons: LESSON_DESCRIPTIONS.length,
      currentCourses: courseCount,
      currentLessons: lessonCount,
      databaseConnected: true,
    })
  } catch (error) {
    return NextResponse.json({ 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error),
      databaseConnected: false,
    }, { status: 500 })
  }
}
