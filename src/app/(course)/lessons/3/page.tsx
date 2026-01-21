'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_3_SLIDES = [
  {
    id: 1,
    title: "🔍 What's Next After Counting?",
    content: "🧠 **We've learned to observe, describe, define, assign terms, measure, distinguish groups, and count.**\n\n❓ What comes next?\n\n⚠️ **Important:** Every next step must be seriously motivated. The child must understand the necessity of the next step. Otherwise, they won't take it.",
    emoji: "🔍",
    illustration: "thinking-next-step",
    duration: 10000
  },
  {
    id: 2,
    title: "📏 Diameter and Radius: Same Terms, Different Sizes",
    content: "🎯 **Draw a familiar circle. Draw a chord through its center. This is diameter. Connect a point on the circle with its center. This is radius.**\n\n📏 Children can measure these with a ruler - it's easy.\n\n🔁 Do the same with another circle (larger or smaller). Compare two diameters. They differ in size. Yet both are diameters.\n\n💡 **Conclusion:** Terms don't distinguish sizes.",
    emoji: "📏",
    illustration: "circle-measurement",
    duration: 15000
  },
  {
    id: 3,
    title: "🔤 Introducing Parameters",
    content: "📝 **We need to denote these different sizes of the same thing.**\n\nLet's denote diameter length with letter **d**, radius length with letter **r**. These are parameters.\n\nFor the first circle: diameter length will be d₁, for the second: d₂. And so on for any circle: common notation stays, only indices change.\n\n📘 **Parameter** = Letter designation of quantity\n**Quantity** = Result of counting or measuring",
    emoji: "🔤",
    illustration: "parameters-intro",
    duration: 14000
  },
  {
    id: 4,
    title: "🧮 Our First Formula!",
    content: "💡 **Notice the obvious fact:** Diameter consists of two radii.\n\nTherefore, we can write: **d = 2r**\n\n🎉 This is our first formula!\n\n🎯 **What is a formula?**\nFormula = Parametric record of connection between quantities\nOr simply = Connection between parameters\n\n👶 Don't worry that children are too young for formulas. Third-graders comfortably operate with parameters - they're already dealing with algebra basics.",
    emoji: "🧮",
    illustration: "first-formula",
    duration: 16000
  },
  {
    id: 5,
    title: "🧮 Why Formulas? For Calculations",
    content: "🎯 **Purpose:** Formula allows calculations\n\n❓ **What is calculation?**\nCalculation = Obtaining parameter value not by measurement, but through its connections with other parameters\n\n📝 **Example:** If we measured radius length, there's no need to measure diameter length. It can be calculated - multiply radius length by two.\n\n💭 Child might say: \"Too simple. Why calculate diameter when it can also be measured? Measuring is even more interesting...\" And you'd agree!",
    emoji: "🧮",
    illustration: "calculation-purpose",
    duration: 15000
  },
  {
    id: 6,
    title: "📏 Measuring Circumference: The Challenge",
    content: "🔍 **Can we measure chord length with ruler?** Yes.\n**Diameter length?** Yes.\n**Radius length?** Also yes.\n**Circumference length?** No.\n\n❓ What to do?\n\nLet's denote circumference length with letter **c**. Ruler is straight, circumference is curved. Can't measure with ruler.\n\n💭 What else can we measure with? If child guesses \"string\" - excellent! Wrap string along circumference, then stretch and measure. String length equals circumference length.\n\n⚠️ But: 1) Not quite accurate 2) String not always handy...",
    emoji: "📏",
    illustration: "circumference-challenge",
    duration: 18000
  },
  {
    id: 7,
    title: "🥧 Discovering Pi",
    content: "🧠 We know two radii fit on diameter length. How many diameter lengths fit on circumference length?\n\nWe have measured circumference value. Divide it by measured diameter value of the same circle. Result is approximately three.\n\n🔁 Do the same with circles of different sizes - result is the same. About three diameter lengths fit on any circumference length.\n\n🎯 More precisely: 3.14\nEven more precisely: 3.1415926535...\n\n🌟 This is the famous, special number. Called **pi** (π).",
    emoji: "🥧",
    illustration: "pi-discovery",
    duration: 20000
  },
  {
    id: 8,
    title: "🧮 Formula for Circumference",
    content: "📝 Therefore, we can write: **c = πd**\n\n📘 **Pi** = Circumference length per unit of its diameter length\nOr: Pi = Circumference length of unit diameter\n\n🎯 Tedious circumference measurement can be replaced by simple diameter measurement and multiplying result by pi.\n\nWe calculated what's difficult to measure.",
    emoji: "🧮",
    illustration: "circumference-formula",
    duration: 15000
  },
  {
    id: 9,
    title: "🧮 Final Circumference Formula",
    content: "📏 But measuring radius is even easier than diameter! For diameter we need to align three points with ruler, for radius - only two.\n\nWe know **d = 2r**. Substitute this into our formula.\n\n🎯 Get: **c = 2πr**\n\nThis is the final circumference formula.\n\n📘 **Formula allows calculating what's hard/impossible to measure using what's easy to measure.**",
    emoji: "🧮",
    illustration: "final-formula",
    duration: 16000
  },
  {
    id: 10,
    title: "🎯 Learning the Key Phrase",
    content: "🗣️ Ask child to repeat this expression in words:\n\n\"**Formula allows calculating what's hard to measure using what's easy to measure.**\"\n\n🔁 They likely won't get it first try. Make them memorize this phrase and say it fluently.\n\n🎯 **How?** Not by forcing. Everything will work out naturally. Child understands meaning, but their tongue doesn't obey yet. When they stumble - just smile and ask to repeat. Can use stopwatch for competition: who says it faster and clearer.",
    emoji: "🎯",
    illustration: "key-phrase",
    duration: 18000
  },
  {
    id: 11,
    title: "📐 Practical Exercise",
    content: "🎮 Give child old CD and ruler. Let them figure out circumference length.\n\n👀 Observe. Likely they'll try applying ruler to edge. Let them struggle with this impossibility. Maybe they'll guess to wrap with string. Eventually, let them measure diameter - this is easy.\n\n📝 Then let them write formula: **c = πd**\nSubstitute measured d value - about 12 cm\nCalculate: c ≈ 3.14 × 12 = 37.68 cm",
    emoji: "📐",
    illustration: "practical-exercise",
    duration: 17000
  },
  {
    id: 12,
    title: "🎯 Measurement vs Calculation",
    content: "❓ Now ask: \"Did you measure circumference length?\" They'll likely answer: \"Yes!\"\n\n Gentle but firm correction: \"No. You measured diameter length. Circumference length - you calculated.\"\n\n❗ **This is very important.** Show and reinforce distinction between measurement and calculation from the beginning.\n\n🌉 Formula is bridge between them. It doesn't cancel measurement, but overcomes its limitations.\n\n🎯 Thus necessity gave birth to parameter concept. From parameter connections - formula. From formula - power of calculation.\n\n🔑 Your child now knows not just \"how to count,\" but why those strange letters in math. They hold key - **c = 2πr**. This key opens door from world of what can be seen and measured to world of what can be understood and derived.",
    emoji: "🎯",
    illustration: "measurement-vs-calculation",
    duration: 25000
  }
];

export default function Lesson3Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  // Calculate total lesson duration
  const totalDuration = LESSON_3_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timer
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    // Load and play audio for current slide
    const audioFile = `/audio/lesson3/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Set timer for current slide
    slideTimerRef.current = setTimeout(() => {
      if (currentSlide < LESSON_3_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        // Lesson completed
        setIsPlaying(false);
      }
    }, LESSON_3_SLIDES[currentSlide].duration);

    // Update progress
    const startTime = Date.now();
    const slideDuration = LESSON_3_SLIDES[currentSlide].duration;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const slideProgress = Math.min(elapsed / slideDuration, 1);
      setProgress(slideProgress);
      
      // Total progress
      const totalElapsed = totalTimeRef.current + elapsed;
      setTotalProgress(totalElapsed / totalDuration);
    };

    const progressInterval = setInterval(updateProgress, 100);
    
    return () => {
      clearInterval(progressInterval);
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isPlaying]);

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      // Audio ended naturally, advance to next slide
      if (currentSlide < LESSON_3_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentSlide]);

  const togglePlay = () => {
    if (isPlaying) {
      // Pause
      audioRef.current?.pause();
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
      setIsPlaying(false);
      totalTimeRef.current += LESSON_3_SLIDES[currentSlide].duration * progress;
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
    LESSON_3_SLIDES.slice(0, index).forEach(slide => {
      totalTimeRef.current += slide.duration;
    });
  };

  const nextSlide = () => {
    if (currentSlide < LESSON_3_SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const currentSlideData = LESSON_3_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-purple-600 hover:text-purple-700 font-medium">
              ← All Lessons
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Lesson 3 of 17</span>
              <Link href="/checkout" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
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
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Slide Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{currentSlideData.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold">{currentSlideData.title}</h1>
                  <p className="text-purple-100">Slide {currentSlide + 1} of {LESSON_3_SLIDES.length}</p>
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
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
                  disabled={currentSlide === LESSON_3_SLIDES.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>

              {/* Slide Navigation */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {LESSON_3_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide 
                        ? 'bg-purple-600' 
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
            <Link href="/lessons/2" className="text-gray-600 hover:text-gray-900 font-medium">
              ← Lesson 2
            </Link>
            <div className="flex gap-3">
              <Link href="/checkout" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg">
                Enroll to Continue
              </Link>
            </div>
            <Link href="/lessons/4" className="text-gray-600 hover:text-gray-900 font-medium">
              Lesson 4 →
            </Link>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-purple-500 to-indigo-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Master Mathematical Thinking!</h2>
            <p className="text-purple-100 mb-6 text-lg">
              Continue learning with all 17 interactive lessons for just $30
            </p>
            <Link href="/checkout" className="inline-block bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-bold transition-colors shadow-lg">
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