import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const course = await prisma.course.findFirst({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        published: true,
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, price, currency, published } = body

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        price,
        currency,
        published,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}
