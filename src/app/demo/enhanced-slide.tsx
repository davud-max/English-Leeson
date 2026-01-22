'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

// Enhanced Slide Component with Maximum Visual Elements
export default function EnhancedSlideDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState([]);
  const [floatingElements, setFloatingElements] = useState([]);
  const audioRef = useRef(null);

  // Generate animated particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.7 + 0.3,
      color: ['🔵', '🟢', '🟡', '🔴', '🟣'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);
  }, []);

  // Generate floating educational elements
  useEffect(() => {
    const elements = [
      { icon: '✏️', label: 'PENCIL', x: 15, y: 25, delay: 0 },
      { icon: '📏', label: 'RULER', x: 85, y: 20, delay: 0.5 },
      { icon: '📘', label: 'BOOK', x: 10, y: 75, delay: 1 },
      { icon: '🧮', label: 'ABACUS', x: 90, y: 70, delay: 1.5 },
      { icon: '🔢', label: 'NUMBERS', x: 50, y: 15, delay: 2 },
      { icon: '🧠', label: 'MIND', x: 30, y: 85, delay: 2.5 },
      { icon: '🎯', label: 'TARGET', x: 70, y: 80, delay: 3 }
    ];
    setFloatingElements(elements);
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const slideContent = {
    id: 4,
    title: "🎯 The Counting Paradox",
    emoji: "🎯",
    content: "**Put three pencils in front of child and ask to count them.** Most likely, they'll immediately say: 'Three.' But ask them to actually count. Count exactly these pencils.\n\nThey'll start, pointing finger at each: 'One, two, three.' As soon as they point at third pencil and say 'three,' lift this pencil and ask: 'How many is this?' They'll say: 'One.' But why just now they said it was 'three'?\n\nLet them count again. They'll start: 'One, two, three...' As soon as they point at second pencil and say 'two,' stop them. Lift this second pencil and ask: 'How many is this?' They'll say: 'One.' But why before they said it was 'two'?",
    visualTheme: {
      gradient: "from-amber-400 via-orange-500 to-red-500",
      accent: "from-yellow-300 to-orange-400"
    },
    interactiveElements: {
      pencils: 3,
      fingers: 3,
      countingSequence: ['One', 'Two', 'Three'],
      paradoxHighlight: true
    },
    animations: {
      pencilBounce: true,
      fingerPoint: true,
      numberPop: true,
      confusionEffect: true
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slideContent.visualTheme.gradient} relative overflow-hidden`}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute text-2xl animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.size / 4})`,
              transition: 'all 0.1s linear'
            }}
          >
            {particle.color}
          </div>
        ))}
      </div>

      {/* Floating Educational Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center animate-bounce"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="text-4xl mb-2 drop-shadow-lg">{element.icon}</div>
            <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
              {element.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Slide Container */}
      <div className="container mx-auto px-6 py-8 relative z-10 min-h-screen flex flex-col">
        {/* Header with Enhanced Visuals */}
        <header className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 mb-8 shadow-2xl border border-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-7xl animate-spin-slow filter drop-shadow-2xl">
                {slideContent.emoji}
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
                  {slideContent.title}
                </h1>
                <div className="w-48 h-2 bg-gradient-to-r from-yellow-300 to-transparent rounded-full"></div>
                <p className="text-white/90 mt-3 text-xl font-medium">
                  Interactive Learning Experience
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-white font-bold text-2xl">Slide 4/15</div>
                <div className="text-white/80 text-sm">Lesson 2</div>
              </div>
            </div>
          </div>
        </header>

        {/* Interactive Demo Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Side - Visual Demonstration */}
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
            <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
              🎭 Live Counting Demonstration
            </h2>
            
            {/* Pencil Counting Visualization */}
            <div className="bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-2xl p-8 mb-6 border border-amber-300/30">
              <div className="text-center mb-6">
                <div className="text-2xl text-white/90 mb-4">Count these pencils:</div>
                <div className="flex justify-center gap-4 mb-6">
                  {Array.from({ length: slideContent.interactiveElements.pencils }).map((_, index) => (
                    <div 
                      key={index}
                      className={`text-6xl transition-all duration-500 hover:scale-110 cursor-pointer ${
                        slideContent.animations.pencilBounce ? 'animate-bounce' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      ✏️
                    </div>
                  ))}
                </div>
                
                {/* Finger Pointing Animation */}
                <div className="relative h-20">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {Array.from({ length: slideContent.interactiveElements.fingers }).map((_, index) => (
                      <div 
                        key={index}
                        className={`text-4xl transition-transform duration-300 ${
                          slideContent.animations.fingerPoint ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          animationDelay: `${index * 0.3 + 1}s`,
                          transform: index === 1 ? 'translateY(-20px)' : 'translateY(0)'
                        }}
                      >
                        👉
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Counting Sequence Display */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-center text-white/90 mb-3">Counting sequence:</div>
                <div className="flex justify-center gap-3">
                  {slideContent.interactiveElements.countingSequence.map((num, index) => (
                    <div 
                      key={index}
                      className={`text-2xl font-bold px-4 py-2 rounded-lg transition-all duration-500 ${
                        slideContent.animations.numberPop 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black animate-pulse' 
                          : 'bg-white/20 text-white'
                      }`}
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Paradox Reveal Button */}
            <button 
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-xl"
              onClick={() => {
                if (slideContent.animations.confusionEffect) {
                  // Trigger confusion effect
                  document.querySelector('.confusion-effect')?.classList.add('animate-ping');
                  setTimeout(() => {
                    document.querySelector('.confusion-effect')?.classList.remove('animate-ping');
                  }, 1000);
                }
              }}
            >
              🤯 Reveal the Paradox
            </button>
          </div>

          {/* Right Side - Content with Enhanced Styling */}
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
            <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
              📚 Lesson Content
            </h2>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-300/30 mb-6">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown className="text-white text-lg leading-relaxed">
                  {slideContent.content}
                </ReactMarkdown>
              </div>
            </div>
            
            {/* Key Insights Panel */}
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl p-6 border border-green-300/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                💡 Key Insights
              </h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <span>Child counts objects but names the number, not the objects</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🔄</span>
                  <span>Same physical object gets different numerical labels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🤯</span>
                  <span>This creates cognitive dissonance essential for learning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progress and Controls */}
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-bold">Progress</span>
                <span className="text-white/90 font-mono">{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-green-400 to-cyan-400 h-4 rounded-full transition-all duration-300 shadow-md"
                  style={{ width: `${progress * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Play/Pause Control */}
            <div className="text-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl mx-auto ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white'
                }`}
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                <span className="text-sm opacity-80">Narration</span>
              </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-end gap-3">
              <Link 
                href="/lessons/2" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-all border border-white/30 text-white font-medium"
              >
                ← Back
              </Link>
              <Link 
                href="/lessons/2" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
              >
                Continue →
              </Link>
            </div>
          </div>
          
          {/* Slide Navigation Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: 15 }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === 3 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 scale-125 shadow-lg' 
                    : index < 3
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} />

        {/* Confusion Effect Overlay */}
        <div className="confusion-effect absolute inset-0 pointer-events-none opacity-0">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-blue-500/20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl animate-spin">
            🔄
          </div>
        </div>
      </div>
    </div>
  );
}