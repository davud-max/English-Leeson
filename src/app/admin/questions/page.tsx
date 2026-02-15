'use client'

import { useState } from 'react'
import Link from 'next/link'

// Lesson data for generating questions
const LESSONS = [
  { id: 1, title: 'Introduction to Thinking', content: `Welcome to the course on Algorithms of Thinking and Cognition. This course explores how we think, perceive reality, and make decisions. We'll examine fundamental concepts like observation, abstraction, and the nature of knowledge itself. The goal is not just to learn about thinking, but to develop practical skills that help you think more effectively. We'll start with basic questions: What does it mean to observe? How do we create definitions? What is the relationship between words and reality? Throughout this course, we'll challenge common assumptions and explore the deep structures underlying human cognition.` },
  { id: 2, title: 'Observation and Perception', content: `Observation is the foundation of all knowledge. But what does it mean to observe? Animals see the world, but only humans truly observe - that is, consciously separate phenomena from the continuous flow of existence. Observation requires attention, distinction, and the ability to hold something in awareness. The process of observation immediately creates abstractions - we cannot observe everything at once, so we must select what matters. This selection is not passive but active - we construct what we see through the lens of our existing concepts. The relationship between raw sensory data and conscious perception is more complex than it appears. Understanding observation means understanding how we create our experienced reality.` },
  { id: 3, title: 'The Fair and the Coin', content: `Economic concepts often obscure the human origins of money, markets, and trade. Let's reconstruct this history from first principles. In primitive societies, resources belonged to clan chiefs. Interaction between groups occurred through gift exchange. As valuable goods moved along chains of exchange, specialized merchant groups emerged to seek them directly. Where caravan routes intersected, temporary camps became seasonal fairs. Fairs developed formal exchange rules independent of tribal customs - the birth of markets. To track daily market rent, merchants received tokens as proof of payment. These tokens evolved from leather tags to metal coins bearing the owner's seal - the birth of money. The treasury that issued coins became the first bank. Understanding this evolution reveals the abstract nature of money itself.` },
  { id: 4, title: 'Terms and Definitions', content: `All knowledge begins with definition. A definition is the shortest possible description of something. We assign terms to definitions to create shared language. But here we encounter a paradox: to define something, we need words, but words themselves need definitions, creating an infinite regress. The solution: fundamental terms that cannot be defined but only understood directly. These include geometric concepts like point, line, plane, space - pure abstractions with no physical referent. We also distinguish between names (for real objects that can be shown) and terms (for abstract objects that can only be described). Understanding this distinction is crucial: real objects have infinite complexity and cannot be fully described, while abstract objects exist completely in their definitions.` },
  { id: 5, title: 'Numbers and Counting', content: `What is a number? This seemingly simple question reveals deep complexity. Numbers are pure abstractions - you cannot see, touch, or show the number five itself. You can show five objects, but not 'fiveness'. Counting emerged from the need to describe quantity without listing every element. A numeral is the term for a counting result. A digit is the symbol representing that numeral. The number itself exists only as a concept. This abstraction enables mathematics - operations on numbers follow logical rules independent of what is being counted. Understanding numbers as pure abstractions, not properties of physical objects, is essential for grasping higher mathematics and the nature of formal systems.` },
  { id: 6, title: 'Conditional Reflexes and Behavior', content: `Pavlov's experiments revealed a fundamental mechanism of learning: conditional reflexes. An unconditioned stimulus (food) produces an unconditioned response (salivation) automatically. When paired repeatedly with a neutral stimulus (bell), the neutral stimulus becomes a conditioned stimulus that triggers the same response even without food. This mechanism extends beyond simple reflexes to complex human behavior. Much of what we consider conscious choice is actually conditioned response. Our emotional reactions, preferences, and habits form through similar conditioning processes. Understanding these mechanisms doesn't eliminate free will but reveals its boundaries. The question becomes: can we recondition ourselves deliberately? Can awareness of conditioning create space for genuine choice? This is the bridge between mechanical behavior and conscious development.` },
  { id: 7, title: 'The Fair and the Coin', content: `From simple exchange of gifts between tribes, money, markets, and banking systems emerged. In closed societies, trade did not exist - resources belonged to chiefs. Between neighboring communities, interaction occurred through mutual gifts. The uniqueness of some goods prompted sending special groups to search for them - merchants and caravans were born. Where caravan routes intersected, seasonal fairs appeared. Fairs developed formal rules independent of tribal customs. The largest fairs attracted international merchants, forming unified exchange rules. Land at intersections was rented for markets, calculated daily. To track payments, merchants received tokens certifying payment - these evolved into coins. Special treasuries issued coins and collected them back daily. Coins gradually became payment means between merchants. The treasury evolved from simple storage into a profit-generating institution - the first bank. Cast coins were replaced by minted coins to prevent forgery. Good money drove out bad money. Banking networks emerged as coin owners expanded operations across multiple markets. Two concepts - bank and coin - radically changed the exchange system, enabling markets, retail trade, currency exchange, and credit.` },
  { id: 8, title: 'Theory of Cognitive Resonance', content: `Today we will talk about what happens at the very moment when a thought "comes" to you. Not when you build it brick by brick, but when it arrives suddenly, like an illumination. Theory of Cognitive Resonance is a model that places at the center not neurons, but you yourself, your unique "I", your feelings and capacity for discovery. This theory explains the selective mechanism of consciousness — why some thoughts become ours, while others pass by unnoticed. Our consciousness consists of two interconnected but fundamentally different circuits: Analog Circuit — World of immediate, bodily, sensory experience like taste of an apple, pain from a burn, warmth of the sun. Digital Circuit — World of abstractions, signs, concepts like the word "apple", medical terminology, temperature in degrees. Thinking is not the work of one circuit. It is a process of resonant dialogue between them. The digital system asks questions, while the analog votes with the resource of attention and emotional energy.` },
  { id: 9, title: 'Sacred Text and Reality', content: `In the beginning God created the heaven and the earth. The concepts of heaven and earth are foundational for the first chapters of the Bible. Heaven and earth are abstract concepts denoting, respectively, the observable and the unobservable. In modern vocabulary, the concepts closest in meaning to heaven and earth are Nothing and the World. The earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters. Water represents Being - boundless, formless, indistinguishable. The Spirit of God belongs neither to heaven nor to earth. Water and the Holy Spirit together are conditionally God. And God said, Let there be light: and there was light. The ability to abstract is the light — that through which man distinguishes, observes. To observe means to distinguish the boundaries between the observable (World) and the unobservable (Nothing).` },
  { id: 10, title: 'How Thought Finds Us', content: `We have traveled a tremendous path together. We have examined what a definition is, what a number is, a formula, a law, a sacred description. But the most personal question remains: how exactly do I do this? How is a thought born in my head? Our brain is a supercomputer with trillions of operations per second. How do I manage to choose that very one, the needed thought? Let us imagine that I is not the author of thoughts, but their radio receiver. When the circuit's frequency matches the frequency of one of the stations — resonance occurs. In this model, we do not compose thoughts. We catch them. Memory is not a warehouse of pictures. It is preserved patterns of frequencies. To remember means to tune your heterodyne to the frequency of the preserved pattern and obtain resonance.` },
  { id: 11, title: 'The Number 666', content: `Now before us lies the final riddle — the number of the Beast, 666. The key word is "count" — calculate, derive, understand the algorithm. Six is the number of the fullness of physical perception. Five senses plus a sixth — the sense of bodily attraction, of instinct. The first six is a world ruled by six isolated senses - the kingdom of the Beast. Then Light appears — the ability to abstract. Man looks at his six senses from the outside. He begins to unite them with Love. The second six is the Human number. Six senses unite in the phenomenon of human love. The third six is the Divine number - Divine Love (Agape), connecting souls directly, bypassing the mediation of the senses. Six hundred sixty-six is not one number. It is a formula: six-one, six-two, six-three. A three-step path of ascent.` },
  { id: 12, title: 'Three Steps to Heaven', content: `Here is wisdom. Let him who has understanding count the number of the beast. In our case - calculate means to understand the algorithm. Physical existence level: perception through six senses, world of reactions, no self-awareness. Human level: emergence of abstract thinking, ability to see oneself from outside, love as new organizing principle. Divine level: pure spiritual connection, souls merge in Agape love. The path from beast to human to divine is not about external changes but internal transformation. Each level includes and transcends the previous one. The "end of light" is not a catastrophe but the completion of its mission - when all souls unite with God.` },
  { id: 13, title: 'The Sixth Human Level', content: `In the beginning was the Word, and the Word was with God, and the Word was God. The Word (Logos) is the principle of distinction, the ability to draw boundaries. Genesis tells of six days of creation - six levels of distinction. Day 1: Light separates from darkness (first distinction). Day 2: Waters above from waters below (firmament). Day 3: Land from sea, plants. Day 4: Heavenly bodies. Day 5: Fish and birds. Day 6: Animals and humans. The sixth level is the human level - the level where consciousness can observe itself. Man is created in God's image because man has the ability to distinguish, to name, to create through language. The Sabbath (seventh day) represents the completion of creation through distinction.` },
  { id: 14, title: 'How Consciousness Creates', content: `We began with something simple: "Describe what you see." But we encountered a fundamental paradox: To describe something, you need words. But words are terms. And terms require definitions. Which brings us back to needing to describe... A closed circle. Only one thing can break this cycle — the act of primary distinction. Imagine absolute darkness — not physical darkness, but meaningful darkness. No "here" or "there", no "self" or "other". This is what ancient texts call "water" — homogeneous, indistinguishable Being. Biblical formulation: "And God said: let there be light. And there was light." God didn't "create" light in the usual sense. He named it. Light = The first operation of distinction. The world is born only after acts of distinction. God didn't "create" the world like a craftsman makes furniture. The world "appeared" when an Observer capable of distinction emerged.` },
  { id: 15, title: 'A Theory of Everything', content: `Today we embark on a journey through a single audacious idea: Minus-Space. What exists beyond the Big Bang? Not emptiness—emptiness is already space. Something more fundamental. Our space is three-dimensional. A point has zero dimensions. But beyond this point, there isn't even the possibility for extension. This is not zero. This is less than zero. We call this state Minus-Space. If there is no extension in Minus-Space, then movement is instantaneous. A particle disappears and immediately appears somewhere else—it dove into Minus-Space where there is no "here" and "there." Space at the Planck scale is discrete—like pixels. What exists between the pixels? Minus-Space again—the invisible framework, the seam of reality. Black holes may be doors to Minus-Space. Resonance tubes connect particles through Minus-Space, explaining gravity, electromagnetism, and other forces as different types of resonance. Dark matter may be matter whose resonant profile is immersed in Minus-Space. Dark energy might be the background pressure of Minus-Space itself.` },
  { id: 21, title: 'Observation, Terms and Counting', content: `Everything begins with observation. But to observe is not simply to see. An animal sees, but does not observe. Only humans know how to observe. Observation is the artificial separation of a part from unified existence. Observed phenomena must be described in words. The shortest description is the definition. A term is assigned to the definition. But there are fundamental terms with no definitions - like point (zero-dimensional), line (one-dimensional), plane (two-dimensional), space (three-dimensional). These are ultimate concepts existing only in the mind as pure abstraction. An abstract object can be described completely. A real object cannot - it has infinite details. A word for a real object is a name (can be shown). A word for an abstract object is a term (cannot be shown but can be described completely). A set of identical terms forms a group. Counting describes the quantity of objects in a group. Numeral is the term for counting result. Digit is the symbol representing a numeral. The number five itself is pure abstraction - impossible to visualize.` },
]

interface Question {
  id: number
  question: string
  correct_answer: string
  difficulty: string
  points: number
}

interface AudioResult {
  question: number
  filename: string
  success: boolean
  size?: number
  audioBase64?: string
  audioUrl?: string
  error?: string
}

export default function AdminQuestionsPage() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [count, setCount] = useState(5)
  const [difficulty, setDifficulty] = useState('mixed')
  const [adminKey, setAdminKey] = useState('')
  const [voiceId] = useState('erDx71FK2teMZ7g6khzw') // New Voice (fixed)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; questions?: Question[] } | null>(null)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioResults, setAudioResults] = useState<AudioResult[]>([])
  const [audioMessage, setAudioMessage] = useState<string | null>(null)
  const [isSavingToRepo, setIsSavingToRepo] = useState(false)
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 })
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const generateQuestions = async () => {
    if (!selectedLesson || !adminKey) {
      alert('Please select a lesson and enter admin key')
      return
    }

    const lesson = LESSONS.find(l => l.id === selectedLesson)
    if (!lesson) return

    setIsGenerating(true)
    setResult(null)
    setAudioResults([])
    setAudioMessage(null)
    setSaveMessage(null)

    try {
      const response = await fetch('/api/admin/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson,
          lessonTitle: lesson.title,
          lessonContent: lesson.content,
          count,
          difficulty,
          adminKey,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult({
          success: true,
          message: data.message,
          questions: data.questions,
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to generate questions',
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Connection error: ' + (error instanceof Error ? error.message : 'Unknown'),
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate audio for questions
  const generateAudioNow = async () => {
    if (!selectedLesson || !adminKey || !result?.questions) {
      alert('Please generate questions first')
      return
    }

    setIsGeneratingAudio(true)
    setAudioResults([])
    setAudioMessage(null)
    setSaveMessage(null)

    try {
      const response = await fetch('/api/admin/generate-question-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson,
          questions: result.questions,
          adminKey,
          voiceId,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setAudioResults(data.results || [])
        setAudioMessage(data.message)
      } else {
        setAudioMessage('❌ ' + (data.error || 'Failed to generate audio'))
      }
    } catch (error) {
      setAudioMessage('❌ Connection error: ' + (error instanceof Error ? error.message : 'Unknown'))
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  // Save audio to GitHub repository
  const saveToRepository = async () => {
    if (!selectedLesson || !adminKey) {
      alert('Missing lesson or admin key')
      return
    }

    const successfulAudios = audioResults.filter(r => r.success && r.audioBase64)
    if (successfulAudios.length === 0) {
      alert('No audio to save. Generate audio first.')
      return
    }

    setIsSavingToRepo(true)
    setSaveProgress({ current: 0, total: successfulAudios.length + 1 })
    setSaveMessage(null)

    try {
      // Step 1: Delete old audio files
      setSaveProgress({ current: 0, total: successfulAudios.length + 1 })
      
      const clearRes = await fetch('/api/admin/clear-question-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonNumber: selectedLesson, adminKey }),
      })

      if (!clearRes.ok) {
        const errorData = await clearRes.json()
        throw new Error(`Failed to clear old files: ${errorData.error}`)
      }

      const clearData = await clearRes.json()
      console.log(`Deleted ${clearData.deleted} old question audio files`)

      // Step 2: Upload new audio files
      let uploadedCount = 0
      for (let i = 0; i < successfulAudios.length; i++) {
        const audio = successfulAudios[i]
        setSaveProgress({ current: i + 1, total: successfulAudios.length })

        try {
          const uploadRes = await fetch('/api/admin/upload-question-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonNumber: selectedLesson,
              questionNumber: audio.question,
              audioBase64: audio.audioBase64,
              adminKey,
            }),
          })

          if (uploadRes.ok) {
            uploadedCount++
          } else {
            const errorData = await uploadRes.json()
            console.error(`Failed to upload question ${audio.question}:`, errorData.error)
          }

          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (e) {
          console.error(`Error uploading question ${audio.question}:`, e)
        }
      }

      // Step 3: Trigger Railway redeploy
      try {
        const deployRes = await fetch('/api/admin/trigger-deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminKey }),
        });
        
        if (deployRes.ok) {
          setSaveMessage(`✅ Saved ${uploadedCount} audio files! 🚀 Railway deploy started automatically.`);
        } else {
          setSaveMessage(`✅ Saved ${uploadedCount} audio files! ⚠️ Auto-deploy failed. Run git pull && git push manually.`);
        }
      } catch (deployErr) {
        console.error('Deploy trigger failed:', deployErr);
        setSaveMessage(`✅ Saved ${uploadedCount} audio files! ⚠️ Auto-deploy unavailable. Run git pull && git push manually.`);
      }
    } catch (error) {
      setSaveMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown'))
    } finally {
      setIsSavingToRepo(false)
    }
  }

  // Download single audio
  const downloadAudio = (audioUrl: string, filename: string) => {
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const successfulAudioCount = audioResults.filter(r => r.success).length
  const canSaveToRepo = selectedLesson && successfulAudioCount > 0 && !isGeneratingAudio && !isSavingToRepo

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl shadow-lg p-8 border border-slate-700">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">🎓 Quiz Questions Generator</h1>
            <Link href="/admin" className="text-purple-400 hover:text-purple-300">
              ← Back to Admin
            </Link>
          </div>

          <div className="space-y-6">
            {/* Admin Key */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin Secret Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key..."
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Lesson Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Lesson
              </label>
              <select
                value={selectedLesson || ''}
                onChange={(e) => setSelectedLesson(Number(e.target.value))}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">-- Select a lesson --</option>
                {LESSONS.map(lesson => (
                  <option key={lesson.id} value={lesson.id}>
                    Lesson {lesson.id}: {lesson.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Questions
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {[3, 5, 7, 10].map(n => (
                    <option key={n} value={n}>{n} questions</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="mixed">Mixed</option>
                  <option value="easy">Easy Only</option>
                  <option value="hard">Hard Only</option>
                </select>
              </div>
            </div>

            {/* Generate Questions Button */}
            <button
              onClick={generateQuestions}
              disabled={isGenerating || !selectedLesson || !adminKey}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? '🔄 Generating with Claude AI...' : '✨ Generate Questions'}
            </button>

            {/* Questions Result */}
            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
                <p className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? '✅ ' : '❌ '}{result.message}
                </p>
                
                {result.questions && (
                  <div className="mt-4 space-y-3">
                    {result.questions.map((q, i) => (
                      <div key={i} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                        <p className="font-medium text-white">Q{i + 1}: {q.question}</p>
                        <p className="text-sm text-slate-400 mt-1">Answer: {q.correct_answer}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {q.difficulty === 'hard' ? '🔥 Hard' : '📗 Easy'} • {q.points} points
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audio Generation Section */}
            {result?.success && result.questions && (
              <div className="border-t border-slate-700 pt-6 space-y-4">
                <h3 className="text-xl font-bold text-white">🎙️ Audio Generation</h3>
                
                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Voice for Audio Generation
                  </label>
                  <select
                    value={voiceId}
                    disabled
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="erDx71FK2teMZ7g6khzw">New Voice (default)</option>
                  </select>
                </div>

                {/* Generate Audio Button */}
                <button
                  onClick={generateAudioNow}
                  disabled={isGeneratingAudio}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingAudio ? '⏳ Generating Audio...' : '🎤 Generate Audio for Questions'}
                </button>

                {/* Audio Message */}
                {audioMessage && (
                  <p className={`text-center ${audioMessage.startsWith('❌') ? 'text-red-400' : 'text-green-400'}`}>
                    {audioMessage}
                  </p>
                )}

                {/* Audio Results */}
                {audioResults.length > 0 && (
                  <div className="space-y-2">
                    {audioResults.map((r, i) => (
                      <div key={i} className={`p-3 rounded-lg flex items-center justify-between ${
                        r.success ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'
                      }`}>
                        <div>
                          <span className={r.success ? 'text-green-400' : 'text-red-400'}>
                            {r.success ? '✅' : '❌'} Question {r.question}
                          </span>
                          {r.success && r.size && (
                            <span className="text-slate-500 text-sm ml-2">({r.size}KB)</span>
                          )}
                          {r.error && (
                            <span className="text-red-400 text-sm ml-2">{r.error}</span>
                          )}
                        </div>
                        {r.success && r.audioUrl && (
                          <div className="flex items-center gap-2">
                            <audio src={r.audioUrl} controls className="h-8 w-32" />
                            <button
                              onClick={() => downloadAudio(r.audioUrl!, r.filename)}
                              className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded"
                            >
                              📥
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Save to Repository Button */}
                {successfulAudioCount > 0 && (
                  <>
                    <button
                      onClick={saveToRepository}
                      disabled={!canSaveToRepo}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingToRepo ? (
                        <span>
                          ⏳ Saving to GitHub... {saveProgress.current}/{saveProgress.total}
                        </span>
                      ) : (
                        <span>💾 Save to Project ({successfulAudioCount} files)</span>
                      )}
                    </button>

                    {/* Save Progress */}
                    {isSavingToRepo && (
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${(saveProgress.current / saveProgress.total) * 100}%` }}
                        />
                      </div>
                    )}

                    {/* Save Message */}
                    {saveMessage && (
                      <div className={`p-4 rounded-lg ${
                        saveMessage.startsWith('✅') 
                          ? 'bg-green-900/30 border border-green-500' 
                          : 'bg-red-900/30 border border-red-500'
                      }`}>
                        <p className={saveMessage.startsWith('✅') ? 'text-green-400' : 'text-red-400'}>
                          {saveMessage}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">ℹ️ How it works:</h3>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Questions are generated using Claude AI based on lesson content</li>
            <li>• Audio is generated using ElevenLabs TTS</li>
            <li>• <strong className="text-green-400">Save to Project</strong> uploads audio directly to GitHub</li>
            <li>• Railway auto-deploys changes in 2-3 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
