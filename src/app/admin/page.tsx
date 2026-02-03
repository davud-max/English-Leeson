'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  totalUsers: number
  totalPurchases: number
  totalRevenue: number
  activeUsers: number
  totalLessons: number
  publishedLessons: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState('')
  const [seedError, setSeedError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const seedDatabase = async () => {
    setSeeding(true)
    setSeedMessage('')
    setSeedError(null)
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        setSeedMessage(`✅ ${data.message}`)
        fetchStats()
      } else {
        setSeedMessage(`❌ Error: ${data.error}`)
        setSeedError(`Details: ${data.message || 'Unknown error'}`)
      }
    } catch (error) {
      setSeedMessage('❌ Failed to seed database')
      setSeedError(error instanceof Error ? error.message : String(error))
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Algorithms of Thinking and Cognition</p>
            </div>
            <Link 
              href="/" 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats?.totalUsers || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">🟢</div>
            <p className="text-gray-500 text-sm">Active (7d)</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats?.activeUsers || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">💳</div>
            <p className="text-gray-500 text-sm">Purchases</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats?.totalPurchases || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-gray-500 text-sm">Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ${loading ? '...' : (stats?.totalRevenue || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-gray-500 text-sm">Total Lessons</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats?.totalLessons || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-500 text-sm">Published</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats?.publishedLessons || 0}
            </p>
          </div>
        </div>

        {/* Create New Lesson - Main CTA */}
        <Link href="/admin/create-lesson" className="block mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition text-white">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎓</div>
              <div>
                <h2 className="text-2xl font-bold mb-1">🚀 Universal Lesson Creator</h2>
                <p className="text-indigo-100">
                  Введите текст на русском → Автоперевод → page.tsx + аудио скрипт + вопросы для теста + обновление списка уроков
                </p>
              </div>
              <div className="ml-auto text-4xl">→</div>
            </div>
          </div>
        </Link>

        {/* Seed Database Section */}
        {stats && stats.totalLessons === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Database Empty</h2>
            <p className="text-yellow-700 mb-4">
              No lessons found. Click below to seed with all 17 lessons.
            </p>
            <button
              onClick={seedDatabase}
              disabled={seeding}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 font-medium"
            >
              {seeding ? '⏳ Seeding...' : '🌱 Seed Database'}
            </button>
            {seedMessage && <p className="mt-3 text-sm font-medium">{seedMessage}</p>}
            {seedError && <pre className="mt-2 p-3 bg-red-100 text-red-800 text-xs rounded">{seedError}</pre>}
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Link href="/admin/create-lesson" className="block">
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition border-l-4 border-indigo-500 h-full">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold text-gray-900 mb-1">Lesson Creator</h3>
              <p className="text-gray-600 text-xs">Full: page + audio + quiz</p>
            </div>
          </Link>
          
          <Link href="/admin/lessons" className="block">
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition border-l-4 border-blue-500 h-full">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-bold text-gray-900 mb-1">Manage Lessons</h3>
              <p className="text-gray-600 text-xs">Edit content in database</p>
            </div>
          </Link>

          <Link href="/admin/lesson-editor" className="block">
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition border-l-4 border-purple-500 h-full">
              <div className="text-3xl mb-2">✏️</div>
              <h3 className="font-bold text-gray-900 mb-1">Lesson Editor</h3>
              <p className="text-gray-600 text-xs">Edit slides + audio + quiz</p>
            </div>
          </Link>
          
          <Link href="/admin/questions" className="block">
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition border-l-4 border-amber-500 h-full">
              <div className="text-3xl mb-2">🎤</div>
              <h3 className="font-bold text-gray-900 mb-1">Voice Quiz</h3>
              <p className="text-gray-600 text-xs">Generate quiz questions</p>
            </div>
          </Link>
          
          <Link href="/admin/users" className="block">
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition border-l-4 border-green-500 h-full">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-bold text-gray-900 mb-1">Users & Sales</h3>
              <p className="text-gray-600 text-xs">View users, purchases</p>
            </div>
          </Link>
          
          <Link href="/admin/audio-generator" className="block">
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition border-l-4 border-purple-500 h-full">
              <div className="text-3xl mb-2">🔊</div>
              <h3 className="font-bold text-gray-900 mb-1">Audio Generator</h3>
              <p className="text-gray-600 text-xs">Generate TTS scripts</p>
            </div>
          </Link>
          
          <Link href="/admin/settings" className="block">
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition border-l-4 border-orange-500 h-full">
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="font-bold text-gray-900 mb-1">Settings</h3>
              <p className="text-gray-600 text-xs">Course configuration</p>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/lessons" target="_blank" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
              👁️ View Lessons
            </Link>
            <button 
              onClick={seedDatabase}
              disabled={seeding}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
            >
              🌱 {seeding ? 'Seeding...' : 'Seed DB'}
            </button>
            <button 
              onClick={() => fetchStats()}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              🔄 Refresh
            </button>
            <Link href="/api/health" target="_blank" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
              🩺 Health
            </Link>
          </div>
          {seedMessage && <p className="mt-3 text-sm font-medium">{seedMessage}</p>}
        </div>
      </main>
    </div>
  )
}
