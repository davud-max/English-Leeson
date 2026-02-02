'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_26_SLIDES = [
  {
    id: 1,
    title: "",
    content: `> "Here is wisdom. Let him who has understanding calculate the number of the beast, for it is the number of a man: His number is six hundred and sixty-six."

These words from **Revelation** have frightened people for centuries. But what if we look at them through the **theory of abstraction**? This is not a curse, but a **formula of ascension**.`,
    emoji: "📖",
    duration: 26640
  },
  {
    id: 2,
    title: "",
    content: `All information from the external world comes to us through our **sensory organs**. For each type of stimulus, there is a corresponding organ.

> Hearing, vision, smell, taste, touch. And the sixth — sexual sensation.`,
    emoji: "🔍",
    duration: 20000
  },
  {
    id: 3,
    title: "",
    content: `Why the **"number of the beast"**? Six physical senses operating on the basis of instincts and reflexes—relentlessly and unambiguously, with the ruthlessness of a beast. In the first set of six, each sense is isolated, working independently. Each is directed inward and shows only what the beast's own body experiences. 

> As Augustine said: "Sensation is that through which the soul is informed of what the body experiences."`,
    emoji: "💡",
    duration: 34400
  },
  {
    id: 4,
    title: "",
    content: `This is the first six — **the number of the beast**.`,
    emoji: "📊",
    duration: 20000
  },
  {
    id: 5,
    title: "",
    content: `When humans gained the ability to **abstract**, they looked at this first set of six senses from an external perspective. They began to gradually abstract themselves from these senses. In doing so, they gained the possibility not to submit to them, but to **master them**.

> They unified all six senses under a single sign for one person to understand the feelings of another person.

This is how **physical love** was born.`,
    emoji: "🎯",
    duration: 32080
  },
  {
    id: 6,
    title: "",
    content: `This is the second six — the **human number**. Feelings are no longer isolated; they are united by love, directed outward — toward understanding the other. 

> Paraphrasing Augustine: ordinary, physical love is that through which the soul becomes aware of what another body experiences.`,
    emoji: "🧠",
    duration: 21280
  },
  {
    id: 7,
    title: "",
    content: `We can draw an analogy with numbers. The first six consists of six separate apples, a group of distinct units. The second six is the **digit 6**, where the units are indistinguishable, merged into a **symbol**.`,
    emoji: "✨",
    duration: 20000
  },
  {
    id: 8,
    title: "",
    content: `But Jesus brought a new Love. **Love with a capital L**. A Love in which the bestial, the physical is finally overcome through **complete abstraction from the sensual**. This is **divine love** — **Agape**. 

> That through which the soul becomes aware of what another soul experiences.`,
    emoji: "📝",
    duration: 20720
  },
  {
    id: 9,
    title: "",
    content: `This is the third **six** — a divine number. This is no longer a digit, but complete **abstraction** — the **number "six"**. It is impossible to visualize a number. Any attempt to visualize a number leads to the appearance of either its sign (digit) or a concrete quantity. 

> This is complete abstraction — like the Cheshire Cat's smile without the cat.`,
    emoji: "🌟",
    duration: 26960
  },
  {
    id: 10,
    title: "",
    content: `> "Here is wisdom. Let him who has understanding calculate the number of the beast, for it is a **human number** and it is a **divine number**; its number is **six hundred sixty-six**."

This reveals the complete interpretation.`,
    emoji: "🔮",
    duration: 20000
  },
  {
    id: 11,
    title: "",
    content: `Первая шесть — число зверя. Шесть обособленных чувств.
Вторая шесть — число человека. Чувства, объединённые любовью к другому телу.
Третья шесть — число Бога. Полное абстрагирование, любовь к душе.`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 12,
    title: "",
    content: `Это три ступени, лестница восхождения: от чувств зверя к любви человека, от любви человека — к любви божественной. Конец света — это не катастрофа. Свет был нужен для пути от первой шестерки к третьей. Когда цель достигнута, миссия света завершена. Человек будет существовать, пока души человеческие разделены физическим. Когда будет преодолено число человека и достигнута третья ступень — все души сольются воедино.`,
    emoji: "🔍",
    duration: 33280
  },
  {
    id: 13,
    title: "",
    content: `Этот путь от зверя к духу отражается и в истории человеческого общества. Первая глава Евангелия от Иоанна практически дословно повторяет первую главу Ветхого завета с точки зрения Теории Абстрагирования. Но между ними — огромный шаг. Шаг от буквы закона к духу закона.`,
    emoji: "💡",
    duration: 21440
  },
  {
    id: 14,
    title: "",
    content: `В обществе времён Иисуса работал закон, принесённый Моисеем. Все ходят под одним Богом, то есть под одним законом, и это делает людей равными перед законом. Система защиты прав, свобод и собственности принимает универсальный характер. Это даёт толчок в развитии экономики. Формируется рынок.`,
    emoji: "📊",
    duration: 23280
  },
  {
    id: 15,
    title: "",
    content: `Но заповеди были посланы через Моисея в виде скрижалей — это буква закона, единая для всех, данная извне. Новый завет говорит уже о духе закона. Это новое должно быть принесено новым пророком. Апостол Павел писал: «Он дал нам способность быть служителями Нового Завета, не буквы, но духа, потому что буква убивает, а дух животворит».`,
    emoji: "🎯",
    duration: 26640
  },
  {
    id: 16,
    title: "",
    content: `Если закон от Моисея, то новое принёс Иисус. И если достижение уровня Моисея отмечалось крещением водою, то новый уровень отмечается крещением Духом Святым. В Евангелии сказано: «На Кого увидишь Духа сходящего и пребывающего на Нем, Тот есть крестящий Духом Святым». Крещение водой — это уровень Моисея, признание внешнего закона. Крещение Духом — уровень Иисуса, внутреннее преображение, дух закона.`,
    emoji: "🧠",
    duration: 32000
  },
  {
    id: 17,
    title: "",
    content: `«Если кто не родится от воды и Духа, не может войти в Царствие Божие. Рожденное от плоти есть плоть, а рожденное от Духа есть дух». Здесь прямая связка с первой главой Ветхого завета. Человек должен выйти из воды, над которой витал Дух Божий. Сначала человек различает человека физического, потом — человека духовного. Новый завет как раз об этом говорит.`,
    emoji: "✨",
    duration: 28400
  },
  {
    id: 18,
    title: "",
    content: `Особый смысл приобретает Евхаристия — причастие плотью и кровью Христовой. «Если не будете есть Плоти Сына Человеческого и пить Крови Его, то не будете иметь в себе жизни». Хлеб — тело Христово — это символически первобытийная земля. Кровь — первобытийное небо. Они оба — первобытийная вода, над которой витал Дух Божий. Разделение воды на небо и землю произошло в человеке, в его сознании. Причащаясь, человек символически участвует в сотворении мира по воле Бога.`,
    emoji: "📝",
    duration: 37200
  },
  {
    id: 19,
    title: "",
    content: `«И от полноты Его все мы приняли и благодать на благодать, ибо закон дан чрез Моисея; благодать же и истина произошли чрез Иисуса Христа». Благодать — это безвозмездный дар, способность абстрагировать, уже вшитая в человека. Истина — это постижение триединства через священную троицу. Бога не видел никто никогда. Но Он постигается через понимание триединства: Бог есть Вода плюс Святой Дух.`,
    emoji: "🌟",
    duration: 31280
  },
  {
    id: 20,
    title: "",
    content: `Так мы видим два уровня человека. Уровень Моисея: Бог Един и Он вовне, над всеми людьми. Он — внешняя сила, давшая людям закон. Смерть — наказание, она страшит. Нужно принуждение к соблюдению заповедей. Человек — это тот, кто из своего народа соблюдает закон.`,
    emoji: "🔮",
    duration: 20720
  },
  {
    id: 21,
    title: "",
    content: `Уровень Иисуса: Бог един в каждом человеке. Он — внутренняя сила, дающая душу. Постигший это не нуждается во внешнем законе. Он не умеет нарушать заповеди. Смерть — возвращение души к Отцу. «Разве ты не веришь, что Я в Отце и Отец во Мне?» — говорит Иисус.`,
    emoji: "📖",
    duration: 20480
  },
  {
    id: 22,
    title: "",
    content: `Новый завет позволил расширить круг человеческого. «Нет уже Иудея, ни язычника; нет раба, ни свободного; нет мужеского пола, ни женского: ибо все вы одно во Христе Иисусе». Так возникает шестой человеческий уровень, где человек — это не только представитель своего народа, но представитель любого народа, открывающий в себе Бога.`,
    emoji: "🔍",
    duration: 26320
  },
  {
    id: 23,
    title: "",
    content: `В каждом есть Дух истины. Чтобы пробудить его, надо поверить и принять. Логикой и разумом это не принимается. Надо совершить прыжок веры, прыжок через бесконечность. И это будет переход на новый человеческий уровень — от второй шестёрки к третьей, от любви человеческой к любви божественной.`,
    emoji: "💡",
    duration: 23360
  }
];

export default function Lesson26Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_26_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson26/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(() => {
        setAudioError(true);
        const duration = LESSON_26_SLIDES[currentSlide].duration;
        timerRef.current = setTimeout(() => {
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, duration);
      });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, isPlaying, totalSlides]);

  useEffect(() => {
    if (!isPlaying || !audioError) return;
    
    const duration = LESSON_26_SLIDES[currentSlide].duration;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioError, currentSlide]);

  useEffect(() => {
    if (!isPlaying || audioError) return;
    
    const interval = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percent);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioError]);

  const handleAudioEnded = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const goToSlide = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentSlide(index);
    setProgress(0);
    if (isPlaying) setAudioError(false);
  };

  const currentSlideData = LESSON_26_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-stone-50">
      <audio ref={audioRef} onEnded={handleAudioEnded} onError={() => setAudioError(true)} />
      
      <header className="bg-stone-800 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">← Back to Course</Link>
            <div className="text-center">
              <h1 className="text-lg font-serif">Algorithms of Thinking and Cognition</h1>
              <p className="text-stone-400 text-sm">Lecture 26</p>
            </div>
            <div className="text-stone-400 text-sm">{currentSlide + 1} / {totalSlides}</div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{currentSlideData.emoji}</span>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">{currentSlideData.title}</h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
        </div>

        <article className="bg-white rounded-lg shadow-lg border border-stone-200 p-8 md:p-12 mb-8">
          <div className="prose prose-stone prose-lg max-w-none">
            <ReactMarkdown
              components={{
                p: ({children}) => <p className="text-stone-700 leading-relaxed mb-5 text-lg">{children}</p>,
                strong: ({children}) => <strong className="text-stone-900 font-semibold">{children}</strong>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-amber-700 pl-6 my-6 italic text-stone-600 bg-amber-50 py-4 pr-4 rounded-r">{children}</blockquote>,
              }}
            >
              {currentSlideData.content}
            </ReactMarkdown>
          </div>
        </article>

        <div className="bg-white rounded-lg shadow border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-500 font-medium">Slide Progress</span>
            <span className="text-sm text-stone-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-700 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-10">
          <button onClick={() => goToSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0} className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium">← Previous</button>
          <button onClick={togglePlay} className="px-8 py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition shadow-md">{isPlaying ? '⏸ Pause' : '▶ Play Lecture'}</button>
          <button onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))} disabled={currentSlide === totalSlides - 1} className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium">Next →</button>
        </div>

        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-lg p-6 mb-10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">🎤 Ready to Test Your Knowledge?</h3>
          <p className="text-amber-100 mb-4">Take a voice quiz with AI-generated questions</p>
          <button onClick={() => setShowQuiz(true)} className="px-8 py-3 bg-white text-amber-700 rounded-lg font-bold hover:bg-amber-50 transition shadow-md">Start Voice Quiz</button>
        </div>

        <div className="bg-white rounded-lg shadow border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Lecture Sections</h3>
          <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
            {LESSON_26_SLIDES.map((slide, index) => (
              <button key={slide.id} onClick={() => goToSlide(index)} className={`p-3 rounded text-sm font-medium transition ${index === currentSlide ? 'bg-amber-700 text-white' : index < currentSlide ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`} title={slide.title}>{index + 1}</button>
            ))}
          </div>
        </div>
      </main>

      {showQuiz && <VoiceQuiz lessonId={26} lessonTitle="THREE STEPS TO HEAVEN AND THE SIXTH LEVEL OF MAN" onClose={() => setShowQuiz(false)} />}

      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link href="/lessons/25" className="hover:text-white transition">← Lecture 25</Link>
            <span className="text-stone-500 text-sm font-serif">Lecture 26</span>
            <Link href="/lessons" className="hover:text-white transition">All Lessons →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
