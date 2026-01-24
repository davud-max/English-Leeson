'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AnalyticsData {
  dailySignups: { date: string; count: number }[]
  dailyPurchases: { date: string; count: number; revenue: number }[]
  topLessons: { title: string; views: number }[]
  conversionRate: number
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(true)

  // Placeholder data - in real app, fetch from API
  const data: AnalyticsData = {
    dailySignups: [
      { date: '2025-01-20', count: 3 },
      { date: '2025-01-21', count: 5 },
      { date: '2025-01-22', count: 2 },
      { date: '2025-01-23', count: 4 },
      { date: '2025-01-24', count: 6 },
    ],
    dailyPurchases: [
      { date: '2025-01-20', count: 1, revenue: 30 },
      { date: '2025-01-21', count: 2, revenue: 60 },
      { date: '2025-01-22', count: 0, revenue: 0 },
      { date: '2025-01-23', count: 1, revenue: 30 },
      { date: '2025-01-24', count: 3, revenue: 90 },
    ],
    topLessons: [
      { title: 'Terms and Definitions', views: 156 },
      { title: 'What Is Counting?', views: 98 },
      { title: 'What Is a Formula?', views: 87 },
      { title: 'Abstraction and Rules', views: 65 },
      { title: 'Theory of Cognitive Resonance', views: 54 },
    ],
    conversionRate: 12.5,
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500)
  }, [])

  const totalSignups = data.dailySignups.reduce((sum, d) => sum + d.count, 0)
  const totalPurchases = data.dailyPurchases.reduce((sum, d) => sum + d.count, 0)
  const totalRevenue = data.dailyPurchases.reduce((sum, d) => sum + d.revenue, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 Analytics</h1>
              <p className="text-gray-600 text-sm">Track course performance and user engagement</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Period Selector */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setPeriod('7d')}
            className={`px-4 py-2 rounded-lg ${
              period === '7d' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-4 py-2 rounded-lg ${
              period === '30d' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setPeriod('90d')}
            className={`px-4 py-2 rounded-lg ${
              period === '90d' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Last 90 days
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">New Users</p>
                <p className="text-3xl font-bold text-gray-900">{totalSignups}</p>
                <p className="text-green-600 text-sm">↑ +12% from last period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">Purchases</p>
                <p className="text-3xl font-bold text-gray-900">{totalPurchases}</p>
                <p className="text-green-600 text-sm">↑ +8% from last period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">Revenue</p>
                <p className="text-3xl font-bold text-green-600">${totalRevenue}</p>
                <p className="text-green-600 text-sm">↑ +15% from last period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{data.conversionRate}%</p>
                <p className="text-gray-500 text-sm">Visitors → Purchases</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Signups Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Daily Signups</h2>
                <div className="flex items-end gap-2 h-40">
                  {data.dailySignups.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${(day.count / 10) * 100}%`, minHeight: '4px' }}
                      />
                      <span className="text-xs text-gray-500 mt-2">
                        {day.date.split('-')[2]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Daily Revenue</h2>
                <div className="flex items-end gap-2 h-40">
                  {data.dailyPurchases.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${(day.revenue / 100) * 100}%`, minHeight: '4px' }}
                      />
                      <span className="text-xs text-gray-500 mt-2">
                        {day.date.split('-')[2]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Lessons */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Top Lessons by Views</h2>
              <div className="space-y-3">
                {data.topLessons.map((lesson, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-gray-400 w-6">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{lesson.title}</span>
                        <span className="text-sm text-gray-500">{lesson.views} views</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${(lesson.views / data.topLessons[0].views) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
