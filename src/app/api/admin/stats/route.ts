import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
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
                gte: sevenDaysAgo,
              },
            },
          },
        },
      })
    } catch {
      activeUsers = 0
    }

    let logins7d = 0
    let adminLogins7d = 0
    try {
      ;[logins7d, adminLogins7d] = await Promise.all([
        prisma.event.count({
          where: {
            eventType: { in: ['user_login', 'admin_login'] },
            timestamp: { gte: sevenDaysAgo },
          },
        }),
        prisma.event.count({
          where: {
            eventType: 'admin_login',
            timestamp: { gte: sevenDaysAgo },
          },
        }),
      ])
    } catch {
      logins7d = 0
      adminLogins7d = 0
    }

    return NextResponse.json({
      totalUsers,
      totalPurchases,
      totalRevenue: totalRevenue._sum?.amount || 0,
      activeUsers,
      totalLessons,
      publishedLessons,
      logins7d,
      adminLogins7d,
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
      logins7d: 0,
      adminLogins7d: 0,
    })
  }
}
