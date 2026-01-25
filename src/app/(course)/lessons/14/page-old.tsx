'use client';

import { useState, useEffect, useRef } from 'react';
import MarkdownContent from '@/components/course/MarkdownContent';

// Simple SVG icons as fallback
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Pause = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const Play = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Volume2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const LESSON_TITLE = "How Consciousness Creates Reality";
const LESSON_ID = 14;

// Audio content for voice synthesis
const AUDIO_CONTENT = [
  "We began with something simple: 'Describe what you see.' And we encountered a paradox: to describe, you already need to know words. But words are terms, and terms are labels for definitions. We get a closed circle.",
  "Only one thing can break it — the act of primary distinction. Even before words. Even before definitions.",
  "Imagine absolute darkness. Not physical, but meaningful. There is no 'here' or 'there', no 'I' or 'not-I'. This is what ancient texts call 'water' — homogeneous, indistinguishable Being.",
  "What can happen in this 'water'? Only one thing — the appearance of a boundary. But for this, light is needed.",
  "Light is not photons. It's the ability to draw a line and say: 'this is not that.'",
  "In the Bible, this moment is described thus: 'And God said: let there be light. And there was light.' Notice: God didn't 'create' light in the usual sense. He named it. That is, light appears as an act of naming, as the first operation of distinction.",
  "Light separated from darkness. What does this mean in our conceptual system? The observable separated from the unobservable. 'Earth' — World — separated from 'heaven' — Nothing. A firmament appeared — that very first boundary.",
  "Let's recall our first lecture. What happened when we started describing a circle?",
  "Object — chalk mark on the board — this is analogous to 'water', indistinguishable Being.",
  "Observer — the child who looks — this is analogous to the Spirit that 'moves over the water.'",
  "Act of description — drawing boundaries: curved, closed, equidistant — this is the light itself.",
  "Here are the three inseparable elements:",
  "Being — what is.",
  "Consciousness — what distinguishes.",
  "Act of distinction — light, giving birth to boundaries.",
  "In religious tradition, this is called Father, Son, and Holy Spirit. But in our system, this is not mysticism, but a strict scheme of cognition.",
  "Father equals Being — the source material.",
  "Son equals Logos, Word, act of distinction — light.",
  "Holy Spirit equals Consciousness, spirit of the observer.",
  "Pay attention: in our first lecture, a term was born only after definition. Here too: the world is born only after the act of distinction. God didn't 'create' the world like a carpenter creates a table. The world 'appeared' as a result of an Observer capable of distinguishing it appearing.",
  "Here's the key point. If the world appears only when there is someone to distinguish it, then man is not a passive spectator. He is a co-creator.",
  "In the Bible: 'And the Lord God formed man from the dust of the ground, and breathed into his nostrils the breath of life.' 'Dust of the ground' — this is still undifferentiated material of being. 'Breath of life' — this is that same light, the ability to distinguish, which makes man living consciousness.",
  "The terrible meaning of the phrase becomes clear: 'And I saw a new heaven and a new earth, for the first heaven and the first earth had passed away.' This is not about the end of the planet. This is about a change in consciousness paradigm. When a person's way of distinguishing changes — 'new light' appears — for him the old world disappears and a new one appears.",
  "We live not in 'objective reality'. We live in reality distinguished by our consciousness.",
  "Your table, your cup, your friend — all this is boundaries drawn by your light-consciousness in the indivisible fabric of Being. These boundaries are stable because our way of distinguishing — our 'metric', as physicists would say — is common to all people raised in the same culture.",
  "But imagine a creature with a different 'metric' — for example, a dolphin, a bat, or an alien. For them, the firmament passes in different places. Their 'earth' and their 'heaven' are different. They live in a different world, though the physical Being is one.",
  "Exercise: Look at any object in the room. Try to stop recognizing it. Forget its name, function. Try to see in it simply 'a piece of distinguished Being'. This is an attempt to return to 'water' before the appearance of light. You will feel slight dizziness. This is the experience of dissolving boundaries."
];

// Presentation slides content
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
    emoji: "🌀"
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
    emoji: "💧"
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
    emoji: "🕯️"
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
    emoji: "⭕"
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
    emoji: "☦️"
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
    emoji: "✨"
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
    emoji: "🌬️"
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
    emoji: "🌌"
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
    emoji: "🎨"
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
    emoji: "🌀"
  }
];

export default function Lesson14() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      speechSynthesis.cancel();
    };
  }, []);

  // Handle slide change
  useEffect(() => {
    if (isPlaying) {
      speakCurrentSlide();
    }
    setProgress(0);
  }, [currentSlide, isPlaying]);

  const speakCurrentSlide = () => {
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(AUDIO_CONTENT[currentSlide]);
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
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };
    
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        speakCurrentSlide();
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 1 : 0;
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
                <Volume2 className={`w-5 h-5 ${isMuted ? 'text-gray-400' : 'text-indigo-600'}`} />
              </button>
              <button
                onClick={togglePlayPause}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
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
          style={{ width: `${((currentSlide + 1) / PRESENTATION_SLIDES.length) * 100}%` }}
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
                <ChevronLeft className="w-5 h-5" />
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
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500">
            <p>Lesson {LESSON_ID}: {LESSON_TITLE}</p>
            <p className="mt-2 text-sm">Interactive presentation with synchronized audio</p>
          </div>
        </div>
      </footer>
    </div>
  );
}