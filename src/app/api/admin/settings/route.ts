import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET course settings
export async function GET() {
  try {
    const course = await prisma.course.findFirst()
    
    if (!course) {
      return NextResponse.json({
        title: 'Algorithms of Thinking and Cognition',
        description: 'A Philosophical Course for the Development of Critical Thinking',
        price: 30,
        currency: 'USD',
        published: true
      })
    }
    
    return NextResponse.json({
      title: course.title,
      description: course.description,
      price: course.price,
      currency: course.currency,
      published: course.published
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT update course settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, currency, published } = body
    
    // Find existing course or create one
    let course = await prisma.course.findFirst()
    
    if (course) {
      course = await prisma.course.update({
        where: { id: course.id },
        data: {
          title,
          description,
          price,
          currency,
          published
        }
      })
    } else {
      course = await prisma.course.create({
        data: {
          id: 'main-course',
          title,
          description,
          price,
          currency,
          published
        }
      })
    }
    
    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
