'use client'

import { useState, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
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

interface GeneratedQuestion {
  id: number
  question: string
  correct_answer: string
  difficulty: string
  points: number
}

interface QuizAudioResult {
  question: number
  filename: string
  success: boolean
  size?: number
  audioBase64?: string
  audioUrl?: string
  error?: string
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

interface CursorFocusTarget {
  slideIndex: number
  position: number
}

export default function LessonEditorComplete() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'slides' | 'audio' | 'quiz'>('slides')
  const [selectedVoice, setSelectedVoice] = useState('erDx71FK2teMZ7g6khzw')
  const [audioProgress, setAudioProgress] = useState<AudioGenerationProgress[]>([])
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
  const [isRebuildingAndVoicing, setIsRebuildingAndVoicing] = useState(false)
  const [focusTarget, setFocusTarget] = useState<CursorFocusTarget | null>(null)
  const [showTranslateModal, setShowTranslateModal] = useState(false)
  const [russianText, setRussianText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  
  // Quiz Generator states
  const [quizCount, setQuizCount] = useState(5)
  const [quizDifficulty, setQuizDifficulty] = useState('mixed')
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [quizMessage, setQuizMessage] = useState('')
  const [isGeneratingQuizAudio, setIsGeneratingQuizAudio] = useState(false)
  const [quizAudioResults, setQuizAudioResults] = useState<QuizAudioResult[]>([])
  const [isSavingQuizAudio, setIsSavingQuizAudio] = useState(false)
  const [quizSaveProgress, setQuizSaveProgress] = useState({ current: 0, total: 0 })

  useEffect(() => {
    fetchLessons()
  }, [])

  useEffect(() => {
    if (selectedLesson) {
      // Reset quiz state when lesson changes
      setGeneratedQuestions([])
      setQuizAudioResults([])
      setQuizMessage('')
    }
  }, [selectedLesson])

  useEffect(() => {
    if (!focusTarget) return

    const id = requestAnimationFrame(() => {
      const el = document.querySelector(
        `textarea[data-slide-index="${focusTarget.slideIndex}"]`
      ) as HTMLTextAreaElement | null

      if (el) {
        el.focus()
        el.setSelectionRange(focusTarget.position, focusTarget.position)
      }
      setFocusTarget(null)
    })

    return () => cancelAnimationFrame(id)
  }, [focusTarget, selectedLesson])

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

  const handleSlideKeyDown = (index: number, e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!selectedLesson) return
    const slides = selectedLesson.slides || []
    const current = slides[index]
    if (!current) return

    const cursorStart = e.currentTarget.selectionStart
    const cursorEnd = e.currentTarget.selectionEnd
    const hasSelection = cursorStart !== cursorEnd

    // Merge current slide into previous when Backspace is pressed at the first position.
    if (e.key === 'Backspace' && !hasSelection && cursorStart === 0 && index > 0) {
      e.preventDefault()
      const previous = slides[index - 1]
      const separator = previous.content && current.content ? '\n\n' : ''
      const previousEndPosition = previous.content.length

      const mergedSlide: Slide = {
        ...previous,
        content: `${previous.content}${separator}${current.content}`,
      }

      const updatedSlides = [...slides]
      updatedSlides[index - 1] = mergedSlide
      updatedSlides.splice(index, 1)
      updatedSlides.forEach((slide, i) => {
        slide.id = i + 1
      })

      setSelectedLesson({ ...selectedLesson, slides: updatedSlides })
      setFocusTarget({ slideIndex: index - 1, position: previousEndPosition })
      return
    }

    // Split current slide into two when Enter is pressed at cursor position.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      const before = current.content.slice(0, cursorStart)
      const after = current.content.slice(cursorEnd)

      const updatedSlides = [...slides]
      updatedSlides[index] = {
        ...current,
        content: before,
      }

      const newSlide: Slide = {
        id: index + 2,
        title: `Part ${index + 2}`,
        content: after,
        emoji: current.emoji || '📖',
        duration: current.duration || 30000,
      }

      updatedSlides.splice(index + 1, 0, newSlide)
      updatedSlides.forEach((slide, i) => {
        slide.id = i + 1
      })

      setSelectedLesson({ ...selectedLesson, slides: updatedSlides })
      setFocusTarget({ slideIndex: index + 1, position: 0 })
    }
  }

  const createSlidesFromContent = (content: string): Slide[] => {
    const paragraphs = content
      .split(/\n\n+/)
      .filter(p => p.trim().length > 0)

    return paragraphs.map((paragraph, index) => ({
      id: index + 1,
      title: `Part ${index + 1}`,
      content: paragraph.trim(),
      emoji: '📖',
      duration: 30000,
    }))
  }

  const recreateSlides = () => {
    if (!selectedLesson || !selectedLesson.content) {
      setSaveStatus('❌ Нет контента')
      return
    }
    
    setSaveStatus('🔄 Разбиение...')
    const newSlides = createSlidesFromContent(selectedLesson.content)
    
    setSelectedLesson({
      ...selectedLesson,
      slides: newSlides
    })
    
    setSaveStatus(`✅ ${newSlides.length} слайдов`)
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Quiz Generator functions
  const generateQuizQuestions = async () => {
    if (!selectedLesson || !adminKey) {
      setQuizMessage('❌ Enter admin key')
      return
    }

    const content = selectedLesson.content || selectedLesson.slides?.map(s => s.content).join('\n\n')
    if (!content) {
      setQuizMessage('❌ No lesson content')
      return
    }

    setIsGeneratingQuiz(true)
    setQuizMessage('🔄 Generating with Claude AI...')
    setGeneratedQuestions([])
    setQuizAudioResults([])

    try {
      const response = await fetch('/api/admin/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson.order,
          lessonTitle: selectedLesson.title,
          lessonContent: content,
          count: quizCount,
          difficulty: quizDifficulty,
          adminKey,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setGeneratedQuestions(data.questions)
        setQuizMessage(`✅ Generated ${data.questions.length} questions` + (data.savedToGitHub ? ' (saved to GitHub)' : ''))
      } else {
        setQuizMessage('❌ ' + (data.error || 'Failed to generate'))
      }
    } catch (error) {
      setQuizMessage('❌ ' + (error as Error).message)
    } finally {
      setIsGeneratingQuiz(false)
    }
  }

  const generateQuizAudio = async () => {
    if (!selectedLesson || !adminKey || generatedQuestions.length === 0) {
      setQuizMessage('❌ Generate questions first')
      return
    }

    setIsGeneratingQuizAudio(true)
    setQuizAudioResults([])
    setQuizMessage('🎤 Generating audio...')

    try {
      const response = await fetch('/api/admin/generate-question-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson.order,
          questions: generatedQuestions,
          adminKey,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setQuizAudioResults(data.results || [])
        const successCount = data.results?.filter((r: QuizAudioResult) => r.success).length || 0
        setQuizMessage(`✅ Generated ${successCount} audio files`)
      } else {
        setQuizMessage('❌ ' + (data.error || 'Audio generation failed'))
      }
    } catch (error) {
      setQuizMessage('❌ ' + (error as Error).message)
    } finally {
      setIsGeneratingQuizAudio(false)
    }
  }

  const saveQuizAudioToRepo = async () => {
    if (!selectedLesson || !adminKey) return

    const successfulAudios = quizAudioResults.filter(r => r.success && r.audioBase64)
    if (successfulAudios.length === 0) {
      setQuizMessage('❌ No audio to save')
      return
    }

    setIsSavingQuizAudio(true)
    setQuizSaveProgress({ current: 0, total: successfulAudios.length + 1 })
    setQuizMessage('💾 Saving to GitHub...')

    try {
      // Clear old files
      await fetch('/api/admin/clear-question-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonNumber: selectedLesson.order, adminKey }),
      })

      // Upload new files
      let uploadedCount = 0
      for (let i = 0; i < successfulAudios.length; i++) {
        const audio = successfulAudios[i]
        setQuizSaveProgress({ current: i + 1, total: successfulAudios.length })

        try {
          const uploadRes = await fetch('/api/admin/upload-question-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonNumber: selectedLesson.order,
              questionNumber: audio.question,
              audioBase64: audio.audioBase64,
              adminKey,
            }),
          })

          if (uploadRes.ok) uploadedCount++
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (e) {
          console.error(`Error uploading question ${audio.question}:`, e)
        }
      }

      // Trigger deploy
      try {
        await fetch('/api/admin/trigger-deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminKey }),
        })
        setQuizMessage(`✅ Saved ${uploadedCount} files! Deploy started.`)
      } catch {
        setQuizMessage(`✅ Saved ${uploadedCount} files!`)
      }
    } catch (error) {
      setQuizMessage('❌ ' + (error as Error).message)
    } finally {
      setIsSavingQuizAudio(false)
    }
  }

  // Audio generation
  const generateAudio = async (slideIndex: number, lessonOverride?: Lesson): Promise<string | null> => {
    const lesson = lessonOverride || selectedLesson
    if (!lesson) return null
    
    const slide = lesson.slides[slideIndex]
    if (!slide.content) {
      setSaveStatus('❌ Нет текста')
      return null
    }

    const progressCopy = [...audioProgress]
    progressCopy[slideIndex] = { slideIndex, status: 'generating' }
    setAudioProgress(progressCopy)
    setSaveStatus(`🎵 Генерация ${slideIndex + 1}...`)

    try {
      console.log(`Starting audio generation for lesson ${lesson.order}, slide ${slideIndex + 1}`);
      
      // 1. Generate audio
      const genRes = await fetch('/api/admin/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: slide.content,
          voiceId: selectedVoice,
          lessonId: lesson.order.toString(),
          slideNumber: slideIndex + 1,
        }),
      })

      console.log(`Generate audio response status: ${genRes.status} for lesson ${lesson.order}, slide ${slideIndex + 1}`);
      
      if (!genRes.ok) {
        const errorData = await genRes.json().catch(() => ({ error: `HTTP ${genRes.status}` }));
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
      
      console.log(`Starting audio upload for lesson ${lesson.order}, slide ${slideIndex + 1}`);

      const uploadRes = await fetch('/api/admin/upload-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonNumber: lesson.order,
          slideNumber: slideIndex + 1,
          audioBase64: genData.audioBase64,
        }),
      })

      console.log(`Upload audio response status: ${uploadRes.status} for lesson ${lesson.order}, slide ${slideIndex + 1}`);
      
      if (!uploadRes.ok) {
        const uploadError = await uploadRes.json().catch(() => ({ error: `Upload failed with status ${uploadRes.status}` }));
        throw new Error(uploadError.error || 'Upload failed')
      }

      const uploadData = await uploadRes.json()
      
      // 3. Success - update slide with GitHub raw URL
      const githubRawUrl = `https://raw.githubusercontent.com/davud-max/English-Leeson/main/public/audio/lesson${lesson.order}/slide${slideIndex + 1}.mp3?t=${Date.now()}`
      
      progressCopy[slideIndex] = { 
        slideIndex, 
        status: 'success',
      }
      setAudioProgress([...progressCopy])

      setSaveStatus(`✅ Слайд ${slideIndex + 1} готов!`)
      setTimeout(() => setSaveStatus(''), 3000)
      return githubRawUrl

    } catch (error) {
      progressCopy[slideIndex] = { 
        slideIndex, 
        status: 'error',
        error: (error as Error).message 
      }
      setAudioProgress([...progressCopy])
      
      setSaveStatus(`❌ ${slideIndex + 1}: ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 5000)
      return null
    }
  }

  const generateAllAudio = async (lessonOverride?: Lesson) => {
    const lesson = lessonOverride || selectedLesson
    if (!lesson || !lesson.slides?.length) return

    setIsGeneratingAll(true)
    setSaveStatus(`🎵 Генерация ${lesson.slides.length} файлов...`)
    
    const initialProgress = lesson.slides.map((_, index) => ({
      slideIndex: index,
      status: 'pending' as const
    }))
    setAudioProgress(initialProgress)

    // Создаем копию слайдов для обновления после завершения генерации
    const updatedSlides = [...lesson.slides];

    for (let i = 0; i < lesson.slides.length; i++) {
      try {
        const audioUrl = await generateAudio(i, lesson)
        if (audioUrl) {
          updatedSlides[i] = { ...updatedSlides[i], audioUrl }
        }
      } catch (error) {
        console.error(`Error generating audio for slide ${i + 1}:`, error)
        
        // Update progress to show error
        const progressCopy = [...audioProgress]
        progressCopy[i] = { 
          slideIndex: i, 
          status: 'error',
          error: (error as Error).message 
        }
        setAudioProgress([...progressCopy])
        
        setSaveStatus(`❌ Ошибка при генерации слайда ${i + 1}: ${(error as Error).message}`)
      }
      
      if (i < lesson.slides.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    // После завершения всех генераций обновляем состояние урока
    const finalLesson = { ...lesson, slides: updatedSlides }
    setSelectedLesson(finalLesson)

    setIsGeneratingAll(false)
    setSaveStatus('✅ Все готово!')
    setTimeout(() => {
      setSaveStatus('')
      setAudioProgress([])
    }, 3000)
  }

  const recreateSlidesAndRegenerateAudio = async () => {
    if (!selectedLesson || !selectedLesson.content) {
      setSaveStatus('❌ Нет контента')
      return
    }

    setIsRebuildingAndVoicing(true)
    setSaveStatus('🔄 Пересобираем слайды...')

    const rebuiltSlides = createSlidesFromContent(selectedLesson.content)
    const rebuiltLesson: Lesson = {
      ...selectedLesson,
      slides: rebuiltSlides,
    }

    setSelectedLesson(rebuiltLesson)
    setSaveStatus(`💾 Сохраняем ${rebuiltSlides.length} слайдов...`)

    try {
      const res = await fetch(`/api/admin/lessons/${rebuiltLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: rebuiltLesson.title,
          description: rebuiltLesson.description,
          content: rebuiltLesson.content,
          slides: rebuiltLesson.slides,
          duration: rebuiltLesson.duration,
          published: rebuiltLesson.published,
          emoji: rebuiltLesson.emoji,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to save rebuilt slides' }))
        throw new Error(err.error || 'Failed to save rebuilt slides')
      }

      await generateAllAudio(rebuiltLesson)
      fetchLessons()
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 5000)
    } finally {
      setIsRebuildingAndVoicing(false)
    }
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
                } ${!lesson.published ? 'opacity-60' : ''}`}
              >
                <div className="font-medium text-sm flex items-center gap-2">
                  <span>{lesson.emoji || '📖'}</span>
                  <span>{lesson.order}. {lesson.title}</span>
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${lesson.published ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {lesson.published ? '✅' : '🚫'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {lesson.slides?.length || 0} слайдов • {lesson.published ? 'Published' : 'Draft'}
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

                <div className="flex gap-3 items-center">
                  {/* Published Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLesson.published}
                      onChange={(e) => setSelectedLesson({ ...selectedLesson, published: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className={`text-sm font-medium ${selectedLesson.published ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedLesson.published ? '✅ Published' : '🚫 Draft'}
                    </span>
                  </label>
                  
                  <div className="border-l h-8 mx-2"></div>
                  
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
                      { id: 'quiz', label: '🎯 Quiz Generator', count: generatedQuestions.length },
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
                          <button
                            onClick={recreateSlidesAndRegenerateAudio}
                            disabled={isRebuildingAndVoicing || isGeneratingAll}
                            className="bg-green-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                          >
                            {isRebuildingAndVoicing ? '⏳ Пересборка...' : '🎙️ Разбить + Озвучить'}
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
                              onKeyDown={(e) => handleSlideKeyDown(index, e)}
                              data-slide-index={index}
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
                            onClick={() => generateAllAudio()}
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
                                key={slide.audioUrl || `slide-${index}`}
                                src={slide.audioUrl || `/audio/lesson${selectedLesson.order}/slide${index + 1}.mp3`}
                                className="w-full h-8 mt-3"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quiz Generator */}
                  {activeTab === 'quiz' && (
                    <div className="space-y-6">
                      {/* Settings */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                        <h3 className="text-lg font-bold mb-4">🎯 Quiz Questions Generator</h3>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Admin Key</label>
                            <input
                              type="password"
                              value={adminKey}
                              onChange={(e) => setAdminKey(e.target.value)}
                              className="w-full border rounded px-3 py-2 text-sm"
                              placeholder="Enter key..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Questions</label>
                            <select
                              value={quizCount}
                              onChange={(e) => setQuizCount(Number(e.target.value))}
                              className="w-full border rounded px-3 py-2 text-sm"
                            >
                              {[3, 5, 7, 10].map(n => (
                                <option key={n} value={n}>{n} questions</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Difficulty</label>
                            <select
                              value={quizDifficulty}
                              onChange={(e) => setQuizDifficulty(e.target.value)}
                              className="w-full border rounded px-3 py-2 text-sm"
                            >
                              <option value="mixed">Mixed</option>
                              <option value="easy">Easy Only</option>
                              <option value="hard">Hard Only</option>
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={generateQuizQuestions}
                          disabled={isGeneratingQuiz || !adminKey}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition disabled:opacity-50"
                        >
                          {isGeneratingQuiz ? '🔄 Generating with Claude AI...' : '✨ Generate Questions'}
                        </button>

                        {quizMessage && (
                          <p className={`mt-3 text-center text-sm ${quizMessage.startsWith('✅') ? 'text-green-600' : quizMessage.startsWith('❌') ? 'text-red-600' : 'text-blue-600'}`}>
                            {quizMessage}
                          </p>
                        )}
                      </div>

                      {/* Generated Questions */}
                      {generatedQuestions.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-700">Generated Questions:</h4>
                          {generatedQuestions.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium">Q{i + 1}: {q.question}</p>
                                  <p className="text-sm text-gray-600 mt-1">✅ {q.correct_answer}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${q.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                  {q.difficulty === 'hard' ? '🔥 Hard' : '📗 Easy'} • {q.points}pts
                                </span>
                              </div>
                              {quizAudioResults[i]?.success && quizAudioResults[i]?.audioUrl && (
                                <audio src={quizAudioResults[i].audioUrl} controls className="w-full h-8 mt-2" />
                              )}
                            </div>
                          ))}

                          {/* Audio Generation */}
                          <div className="border-t pt-4 space-y-3">
                            <button
                              onClick={generateQuizAudio}
                              disabled={isGeneratingQuizAudio}
                              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-bold transition disabled:opacity-50"
                            >
                              {isGeneratingQuizAudio ? '⏳ Generating Audio...' : '🎤 Generate Audio for Questions'}
                            </button>

                            {quizAudioResults.filter(r => r.success).length > 0 && (
                              <button
                                onClick={saveQuizAudioToRepo}
                                disabled={isSavingQuizAudio}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-bold transition disabled:opacity-50"
                              >
                                {isSavingQuizAudio 
                                  ? `⏳ Saving... ${quizSaveProgress.current}/${quizSaveProgress.total}` 
                                  : `💾 Save to GitHub (${quizAudioResults.filter(r => r.success).length} files)`
                                }
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {generatedQuestions.length === 0 && !isGeneratingQuiz && (
                        <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
                          <div className="text-4xl mb-3">🧠</div>
                          <p>Questions will be auto-generated from lesson content</p>
                          <p className="text-sm mt-1">Enter admin key and click Generate</p>
                        </div>
                      )}
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
