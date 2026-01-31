'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import { 
  FingerCountingIllustration, 
  GroupingIllustration, 
  NumberSystemsIllustration 
} from '@/components/lesson2/InteractiveIllustrations'

const LESSON_2_SLIDES = [
  {
    id: 1,
    title: "🔢 From Term to Counting",
    content: "**You taught the child — and yourself — to observe, describe, build definitions and assign terms. What's next?**\n\nNext — we'll learn to count.\n\nOf course, you know how to count. But to teach this to the child, you need to understand-remember yourself what this means. And then — learn to explain it.\n\nBut first, there must be a need for counting. Otherwise it's hard to explain why spend time and effort on this procedure. Try to clearly explain to yourself how the need for counting arose. Then compare with what we'll cover now.",
    emoji: "🔢",
    illustration: "counting-intro",
    duration: 18000
  },
  {
    id: 2,
    title: "📦 Groups of Terms",
    content: "**So, where did we stop?** We had a drawing: circle, chords, radii, diameters.\n\nChild already knows what circle, chord, radius, diameter are. Now ask: are there identical terms in the drawing? At first it seems there are none. But then they distinguish: here are chords, here are segments, here are radii, here are points. Set of identical terms forms a group.\n\nAnd immediately new question arises — how many are in the group? How to convey information about quantity to another person? That is — how to describe quantity?",
    emoji: "📦",
    illustration: "term-groups",
    duration: 20000
  },
  {
    id: 3,
    title: "🧮 What is Counting?",
    content: "**Put three pencils on the table.** If person is nearby, you just point — and they see how many. But if you went outside and were asked: 'How many pencils were on the table?' — need to describe their quantity. And for this they need to be counted.\n\nIn word 'count' — 'co' is prefix, 'unt' is root. In old times word 'cheta' meant pair. That is, counted by pairs, by two. So many pairs. At first glance, nothing complicated. Everyone knows how to count. But is it really so?",
    emoji: "🧮",
    illustration: "what-is-counting",
    duration: 18000
  },
  {
    id: 4,
    title: "🎯 Counting Paradox",
    content: "**Put three pencils in front of child and ask to count them.** Most likely, they'll immediately say: 'Three.' But ask them to actually count. Count exactly these pencils.\n\nThey'll start, pointing finger at each: 'One, two, three.' As soon as they point at third pencil and say 'three,' lift this pencil and ask: 'How many is this?' They'll say: 'One.' But why just now they said it was 'three'?\n\nLet them count again. They'll start: 'One, two, three...' As soon as they point at second pencil and say 'two,' stop them. Lift this second pencil and ask: 'How many is this?' They'll say: 'One.' But why before they said it was 'two'?",
    emoji: "🎯",
    illustration: "counting-paradox",
    duration: 25000
  },
  {
    id: 5,
    title: "🧒 Patience in Learning",
    content: "**But remember how your baby learned to walk.** You didn't yell at them when nothing worked out. You helped again and again, comforting after each failure. And how you rejoiced at first independent step! You didn't hide this joy. And baby felt it, and strained to take another step... Let your child now be ten years old, fifteen... They — still the same baby. They still need your comfort and your joy for their success.",
    emoji: "🧒",
    illustration: "learning-patience",
    duration: 20000
  },
  {
    id: 6,
    title: "📘 Defining Counting",
    content: "**What is counting then?**\n\nShow one pencil and say: 'This is one pencil.' Ask: which word here is extra? Good if child guesses: word 'one.' 'Pencil' is already singular. Adding that it's one — unnecessary.\n\nNow lift three pencils and say: 'These are pencils.' Then lift five: 'And these are pencils.' But quantities in first and second cases — different. If we say 'pencils' (plural), then need to describe their quantity. Description of quantity is counting.",
    emoji: "📘",
    illustration: "defining-counting",
    duration: 22000
  },
  {
    id: 7,
    title: "📦 Groups and Quantities",
    content: "**But description of quantity of what and where?**\n\nTake three pencils, two pens and one marker. Ask: how many pencils here? Child answers: 'Three.' How many pens? 'Two.' How many markers? 'One.' How many items total? 'Six!'\n\nWhy each time different answers? Because spoke about different names: first — pencils, then — pens, then — markers, and finally — items.\n\nSet of identically named items is called group.\n\nUnification of identically named items — grouping.\n\nDescription of quantity of items in group — this is counting.",
    emoji: "📦",
    illustration: "groups-quantities",
    duration: 25000
  },
  {
    id: 8,
    title: "🔤 Numerals and Digits",
    content: "**Term denoting result of counting — numeral.**\nSymbol denoting numeral — digit.\n\nNeed to add: there are countable and uncountable groups. Uncountable — for example, stars in sky or leaves in forest. We say about them 'many,' but don't count individually.\n\nHow to describe quantity of units in countable group? Simplest way — counting on fingers.",
    emoji: "🔤",
    illustration: "numerals-digits",
    duration: 18000
  },
  {
    id: 9,
    title: "✋ Finger Counting Method",
    content: "**When your child was three years old, they knew how to count on fingers.** Check if they forgot how it's done. Put three pencils in front and ask to count them on fingers.\n\nThey'll probably start bending fingers and saying: 'One, two...' Stop them. They're counting fingers, but need to count pencils. They'll start pointing at pencils with finger, saying: 'One, two...' Stop again. They're counting with fingers, but need — on fingers.\n\nChild is confused. Remind: on fingers count those who don't know numerals yet. That is — silently. Put aside one pencil — bend one finger. Put aside another pencil — bend another finger. Until get group of fingers equal to countable group. This we demonstrate, saying: 'This many!'",
    emoji: "✋",
    illustration: "finger-counting",
    duration: 28000
  },
  {
    id: 10,
    title: "🧮 Traditional Systems",
    content: "**How many can count on fingers of one hand?** Five. Can more? Can. How?\n\nChild puzzled? Help. Hint: thumb marked phalanges of four remaining fingers. Resulting quantity was called dozen. Today this is twelve. 12 hours on clock face, 12 months in year... All from dozen.\n\nOn fingers of two hands? Child will say: twenty-four. That is, two dozens. But in old times could count on two hands up to five dozens. On one hand counted dozen, on other bent one finger. Another dozen — another finger... Five dozens called copeck. Today this quantity — sixty.",
    emoji: "🧮",
    illustration: "traditional-systems",
    duration: 25000
  },
  {
    id: 11,
    title: "六十 Sexagesimal System",
    content: "**In old times sexagesimal system was widespread.** It remained on clocks: 60 seconds — minute, 60 minutes — hour. Sixtieth part of whole was called copeck — from word 'cope'. Maybe that's why hundredth part of ruble is still called copeck.\n\nCan more than copeck? Can. Let child guess. If can't — hint: dozen counted on one hand, mark on second not whole finger, but phalanx. Get dozen dozens. This was called gross. Today this is 144. And there was dozen grosses — mass. This is 1728.",
    emoji: "六十",
    illustration: "sexagesimal-system",
    duration: 22000
  },
  {
    id: 12,
    title: "📏 Counting Sticks Method",
    content: "**But in school haven't counted on fingers for long.** Remember first grade. Counted with counting sticks. Notice: counted not sticks, but with sticks. How?\n\n'Children, picture has many birds. Count them. Count like this: one bird — put aside one stick. Another bird — put aside another stick. And so, until count all. Now — show how many birds total? Right, as many as you have sticks. Sticks you can take and show mom. And mom will know how many birds there were.'\n\nTo count — means to describe quantity of units in given group.",
    emoji: "📏",
    illustration: "counting-sticks",
    duration: 25000
  },
  {
    id: 13,
    title: "🧮 Advanced Counting Methods",
    content: "**But what if units very many?** Imagine: father sent son to count sheep in flock. And son brought whole bag of sticks... 3457 pieces. For this case first-grader's kit has sticks of different colors. Ten white sticks denote one red. Ten red — one blue. Ten blue — one black. So son should bring father only three black sticks, four blue, five red and seven white. Just need to remember colors...\n\nTrue, if on way dropped one black stick — mistaken by thousand sheep.\n\nAnd if make notches on board? Ten notches — one cross. Ten crosses... And here appear digits (Roman, for example) — symbols denoting quantity of identically named objects in group.",
    emoji: "🧮",
    illustration: "advanced-counting",
    duration: 28000
  },
  {
    id: 14,
    title: "🔢 Modern Numerals",
    content: "**Today for describing result of counting we use not sticks, but numerals.**\n\nNumerals — these are terms denoting quantity of units in groups.\n\nWithout term 'group' numeral has no meaning.\n\nNumerals can be denoted by symbols — digits.\n\nGroup and numeral can be represented. But number (as mathematical term) cannot be represented.\n\nTry to represent number 5. You won't succeed. Symbol '5' — this is not number, this is digit. Can write it as 'V'. If you represented five items — this is group of items, not number.\n\nBut you can perform operations on numbers, count with numbers, and result write with digits or numerals.",
    emoji: "🔢",
    illustration: "modern-numerals",
    duration: 25000
  },
  {
    id: 15,
    title: "🎯 Natural Numbers",
    content: "**Child first learns to group identically named items.** Then — distinguish groups by quantity. Then — memorizes names of quantities, numerals. For example, today learn to recognize groups of three items. On table three pencils — this is group. Find in room more groups of three. Right: three flowers in vase, three bogatyrs in picture, three chairs...\n\nNumbers describing quantity of units in group are called natural (natural). In nature we don't observe 'three and half sparrows' or 'minus six horses'. Natural numbers — these are all positive integers from one to infinity. Like Roman digits: all positive, integers, and no zero.\n\nAutomatic recognition of groups by quantity and memorizing numerals needs time and effort. Try quickly learn to count in German or Japanese. Not just recite numerals in order, but instantly answer how many items shown.\n\nSo main thing — don't rush. After all your baby already knows how to count. And to question 'How old are you?' — proudly shows three fingers.",
    emoji: "🎯",
    illustration: "natural-numbers",
    duration: 30000
  }
];

export default function Lesson2Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  // Calculate total lesson duration
  const totalDuration = LESSON_2_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  // Handle slide progression based on AUDIO (audio has priority)
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timer
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    // Load and play audio for current slide
    const audioFile = `/audio/lesson2/slide${currentSlide + 1}.mp3`;
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
      if (currentSlide < LESSON_2_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        // Lesson completed
        console.log("🎓 Lesson 2 completed!");
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
      totalTimeRef.current += LESSON_2_SLIDES[currentSlide].duration * progress;
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
    LESSON_2_SLIDES.slice(0, index).forEach(slide => {
      totalTimeRef.current += slide.duration;
    });
  };

  const nextSlide = () => {
    if (currentSlide < LESSON_2_SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const currentSlideData = LESSON_2_SLIDES[currentSlide];

  // Render visual illustration based on type
  const renderIllustration = (illustrationType: string) => {
    const illustrationMap: { [key: string]: JSX.Element } = {
      'counting-intro': (
        <div className="flex flex-col items-center space-y-4 animate-float">
          <div className="flex space-x-3">
            {[1, 2, 3].map(num => (
              <div key={num} className="text-5xl transform hover:scale-110 transition-transform duration-200 cursor-pointer">✏️</div>
            ))}
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3].map(num => (
              <div key={num} className="text-3xl animate-pulse" style={{animationDelay: `${num * 0.3}s`}}>👉</div>
            ))}
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Counting Introduction
          </div>
        </div>
      ),
      'term-groups': (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <div className="flex space-x-2 mb-2">
            <div className="text-2xl bg-blue-500/30 px-2 py-1 rounded">🔘</div>
            <div className="text-2xl bg-green-500/30 px-2 py-1 rounded">🔘</div>
            <div className="text-2xl bg-purple-500/30 px-2 py-1 rounded">🔘</div>
          </div>
          <div className="text-4xl">📦</div>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Term Groups
          </div>
        </div>
      ),
      'what-is-counting': (
        <div className="flex flex-col items-center space-y-4 animate-slideInLeft">
          <div className="text-6xl mb-2">🧮</div>
          <div className="flex space-x-4">
            {[1, 2, 3].map(num => (
              <div key={num} className="text-3xl bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center font-bold">
                {num}
              </div>
            ))}
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            What is Counting?
          </div>
        </div>
      ),
      'counting-paradox': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="text-5xl mb-2">🤯</div>
          <div className="flex space-x-3">
            <div className="text-3xl bg-red-500/30 px-3 py-1 rounded transform hover:scale-110 transition-transform">1️⃣</div>
            <div className="text-3xl bg-yellow-500/30 px-3 py-1 rounded transform hover:scale-110 transition-transform">2️⃣</div>
            <div className="text-3xl bg-green-500/30 px-3 py-1 rounded transform hover:scale-110 transition-transform">3️⃣</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Counting Paradox
          </div>
        </div>
      ),
      'learning-patience': (
        <div className="flex flex-col items-center space-y-3 animate-pulse-slow">
          <div className="text-5xl mb-2">🧒</div>
          <div className="flex space-x-2">
            <div className="text-2xl">😊</div>
            <div className="text-2xl animate-bounce">👏</div>
            <div className="text-2xl">🌟</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Learning Patience
          </div>
        </div>
      ),
      'defining-counting': (
        <div className="flex flex-col items-center space-y-3 animate-fadeInUp">
          <div className="text-5xl mb-2">📘</div>
          <div className="flex space-x-2">
            <div className="text-xl bg-white/20 px-2 py-1 rounded">ONE</div>
            <div className="text-xl bg-white/20 px-2 py-1 rounded">TWO</div>
            <div className="text-xl bg-white/20 px-2 py-1 rounded">THREE</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Defining Counting
          </div>
        </div>
      ),
      'groups-quantities': (
        <div className="flex flex-col items-center space-y-3 animate-slideInRight">
          <div className="text-5xl mb-2">📦</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-2xl bg-blue-500/30 w-8 h-8 rounded flex items-center justify-center">3️⃣</div>
            <div className="text-2xl bg-green-500/30 w-8 h-8 rounded flex items-center justify-center">2️⃣</div>
            <div className="text-2xl bg-purple-500/30 w-8 h-8 rounded flex items-center justify-center">1️⃣</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Groups & Quantities
          </div>
        </div>
      ),
      'numerals-digits': (
        <div className="flex flex-col items-center space-y-3 animate-float">
          <div className="text-5xl mb-2">🔤</div>
          <div className="flex space-x-1">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 w-8 h-8 rounded flex items-center justify-center">1</div>
            <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 w-8 h-8 rounded flex items-center justify-center">2</div>
            <div className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 w-8 h-8 rounded flex items-center justify-center">3</div>
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 w-8 h-8 rounded flex items-center justify-center">4</div>
            <div className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-500 w-8 h-8 rounded flex items-center justify-center">5</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Numerals & Digits
          </div>
        </div>
      ),
      'finger-counting': (
        <div className="flex flex-col items-center space-y-3 animate-pulse">
          <div className="text-5xl mb-2">✋</div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className="text-2xl transform hover:scale-110 transition-transform cursor-pointer">👆</div>
            ))}
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Finger Counting
          </div>
        </div>
      ),
      'traditional-systems': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="text-5xl mb-2">🧮</div>
          <div className="flex space-x-2">
            <div className="text-2xl bg-amber-500/30 px-2 py-1 rounded"> dozen </div>
            <div className="text-2xl bg-orange-500/30 px-2 py-1 rounded"> score </div>
            <div className="text-2xl bg-red-500/30 px-2 py-1 rounded"> gross </div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Traditional Systems
          </div>
        </div>
      ),
      'sexagesimal-system': (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <div className="text-5xl mb-2">六十</div>
          <div className="text-3xl">60</div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Sexagesimal System
          </div>
        </div>
      ),
      'counting-sticks': (
        <div className="flex flex-col items-center space-y-3 animate-slideInLeft">
          <div className="text-5xl mb-2">📏</div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className="text-xl">￨</div>
            ))}
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Counting Sticks
          </div>
        </div>
      ),
      'advanced-counting': (
        <div className="flex flex-col items-center space-y-3 animate-fadeInUp">
          <div className="text-5xl mb-2">🧮</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-lg bg-white/20 px-2 py-1 rounded">3457</div>
            <div className="text-lg bg-white/20 px-2 py-1 rounded">sticks</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Advanced Counting
          </div>
        </div>
      ),
      'modern-numerals': (
        <div className="flex flex-col items-center space-y-3 animate-pulse-slow">
          <div className="text-5xl mb-2">🔢</div>
          <div className="flex space-x-2">
            <div className="text-2xl font-bold text-blue-300">5</div>
            <div className="text-2xl font-bold text-green-300">V</div>
            <div className="text-2xl font-bold text-yellow-300">五</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Modern Numerals
          </div>
        </div>
      ),
      'natural-numbers': (
        <div className="flex flex-col items-center space-y-3 animate-float">
          <div className="text-5xl mb-2">🎯</div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className="text-xl font-bold transform hover:scale-125 transition-transform">{num}</div>
            ))}
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Natural Numbers
          </div>
        </div>
      ),
      'default': (
        <div className="flex flex-col items-center space-y-3">
          <div className="text-6xl mb-2">{currentSlideData.emoji}</div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            {illustrationType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
      )
    };

    return illustrationMap[illustrationType] || illustrationMap['default'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Animated Header */}
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-bold mb-2 transform hover:scale-105 transition-transform duration-300">
                {currentSlideData.title}
              </h1>
              <p className="text-green-100 animate-pulse">Slide {currentSlide + 1} of {LESSON_2_SLIDES.length}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-slideInRight">
                Progress: {Math.round(totalProgress * 100)}%
              </div>
              <Link 
                href="/lessons" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Back to Lessons
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Advanced Animations */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Enhanced Progress Bar */}
          <div className="mb-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-green-200 animate-fadeInUp">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-green-800">
                📈 Lesson Progress
              </span>
              <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                {Math.round(totalProgress * 100)}%
              </span>
            </div>
            <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-700 shadow-md"
                style={{ width: `${totalProgress * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Enhanced Slide Content */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-green-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            {/* Animated Slide Header */}
            <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 p-6 text-white animate-slideInDown">
              <div className="flex items-center gap-4">
                <span className="text-4xl transform hover:scale-125 transition-transform duration-300">{currentSlideData.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold transform hover:translate-x-2 transition-transform duration-300">{currentSlideData.title}</h1>
                  <p className="text-green-100 animate-pulse">Slide {currentSlide + 1} of {LESSON_2_SLIDES.length}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Slide Body */}
            <div className="p-8 animate-fadeIn">
              <div className="prose prose-lg max-w-none">
                <div className="space-y-4">
                  {currentSlideData.content.split('\n\n').map((paragraph, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-white to-green-50 p-4 rounded-xl border-l-4 border-green-400 hover:shadow-md transition-all duration-300 hover:translate-x-2 transform"
                    >
                      <ReactMarkdown className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Illustrations for Specific Slides */}
              {currentSlide === 6 && (
                <div className="mt-8">
                  <GroupingIllustration />
                </div>
              )}
              {currentSlide === 8 && (
                <div className="mt-8">
                  <FingerCountingIllustration />
                </div>
              )}
              {currentSlide === 10 && (
                <div className="mt-8">
                  <NumberSystemsIllustration />
                </div>
              )}
            </div>

            {/* Enhanced Controls with Animations */}
            <div className="bg-gradient-to-r from-gray-50 to-green-50 px-8 py-6 border-t border-green-200">
              <div className="flex items-center justify-between animate-fadeIn">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:from-gray-100 disabled:to-gray-200 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  ← Previous
                </button>

                <button
                  onClick={togglePlay}
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                  }`}
                >
                  <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
                  {isPlaying ? 'Pause' : 'Play'}
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === LESSON_2_SLIDES.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:from-gray-100 disabled:to-gray-200 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Next →
                </button>
              </div>

              {/* Enhanced Slide Navigation */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center animate-fadeInUp">
                {LESSON_2_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 shadow-md ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg scale-125' 
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Audio Element */}
          <audio ref={audioRef} />

          {/* Enhanced Navigation */}
          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 animate-fadeInUp">
            <Link 
              href="/lessons/1" 
              className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg border border-gray-200 hover:border-green-300"
            >
              ← Lesson 1
            </Link>
            
            <div className="flex gap-4">
              <Link 
                href="/checkout" 
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform"
              >
                🚀 Enroll to Continue
              </Link>
            </div>
            
            <Link 
              href="/lessons/3" 
              className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg border border-gray-200 hover:border-green-300"
            >
              Lesson 3 →
            </Link>
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 rounded-3xl p-10 text-white text-center shadow-2xl border border-green-300/50 animate-fadeInUp hover:shadow-3xl transition-all duration-500">
            <h2 className="text-3xl font-bold mb-4 transform hover:scale-105 transition-transform duration-300">
              🧠 Master Mathematical Thinking!
            </h2>
            <p className="text-green-100 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
              Continue learning with all 17 interactive lessons for just $30
            </p>
            <Link 
              href="/checkout" 
              className="inline-block bg-white text-green-600 hover:bg-gradient-to-r hover:from-white hover:to-green-50 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-3xl transform border-2 border-white"
            >
              🚀 Enroll Now - $30
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
