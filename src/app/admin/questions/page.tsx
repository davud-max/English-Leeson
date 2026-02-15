'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Slide {
  id: number
  content?: string
}

interface LessonForQuestions {
  id: string
  order: number
  title: string
  content: string
  slides?: Slide[] | null
  published?: boolean
}

interface Question {
  id: number
  question: string
  correct_answer: string
  difficulty: string
  points: number
}

interface AudioResult {
  question: number
  filename: string
  success: boolean
  size?: number
  audioBase64?: string
  audioUrl?: string
  error?: string
}

export default function AdminQuestionsPage() {
  const [lessons, setLessons] = useState<LessonForQuestions[]>([])
  const [lessonsLoading, setLessonsLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [count, setCount] = useState(5)
  const [difficulty, setDifficulty] = useState('mixed')
  const [adminKey, setAdminKey] = useState('')
  const [voiceId] = useState('erDx71FK2teMZ7g6khzw') // New Voice (fixed)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; questions?: Question[] } | null>(null)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioResults, setAudioResults] = useState<AudioResult[]>([])
  const [audioMessage, setAudioMessage] = useState<string | null>(null)
  const [isSavingToRepo, setIsSavingToRepo] = useState(false)
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 })
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch('/api/admin/lessons')
        if (!res.ok) return
        const data = (await res.json()) as LessonForQuestions[]
        const normalized = data
          .filter((l) => l.published !== false)
          .sort((a, b) => a.order - b.order)
          .map((l) => ({
            ...l,
            content:
              (l.content && l.content.trim()) ||
              (Array.isArray(l.slides) ? l.slides.map((s) => s?.content || '').join('\n\n').trim() : ''),
          }))
        setLessons(normalized)
      } catch (e) {
        console.error('Failed to fetch lessons for questions:', e)
      } finally {
        setLessonsLoading(false)
      }
    }

    fetchLessons()
  }, [])

  const generateQuestions = async () => {
    if (!selectedLesson || !adminKey) {
      alert('Please select a lesson and enter admin key')
      return
    }

    const lesson = lessons.find(l => l.order === selectedLesson)
    if (!lesson) return

    setIsGenerating(true)
    setResult(null)
    setAudioResults([])
    setAudioMessage(null)
    setSaveMessage(null)

    try {
      const response = await fetch('/api/admin/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson,
          lessonTitle: lesson.title,
          lessonContent: lesson.content,
          count,
          difficulty,
          adminKey,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult({
          success: true,
          message: data.message,
          questions: data.questions,
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to generate questions',
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Connection error: ' + (error instanceof Error ? error.message : 'Unknown'),
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate audio for questions
  const generateAudioNow = async () => {
    if (!selectedLesson || !adminKey || !result?.questions) {
      alert('Please generate questions first')
      return
    }

    setIsGeneratingAudio(true)
    setAudioResults([])
    setAudioMessage(null)
    setSaveMessage(null)

    try {
      const response = await fetch('/api/admin/generate-question-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson,
          questions: result.questions,
          adminKey,
          voiceId,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setAudioResults(data.results || [])
        setAudioMessage(data.message)
      } else {
        setAudioMessage('❌ ' + (data.error || 'Failed to generate audio'))
      }
    } catch (error) {
      setAudioMessage('❌ Connection error: ' + (error instanceof Error ? error.message : 'Unknown'))
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  // Save audio to GitHub repository
  const saveToRepository = async () => {
    if (!selectedLesson || !adminKey) {
      alert('Missing lesson or admin key')
      return
    }

    const successfulAudios = audioResults.filter(r => r.success && r.audioBase64)
    if (successfulAudios.length === 0) {
      alert('No audio to save. Generate audio first.')
      return
    }

    setIsSavingToRepo(true)
    setSaveProgress({ current: 0, total: successfulAudios.length + 1 })
    setSaveMessage(null)

    try {
      // Step 1: Delete old audio files
      setSaveProgress({ current: 0, total: successfulAudios.length + 1 })
      
      const clearRes = await fetch('/api/admin/clear-question-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonNumber: selectedLesson, adminKey }),
      })

      if (!clearRes.ok) {
        const errorData = await clearRes.json()
        throw new Error(`Failed to clear old files: ${errorData.error}`)
      }

      const clearData = await clearRes.json()
      console.log(`Deleted ${clearData.deleted} old question audio files`)

      // Step 2: Upload new audio files
      let uploadedCount = 0
      for (let i = 0; i < successfulAudios.length; i++) {
        const audio = successfulAudios[i]
        setSaveProgress({ current: i + 1, total: successfulAudios.length })

        try {
          const uploadRes = await fetch('/api/admin/upload-question-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonNumber: selectedLesson,
              questionNumber: audio.question,
              audioBase64: audio.audioBase64,
              adminKey,
            }),
          })

          if (uploadRes.ok) {
            uploadedCount++
          } else {
            const errorData = await uploadRes.json()
            console.error(`Failed to upload question ${audio.question}:`, errorData.error)
          }

          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (e) {
          console.error(`Error uploading question ${audio.question}:`, e)
        }
      }

      // Step 3: Trigger Railway redeploy
      try {
        const deployRes = await fetch('/api/admin/trigger-deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminKey }),
        });
        
        if (deployRes.ok) {
          setSaveMessage(`✅ Saved ${uploadedCount} audio files! 🚀 Railway deploy started automatically.`);
        } else {
          setSaveMessage(`✅ Saved ${uploadedCount} audio files! ⚠️ Auto-deploy failed. Run git pull && git push manually.`);
        }
      } catch (deployErr) {
        console.error('Deploy trigger failed:', deployErr);
        setSaveMessage(`✅ Saved ${uploadedCount} audio files! ⚠️ Auto-deploy unavailable. Run git pull && git push manually.`);
      }
    } catch (error) {
      setSaveMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown'))
    } finally {
      setIsSavingToRepo(false)
    }
  }

  // Download single audio
  const downloadAudio = (audioUrl: string, filename: string) => {
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const successfulAudioCount = audioResults.filter(r => r.success).length
  const canSaveToRepo = selectedLesson && successfulAudioCount > 0 && !isGeneratingAudio && !isSavingToRepo

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl shadow-lg p-8 border border-slate-700">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">🎓 Quiz Questions Generator</h1>
            <Link href="/admin" className="text-purple-400 hover:text-purple-300">
              ← Back to Admin
            </Link>
          </div>

          <div className="space-y-6">
            {/* Admin Key */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin Secret Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key..."
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Lesson Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Lesson
              </label>
              <select
                value={selectedLesson || ''}
                onChange={(e) => setSelectedLesson(Number(e.target.value))}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                disabled={lessonsLoading}
              >
                <option value="">
                  {lessonsLoading ? '-- Loading lessons --' : '-- Select a lesson --'}
                </option>
                {lessons.map(lesson => (
                  <option key={lesson.id} value={lesson.order}>
                    Lesson {lesson.order}: {lesson.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Questions
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {[3, 5, 7, 10].map(n => (
                    <option key={n} value={n}>{n} questions</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="mixed">Mixed</option>
                  <option value="easy">Easy Only</option>
                  <option value="hard">Hard Only</option>
                </select>
              </div>
            </div>

            {/* Generate Questions Button */}
            <button
              onClick={generateQuestions}
              disabled={isGenerating || !selectedLesson || !adminKey}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? '🔄 Generating with Claude AI...' : '✨ Generate Questions'}
            </button>

            {/* Questions Result */}
            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
                <p className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? '✅ ' : '❌ '}{result.message}
                </p>
                
                {result.questions && (
                  <div className="mt-4 space-y-3">
                    {result.questions.map((q, i) => (
                      <div key={i} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                        <p className="font-medium text-white">Q{i + 1}: {q.question}</p>
                        <p className="text-sm text-slate-400 mt-1">Answer: {q.correct_answer}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {q.difficulty === 'hard' ? '🔥 Hard' : '📗 Easy'} • {q.points} points
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audio Generation Section */}
            {result?.success && result.questions && (
              <div className="border-t border-slate-700 pt-6 space-y-4">
                <h3 className="text-xl font-bold text-white">🎙️ Audio Generation</h3>
                
                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Voice for Audio Generation
                  </label>
                  <select
                    value={voiceId}
                    disabled
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="erDx71FK2teMZ7g6khzw">New Voice (default)</option>
                  </select>
                </div>

                {/* Generate Audio Button */}
                <button
                  onClick={generateAudioNow}
                  disabled={isGeneratingAudio}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingAudio ? '⏳ Generating Audio...' : '🎤 Generate Audio for Questions'}
                </button>

                {/* Audio Message */}
                {audioMessage && (
                  <p className={`text-center ${audioMessage.startsWith('❌') ? 'text-red-400' : 'text-green-400'}`}>
                    {audioMessage}
                  </p>
                )}

                {/* Audio Results */}
                {audioResults.length > 0 && (
                  <div className="space-y-2">
                    {audioResults.map((r, i) => (
                      <div key={i} className={`p-3 rounded-lg flex items-center justify-between ${
                        r.success ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'
                      }`}>
                        <div>
                          <span className={r.success ? 'text-green-400' : 'text-red-400'}>
                            {r.success ? '✅' : '❌'} Question {r.question}
                          </span>
                          {r.success && r.size && (
                            <span className="text-slate-500 text-sm ml-2">({r.size}KB)</span>
                          )}
                          {r.error && (
                            <span className="text-red-400 text-sm ml-2">{r.error}</span>
                          )}
                        </div>
                        {r.success && r.audioUrl && (
                          <div className="flex items-center gap-2">
                            <audio src={r.audioUrl} controls className="h-8 w-32" />
                            <button
                              onClick={() => downloadAudio(r.audioUrl!, r.filename)}
                              className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded"
                            >
                              📥
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Save to Repository Button */}
                {successfulAudioCount > 0 && (
                  <>
                    <button
                      onClick={saveToRepository}
                      disabled={!canSaveToRepo}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingToRepo ? (
                        <span>
                          ⏳ Saving to GitHub... {saveProgress.current}/{saveProgress.total}
                        </span>
                      ) : (
                        <span>💾 Save to Project ({successfulAudioCount} files)</span>
                      )}
                    </button>

                    {/* Save Progress */}
                    {isSavingToRepo && (
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${(saveProgress.current / saveProgress.total) * 100}%` }}
                        />
                      </div>
                    )}

                    {/* Save Message */}
                    {saveMessage && (
                      <div className={`p-4 rounded-lg ${
                        saveMessage.startsWith('✅') 
                          ? 'bg-green-900/30 border border-green-500' 
                          : 'bg-red-900/30 border border-red-500'
                      }`}>
                        <p className={saveMessage.startsWith('✅') ? 'text-green-400' : 'text-red-400'}>
                          {saveMessage}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">ℹ️ How it works:</h3>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Questions are generated using Claude AI based on lesson content</li>
            <li>• Audio is generated using ElevenLabs TTS</li>
            <li>• <strong className="text-green-400">Save to Project</strong> uploads audio directly to GitHub</li>
            <li>• Railway auto-deploys changes in 2-3 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
