import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all lessons
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        course: { select: { id: true, title: true } },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}

// POST create new lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, content, duration, published, courseId, order } = body

    // Get the course (default to main-course if not specified)
    let course = await prisma.course.findFirst({
      where: courseId ? { id: courseId } : undefined,
    })

    // Create course if not exists
    if (!course) {
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
    }

    // Get next order number if not specified
    let lessonOrder = order
    if (!lessonOrder) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId: course.id },
        orderBy: { order: 'desc' },
      })
      lessonOrder = (lastLesson?.order || 0) + 1
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || '',
        content: content || `# ${title}\n\nContent coming soon...`,
        duration: duration || 25,
        published: published || false,
        order: lessonOrder,
        courseId: course.id,
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
  }
}
