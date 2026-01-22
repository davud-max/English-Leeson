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
    visualElements: {
      animation: "pulse",
      bgColor: "from-blue-400 via-purple-500 to-indigo-600",
      iconSize: "text-8xl",
      particles: true
    },
    duration: 12000
  },
  {
    id: 2,
    title: "👁️ From Observation to Term",
    content: "**Everything begins with observation.** Observable phenomena must be described in words so the listener understands exactly what you observed.\n\n📝 **Shortest description** we'll call definition.\n\n📘 **Definition** = Shortest description of observable phenomenon, sufficient for understanding by another person.\n\n🏷️ Definition is assigned a **term**.\n\n🔤 **Term** = Word assigned to definition for convenience of use.\n\n📚 Every term, except ultimate term, has its definition.\n\n⚛️ **Ultimate term** = Term having no definition.",
    emoji: "👁️",
    illustration: "observation-description",
    visualElements: {
      animation: "bounce",
      bgColor: "from-green-400 via-teal-500 to-blue-600", 
      iconSize: "text-7xl",
      floatingIcons: ["🔍", "📝", "🏷️", "🔤"],
      gradientBorder: true
    },
    duration: 20000
  },
  {
    id: 3,
    title: "⚫ The Point Concept",
    content: "**Point** — ultimate term. Point has no definition because point cannot be observed. It is zero-dimensional or, as they say, has no measure, no dimension.\n\n✏️ Point left by chalk on board or pencil on paper — this is actually not a point, but a **spot**.\n\n📏 **Line** — ultimate term of first level, that is, it is one-dimensional. It can be described using point. They say line consists of multitude of points.\n\n❌ But describing order of arrangement of these points is impossible, because have to say these are points arranged along line, which is incorrect. Therefore line has no definition.",
    emoji: "⚫",
    illustration: "point-line-concept",
    visualElements: {
      animation: "spin",
      bgColor: "from-gray-700 via-gray-800 to-black",
      iconSize: "text-9xl",
      geometricShapes: ["●", "─────", "●●●●●"],
      darkMode: true,
      particleTrail: true
    },
    duration: 22000
  },
  {
    id: 4,
    title: "⬜ Plane and Space Concepts",
    content: "**Plane** — ultimate term of second level, that is, it is two-dimensional. It can be described using point and line.\n\n📏 They say plane consists of multitude of **parallel lines**. But describing order of their arrangement is impossible. Plane is unobservable, because lines of which it consists are also unobservable.\n\n🧊 **Space** — ultimate term of third level, that is, it is three-dimensional. It can be described using point, line and plane.\n\n🌌 Space is unobservable, because planes of which it consists are also unobservable.",
    emoji: "⬜",
    illustration: "plane-space",
    visualElements: {
      animation: "float",
      bgColor: "from-cyan-400 via-blue-500 to-indigo-600",
      iconSize: "text-8xl",
      dimensionalLayers: ["⬜", "⬜⬜⬜", "⬜⬜⬜\n⬜⬜⬜\n⬜⬜⬜"],
      depthEffect: true
    },
    duration: 20000
  },
  {
    id: 5,
    title: "⚛️ Four Ultimate Terms",
    content: "These four ultimate terms allow building descriptions and definitions of any abstract objects.\n\n⚫ **Point** — zero dimensions\n📏 **Line** — one dimension  \n⬜ **Plane** — two dimensions\n🧊 **Space** — three dimensions\n\n🎯 Since every abstract object is nothing, it can be described by finite number of ultimate terms composing it. After all, there are only four of them. Or even just one ultimate term — point.\n\n🔑 **Key distinction:** Abstract object can be described completely and finally. Real object — cannot.",
    emoji: "⚛️",
    illustration: "four-terms",
    visualElements: {
      animation: "wiggle",
      bgColor: "from-purple-500 via-pink-500 to-red-500",
      iconSize: "text-7xl",
      termCards: ["⚫ 0D", "📏 1D", "⬜ 2D", "🧊 3D"],
      cardLayout: "grid",
      glowEffect: true
    },
    duration: 20000
  },
  {
    id: 6,
    title: "🔑 Real vs Abstract Objects",
    content: "**Real object cannot be described completely**, but can be directly demonstrated and designated by word. This word — noun, name.\n\n🏷️ **Name** = Word for real object. Can point with finger. Cannot describe completely.\n\n📘 **Abstract object cannot be demonstrated.** It doesn't exist. But can be described using ultimate terms.\n\n🔤 **Term** = Word for abstract object. Cannot show. Can describe completely through definition.\n\n🔄 **We demonstrated path:** How abstract object having only term make into noun.",
    emoji: "🔑",
    illustration: "real-abstract",
    visualElements: {
      animation: "shake",
      bgColor: "from-orange-400 via-red-500 to-pink-600",
      iconSize: "text-8xl",
      contrastSplit: true,
      leftSide: "-REAL-", 
      rightSide: "-ABSTRACT-",
      divider: true
    },
    duration: 18000
  },
  {
    id: 7,
    title: "🔄 Reverse Path: Name to Term",
    content: "**Can demonstrate reverse path?** Can noun transition to term and through this to abstraction?\n\n✅ **Can.**\n\n🧒 For child initially name apple — this is only this specific red apple. If shown different apple, for example green, then comparing with first and finding difference, child won't accept it as apple. For child this is not apple. This is something else.\n\n⏳ Only after some time from experience of communication child understands there are multitude of objects which, however they differ, are still called apples.\n\n🧠 **Child forms image of apple in general** — abstraction.",
    emoji: "🔄",
    illustration: "name-to-term",
    visualElements: {
      animation: "spin",
      bgColor: "from-yellow-400 via-orange-500 to-red-500",
      iconSize: "text-7xl",
      transformationArrows: true,
      beforeAfter: ["🍎 RED APPLE", "🍏 GREEN APPLE"],
      brainIcon: true
    },
    duration: 22000
  },
  {
    id: 8,
    title: "🎯 Two-Way Movement",
    content: "**We traced two opposite movements:** From abstraction to reality and from reality to abstraction.\n\n➡️ **From reality to abstraction** — observe, describe, give definition, assign term.\n\n⬅️ **From abstraction to reality** — take term, seek suitable objects in world.\n\n🎓 **Essence of education** — ability to move freely in both directions. This is what we must teach child.\n\n🔮 **Fundament of thinking** — ability to see invisible behind visible and find visible embodiment of invisible ideas!",
    emoji: "🎯",
    illustration: "two-way-movement",
    visualElements: {
      animation: "ping",
      bgColor: "from-indigo-500 via-purple-500 to-pink-500",
      iconSize: "text-9xl",
      dualArrows: true,
      circularFlow: true,
      lightRays: true,
      epicFinale: true
    },
    duration: 20000
  }
];

export default function EnhancedLesson1Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [particles, setParticles] = useState([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  // Generate floating particles for visual effect
  useEffect(() => {
    if (LESSON_1_SLIDES[currentSlide].visualElements?.particles) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3
      }));
      setParticles(newParticles);
    }
  }, [currentSlide]);

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
  const visual = currentSlideData.visualElements;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${visual.bgColor} relative overflow-hidden`}>
      {/* Animated Background Particles */}
      {visual.particles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDuration: `${particle.speed * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Icons Animation */}
      {visual.floatingIcons && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {visual.floatingIcons.map((icon, index) => (
            <div
              key={index}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="bg-white/20 backdrop-blur-sm shadow-lg border-b border-white/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-white hover:text-yellow-200 font-medium backdrop-blur-sm bg-white/20 px-4 py-2 rounded-lg transition-all">
              ← All Lessons
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-white/90 backdrop-blur-sm bg-white/20 px-4 py-2 rounded-lg">
                Lesson 1 of 17
              </span>
              <Link href="/checkout" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Enroll Now - $30
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8 backdrop-blur-sm bg-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold text-lg">
                Lesson Progress
              </span>
              <span className="text-white/90 text-lg font-mono">
                {Math.round(totalProgress * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 h-4 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${totalProgress * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30 transform transition-all duration-700 hover:scale-[1.02]">
            {/* Slide Header with Enhanced Visuals */}
            <div className={`bg-gradient-to-r ${visual.bgColor} p-8 text-white relative overflow-hidden`}>
              {visual.gradientBorder && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-transparent to-pink-400 rounded-3xl p-1 -m-1 animate-pulse"></div>
              )}
              <div className="relative flex items-center gap-6">
                <div className={`${visual.iconSize} ${visual.animation} filter drop-shadow-2xl`}>
                  {currentSlideData.emoji}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
                    {currentSlideData.title}
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-yellow-300 to-transparent rounded-full"></div>
                  <p className="text-white/80 mt-3 font-medium">
                    Slide {currentSlide + 1} of {LESSON_1_SLIDES.length}
                  </p>
                </div>
              </div>
              
              {/* Dimensional Visualization */}
              {visual.geometricShapes && (
                <div className="absolute right-8 top-8 flex flex-col gap-2">
                  {visual.geometricShapes.map((shape, index) => (
                    <div key={index} className="text-2xl opacity-70 animate-pulse" style={{animationDelay: `${index * 0.3}s`}}>
                      {shape}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slide Body with Enhanced Styling */}
            <div className="p-10">
              <div className="prose prose-lg max-w-none">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-inner">
                  <ReactMarkdown 
                    className={`text-white leading-relaxed text-lg ${
                      visual.darkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}
                  >
                    {currentSlideData.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Interactive Visual Elements */}
              {visual.termCards && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {visual.termCards.map((card, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:scale-105 transition-transform cursor-pointer shadow-lg"
                    >
                      <div className="text-2xl mb-2">⚛️</div>
                      <div className="text-white font-bold">{card}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Slide Progress */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/90 font-medium">Slide Progress</span>
                  <span className="text-white/80 font-mono">
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all duration-300 shadow-md"
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className="bg-white/10 backdrop-blur-sm px-10 py-8 border-t border-white/20">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm rounded-xl transition-all border border-white/30 text-white font-medium shadow-lg hover:shadow-xl"
                >
                  ← Previous
                </button>

                <button
                  onClick={togglePlay}
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white'
                  }`}
                >
                  {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                  <span className="text-sm opacity-80">Lecture</span>
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === LESSON_1_SLIDES.length - 1}
                  className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm rounded-xl transition-all border border-white/30 text-white font-medium shadow-lg hover:shadow-xl"
                >
                  Next →
                </button>
              </div>

              {/* Slide Navigation with Visual Indicators */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {LESSON_1_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all transform hover:scale-125 ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg scale-125' 
                        : index < currentSlide
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Audio Element */}
          <audio ref={audioRef} />

          {/* Enhanced Navigation */}
          <div className="mt-10 flex justify-between items-center backdrop-blur-sm bg-white/20 rounded-2xl p-6 shadow-xl">
            <Link href="/lessons" className="text-white/90 hover:text-white font-medium backdrop-blur-sm bg-white/20 px-6 py-3 rounded-lg transition-all border border-white/30 hover:border-white/50">
              ← All Lessons
            </Link>
            <div className="flex gap-4">
              <Link href="/checkout" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Enroll to Continue
              </Link>
            </div>
            <Link href="/lessons/2" className="text-white/90 hover:text-white font-medium backdrop-blur-sm bg-white/20 px-6 py-3 rounded-lg transition-all border border-white/30 hover:border-white/50">
              Lesson 2 →
            </Link>
          </div>

          {/* Epic CTA Section */}
          <div className="mt-14 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-10 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-pink-400/20 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
                Master Critical Thinking!
              </h2>
              <p className="text-xl mb-8 text-white/90 font-medium">
                Continue learning with all 17 interactive lessons for just $30
              </p>
              <Link href="/checkout" className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 px-10 py-4 rounded-xl font-bold transition-all shadow-2xl hover:shadow-3xl transform hover:scale-110 border-2 border-yellow-300">
                Enroll Now - $30
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-black/50 backdrop-blur-sm text-white/80 py-10 mt-20 border-t border-white/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}