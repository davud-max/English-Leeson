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
  { id: '8Hdxm8QJKOFknq47BhTz', name: 'dZulu', type: 'custom', description: 'Custom Voice 1' },
  { id: 'ma4IY0Z4IUybdEpvYzBW', name: 'dZulu2', type: 'custom', description: 'Custom Voice 2' },
  { id: 'erDx71FK2teMZ7g6khzw', name: 'New Voice', type: 'custom', description: 'Latest Custom' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', type: 'builtin', description: 'Male, Young' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', type: 'builtin', description: 'Male, Deep' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', type: 'builtin', description: 'Male, Soft' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', type: 'builtin', description: 'Female, Soft' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', type: 'builtin', description: 'Female, Calm' },
]

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

export default function LessonEditorFixed() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'slides' | 'audio'>('slides')
  const [selectedVoice, setSelectedVoice] = useState('kFVUJfjBCiv9orAbWhZN')
  const [audioProgress, setAudioProgress] = useState<AudioGenerationProgress[]>([])
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)

  useEffect(() => {
    fetchLessons()
  }, [])

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
      setSaveStatus('❌ Ошибка загрузки уроков')
    } finally {
      setLoading(false)
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
        setSaveStatus(`❌ ${error.error || 'Ошибка сохранения'}`)
        setTimeout(() => setSaveStatus(''), 5000)
      }
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 5000)
    }
  }

  const syncFromStaticFiles = async () => {
    setSaveStatus('🔄 Синхронизация из статических файлов...')
    
    try {
      const res = await fetch('/api/admin/sync-lesson-content', {
        method: 'POST',
      })
      
      if (res.ok) {
        const data = await res.json()
        setSaveStatus(`✅ Синхронизировано! ${JSON.stringify(data.updates)}`)
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

  // Генерация аудио для одного слайда
  const generateAudio = async (slideIndex: number) => {
    if (!selectedLesson) return
    
    const slide = selectedLesson.slides[slideIndex]
    if (!slide.content) {
      setSaveStatus('❌ Нет текста для генерации')
      return
    }

    // Обновляем статус
    const progressCopy = [...audioProgress]
    progressCopy[slideIndex] = { slideIndex, status: 'generating' }
    setAudioProgress(progressCopy)
    setSaveStatus(`🎵 Генерация аудио для слайда ${slideIndex + 1}...`)

    try {
      // 1. Генерируем аудио
      console.log(`Generating audio for lesson ${selectedLesson.order}, slide ${slideIndex + 1}`)
      console.log(`Using voice: ${selectedVoice}`)
      console.log(`Text length: ${slide.content.length}`)
      
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
      console.log('Audio generated:', genData)
      
      if (!genData.success || !genData.audioBase64) {
        throw new Error('No audio data received')
      }

      // 2. Загружаем в GitHub
      progressCopy[slideIndex] = { slideIndex, status: 'uploading' }
      setAudioProgress([...progressCopy])
      setSaveStatus(`📤 Загрузка аудио для слайда ${slideIndex + 1} в GitHub...`)

      const uploadRes = await fetch('/api/admin/upload-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonNumber: selectedLesson.order,  // ✅ ИСПРАВЛЕНО: используем lessonNumber
          slideNumber: slideIndex + 1,
          audioBase64: genData.audioBase64,
        }),
      })

      if (!uploadRes.ok) {
        const uploadError = await uploadRes.json()
        throw new Error(uploadError.error || 'Upload failed')
      }

      const uploadData = await uploadRes.json()
      console.log('Audio uploaded:', uploadData)
      
      // 3. Успех!
      progressCopy[slideIndex] = { 
        slideIndex, 
        status: 'success',
      }
      setAudioProgress([...progressCopy])

      setSaveStatus(`✅ Слайд ${slideIndex + 1} - готово! ${uploadData.url}`)
      setTimeout(() => setSaveStatus(''), 3000)

    } catch (error) {
      console.error(`Error generating audio for slide ${slideIndex + 1}:`, error)
      progressCopy[slideIndex] = { 
        slideIndex, 
        status: 'error',
        error: (error as Error).message 
      }
      setAudioProgress([...progressCopy])
      
      setSaveStatus(`❌ Слайд ${slideIndex + 1}: ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 5000)
    }
  }

  // Генерация аудио для всех слайдов
  const generateAllAudio = async () => {
    if (!selectedLesson || !selectedLesson.slides?.length) return

    setIsGeneratingAll(true)
    setSaveStatus(`🎵 Генерация ${selectedLesson.slides.length} аудио файлов...`)
    
    const initialProgress = selectedLesson.slides.map((_, index) => ({
      slideIndex: index,
      status: 'pending' as const
    }))
    setAudioProgress(initialProgress)

    for (let i = 0; i < selectedLesson.slides.length; i++) {
      await generateAudio(i)
      // Пауза между запросами (чтобы не перегрузить API)
      if (i < selectedLesson.slides.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    setIsGeneratingAll(false)
    setSaveStatus('✅ Все аудио сгенерированы и загружены!')
    setTimeout(() => {
      setSaveStatus('')
      setAudioProgress([])
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Загрузка уроков...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
            <Link href="/admin" className="text-white hover:text-blue-100 text-sm flex items-center gap-2 mb-2">
              ← Админ панель
            </Link>
            <h2 className="text-lg font-bold text-white">📚 Редактор уроков</h2>
          </div>
          
          <div className="p-4 border-b bg-amber-50">
            <button
              onClick={syncFromStaticFiles}
              className="w-full bg-amber-600 text-white px-3 py-2 rounded text-sm hover:bg-amber-700"
            >
              🔄 Синхронизировать все
            </button>
            <p className="text-xs text-gray-600 mt-2">Загрузить контент из статических файлов</p>
          </div>
          
          <div className="p-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`w-full text-left p-3 rounded mb-1 transition-all ${
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
                  <button
                    onClick={saveLesson}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    💾 Сохранить
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
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
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
                  {/* Content Tab */}
                  {activeTab === 'content' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Полный контент (Markdown)</label>
                      <textarea
                        value={selectedLesson.content}
                        onChange={(e) => setSelectedLesson({ ...selectedLesson, content: e.target.value })}
                        className="w-full h-96 border rounded p-4 font-mono text-sm"
                      />
                    </div>
                  )}

                  {/* Slides Tab */}
                  {activeTab === 'slides' && (
                    <div>
                      <div className="flex justify-between mb-4">
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
                            <div className="flex justify-between mb-3">
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => updateSlide(index, 'title', e.target.value)}
                                className="font-medium border-b hover:border-gray-300 bg-transparent outline-none"
                              />
                              <button
                                onClick={() => deleteSlide(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
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

                  {/* Audio Tab */}
                  {activeTab === 'audio' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium">Генерация аудио</h3>
                        <div className="flex items-center gap-3">
                          <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                          >
                            <optgroup label="Custom Voices">
                              {VOICES.filter(v => v.type === 'custom').map(voice => (
                                <option key={voice.id} value={voice.id}>
                                  {voice.name} - {voice.description}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Built-in Voices">
                              {VOICES.filter(v => v.type === 'builtin').map(voice => (
                                <option key={voice.id} value={voice.id}>
                                  {voice.name} - {voice.description}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          <button
                            onClick={generateAllAudio}
                            disabled={isGeneratingAll}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {isGeneratingAll ? '⏳ Генерация...' : '🎵 Генерировать все'}
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
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">Слайд {index + 1}: {slide.title}</div>
                                  <div className="text-sm text-gray-600 line-clamp-2">{slide.content}</div>
                                  {progress && (
                                    <div className={`text-sm mt-2 ${statusColor}`}>
                                      {progress.status === 'generating' && '🎵 Генерация...'}
                                      {progress.status === 'uploading' && '📤 Загрузка в GitHub...'}
                                      {progress.status === 'success' && '✅ Готово!'}
                                      {progress.status === 'error' && `❌ ${progress.error}`}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => generateAudio(index)}
                                  disabled={progress?.status === 'generating' || progress?.status === 'uploading'}
                                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                                >
                                  {progress?.status === 'generating' || progress?.status === 'uploading' 
                                    ? '⏳' 
                                    : '🎵 Генерировать'}
                                </button>
                              </div>
                              
                              {/* Preview audio if exists */}
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
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Выберите урок из списка
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
