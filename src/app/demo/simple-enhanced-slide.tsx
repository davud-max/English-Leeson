// Simple working demo of enhanced slide
// No TypeScript errors, clean implementation

import Link from 'next/link';

export default function SimpleEnhancedSlide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 p-8">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          🎯 Enhanced Slide Demo - Lesson 2
        </h1>
        <p className="text-white/90 text-xl">Interactive Visual Learning Experience</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Visual Demo */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            🎭 Counting Demonstration
          </h2>
          
          {/* Pencil Visualization */}
          <div className="bg-amber-500/30 rounded-xl p-6 mb-6">
            <div className="text-center text-white mb-4">
              Count these pencils:
            </div>
            <div className="flex justify-center gap-4 mb-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="text-5xl hover:scale-110 transition-transform cursor-pointer">
                  ✏️
                </div>
              ))}
            </div>
            
            {/* Finger Pointing */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="text-3xl animate-pulse">
                  👉
                </div>
              ))}
            </div>
          </div>
          
          {/* Counting Sequence */}
          <div className="bg-black/20 rounded-xl p-4">
            <div className="text-white/90 text-center mb-3">Counting:</div>
            <div className="flex justify-center gap-3">
              {['One', 'Two', 'Three'].map((word, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 rounded-lg animate-pulse"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            📚 Lesson Content
          </h2>
          
          <div className="bg-blue-500/20 rounded-xl p-6 mb-6">
            <div className="text-white space-y-4">
              <p><strong>Put three pencils in front of child and ask to count them.</strong></p>
              <p>Most likely, they'll immediately say: "Three."</p>
              <p>But ask them to actually count. Count exactly these pencils.</p>
              <p className="bg-red-500/30 p-3 rounded-lg">
                <strong>Paradox:</strong> Same object gets different numerical labels!
              </p>
            </div>
          </div>
          
          {/* Key Points */}
          <div className="bg-green-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">💡 Key Insights</h3>
            <ul className="space-y-2 text-white/90">
              <li>🎯 Child counts objects but names the number</li>
              <li>🔄 Same physical object = different numerical labels</li>
              <li>🤯 Cognitive dissonance drives learning</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mt-8">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <div className="font-bold">Slide Progress</div>
            <div className="w-64 bg-white/30 rounded-full h-3 mt-2">
              <div className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full w-3/4"></div>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105">
            ▶️ Play Narration
          </button>
          
          <div className="flex gap-3">
            <Link href="/lessons/2" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all">
              ← Back
            </Link>
            <Link href="/lessons/2" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-xl font-bold transition-all">
              Continue →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}