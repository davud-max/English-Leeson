'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Lesson {
  id: string
  order: number
  title: string
  description: string
  content: string
  duration: number
  published: boolean
  updatedAt: string
  course?: {
    id: string
    title: string
  }
}

export default function ContentManagement() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string>('')

  // New lesson form
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    content: '',
    duration: 25,
    published: false,
  })

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const res = await fetch('/api/admin/lessons')
      if (res.ok) {
        const data = await res.json()
        setLessons(data)
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveLesson = async () => {
    if (!editingLesson) return
    
    setSaveStatus('Saving...')
    try {
      const res = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLesson),
      })
      
      if (res.ok) {
        setSaveStatus('Saved!')
        fetchLessons()
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        setSaveStatus('Error saving')
      }
    } catch (error) {
      setSaveStatus('Error saving')
    }
  }

  const createLesson = async () => {
    setSaveStatus('Creating...')
    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLesson),
      })
      
      if (res.ok) {
        setSaveStatus('Created!')
        setIsCreating(false)
        setNewLesson({
          title: '',
          description: '',
          content: '',
          duration: 25,
          published: false,
        })
        fetchLessons()
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        setSaveStatus('Error creating')
      }
    } catch (error) {
      setSaveStatus('Error creating')
    }
  }

  const deleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return
    }
    
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        fetchLessons()
        if (editingLesson?.id === id) {
          setEditingLesson(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete lesson:', error)
    }
  }

  const togglePublished = async (lesson: Lesson) => {
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !lesson.published }),
      })
      
      if (res.ok) {
        fetchLessons()
      }
    } catch (error) {
      console.error('Failed to toggle published:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
              <p className="text-gray-600 text-sm">Manage lessons, content, and publication status</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                ← Dashboard
              </Link>
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Add Lesson
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-900">Lessons ({lessons.length})</h2>
              </div>
              <div className="divide-y max-h-[calc(100vh-250px)] overflow-y-auto">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      editingLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setEditingLesson(lesson)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">#{lesson.order}</span>
                          {lesson.published ? (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                              Draft
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm">{lesson.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{lesson.duration} min</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {isCreating ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-900">Create New Lesson</h2>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Lesson title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={newLesson.description}
                      onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                      <input
                        type="number"
                        value={newLesson.duration}
                        onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 25 })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newLesson.published}
                          onChange={(e) => setNewLesson({ ...newLesson, published: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Publish immediately</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
                    <textarea
                      value={newLesson.content}
                      onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      rows={12}
                      placeholder="# Lesson Title&#10;&#10;Content here..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsCreating(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createLesson}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Create Lesson
                    </button>
                  </div>
                </div>
              </div>
            ) : editingLesson ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-gray-900">Edit Lesson #{editingLesson.order}</h2>
                    <p className="text-sm text-gray-500">Last updated: {new Date(editingLesson.updatedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {saveStatus && (
                      <span className={`text-sm ${saveStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                        {saveStatus}
                      </span>
                    )}
                    <button
                      onClick={saveLesson}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingLesson.title}
                      onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={editingLesson.description}
                      onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                      <input
                        type="number"
                        value={editingLesson.order}
                        onChange={(e) => setEditingLesson({ ...editingLesson, order: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                      <input
                        type="number"
                        value={editingLesson.duration}
                        onChange={(e) => setEditingLesson({ ...editingLesson, duration: parseInt(e.target.value) || 25 })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-end gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingLesson.published}
                          onChange={(e) => setEditingLesson({ ...editingLesson, published: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Published</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content (Markdown) — {editingLesson.content.length} characters
                    </label>
                    <textarea
                      value={editingLesson.content}
                      onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      rows={16}
                    />
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <button
                      onClick={() => deleteLesson(editingLesson.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      🗑️ Delete Lesson
                    </button>
                    <div className="flex gap-3">
                      <Link
                        href={`/lessons/${editingLesson.order}`}
                        target="_blank"
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        👁️ Preview
                      </Link>
                      <button
                        onClick={saveLesson}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Lesson to Edit</h3>
                <p className="text-gray-600 mb-6">Click on any lesson from the list to start editing</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  + Create New Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
