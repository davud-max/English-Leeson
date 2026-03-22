'use client'

import { useState, useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import Link from 'next/link'

interface Slide {
  id: number
  title: string
  content: string
  emoji: string
  duration: number
  audioUrl?: string
  previewAudioUrl?: string
}

interface Voice {
  id: string
  name: string
  type: 'custom' | 'builtin'
  description?: string
}

const VOICES: Voice[] = [
  { id: 'dvlvChDGquF1SgaKcL95', name: 'DavudZ10', type: 'custom', description: '⭐ Default' },
  { id: '4rDtO45RFoYrGTCxcHDW', name: 'Voice 5', type: 'custom', description: '🔥 New' },
  { id: 'kFVUJfjBCiv9orAbWhZN', name: 'Custom Voice', type: 'custom', description: 'Recommended' },
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

interface ServerOperation {
  type: 'insert' | 'delete' | 'reorder'
  lessonId: string
  lessonSnapshot?: Lesson
  beforeOrder?: number
  afterOrder?: number
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
  const QUESTION_AUDIO_RAW_BASE = 'https://raw.githubusercontent.com/davud-max/English-Leeson/main/public/audio/questions'
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'slides' | 'audio' | 'quiz'>('slides')
  const [selectedVoice, setSelectedVoice] = useState('dvlvChDGquF1SgaKcL95')
  const [audioProgress, setAudioProgress] = useState<AudioGenerationProgress[]>([])
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
  const [focusTarget, setFocusTarget] = useState<CursorFocusTarget | null>(null)
  const [showTranslateModal, setShowTranslateModal] = useState(false)
  const [russianText, setRussianText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [adminKey, setAdminKey] = useState('')

  // Undo/Redo history
  const [undoStack, setUndoStack] = useState<Lesson[]>([])
  const [redoStack, setRedoStack] = useState<Lesson[]>([])
  const [serverUndoStack, setServerUndoStack] = useState<ServerOperation[]>([])
  const [serverRedoStack, setServerRedoStack] = useState<ServerOperation[]>([])
  const [isUndoRedoBusy, setIsUndoRedoBusy] = useState(false)
  
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
  const lastUndoCaptureRef = useRef<{ key: string; at: number } | null>(null)

  // Push current state to undo stack before destructive changes
  const pushUndo = (lessonState?: Lesson | null) => {
    const state = lessonState || selectedLesson
    if (!state) return
    setUndoStack(prev => [...prev.slice(-29), JSON.parse(JSON.stringify(state))])
    setRedoStack([])
  }

  const captureUndoForKey = (key: string, lessonState?: Lesson | null) => {
    const now = Date.now()
    const last = lastUndoCaptureRef.current
    if (!last || last.key !== key || now - last.at > 1000) {
      pushUndo(lessonState)
      lastUndoCaptureRef.current = { key, at: now }
    }
  }

  const undo = () => {
    if (undoStack.length === 0 || !selectedLesson) return
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(s => s.slice(0, -1))
    setRedoStack(s => [...s, JSON.parse(JSON.stringify(selectedLesson))])
    setSelectedLesson(prev)
    lastUndoCaptureRef.current = null
    setSaveStatus('↩️ Undo')
    setTimeout(() => setSaveStatus(''), 1500)
  }

  const redo = () => {
    if (redoStack.length === 0 || !selectedLesson) return
    const next = redoStack[redoStack.length - 1]
    setRedoStack(s => s.slice(0, -1))
    setUndoStack(s => [...s, JSON.parse(JSON.stringify(selectedLesson))])
    setSelectedLesson(next)
    lastUndoCaptureRef.current = null
    setSaveStatus('↪️ Redo')
    setTimeout(() => setSaveStatus(''), 1500)
  }

  const pushServerUndo = (op: ServerOperation) => {
    setServerUndoStack((prev) => [...prev.slice(-29), op])
    setServerRedoStack([])
  }

  const refreshLessonsAndSelect = async (preferredLessonId?: string | null) => {
    const updatedLessons = await fetchLessons()
    if (!updatedLessons.length) {
      setSelectedLesson(null)
      return
    }

    if (preferredLessonId) {
      const preferred = updatedLessons.find((l) => l.id === preferredLessonId)
      if (preferred) {
        setSelectedLesson(preferred)
        return
      }
    }

    setSelectedLesson(updatedLessons[0])
  }

  const undoServerOperation = async () => {
    if (!serverUndoStack.length || isUndoRedoBusy) return
    const op = serverUndoStack[serverUndoStack.length - 1]
    setIsUndoRedoBusy(true)

    try {
      if (op.type === 'insert') {
        const res = await fetch(`/api/admin/lessons/${op.lessonId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to undo inserted lesson')
        await refreshLessonsAndSelect(null)
      } else if (op.type === 'delete') {
        if (!op.lessonSnapshot) throw new Error('Missing lesson snapshot for restore')
        const res = await fetch('/api/admin/lessons/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lesson: op.lessonSnapshot }),
        })
        if (!res.ok) throw new Error('Failed to restore deleted lesson')
        await refreshLessonsAndSelect(op.lessonSnapshot.id)
      } else if (op.type === 'reorder') {
        if (!Number.isFinite(op.beforeOrder)) throw new Error('Missing previous order')
        const res = await fetch(`/api/admin/lessons/${op.lessonId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: op.beforeOrder }),
        })
        if (!res.ok) throw new Error('Failed to undo reorder')
        await refreshLessonsAndSelect(op.lessonId)
      }

      setServerUndoStack((prev) => prev.slice(0, -1))
      setServerRedoStack((prev) => [...prev.slice(-29), op])
      setSaveStatus('↩️ Server Undo')
      setTimeout(() => setSaveStatus(''), 1500)
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 3000)
    } finally {
      setIsUndoRedoBusy(false)
    }
  }

  const redoServerOperation = async () => {
    if (!serverRedoStack.length || isUndoRedoBusy) return
    const op = serverRedoStack[serverRedoStack.length - 1]
    setIsUndoRedoBusy(true)

    try {
      if (op.type === 'insert') {
        if (!op.lessonSnapshot) throw new Error('Missing lesson snapshot for re-insert')
        const res = await fetch('/api/admin/lessons/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lesson: op.lessonSnapshot }),
        })
        if (!res.ok) throw new Error('Failed to redo inserted lesson')
        await refreshLessonsAndSelect(op.lessonSnapshot.id)
      } else if (op.type === 'delete') {
        const res = await fetch(`/api/admin/lessons/${op.lessonId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to redo deletion')
        await refreshLessonsAndSelect(null)
      } else if (op.type === 'reorder') {
        if (!Number.isFinite(op.afterOrder)) throw new Error('Missing target order')
        const res = await fetch(`/api/admin/lessons/${op.lessonId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: op.afterOrder }),
        })
        if (!res.ok) throw new Error('Failed to redo reorder')
        await refreshLessonsAndSelect(op.lessonId)
      }

      setServerRedoStack((prev) => prev.slice(0, -1))
      setServerUndoStack((prev) => [...prev.slice(-29), op])
      setSaveStatus('↪️ Server Redo')
      setTimeout(() => setSaveStatus(''), 1500)
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 3000)
    } finally {
      setIsUndoRedoBusy(false)
    }
  }

  const undoAction = async () => {
    if (undoStack.length > 0) {
      undo()
      return
    }
    await undoServerOperation()
  }

  const redoAction = async () => {
    if (redoStack.length > 0) {
      redo()
      return
    }
    await redoServerOperation()
  }

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isEditable =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      if (isEditable) return

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          void redoAction()
        } else {
          void undoAction()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undoStack, redoStack, serverUndoStack, serverRedoStack, selectedLesson, isUndoRedoBusy])

  useEffect(() => {
    fetchLessons()
  }, [])

  useEffect(() => {
    if (selectedLesson) {
      void loadSavedQuizData(selectedLesson.order)
    } else {
      setGeneratedQuestions([])
      setQuizAudioResults([])
      setQuizMessage('')
    }
    // Clear history when switching lessons
    setUndoStack([])
    setRedoStack([])
    lastUndoCaptureRef.current = null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLesson?.id])

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

  const fetchLessons = async (): Promise<Lesson[]> => {
    try {
      const res = await fetch('/api/admin/lessons')
      if (res.ok) {
        const data = await res.json()
        setLessons(data)
        console.log(`Loaded ${data.length} lessons`)
        return data
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
      setSaveStatus('❌ Ошибка загрузки')
    } finally {
      setLoading(false)
    }
    return []
  }

  const questionAudioCandidates = (lessonOrder: number, questionNumber: number): string[] => {
    const cacheBust = Date.now()
    return [
      `${QUESTION_AUDIO_RAW_BASE}/lesson${lessonOrder}/question${questionNumber}.mp3?v=${cacheBust}`,
      `/audio/questions/lesson${lessonOrder}/question${questionNumber}.mp3`,
    ]
  }

  const checkQuestionAudioExists = async (lessonOrder: number, questionNumber: number): Promise<boolean> => {
    const candidates = questionAudioCandidates(lessonOrder, questionNumber)
    for (const url of candidates) {
      try {
        const res = await fetch(url, { method: 'HEAD' })
        if (res.ok) return true
      } catch {
        // try next url
      }
    }
    return false
  }

  const loadSavedQuizData = async (lessonOrder: number) => {
    setGeneratedQuestions([])
    setQuizAudioResults([])
    setQuizMessage('')

    try {
      const response = await fetch(`/api/questions?lessonId=${lessonOrder}`)
      if (!response.ok) {
        setQuizMessage('ℹ️ Saved questions not found for this lesson yet.')
        return
      }

      const data = await response.json()
      const loadedQuestions: GeneratedQuestion[] = Array.isArray(data?.questions) ? data.questions : []
      setGeneratedQuestions(loadedQuestions)

      if (loadedQuestions.length === 0) {
        setQuizMessage('ℹ️ Saved questions not found for this lesson yet.')
        return
      }

      const audioStatuses = await Promise.all(
        loadedQuestions.map(async (_q, index) => {
          const questionNumber = index + 1
          const exists = await checkQuestionAudioExists(lessonOrder, questionNumber)
          return {
            question: questionNumber,
            filename: `question${questionNumber}.mp3`,
            success: exists,
            audioUrl: exists ? questionAudioCandidates(lessonOrder, questionNumber)[0] : undefined,
            error: exists ? undefined : 'Audio file not found',
          } as QuizAudioResult
        })
      )

      setQuizAudioResults(audioStatuses)
      const audioCount = audioStatuses.filter((item) => item.success).length
      setQuizMessage(`ℹ️ Loaded ${loadedQuestions.length} saved questions, ${audioCount} audio files.`)
    } catch (error) {
      setQuizMessage(`❌ Failed to load saved quiz data: ${(error as Error).message}`)
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

  const applyLessonOrder = async () => {
    if (!selectedLesson) return
    const previousOrder = selectedLesson.order
    setSaveStatus('🔢 Updating order...')
    try {
      const res = await fetch(`/api/admin/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: Number(selectedLesson.order) }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(err.error || 'Failed to update order')
      }
      const updated = await res.json()
      setSelectedLesson((prev) => (prev ? { ...prev, order: updated.order } : prev))
      await fetchLessons()
      if (updated.order !== previousOrder) {
        pushServerUndo({
          type: 'reorder',
          lessonId: selectedLesson.id,
          beforeOrder: previousOrder,
          afterOrder: updated.order,
        })
      }
      setSaveStatus('✅ Order updated')
      setTimeout(() => setSaveStatus(''), 2500)
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 5000)
    }
  }

  const insertLessonAt = async (order: number) => {
    if (!selectedLesson) return
    setSaveStatus('➕ Inserting lesson...')
    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order,
          title: `New Lesson`,
          description: 'New lesson description',
          content: '',
          duration: 25,
          published: true,
          slides: [],
          emoji: '📖',
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(err.error || 'Failed to insert lesson')
      }
      const created = await res.json()
      await fetchLessons()
      const createdSnapshot: Lesson = {
        id: created.id,
        order: created.order,
        title: created.title,
        description: created.description,
        content: created.content,
        slides: created.slides || [],
        duration: created.duration,
        published: created.published,
        emoji: created.emoji,
        color: created.color,
      }
      pushServerUndo({
        type: 'insert',
        lessonId: created.id,
        lessonSnapshot: createdSnapshot,
      })
      setSelectedLesson((prev) =>
        prev
          ? {
              ...prev,
              id: created.id,
              order: created.order,
              title: created.title,
              description: created.description,
              content: created.content,
              slides: created.slides || [],
              duration: created.duration,
              published: created.published,
              emoji: created.emoji,
              color: created.color,
            }
          : prev
      )
      setSaveStatus(`✅ Inserted lesson at #${created.order}`)
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 5000)
    }
  }

  const deleteSelectedLesson = async () => {
    if (!selectedLesson) return
    const lessonToDelete: Lesson = JSON.parse(JSON.stringify(selectedLesson))
    const confirmed = window.confirm(
      `Delete lesson #${lessonToDelete.order} "${lessonToDelete.title}"?\n\nThis action cannot be undone.`
    )
    if (!confirmed) return

    setSaveStatus('🗑️ Deleting lesson...')
    try {
      const res = await fetch(`/api/admin/lessons/${lessonToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(err.error || 'Failed to delete lesson')
      }
      pushServerUndo({
        type: 'delete',
        lessonId: lessonToDelete.id,
        lessonSnapshot: lessonToDelete,
      })

      const updatedLessons = await fetchLessons()
      if (!updatedLessons.length) {
        setSelectedLesson(null)
      } else {
        const preferredOrder = Math.min(lessonToDelete.order, updatedLessons.length)
        const nextSelected =
          updatedLessons.find((item) => item.order === preferredOrder) ||
          updatedLessons[0]
        setSelectedLesson(nextSelected)
      }

      setSaveStatus(`✅ Deleted lesson #${lessonToDelete.order}`)
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus(`❌ ${(error as Error).message}`)
      setTimeout(() => setSaveStatus(''), 5000)
    }
  }

  const rollbackLesson = async () => {
    if (!selectedLesson) return
    
    // Получаем историю изменений урока
    try {
      setSaveStatus('🔄 Получение истории...')
      
      const historyRes = await fetch(`/api/admin/lesson-history/${selectedLesson.id}`)
      if (!historyRes.ok) {
        const error = await historyRes.json()
        throw new Error(error.error || 'Failed to fetch lesson history')
      }
      
      const { history } = await historyRes.json()
      
      if (history.length < 2) {
        setSaveStatus('ℹ️ Нет предыдущих версий для отката')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      
      // Показываем список версий для выбора (берем предыдущую версию)
      const previousVersion = history[1] // Берем предыдущую версию (текущая версия - индекс 0)
      
      const confirmed = window.confirm(
        `Откатить урок к версии от ${new Date(previousVersion.changedAt).toLocaleString()}?\n\n` +
        `Автор: ${previousVersion.changedBy}\n` +
        `Заголовок: ${previousVersion.title}`
      )
      
      if (!confirmed) return
      
      // Выполняем откат
      const rollbackRes = await fetch(`/api/admin/lesson-history/${selectedLesson.id}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId: previousVersion.id })
      })
      
      if (!rollbackRes.ok) {
        const error = await rollbackRes.json()
        throw new Error(error.error || 'Failed to rollback lesson')
      }
      
      const result = await rollbackRes.json()
      
      if (result.success) {
        // Обновляем состояние урока
        setSelectedLesson(result.updatedLesson)
        setSaveStatus('✅ Успешно откатано к предыдущей версии')
        setTimeout(() => setSaveStatus(''), 3000)
      } else {
        throw new Error(result.message || 'Rollback failed')
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
    pushUndo()
    const existingSlides = [...(selectedLesson.slides || [])]
    const newSlide: Slide = {
      id: existingSlides.length + 1,
      title: `Part ${existingSlides.length + 1}`,
      content: '',
      emoji: '📖',
      duration: 30000,
    }
    setSelectedLesson({
      ...selectedLesson,
      // New structural change invalidates index-based audio after insertion point.
      slides: [...existingSlides.map((s) => ({ ...s, audioUrl: undefined })), newSlide]
    })
  }

  const updateSlide = (index: number, field: keyof Slide, value: any) => {
    if (!selectedLesson) return
    captureUndoForKey(`slide-${index}-${field}`)
    const updatedSlides = [...(selectedLesson.slides || [])]
    const nextSlide = { ...updatedSlides[index], [field]: value }
    if (field === 'content') {
      // Content changed -> old audio is no longer valid for this slide.
      nextSlide.audioUrl = undefined
    }
    updatedSlides[index] = nextSlide
    setSelectedLesson({ ...selectedLesson, slides: updatedSlides })
  }

  const deleteSlide = (index: number) => {
    if (!selectedLesson) return
    pushUndo()
    const updatedSlides = [...(selectedLesson.slides || [])]
    updatedSlides.splice(index, 1)
    updatedSlides.forEach((slide, i) => {
      slide.id = i + 1
      // Any delete shifts slide indices: invalidate audio to prevent cross-slide mismatch.
      slide.audioUrl = undefined
    })
    setSelectedLesson({ ...selectedLesson, slides: updatedSlides })
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
      audioUrl: undefined,
    }))
  }

  const recreateSlides = () => {
    if (!selectedLesson || !selectedLesson.content) {
      setSaveStatus('❌ Нет контента')
      return
    }
    pushUndo()
    const newSlides = createSlidesFromContent(selectedLesson.content)
    setSelectedLesson({
      ...selectedLesson,
      slides: newSlides,
    })
    setSaveStatus(`✅ ${newSlides.length} слайдов`)
    setTimeout(() => setSaveStatus(''), 3000)
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
      pushUndo()
      const previous = slides[index - 1]
      const separator = previous.content && current.content ? '\n\n' : ''
      const previousEndPosition = previous.content.length

      const mergedSlide: Slide = {
        ...previous,
        content: `${previous.content}${separator}${current.content}`,
        // Merged content differs from both source audios.
        audioUrl: undefined,
      }

      const updatedSlides = [...slides]
      updatedSlides[index - 1] = mergedSlide
      updatedSlides.splice(index, 1)
      updatedSlides.forEach((slide, i) => {
        slide.id = i + 1
        if (i >= index - 1) {
          slide.audioUrl = undefined
        }
      })

      const mergedLesson = { ...selectedLesson, slides: updatedSlides }
      setSelectedLesson(mergedLesson)
      setFocusTarget({ slideIndex: index - 1, position: previousEndPosition })
      return
    }

    // Split current slide into two when Enter is pressed at cursor position.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      pushUndo()

      const before = current.content.slice(0, cursorStart)
      const after = current.content.slice(cursorEnd)

      const updatedSlides = [...slides]
      updatedSlides[index] = {
        ...current,
        content: before,
        audioUrl: undefined,
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
        if (i >= index) {
          slide.audioUrl = undefined
        }
      })

      setSelectedLesson({ ...selectedLesson, slides: updatedSlides })
      setFocusTarget({ slideIndex: index + 1, position: 0 })
    }
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
        if (data.savedToGitHub) {
          setQuizMessage(`✅ ${data.message || `Generated ${data.questions.length} questions and saved to GitHub`}`)
        } else {
          const reason = data.githubError || 'questions were generated but not saved to GitHub'
          setQuizMessage(`⚠️ ${data.message || `Generated ${data.questions.length} questions`}. Save failed: ${reason}`)
        }
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
  const generateAudio = async (
    slideIndex: number,
    lessonOverride?: Lesson
  ): Promise<{ audioUrl: string | null; previewAudioUrl: string | null; error: string | null }> => {
    const lesson = lessonOverride || selectedLesson
    if (!lesson) return { audioUrl: null, previewAudioUrl: null, error: 'Lesson is not selected' }
    
    const slide = lesson.slides[slideIndex]
    if (!slide.content) {
      setSaveStatus('❌ Нет текста')
      return { audioUrl: null, previewAudioUrl: null, error: 'Empty slide content' }
    }

    setAudioProgress((prev) => {
      const next = [...prev]
      next[slideIndex] = { slideIndex, status: 'generating' }
      return next
    })
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
      setAudioProgress((prev) => {
        const next = [...prev]
        next[slideIndex] = { slideIndex, status: 'uploading' }
        return next
      })
      setSaveStatus(`📤 Загрузка ${slideIndex + 1}...`)
      
      console.log(`Starting audio upload for lesson ${lesson.order}, slide ${slideIndex + 1}`);

      const uploadRes = await fetch('/api/admin/upload-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
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

      await uploadRes.json()
      
      // 3. Success - update slide with GitHub raw URL
      const githubRawUrl = `https://raw.githubusercontent.com/davud-max/English-Leeson/main/public/audio/lesson-${lesson.id}/slide${slideIndex + 1}.mp3?t=${Date.now()}`
      
      setAudioProgress((prev) => {
        const next = [...prev]
        next[slideIndex] = { slideIndex, status: 'success' }
        return next
      })

      setSaveStatus(`✅ Слайд ${slideIndex + 1} готов!`)
      setTimeout(() => setSaveStatus(''), 3000)
      return { audioUrl: githubRawUrl, previewAudioUrl: genData.audioUrl || null, error: null }

    } catch (error) {
      const message = (error as Error).message
      setAudioProgress((prev) => {
        const next = [...prev]
        next[slideIndex] = { 
          slideIndex, 
          status: 'error',
          error: message
        }
        return next
      })
      
      setSaveStatus(`❌ ${slideIndex + 1}: ${message}`)
      setTimeout(() => setSaveStatus(''), 5000)
      return { audioUrl: null, previewAudioUrl: null, error: message }
    }
  }

  const regenerateSlideAudio = async (slideIndex: number, lessonOverride?: Lesson) => {
    const lesson = lessonOverride || selectedLesson
    if (!lesson) return

    const { audioUrl, previewAudioUrl } = await generateAudio(slideIndex, lesson)
    if (!audioUrl) return

    setSelectedLesson((prev) => {
      if (!prev || prev.id !== lesson.id) return prev
      if (!prev.slides || !prev.slides[slideIndex]) return prev
      const updatedSlides = [...prev.slides]
      updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], audioUrl, previewAudioUrl: previewAudioUrl || undefined }
      return { ...prev, slides: updatedSlides }
    })
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

    let successCount = 0
    let failedCount = 0

    for (let i = 0; i < lesson.slides.length; i++) {
      const { audioUrl, previewAudioUrl, error } = await generateAudio(i, lesson)
      if (audioUrl) {
        updatedSlides[i] = { ...updatedSlides[i], audioUrl, previewAudioUrl: previewAudioUrl || undefined }
        successCount++
      } else {
        failedCount++
        if (error) {
          console.error(`Slide ${i + 1} audio failed: ${error}`)
        }
      }
      
      if (i < lesson.slides.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    // После завершения всех генераций обновляем состояние урока
    const finalLesson = { ...lesson, slides: updatedSlides }
    setSelectedLesson(finalLesson)

    setIsGeneratingAll(false)
    if (failedCount > 0) {
      setSaveStatus(`⚠️ Готово: ${successCount} успешно, ${failedCount} с ошибкой`)
    } else {
      setSaveStatus(`✅ Озвучено ${successCount} слайдов`)
    }

    if (successCount > 0) {
      try {
        const deployRes = await fetch('/api/admin/trigger-deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })

        if (deployRes.ok) {
          setSaveStatus((prev) => `${prev}. 🚀 Deploy started`)
        } else {
          const data = await deployRes.json().catch(() => ({ error: 'Deploy API failed' }))
          setSaveStatus((prev) => `${prev}. ⚠️ Deploy not started: ${data.error || 'Unknown error'}`)
        }
      } catch {
        setSaveStatus((prev) => `${prev}. ⚠️ Deploy request failed`)
      }
    }

    setTimeout(() => {
      setSaveStatus('')
      setAudioProgress([])
    }, 3000)
  }


  // Translate modal
  const translateAndImport = async () => {
    if (!russianText.trim()) {
      setSaveStatus('❌ Введите текст')
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
          ...(adminKey ? { adminKey } : {})
        }),
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Translation failed')
      }

      const translatedText = data.result
      const paragraphs = translatedText.split('\n\n').filter((p: string) => p.trim().length > 0)
      
      if (selectedLesson) {
        pushUndo()
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
                      onChange={(e) => {
                        captureUndoForKey('lesson-title')
                        setSelectedLesson({ ...selectedLesson, title: e.target.value })
                      }}
                      className="text-2xl font-bold border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 outline-none w-full"
                    />
                    <textarea
                      value={selectedLesson.description}
                      onChange={(e) => {
                        captureUndoForKey('lesson-description')
                        setSelectedLesson({ ...selectedLesson, description: e.target.value })
                      }}
                      className="mt-2 text-gray-600 border rounded p-2 w-full"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2 rounded border border-stone-300 px-2 py-1">
                    <span className="text-xs text-stone-600">Order</span>
                    <input
                      type="number"
                      min={1}
                      value={selectedLesson.order}
                      onChange={(e) => {
                        captureUndoForKey('lesson-order')
                        setSelectedLesson({ ...selectedLesson, order: Number(e.target.value) || 1 })
                      }}
                      className="w-20 rounded border border-stone-300 px-2 py-1 text-sm"
                    />
                    <button
                      onClick={applyLessonOrder}
                      className="rounded bg-amber-700 px-3 py-1 text-sm font-medium text-white hover:bg-amber-800"
                    >
                      Apply
                    </button>
                  </div>
                  
                  <button
                    onClick={() => insertLessonAt(Math.max(1, selectedLesson.order))}
                    className="rounded border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                  >
                    Insert Before
                  </button>
                  <button
                    onClick={() => insertLessonAt(Math.max(1, selectedLesson.order + 1))}
                    className="rounded border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                  >
                    Insert After
                  </button>
                  <button
                    onClick={deleteSelectedLesson}
                    className="rounded border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete Lesson
                  </button>

                  {/* Published Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLesson.published}
                      onChange={(e) => {
                        pushUndo()
                        setSelectedLesson({ ...selectedLesson, published: e.target.checked })
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className={`text-sm font-medium ${selectedLesson.published ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedLesson.published ? '✅ Published' : '🚫 Draft'}
                    </span>
                  </label>
                  
                  <div className="border-l h-8 mx-2"></div>
                  
                  <button
                    onClick={() => void undoAction()}
                    disabled={isUndoRedoBusy || (undoStack.length === 0 && serverUndoStack.length === 0)}
                    className="border border-stone-300 text-stone-700 px-3 py-2 rounded hover:bg-stone-100 disabled:opacity-30 text-sm"
                    title="Undo (Ctrl+Z)"
                  >
                    ↩ Undo
                    {undoStack.length + serverUndoStack.length > 0
                      ? ` (${undoStack.length + serverUndoStack.length})`
                      : ''}
                  </button>
                  <button
                    onClick={() => void redoAction()}
                    disabled={isUndoRedoBusy || (redoStack.length === 0 && serverRedoStack.length === 0)}
                    className="border border-stone-300 text-stone-700 px-3 py-2 rounded hover:bg-stone-100 disabled:opacity-30 text-sm"
                    title="Redo (Ctrl+Shift+Z)"
                  >
                    ↪ Redo
                    {redoStack.length + serverRedoStack.length > 0
                      ? ` (${redoStack.length + serverRedoStack.length})`
                      : ''}
                  </button>
                  <button onClick={saveLesson} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    💾 Сохранить
                  </button>
                  <button onClick={() => setShowTranslateModal(true)} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                    🌐 Translate RU→EN
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
                      <div className="mb-3 flex justify-end">
                        <button
                          onClick={() => setShowTranslateModal(true)}
                          className="rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                        >
                          🌐 Translate RU→EN
                        </button>
                      </div>
                      <textarea
                        value={selectedLesson.content}
                        onChange={(e) => {
                          captureUndoForKey('lesson-content')
                          setSelectedLesson({ ...selectedLesson, content: e.target.value })
                        }}
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
                          <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                          >
                            <optgroup label="Custom">
                              {VOICES.filter(v => v.type === 'custom').map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Built-in">
                              {VOICES.filter(v => v.type === 'builtin').map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                              ))}
                            </optgroup>
                          </select>
                          <button
                            onClick={recreateSlides}
                            className="bg-amber-600 text-white px-4 py-2 rounded text-sm"
                          >
                            🔄 Разбить
                          </button>
                          <button
                            onClick={() => generateAllAudio()}
                            disabled={isGeneratingAll}
                            className="bg-green-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                          >
                            {isGeneratingAll ? '⏳ Озвучивание...' : '🎙️ Озвучить'}
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
                                  onClick={() => regenerateSlideAudio(index)}
                                  disabled={progress?.status === 'generating' || progress?.status === 'uploading'}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                                >
                                  {progress?.status === 'generating' || progress?.status === 'uploading' ? '⏳' : '🎵'}
                                </button>
                              </div>
                              <audio
                                controls
                                key={slide.previewAudioUrl || slide.audioUrl || `slide-${index}`}
                                src={slide.previewAudioUrl || slide.audioUrl || `/audio/lesson-${selectedLesson.id}/slide${index + 1}.mp3`}
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
                disabled={isTranslating || !russianText.trim()}
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
