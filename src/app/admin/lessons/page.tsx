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
  createdAt: string
  updatedAt: string
}

export default function LessonsManagement() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    duration: 25,
    published: false,
    order: 1,
  })

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const res = await fetch('/api/admin/lessons')
      if (res.ok) {
        const data = await res.json()
        // API returns { lessons: [...] } or array directly
        const lessonsArray = Array.isArray(data) ? data : (data.lessons || [])
        setLessons(lessonsArray)
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setFormData({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      duration: lesson.duration,
      published: lesson.published,
      order: lesson.order,
    })
    setIsEditing(true)
    setIsCreating(false)
  }

  const startCreate = () => {
    const nextOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order)) + 1 : 1
    setFormData({
      title: '',
      description: '',
      content: '# New Lesson\n\nContent here...',
      duration: 25,
      published: false,
      order: nextOrder,
    })
    setSelectedLesson(null)
    setIsCreating(true)
    setIsEditing(false)
  }

  const saveLesson = async () => {
    setSaveStatus('Saving...')
    try {
      const url = isCreating 
        ? '/api/admin/lessons' 
        : `/api/admin/lessons/${selectedLesson?.id}`
      
      const res = await fetch(url, {
        method: isCreating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSaveStatus('✓ Saved!')
        fetchLessons()
        if (isCreating) {
          setIsCreating(false)
        }
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        const error = await res.json()
        setSaveStatus(`Error: ${error.error}`)
      }
    } catch (error) {
      setSaveStatus('Error saving')
    }
  }

  const deleteLesson = async () => {
    if (!selectedLesson) return
    if (!confirm(`Delete "${selectedLesson.title}"? This cannot be undone.`)) return

    try {
      const res = await fetch(`/api/admin/lessons/${selectedLesson.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchLessons()
        setSelectedLesson(null)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const togglePublish = async (lesson: Lesson) => {
    try {
      await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !lesson.published }),
      })
      fetchLessons()
    } catch (error) {
      console.error('Failed to toggle:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📚 Lessons Management</h1>
              <p className="text-gray-600 text-sm">{lessons.length} lessons total</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                ← Dashboard
              </Link>
              <button
                onClick={startCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Add Lesson
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b font-semibold text-gray-700">
                Lessons
              </div>
              <div className="divide-y max-h-[70vh] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : lessons.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No lessons yet. Create your first lesson!
                  </div>
                ) : (
                  lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => selectLesson(lesson)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                        selectedLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          Lesson {lesson.order}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePublish(lesson)
                          }}
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            lesson.published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {lesson.published ? '✓ Published' : 'Draft'}
                        </button>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {lesson.duration} min • {lesson.content.length} chars
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {(isEditing || isCreating) ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-semibold text-gray-900">
                    {isCreating ? '➕ Create New Lesson' : `✏️ Edit Lesson #${selectedLesson?.order}`}
                  </h2>
                  <div className="flex items-center gap-3">
                    {saveStatus && (
                      <span className={`text-sm ${saveStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                        {saveStatus}
                      </span>
                    )}
                    <button
                      onClick={saveLesson}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      💾 Save
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Lesson title..."
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description for lesson list..."
                    />
                  </div>

                  {/* Order, Duration, Published */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order #
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 25 })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer p-2">
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Published</span>
                      </label>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content (Markdown) — {formData.content.length} characters
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      rows={14}
                      placeholder="# Lesson Title&#10;&#10;Lesson content in Markdown..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-4 border-t">
                    <div>
                      {!isCreating && (
                        <button
                          onClick={deleteLesson}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          🗑️ Delete Lesson
                        </button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {!isCreating && selectedLesson && (
                        <Link
                          href={`/lessons/${selectedLesson.order}`}
                          target="_blank"
                          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                          👁️ Preview
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setIsCreating(false)
                          setSelectedLesson(null)
                        }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveLesson}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        💾 Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Lesson to Edit
                </h3>
                <p className="text-gray-600 mb-6">
                  Click on any lesson from the list, or create a new one
                </p>
                <button
                  onClick={startCreate}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + Create New Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
