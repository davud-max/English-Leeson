'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Slide {
  id: number
  title: string
  content: string
  emoji: string
  duration: number
  audioUrl?: string
}

interface Voice {
  id: string
  name: string
  type: 'custom' | 'builtin'
}

const VOICES: Voice[] = [
  { id: 'kFVUJfjBCiv9orAbWhZN', name: 'Custom Voice ⭐', type: 'custom' },
  { id: '8Hdxm8QJKOFknq47BhTz', name: 'dZulu', type: 'custom' },
  { id: 'ma4IY0Z4IUybdEpvYzBW', name: 'dZulu2', type: 'custom' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Male, Young)', type: 'builtin' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Male, Deep)', type: 'builtin' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam (Male, Raspy)', type: 'builtin' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Male, Soft)', type: 'builtin' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Female)', type: 'builtin' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female)', type: 'builtin' },
]

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  audioUrl?: string
}

interface Lesson {
  id: string
  order: number
  title: string
  description: string
  content: string
  slides: Slide[]
  duration: number
  published: boolean
  emoji?: string
}

export default function LessonEditor() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'slides' | 'audio' | 'questions'>('content')
  const [selectedVoice, setSelectedVoice] = useState('TxGEqnHWrfWFTfGW9XjX')
  const [generatingSlide, setGeneratingSlide] = useState<number | null>(null)
  const [showTranslateModal, setShowTranslateModal] = useState(false)
  const [russianText, setRussianText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [adminKey, setAdminKey] = useState('')

  useEffect(() => {
    fetchLessons()
  }, [])

  useEffect(() => {
    if (selectedLesson) {
      fetchQuestions(selectedLesson.order)
    }
  }, [selectedLesson])

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

  const fetchQuestions = async (lessonOrder: number) => {
    try {
      const res = await fetch(`/api/admin/questions?lesson=${lessonOrder}`)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data)
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    }
  }

  const saveLesson = async () => {
    if (!selectedLesson) return
    
    setSaveStatus('Сохранение...')
    try {
      const res = await fetch(`/api/admin/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedLesson),
      })
      
      if (res.ok) {
        setSaveStatus('✅ Сохранено!')
        fetchLessons()
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        setSaveStatus('❌ Ошибка сохранения')
      }
    } catch (error) {
      setSaveStatus('❌ Ошибка сохранения')
    }
  }

  const addSlide = () => {
    if (!selectedLesson) return
    const newSlide: Slide = {
      id: (selectedLesson.slides?.length || 0) + 1,
      title: `Part ${(selectedLesson.slides?.length || 0) + 1}`,
      content: '',
      emoji: '📖',
      duration: 30000
    }
    setSelectedLesson({
      ...selectedLesson,
      slides: [...(selectedLesson.slides || []), newSlide]
    })
  }

  const updateSlide = (index: number, field: keyof Slide, value: any) => {
    if (!selectedLesson) return
    const updatedSlides = [...(selectedLesson.slides || [])]
    updatedSlides[index] = { ...updatedSlides[index], [field]: value }
    setSelectedLesson({ ...selectedLesson, slides: updatedSlides })
  }

  const deleteSlide = (index: number) => {
    if (!selectedLesson) return
    const updatedSlides = selectedLesson.slides.filter((_, i) => i !== index)
    setSelectedLesson({ ...selectedLesson, slides: updatedSlides })
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const saveQuestions = async () => {
    if (!selectedLesson) return
    
    setSaveStatus('Сохранение вопросов...')
    try {
      const res = await fetch(`/api/admin/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonOrder: selectedLesson.order,
          questions
        }),
      })
      
      if (res.ok) {
        setSaveStatus('✅ Вопросы сохранены!')
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        setSaveStatus('❌ Ошибка сохранения вопросов')
      }
    } catch (error) {
      setSaveStatus('❌ Ошибка сохранения вопросов')
    }
  }

  const generateQuestionAudio = async (questionIndex: number) => {
    const question = questions[questionIndex]
    if (!question.question) return

    setSaveStatus(`Генерация аудио для вопроса ${questionIndex + 1}...`)
    
    try {
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: question.question,
          voiceId: selectedVoice,
        }),
      })

      if (!res.ok) throw new Error('Failed to generate audio')

      const blob = await res.blob()
      const audioUrl = URL.createObjectURL(blob)
      
      const updatedQuestions = [...questions]
      updatedQuestions[questionIndex] = { ...question, audioUrl }
      setQuestions(updatedQuestions)

      setSaveStatus(`✅ Аудио для вопроса ${questionIndex + 1} сгенерировано!`)
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      setSaveStatus(`❌ Ошибка генерации: ${(error as Error).message}`)
    }
  }

  const deployChanges = async () => {
    if (!selectedLesson) return
    
    setSaveStatus('Сохранение изменений...')
    
    // Сначала сохраняем урок
    try {
      const res = await fetch(`/api/admin/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedLesson),
      })
      
      if (!res.ok) {
        setSaveStatus('❌ Ошибка сохранения')
        return
      }
    } catch (error) {
      setSaveStatus('❌ Ошибка сохранения')
      return
    }

    setSaveStatus('✅ Сохранено! Деплой запустится автоматически через GitHub.')
    setTimeout(() => setSaveStatus(''), 4000)
  }

  const generateAudio = async (slideIndex: number) => {
    if (!selectedLesson) return
    
    const slide = selectedLesson.slides[slideIndex]
    if (!slide.content) {
      setSaveStatus('❌ Нет текста для генерации')
      return
    }

    setGeneratingSlide(slideIndex)
    setSaveStatus(`Генерация аудио для слайда ${slideIndex + 1}...`)

    try {
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: slide.content,
          voiceId: selectedVoice,
        }),
      })

      if (!res.ok) throw new Error('Failed to generate audio')

      const blob = await res.blob()
      const audioBase64 = await blobToBase64(blob)

      // Upload audio file
      const uploadRes = await fetch('/api/admin/upload-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonOrder: selectedLesson.order,
          slideNumber: slideIndex + 1,
          audioBase64,
        }),
      })

      if (uploadRes.ok) {
        setSaveStatus(`✅ Аудио для слайда ${slideIndex + 1} сгенерировано!`)
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        throw new Error('Failed to upload audio')
      }
    } catch (error) {
      setSaveStatus(`❌ Ошибка генерации аудио: ${(error as Error).message}`)
    } finally {
      setGeneratingSlide(null)
    }
  }

  const generateAllAudio = async () => {
    if (!selectedLesson || !selectedLesson.slides) return

    setSaveStatus('Генерация всех аудио...')
    for (let i = 0; i < selectedLesson.slides.length; i++) {
      await generateAudio(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    setSaveStatus('✅ Все аудио сгенерированы!')
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const translateAndImport = async () => {
    if (!russianText.trim() || !adminKey) {
      setSaveStatus('❌ Введите текст и Admin Key')
      return
    }

    setIsTranslating(true)
    setSaveStatus('Перевод текста...')

    try {
      const response = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: russianText,
          type: 'content',
          adminKey
        }),
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Translation failed')
      }

      const translatedText = data.result

      // Разбиваем текст на абзацы для слайдов
      const paragraphs = translatedText.split('\n\n').filter((p: string) => p.trim().length > 0)
      
      if (selectedLesson) {
        const newSlides = paragraphs.map((content: string, index: number) => ({
          id: index + 1,
          title: `Part ${index + 1}`,
          content: content.trim(),
          emoji: '📖',
          duration: 30000
        }))

        setSelectedLesson({
          ...selectedLesson,
          content: translatedText,
          slides: newSlides
        })

        setSaveStatus('✅ Текст переведён и импортирован!')
        setShowTranslateModal(false)
        setRussianText('')
        setTimeout(() => setSaveStatus(''), 2000)
      }
    } catch (error) {
      setSaveStatus(`❌ Ошибка: ${(error as Error).message}`)
    } finally {
      setIsTranslating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Список уроков */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Админ панель
            </Link>
            <h2 className="text-lg font-bold mt-2">Уроки</h2>
          </div>
          <div className="p-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`w-full text-left p-3 rounded mb-1 hover:bg-gray-100 ${
                  selectedLesson?.id === lesson.id ? 'bg-blue-100 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="font-medium text-sm">
                  {lesson.order}. {lesson.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {lesson.slides?.length || 0} слайдов
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 overflow-y-auto">
          {selectedLesson ? (
            <div className="p-6">
              {/* Header */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={selectedLesson.title}
                      onChange={(e) => setSelectedLesson({ ...selectedLesson, title: e.target.value })}
                      className="text-2xl font-bold border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-full"
                      placeholder="Название урока"
                    />
                    <textarea
                      value={selectedLesson.description}
                      onChange={(e) => setSelectedLesson({ ...selectedLesson, description: e.target.value })}
                      className="mt-2 text-gray-600 border rounded p-2 w-full"
                      rows={2}
                      placeholder="Описание урока"
                    />
                  </div>
                  <div className="ml-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedLesson.published}
                        onChange={(e) => setSelectedLesson({ ...selectedLesson, published: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Опубликован</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={saveLesson}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    💾 Сохранить урок
                  </button>
                  <button
                    onClick={() => setShowTranslateModal(true)}
                    className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
                  >
                    🌐 Импорт из русского
                  </button>
                  <button
                    onClick={deployChanges}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  >
                    💾 Сохранить и деплой
                  </button>
                  {saveStatus && (
                    <div className="flex items-center text-sm font-medium">{saveStatus}</div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {[
                      { id: 'content', label: '📝 Контент', count: null },
                      { id: 'slides', label: '📊 Слайды', count: selectedLesson.slides?.length || 0 },
                      { id: 'audio', label: '🎵 Аудио', count: selectedLesson.slides?.length || 0 },
                      { id: 'questions', label: '❓ Вопросы', count: questions.length }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                        {tab.count !== null && (
                          <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Content Tab */}
                  {activeTab === 'content' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Полный контент урока (Markdown)
                      </label>
                      <textarea
                        value={selectedLesson.content}
                        onChange={(e) => setSelectedLesson({ ...selectedLesson, content: e.target.value })}
                        className="w-full h-96 border rounded p-4 font-mono text-sm"
                        placeholder="# Заголовок\n\nТекст урока..."
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        {selectedLesson.content.length} символов
                      </div>
                    </div>
                  )}

                  {/* Slides Tab */}
                  {activeTab === 'slides' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Слайды презентации</h3>
                        <button
                          onClick={addSlide}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                        >
                          + Добавить слайд
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(selectedLesson.slides || []).map((slide, index) => (
                          <div key={slide.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{slide.emoji}</span>
                                <input
                                  type="text"
                                  value={slide.title}
                                  onChange={(e) => updateSlide(index, 'title', e.target.value)}
                                  className="font-medium border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none"
                                  placeholder="Название слайда"
                                />
                              </div>
                              <button
                                onClick={() => deleteSlide(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                🗑️ Удалить
                              </button>
                            </div>
                            
                            <div className="mb-3">
                              <label className="block text-xs text-gray-600 mb-1">Emoji</label>
                              <input
                                type="text"
                                value={slide.emoji}
                                onChange={(e) => updateSlide(index, 'emoji', e.target.value)}
                                className="border rounded px-2 py-1 w-20"
                                placeholder="📖"
                              />
                            </div>

                            <textarea
                              value={slide.content}
                              onChange={(e) => updateSlide(index, 'content', e.target.value)}
                              className="w-full h-32 border rounded p-2 text-sm"
                              placeholder="Содержание слайда (Markdown)"
                            />
                            
                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                              <span>Слайд {index + 1}</span>
                              <span>•</span>
                              <span>{slide.content.length} символов</span>
                              <span>•</span>
                              <label className="flex items-center space-x-1">
                                <span>Длительность (сек):</span>
                                <input
                                  type="number"
                                  value={slide.duration / 1000}
                                  onChange={(e) => updateSlide(index, 'duration', parseInt(e.target.value) * 1000)}
                                  className="border rounded px-2 py-1 w-16"
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audio Tab */}
                  {activeTab === 'audio' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Управление аудио</h3>
                        <div className="flex items-center space-x-3">
                          <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                          >
                            <optgroup label="Custom Voices">
                              {VOICES.filter(v => v.type === 'custom').map(voice => (
                                <option key={voice.id} value={voice.id}>{voice.name}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Built-in Voices">
                              {VOICES.filter(v => v.type === 'builtin').map(voice => (
                                <option key={voice.id} value={voice.id}>{voice.name}</option>
                              ))}
                            </optgroup>
                          </select>
                          <button
                            onClick={generateAllAudio}
                            disabled={generatingSlide !== null}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm disabled:opacity-50"
                          >
                            🎵 Генерировать все
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(selectedLesson.slides || []).map((slide, index) => (
                          <div key={slide.id} className="border rounded p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <div className="font-medium">Слайд {index + 1}: {slide.title}</div>
                                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{slide.content}</div>
                              </div>
                              <button
                                onClick={() => generateAudio(index)}
                                disabled={generatingSlide === index}
                                className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                              >
                                {generatingSlide === index ? '⏳ Генерация...' : '🎵 Генерировать'}
                              </button>
                            </div>
                            <div className="flex items-center space-x-3">
                              <audio
                                controls
                                src={`/audio/lesson${selectedLesson.order}/slide${index + 1}.mp3`}
                                className="flex-1 h-8"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.nextElementSibling!.classList.remove('hidden')
                                }}
                              />
                              <span className="hidden text-sm text-red-600">❌ Файл не найден</span>
                            </div>
                          </div>
                        ))}

                        {(!selectedLesson.slides || selectedLesson.slides.length === 0) && (
                          <div className="text-center text-gray-500 py-8">
                            Нет слайдов. Добавьте слайды во вкладке &quot;Слайды&quot;.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Questions Tab */}
                  {activeTab === 'questions' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Вопросы теста</h3>
                        <div className="space-x-2">
                          <button
                            onClick={addQuestion}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                          >
                            + Добавить вопрос
                          </button>
                          <button
                            onClick={saveQuestions}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                          >
                            💾 Сохранить вопросы
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {questions.map((question, qIndex) => (
                          <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                              <span className="font-medium text-lg">Вопрос {qIndex + 1}</span>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => generateQuestionAudio(qIndex)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                >
                                  🎵 Озвучить
                                </button>
                                <button
                                  onClick={() => deleteQuestion(qIndex)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  🗑️ Удалить
                                </button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={question.question}
                              onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                              className="w-full border rounded p-2 mb-3"
                              placeholder="Текст вопроса"
                            />

                            {question.audioUrl && (
                              <div className="mb-3">
                                <audio controls src={question.audioUrl} className="w-full h-8" />
                              </div>
                            )}

                            <div className="space-y-2 mb-3">
                              <label className="block text-sm font-medium text-gray-700">Варианты ответов:</label>
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === oIndex}
                                    onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                    className="mt-1"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...question.options]
                                      newOptions[oIndex] = e.target.value
                                      updateQuestion(qIndex, 'options', newOptions)
                                    }}
                                    className="flex-1 border rounded p-2"
                                    placeholder={`Вариант ${oIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>

                            <textarea
                              value={question.explanation || ''}
                              onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                              className="w-full border rounded p-2 text-sm"
                              rows={2}
                              placeholder="Объяснение правильного ответа (опционально)"
                            />
                          </div>
                        ))}

                        {questions.length === 0 && (
                          <div className="text-center text-gray-500 py-8">
                            Нет вопросов. Нажмите &quot;Добавить вопрос&quot; для создания.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Выберите урок из списка слева
            </div>
          )}
        </div>
      </div>

      {/* Translation Modal */}
      {showTranslateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">🌐 Импорт русского текста</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Введите Admin Key"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Русский текст
              </label>
              <textarea
                value={russianText}
                onChange={(e) => setRussianText(e.target.value)}
                className="w-full h-64 border rounded p-3 font-mono text-sm"
                placeholder="Вставьте русский текст урока. Он будет переведён на английский и разбит на слайды."
              />
              <div className="text-sm text-gray-500 mt-1">
                {russianText.length} символов
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTranslateModal(false)
                  setRussianText('')
                }}
                disabled={isTranslating}
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={translateAndImport}
                disabled={isTranslating || !russianText.trim() || !adminKey}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {isTranslating ? '⏳ Перевод...' : '🌐 Перевести и импортировать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
