'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  enrollments: {
    course: { title: string }
    enrolledAt: string
  }[]
  purchases: {
    amount: number
    status: string
    createdAt: string
  }[]
  _count: {
    progress: number
  }
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'paid'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = !search || 
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.name?.toLowerCase().includes(search.toLowerCase())
    
    // Status filter
    let matchesFilter = true
    if (filter === 'enrolled') {
      matchesFilter = user.enrollments.length > 0
    } else if (filter === 'paid') {
      matchesFilter = user.purchases.some(p => p.status === 'COMPLETED')
    }
    
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: users.length,
    enrolled: users.filter(u => u.enrollments.length > 0).length,
    paid: users.filter(u => u.purchases.some(p => p.status === 'COMPLETED')).length,
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">👥 Users Management</h1>
              <p className="text-gray-600 text-sm">{users.length} users registered</p>
            </div>
            <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Enrolled</p>
            <p className="text-2xl font-bold text-blue-600">{stats.enrolled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100'
                    }`}
                  >
                    All ({stats.total})
                  </button>
                  <button
                    onClick={() => setFilter('enrolled')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filter === 'enrolled' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}
                  >
                    Enrolled ({stats.enrolled})
                  </button>
                  <button
                    onClick={() => setFilter('paid')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filter === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-100'
                    }`}
                  >
                    Paid ({stats.paid})
                  </button>
                </div>
              </div>

              <div className="divide-y max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No users found</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                        selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {user.name || 'No name'}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                          {user.purchases.some(p => p.status === 'COMPLETED') && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              💳 Paid
                            </span>
                          )}
                          {user.enrollments.length > 0 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                              📚 Enrolled
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                        {user._count.progress > 0 && ` • ${user._count.progress} lessons completed`}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="lg:col-span-1">
            {selectedUser ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-gray-900">User Details</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedUser.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registered</p>
                    <p className="font-medium">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lessons Completed</p>
                    <p className="font-medium">{selectedUser._count.progress}</p>
                  </div>

                  {selectedUser.purchases.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Purchases</p>
                      {selectedUser.purchases.map((purchase, i) => (
                        <div key={i} className="text-sm p-2 bg-gray-50 rounded mb-2">
                          <p>${purchase.amount} - {purchase.status}</p>
                          <p className="text-gray-500">
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedUser.enrollments.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Enrollments</p>
                      {selectedUser.enrollments.map((enrollment, i) => (
                        <div key={i} className="text-sm p-2 bg-gray-50 rounded mb-2">
                          <p>{enrollment.course.title}</p>
                          <p className="text-gray-500">
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-4xl mb-3">👤</div>
                <p className="text-gray-500">Select a user to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
