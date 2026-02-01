import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user's progress
    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
      select: {
        lessonId: true,
        completed: true,
        completedAt: true,
      },
    })

    // Get user's enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id },
      select: {
        courseId: true,
        enrolledAt: true,
      },
    })

    // Get completed purchases
    const purchase = await prisma.purchase.findFirst({
      where: { 
        userId: session.user.id,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        completedAt: true,
      },
    })

    return NextResponse.json({
      progress,
      enrollment,
      hasPurchased: !!purchase,
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
