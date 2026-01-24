import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        enrollments: {
          select: {
            enrolledAt: true,
            course: {
              select: { title: true }
            }
          }
        },
        purchases: {
          select: {
            amount: true,
            status: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            progress: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
