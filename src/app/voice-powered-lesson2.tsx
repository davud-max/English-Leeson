// Voice-Powered Lesson 2 with Real Audio Synthesis
// Integrated Google Cloud TTS for synchronized voice narration

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'

// Voice narration content for each slide
const VOICE_CONTENT = [
  {
    id: 1,
    title: "From Terms to Counting",
    text: `You taught the child — and yourself — to observe, describe, build definitions and assign terms. What's next?

Next — we'll learn to count.

Of course, you know how to count. But to teach this to the child, you need to understand-remember yourself what this means. And then — learn to explain it.

But first, there must be a need for counting. Otherwise it's hard to explain why spend time and effort on this procedure. Try to clearly explain to yourself how the need for counting arose. Then compare with what we'll cover now.`
  },
  {
    id: 2,
    title: "Identifying Term Groups",
    text: `So, where did we stop? We had a drawing: circle, chords, radii, diameters.

Child already knows what circle, chord, radius, diameter are. Now ask: are there identical terms in the drawing? At first it seems there are none. But then they distinguish: here are chords, here are segments, here are radii, here are points. Set of identical terms forms a group.

And immediately new question arises — how many are in the group? How to convey information about quantity to another person? That is — how to describe quantity?`
  },
  {
    id: 3,
    title: "Understanding Counting",
    text: `Put three pencils on the table. If person is nearby, you just point — and they see how many. But if you went outside and were asked: 'How many pencils were on the table?' — need to describe their quantity. And for this they need to be counted.

In word 'count' — 'co' is prefix, 'unt' is root. In old times word 'cheta' meant pair. That is, counted by pairs, by two. So many pairs. At first glance, nothing complicated. Everyone knows how to count. But is it really so?`
  },
  {
    id: 4,
    title: "The Counting Paradox",
    text: `Put three pencils in front of child and ask to count them. Most likely, they'll immediately say: 'Three.' But ask them to actually count. Count exactly these pencils.

They'll start, pointing finger at each: 'One, two, three.' As soon as they point at third pencil and say 'three,' lift this pencil and ask: 'How many is this?' They'll say: 'One.' But why just now they said it was 'three'?

Let them count again. They'll start: 'One, two, three...' As soon as they point at second pencil and say 'two,' stop them. Lift this second pencil and ask: 'How many is this?' They'll say: 'One.' But why before they said it was 'two'?`
  },
  {
    id: 5,
    title: "Learning Requires Patience",
    text: `But remember how your baby learned to walk. You didn't yell at them when nothing worked out. You helped again and again, comforting after each failure. And how you rejoiced at first independent step! You didn't hide this joy. And baby felt it, and strained to take another step...

Let your child now be ten years old, fifteen... They — still the same baby. They still need your comfort and your joy for their success.`
  },
  {
    id: 6,
    title: "Defining the Counting Process",
    text: `What is counting then?

Show one pencil and say: 'This is one pencil.' Ask: which word here is extra? Good if child guesses: word 'one.' 'Pencil' is already singular. Adding that it's one — unnecessary.

Now lift three pencils and say: 'These are pencils.' Then lift five: 'And these are pencils.' But quantities in first and second cases — different. If we say 'pencils' (plural), then need to describe their quantity. Description of quantity is counting.`
  },
  {
    id: 7,
    title: "Groups and Their Quantities",
    text: `But description of quantity of what and where?

Take three pencils, two pens and one marker. Ask: how many pencils here? Child answers: 'Three.' How many pens? 'Two.' How many markers? 'One.' How many items total? 'Six!'

Why each time different answers? Because spoke about different names: first — pencils, then — pens, then — markers, and finally — items.

Set of identically named items is called group.

Unification of identically named items — grouping.

Description of quantity of items in group — this is counting.`
  },
  {
    id: 8,
    title: "Numerals and Digits Defined",
    text: `Term denoting result of counting — numeral.

Symbol denoting numeral — digit.

Need to add: there are countable and uncountable groups. Uncountable — for example, stars in sky or leaves in forest. We say about them 'many,' but don't count individually.

How to describe quantity of units in countable group? Simplest way — counting on fingers.`
  },
  {
    id: 9,
    title: "Finger Counting Method",
    text: `When your child was three years old, they knew how to count on fingers. Check if they forgot how it's done. Put three pencils in front and ask to count them on fingers.

They'll probably start bending fingers and saying: 'One, two...' Stop them. They're counting fingers, but need to count pencils. They'll start pointing at pencils with finger, saying: 'One, two...' Stop again. They're counting with fingers, but need — on fingers.

Child is confused. Remind: on fingers count those who don't know numerals yet. That is — silently. Put aside one pencil — bend one finger. Put aside another pencil — bend another finger. Until get group of fingers equal to countable group. This we demonstrate, saying: 'This many!'`
  },
  {
    id: 10,
    title: "Traditional Counting Systems",
    text: `How many can count on fingers of one hand? Five. Can more? Can. How?

Child puzzled? Help. Hint: thumb marked phalanges of four remaining fingers. Resulting quantity was called dozen. Today this is twelve. 12 hours on clock face, 12 months in year... All from dozen.

On fingers of two hands? Child will say: twenty-four. That is, two dozens. But in old times could count on two hands up to five dozens. On one hand counted dozen, on other bent one finger. Another dozen — another finger... Five dozens called copeck. Today this quantity — sixty.`
  },
  {
    id: 11,
    title: "Sexagesimal System Legacy",
    text: `In old times sexagesimal system was widespread. It remained on clocks: 60 seconds — minute, 60 minutes — hour. Sixtieth part of whole was called copeck — from word 'cope'. Maybe that's why hundredth part of ruble is still called copeck.

Can more than copeck? Can. Let child guess. If can't — hint: dozen counted on one hand, mark on second not whole finger, but phalanx. Get dozen dozens. This was called gross. Today this is 144. And there was dozen grosses — mass. This is 1728.`
  },
  {
    id: 12,
    title: "Counting Sticks Technique",
    text: `But in school haven't counted on fingers for long. Remember first grade. Counted with counting sticks. Notice: counted not sticks, but with sticks. How?

'Children, picture has many birds. Count them. Count like this: one bird — put aside one stick. Another bird — put aside another stick. And so, until count all. Now — show how many birds total? Right, as many as you have sticks. Sticks you can take and show mom. And mom will know how many birds there were.'

To count — means to describe quantity of units in given group.`
  }
];

export default function VoicePoweredLesson2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentSlideData = VOICE_CONTENT[currentSlide];

  // Generate audio using Google Cloud TTS
  const generateAudio = async (text: string) => {
    setIsLoadingAudio(true);
    try {
      const response = await axios.post('/api/tts/generate', {
        text: text,
        languageCode: 'en-US',
        voiceName: 'en-US-Neural2-D', // Male voice
        ssmlGender: 'MALE'
      });
      
      setAudioUrl(response.data.audioUrl);
      return response.data.audioUrl;
    } catch (error) {
      console.error('Failed to generate audio:', error);
      // Fallback to placeholder
      setAudioUrl(null);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Handle slide change with audio generation
  useEffect(() => {
    if (isPlaying) {
      // Generate audio for current slide
      generateAudio(currentSlideData.text);
    }
    
    // Reset progress when slide changes
    setPlaybackProgress(0);
    
    // Clear any existing progress interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  }, [currentSlide, isPlaying]);

  // Handle audio playback and progress tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      // Start progress tracking
      progressIntervalRef.current = setInterval(() => {
        if (audio.duration > 0) {
          setPlaybackProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 100);
    };

    const handleEnded = () => {
      // Move to next slide when audio ends
      if (currentSlide < VOICE_CONTENT.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      console.error('Audio playback error');
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentSlide]);

  // Play/pause audio
  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // If no audio URL, generate it first
      if (!audioUrl) {
        const url = await generateAudio(currentSlideData.text);
        if (url) {
          audio.src = url;
        }
      }
      
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
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
      'from-indigo-500 to-blue-600',
      'from-purple-500 to-fuchsia-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-green-600',
      'from-amber-500 to-yellow-600',
      'from-rose-500 to-red-600',
      'from-violet-500 to-purple-600',
      'from-sky-500 to-cyan-600'
    ];
    
    const colorClass = colors[currentSlide % colors.length];
    
    return (
      <div className={`text-center p-16 bg-gradient-to-br ${colorClass} rounded-3xl shadow-2xl border-4 border-white/30 backdrop-blur-sm`}>
        <div className="text-9xl mb-12 animate-pulse">
          {['🔢', '📦', '🧮', '🎯', '🧒', '📘', '📦', '🔤', '✋', '🧮', '六十', '📏'][currentSlide]}
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
              <div className="text-5xl">
                {['1️⃣', '2️⃣', '3️⃣', '🔵', '🟢', '🟣', '✏️', '🖊️', '🖍️', '5️⃣', '12️⃣', '￨'][currentSlide]}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-7xl animate-spin">
          {['👉', '📦', '🔢', '❓', '😊', '📖', '묶음', 'V', '👆', '12️⃣', '60️⃣', '🐦'][currentSlide]}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Audio element (hidden) */}
      <audio ref={audioRef} className="hidden" />
      
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🎙️ {currentSlideData.title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-300">Slide {currentSlide + 1} of {VOICE_CONTENT.length}</p>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  isPlaying 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {isPlaying ? '🔊 Playing' : '🔇 Paused'}
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
                disabled={isLoadingAudio}
                className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-xl ${
                  isLoadingAudio
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white cursor-not-allowed'
                    : isPlaying 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                }`}
              >
                <span className="text-3xl">
                  {isLoadingAudio ? '⏳' : isPlaying ? '⏸️' : '▶️'}
                </span>
                {isLoadingAudio ? 'Generating Audio...' : isPlaying ? 'Pause Voice' : 'Play Voice'}
              </button>
              
              <div className="text-center">
                <div className="text-gray-300 text-sm">Progress</div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(playbackProgress)}%
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentSlide(Math.min(VOICE_CONTENT.length - 1, currentSlide + 1))}
              disabled={currentSlide === VOICE_CONTENT.length - 1}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
            >
              {currentSlide === VOICE_CONTENT.length - 1 ? 'Complete' : 'Next →'}
            </button>
          </div>
          
          {/* Slide Navigation */}
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            {VOICE_CONTENT.map((_, index) => (
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
              <div className="text-green-400 font-bold mb-2">🔊 Audio Engine</div>
              <div className="text-gray-300 text-sm">Google Cloud TTS Integration</div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-blue-400 font-bold mb-2">🎭 Voice Profile</div>
              <div className="text-gray-300 text-sm">Male Voice (en-US-Neural2-D)</div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-purple-400 font-bold mb-2">⚡ Synchronization</div>
              <div className="text-gray-300 text-sm">Real-time playback tracking</div>
            </div>
          </div>
          
          {isLoadingAudio && (
            <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-yellow-300">Generating voice audio for current slide...</span>
              </div>
            </div>
          )}
          
          {audioUrl && !isLoadingAudio && (
            <div className="mt-4 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-green-300">Audio ready for playback</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}