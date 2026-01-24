import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all lessons
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, duration, published, courseId, order } = body

    // Get the course (default to main-course if not specified)
    const course = await prisma.course.findFirst({
      where: courseId ? { id: courseId } : undefined,
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
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
