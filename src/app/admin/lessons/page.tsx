'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

interface Lesson {
  id: string
  order: number
  title: string
  description: string
  content: string
  duration: number
  published: boolean
  emoji?: string
  color?: string
  available?: boolean
  createdAt: string
  updatedAt: string
}

const EMOJI_OPTIONS = ['📖', '📐', '🔢', '📊', '🧠', '🎭', '💼', '💰', '📻', '🔮', '⬆️', '🌍', '🌌', '🌐', '➖', '🎯', '🔄', '🌊', '⚡', '👁️', '✨', '💡', '🔍', '📝']

const COLOR_OPTIONS = [
  { value: 'from-blue-500 to-indigo-600', label: '🔵 Blue', preview: 'bg-blue-500' },
  { value: 'from-green-500 to-emerald-600', label: '🟢 Green', preview: 'bg-green-500' },
  { value: 'from-purple-500 to-violet-600', label: '🟣 Purple', preview: 'bg-purple-500' },
  { value: 'from-orange-500 to-red-600', label: '🟠 Orange', preview: 'bg-orange-500' },
  { value: 'from-teal-500 to-cyan-600', label: '🩵 Teal', preview: 'bg-teal-500' },
  { value: 'from-amber-500 to-yellow-600', label: '🟡 Amber', preview: 'bg-amber-500' },
  { value: 'from-rose-500 to-pink-600', label: '🩷 Rose', preview: 'bg-rose-500' },
  { value: 'from-emerald-500 to-green-600', label: '💚 Emerald', preview: 'bg-emerald-500' },
  { value: 'from-indigo-500 to-blue-600', label: '💙 Indigo', preview: 'bg-indigo-500' },
  { value: 'from-fuchsia-500 to-pink-600', label: '💜 Fuchsia', preview: 'bg-fuchsia-500' },
  { value: 'from-red-500 to-rose-600', label: '❤️ Red', preview: 'bg-red-500' },
  { value: 'from-sky-500 to-cyan-600', label: '🩵 Sky', preview: 'bg-sky-500' },
  { value: 'from-gray-500 to-slate-600', label: '⚫ Gray', preview: 'bg-gray-500' },
]

export default function LessonsManagement() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    duration: 25,
    published: true,
    order: 1,
    emoji: '📖',
    color: 'from-blue-500 to-indigo-600',
    available: true,
  })

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const originalDataRef = useRef<string>('')

  useEffect(() => {
    fetchLessons()
  }, [])

  // Автосохранение при изменениях
  useEffect(() => {
    if (!isEditing || !selectedLesson) return
    
    const currentData = JSON.stringify(formData)
    if (currentData !== originalDataRef.current) {
      setHasChanges(true)
      
      // Debounce автосохранения - 2 секунды
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        saveLesson(true)
      }, 2000)
    } else {
      setHasChanges(false)
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [formData, isEditing, selectedLesson])

  const fetchLessons = async () => {
    try {
      const res = await fetch('/api/admin/lessons')
      if (res.ok) {
        const data = await res.json()
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
    // Сохраняем текущий урок перед переключением
    if (hasChanges && selectedLesson) {
      saveLesson(true)
    }
    
    setSelectedLesson(lesson)
    const newFormData = {
      title: lesson.title || '',
      description: lesson.description || '',
      content: lesson.content || '',
      duration: lesson.duration || 25,
      published: lesson.published ?? true,
      order: lesson.order || 1,
      emoji: lesson.emoji || '📖',
      color: lesson.color || 'from-blue-500 to-indigo-600',
      available: lesson.available ?? true,
    }
    setFormData(newFormData)
    originalDataRef.current = JSON.stringify(newFormData)
    setIsEditing(true)
    setIsCreating(false)
    setHasChanges(false)
    setSaveStatus('idle')
  }

  const startCreate = () => {
    const nextOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order)) + 1 : 1
    const newFormData = {
      title: '',
      description: '',
      content: '# New Lesson\n\nLesson content here...',
      duration: 25,
      published: true,
      order: nextOrder,
      emoji: '📖',
      color: 'from-blue-500 to-indigo-600',
      available: true,
    }
    setFormData(newFormData)
    originalDataRef.current = JSON.stringify(newFormData)
    setSelectedLesson(null)
    setIsCreating(true)
    setIsEditing(false)
    setHasChanges(false)
  }

  const saveLesson = useCallback(async (isAutoSave = false) => {
    if (!isAutoSave) {
      // Отменяем автосохранение если сохраняем вручную
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
    
    setSaveStatus('saving')
    
    try {
      const url = isCreating 
        ? '/api/admin/lessons' 
        : `/api/admin/lessons/${selectedLesson?.id}`
      
      // Отправляем только поля которые есть в базе данных
      const dbFields = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        duration: formData.duration,
        published: formData.published,
        order: formData.order,
      }
      
      const res = await fetch(url, {
        method: isCreating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbFields),
      })

      if (res.ok) {
        setSaveStatus('saved')
        setLastSaved(new Date())
        originalDataRef.current = JSON.stringify(formData)
        setHasChanges(false)
        
        if (!isAutoSave) {
          fetchLessons()
        }
        
        if (isCreating) {
          const newLesson = await res.json()
          setSelectedLesson(newLesson)
          setIsCreating(false)
          setIsEditing(true)
          fetchLessons()
        }
        
        setTimeout(() => {
          if (saveStatus === 'saved') setSaveStatus('idle')
        }, 3000)
      } else {
        const error = await res.json()
        setSaveStatus('error')
        console.error('Save error:', error)
      }
    } catch (error) {
      setSaveStatus('error')
      console.error('Save error:', error)
    }
  }, [formData, isCreating, selectedLesson, saveStatus])

  const deleteLesson = async () => {
    if (!selectedLesson) return
    if (!confirm(`Delete "${selectedLesson.title}"?\n\nThis cannot be undone.`)) return

    try {
      const res = await fetch(`/api/admin/lessons/${selectedLesson.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchLessons()
        setSelectedLesson(null)
        setIsEditing(false)
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const duplicateLesson = () => {
    if (!selectedLesson) return
    const nextOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order)) + 1 : 1
    setFormData({
      ...formData,
      title: formData.title + ' (Copy)',
      order: nextOrder,
    })
    setSelectedLesson(null)
    setIsCreating(true)
    setIsEditing(false)
  }

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Фильтрация уроков
  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.order.toString().includes(searchTerm)
  )

  // Статус сохранения
  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return <span className="text-blue-600 animate-pulse">💾 Saving...</span>
      case 'saved':
        return <span className="text-green-600">✓ Saved {lastSaved && `at ${lastSaved.toLocaleTimeString()}`}</span>
      case 'error':
        return <span className="text-red-600">❌ Error saving</span>
      default:
        return hasChanges ? <span className="text-amber-600">● Unsaved changes</span> : null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">📚 Advanced Lesson Editor</h1>
              <p className="text-indigo-200 text-sm">{lessons.length} lessons • Auto-save enabled</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin" className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                ← Dashboard
              </Link>
              <Link href="/admin/create-lesson" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                🚀 Publish New
              </Link>
              <button
                onClick={startCreate}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
              >
                + Add Lesson
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Save Status Bar */}
      {(isEditing || isCreating) && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {isCreating ? 'Creating new lesson' : `Editing: Lesson ${selectedLesson?.order}`}
              </span>
              {getSaveStatusDisplay()}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-1 text-sm rounded ${showPreview ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
              >
                👁️ Preview
              </button>
              <button
                onClick={() => saveLesson(false)}
                disabled={saveStatus === 'saving'}
                className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                💾 Save Now
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <input
                  type="text"
                  placeholder="🔍 Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="divide-y max-h-[70vh] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filteredLessons.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {searchTerm ? 'No lessons found' : 'No lessons yet'}
                  </div>
                ) : (
                  filteredLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => selectLesson(lesson)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 transition ${
                        selectedLesson?.id === lesson.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-indigo-600">
                          #{lesson.order}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          lesson.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {lesson.published ? '✓' : '○'}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {lesson.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {lesson.duration}min • {(lesson.content || '').length} chars
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className={`${showPreview ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {(isEditing || isCreating) ? (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 space-y-5">
                  
                  {/* Row 1: Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📝 Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateFormField('title', e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                      placeholder="Enter lesson title..."
                    />
                  </div>

                  {/* Row 2: Emoji, Color, Order, Duration */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        😀 Emoji
                      </label>
                      <select
                        value={formData.emoji}
                        onChange={(e) => updateFormField('emoji', e.target.value)}
                        className="w-full px-3 py-2 border-2 rounded-xl text-2xl text-center"
                      >
                        {EMOJI_OPTIONS.map(e => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🎨 Color
                      </label>
                      <select
                        value={formData.color}
                        onChange={(e) => updateFormField('color', e.target.value)}
                        className="w-full px-3 py-2 border-2 rounded-xl"
                      >
                        {COLOR_OPTIONS.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        #️⃣ Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => updateFormField('order', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border-2 rounded-xl text-center font-bold"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ⏱️ Duration
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => updateFormField('duration', parseInt(e.target.value) || 25)}
                          className="w-full px-3 py-2 border-2 rounded-xl text-center"
                          min="1"
                        />
                        <span className="absolute right-3 top-2 text-gray-400 text-sm">min</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Status toggles */}
                  <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => updateFormField('published', e.target.checked)}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        ✓ Published (visible in DB)
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.available}
                        onChange={(e) => updateFormField('available', e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        🔓 Available (unlocked for users)
                      </span>
                    </label>
                  </div>

                  {/* Row 4: Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📋 Description (for lesson list)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormField('description', e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      rows={2}
                      placeholder="Brief description shown on the lessons page..."
                    />
                  </div>

                  {/* Row 5: Content */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700">
                        📄 Content (Markdown)
                      </label>
                      <span className="text-xs text-gray-400">
                        {formData.content.length} characters
                      </span>
                    </div>
                    <textarea
                      value={formData.content}
                      onChange={(e) => updateFormField('content', e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                      rows={16}
                      placeholder="# Lesson Title&#10;&#10;Lesson content in Markdown..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      {!isCreating && (
                        <>
                          <button
                            onClick={deleteLesson}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            🗑️ Delete
                          </button>
                          <button
                            onClick={duplicateLesson}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          >
                            📋 Duplicate
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {!isCreating && selectedLesson && (
                        <Link
                          href={`/lessons/${selectedLesson.order}`}
                          target="_blank"
                          className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition"
                        >
                          👁️ View Live
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setIsCreating(false)
                          setSelectedLesson(null)
                          setHasChanges(false)
                        }}
                        className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        ✕ Close
                      </button>
                      <button
                        onClick={() => saveLesson(false)}
                        disabled={saveStatus === 'saving'}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition"
                      >
                        💾 Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Lesson to Edit
                </h3>
                <p className="text-gray-600 mb-6">
                  Click on any lesson from the list, or create a new one
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={startCreate}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    + Create New Lesson
                  </button>
                  <Link
                    href="/admin/create-lesson"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    🚀 Publish with Audio
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (isEditing || isCreating) && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4">
                <div className={`bg-gradient-to-r ${formData.color} p-4 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      Lesson {formData.order}
                    </span>
                    <span className="text-sm">⏱️ {formData.duration} min</span>
                  </div>
                  <div className="text-3xl mb-2">{formData.emoji}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {formData.title || 'Untitled Lesson'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {formData.description || 'No description'}
                  </p>
                  <div className="flex gap-2 mb-4">
                    {formData.published && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        ✓ Published
                      </span>
                    )}
                    {formData.available && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        🔓 Available
                      </span>
                    )}
                  </div>
                  <div className={`w-full text-center bg-gradient-to-r ${formData.color} text-white py-3 rounded-xl font-medium`}>
                    Start Lesson →
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
