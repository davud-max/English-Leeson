import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        course: { select: { id: true, title: true } },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 })
  }
}

// PUT update lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, duration, published, order } = body

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(duration !== undefined && { duration }),
        ...(published !== undefined && { published }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error updating lesson:', error)
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
  }
}

// DELETE lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Delete the lesson
    await prisma.lesson.delete({
      where: { id: params.id },
    })

    // Reorder remaining lessons
    const remainingLessons = await prisma.lesson.findMany({
      where: { courseId: lesson.courseId },
      orderBy: { order: 'asc' },
    })

    for (let i = 0; i < remainingLessons.length; i++) {
      await prisma.lesson.update({
        where: { id: remainingLessons[i].id },
        data: { order: i + 1 },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
  }
}
