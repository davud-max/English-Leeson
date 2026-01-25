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

interface Question {
  id: number
  question: string
  correct_answer: string
  difficulty: 'easy' | 'hard'
  points: number
}

interface GeneratedFiles {
  pageTsx: string
  audioScript: string
  questionsJson: string
  lessonsPageUpdate: string
}

export default function LessonCreatorPage() {
  // Basic info
  const [lessonNumber, setLessonNumber] = useState(22)
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonTitleEn, setLessonTitleEn] = useState('')
  const [lessonDescription, setLessonDescription] = useState('')
  const [lessonDuration, setLessonDuration] = useState(25)
  const [lessonEmoji, setLessonEmoji] = useState('📖')
  const [lessonColor, setLessonColor] = useState('from-blue-500 to-indigo-600')
  
  // Content
  const [slides, setSlides] = useState<Slide[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  
  // Generated files
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles | null>(null)
  
  // UI state
  const [activeTab, setActiveTab] = useState<'input' | 'slides' | 'questions' | 'files'>('input')
  const [adminKey, setAdminKey] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [translatingSlide, setTranslatingSlide] = useState<number | null>(null)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  // Color options
  const colorOptions = [
    { value: 'from-blue-500 to-indigo-600', label: '🔵 Blue' },
    { value: 'from-green-500 to-emerald-600', label: '🟢 Green' },
    { value: 'from-purple-500 to-violet-600', label: '🟣 Purple' },
    { value: 'from-orange-500 to-red-600', label: '🟠 Orange' },
    { value: 'from-teal-500 to-cyan-600', label: '🩵 Teal' },
    { value: 'from-amber-500 to-yellow-600', label: '🟡 Amber' },
    { value: 'from-rose-500 to-pink-600', label: '🩷 Rose' },
    { value: 'from-emerald-500 to-green-600', label: '💚 Emerald' },
    { value: 'from-indigo-500 to-blue-600', label: '💙 Indigo' },
    { value: 'from-fuchsia-500 to-pink-600', label: '💜 Fuchsia' },
  ]

  // Emoji options
  const emojiOptions = ['📖', '🔍', '💡', '📊', '🎯', '🧠', '✨', '📝', '🌟', '🔮', '🌐', '⚡', '🔄', '🌊', '👁️', '🎭', '💼', '💰', '📐', '🔢', '➖']

  // ===== TRANSLATION API =====
  const translateText = async (text: string, type: 'title' | 'content' | 'audio' | 'description'): Promise<string> => {
    if (!adminKey) throw new Error('Admin Key required')
    if (!text.trim()) return ''

    const response = await fetch('/api/admin/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, type: type === 'description' ? 'content' : type, adminKey }),
    })

    const data = await response.json()
    if (data.success) return data.result
    throw new Error(data.error || 'Translation failed')
  }

  // ===== PARSE RUSSIAN TEXT INTO SLIDES =====
  const parseRussianText = (fullText: string) => {
    const sections = fullText.split(/\n\n+/).filter(s => s.trim())
    
    const newSlides: Slide[] = sections.map((section, idx) => {
      const lines = section.trim().split('\n')
      let title = ''
      let content = section

      const firstLine = lines[0].trim()
      if (
        (firstLine.length < 100 && !firstLine.endsWith('.')) ||
        /^[\d\.\)\-\*]+\s/.test(firstLine) ||
        /^(Часть|Глава|Раздел|Введение|Заключение|Слайд)/i.test(firstLine)
      ) {
        title = firstLine.replace(/^[\d\.\)\-\*]+\s*/, '').replace(/^(Часть|Глава|Раздел|Слайд)\s*[\d:.\s]*/i, '')
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
    setStatus({ type: 'success', message: `Parsed ${newSlides.length} slides from Russian text` })
    setActiveTab('slides')
  }

  const getEmojiForSection = (index: number, title: string): string => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('введен') || index === 0) return '📖'
    if (lowerTitle.includes('часть') || lowerTitle.includes('раздел')) return '📋'
    if (lowerTitle.includes('пример')) return '💡'
    if (lowerTitle.includes('вывод') || lowerTitle.includes('заключ')) return '🎯'
    if (lowerTitle.includes('вопрос')) return '❓'
    
    const emojis = ['📖', '🔍', '💡', '📊', '🎯', '🧠', '✨', '📝', '🌟', '🔮']
    return emojis[index % emojis.length]
  }

  // ===== TRANSLATE ALL =====
  const translateAll = async () => {
    if (!adminKey) {
      setStatus({ type: 'error', message: 'Enter Admin Key first' })
      return
    }
    
    setIsTranslating(true)
    setStatus({ type: 'info', message: 'Translating...' })

    try {
      // Translate title
      if (lessonTitle && !lessonTitleEn) {
        const titleEn = await translateText(lessonTitle, 'title')
        setLessonTitleEn(titleEn)
      }

      // Translate description
      if (lessonDescription && !lessonDescription.includes('English')) {
        const descEn = await translateText(lessonDescription, 'description')
        setLessonDescription(descEn)
      }

      // Translate slides
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]
        setTranslatingSlide(slide.id)
        
        if (slide.title && !slide.titleEn) {
          const titleEn = await translateText(slide.title, 'title')
          updateSlide(slide.id, 'titleEn', titleEn)
        }

        if (slide.content && !slide.contentEn) {
          const contentEn = await translateText(slide.content, 'content')
          updateSlide(slide.id, 'contentEn', contentEn)
        }

        if (slide.content && !slide.audioText) {
          const audioText = await translateText(slide.content, 'audio')
          updateSlide(slide.id, 'audioText', audioText)
        }

        await new Promise(resolve => setTimeout(resolve, 300))
      }

      setStatus({ type: 'success', message: 'Translation complete!' })
    } catch (error) {
      setStatus({ type: 'error', message: 'Translation error: ' + (error instanceof Error ? error.message : 'Unknown') })
    } finally {
      setIsTranslating(false)
      setTranslatingSlide(null)
    }
  }

  // ===== GENERATE QUESTIONS =====
  const generateQuestions = async () => {
    if (!adminKey) {
      setStatus({ type: 'error', message: 'Enter Admin Key first' })
      return
    }

    const lessonContent = slides.map(s => s.contentEn || s.content).join('\n\n')
    if (!lessonContent.trim()) {
      setStatus({ type: 'error', message: 'No content to generate questions from' })
      return
    }

    setIsGeneratingQuestions(true)
    setStatus({ type: 'info', message: 'Generating questions with Claude AI...' })

    try {
      const response = await fetch('/api/admin/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lessonNumber,
          lessonTitle: lessonTitleEn || lessonTitle,
          lessonContent,
          count: 5,
          difficulty: 'mixed',
          adminKey,
        }),
      })

      const data = await response.json()
      
      if (data.success && data.questions) {
        setQuestions(data.questions)
        setStatus({ type: 'success', message: `Generated ${data.questions.length} questions` })
        setActiveTab('questions')
      } else {
        throw new Error(data.error || 'Failed to generate questions')
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown') })
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  // ===== SLIDE MANAGEMENT =====
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

  const updateSlide = (id: number, field: keyof Slide, value: string) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeSlide = (id: number) => {
    setSlides(slides.filter(s => s.id !== id))
  }

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= slides.length) return
    ;[newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]]
    setSlides(newSlides)
  }

  // ===== GENERATE ALL FILES =====
  const generateAllFiles = () => {
    if (slides.length === 0) {
      setStatus({ type: 'error', message: 'Add slides first' })
      return
    }

    const pageTsx = generatePageTsx()
    const audioScript = generateAudioScript()
    const questionsJson = generateQuestionsJson()
    const lessonsPageUpdate = generateLessonsPageUpdate()

    setGeneratedFiles({ pageTsx, audioScript, questionsJson, lessonsPageUpdate })
    setActiveTab('files')
    setStatus({ type: 'success', message: 'All files generated! Copy them to create the lesson.' })
  }

  // ===== FILE GENERATORS =====
  const generatePageTsx = (): string => {
    const slidesCode = slides.map((slide, idx) => `  {
    id: ${idx + 1},
    title: "${(slide.titleEn || slide.title).replace(/"/g, '\\"')}",
    content: \`${(slide.contentEn || slide.content).trim().replace(/`/g, '\\`')}\`,
    emoji: "${slide.emoji}",
    duration: ${Math.max(20000, (slide.audioText || slide.contentEn || slide.content).length * 80)}
  }`).join(',\n')

    return `'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_${lessonNumber}_SLIDES = [
${slidesCode}
];

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
          <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
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
          lessonTitle="${(lessonTitleEn || lessonTitle).replace(/"/g, '\\"')}"
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
              href="/lessons"
              className="hover:text-white transition"
            >
              All Lessons →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
`
  }

  const generateAudioScript = (): string => {
    const texts = slides.map((slide, idx) => {
      const text = slide.audioText.trim() || (slide.contentEn || slide.content).replace(/[#*_`\n]/g, ' ').replace(/\s+/g, ' ').trim()
      return `  // Slide ${idx + 1}: ${slide.titleEn || slide.title || 'Untitled'}
  \`${text.replace(/`/g, '\\`')}\`,`
    }).join('\n\n')

    return `const { exec } = require('child_process');
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

main().catch(console.error);
`
  }

  const generateQuestionsJson = (): string => {
    const questionsData = questions.length > 0 ? questions : [
      { id: 1, question: "Question 1 placeholder", correct_answer: "Answer placeholder", difficulty: "easy", points: 5 },
      { id: 2, question: "Question 2 placeholder", correct_answer: "Answer placeholder", difficulty: "easy", points: 5 },
      { id: 3, question: "Question 3 placeholder", correct_answer: "Answer placeholder", difficulty: "hard", points: 15 },
      { id: 4, question: "Question 4 placeholder", correct_answer: "Answer placeholder", difficulty: "hard", points: 15 },
      { id: 5, question: "Question 5 placeholder", correct_answer: "Answer placeholder", difficulty: "hard", points: 15 },
    ]

    return JSON.stringify({
      lessonId: lessonNumber,
      lessonTitle: lessonTitleEn || lessonTitle,
      generatedAt: new Date().toISOString(),
      questions: questionsData,
    }, null, 2)
  }

  const generateLessonsPageUpdate = (): string => {
    return `// Add this to the LESSONS array in src/app/(course)/lessons/page.tsx:

  { 
    order: ${lessonNumber}, 
    title: '${lessonEmoji} ${lessonTitleEn || lessonTitle}', 
    description: '${lessonDescription.replace(/'/g, "\\'")}',
    duration: ${lessonDuration},
    available: true,
    color: '${lessonColor}'
  },

// Don't forget to update the statistics at the top of the page:
// - Change "X of Y lessons available" 
// - Update the Available/Locked counts
// - Adjust the progress bar width percentage`
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setStatus({ type: 'success', message: `${label} copied to clipboard!` })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">🎓 Universal Lesson Creator</h1>
              <p className="text-indigo-200 text-sm">Create complete lessons with translation, audio, and quiz</p>
            </div>
            <Link href="/admin" className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      {status && (
        <div className={`px-4 py-3 text-center text-sm font-medium ${
          status.type === 'success' ? 'bg-green-100 text-green-800' :
          status.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {status.message}
        </div>
      )}

      {/* Admin Key */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-4">
          <label className="text-sm font-medium text-amber-800 whitespace-nowrap">🔑 Admin Key:</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Required for translation and question generation..."
            className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex gap-1 bg-white rounded-t-lg border-b">
          {[
            { id: 'input', label: '1️⃣ Input', icon: '📝' },
            { id: 'slides', label: '2️⃣ Slides', icon: '🎬', count: slides.length },
            { id: 'questions', label: '3️⃣ Questions', icon: '❓', count: questions.length },
            { id: 'files', label: '4️⃣ Files', icon: '📁' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3 font-medium transition border-b-2 ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 border-transparent'
              }`}
            >
              {tab.icon} {tab.label} {'count' in tab && tab.count ? `(${tab.count})` : ''}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-8">
        {/* TAB: INPUT */}
        {activeTab === 'input' && (
          <div className="bg-white rounded-b-lg shadow p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left: Lesson Info */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-2">📋 Lesson Information</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Lesson #</label>
                    <input
                      type="number"
                      value={lessonNumber}
                      onChange={(e) => setLessonNumber(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(parseInt(e.target.value) || 25)}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Emoji</label>
                    <select
                      value={lessonEmoji}
                      onChange={(e) => setLessonEmoji(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {emojiOptions.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Title (RU)</label>
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-yellow-50"
                    placeholder="Название урока на русском..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Title (EN)</label>
                  <input
                    type="text"
                    value={lessonTitleEn}
                    onChange={(e) => setLessonTitleEn(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-blue-50"
                    placeholder="Lesson title in English..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description (EN) — for lessons list</label>
                  <textarea
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-blue-50"
                    rows={2}
                    placeholder="Short description for the lessons page..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Card Color</label>
                  <select
                    value={lessonColor}
                    onChange={(e) => setLessonColor(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {colorOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Right: Russian Text Input */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-2">📝 Lesson Content (Russian)</h3>
                <p className="text-xs text-gray-500">
                  Paste the full Russian text. Separate sections with empty lines. First line of each section becomes the title.
                </p>
                <textarea
                  id="fullRussianText"
                  className="w-full px-3 py-2 border rounded-lg bg-yellow-50 text-sm font-mono"
                  rows={15}
                  placeholder="Введение

Первый раздел урока. Текст первого раздела...

Второй раздел

Текст второго раздела..."
                />
                <button
                  onClick={() => {
                    const textarea = document.getElementById('fullRussianText') as HTMLTextAreaElement
                    if (textarea?.value) {
                      parseRussianText(textarea.value)
                    }
                  }}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                >
                  📋 Parse into Slides →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SLIDES */}
        {activeTab === 'slides' && (
          <div className="bg-white rounded-b-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                {slides.length} slides • Russian → English translation
              </div>
              <div className="flex gap-2">
                <button onClick={addSlide} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  + Add Slide
                </button>
                <button
                  onClick={translateAll}
                  disabled={isTranslating || slides.length === 0 || !adminKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {isTranslating ? '⏳ Translating...' : '🌐 Translate All'}
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  disabled={slides.length === 0}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
                >
                  Next: Questions →
                </button>
              </div>
            </div>

            {slides.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">📝</div>
                <p>Go to Input tab and paste Russian text, then click "Parse into Slides"</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {slides.map((slide, idx) => (
                  <div key={slide.id} className={`border rounded-lg p-4 ${translatingSlide === slide.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-gray-500 w-8">#{idx + 1}</span>
                      <select
                        value={slide.emoji}
                        onChange={(e) => updateSlide(slide.id, 'emoji', e.target.value)}
                        className="w-16 text-center text-xl border rounded"
                      >
                        {emojiOptions.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          value={slide.title}
                          onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                          className="px-3 py-1 border rounded bg-yellow-50 text-sm"
                          placeholder="Заголовок (RU)"
                        />
                        <input
                          value={slide.titleEn}
                          onChange={(e) => updateSlide(slide.id, 'titleEn', e.target.value)}
                          className="px-3 py-1 border rounded bg-blue-50 text-sm"
                          placeholder="Title (EN)"
                        />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => moveSlide(idx, 'up')} disabled={idx === 0} className="px-2 py-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">↑</button>
                        <button onClick={() => moveSlide(idx, 'down')} disabled={idx === slides.length - 1} className="px-2 py-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">↓</button>
                        <button onClick={() => removeSlide(slide.id)} className="px-2 py-1 text-red-400 hover:text-red-600">🗑️</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <textarea
                        value={slide.content}
                        onChange={(e) => updateSlide(slide.id, 'content', e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm bg-yellow-50"
                        rows={3}
                        placeholder="Текст (RU)..."
                      />
                      <textarea
                        value={slide.contentEn}
                        onChange={(e) => updateSlide(slide.id, 'contentEn', e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm font-mono bg-blue-50"
                        rows={3}
                        placeholder="Content (EN) with **bold** and > quotes..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: QUESTIONS */}
        {activeTab === 'questions' && (
          <div className="bg-white rounded-b-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                {questions.length} questions for Voice Quiz
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateQuestions}
                  disabled={isGeneratingQuestions || slides.length === 0 || !adminKey}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
                >
                  {isGeneratingQuestions ? '⏳ Generating...' : '🤖 Generate with AI'}
                </button>
                <button
                  onClick={generateAllFiles}
                  disabled={slides.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  Generate All Files →
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">❓</div>
                <p>Click "Generate with AI" to create quiz questions from lesson content</p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={q.id} className="bg-gray-50 border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Q{i + 1}: {q.question}</p>
                        <p className="text-sm text-gray-600 mt-1">✓ {q.correct_answer}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${q.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {q.difficulty === 'hard' ? '🔥 Hard' : '📗 Easy'} • {q.points}pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: FILES */}
        {activeTab === 'files' && (
          <div className="bg-white rounded-b-lg shadow p-6">
            {!generatedFiles ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📁</div>
                <p className="text-gray-500 mb-4">Generate all lesson files</p>
                <button
                  onClick={generateAllFiles}
                  disabled={slides.length === 0}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  🚀 Generate All Files
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Instructions */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="font-bold text-indigo-900 mb-2">📖 How to create the lesson:</h3>
                  <ol className="text-sm text-indigo-800 space-y-1 list-decimal list-inside">
                    <li>Create folder: <code className="bg-indigo-100 px-1 rounded">mkdir -p src/app/(course)/lessons/{lessonNumber}</code></li>
                    <li>Copy <strong>page.tsx</strong> content below into that folder</li>
                    <li>Copy <strong>Audio Script</strong> into <code className="bg-indigo-100 px-1 rounded">scripts/generate-lesson{lessonNumber}-audio.js</code></li>
                    <li>Run: <code className="bg-indigo-100 px-1 rounded">node scripts/generate-lesson{lessonNumber}-audio.js</code></li>
                    <li>Copy <strong>questions.json</strong> into <code className="bg-indigo-100 px-1 rounded">public/data/questions/lesson{lessonNumber}.json</code></li>
                    <li>Update <strong>lessons/page.tsx</strong> with the new lesson entry</li>
                    <li>Commit & push: <code className="bg-indigo-100 px-1 rounded">git add . && git commit -m "Add lesson {lessonNumber}" && git push</code></li>
                  </ol>
                </div>

                {/* File: page.tsx */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                    <span className="font-mono text-sm">src/app/(course)/lessons/{lessonNumber}/page.tsx</span>
                    <button onClick={() => copyToClipboard(generatedFiles.pageTsx, 'page.tsx')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                      📋 Copy
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-900 text-green-400 overflow-auto text-xs max-h-64">
                    {generatedFiles.pageTsx.substring(0, 2000)}...
                  </pre>
                </div>

                {/* File: Audio Script */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                    <span className="font-mono text-sm">scripts/generate-lesson{lessonNumber}-audio.js</span>
                    <button onClick={() => copyToClipboard(generatedFiles.audioScript, 'Audio Script')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                      📋 Copy
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-900 text-green-400 overflow-auto text-xs max-h-48">
                    {generatedFiles.audioScript.substring(0, 1500)}...
                  </pre>
                </div>

                {/* File: Questions JSON */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                    <span className="font-mono text-sm">public/data/questions/lesson{lessonNumber}.json</span>
                    <button onClick={() => copyToClipboard(generatedFiles.questionsJson, 'Questions JSON')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                      📋 Copy
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-900 text-green-400 overflow-auto text-xs max-h-48">
                    {generatedFiles.questionsJson}
                  </pre>
                </div>

                {/* File: Lessons Page Update */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                    <span className="font-mono text-sm">Update: src/app/(course)/lessons/page.tsx</span>
                    <button onClick={() => copyToClipboard(generatedFiles.lessonsPageUpdate, 'Lessons Update')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                      📋 Copy
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-900 text-yellow-400 overflow-auto text-xs">
                    {generatedFiles.lessonsPageUpdate}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
