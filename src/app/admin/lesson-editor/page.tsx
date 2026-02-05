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
  description?: string
}

const VOICES: Voice[] = [
  { id: 'kFVUJfjBCiv9orAbWhZN', name: 'Custom Voice', type: 'custom', description: '⭐ Recommended' },
  { id: '8Hdxm8QJKOFknq47BhTz', name: 'dZulu', type: 'custom', description: 'Custom 1' },
  { id: 'ma4IY0Z4IUybdEpvYzBW', name: 'dZulu2', type: 'custom', description: 'Custom 2' },
  { id: 'erDx71FK2teMZ7g6khzw', name: 'New Voice', type: 'custom', description: 'Latest' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', type: 'builtin', description: 'Male, Young' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', type: 'builtin', description: 'Male, Deep' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', type: 'builtin', description: 'Male, Soft' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', type: 'builtin', description: 'Female, Soft' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', type: 'builtin', description: 'Female, Calm' },
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
  color?: string
}

interface AudioGenerationProgress {
  slideIndex: number
  status: 'pending' | 'generating' | 'uploading' | 'success' | 'error'
  error?: string
}

export default function LessonEditorComplete() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'slides' | 'audio' | 'questions'>('slides')
  const [selectedVoice, setSelectedVoice] = useState('kFVUJfjBCiv9orAbWhZN')
  const [audioProgress, setAudioProgress] = useState<AudioGenerationProgress[]>([])
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
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
        console.log(`Loaded ${data.length} lessons`)
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
      setSaveStatus('❌ Ошибка загрузки')
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
    
    setSaveStatus('💾 Сохранение...')
    try {
      const res = await fetch(`/api/admin/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedLesson.title,
          description: selectedLesson.description,
          content: selectedLesson.content,
          slides: selectedLesson.slides,
          duration: selectedLesson.duration,
          published: selectedLesson.published,
          emoji: selectedLesson.emoji,
        }),
      })
      
      if (res.ok) {
        setSaveStatus('✅ Сохранено!')
        fetchLessons()
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        const error = await res.json()
        setSaveStatus(`❌ ${error.error || 'Ошибка'}`)
        setTimeout(() => setSaveStatus(''), 5000)
      }
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 5000)
    }
  }

  const syncFromStaticFiles = async () => {
    setSaveStatus('🔄 Синхронизация...')
    
    try {
      const res = await fetch('/api/admin/sync-lesson-content', {
        method: 'POST',
      })
      
      if (res.ok) {
        const data = await res.json()
        setSaveStatus(`✅ Синхронизировано! ${data.successCount} уроков`)
        fetchLessons()
        setTimeout(() => setSaveStatus(''), 5000)
      } else {
        setSaveStatus('❌ Ошибка синхронизации')
      }
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
    }
  }

  const addSlide = () => {
    if (!selectedLesson) return
    const newSlide: Slide = {
      id: (selectedLesson.slides?.length || 0) + 1,
      title: `Part ${(selectedLesson.slides?.length || 0) + 1}`,
      content: '',
      emoji: '📖',
      duration: 30000,
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
    const updatedSlides = [...(selectedLesson.slides || [])]
    updatedSlides.splice(index, 1)
    updatedSlides.forEach((slide, i) => {
      slide.id = i + 1
    })
    setSelectedLesson({ ...selectedLesson, slides: updatedSlides })
  }

  const recreateSlides = () => {
    if (!selectedLesson || !selectedLesson.content) {
      setSaveStatus('❌ Нет контента')
      return
    }
    
    setSaveStatus('🔄 Разбиение...')
    
    const paragraphs = selectedLesson.content
      .split(/\n\n+/)
      .filter(p => p.trim().length > 0)
    
    const newSlides = paragraphs.map((content, index) => ({
      id: index + 1,
      title: `Part ${index + 1}`,
      content: content.trim(),
      emoji: '📖',
      duration: 30000
    }))
    
    setSelectedLesson({
      ...selectedLesson,
      slides: newSlides
    })
    
    setSaveStatus(`✅ ${newSlides.length} слайдов`)
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Questions functions
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
    
    setSaveStatus('💾 Сохранение вопросов...')
    try {
      const res = await fetch('/api/admin/questions', {
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
        setSaveStatus('❌ Ошибка')
      }
    } catch (error) {
      setSaveStatus('❌ Ошибка')
    }
  }

  // Audio generation
  const generateAudio = async (slideIndex: number) => {
    if (!selectedLesson) return
    
    const slide = selectedLesson.slides[slideIndex]
    if (!slide.content) {
      setSaveStatus('❌ Нет текста')
      return
    }

    const progressCopy = [...audioProgress]
    progressCopy[slideIndex] = { slideIndex, status: 'generating' }
    setAudioProgress(progressCopy)
    setSaveStatus(`🎵 Генерация ${slideIndex + 1}...`)

    try {
      // 1. Generate audio
      const genRes = await fetch('/api/admin/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: slide.content,
          voiceId: selectedVoice,
          lessonId: selectedLesson.order.toString(),
          slideNumber: slideIndex + 1,
        }),
      })

      if (!genRes.ok) {
        const errorData = await genRes.json()
        throw new Error(errorData.error || `HTTP ${genRes.status}`)
      }

      const genData = await genRes.json()
      
      if (!genData.success || !genData.audioBase64) {
        throw new Error('No audio data')
      }

      // 2. Upload to GitHub
      progressCopy[slideIndex] = { slideIndex, status: 'uploading' }
      setAudioProgress([...progressCopy])
      setSaveStatus(`📤 Загрузка ${slideIndex + 1}...`)

      const uploadRes = await fetch('/api/admin/upload-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonNumber: selectedLesson.order,  // ✅ FIXED
          slideNumber: slideIndex + 1,
          audioBase64: genData.audioBase64,
        }),
      })

      if (!uploadRes.ok) {
        const uploadError = await uploadRes.json()
        throw new Error(uploadError.error || 'Upload failed')
      }

      const uploadData = await uploadRes.json()
      
      // 3. Success
      progressCopy[slideIndex] = { 
        slideIndex, 
        status: 'success',
      }
      setAudioProgress([...progressCopy])

      setSaveStatus(`✅ Слайд ${slideIndex + 1} готов!`)
      setTimeout(() => setSaveStatus(''), 3000)

    } catch (error) {
      progressCopy[slideIndex] = { 
        slideIndex, 
        status: 'error',
        error: (error as Error).message 
      }
      setAudioProgress([...progressCopy])
      
      setSaveStatus(`❌ ${slideIndex + 1}: ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 5000)
    }
  }

  const generateAllAudio = async () => {
    if (!selectedLesson || !selectedLesson.slides?.length) return

    setIsGeneratingAll(true)
    setSaveStatus(`🎵 Генерация ${selectedLesson.slides.length} файлов...`)
    
    const initialProgress = selectedLesson.slides.map((_, index) => ({
      slideIndex: index,
      status: 'pending' as const
    }))
    setAudioProgress(initialProgress)

    for (let i = 0; i < selectedLesson.slides.length; i++) {
      await generateAudio(i)
      if (i < selectedLesson.slides.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    setIsGeneratingAll(false)
    setSaveStatus('✅ Все готово!')
    setTimeout(() => {
      setSaveStatus('')
      setAudioProgress([])
    }, 3000)
  }

  // Translate modal
  const translateAndImport = async () => {
    if (!russianText.trim() || !adminKey) {
      setSaveStatus('❌ Введите текст и ключ')
      return
    }

    setIsTranslating(true)
    setSaveStatus('🌐 Перевод...')

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

        setSaveStatus('✅ Переведено!')
        setShowTranslateModal(false)
        setRussianText('')
        setTimeout(() => setSaveStatus(''), 2000)
      }
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
    } finally {
      setIsTranslating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
            <Link href="/admin" className="text-white hover:text-blue-100 text-sm flex items-center gap-2 mb-2">
              ← Админ
            </Link>
            <h2 className="text-lg font-bold text-white">📚 Редактор</h2>
          </div>
          
          <div className="p-4 border-b bg-amber-50">
            <button
              onClick={syncFromStaticFiles}
              className="w-full bg-amber-600 text-white px-3 py-2 rounded text-sm hover:bg-amber-700"
            >
              🔄 Синхронизировать
            </button>
          </div>
          
          <div className="p-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`w-full text-left p-3 rounded mb-1 ${
                  selectedLesson?.id === lesson.id 
                    ? 'bg-blue-50 border-l-4 border-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm flex items-center gap-2">
                  <span>{lesson.emoji || '📖'}</span>
                  <span>{lesson.order}. {lesson.title}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {lesson.slides?.length || 0} слайдов
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
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
                    />
                    <textarea
                      value={selectedLesson.description}
                      onChange={(e) => setSelectedLesson({ ...selectedLesson, description: e.target.value })}
                      className="mt-2 text-gray-600 border rounded p-2 w-full"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={saveLesson} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    💾 Сохранить
                  </button>
                  <button onClick={() => setShowTranslateModal(true)} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                    🌐 Перевод
                  </button>
                  {saveStatus && (
                    <div className="flex items-center px-4 py-2 bg-gray-100 rounded text-sm">
                      {saveStatus}
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'content', label: '📝 Контент' },
                      { id: 'slides', label: '📊 Слайды', count: selectedLesson.slides?.length || 0 },
                      { id: 'audio', label: '🎵 Аудио', count: selectedLesson.slides?.length || 0 },
                      { id: 'questions', label: '❓ Вопросы', count: questions.length },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500'
                        }`}
                      >
                        {tab.label}
                        {'count' in tab && (
                          <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Content */}
                  {activeTab === 'content' && (
                    <div>
                      <textarea
                        value={selectedLesson.content}
                        onChange={(e) => setSelectedLesson({ ...selectedLesson, content: e.target.value })}
                        className="w-full h-96 border rounded p-4 font-mono text-sm"
                      />
                    </div>
                  )}

                  {/* Slides */}
                  {activeTab === 'slides' && (
                    <div>
                      <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-medium">Слайды</h3>
                        <div className="flex gap-2">
                          <button onClick={recreateSlides} className="bg-amber-600 text-white px-4 py-2 rounded text-sm">
                            🔄 Разбить
                          </button>
                          <button onClick={addSlide} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                            + Слайд
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(selectedLesson.slides || []).map((slide, index) => (
                          <div key={slide.id} className="border rounded p-4 bg-gray-50">
                            <div className="flex justify-between mb-3">
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => updateSlide(index, 'title', e.target.value)}
                                className="font-medium border-b bg-transparent outline-none"
                              />
                              <button onClick={() => deleteSlide(index)} className="text-red-600 text-sm">
                                🗑️
                              </button>
                            </div>
                            <textarea
                              value={slide.content}
                              onChange={(e) => updateSlide(index, 'content', e.target.value)}
                              className="w-full h-32 border rounded p-2 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audio */}
                  {activeTab === 'audio' && (
                    <div>
                      <div className="flex justify-between mb-6">
                        <h3 className="text-lg font-medium">Аудио</h3>
                        <div className="flex gap-3">
                          <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                          >
                            <optgroup label="Custom">
                              {VOICES.filter(v => v.type === 'custom').map(v => (
                                <option key={v.id} value={v.id}>{v.name} - {v.description}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Built-in">
                              {VOICES.filter(v => v.type === 'builtin').map(v => (
                                <option key={v.id} value={v.id}>{v.name} - {v.description}</option>
                              ))}
                            </optgroup>
                          </select>
                          <button
                            onClick={generateAllAudio}
                            disabled={isGeneratingAll}
                            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                          >
                            {isGeneratingAll ? '⏳ Генерация...' : '🎵 Все'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(selectedLesson.slides || []).map((slide, index) => {
                          const progress = audioProgress[index]
                          const statusColor = 
                            progress?.status === 'success' ? 'text-green-600' :
                            progress?.status === 'error' ? 'text-red-600' :
                            progress?.status === 'generating' ? 'text-blue-600' :
                            progress?.status === 'uploading' ? 'text-purple-600' :
                            'text-gray-600'

                          return (
                            <div key={slide.id} className="border rounded p-4 bg-gray-50">
                              <div className="flex justify-between">
                                <div>
                                  <div className="font-medium">{index + 1}. {slide.title}</div>
                                  <div className="text-sm text-gray-600 line-clamp-2">{slide.content}</div>
                                  {progress && (
                                    <div className={`text-sm mt-2 ${statusColor}`}>
                                      {progress.status === 'generating' && '🎵 Генерация...'}
                                      {progress.status === 'uploading' && '📤 Загрузка...'}
                                      {progress.status === 'success' && '✅ Готово'}
                                      {progress.status === 'error' && `❌ ${progress.error}`}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => generateAudio(index)}
                                  disabled={progress?.status === 'generating' || progress?.status === 'uploading'}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                                >
                                  {progress?.status === 'generating' || progress?.status === 'uploading' ? '⏳' : '🎵'}
                                </button>
                              </div>
                              <audio
                                controls
                                src={`/audio/lesson${selectedLesson.order}/slide${index + 1}.mp3`}
                                className="w-full h-8 mt-3"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  {activeTab === 'questions' && (
                    <div>
                      <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-medium">Вопросы</h3>
                        <div className="flex gap-2">
                          <button onClick={addQuestion} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                            + Вопрос
                          </button>
                          <button onClick={saveQuestions} className="bg-green-600 text-white px-4 py-2 rounded text-sm">
                            💾 Сохранить
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {questions.map((q, qIndex) => (
                          <div key={q.id} className="border rounded p-4 bg-gray-50">
                            <div className="flex justify-between mb-3">
                              <span className="font-medium">Вопрос {qIndex + 1}</span>
                              <button onClick={() => deleteQuestion(qIndex)} className="text-red-600 text-sm">
                                🗑️
                              </button>
                            </div>

                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                              className="w-full border rounded p-2 mb-3"
                              placeholder="Текст вопроса"
                            />

                            <div className="space-y-2 mb-3">
                              {q.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${q.id}`}
                                    checked={q.correctAnswer === oIndex}
                                    onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...q.options]
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
                              value={q.explanation || ''}
                              onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                              className="w-full border rounded p-2 text-sm"
                              rows={2}
                              placeholder="Объяснение (опционально)"
                            />
                          </div>
                        ))}

                        {questions.length === 0 && (
                          <div className="text-center text-gray-500 py-8">
                            Нет вопросов. Нажмите «+ Вопрос»
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
              Выберите урок
            </div>
          )}
        </div>
      </div>

      {/* Translate Modal */}
      {showTranslateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">🌐 Перевод с русского</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Admin Key</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Русский текст</label>
              <textarea
                value={russianText}
                onChange={(e) => setRussianText(e.target.value)}
                className="w-full h-64 border rounded p-3 font-mono text-sm"
                placeholder="Вставьте русский текст..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowTranslateModal(false)
                  setRussianText('')
                }}
                disabled={isTranslating}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={translateAndImport}
                disabled={isTranslating || !russianText.trim() || !adminKey}
                className="bg-purple-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {isTranslating ? '⏳ Перевод...' : '🌐 Перевести'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
