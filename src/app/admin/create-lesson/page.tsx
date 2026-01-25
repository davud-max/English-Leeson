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
  const [adminKey, setAdminKey] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatingSlide, setTranslatingSlide] = useState<number | null>(null)

  // Translate text using API
  const translateText = async (text: string, type: 'title' | 'content' | 'audio'): Promise<string> => {
    if (!adminKey) {
      alert('Введите Admin Key')
      return ''
    }
    if (!text.trim()) return ''

    const response = await fetch('/api/admin/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, type, adminKey }),
    })

    const data = await response.json()
    if (data.success) {
      return data.result
    } else {
      throw new Error(data.error || 'Translation failed')
    }
  }

  // Translate lesson title
  const translateTitle = async () => {
    if (!lessonTitle.trim()) return
    setIsTranslating(true)
    try {
      const translated = await translateText(lessonTitle, 'title')
      if (translated) setLessonTitleEn(translated)
    } catch (error) {
      alert('Ошибка перевода: ' + (error instanceof Error ? error.message : 'Unknown'))
    } finally {
      setIsTranslating(false)
    }
  }

  // Translate single slide
  const translateSlide = async (slideId: number) => {
    const slide = slides.find(s => s.id === slideId)
    if (!slide) return

    setTranslatingSlide(slideId)
    try {
      // Translate title
      if (slide.title && !slide.titleEn) {
        const titleEn = await translateText(slide.title, 'title')
        updateSlide(slideId, 'titleEn', titleEn)
      }

      // Translate content
      if (slide.content) {
        const contentEn = await translateText(slide.content, 'content')
        updateSlide(slideId, 'contentEn', contentEn)

        // Generate audio text
        const audioText = await translateText(slide.content, 'audio')
        updateSlide(slideId, 'audioText', audioText)
      }
    } catch (error) {
      alert('Ошибка перевода слайда: ' + (error instanceof Error ? error.message : 'Unknown'))
    } finally {
      setTranslatingSlide(null)
    }
  }

  // Translate all slides
  const translateAllSlides = async () => {
    if (!adminKey) {
      alert('Введите Admin Key')
      return
    }
    
    setIsTranslating(true)
    try {
      // First translate lesson title
      if (lessonTitle && !lessonTitleEn) {
        const titleEn = await translateText(lessonTitle, 'title')
        setLessonTitleEn(titleEn)
      }

      // Then translate each slide
      for (const slide of slides) {
        setTranslatingSlide(slide.id)
        
        // Translate slide title
        if (slide.title && !slide.titleEn) {
          const titleEn = await translateText(slide.title, 'title')
          updateSlide(slide.id, 'titleEn', titleEn)
        }

        // Translate content
        if (slide.content && !slide.contentEn) {
          const contentEn = await translateText(slide.content, 'content')
          updateSlide(slide.id, 'contentEn', contentEn)
        }

        // Generate audio text
        if (slide.content && !slide.audioText) {
          const audioText = await translateText(slide.content, 'audio')
          updateSlide(slide.id, 'audioText', audioText)
        }

        // Small delay between API calls
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      alert('Ошибка перевода: ' + (error instanceof Error ? error.message : 'Unknown'))
    } finally {
      setIsTranslating(false)
      setTranslatingSlide(null)
    }
  }

  // Parse Russian text into slides automatically
  const parseRussianText = (fullText: string) => {
    // Split by double newlines or numbered sections
    const sections = fullText.split(/\n\n+/).filter(s => s.trim())
    
    const newSlides: Slide[] = sections.map((section, idx) => {
      // Try to extract title from first line if it looks like a header
      const lines = section.trim().split('\n')
      let title = ''
      let content = section

      // Check if first line is a title (short, no period at end, or starts with number/marker)
      const firstLine = lines[0].trim()
      if (
        (firstLine.length < 80 && !firstLine.endsWith('.')) ||
        /^[\d\.\)\-\*]+\s/.test(firstLine) ||
        /^(Часть|Глава|Раздел|Введение|Заключение)/i.test(firstLine)
      ) {
        title = firstLine.replace(/^[\d\.\)\-\*]+\s*/, '')
        content = lines.slice(1).join('\n').trim()
      }

      return {
        id: idx + 1,
        title,
        titleEn: '',
        content: content || section,
        contentEn: '',
        emoji: getEmojiForSection(idx, title),
        audioText: ''
      }
    })

    setSlides(newSlides)
  }

  // Get appropriate emoji based on content
  const getEmojiForSection = (index: number, title: string): string => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('введен') || index === 0) return '📖'
    if (lowerTitle.includes('часть') || lowerTitle.includes('раздел')) return '📋'
    if (lowerTitle.includes('пример')) return '💡'
    if (lowerTitle.includes('вывод') || lowerTitle.includes('заключ')) return '🎯'
    if (lowerTitle.includes('вопрос')) return '❓'
    if (lowerTitle.includes('практик')) return '🛠️'
    
    const emojis = ['📖', '🔍', '💡', '📊', '🎯', '🧠', '✨', '📝', '🌟', '🔮']
    return emojis[index % emojis.length]
  }

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
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
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
    title: "${slide.titleEn.replace(/"/g, '\\"')}",
    content: \`${slide.contentEn.trim().replace(/`/g, '\\`')}\`,
    emoji: "${slide.emoji}",
    duration: ${Math.max(20000, (slide.audioText || slide.contentEn).length * 80)}
  }`).join(',\n')

    const code = `'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_${lessonNumber}_SLIDES = [
${slidesCode}
];

const LESSON_CONTENT = LESSON_${lessonNumber}_SLIDES.map(s => s.content).join('\\n\\n');

export default function Lesson${lessonNumber}Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_${lessonNumber}_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = \`/audio/lesson${lessonNumber}/slide\${currentSlide + 1}.mp3\`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        const duration = LESSON_${lessonNumber}_SLIDES[currentSlide].duration;
        timerRef.current = setTimeout(() => {
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, duration);
      });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, isPlaying, totalSlides]);

  useEffect(() => {
    if (!isPlaying || !audioError) return;
    
    const duration = LESSON_${lessonNumber}_SLIDES[currentSlide].duration;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioError, currentSlide]);

  useEffect(() => {
    if (!isPlaying || audioError) return;
    
    const interval = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percent);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioError]);

  const handleAudioEnded = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const goToSlide = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentSlide(index);
    setProgress(0);
    if (isPlaying) {
      setAudioError(false);
    }
  };

  const currentSlideData = LESSON_${lessonNumber}_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-stone-50">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        onError={() => setAudioError(true)}
      />
      
      {/* Academic Header */}
      <header className="bg-stone-800 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">
              ← Back to Course
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-serif">Algorithms of Thinking and Cognition</h1>
              <p className="text-stone-400 text-sm">Lecture ${lessonNumber}</p>
            </div>
            <div className="text-stone-400 text-sm">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Lesson Title */}
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{currentSlideData.emoji}</span>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">
            {currentSlideData.title}
          </h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
        </div>

        {/* Content Card */}
        <article className="bg-white rounded-lg shadow-lg border border-stone-200 p-8 md:p-12 mb-8">
          <div className="prose prose-stone prose-lg max-w-none">
            <ReactMarkdown
              components={{
                p: ({children}) => <p className="text-stone-700 leading-relaxed mb-5 text-lg">{children}</p>,
                strong: ({children}) => <strong className="text-stone-900 font-semibold">{children}</strong>,
                em: ({children}) => <em className="text-stone-600 italic">{children}</em>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-amber-700 pl-6 my-6 italic text-stone-600 bg-amber-50 py-4 pr-4 rounded-r">
                    {children}
                  </blockquote>
                ),
                ul: ({children}) => <ul className="list-disc list-outside ml-6 text-stone-700 space-y-2 my-4">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-outside ml-6 text-stone-700 space-y-2 my-4">{children}</ol>,
                li: ({children}) => <li className="text-stone-700 leading-relaxed">{children}</li>,
              }}
            >
              {currentSlideData.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-500 font-medium">Slide Progress</span>
            <span className="text-sm text-stone-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-700 transition-all duration-300 rounded-full"
              style={{ width: \`\${progress}%\` }}
            />
          </div>
          
          {audioError && (
            <p className="text-xs text-stone-400 mt-2 text-center">
              Audio unavailable — using timed advancement
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <button
            onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium"
          >
            ← Previous
          </button>
          
          <button
            onClick={togglePlay}
            className="px-8 py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition shadow-md"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play Lecture'}
          </button>
          
          <button
            onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
            disabled={currentSlide === totalSlides - 1}
            className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium"
          >
            Next →
          </button>
        </div>

        {/* Voice Quiz Button */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-lg p-6 mb-10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">🎤 Ready to Test Your Knowledge?</h3>
          <p className="text-amber-100 mb-4">Take a voice quiz with AI-generated questions based on this lecture</p>
          <button
            onClick={() => setShowQuiz(true)}
            className="px-8 py-3 bg-white text-amber-700 rounded-lg font-bold hover:bg-amber-50 transition shadow-md"
          >
            Start Voice Quiz
          </button>
        </div>

        {/* Slide Navigation */}
        <div className="bg-white rounded-lg shadow border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Lecture Sections</h3>
          <div className="grid grid-cols-4 md:grid-cols-${Math.min(10, slides.length)} gap-2">
            {LESSON_${lessonNumber}_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={\`p-3 rounded text-sm font-medium transition \${
                  index === currentSlide
                    ? 'bg-amber-700 text-white'
                    : index < currentSlide
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }\`}
                title={slide.title}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Voice Quiz Modal */}
      {showQuiz && (
        <VoiceQuiz
          lessonId={${lessonNumber}}
          lessonTitle="${lessonTitleEn.replace(/"/g, '\\"')}"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Academic Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/${lessonNumber - 1}"
              className="hover:text-white transition"
            >
              ← Lecture ${lessonNumber - 1}
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture ${lessonNumber}</span>
            <Link 
              href="/lessons/${lessonNumber + 1}"
              className="hover:text-white transition"
            >
              Lecture ${lessonNumber + 1} →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
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
              <p className="text-gray-600 text-sm">Русский текст → Claude AI перевод → page.tsx + аудио</p>
            </div>
            <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Key */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-4">
          <label className="text-sm font-medium text-amber-800">🔑 Admin Key:</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Введите ключ для перевода..."
            className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:border-amber-500"
          />
          <span className="text-xs text-amber-600">Требуется для автоматического перевода через Claude AI</span>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="grid grid-cols-5 gap-4">
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
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Название (RU)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg bg-yellow-50"
                  placeholder="Теория когнитивного резонанса"
                />
                <button
                  onClick={translateTitle}
                  disabled={isTranslating || !lessonTitle.trim() || !adminKey}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  {isTranslating ? '...' : '🌐 →'}
                </button>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Название (EN)</label>
              <input
                type="text"
                value={lessonTitleEn}
                onChange={(e) => setLessonTitleEn(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-blue-50"
                placeholder="Theory of Cognitive Resonance"
              />
            </div>
          </div>
        </div>

        {/* Quick Russian Text Input */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">📝 Быстрый ввод текста урока (RU)</label>
            <button
              onClick={() => {
                const textarea = document.getElementById('fullRussianText') as HTMLTextAreaElement
                if (textarea?.value) {
                  parseRussianText(textarea.value)
                  textarea.value = ''
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              📋 Разбить на слайды
            </button>
          </div>
          <textarea
            id="fullRussianText"
            className="w-full px-3 py-2 border rounded-lg bg-yellow-50 text-sm"
            rows={4}
            placeholder="Вставьте полный текст урока на русском. Разделяйте разделы пустыми строками. Система автоматически разобьёт на слайды..."
          />
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
                Введите русский текст слева → нажмите 🌐 для автоперевода → проверьте результат
              </p>
              <div className="flex gap-2">
                <button
                  onClick={addSlide}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + Слайд
                </button>
                <button
                  onClick={translateAllSlides}
                  disabled={isTranslating || slides.length === 0 || !adminKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isTranslating ? '⏳ Перевод...' : '🌐 Перевести всё'}
                </button>
                <button
                  onClick={generatePageCode}
                  disabled={slides.length === 0 || !lessonTitleEn}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Генерировать код →
                </button>
              </div>
            </div>

            {slides.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">📝</div>
                <p>Вставьте текст выше и нажмите «Разбить на слайды» или добавьте слайды вручную</p>
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((slide, idx) => (
                  <div key={slide.id} className={`border rounded-lg p-4 ${translatingSlide === slide.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'}`}>
                    {/* Slide Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-gray-500 w-8">#{idx + 1}</span>
                      <input
                        type="text"
                        value={slide.emoji}
                        onChange={(e) => updateSlide(slide.id, 'emoji', e.target.value)}
                        className="w-12 text-center text-xl border rounded"
                        maxLength={2}
                      />
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                            className="flex-1 px-3 py-1 border rounded bg-yellow-50"
                            placeholder="Заголовок (RU)"
                          />
                        </div>
                        <input
                          type="text"
                          value={slide.titleEn}
                          onChange={(e) => updateSlide(slide.id, 'titleEn', e.target.value)}
                          className="px-3 py-1 border rounded bg-blue-50"
                          placeholder="Title (EN)"
                        />
                      </div>
                      <button
                        onClick={() => translateSlide(slide.id)}
                        disabled={translatingSlide === slide.id || !adminKey}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        {translatingSlide === slide.id ? '⏳' : '🌐'}
                      </button>
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
                        <label className="block text-xs text-gray-500 mb-1">Content (EN) — Markdown с **bold** и &gt; цитаты</label>
                        <textarea
                          value={slide.contentEn}
                          onChange={(e) => updateSlide(slide.id, 'contentEn', e.target.value)}
                          className="w-full px-3 py-2 border rounded text-sm font-mono bg-blue-50"
                          rows={4}
                          placeholder="**Bold** text, > blockquotes..."
                        />
                      </div>
                    </div>

                    {/* Audio Text */}
                    <div className="mt-3">
                      <label className="block text-xs text-gray-500 mb-1">🔊 Текст для озвучки (EN) — plain text без markdown</label>
                      <textarea
                        value={slide.audioText}
                        onChange={(e) => updateSlide(slide.id, 'audioText', e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm bg-green-50"
                        rows={2}
                        placeholder="Автозаполняется при переводе..."
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
                Создайте слайды и нажмите «Генерировать»
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
                    <li>Сгенерируйте вопросы для теста: <code className="bg-purple-100 px-1 rounded">/admin/questions</code></li>
                    <li>Деплой: <code className="bg-purple-100 px-1 rounded">git add . && git commit -m &apos;Add lesson {lessonNumber}&apos; && git push</code></li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-gray-500">
                Сначала сгенерируйте код, затем нажмите «Аудио скрипт»
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
