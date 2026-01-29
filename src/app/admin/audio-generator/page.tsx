'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ElevenLabs voices
const ELEVENLABS_VOICES = {
  ADAM: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Male, Deep) ⭐' },
  CUSTOM: { id: 'kFVUJfjBCiv9orAbWhZN', name: 'Your Custom Voice (Male)' },
  DZULU: { id: '8Hdxm8QJKOFknq47BhTz', name: 'dZulu Custom (Male)' },
  DZULU2: { id: 'ma4IY0Z4IUybdEpvYzBW', name: 'dZulu2 Custom (Male)' },
  NEW: { id: 'erDx71FK2teMZ7g6khzw', name: 'New Voice (Male)' },
  JOSH: { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Male, Strong)' },
  SAM: { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam (Male, Low)' },
  ANTONI: { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Male, Soft)' },
  BELLA: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Female, Russian)' },
  RACHEL: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female, Calm)' },
  DOMI: { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Female, Energetic)' },
  ELLI: { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Female, Young)' },
}

interface Slide {
  id: number
  text: string
  generating?: boolean
  audioUrl?: string
  error?: string
}

export default function AudioGeneratorPage() {
  const [mode, setMode] = useState<'manual' | 'load'>('load')
  const [lessonNumber, setLessonNumber] = useState(1)
  const [slides, setSlides] = useState<Slide[]>([])
  const [voiceId, setVoiceId] = useState(ELEVENLABS_VOICES.ADAM.id)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Load lesson data
  const loadLesson = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/lessons/${lessonNumber}`)
      if (response.ok) {
        const data = await response.json()
        
        // Parse slides from content
        const slideTexts = parseSlides(data.content || '')
        
        if (slideTexts.length === 0) {
          alert('No slides found in this lesson')
          return
        }
        
        const newSlides = slideTexts.map((text, index) => ({
          id: index + 1,
          text: text
        }))
        
        setSlides(newSlides)
      } else {
        alert('Lesson not found')
      }
    } catch (error) {
      console.error('Error loading lesson:', error)
      alert('Error loading lesson')
    } finally {
      setLoading(false)
    }
  }

  // Parse slides from text
  const parseSlides = (text: string): string[] => {
    // Try to split by [SLIDE:N] markers
    const slideMarkers = text.match(/\[SLIDE:\d+\]/g)
    
    if (slideMarkers && slideMarkers.length > 0) {
      const slides: string[] = []
      const parts = text.split(/\[SLIDE:\d+\]/)
      
      // Skip first empty part
      for (let i = 1; i < parts.length; i++) {
        const slideText = parts[i].trim()
        if (slideText) {
          slides.push(slideText)
        }
      }
      
      return slides
    }
    
    // Fallback: split by double newlines (paragraphs)
    const paragraphs = text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
    
    return paragraphs.length > 0 ? paragraphs : [text]
  }

  // Generate audio for single slide
  const generateSlideAudio = async (slideId: number) => {
    const slide = slides.find(s => s.id === slideId)
    if (!slide || !slide.text) return

    // Update slide state
    setSlides(prev => prev.map(s => 
      s.id === slideId 
        ? { ...s, generating: true, error: undefined, audioUrl: undefined }
        : s
    ))

    try {
      const response = await fetch('/api/tts/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: slide.text,
          voiceId: voiceId
        })
      })

      const data = await response.json()

      if (data.success && data.audio) {
        // Create blob URL from base64
        const audioBlob = base64ToBlob(data.audio, 'audio/mpeg')
        const audioUrl = URL.createObjectURL(audioBlob)
        
        setSlides(prev => prev.map(s => 
          s.id === slideId 
            ? { ...s, generating: false, audioUrl: audioUrl }
            : s
        ))
      } else {
        throw new Error(data.error || 'Failed to generate audio')
      }
    } catch (error: any) {
      console.error('Error generating audio:', error)
      setSlides(prev => prev.map(s => 
        s.id === slideId 
          ? { ...s, generating: false, error: error.message }
          : s
      ))
    }
  }

  // Generate all slides
  const generateAllAudio = async () => {
    setGenerating(true)
    
    for (const slide of slides) {
      if (slide.text) {
        await generateSlideAudio(slide.id)
        // Pause between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    setGenerating(false)
  }

  // Download all audio as ZIP
  const downloadAll = async () => {
    if (slides.filter(s => s.audioUrl).length === 0) {
      alert('No audio generated yet')
      return
    }

    // Create ZIP or download individually
    for (const slide of slides) {
      if (slide.audioUrl) {
        const link = document.createElement('a')
        link.href = slide.audioUrl
        link.download = `lesson${lessonNumber}_slide${slide.id}.mp3`
        link.click()
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  // Helper: Convert base64 to Blob
  const base64ToBlob = (base64: string, type: string): Blob => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: type })
  }

  // Add manual slide
  const addSlide = () => {
    const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1
    setSlides([...slides, { id: newId, text: '' }])
  }

  // Update slide text
  const updateSlide = (id: number, text: string) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, text } : s))
  }

  // Remove slide
  const removeSlide = (id: number) => {
    if (slides.length > 1) {
      setSlides(prev => prev.filter(s => s.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🔊 Audio Generator Pro</h1>
              <p className="text-gray-600 text-sm">Generate audio directly with ElevenLabs</p>
            </div>
            <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('load')}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                mode === 'load'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-lg mb-1">📚</div>
              <div className="text-sm">Load from Lesson</div>
              <div className="text-xs text-gray-500">Auto-load slides</div>
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                mode === 'manual'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-lg mb-1">✏️</div>
              <div className="text-sm">Manual Entry</div>
              <div className="text-xs text-gray-500">Type slides</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Settings */}
          <div className="space-y-4">
            {/* Lesson Number */}
            {mode === 'load' && (
              <div className="bg-white rounded-lg shadow p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Number
                </label>
                <input
                  type="number"
                  value={lessonNumber}
                  onChange={(e) => setLessonNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border rounded-lg mb-3"
                  min="1"
                />
                <button
                  onClick={loadLesson}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                >
                  {loading ? '⏳ Loading...' : '📥 Load Lesson'}
                </button>
              </div>
            )}

            {/* Voice Selection */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Voice Selection
              </label>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <optgroup label="Recommended">
                  <option value={ELEVENLABS_VOICES.ADAM.id}>
                    {ELEVENLABS_VOICES.ADAM.name}
                  </option>
                </optgroup>
                <optgroup label="Custom Voices">
                  {['CUSTOM', 'DZULU', 'DZULU2', 'NEW'].map(key => (
                    <option key={key} value={ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].id}>
                      {ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Male Voices">
                  {['JOSH', 'SAM', 'ANTONI'].map(key => (
                    <option key={key} value={ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].id}>
                      {ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Female Voices">
                  {['BELLA', 'RACHEL', 'DOMI', 'ELLI'].map(key => (
                    <option key={key} value={ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].id}>
                      {ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Actions */}
            {slides.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={generateAllAudio}
                    disabled={generating}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 font-medium"
                  >
                    {generating ? '⏳ Generating...' : '🎙️ Generate All Audio'}
                  </button>
                  <button
                    onClick={downloadAll}
                    disabled={slides.filter(s => s.audioUrl).length === 0}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    💾 Download All
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {slides.filter(s => s.audioUrl).length} / {slides.length} generated
                </p>
              </div>
            )}
          </div>

          {/* Right Panel - Slides */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-900">
                  Slides ({slides.length})
                </h2>
                {mode === 'manual' && (
                  <button
                    onClick={addSlide}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    + Add Slide
                  </button>
                )}
              </div>

              {slides.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {mode === 'load' 
                    ? 'Load a lesson to see slides'
                    : 'Add slides manually to generate audio'}
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {slides.map((slide) => (
                    <div key={slide.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Slide {slide.id}
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => generateSlideAudio(slide.id)}
                            disabled={slide.generating || !slide.text}
                            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:bg-gray-300"
                          >
                            {slide.generating ? '⏳' : '🔊'} Generate
                          </button>
                          {mode === 'manual' && slides.length > 1 && (
                            <button
                              onClick={() => removeSlide(slide.id)}
                              className="px-2 py-1 text-red-500 hover:text-red-700 text-sm"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>

                      <textarea
                        value={slide.text}
                        onChange={(e) => updateSlide(slide.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                        rows={4}
                        placeholder="Enter text for this slide..."
                        disabled={mode === 'load'}
                      />

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{slide.text.length} characters</span>
                        {slide.generating && <span className="text-orange-600">Generating...</span>}
                        {slide.error && <span className="text-red-600">Error: {slide.error}</span>}
                        {slide.audioUrl && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓ Ready</span>
                            <audio controls className="h-8">
                              <source src={slide.audioUrl} type="audio/mpeg" />
                            </audio>
                            <a
                              href={slide.audioUrl}
                              download={`lesson${lessonNumber}_slide${slide.id}.mp3`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              💾
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
