import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { order: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const lessonOrder = parseInt(params.order)
    
    if (isNaN(lessonOrder)) {
      return NextResponse.json({ error: 'Invalid lesson number' }, { status: 400 })
    }

    // Find lesson by order number
    const lesson = await prisma.lesson.findFirst({
      where: { order: lessonOrder },
      select: { id: true },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Update or create progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lesson.id,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
      },
    })

    // Track completion event
    await prisma.event.create({
      data: {
        userId: session.user.id,
        eventType: 'lesson_completed',
        metadata: {
          lessonId: lesson.id,
          lessonOrder,
        },
      },
    })

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error('Error completing lesson:', error)
    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    )
  }
}
