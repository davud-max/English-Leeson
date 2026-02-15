import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type SwapBody = {
  fromOrder?: number
  toOrder?: number
  adminKey?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as SwapBody
    const session = await getServerSession(authOptions)
    const isAdminSession = !!session && session.user.role === 'ADMIN'
    const isAdminKeyValid =
      typeof body.adminKey === 'string' &&
      body.adminKey.length > 0 &&
      body.adminKey === process.env.ADMIN_SECRET_KEY

    if (!isAdminSession && !isAdminKeyValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fromOrder = Number(body.fromOrder ?? 9)
    const toOrder = Number(body.toOrder ?? 10)

    if (!Number.isInteger(fromOrder) || !Number.isInteger(toOrder) || fromOrder < 1 || toOrder < 1) {
      return NextResponse.json(
        { error: 'fromOrder and toOrder must be positive integers' },
        { status: 400 }
      )
    }

    if (fromOrder === toOrder) {
      return NextResponse.json({ error: 'fromOrder and toOrder must be different' }, { status: 400 })
    }

    const [fromLesson, toLesson] = await Promise.all([
      prisma.lesson.findFirst({
        where: { order: fromOrder },
        select: { id: true, order: true, title: true, content: true, slides: true },
      }),
      prisma.lesson.findFirst({
        where: { order: toOrder },
        select: { id: true, order: true, title: true, content: true, slides: true },
      }),
    ])

    if (!fromLesson || !toLesson) {
      return NextResponse.json(
        { error: 'One or both lessons were not found', fromFound: !!fromLesson, toFound: !!toLesson },
        { status: 404 }
      )
    }

    await prisma.$transaction([
      prisma.lesson.update({
        where: { id: fromLesson.id },
        data: {
          content: toLesson.content,
          slides: toLesson.slides as any,
        },
      }),
      prisma.lesson.update({
        where: { id: toLesson.id },
        data: {
          content: fromLesson.content,
          slides: fromLesson.slides as any,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: `Swapped slides/content between lesson ${fromOrder} and lesson ${toOrder}`,
      from: { order: fromLesson.order, title: fromLesson.title },
      to: { order: toLesson.order, title: toLesson.title },
    })
  } catch (error) {
    console.error('Error swapping lesson slides:', error)
    return NextResponse.json(
      { error: 'Failed to swap lesson slides: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
