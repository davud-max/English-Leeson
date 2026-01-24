'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Slide {
  id: number
  title: string
  titleEn: string
  content: string
  contentEn: string
  emoji: string
  audioText: string
}

export default function LessonCreatorPage() {
  const [lessonNumber, setLessonNumber] = useState(9)
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonTitleEn, setLessonTitleEn] = useState('')
  const [slides, setSlides] = useState<Slide[]>([])
  const [generatedCode, setGeneratedCode] = useState('')
  const [audioScript, setAudioScript] = useState('')
  const [activeTab, setActiveTab] = useState<'slides' | 'code' | 'audio'>('slides')

  // Add new slide
  const addSlide = () => {
    const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1
    setSlides([...slides, {
      id: newId,
      title: '',
      titleEn: '',
      content: '',
      contentEn: '',
      emoji: '📖',
      audioText: ''
    }])
  }

  // Update slide
  const updateSlide = (id: number, field: keyof Slide, value: string) => {
    setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  // Remove slide
  const removeSlide = (id: number) => {
    setSlides(slides.filter(s => s.id !== id))
  }

  // Move slide
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= slides.length) return
    ;[newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]]
    setSlides(newSlides)
  }

  // Generate page.tsx code
  const generatePageCode = () => {
    const slidesCode = slides.map((slide, idx) => `  {
    id: ${idx + 1},
    title: "${slide.emoji} ${slide.titleEn.replace(/"/g, '\\"')}",
    content: \`${slide.contentEn.trim().replace(/`/g, '\\`')}\`,
    emoji: "${slide.emoji}",
    duration: ${Math.max(20000, slide.audioText.length * 80)}
  }`).join(',\n')

    const code = `'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_${lessonNumber}_SLIDES = [
${slidesCode}
]

export default function Lesson${lessonNumber}Page() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const slide = LESSON_${lessonNumber}_SLIDES[currentSlide]
  const totalSlides = LESSON_${lessonNumber}_SLIDES.length

  useEffect(() => {
    if (!isPlaying) return

    const audioFile = \`/audio/lesson${lessonNumber}/slide\${currentSlide + 1}.mp3\`
    if (audioRef.current) {
      audioRef.current.src = audioFile
      audioRef.current.play().catch(e => console.log("Audio play failed:", e))
    }
  }, [currentSlide, isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      if (currentSlide < totalSlides - 1) {
        setCurrentSlide(prev => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration)
      }
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [currentSlide, totalSlides])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setProgress(0)
    if (isPlaying && audioRef.current) {
      audioRef.current.src = \`/audio/lesson${lessonNumber}/slide\${index + 1}.mp3\`
      audioRef.current.play().catch(e => console.log("Audio play failed:", e))
    }
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <audio ref={audioRef} />
      
      {/* Header */}
      <header className="bg-stone-800 border-b-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/lessons" className="text-amber-200 hover:text-amber-100 transition font-serif">
              ← Back to Lectures
            </Link>
            <span className="text-stone-400 font-serif">
              Lecture {toRoman(${lessonNumber})} • Slide {currentSlide + 1}/{totalSlides}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Slide Header */}
          <div className="bg-stone-800 text-white p-6">
            <div className="text-amber-400 text-sm font-serif mb-2">
              Lecture {toRoman(${lessonNumber})} — ${lessonTitleEn.replace(/'/g, "\\'")}
            </div>
            <h1 className="text-2xl font-serif">{slide.title}</h1>
          </div>

          {/* Slide Content */}
          <div className="p-8">
            <div className="prose prose-stone max-w-none font-serif">
              <ReactMarkdown>{slide.content}</ReactMarkdown>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pb-2">
            <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-600 transition-all duration-100"
                style={{ width: \`\${progress * 100}%\` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 bg-stone-50 border-t flex justify-between items-center">
            <button
              onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 font-serif"
            >
              ← Previous
            </button>

            <button
              onClick={togglePlay}
              className={\`px-8 py-3 rounded-full font-serif transition \${
                isPlaying 
                  ? 'bg-stone-700 text-white' 
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }\`}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play Lecture'}
            </button>

            <button
              onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
              disabled={currentSlide === totalSlides - 1}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 font-serif"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {LESSON_${lessonNumber}_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={\`w-8 h-8 rounded-full text-sm font-serif transition \${
                idx === currentSlide
                  ? 'bg-amber-600 text-white'
                  : idx < currentSlide
                  ? 'bg-stone-300 text-stone-600'
                  : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
              }\`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between text-sm font-serif text-stone-500">
          ${lessonNumber > 1 ? `<Link href="/lessons/${lessonNumber - 1}" className="hover:text-amber-700">
            ← Lecture {toRoman(${lessonNumber - 1})}
          </Link>` : '<span></span>'}
          <Link href="/lessons/${lessonNumber + 1}" className="hover:text-amber-700">
            Lecture {toRoman(${lessonNumber + 1})} →
          </Link>
        </div>
      </footer>
    </div>
  )
}

function toRoman(num: number): string {
  const lookup: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ]
  let result = ''
  for (const [value, symbol] of lookup) {
    while (num >= value) {
      result += symbol
      num -= value
    }
  }
  return result
}
`

    setGeneratedCode(code)
    setActiveTab('code')
  }

  // Generate audio script
  const generateAudioScript = () => {
    const texts = slides.map((slide, idx) => {
      const text = slide.audioText.trim() || slide.contentEn.replace(/[#*_`\n]/g, ' ').replace(/\s+/g, ' ').trim()
      return `  // Slide ${idx + 1}: ${slide.titleEn}
  \`${text.replace(/`/g, '\\`')}\`,`
    }).join('\n\n')

    const script = `const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const LESSON_${lessonNumber}_TEXTS = [
${texts}
];

const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';

async function generateAudio(text, outputPath) {
  const escapedText = text.replace(/"/g, '\\\\"').replace(/'/g, "'\\\\''");
  const command = \`edge-tts --voice "\${VOICE}" --rate="\${RATE}" --text "\${escapedText}" --write-media "\${outputPath}"\`;
  await execPromise(command);
}

async function main() {
  console.log('🎬 Generating audio for Lesson ${lessonNumber}...');
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson${lessonNumber}');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_${lessonNumber}_TEXTS.length; i++) {
    const filename = \`slide\${i + 1}.mp3\`;
    const filepath = path.join(audioDir, filename);
    
    console.log(\`🔊 Slide \${i + 1}/\${LESSON_${lessonNumber}_TEXTS.length}...\`);
    
    try {
      await generateAudio(LESSON_${lessonNumber}_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(\`✅ \${filename} (\${Math.round(stats.size / 1024)}KB)\`);
    } catch (error) {
      console.error(\`❌ \${filename}: \${error.message}\`);
    }
  }
  
  console.log('🎉 Done!');
}

main().catch(console.error);`

    setAudioScript(script)
    setActiveTab('audio')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Скопировано!')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🎓 Создание урока</h1>
              <p className="text-gray-600 text-sm">Русский текст → Английский перевод → page.tsx + аудио</p>
            </div>
            <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Lesson Info */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Номер урока</label>
              <input
                type="number"
                value={lessonNumber}
                onChange={(e) => setLessonNumber(parseInt(e.target.value) || 9)}
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Название (RU)</label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Теория когнитивного резонанса"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Название (EN) — для page.tsx</label>
              <input
                type="text"
                value={lessonTitleEn}
                onChange={(e) => setLessonTitleEn(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Theory of Cognitive Resonance"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b bg-white rounded-t-lg px-4">
          {[
            { id: 'slides', label: 'Слайды', icon: '🎬', count: slides.length },
            { id: 'code', label: 'Код page.tsx', icon: '💻' },
            { id: 'audio', label: 'Аудио скрипт', icon: '🔊' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 border-transparent'
              }`}
            >
              {tab.icon} {tab.label} {'count' in tab ? `(${tab.count})` : ''}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-6">
        {/* Tab: Slides */}
        {activeTab === 'slides' && (
          <div className="bg-white rounded-b-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Введите русский текст слева, английский перевод справа. Аудио текст — то, что будет озвучено.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={addSlide}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + Добавить слайд
                </button>
                <button
                  onClick={generatePageCode}
                  disabled={slides.length === 0 || !lessonTitleEn}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Генерировать код →
                </button>
              </div>
            </div>

            {slides.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">📝</div>
                <p>Нажмите "Добавить слайд" чтобы начать</p>
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((slide, idx) => (
                  <div key={slide.id} className="border rounded-lg p-4 bg-gray-50">
                    {/* Slide Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-gray-500">#{idx + 1}</span>
                      <input
                        type="text"
                        value={slide.emoji}
                        onChange={(e) => updateSlide(slide.id, 'emoji', e.target.value)}
                        className="w-12 text-center text-xl border rounded"
                        maxLength={2}
                      />
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                          className="px-3 py-1 border rounded bg-yellow-50"
                          placeholder="Заголовок (RU)"
                        />
                        <input
                          type="text"
                          value={slide.titleEn}
                          onChange={(e) => updateSlide(slide.id, 'titleEn', e.target.value)}
                          className="px-3 py-1 border rounded bg-blue-50"
                          placeholder="Title (EN)"
                        />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => moveSlide(idx, 'up')} disabled={idx === 0} className="px-2 py-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">↑</button>
                        <button onClick={() => moveSlide(idx, 'down')} disabled={idx === slides.length - 1} className="px-2 py-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">↓</button>
                        <button onClick={() => removeSlide(slide.id)} className="px-2 py-1 text-red-400 hover:text-red-600">🗑️</button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Текст слайда (RU)</label>
                        <textarea
                          value={slide.content}
                          onChange={(e) => updateSlide(slide.id, 'content', e.target.value)}
                          className="w-full px-3 py-2 border rounded text-sm bg-yellow-50"
                          rows={4}
                          placeholder="Содержимое на русском..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Slide content (EN) — Markdown</label>
                        <textarea
                          value={slide.contentEn}
                          onChange={(e) => updateSlide(slide.id, 'contentEn', e.target.value)}
                          className="w-full px-3 py-2 border rounded text-sm font-mono bg-blue-50"
                          rows={4}
                          placeholder="**Bold** text, lists, etc..."
                        />
                      </div>
                    </div>

                    {/* Audio Text */}
                    <div className="mt-3">
                      <label className="block text-xs text-gray-500 mb-1">🔊 Текст для озвучки (EN) — если пусто, используется content</label>
                      <textarea
                        value={slide.audioText}
                        onChange={(e) => updateSlide(slide.id, 'audioText', e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm bg-green-50"
                        rows={2}
                        placeholder="Plain text for TTS (no markdown)..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Code */}
        {activeTab === 'code' && (
          <div className="bg-white rounded-b-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <span className="font-bold">page.tsx</span>
                <span className="text-gray-500 text-sm ml-2">→ src/app/(course)/lessons/{lessonNumber}/page.tsx</span>
              </div>
              <div className="flex gap-2">
                {!generatedCode && (
                  <button
                    onClick={generatePageCode}
                    disabled={slides.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Генерировать
                  </button>
                )}
                <button
                  onClick={() => copyToClipboard(generatedCode)}
                  disabled={!generatedCode}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  📋 Копировать
                </button>
                <button
                  onClick={generateAudioScript}
                  disabled={slides.length === 0}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  🔊 Аудио скрипт →
                </button>
              </div>
            </div>
            
            {generatedCode ? (
              <pre className="p-4 bg-gray-900 text-green-400 overflow-auto text-xs max-h-[65vh] rounded-b-lg">
                {generatedCode}
              </pre>
            ) : (
              <div className="p-12 text-center text-gray-500">
                Создайте слайды и нажмите "Генерировать"
              </div>
            )}
          </div>
        )}

        {/* Tab: Audio */}
        {activeTab === 'audio' && (
          <div className="bg-white rounded-b-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <span className="font-bold">generate-lesson{lessonNumber}-audio.js</span>
                <span className="text-gray-500 text-sm ml-2">→ scripts/</span>
              </div>
              <button
                onClick={() => copyToClipboard(audioScript)}
                disabled={!audioScript}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                📋 Копировать
              </button>
            </div>
            
            {audioScript ? (
              <>
                <pre className="p-4 bg-gray-900 text-green-400 overflow-auto text-xs max-h-[50vh]">
                  {audioScript}
                </pre>
                <div className="p-4 bg-purple-50 border-t">
                  <h3 className="font-bold text-purple-900 mb-2">📖 Инструкция:</h3>
                  <ol className="text-sm text-purple-800 space-y-2 list-decimal list-inside">
                    <li>Создайте папку: <code className="bg-purple-100 px-1 rounded">mkdir -p src/app/\(course\)/lessons/{lessonNumber}</code></li>
                    <li>Вставьте page.tsx код в файл</li>
                    <li>Сохраните аудио скрипт: <code className="bg-purple-100 px-1 rounded">scripts/generate-lesson{lessonNumber}-audio.js</code></li>
                    <li>Запустите: <code className="bg-purple-100 px-1 rounded">node scripts/generate-lesson{lessonNumber}-audio.js</code></li>
                    <li>Деплой: <code className="bg-purple-100 px-1 rounded">git add . && git commit -m "Add lesson {lessonNumber}" && git push</code></li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-gray-500">
                Сначала сгенерируйте код, затем нажмите "Аудио скрипт"
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
