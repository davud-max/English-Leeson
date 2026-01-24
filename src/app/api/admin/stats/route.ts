import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalUsers, totalPurchases, totalRevenue, totalLessons, publishedLessons] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }).catch(() => 0),
      prisma.purchase.count({ where: { status: 'COMPLETED' } }).catch(() => 0),
      prisma.purchase.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }).catch(() => ({ _sum: { amount: 0 } })),
      prisma.lesson.count().catch(() => 0),
      prisma.lesson.count({ where: { published: true } }).catch(() => 0),
    ])

    // Active users - simplified to avoid complex query issues
    let activeUsers = 0
    try {
      activeUsers = await prisma.user.count({
        where: {
          events: {
            some: {
              timestamp: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      })
    } catch {
      activeUsers = 0
    }

    return NextResponse.json({
      totalUsers,
      totalPurchases,
      totalRevenue: totalRevenue._sum?.amount || 0,
      activeUsers,
      totalLessons,
      publishedLessons,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({
      totalUsers: 0,
      totalPurchases: 0,
      totalRevenue: 0,
      activeUsers: 0,
      totalLessons: 0,
      publishedLessons: 0,
    })
  }
}
