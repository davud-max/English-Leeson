import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getAnalytics() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Funnel metrics
  const pageViews = await prisma.event.count({
    where: {
      eventType: 'page_view',
      timestamp: { gte: thirtyDaysAgo },
    },
  })

  const ctaClicks = await prisma.event.count({
    where: {
      eventType: 'cta_click',
      timestamp: { gte: thirtyDaysAgo },
    },
  })

  const checkoutStarts = await prisma.event.count({
    where: {
      eventType: 'checkout_started',
      timestamp: { gte: thirtyDaysAgo },
    },
  })

  const purchases = await prisma.purchase.count({
    where: {
      status: 'COMPLETED',
      completedAt: { gte: thirtyDaysAgo },
    },
  })

  // Learning analytics
  const lessonCompletions = await prisma.progress.groupBy({
    by: ['lessonId'],
    where: {
      completed: true,
      completedAt: { gte: thirtyDaysAgo },
    },
    _count: true,
  })

  const lessons = await prisma.lesson.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, order: true, title: true },
  })

  const lessonStats = lessons.map((lesson) => {
    const completions = lessonCompletions.find((l) => l.lessonId === lesson.id)?._count || 0
    return {
      lesson: `${lesson.order}. ${lesson.title}`,
      completions,
    }
  })

  return {
    funnel: {
      pageViews,
      ctaClicks,
      checkoutStarts,
      purchases,
      ctrRate: pageViews > 0 ? ((ctaClicks / pageViews) * 100).toFixed(2) : '0',
      checkoutRate: ctaClicks > 0 ? ((checkoutStarts / ctaClicks) * 100).toFixed(2) : '0',
      conversionRate: checkoutStarts > 0 ? ((purchases / checkoutStarts) * 100).toFixed(2) : '0',
    },
    lessons: lessonStats,
  }
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const analytics = await getAnalytics()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <Link href="/admin" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Conversion Funnel (Last 30 Days)</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded">
              <span className="font-medium">Landing Page Views</span>
              <span className="text-2xl font-bold">{analytics.funnel.pageViews}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-100 rounded">
              <span className="font-medium">Buy Button Clicks</span>
              <div className="text-right">
                <span className="text-2xl font-bold block">{analytics.funnel.ctaClicks}</span>
                <span className="text-sm text-gray-600">CTR: {analytics.funnel.ctrRate}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-200 rounded">
              <span className="font-medium">Checkout Started</span>
              <div className="text-right">
                <span className="text-2xl font-bold block">{analytics.funnel.checkoutStarts}</span>
                <span className="text-sm text-gray-600">Rate: {analytics.funnel.checkoutRate}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-100 rounded">
              <span className="font-medium">Successful Purchases</span>
              <div className="text-right">
                <span className="text-2xl font-bold block">{analytics.funnel.purchases}</span>
                <span className="text-sm text-gray-600">Conversion: {analytics.funnel.conversionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Completion Rates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Lesson Completion Rates (Last 30 Days)</h2>
          <div className="space-y-3">
            {analytics.lessons.map((lesson, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">{lesson.lesson}</span>
                <span className="text-sm font-bold text-gray-900">{lesson.completions} completions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
