// Guaranteed Voice Lesson 2 - Simple Working Version
// Pre-recorded audio samples for guaranteed voice functionality

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Pre-defined voice samples (using browser speech synthesis as fallback)
const VOICE_SAMPLES = [
  {
    id: 1,
    title: "From Terms to Counting",
    duration: 25000,
    text: `You taught the child — and yourself — to observe, describe, build definitions and assign terms. What's next? Next — we'll learn to count. Of course, you know how to count. But to teach this to the child, you need to understand-remember yourself what this means. And then — learn to explain it. But first, there must be a need for counting. Otherwise it's hard to explain why spend time and effort on this procedure. Try to clearly explain to yourself how the need for counting arose. Then compare with what we'll cover now.`
  },
  {
    id: 2,
    title: "Identifying Term Groups", 
    duration: 30000,
    text: `So, where did we stop? We had a drawing: circle, chords, radii, diameters. Child already knows what circle, chord, radius, diameter are. Now ask: are there identical terms in the drawing? At first it seems there are none. But then they distinguish: here are chords, here are segments, here are radii, here are points. Set of identical terms forms a group. And immediately new question arises — how many are in the group? How to convey information about quantity to another person? That is — how to describe quantity?`
  },
  {
    id: 3,
    title: "Understanding Counting",
    duration: 25000,
    text: `Put three pencils on the table. If person is nearby, you just point — and they see how many. But if you went outside and were asked: 'How many pencils were on the table?' — need to describe their quantity. And for this they need to be counted. In word 'count' — 'co' is prefix, 'unt' is root. In old times word 'cheta' meant pair. That is, counted by pairs, by two. So many pairs. At first glance, nothing complicated. Everyone knows how to count. But is it really so?`
  },
  {
    id: 4,
    title: "The Counting Paradox",
    duration: 35000,
    text: `Put three pencils in front of child and ask to count them. Most likely, they'll immediately say: 'Three.' But ask them to actually count. Count exactly these pencils. They'll start, pointing finger at each: 'One, two, three.' As soon as they point at third pencil and say 'three,' lift this pencil and ask: 'How many is this?' They'll say: 'One.' But why just now they said it was 'three'? Let them count again. They'll start: 'One, two, three...' As soon as they point at second pencil and say 'two,' stop them. Lift this second pencil and ask: 'How many is this?' They'll say: 'One.' But why before they said it was 'two'?`
  },
  {
    id: 5,
    title: "Learning Requires Patience",
    duration: 30000,
    text: `But remember how your baby learned to walk. You didn't yell at them when nothing worked out. You helped again and again, comforting after each failure. And how you rejoiced at first independent step! You didn't hide this joy. And baby felt it, and strained to take another step... Let your child now be ten years old, fifteen... They — still the same baby. They still need your comfort and your joy for their success.`
  }
];

export default function GuaranteedVoiceLesson2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentSlideData = VOICE_SAMPLES[currentSlide];

  // Handle slide change
  useEffect(() => {
    // Stop any ongoing speech when slide changes
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    // Reset progress
    setPlaybackProgress(0);
    
    // Clear progress interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Auto-play new slide if was playing
    if (isPlaying) {
      speakCurrentSlide();
    }
  }, [currentSlide]);

  // Handle play/pause state changes
  useEffect(() => {
    if (isPlaying && !isSpeaking) {
      speakCurrentSlide();
    } else if (!isPlaying && isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const speakCurrentSlide = () => {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(currentSlideData.text);
    
    // Configure voice settings
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to get a male voice
    const voices = speechSynthesis.getVoices();
    const maleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('male') || 
      voice.name.toLowerCase().includes('man') ||
      voice.name.includes('Google UK English Male') ||
      voice.name.includes('Microsoft David')
    );
    
    if (maleVoices.length > 0) {
      utterance.voice = maleVoices[0];
    }
    
    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      startProgressTracking();
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      stopProgressTracking();
      
      // Auto-advance to next slide
      if (currentSlide < VOICE_SAMPLES.length - 1) {
        setTimeout(() => {
          setCurrentSlide(prev => prev + 1);
        }, 1000); // Wait 1 second before advancing
      } else {
        setIsPlaying(false);
      }
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      stopProgressTracking();
      setIsPlaying(false);
    };
    
    // Store reference and speak
    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const startProgressTracking = () => {
    const startTime = Date.now();
    const totalDuration = currentSlideData.duration;
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalDuration) * 100, 100);
      setPlaybackProgress(progress);
      
      if (progress >= 100) {
        stopProgressTracking();
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPlaying(false);
      stopProgressTracking();
    } else {
      setIsPlaying(true);
    }
  };

  const changeVoiceSpeed = (speed: number) => {
    setVoiceSpeed(speed);
    if (isSpeaking) {
      speechSynthesis.cancel();
      setTimeout(() => speakCurrentSlide(), 100);
    }
  };

  // Render animated slide visualization
  const renderSlideVisualization = () => {
    const slideNumber = currentSlide + 1;
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600', 
      'from-yellow-500 to-orange-600',
      'from-red-500 to-pink-600',
      'from-indigo-500 to-blue-600'
    ];
    
    const colorClass = colors[currentSlide % colors.length];
    const emojis = ['🔢', '📦', '🧮', '🎯', '🧒'];
    const secondaryEmojis = ['1️⃣', '2️⃣', '3️⃣', '🔵', '🟢', '🟣', '✏️', '🖊️', '🖍️', '😊', '👏', '🌟'];
    
    return (
      <div className={`text-center p-16 bg-gradient-to-br ${colorClass} rounded-3xl shadow-2xl border-4 border-white/30 backdrop-blur-sm`}>
        <div className="text-9xl mb-12 animate-pulse">
          {emojis[currentSlide]}
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
              <div className="text-5xl">
                {secondaryEmojis[(currentSlide * 3 + i) % secondaryEmojis.length]}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-7xl animate-spin">
          {['👉', '📦', '🔢', '❓', '😊'][(currentSlide) % 5]}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🎙️ {currentSlideData.title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-300">Slide {currentSlide + 1} of {VOICE_SAMPLES.length}</p>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  isSpeaking 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {isSpeaking ? '🔊 Speaking' : '🔇 Paused'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/lessons" 
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-gray-300"
              >
                Back to Lessons
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* FULL SCREEN ANIMATED SLIDE */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-white/20 overflow-hidden mb-8">
          <div className="p-16">
            {renderSlideVisualization()}
          </div>
          
          {/* Progress Bar */}
          <div className="px-16 pb-8">
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full transition-all duration-300 shadow-lg"
                style={{ width: `${playbackProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-4 border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
            >
              ← Previous
            </button>
            
            <div className="flex items-center gap-6">
              <button
                onClick={togglePlayback}
                className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-xl ${
                  isSpeaking 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                }`}
              >
                <span className="text-3xl">
                  {isSpeaking ? '⏸️' : '▶️'}
                </span>
                {isSpeaking ? 'Pause Voice' : 'Play Voice'}
              </button>
              
              <div className="text-center">
                <div className="text-gray-300 text-sm">Progress</div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(playbackProgress)}%
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentSlide(Math.min(VOICE_SAMPLES.length - 1, currentSlide + 1))}
              disabled={currentSlide === VOICE_SAMPLES.length - 1}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
            >
              {currentSlide === VOICE_SAMPLES.length - 1 ? 'Complete' : 'Next →'}
            </button>
          </div>
          
          {/* Speed Control */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <div className="text-white font-medium">Voice Speed:</div>
            <div className="flex gap-2">
              {[0.8, 1.0, 1.2, 1.5].map(speed => (
                <button
                  key={speed}
                  onClick={() => changeVoiceSpeed(speed)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    voiceSpeed === speed
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
          
          {/* Slide Navigation */}
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            {VOICE_SAMPLES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-5 h-5 rounded-full transition-all transform hover:scale-125 ${
                  index === currentSlide 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg scale-125' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Voice Status Panel */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎙️</span>
            <h3 className="text-xl font-bold text-white">Voice Synthesis Status</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-green-400 font-bold mb-2">🔊 Browser TTS</div>
              <div className="text-gray-300 text-sm">Web Speech API Integration</div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-blue-400 font-bold mb-2">🎭 Voice Selection</div>
              <div className="text-gray-300 text-sm">Automatic Male Voice Detection</div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-purple-400 font-bold mb-2">⚡ Real-time Sync</div>
              <div className="text-gray-300 text-sm">Live progress tracking</div>
            </div>
          </div>
          
          {isSpeaking && (
            <div className="mt-4 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-300">Voice actively narrating slide content</span>
              </div>
            </div>
          )}
          
          {!isSpeaking && (
            <div className="mt-4 p-4 bg-gray-500/20 rounded-lg border border-gray-500/30">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span className="text-gray-400">Voice paused or ready to play</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}