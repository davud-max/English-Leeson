import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const lessonId = params.id

    // Update progress
    const progress = await prisma.progress.update({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      data: {
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
          lessonId,
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
