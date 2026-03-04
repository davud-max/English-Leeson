import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let course = await prisma.course.findFirst({
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
      // Return default values if no course exists
      return NextResponse.json({
        id: null,
        title: 'Algorithms of Thinking and Cognition',
        description: 'A Philosophical Course for the Development of Critical Thinking',
        price: 30,
        currency: 'USD',
        published: true,
      })
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

    const safePrice = typeof price === 'string' ? parseFloat(price) : (typeof price === 'number' ? price : 30)

    let course
    
    if (id) {
      course = await prisma.course.update({
        where: { id },
        data: {
          title,
          description,
          price: safePrice,
          currency,
          published,
        },
      })
    } else {
      // Try to find existing course first
      const existing = await prisma.course.findFirst()
      if (existing) {
        course = await prisma.course.update({
          where: { id: existing.id },
          data: {
            title,
            description,
            price: safePrice,
            currency,
            published,
          },
        })
      } else {
        course = await prisma.course.create({
          data: {
            id: 'main-course',
            title,
            description,
            price: safePrice,
            currency,
            published,
          },
        })
      }
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}
