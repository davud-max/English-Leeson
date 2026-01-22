// 24 Animated Slides Lesson - Full Context Visualization
// Every detail from voice narration illustrated with dynamic animations

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// FULL 24 SLIDES with detailed visualizations matching voice content
const FULL_PRESENTATION_SLIDES = [
  {
    id: 1,
    title: "Observation Foundation",
    voiceText: "You taught the child — and yourself — to observe, describe, build definitions and assign terms.",
    visual: {
      type: "observation",
      elements: ["👁️", "📝", "📚", "🏷️"],
      animation: "observe-process",
      details: ["child observing", "taking notes", "building knowledge", "assigning terms"]
    }
  },
  {
    id: 2,
    title: "What Comes Next?",
    voiceText: "What's next? Next — we'll learn to count.",
    visual: {
      type: "transition",
      elements: ["❓", "➡️", "🔢"],
      animation: "arrow-transition",
      details: ["question mark", "transition arrow", "counting numbers"]
    }
  },
  {
    id: 3,
    title: "Counting Knowledge",
    voiceText: "Of course, you know how to count. But to teach this to the child...",
    visual: {
      type: "knowledge",
      elements: ["🧠", "👨‍🏫", "🧒", "1️⃣2️⃣3️⃣"],
      animation: "teaching-cycle",
      details: ["teacher knowledge", "teaching process", "student learning", "counting sequence"]
    }
  },
  {
    id: 4,
    title: "Understanding Counting",
    voiceText: "You need to understand-remember yourself what this means.",
    visual: {
      type: "understanding",
      elements: ["🤔", "💭", "🔢", "❓"],
      animation: "thought-process",
      details: ["thinking deeply", "mental processing", "numbers concept", "understanding question"]
    }
  },
  {
    id: 5,
    title: "Explaining Counting",
    voiceText: "And then — learn to explain it.",
    visual: {
      type: "explanation",
      elements: ["🗣️", "📘", "🔢", "💡"],
      animation: "explanation-flow",
      details: ["speaking explanation", "instruction book", "number concepts", "light bulb moment"]
    }
  },
  {
    id: 6,
    title: "Necessity of Counting",
    voiceText: "But first, there must be a need for counting.",
    visual: {
      type: "necessity",
      elements: ["❗", "🔢", "❓", "💭"],
      animation: "need-arrows",
      details: ["necessity symbol", "counting requirement", "question necessity", "thinking need"]
    }
  },
  {
    id: 7,
    title: "Counting Procedure",
    voiceText: "Otherwise it's hard to explain why spend time and effort on this procedure.",
    visual: {
      type: "procedure",
      elements: ["⏱️", "💪", "🔢", "🔄"],
      animation: "effort-cycle",
      details: ["time investment", "effort expenditure", "counting process", "cyclical procedure"]
    }
  },
  {
    id: 8,
    title: "Self Explanation",
    voiceText: "Try to clearly explain to yourself how the need for counting arose.",
    visual: {
      type: "self-reflection",
      elements: ["🧘", "💭", "🔢", "❓"],
      animation: "reflection-cycle",
      details: ["self reflection", "internal dialogue", "counting origin", "personal questioning"]
    }
  },
  {
    id: 9,
    title: "Comparison Time",
    voiceText: "Then compare with what we'll cover now.",
    visual: {
      type: "comparison",
      elements: ["⚖️", "🆚", "📚", "🔮"],
      animation: "balance-compare",
      details: ["comparison scales", "versus symbol", "current knowledge", "future learning"]
    }
  },
  {
    id: 10,
    title: "Drawing Reference",
    voiceText: "So, where did we stop? We had a drawing: circle, chords, radii, diameters.",
    visual: {
      type: "geometric-drawing",
      elements: ["⭕", "📏", "📏", "↔️"],
      animation: "circle-parts",
      details: ["complete circle", "chord lines", "radius lines", "diameter line"]
    }
  },
  {
    id: 11,
    title: "Geometric Terms",
    voiceText: "Child already knows what circle, chord, radius, diameter are.",
    visual: {
      type: "geometry-labels",
      elements: ["⭕", "CIRCLE", "CHORD", "RADIUS", "DIAMETER"],
      animation: "label-reveal",
      details: ["labeled circle", "chord identification", "radius labeling", "diameter marking"]
    }
  },
  {
    id: 12,
    title: "Identical Terms Question",
    voiceText: "Now ask: are there identical terms in the drawing?",
    visual: {
      type: "identification",
      elements: ["❓", "🔍", "⭕", "📏"],
      animation: "search-process",
      details: ["question mark", "magnifying glass", "geometric search", "term identification"]
    }
  },
  {
    id: 13,
    title: "Initial Assessment",
    voiceText: "At first it seems there are none.",
    visual: {
      type: "initial-view",
      elements: ["❌", "👁️", "⭕", "📏"],
      animation: "negative-assessment",
      details: ["cross mark", "observing eye", "circle examination", "no matches found"]
    }
  },
  {
    id: 14,
    title: "Detailed Distinction",
    voiceText: "But then they distinguish: here are chords, here are segments, here are radii, here are points.",
    visual: {
      type: "distinction",
      elements: ["✅", "📏", "📐", "📏", "⚫"],
      animation: "group-separation",
      details: ["check mark", "chord grouping", "segment separation", "radius collection", "point identification"]
    }
  },
  {
    id: 15,
    title: "Group Formation",
    voiceText: "Set of identical terms forms a group.",
    visual: {
      type: "grouping",
      elements: ["📦", "📏📏", "📐📐", "📏📏"],
      animation: "package-grouping",
      details: ["group container", "chord bundle", "segment cluster", "radius collection"]
    }
  },
  {
    id: 16,
    title: "Quantity Question",
    voiceText: "And immediately new question arises — how many are in the group?",
    visual: {
      type: "quantity-inquiry",
      elements: ["❓", "🔢", "📦", "🧮"],
      animation: "counting-question",
      details: ["quantity question", "number inquiry", "group container", "calculation needed"]
    }
  },
  {
    id: 17,
    title: "Information Transfer",
    voiceText: "How to convey information about quantity to another person?",
    visual: {
      type: "communication",
      elements: ["💬", "👤", "👤", "🔢"],
      animation: "message-transfer",
      details: ["speech bubble", "sender person", "receiver person", "quantity information"]
    }
  },
  {
    id: 18,
    title: "Description Challenge",
    voiceText: "That is — how to describe quantity?",
    visual: {
      type: "description",
      elements: ["📝", "❓", "🔢", "📘"],
      animation: "writing-process",
      details: ["writing description", "description question", "numerical quantity", "instruction manual"]
    }
  },
  {
    id: 19,
    title: "Pencil Demonstration",
    voiceText: "Put three pencils on the table. If person is nearby, you just point — and they see how many.",
    visual: {
      type: "pencil-demo",
      elements: ["✏️✏️✏️", "👆", "👁️", "3️⃣"],
      animation: "pointing-demo",
      details: ["three pencils", "pointing gesture", "visual observation", "quantity three"]
    }
  },
  {
    id: 20,
    title: "Remote Description",
    voiceText: "But if you went outside and were asked: 'How many pencils were on the table?'",
    visual: {
      type: "remote-scenario",
      elements: ["🚪", "📞", "❓", "✏️"],
      animation: "distance-communication",
      details: ["door exit", "phone call", "remote question", "table pencils"]
    }
  },
  {
    id: 21,
    title: "Counting Necessity",
    voiceText: "Need to describe their quantity. And for this they need to be counted.",
    visual: {
      type: "counting-process",
      elements: ["🧮", "1️⃣2️⃣3️⃣", "✏️✏️✏️", "🔢"],
      animation: "counting-sequence",
      details: ["counting device", "number sequence", "pencil counting", "final number"]
    }
  },
  {
    id: 22,
    title: "Word Etymology",
    voiceText: "In word 'count' — 'co' is prefix, 'unt' is root.",
    visual: {
      type: "etymology",
      elements: ["🔤", "CO", "UNT", "COUNT"],
      animation: "word-breakdown",
      details: ["alphabet symbol", "prefix CO", "root UNT", "complete COUNT"]
    }
  },
  {
    id: 23,
    title: "Historical Context",
    voiceText: "In old times word 'cheta' meant pair. That is, counted by pairs, by two.",
    visual: {
      type: "historical",
      elements: ["🕰️", "chetа", "2️⃣", "一双"],
      animation: "historical-evolution",
      details: ["time clock", "ancient word", "pair concept", "Chinese equivalent"]
    }
  },
  {
    id: 24,
    title: "Counting Conclusion",
    voiceText: "So many pairs. At first glance, nothing complicated. Everyone knows how to count. But is it really so?",
    visual: {
      type: "conclusion",
      elements: ["❓", "_pairs_", "🧮", "💭"],
      animation: "reflective-ending",
      details: ["questioning", "pair multiplication", "counting tools", "deep reflection"]
    }
  }
];

export default function FullContextPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentSlideData = FULL_PRESENTATION_SLIDES[currentSlide];

  // Handle slide change with voice sync
  useEffect(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    setPlaybackProgress(0);
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    if (isPlaying) {
      speakCurrentSlide();
    }
  }, [currentSlide]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying && !isSpeaking) {
      speakCurrentSlide();
    } else if (!isPlaying && isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isPlaying]);

  // Cleanup
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
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(currentSlideData.voiceText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to get male voice
    const voices = speechSynthesis.getVoices();
    const maleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('male') || 
      voice.name.toLowerCase().includes('man')
    );
    
    if (maleVoices.length > 0) {
      utterance.voice = maleVoices[0];
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      startProgressTracking();
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      stopProgressTracking();
      
      if (currentSlide < FULL_PRESENTATION_SLIDES.length - 1) {
        setTimeout(() => {
          setCurrentSlide(prev => prev + 1);
        }, 800);
      } else {
        setIsPlaying(false);
      }
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      stopProgressTracking();
      setIsPlaying(false);
    };
    
    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const startProgressTracking = () => {
    const startTime = Date.now();
    const estimatedDuration = 8000; // 8 seconds per slide average
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
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

  // Render detailed slide visualization
  const renderDetailedSlide = () => {
    const visual = currentSlideData.visual;
    const slideNumber = currentSlide + 1;
    
    // Color themes for different slide types
    const colorThemes = {
      observation: 'from-blue-500 to-cyan-600',
      transition: 'from-purple-500 to-fuchsia-600',
      knowledge: 'from-green-500 to-emerald-600',
      understanding: 'from-yellow-500 to-amber-600',
      explanation: 'from-indigo-500 to-purple-600',
      necessity: 'from-red-500 to-pink-600',
      procedure: 'from-orange-500 to-red-600',
      'self-reflection': 'from-teal-500 to-cyan-600',
      comparison: 'from-violet-500 to-purple-600',
      'geometric-drawing': 'from-rose-500 to-pink-600',
      'geometry-labels': 'from-sky-500 to-blue-600',
      identification: 'from-emerald-500 to-green-600',
      'initial-view': 'from-gray-500 to-slate-600',
      distinction: 'from-lime-500 to-green-600',
      grouping: 'from-amber-500 to-yellow-600',
      'quantity-inquiry': 'from-cyan-500 to-blue-600',
      communication: 'from-fuchsia-500 to-purple-600',
      description: 'from-pink-500 to-rose-600',
      'pencil-demo': 'from-orange-500 to-amber-600',
      'remote-scenario': 'from-blue-500 to-indigo-600',
      'counting-process': 'from-green-500 to-emerald-600',
      etymology: 'from-purple-500 to-fuchsia-600',
      historical: 'from-amber-500 to-yellow-600',
      conclusion: 'from-gray-500 to-slate-600'
    };
    
    const colorClass = colorThemes[visual.type as keyof typeof colorThemes] || 'from-gray-500 to-gray-600';
    
    return (
      <div className={`text-center p-12 bg-gradient-to-br ${colorClass} rounded-3xl shadow-2xl border-4 border-white/30 backdrop-blur-sm`}>
        {/* Main visual element */}
        <div className="text-8xl mb-8 animate-pulse">
          {visual.elements[0]}
        </div>
        
        {/* Supporting elements grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {visual.elements.slice(1).map((element, index) => (
            <div 
              key={index} 
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 animate-bounce"
              style={{animationDelay: `${index * 0.3}s`}}
            >
              <div className="text-4xl">
                {element}
              </div>
            </div>
          ))}
        </div>
        
        {/* Detailed description */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6">
          <div className="text-white font-medium mb-3">Visual Details:</div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {visual.details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🎙️ {currentSlideData.title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-300">Slide {currentSlide + 1} of {FULL_PRESENTATION_SLIDES.length}</p>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isSpeaking 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                  {isSpeaking ? '🔊 Speaking' : '🔇 Paused'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-gray-300">
                24 Detailed Slides
              </div>
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
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* FULL SCREEN DETAILED SLIDE */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-white/20 overflow-hidden mb-8">
          <div className="p-16">
            {renderDetailedSlide()}
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

        {/* Controls */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-4 border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
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
                {isSpeaking ? 'Pause Presentation' : 'Start Presentation'}
              </button>
              
              <div className="text-center">
                <div className="text-gray-300 text-sm">Progress</div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(playbackProgress)}%
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentSlide(Math.min(FULL_PRESENTATION_SLIDES.length - 1, currentSlide + 1))}
              disabled={currentSlide === FULL_PRESENTATION_SLIDES.length - 1}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
            >
              {currentSlide === FULL_PRESENTATION_SLIDES.length - 1 ? 'Complete' : 'Next →'}
            </button>
          </div>
          
          {/* Slide Navigation */}
          <div className="mt-8 flex justify-center gap-2 flex-wrap max-h-32 overflow-y-auto">
            {FULL_PRESENTATION_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all transform hover:scale-125 ${
                  index === currentSlide 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg scale-125' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Status Panel */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📊</span>
            <h3 className="text-xl font-bold text-white">Presentation Status</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-cyan-400 font-bold text-2xl mb-1">{FULL_PRESENTATION_SLIDES.length}</div>
              <div className="text-gray-300 text-sm">Total Slides</div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-green-400 font-bold text-2xl mb-1">
                {Math.round(((currentSlide + 1) / FULL_PRESENTATION_SLIDES.length) * 100)}%
              </div>
              <div className="text-gray-300 text-sm">Completed</div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-purple-400 font-bold text-2xl mb-1">
                {isSpeaking ? '🔊' : '🔇'}
              </div>
              <div className="text-gray-300 text-sm">Voice Status</div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-amber-400 font-bold text-2xl mb-1">
                {FULL_PRESENTATION_SLIDES[currentSlide].visual.type.replace('-', ' ')}
              </div>
              <div className="text-gray-300 text-sm">Current Theme</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}