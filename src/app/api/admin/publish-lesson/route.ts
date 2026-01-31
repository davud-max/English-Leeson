// Admin API: Publish complete lesson to GitHub
// Creates page.tsx, questions.json, generates audio, uploads all to GitHub

import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'davud-max/English-Leeson';
const GITHUB_BRANCH = 'main';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274';

interface Slide {
  id: number;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  emoji: string;
  audioText: string;
}

interface Question {
  id: number;
  question: string;
  correct_answer: string;
  difficulty: string;
  points: number;
}

interface PublishRequest {
  lessonNumber: number;
  lessonTitle: string;
  lessonTitleEn: string;
  lessonDescription: string;
  lessonDuration: number;
  lessonEmoji: string;
  lessonColor: string;
  slides: Slide[];
  questions: Question[];
  voiceId: string;
  adminKey: string;
}

// Upload file to GitHub
async function uploadToGitHub(filePath: string, content: string, message: string): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN not configured');
    return false;
  }

  try {
    // Check if file exists
    let existingSha: string | null = null;
    try {
      const checkResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
        {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        existingSha = data.sha;
      }
    } catch {
      // File doesn't exist
    }

    // Upload
    const uploadBody: Record<string, string> = {
      message,
      content: Buffer.from(content).toString('base64'),
      branch: GITHUB_BRANCH,
    };
    if (existingSha) uploadBody.sha = existingSha;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadBody),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`GitHub upload failed for ${filePath}:`, error);
      return false;
    }

    console.log(`✅ Uploaded: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return false;
  }
}

// Upload binary file (audio) to GitHub
async function uploadBinaryToGitHub(filePath: string, base64Content: string, message: string): Promise<boolean> {
  if (!GITHUB_TOKEN) return false;

  try {
    let existingSha: string | null = null;
    try {
      const checkResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
        {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        existingSha = data.sha;
      }
    } catch {
      // File doesn't exist
    }

    const uploadBody: Record<string, string> = {
      message,
      content: base64Content,
      branch: GITHUB_BRANCH,
    };
    if (existingSha) uploadBody.sha = existingSha;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadBody),
      }
    );

    return response.ok;
  } catch (error) {
    console.error(`Error uploading binary ${filePath}:`, error);
    return false;
  }
}

// Generate audio with ElevenLabs
async function generateAudio(text: string, voiceId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text.substring(0, 5000),
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      console.error('ElevenLabs error:', await response.text());
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
  } catch (error) {
    console.error('Audio generation error:', error);
    return null;
  }
}

// Generate page.tsx content
function generatePageTsx(data: PublishRequest): string {
  const { lessonNumber, lessonTitleEn, slides } = data;
  
  const slidesCode = slides.map((slide, idx) => `  {
    id: ${idx + 1},
    title: "${(slide.titleEn || slide.title || '').replace(/"/g, '\\"')}",
    content: \`${(slide.contentEn || slide.content).trim().replace(/`/g, '\\`')}\`,
    emoji: "${slide.emoji}",
    duration: ${Math.max(20000, (slide.audioText || slide.contentEn || slide.content).length * 80)}
  }`).join(',\n');

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
      audioRef.current.play().catch(() => {
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
    if (isPlaying) setAudioError(false);
  };

  const currentSlideData = LESSON_${lessonNumber}_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-stone-50">
      <audio ref={audioRef} onEnded={handleAudioEnded} onError={() => setAudioError(true)} />
      
      <header className="bg-stone-800 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">← Back to Course</Link>
            <div className="text-center">
              <h1 className="text-lg font-serif">Algorithms of Thinking and Cognition</h1>
              <p className="text-stone-400 text-sm">Lecture ${lessonNumber}</p>
            </div>
            <div className="text-stone-400 text-sm">{currentSlide + 1} / {totalSlides}</div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{currentSlideData.emoji}</span>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">{currentSlideData.title}</h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
        </div>

        <article className="bg-white rounded-lg shadow-lg border border-stone-200 p-8 md:p-12 mb-8">
          <div className="prose prose-stone prose-lg max-w-none">
            <ReactMarkdown
              components={{
                p: ({children}) => <p className="text-stone-700 leading-relaxed mb-5 text-lg">{children}</p>,
                strong: ({children}) => <strong className="text-stone-900 font-semibold">{children}</strong>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-amber-700 pl-6 my-6 italic text-stone-600 bg-amber-50 py-4 pr-4 rounded-r">{children}</blockquote>,
              }}
            >
              {currentSlideData.content}
            </ReactMarkdown>
          </div>
        </article>

        <div className="bg-white rounded-lg shadow border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-500 font-medium">Slide Progress</span>
            <span className="text-sm text-stone-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-700 transition-all duration-300 rounded-full" style={{ width: \`\${progress}%\` }} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-10">
          <button onClick={() => goToSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0} className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium">← Previous</button>
          <button onClick={togglePlay} className="px-8 py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition shadow-md">{isPlaying ? '⏸ Pause' : '▶ Play Lecture'}</button>
          <button onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))} disabled={currentSlide === totalSlides - 1} className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium">Next →</button>
        </div>

        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-lg p-6 mb-10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">🎤 Ready to Test Your Knowledge?</h3>
          <p className="text-amber-100 mb-4">Take a voice quiz with AI-generated questions</p>
          <button onClick={() => setShowQuiz(true)} className="px-8 py-3 bg-white text-amber-700 rounded-lg font-bold hover:bg-amber-50 transition shadow-md">Start Voice Quiz</button>
        </div>

        <div className="bg-white rounded-lg shadow border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Lecture Sections</h3>
          <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
            {LESSON_${lessonNumber}_SLIDES.map((slide, index) => (
              <button key={slide.id} onClick={() => goToSlide(index)} className={\`p-3 rounded text-sm font-medium transition \${index === currentSlide ? 'bg-amber-700 text-white' : index < currentSlide ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}\`} title={slide.title}>{index + 1}</button>
            ))}
          </div>
        </div>
      </main>

      {showQuiz && <VoiceQuiz lessonId={${lessonNumber}} lessonTitle="${(lessonTitleEn || '').replace(/"/g, '\\"')}" onClose={() => setShowQuiz(false)} />}

      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link href="/lessons/${lessonNumber - 1}" className="hover:text-white transition">← Lecture ${lessonNumber - 1}</Link>
            <span className="text-stone-500 text-sm font-serif">Lecture ${lessonNumber}</span>
            <Link href="/lessons" className="hover:text-white transition">All Lessons →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;
}

export async function POST(request: NextRequest) {
  try {
    const data: PublishRequest = await request.json();
    
    // Validate admin key
    if (data.adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });
    }

    const { lessonNumber, slides, questions, voiceId } = data;
    const results: { step: string; success: boolean; error?: string }[] = [];

    console.log(`🚀 Publishing Lesson ${lessonNumber}...`);

    // Step 1: Upload page.tsx
    console.log('📄 Uploading page.tsx...');
    const pageTsx = generatePageTsx(data);
    const pageSuccess = await uploadToGitHub(
      `src/app/(course)/lessons/${lessonNumber}/page.tsx`,
      pageTsx,
      `Add lesson ${lessonNumber} page`
    );
    results.push({ step: 'page.tsx', success: pageSuccess });

    // Step 2: Upload questions.json
    console.log('❓ Uploading questions.json...');
    const questionsJson = JSON.stringify({
      lessonId: lessonNumber,
      lessonTitle: data.lessonTitleEn || data.lessonTitle,
      generatedAt: new Date().toISOString(),
      questions: questions.length > 0 ? questions : [
        { id: 1, question: "Placeholder question", correct_answer: "Placeholder answer", difficulty: "easy", points: 5 }
      ],
    }, null, 2);
    const questionsSuccess = await uploadToGitHub(
      `public/data/questions/lesson${lessonNumber}.json`,
      questionsJson,
      `Add lesson ${lessonNumber} questions`
    );
    results.push({ step: 'questions.json', success: questionsSuccess });

    // Step 3: Generate and upload audio for each slide
    console.log('🎤 Generating audio...');
    let audioSuccessCount = 0;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const audioText = (slide.audioText || slide.contentEn || slide.content)
        .replace(/[#*_`\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (audioText.length < 10) continue;

      console.log(`  🔊 Slide ${i + 1}/${slides.length}...`);
      const audioBase64 = await generateAudio(audioText, voiceId || 'TxGEqnHWrfWFTfGW9XjX');
      
      if (audioBase64) {
        const audioSuccess = await uploadBinaryToGitHub(
          `public/audio/lesson${lessonNumber}/slide${i + 1}.mp3`,
          audioBase64,
          `Add lesson ${lessonNumber} slide ${i + 1} audio`
        );
        if (audioSuccess) audioSuccessCount++;
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    results.push({ step: 'audio', success: audioSuccessCount > 0, error: audioSuccessCount < slides.length ? `${audioSuccessCount}/${slides.length} slides` : undefined });

    // Summary
    const allSuccess = results.every(r => r.success);
    console.log(allSuccess ? '✅ Lesson published successfully!' : '⚠️ Some steps failed');

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess 
        ? `Lesson ${lessonNumber} published! Railway will redeploy automatically.`
        : `Lesson ${lessonNumber} partially published. Check results.`,
      results,
      lessonNumber,
    });

  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}
