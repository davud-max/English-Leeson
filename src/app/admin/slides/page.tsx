'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Slide {
  id: number
  title: string
  content: string
  emoji: string
  duration: number
}

interface LessonSlides {
  lessonNumber: number
  title: string
  slides: Slide[]
}

// This would normally come from a database, but for now we'll manage it client-side
const INITIAL_LESSONS: LessonSlides[] = [
  { lessonNumber: 1, title: 'Terms and Definitions', slides: [] },
  { lessonNumber: 2, title: 'What Is Counting?', slides: [] },
  { lessonNumber: 3, title: 'What Is a Formula?', slides: [] },
  { lessonNumber: 4, title: 'Abstraction and Rules', slides: [] },
  { lessonNumber: 5, title: 'Human Activity: Praxeology', slides: [] },
  { lessonNumber: 6, title: 'Human Activity and Economics', slides: [] },
  { lessonNumber: 7, title: 'The Fair and the Coin', slides: [] },
  { lessonNumber: 8, title: 'Theory of Cognitive Resonance', slides: [] },
]

export default function SlidesEditor() {
  const [lessons] = useState<LessonSlides[]>(INITIAL_LESSONS)
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [slides, setSlides] = useState<Slide[]>([])
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [slideForm, setSlideForm] = useState({
    title: '',
    content: '',
    emoji: '📖',
    duration: 25000,
  })

  const selectLesson = (lessonNum: number) => {
    setSelectedLesson(lessonNum)
    // In a real app, fetch slides from API
    // For now, we'll show empty or load from localStorage
    const saved = localStorage.getItem(`lesson-${lessonNum}-slides`)
    if (saved) {
      setSlides(JSON.parse(saved))
    } else {
      setSlides([])
    }
    setEditingSlide(null)
    setIsCreating(false)
  }

  const saveSlides = () => {
    if (selectedLesson) {
      localStorage.setItem(`lesson-${selectedLesson}-slides`, JSON.stringify(slides))
      alert('Slides saved to local storage!')
    }
  }

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      title: slideForm.title || 'New Slide',
      content: slideForm.content || 'Content here...',
      emoji: slideForm.emoji,
      duration: slideForm.duration,
    }
    setSlides([...slides, newSlide])
    setSlideForm({ title: '', content: '', emoji: '📖', duration: 25000 })
    setIsCreating(false)
  }

  const updateSlide = () => {
    if (!editingSlide) return
    setSlides(slides.map(s => 
      s.id === editingSlide.id 
        ? { ...s, ...slideForm }
        : s
    ))
    setEditingSlide(null)
  }

  const deleteSlide = (id: number) => {
    if (confirm('Delete this slide?')) {
      setSlides(slides.filter(s => s.id !== id))
      if (editingSlide?.id === id) {
        setEditingSlide(null)
      }
    }
  }

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= slides.length) return
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]]
    setSlides(newSlides)
  }

  const startEditSlide = (slide: Slide) => {
    setEditingSlide(slide)
    setSlideForm({
      title: slide.title,
      content: slide.content,
      emoji: slide.emoji,
      duration: slide.duration,
    })
    setIsCreating(false)
  }

  const exportSlides = () => {
    const code = `const LESSON_${selectedLesson}_SLIDES = ${JSON.stringify(slides, null, 2)};`
    navigator.clipboard.writeText(code)
    alert('Slides code copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🎬 Slide Editor</h1>
              <p className="text-gray-600 text-sm">Create and edit lesson slides</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b font-semibold text-gray-700">
                Select Lesson
              </div>
              <div className="divide-y">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.lessonNumber}
                    onClick={() => selectLesson(lesson.lessonNumber)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition ${
                      selectedLesson === lesson.lessonNumber 
                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                        : ''
                    }`}
                  >
                    <span className="text-xs text-gray-500">Lesson {lesson.lessonNumber}</span>
                    <h3 className="text-sm font-medium text-gray-900">{lesson.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slides List */}
          <div className="lg:col-span-1">
            {selectedLesson ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Slides ({slides.length})
                  </span>
                  <button
                    onClick={() => {
                      setIsCreating(true)
                      setEditingSlide(null)
                      setSlideForm({ title: '', content: '', emoji: '📖', duration: 25000 })
                    }}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    + Add
                  </button>
                </div>
                <div className="divide-y max-h-[60vh] overflow-y-auto">
                  {slides.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      No slides yet
                    </div>
                  ) : (
                    slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`p-3 hover:bg-gray-50 ${
                          editingSlide?.id === slide.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => startEditSlide(slide)}
                          >
                            <span className="text-lg mr-2">{slide.emoji}</span>
                            <span className="text-sm font-medium">{slide.title}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveSlide(index, 'up')}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              disabled={index === 0}
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveSlide(index, 'down')}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              disabled={index === slides.length - 1}
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => deleteSlide(slide.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {(slide.duration / 1000).toFixed(0)}s
                        </p>
                      </div>
                    ))
                  )}
                </div>
                {slides.length > 0 && (
                  <div className="p-3 border-t flex gap-2">
                    <button
                      onClick={saveSlides}
                      className="flex-1 text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={exportSlides}
                      className="text-sm px-3 py-2 border rounded hover:bg-gray-50"
                    >
                      📋 Export
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Select a lesson to manage slides
              </div>
            )}
          </div>

          {/* Slide Editor */}
          <div className="lg:col-span-2">
            {(isCreating || editingSlide) ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-gray-900">
                    {isCreating ? '➕ New Slide' : '✏️ Edit Slide'}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Emoji & Title */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emoji
                      </label>
                      <input
                        type="text"
                        value={slideForm.emoji}
                        onChange={(e) => setSlideForm({ ...slideForm, emoji: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-2xl text-center"
                        maxLength={2}
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={slideForm.title}
                        onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Slide title..."
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (milliseconds): {slideForm.duration}ms = {(slideForm.duration / 1000).toFixed(1)}s
                    </label>
                    <input
                      type="range"
                      min="5000"
                      max="60000"
                      step="1000"
                      value={slideForm.duration}
                      onChange={(e) => setSlideForm({ ...slideForm, duration: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content (Markdown)
                    </label>
                    <textarea
                      value={slideForm.content}
                      onChange={(e) => setSlideForm({ ...slideForm, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                      rows={12}
                      placeholder="**Bold text**&#10;&#10;• Bullet point&#10;• Another point&#10;&#10;> Quote"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        setIsCreating(false)
                        setEditingSlide(null)
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={isCreating ? addSlide : updateSlide}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {isCreating ? '➕ Add Slide' : '💾 Update Slide'}
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedLesson ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Slide Editor
                </h3>
                <p className="text-gray-600 mb-6">
                  Select a slide to edit or create a new one
                </p>
                <button
                  onClick={() => {
                    setIsCreating(true)
                    setSlideForm({ title: '', content: '', emoji: '📖', duration: 25000 })
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + Create New Slide
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Lesson
                </h3>
                <p className="text-gray-600">
                  Choose a lesson from the list to manage its slides
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
