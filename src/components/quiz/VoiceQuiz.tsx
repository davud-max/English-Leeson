'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Question {
  id: number
  question: string
  correct_answer: string
  difficulty: 'easy' | 'hard'
  points: number
}

interface QuizResult {
  correct: number
  total: number
  points: number
  maxPoints: number
}

interface VoiceQuizProps {
  lessonId: number
  lessonTitle: string
  onClose: () => void
}

// Speech Recognition Types
interface SpeechRecognitionType {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: ((event: { error: string }) => void) | null
  onresult: ((event: { resultIndex: number; results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null
  start(): void
  stop(): void
  abort(): void
}

export default function VoiceQuiz({ lessonId, lessonTitle, onClose }: VoiceQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [feedback, setFeedback] = useState<{ score: number; text: string; isCorrect: boolean } | null>(null)
  const [results, setResults] = useState<QuizResult>({ correct: 0, total: 0, points: 0, maxPoints: 0 })
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<SpeechRecognitionType | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Text-to-Speech function
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current) return

    // Cancel any ongoing speech
    synthRef.current.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1
    
    // Try to find a good English voice
    const voices = synthRef.current.getVoices()
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) 
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'))
    
    if (englishVoice) {
      utterance.voice = englishVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      onEnd?.()
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      onEnd?.()
    }

    synthRef.current.speak(utterance)
  }, [])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass() as SpeechRecognitionType
        recognition.lang = 'en-US'
        recognition.continuous = false
        recognition.interimResults = true

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }
        recognition.onresult = (event) => {
          let transcript = ''
          for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
            transcript += event.results[i][0].transcript
          }
          setUserAnswer(transcript)
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      stopSpeaking()
    }
  }, [stopSpeaking])

  // Load pre-generated questions
  useEffect(() => {
    loadQuestions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  const loadQuestions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Load from static JSON file
      const response = await fetch(`/data/questions/lesson${lessonId}.json`)

      if (!response.ok) {
        setError('No questions available for this lesson yet. Please ask the administrator to generate them.')
        setIsLoading(false)
        return
      }

      const data = await response.json()

      if (data.questions?.length > 0) {
        setQuestions(data.questions)
        const maxPoints = data.questions.reduce((sum: number, q: Question) => sum + q.points, 0)
        setResults({ correct: 0, total: data.questions.length, points: 0, maxPoints })
      } else {
        setError('No questions available for this lesson.')
      }
    } catch (err) {
      console.error('Error loading questions:', err)
      setError('Failed to load questions. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // Speak current question when it changes
  useEffect(() => {
    if (questions.length > 0 && !isLoading && !feedback) {
      const currentQuestion = questions[currentIndex]
      speak(`Question ${currentIndex + 1}. ${currentQuestion.question}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions, isLoading])

  const toggleMicrophone = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser')
      return
    }

    // Stop speaking if currently speaking
    stopSpeaking()

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }, [isListening, stopSpeaking])

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      speak('Please enter or speak your answer')
      return
    }

    const currentQuestion = questions[currentIndex]
    setIsChecking(true)
    setFeedback(null)
    stopSpeaking()

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_answer',
          question: currentQuestion.question,
          correctAnswer: currentQuestion.correct_answer,
          userAnswer: userAnswer,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const earnedPoints = data.is_correct ? currentQuestion.points : Math.round(currentQuestion.points * data.score / 100)
        
        setResults(prev => ({
          ...prev,
          correct: prev.correct + (data.is_correct ? 1 : 0),
          points: prev.points + earnedPoints,
        }))

        const feedbackData = {
          score: data.score,
          text: data.feedback,
          isCorrect: data.is_correct,
        }
        setFeedback(feedbackData)

        // Speak the feedback
        const feedbackText = data.is_correct 
          ? `Correct! You earned ${earnedPoints} points. ${data.feedback}`
          : `Not quite right. The correct answer is: ${currentQuestion.correct_answer}. You earned ${earnedPoints} points.`
        
        speak(feedbackText)
      } else {
        setFeedback({
          score: 0,
          text: data.error || 'Error checking answer',
          isCorrect: false,
        })
        speak('Error checking your answer. Please try again.')
      }
    } catch (err) {
      console.error('Error checking answer:', err)
      setFeedback({
        score: 0,
        text: 'Connection error. Please try again.',
        isCorrect: false,
      })
      speak('Connection error. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  const nextQuestion = () => {
    stopSpeaking()
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserAnswer('')
      setFeedback(null)
    } else {
      setShowResults(true)
      // Speak results
      const percentage = results.maxPoints > 0 ? Math.round((results.points / results.maxPoints) * 100) : 0
      speak(`Quiz complete! You got ${results.correct} out of ${results.total} correct, earning ${results.points} out of ${results.maxPoints} points. Your score is ${percentage} percent.`)
    }
  }

  const restartQuiz = () => {
    stopSpeaking()
    setCurrentIndex(0)
    setUserAnswer('')
    setFeedback(null)
    setShowResults(false)
    setResults({ correct: 0, total: questions.length, points: 0, maxPoints: results.maxPoints })
  }

  const repeatQuestion = () => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentIndex]
      speak(`Question ${currentIndex + 1}. ${currentQuestion.question}`)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-stone-800">Loading Questions...</h3>
          <p className="text-stone-500 mt-2">Please wait</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full p-8 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-stone-800">Questions Not Available</h3>
          <p className="text-stone-500 mt-2">{error}</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // Results screen
  if (showResults) {
    const percentage = results.maxPoints > 0 ? Math.round((results.points / results.maxPoints) * 100) : 0
    let emoji = '🎉'
    let message = 'Excellent!'
    
    if (percentage < 50) {
      emoji = '📚'
      message = 'Keep studying!'
    } else if (percentage < 80) {
      emoji = '👍'
      message = 'Good job!'
    }

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 text-white">
            <h2 className="text-2xl font-bold">🎤 Quiz Complete</h2>
          </div>
          
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h3 className="text-2xl font-bold text-stone-800 mb-6">{message}</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-stone-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-amber-700">{results.correct}/{results.total}</div>
                <div className="text-sm text-stone-500">Correct</div>
              </div>
              <div className="bg-stone-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-amber-700">{results.points}/{results.maxPoints}</div>
                <div className="text-sm text-stone-500">Points</div>
              </div>
              <div className="bg-stone-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-amber-700">{percentage}%</div>
                <div className="text-sm text-stone-500">Score</div>
              </div>
            </div>

            <div className="h-3 bg-stone-200 rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full transition-all duration-500 ${
                  percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
              >
                ✓ Finish
              </button>
              <button
                onClick={restartQuiz}
                className="px-8 py-3 bg-stone-200 text-stone-700 rounded-xl font-semibold hover:bg-stone-300 transition"
              >
                ↻ Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Question screen
  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-5 text-white flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🎤 Voice Quiz
            {isSpeaking && <span className="text-sm animate-pulse">🔊</span>}
          </h2>
          <button
            onClick={() => { stopSpeaking(); onClose(); }}
            className="text-3xl opacity-80 hover:opacity-100 transition"
          >
            ×
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-stone-200">
          <div 
            className="h-full bg-amber-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-stone-500 text-sm mb-2">
            Question {currentIndex + 1} of {questions.length}
          </div>
          
          <h3 className="text-xl font-semibold text-stone-800 mb-3">
            {currentQuestion.question}
          </h3>
          
          <div className="flex items-center justify-between text-sm mb-6">
            <span className="text-amber-600 flex items-center gap-1">
              ⭐ {currentQuestion.points} points • {currentQuestion.difficulty === 'hard' ? '🔥 Advanced' : '📗 Basic'}
            </span>
            <button
              onClick={repeatQuestion}
              disabled={isSpeaking}
              className="text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              🔊 Repeat
            </button>
          </div>

          {/* Answer input section */}
          {!feedback && (
            <div className="text-center">
              <div className="bg-stone-100 rounded-xl p-4 min-h-[60px] mb-4 border-2 border-dashed border-stone-300 text-stone-600">
                {userAnswer || 'Click the microphone and speak your answer...'}
              </div>

              <button
                onClick={toggleMicrophone}
                disabled={isChecking || isSpeaking}
                className={`w-20 h-20 rounded-full border-none text-3xl cursor-pointer transition-all shadow-lg mb-4 ${
                  isListening 
                    ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse' 
                    : 'bg-gradient-to-br from-amber-600 to-amber-800 hover:scale-110'
                } text-white disabled:opacity-50`}
              >
                🎤
              </button>

              <p className="text-stone-400 text-sm mb-4">or type your answer:</p>

              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                placeholder="Type your answer..."
                className="w-full p-4 border-2 border-stone-300 rounded-xl text-base mb-4 focus:outline-none focus:border-amber-600 transition"
                disabled={isChecking}
              />

              <button
                onClick={submitAnswer}
                disabled={isChecking || !userAnswer.trim()}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? '🔄 Checking...' : '📤 Submit Answer'}
              </button>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`rounded-xl p-5 ${feedback.isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
              <div className="text-4xl mb-3">{feedback.isCorrect ? '✅' : '❌'}</div>
              <div className="font-bold text-lg mb-2">
                {feedback.isCorrect ? 'Correct!' : 'Not quite...'}
              </div>
              <p className="text-stone-700 mb-3">{feedback.text}</p>
              {!feedback.isCorrect && (
                <div className="bg-white/50 rounded-lg p-3 text-sm">
                  <strong>Correct answer:</strong> {currentQuestion.correct_answer}
                </div>
              )}
              <div className="text-green-600 font-semibold mt-3">
                +{feedback.isCorrect ? currentQuestion.points : Math.round(currentQuestion.points * feedback.score / 100)} points
              </div>

              <button
                onClick={nextQuestion}
                className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-900 transition"
              >
                {currentIndex < questions.length - 1 ? 'Next Question →' : 'Show Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
