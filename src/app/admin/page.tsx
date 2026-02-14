'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Stats {
  totalUsers: number
  totalPurchases: number
  totalRevenue: number
  activeUsers: number
  totalLessons: number
  publishedLessons: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState('')
  const [seedError, setSeedError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/');
      }
    } else if (status === "unauthenticated") {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === 'ADMIN') {
      fetchStats();
    }
  }, [status, session]);



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
    <div className="space-y-6">
      <section className="rounded-lg border border-amber-200 bg-white p-6">
        <h1 className="font-serif text-3xl text-stone-900">Admin Overview</h1>
        <p className="mt-2 text-sm text-stone-600">
          Operational metrics and quick management actions.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-lg border border-amber-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-stone-500">Total Users</p>
          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {loading ? '...' : stats?.totalUsers || 0}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-stone-500">Active Users (7d)</p>
          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {loading ? '...' : stats?.activeUsers || 0}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-stone-500">Purchases</p>
          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {loading ? '...' : stats?.totalPurchases || 0}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-stone-500">Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-amber-900">
            ${loading ? '...' : (stats?.totalRevenue || 0).toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-stone-500">Total Lessons</p>
          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {loading ? '...' : stats?.totalLessons || 0}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-stone-500">Published Lessons</p>
          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {loading ? '...' : stats?.publishedLessons || 0}
          </p>
        </div>
      </section>

      {stats && stats.totalLessons === 0 && (
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-900">Database is empty</h2>
          <p className="mt-2 text-sm text-amber-900/80">
            Seed the database to create the initial course and lessons.
          </p>
          <button
            onClick={seedDatabase}
            disabled={seeding}
            className="mt-4 rounded-md bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800 disabled:opacity-50"
          >
            {seeding ? 'Seeding...' : 'Seed Database'}
          </button>
          {seedMessage && <p className="mt-3 text-sm font-medium">{seedMessage}</p>}
          {seedError && <pre className="mt-2 rounded bg-red-100 p-3 text-xs text-red-800">{seedError}</pre>}
        </section>
      )}

      <section className="rounded-lg border border-amber-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/create-lesson"
            className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-900 hover:bg-amber-100"
          >
            Create Lesson
          </Link>
          <Link
            href="/admin/lessons"
            className="rounded-md border border-stone-300 px-4 py-3 font-semibold text-stone-800 hover:bg-stone-100"
          >
            Manage Lessons
          </Link>
          <Link
            href="/admin/lesson-editor"
            className="rounded-md border border-stone-300 px-4 py-3 font-semibold text-stone-800 hover:bg-stone-100"
          >
            Lesson Editor
          </Link>
          <Link
            href="/admin/questions"
            className="rounded-md border border-stone-300 px-4 py-3 font-semibold text-stone-800 hover:bg-stone-100"
          >
            Question Generator
          </Link>
          <Link
            href="/admin/users"
            className="rounded-md border border-stone-300 px-4 py-3 font-semibold text-stone-800 hover:bg-stone-100"
          >
            Users and Sales
          </Link>
          <Link
            href="/admin/audio-generator"
            className="rounded-md border border-stone-300 px-4 py-3 font-semibold text-stone-800 hover:bg-stone-100"
          >
            Audio Generator
          </Link>
          <Link
            href="/admin/settings"
            className="rounded-md border border-stone-300 px-4 py-3 font-semibold text-stone-800 hover:bg-stone-100"
          >
            Settings
          </Link>
          <button
            onClick={() => fetchStats()}
            className="rounded-md border border-stone-300 px-4 py-3 text-left font-semibold text-stone-800 hover:bg-stone-100"
          >
            Refresh Metrics
          </button>
          <Link
            href="/api/health"
            target="_blank"
            className="rounded-md border border-stone-300 px-4 py-3 font-semibold text-stone-800 hover:bg-stone-100"
          >
            Health Endpoint
          </Link>
        </div>
        {seedMessage && <p className="mt-3 text-sm font-medium">{seedMessage}</p>}
      </section>
    </div>
  )
}
