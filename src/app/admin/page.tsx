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
      console.log('Seed response:', data)
      
      if (res.ok) {
        setSeedMessage(`✅ ${data.message}`)
        if (data.errors && data.errors.length > 0) {
          setSeedError(`Warnings: ${data.errors.join(', ')}`)
        }
        fetchStats() // Refresh stats
      } else {
        setSeedMessage(`❌ Error: ${data.error}`)
        setSeedError(`Details: ${data.message || 'Unknown error'}\n${data.stack || ''}`)
      }
    } catch (error) {
      setSeedMessage('❌ Failed to seed database')
      setSeedError(error instanceof Error ? error.message : String(error))
    } finally {
      setSeeding(false)
    }
  }

  const checkDatabase = async () => {
    try {
      const res = await fetch('/api/admin/seed')
      const data = await res.json()
      alert(JSON.stringify(data, null, 2))
    } catch (error) {
      alert('Error: ' + String(error))
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

        {/* Seed Database Section */}
        {stats && stats.totalLessons === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Database Empty</h2>
            <p className="text-yellow-700 mb-4">
              No lessons found in the database. Click the button below to seed the database with all 17 lessons.
            </p>
            <div className="flex gap-3">
              <button
                onClick={seedDatabase}
                disabled={seeding}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 font-medium"
              >
                {seeding ? '⏳ Seeding...' : '🌱 Seed Database'}
              </button>
              <button
                onClick={checkDatabase}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                🔍 Check DB Status
              </button>
            </div>
            {seedMessage && (
              <p className="mt-3 text-sm font-medium">{seedMessage}</p>
            )}
            {seedError && (
              <pre className="mt-2 p-3 bg-red-100 text-red-800 text-xs rounded overflow-auto max-h-40">
                {seedError}
              </pre>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/lessons" className="block">
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition border-l-4 border-blue-500">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Lessons</h3>
              <p className="text-gray-600 text-sm">Add, edit, delete lessons. Manage content and slides.</p>
            </div>
          </Link>
          
          <Link href="/admin/users" className="block">
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition border-l-4 border-green-500">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Users & Sales</h3>
              <p className="text-gray-600 text-sm">View users, purchases, and enrollment status.</p>
            </div>
          </Link>
          
          <Link href="/admin/slides" className="block">
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition border-l-4 border-purple-500">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Slide Editor</h3>
              <p className="text-gray-600 text-sm">Edit interactive lesson slides and audio.</p>
            </div>
          </Link>
          
          <Link href="/admin/settings" className="block">
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition border-l-4 border-orange-500">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Settings</h3>
              <p className="text-gray-600 text-sm">Course settings, pricing, and configuration.</p>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/lessons" 
              target="_blank"
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              👁️ View Lessons Page
            </Link>
            <Link 
              href="/admin/audio-generator" 
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              🔊 Audio Generator
            </Link>
            <Link 
              href="/api/health" 
              target="_blank"
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              🩺 Health Check
            </Link>
            <button 
              onClick={seedDatabase}
              disabled={seeding}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
            >
              🌱 {seeding ? 'Seeding...' : 'Seed Database'}
            </button>
            <button 
              onClick={checkDatabase}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              🔍 Check DB
            </button>
            <button 
              onClick={() => {
                fetchStats()
                setSeedMessage('')
                setSeedError(null)
              }}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              🔄 Refresh Stats
            </button>
          </div>
          {seedMessage && (
            <p className="mt-3 text-sm font-medium">{seedMessage}</p>
          )}
          {seedError && (
            <pre className="mt-2 p-3 bg-red-100 text-red-800 text-xs rounded overflow-auto max-h-40">
              {seedError}
            </pre>
          )}
        </div>
      </main>
    </div>
  )
}
