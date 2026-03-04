import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
}

export async function GET() {
  try {
    const course = await prisma.course.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: {
        title: true,
        description: true,
        price: true,
        currency: true,
        published: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        {
          title: 'Algorithms of Thinking and Cognition',
          description: 'A Philosophical Course for the Development of Critical Thinking',
          price: 30,
          currency: 'USD',
          published: true,
        },
        { headers: noStoreHeaders },
      )
    }

    return NextResponse.json(course, { headers: noStoreHeaders })
  } catch (error) {
    console.error('Error fetching public course:', error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500, headers: noStoreHeaders })
  }
}
