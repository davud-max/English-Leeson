import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const CONFIG_KEY = 'CONFIG_FREE_LESSONS'

// GET - получить список бесплатных уроков
export async function GET() {
  try {
    const setting = await prisma.event.findFirst({
      where: { eventType: CONFIG_KEY },
      orderBy: { timestamp: 'desc' },
    })

    const freeLessons: number[] = setting?.metadata
      ? (setting.metadata as any).lessons || [1]
      : [1]

    return NextResponse.json({ freeLessons })
  } catch (error) {
    console.error('Error fetching free lessons:', error)
    return NextResponse.json({ freeLessons: [1] })
  }
}

// PUT - обновить список бесплатных уроков
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { freeLessons } = body

    if (!Array.isArray(freeLessons)) {
      return NextResponse.json({ error: 'freeLessons must be an array' }, { status: 400 })
    }

    // Удаляем старые записи конфига
    await prisma.event.deleteMany({
      where: { eventType: CONFIG_KEY },
    })

    // Создаём новую
    await prisma.event.create({
      data: {
        eventType: CONFIG_KEY,
        metadata: { lessons: freeLessons },
      },
    })

    return NextResponse.json({ success: true, freeLessons })
  } catch (error) {
    console.error('Error updating free lessons:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
