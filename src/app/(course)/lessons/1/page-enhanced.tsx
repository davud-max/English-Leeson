'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_1_SLIDES = [
  {
    id: 1,
    title: "🎯 Welcome to Knowledge Birth",
    content: "**Good day and welcome to the lesson.** Today we'll explore how knowledge is born. How observation transforms into words, and words become tools of thinking.\n\n🧠 **The journey from seeing to understanding**\n\n🔮 **From concrete reality to abstract concepts**",
    emoji: "🎯",
    illustration: "welcome-knowledge",
    duration: 12000
  },
  {
    id: 2,
    title: "👁️ From Observation to Term",
    content: "**Everything begins with observation.** Observable phenomena must be described in words so the listener understands exactly what you observed.\n\n📝 **Shortest description** we'll call definition.\n\n📘 **Definition** = Shortest description of observable phenomenon, sufficient for understanding by another person.\n\n🏷️ Definition is assigned a **term**.\n\n🔤 **Term** = Word assigned to definition for convenience of use.\n\n📚 Every term, except ultimate term, has its definition.\n\n⚛️ **Ultimate term** = Term having no definition.",
    emoji: "👁️",
    illustration: "observation-description",
    duration: 20000
  },
  {
    id: 3,
    title: "⚫ The Point Concept",
    content: "**Point** — ultimate term. Point has no definition because point cannot be observed. It is zero-dimensional or, as they say, has no measure, no dimension.\n\n✏️ Point left by chalk on board or pencil on paper — this is actually not a point, but a **spot**.\n\n📏 **Line** — ultimate term of first level, that is, it is one-dimensional. It can be described using point. They say line consists of multitude of points.\n\n❌ But describing order of arrangement of these points is impossible, because have to say these are points arranged along line, which is incorrect. Therefore line has no definition.",
    emoji: "⚫",
    illustration: "point-line-concept",
    duration: 22000
  },
  {
    id: 4,
    title: "⬜ Plane and Space Concepts",
    content: "**Plane** — ultimate term of second level, that is, it is two-dimensional. It can be described using point and line.\n\n📏 They say plane consists of multitude of **parallel lines**. But describing order of their arrangement is impossible. Plane is unobservable, because lines of which it consists are also unobservable.\n\n🧊 **Space** — ultimate term of third level, that is, it is three-dimensional. It can be described using point, line and plane.\n\n🌌 Space is unobservable, because planes of which it consists are also unobservable.",
    emoji: "⬜",
    illustration: "plane-space",
    duration: 20000
  },
  {
    id: 5,
    title: "⚛️ Four Ultimate Terms",
    content: "These four ultimate terms allow building descriptions and definitions of any abstract objects.\n\n⚫ **Point** — zero dimensions\n📏 **Line** — one dimension  \n⬜ **Plane** — two dimensions\n🧊 **Space** — three dimensions\n\n🎯 Since every abstract object is nothing, it can be described by finite number of ultimate terms composing it. After all, there are only four of them. Or even just one ultimate term — point.\n\n🔑 **Key distinction:** Abstract object can be described completely and finally. Real object — cannot.",
    emoji: "⚛️",
    illustration: "four-terms",
    duration: 20000
  },
  {
    id: 6,
    title: "🔑 Real vs Abstract Objects",
    content: "**Real object cannot be described completely**, but can be directly demonstrated and designated by word. This word — noun, name.\n\n🏷️ **Name** = Word for real object. Can point with finger. Cannot describe completely.\n\n📘 **Abstract object cannot be demonstrated.** It doesn't exist. But can be described using ultimate terms.\n\n🔤 **Term** = Word for abstract object. Cannot show. Can describe completely through definition.\n\n🔄 **We demonstrated path:** How abstract object having only term make into noun.",
    emoji: "🔑",
    illustration: "real-abstract",
    duration: 18000
  },
  {
    id: 7,
    title: "🔄 Reverse Path: Name to Term",
    content: "**Can demonstrate reverse path?** Can noun transition to term and through this to abstraction?\n\n✅ **Can.**\n\n🧒 For child initially name apple — this is only this specific red apple. If shown different apple, for example green, then comparing with first and finding difference, child won't accept it as apple. For child this is not apple. This is something else.\n\n⏳ Only after some time from experience of communication child understands there are multitude of objects which, however they differ, are still called apples.\n\n🧠 **Child forms image of apple in general** — abstraction.",
    emoji: "🔄",
    illustration: "name-to-term",
    duration: 22000
  },
  {
    id: 8,
    title: "🎯 Two-Way Movement",
    content: "**We traced two opposite movements:** From abstraction to reality and from reality to abstraction.\n\n➡️ **From reality to abstraction** — observe, describe, give definition, assign term.\n\n⬅️ **From abstraction to reality** — take term, seek suitable objects in world.\n\n🎓 **Essence of education** — ability to move freely in both directions. This is what we must teach child.\n\n🔮 **Fundament of thinking** — ability to see invisible behind visible and find visible embodiment of invisible ideas!",
    emoji: "🎯",
    illustration: "two-way-movement",
    duration: 20000
  }
];

export default function Lesson1Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  // Calculate total lesson duration
  const totalDuration = LESSON_1_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  // Handle slide progression based on AUDIO (audio has priority)
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timer
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    // Load and play audio for current slide
    const audioFile = `/audio/lesson1/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Audio duration controls slide timing - no fixed timer needed
    // Slide advances when audio ends (handled in separate audio event listener)

    // Update progress based on actual audio playback
    const updateProgress = () => {
      if (audioRef.current && audioRef.current.duration) {
        setProgress(audioRef.current.currentTime / audioRef.current.duration);
        
        // Update total progress based on actual playback time
        const totalElapsed = totalTimeRef.current + (audioRef.current.currentTime * 1000);
        setTotalProgress(totalElapsed / totalDuration);
      }
    };

    const progressInterval = setInterval(updateProgress, 100);
    
    return () => {
      clearInterval(progressInterval);
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isPlaying, totalDuration]);

  // Handle audio playback events (AUDIO CONTROLS TIMING)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      // Audio ended naturally - advance to next slide
      console.log(`🎵 Audio ended for slide ${currentSlide + 1}, advancing...`);
      if (currentSlide < LESSON_1_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        // Lesson completed
        console.log("🎓 Lesson 1 completed!");
        setIsPlaying(false);
      }
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    // Add event listeners
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentSlide, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      // Pause
      audioRef.current?.pause();
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
      setIsPlaying(false);
      totalTimeRef.current += LESSON_1_SLIDES[currentSlide].duration * progress;
    } else {
      // Play - audio will be loaded in useEffect
      setIsPlaying(true);
    }
  };

  const goToSlide = (index: number) => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }
    setCurrentSlide(index);
    setProgress(0);
    totalTimeRef.current = 0;
    LESSON_1_SLIDES.slice(0, index).forEach(slide => {
      totalTimeRef.current += slide.duration;
    });
  };

  const nextSlide = () => {
    if (currentSlide < LESSON_1_SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const currentSlideData = LESSON_1_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-blue-600 hover:text-blue-700 font-medium">
              ← All Lessons
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Lesson 1 of 17</span>
              <Link href="/checkout" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Enroll Now - $30
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Lesson Progress
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(totalProgress * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Slide Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{currentSlideData.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold">{currentSlideData.title}</h1>
                  <p className="text-blue-100">Slide {currentSlide + 1} of {LESSON_1_SLIDES.length}</p>
                </div>
              </div>
            </div>

            {/* Slide Body */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{currentSlideData.content}</ReactMarkdown>
              </div>

              {/* Slide Progress */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Slide Progress</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-50 px-8 py-6 border-t">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  ← Previous
                </button>

                <button
                  onClick={togglePlay}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isPlaying 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === LESSON_1_SLIDES.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>

              {/* Slide Navigation */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {LESSON_1_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Audio Element */}
          <audio ref={audioRef} />

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <Link href="/lessons" className="text-gray-600 hover:text-gray-900 font-medium">
              ← All Lessons
            </Link>
            <div className="flex gap-3">
              <Link href="/checkout" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg">
                Enroll to Continue
              </Link>
            </div>
            <Link href="/lessons/2" className="text-gray-600 hover:text-gray-900 font-medium">
              Lesson 2 →
            </Link>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Master Critical Thinking!</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Continue learning with all 17 interactive lessons for just $30
            </p>
            <Link href="/checkout" className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-bold transition-colors shadow-lg">
              Enroll Now - $30
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}