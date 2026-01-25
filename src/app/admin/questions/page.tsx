'use client'

import { useState } from 'react'
import Link from 'next/link'

// Lesson data for generating questions
const LESSONS = [
  { id: 8, title: 'Theory of Cognitive Resonance', content: `Today we will talk about what happens at the very moment when a thought "comes" to you. Not when you build it brick by brick, but when it arrives suddenly, like an illumination. Theory of Cognitive Resonance is a model that places at the center not neurons, but you yourself, your unique "I", your feelings and capacity for discovery. This theory explains the selective mechanism of consciousness — why some thoughts become ours, while others pass by unnoticed. Our consciousness consists of two interconnected but fundamentally different circuits: Analog Circuit — World of immediate, bodily, sensory experience like taste of an apple, pain from a burn, warmth of the sun. Digital Circuit — World of abstractions, signs, concepts like the word "apple", medical terminology, temperature in degrees. Thinking is not the work of one circuit. It is a process of resonant dialogue between them. The digital system asks questions, while the analog votes with the resource of attention and emotional energy.` },
  { id: 9, title: 'Sacred Text and Reality', content: `In the beginning God created the heaven and the earth. The concepts of heaven and earth are foundational for the first chapters of the Bible. Heaven and earth are abstract concepts denoting, respectively, the observable and the unobservable. In modern vocabulary, the concepts closest in meaning to heaven and earth are Nothing and the World. The earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters. Water represents Being - boundless, formless, indistinguishable. The Spirit of God belongs neither to heaven nor to earth. Water and the Holy Spirit together are conditionally God. And God said, Let there be light: and there was light. The ability to abstract is the light — that through which man distinguishes, observes. To observe means to distinguish the boundaries between the observable (World) and the unobservable (Nothing).` },
  { id: 10, title: 'How Thought Finds Us', content: `We have traveled a tremendous path together. We have examined what a definition is, what a number is, a formula, a law, a sacred description. But the most personal question remains: how exactly do I do this? How is a thought born in my head? Our brain is a supercomputer with trillions of operations per second. How do I manage to choose that very one, the needed thought? Let us imagine that I is not the author of thoughts, but their radio receiver. When the circuit's frequency matches the frequency of one of the stations — resonance occurs. In this model, we do not compose thoughts. We catch them. Memory is not a warehouse of pictures. It is preserved patterns of frequencies. To remember means to tune your heterodyne to the frequency of the preserved pattern and obtain resonance.` },
  { id: 11, title: 'The Number 666', content: `Now before us lies the final riddle — the number of the Beast, 666. The key word is "count" — calculate, derive, understand the algorithm. Six is the number of the fullness of physical perception. Five senses plus a sixth — the sense of bodily attraction, of instinct. The first six is a world ruled by six isolated senses - the kingdom of the Beast. Then Light appears — the ability to abstract. Man looks at his six senses from the outside. He begins to unite them with Love. The second six is the Human number. Six senses unite in the phenomenon of human love. The third six is the Divine number - Divine Love (Agape), connecting souls directly, bypassing the mediation of the senses. Six hundred sixty-six is not one number. It is a formula: six-one, six-two, six-three. A three-step path of ascent.` },
  { id: 12, title: 'Three Steps to Heaven', content: `Here is wisdom. Let him who has understanding count the number of the beast. In our case - calculate means to understand the algorithm. Physical existence level: perception through six senses, world of reactions, no self-awareness. Human level: emergence of abstract thinking, ability to see oneself from outside, love as new organizing principle. Divine level: pure spiritual connection, souls merge in Agape love. The path from beast to human to divine is not about external changes but internal transformation. Each level includes and transcends the previous one. The "end of light" is not a catastrophe but the completion of its mission - when all souls unite with God.` },
  { id: 13, title: 'The Sixth Human Level', content: `In the beginning was the Word, and the Word was with God, and the Word was God. The Word (Logos) is the principle of distinction, the ability to draw boundaries. Genesis tells of six days of creation - six levels of distinction. Day 1: Light separates from darkness (first distinction). Day 2: Waters above from waters below (firmament). Day 3: Land from sea, plants. Day 4: Heavenly bodies. Day 5: Fish and birds. Day 6: Animals and humans. The sixth level is the human level - the level where consciousness can observe itself. Man is created in God's image because man has the ability to distinguish, to name, to create through language. The Sabbath (seventh day) represents the completion of creation through distinction.` },
  { id: 14, title: 'How Consciousness Creates', content: `We began with something simple: "Describe what you see." But we encountered a fundamental paradox: To describe something, you need words. But words are terms. And terms require definitions. Which brings us back to needing to describe... A closed circle. Only one thing can break this cycle — the act of primary distinction. Imagine absolute darkness — not physical darkness, but meaningful darkness. No "here" or "there", no "self" or "other". This is what ancient texts call "water" — homogeneous, indistinguishable Being. Biblical formulation: "And God said: let there be light. And there was light." God didn't "create" light in the usual sense. He named it. Light = The first operation of distinction. The world is born only after acts of distinction. God didn't "create" the world like a craftsman makes furniture. The world "appeared" when an Observer capable of distinction emerged.` },
]

export default function AdminQuestionsPage() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [count, setCount] = useState(5)
  const [difficulty, setDifficulty] = useState('mixed')
  const [adminKey, setAdminKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; questions?: unknown[] } | null>(null)

  const generateQuestions = async () => {
    if (!selectedLesson || !adminKey) {
      alert('Please select a lesson and enter admin key')
      return
    }

    const lesson = LESSONS.find(l => l.id === selectedLesson)
    if (!lesson) return

    setIsGenerating(true)
    setResult(null)

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

  return (
    <div className="min-h-screen bg-stone-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-stone-800">🎓 Quiz Questions Generator</h1>
            <Link href="/admin" className="text-amber-700 hover:text-amber-800">
              ← Back to Admin
            </Link>
          </div>

          <div className="space-y-6">
            {/* Admin Key */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Admin Secret Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key..."
                className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Lesson Selection */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Select Lesson
              </label>
              <select
                value={selectedLesson || ''}
                onChange={(e) => setSelectedLesson(Number(e.target.value))}
                className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
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
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Number of Questions
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
                >
                  {[3, 5, 7, 10].map(n => (
                    <option key={n} value={n}>{n} questions</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
                >
                  <option value="mixed">Mixed</option>
                  <option value="easy">Easy Only</option>
                  <option value="hard">Hard Only</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQuestions}
              disabled={isGenerating || !selectedLesson || !adminKey}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold text-lg hover:from-amber-700 hover:to-amber-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? '🔄 Generating with Claude AI...' : '✨ Generate Questions'}
            </button>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-500' : 'bg-red-50 border border-red-500'}`}>
                <p className={`font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.success ? '✅ ' : '❌ '}{result.message}
                </p>
                
                {result.questions && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-stone-600">Generated questions:</p>
                    {(result.questions as { id: number; question: string; correct_answer: string; difficulty: string; points: number }[]).map((q, i) => (
                      <div key={i} className="bg-white p-3 rounded border">
                        <p className="font-medium text-stone-800">Q{i + 1}: {q.question}</p>
                        <p className="text-sm text-stone-600 mt-1">Answer: {q.correct_answer}</p>
                        <p className="text-xs text-stone-400 mt-1">
                          {q.difficulty === 'hard' ? '🔥 Hard' : '📗 Easy'} • {q.points} points
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2">ℹ️ How it works:</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Questions are generated using Claude AI based on lesson content</li>
            <li>• Generated questions are saved to <code>/public/data/questions/lessonX.json</code></li>
            <li>• Students will see pre-generated questions (no AI calls during quiz)</li>
            <li>• Questions are read aloud using browser TTS</li>
            <li>• You need to set ADMIN_SECRET_KEY in Railway environment variables</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
