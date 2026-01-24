import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalUsers, totalPurchases, totalRevenue, activeUsers, totalLessons, publishedLessons] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.purchase.count({ where: { status: 'COMPLETED' } }),
      prisma.purchase.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.user.count({
        where: {
          events: {
            some: {
              timestamp: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      }),
      prisma.lesson.count(),
      prisma.lesson.count({ where: { published: true } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalPurchases,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeUsers,
      totalLessons,
      publishedLessons,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
