import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  const [totalUsers, totalPurchases, totalRevenue, activeUsers] = await Promise.all([
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
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        },
      },
    }),
  ])

  return {
    totalUsers,
    totalPurchases,
    totalRevenue: totalRevenue._sum.amount || 0,
    activeUsers,
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const stats = await getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Site
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Purchases</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPurchases}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Active Users (7d)</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users" className="block">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">Users & Sales</h3>
              <p className="text-gray-600">Manage users, view purchases, and track enrollments</p>
            </div>
          </Link>
          <Link href="/admin/content" className="block">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">Content Management</h3>
              <p className="text-gray-600">Create and edit lessons, manage course content</p>
            </div>
          </Link>
          <Link href="/admin/analytics" className="block">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-gray-600">View detailed analytics and reports</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
