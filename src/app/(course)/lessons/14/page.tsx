'use client';

import { useState, useEffect, useRef } from 'react';
import MarkdownContent from '@/components/course/MarkdownContent';

const LESSON_TITLE = "How Consciousness Creates Reality";
const LESSON_ID = 14;

// Presentation slides content with audio files
const PRESENTATION_SLIDES = [
  {
    id: 1,
    title: "The Paradox of Description",
    content: `
## 🔍 The Closed Circle of Language

We began with something simple: **"Describe what you see."**

But we encountered a fundamental paradox:

\`\`\`mermaid
graph LR
    A[Observation] --> B[Description]
    B --> C[Words Needed]
    C --> D[Terms Required]
    D --> E[Definitions Needed]
    E --> A
\`\`\`

**The Problem:** To describe something, you need words. But words are terms. And terms require definitions. Which brings us back to needing to describe...

**Only one thing can break this cycle — the act of primary distinction.**
`,
    emoji: "🌀",
    audioFile: "/audio/lessons/14/segment-01.mp3"
  },
  {
    id: 2,
    title: "Absolute Darkness",
    content: `
## 🌑 The Primordial State

**Imagine absolute darkness** — not physical darkness, but meaningful darkness.

In this state, there is:
- No "here" or "there"
- No "self" or "other"  
- No distinctions whatsoever

This is what ancient texts call **"water"** — homogeneous, indistinguishable Being.

\`\`\`mermaid
graph TD
    A[Absolute Unity] --> B[No Boundaries]
    B --> C[Indistinguishable Existence]
    C --> D[Primordial Water]
\`\`\`

**What can emerge from this unity?** Only one thing — the appearance of boundaries.

**But for boundaries to appear, light is needed.**

> **Light is not photons** — it's the ability to draw a line and say: "this is not that."
`,
    emoji: "💧",
    audioFile: "/audio/lessons/14/segment-02.mp3"
  },
  {
    id: 3,
    title: "The Act of Naming",
    content: `
## ✨ Light as Distinction

**Biblical formulation:** "And God said: let there be light. And there was light."

**Key insight:** God didn't "create" light in the usual sense. **He named it.**

\`\`\`mermaid
graph LR
    A[Silent Existence] --> B[Act of Naming]
    B --> C[Light Appears]
    C --> D[Boundaries Form]
\`\`\`

**What does this mean in our terms?**
- Observable separates from unobservable
- "Earth" (World) separates from "Heaven" (Nothing)
- Firmament appears — the first boundary

> **Light = First operation of distinction**
`,
    emoji: "🕯️",
    audioFile: "/audio/lessons/14/segment-03.mp3"
  },
  {
    id: 4,
    title: "Circle Lesson Revisited",
    content: `
## 🔄 Three Elements in Action

Let's recall our first lecture about the circle:

**Object:** Chalk mark on board = "water" (indistinguishable Being)

**Observer:** Child watching = Spirit "moving over water"

**Description:** Drawing boundaries (curved, closed, equidistant) = Light

\`\`\`mermaid
graph TD
    A[Chalk Mark - Water] --> D[Undifferentiated]
    B[Child - Spirit] --> E[Observing]
    C[Boundary Drawing - Light] --> F[Distinguishing]
    D --> G[Three Inseparable Elements]
    E --> G
    F --> G
\`\`\`
`,
    emoji: "⭕",
    audioFile: "/audio/lessons/14/segment-04.mp3"
  },
  {
    id: 5,
    title: "The Trinity of Cognition",
    content: `
## 🔺 Three Inseparable Elements

**Being** — what is (Father = Source Material)

**Consciousness** — what distinguishes (Holy Spirit = Observing Spirit)

**Act of Distinction** — light giving birth to boundaries (Son/Logos = Word)

\`\`\`mermaid
graph TD
    A[Father - Being] --> D[Source Material]
    B[Son - Distinction] --> E[Light/Boundaries]
    C[Spirit - Consciousness] --> F[Observer]
    D --> G[Cognitive Process]
    E --> G
    F --> G
\`\`\`

> **This is not mysticism, but a strict scheme of how cognition works.**
`,
    emoji: "☦️",
    audioFile: "/audio/lessons/14/segment-05.mp3"
  },
  {
    id: 6,
    title: "World as Appearance",
    content: `
## 🌍 World Through Distinction

**Key principle:** Terms in our first lecture were born only after definitions. Similarly, the world is born only after acts of distinction.

\`\`\`mermaid
graph LR
    A[No Distinction] --> B[Act of Distinction]
    B --> C[Boundaries Appear]
    C --> D[World Emerges]
\`\`\`

**God didn't "create" the world like a craftsman makes furniture.**

> **The world "appeared" when an Observer capable of distinction emerged.**
`,
    emoji: "✨",
    audioFile: "/audio/lessons/14/segment-06.mp3"
  },
  {
    id: 7,
    title: "Human as Co-Creator",
    content: `
## 👤 Man as Co-Creator

**Biblical perspective:** "And the Lord God formed man from dust of the ground, and breathed into his nostrils breath of life."

**Translation:**
- "Dust of the ground" = undifferentiated material of being
- "Breath of life" = the light of distinction that makes man conscious

\`\`\`mermaid
graph LR
    A[Potential Being] --> B[Act of Distinction]
    B --> C[Living Consciousness]
    C --> D[Co-Creation]
\`\`\`

> **Man is not passive observer but active participant in creation.**
`,
    emoji: "🌬️",
    audioFile: "/audio/lessons/14/segment-07.mp3"
  },
  {
    id: 8,
    title: "New Heaven and Earth",
    content: `
## 🌟 Paradigm Shift

**Revelation 21:1:** "And I saw a new heaven and a new earth, for the first heaven and the first earth had passed away."

**This is not about planetary destruction.**

\`\`\`mermaid
graph LR
    A[Old Distinction] --> B[New Light]
    B --> C[Old World Dissolves]
    C --> D[New World Appears]
\`\`\`

**It's about consciousness paradigm shift:**
- Change in distinguishing ability
- Appearance of "new light"
- Old world disappears, new world emerges

> **Reality transforms when consciousness transforms.**
`,
    emoji: "🌌",
    audioFile: "/audio/lessons/14/segment-08.mp3"
  },
  {
    id: 9,
    title: "Constructed Reality",
    content: `
## 🧠 Reality We Live In

**We don't live in "objective reality."**

We live in **reality distinguished by our consciousness.**

\`\`\`mermaid
graph TD
    A[Your Objects] --> B[Table-Cup-Friend]
    B --> C[Boundaries Drawn]
    C --> D[By Your Light-Consciousness]
    D --> E[In Fabric of Being]
\`\`\`

**Why are these boundaries stable?**
- Our "metric" of distinction is shared culturally
- Common cognitive framework
- Similar distinguishing abilities

> **Your reality is constructed by your consciousness.**
`,
    emoji: "🎨",
    audioFile: "/audio/lessons/14/segment-09.mp3"
  },
  {
    id: 10,
    title: "Different Worlds",
    content: `
## 🌎 Multiple Realities

**Same physical Being, different distinctions:**

\`\`\`mermaid
graph TD
    A[Physical Being - One] --> B[Different Metrics]
    B --> C[Dolphin Reality]
    B --> D[Bat Reality]
    B --> E[Alien Reality]
    C --> F[Different Boundaries]
    D --> F
    E --> F
\`\`\`

**Exercise:**
Look at any object. Try to:
1. Stop recognizing it
2. Forget its name and function  
3. See it as "piece of distinguished Being"

> **You'll feel dizziness — experience of boundary dissolution.**
`,
    emoji: "🌀",
    audioFile: "/audio/lessons/14/segment-10.mp3"
  }
];

export default function Lesson14() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [currentAudio]);

  // Handle slide change
  useEffect(() => {
    if (isPlaying) {
      playCurrentSlide();
    } else {
      stopAudio();
    }
    setProgress(0);
  }, [currentSlide, isPlaying]);

  const playCurrentSlide = () => {
    if (currentAudio) {
      currentAudio.pause();
    }
    
    const audio = new Audio(PRESENTATION_SLIDES[currentSlide].audioFile);
    audio.volume = isMuted ? 0 : 1;
    
    // Add user interaction requirement for autoplay
    audio.onplay = () => {
      console.log('Audio started playing');
    };
    
    audio.onended = () => {
      console.log('Audio finished');
      if (currentSlide < PRESENTATION_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };
    
    audio.onerror = (event) => {
      console.error('Audio playback error:', event);
      // Try fallback to Web Speech API if file fails
      console.log('Falling back to Web Speech API');
      speakCurrentSlideText();
    };
    
    // Attempt to play with user gesture
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Audio playback started successfully');
          setCurrentAudio(audio);
          
          // Update progress bar
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = setInterval(() => {
            if (audio) {
              const progressPercent = (audio.currentTime / audio.duration) * 100;
              setProgress(isNaN(progressPercent) ? 0 : progressPercent);
            }
          }, 100);
        })
        .catch(error => {
          console.error('Failed to play audio:', error);
          // Fallback to speech synthesis
          console.log('Using Web Speech API fallback');
          speakCurrentSlideText();
        });
    }
  };

  // Fallback function using Web Speech API
  const speakCurrentSlideText = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const textContent = PRESENTATION_SLIDES[currentSlide].content
        .replace(/##.*\n/g, '') // Remove headers
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/[>]/g, '') // Remove quotes
        .replace(/\n+/g, ' ')
        .trim();
      
      const utterance = new SpeechSynthesisUtterance(textContent);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = isMuted ? 0 : 1;
      
      utterance.onend = () => {
        if (currentSlide < PRESENTATION_SLIDES.length - 1) {
          setCurrentSlide(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      };
      
      speechSynthesis.speak(utterance);
      console.log('Using Web Speech API fallback');
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (currentAudio) {
      currentAudio.volume = isMuted ? 1 : 0;
    }
  };

  const nextSlide = () => {
    if (currentSlide < PRESENTATION_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = PRESENTATION_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lesson {LESSON_ID}</h1>
              <p className="text-lg text-indigo-600">{LESSON_TITLE}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${isMuted ? 'text-gray-400' : 'text-indigo-600'}`}>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              </button>
              <button
                onClick={togglePlayPause}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-gray-200 h-1 w-full">
        <div 
          className="bg-indigo-600 h-1 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Slide Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{currentSlideData.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold">{currentSlideData.title}</h2>
                  <p className="text-indigo-100">Slide {currentSlide + 1} of {PRESENTATION_SLIDES.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <MarkdownContent content={currentSlideData.content} />
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentSlide === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Previous</span>
              </button>

              {/* Slide Thumbnails */}
              <div className="flex space-x-2">
                {PRESENTATION_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide 
                        ? 'bg-indigo-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentSlide === PRESENTATION_SLIDES.length - 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentSlide === PRESENTATION_SLIDES.length - 1 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <span>Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with navigation */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Lesson navigation */}
            <div className="flex items-center space-x-4">
              <a 
                href="/lessons/13" 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Lesson 13</span>
              </a>
              
              <span className="text-gray-400">|</span>
              
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg font-medium">
                Lesson 14
              </span>
              
              <span className="text-gray-400">|</span>
              
              <a 
                href="/lessons/15" 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span>Lesson 15</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            </div>
            
            {/* Main lessons page link */}
            <a 
              href="/lessons" 
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>All Lessons</span>
            </a>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500">
            <p>Lesson {LESSON_ID}: {LESSON_TITLE}</p>
            <p className="mt-2 text-sm">Interactive presentation with professional audio narration</p>
          </div>
        </div>
      </footer>
    </div>
  );
}