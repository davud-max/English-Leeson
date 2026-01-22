// Simple working enhanced slide demo
// No complex routing, direct implementation

'use client'

import { useState } from 'react'

export default function WorkingDemo() {
  const [activeDemo, setActiveDemo] = useState('simple')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            🎯 Enhanced Slide Demos
          </h1>
          <p className="text-white/70 text-center">Testing visual improvements for Lesson 2</p>
          
          {/* Simple Navigation */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <button
              onClick={() => setActiveDemo('simple')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeDemo === 'simple'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ✅ Simple
            </button>
            <button
              onClick={() => setActiveDemo('advanced')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeDemo === 'advanced'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🚀 Advanced
            </button>
            <button
              onClick={() => setActiveDemo('icons')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeDemo === 'icons'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🎨 Icons
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-6xl mx-auto p-8">
        {activeDemo === 'simple' && (
          <div className="space-y-8">
            {/* Simple Demo */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">✅ Simple Enhanced Approach</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Demo */}
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 Counting Visualization</h3>
                  <div className="bg-amber-500/20 rounded-lg p-6">
                    <div className="text-center text-white mb-4">Count these pencils:</div>
                    <div className="flex justify-center gap-4 mb-4">
                      {[1, 2, 3].map(num => (
                        <div key={num} className="text-4xl hover:scale-110 transition-transform cursor-pointer">
                          ✏️
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3].map(num => (
                        <div key={num} className="text-2xl animate-pulse">👉</div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-black/20 rounded-lg p-4">
                    <div className="text-white/80 text-center">Counting sequence:</div>
                    <div className="flex justify-center gap-3 mt-3">
                      {['One', 'Two', 'Three'].map((word, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 rounded-lg"
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">📚 Lesson Content</h3>
                  <div className="space-y-4 text-white">
                    <div className="bg-blue-500/20 p-4 rounded-lg">
                      <p><strong>Put three pencils in front of child and ask to count them.</strong></p>
                    </div>
                    <div className="bg-purple-500/20 p-4 rounded-lg">
                      <p>Most likely, they'll immediately say: "Three."</p>
                    </div>
                    <div className="bg-pink-500/20 p-4 rounded-lg">
                      <p>But ask them to actually count. Count exactly these pencils.</p>
                    </div>
                    <div className="bg-red-500/30 p-4 rounded-lg border border-red-400/50">
                      <p><strong>🤯 The Paradox:</strong> Same object gets different numerical labels!</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-green-500/20 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">💡 Key Insights:</h4>
                    <ul className="text-white/90 space-y-1 text-sm">
                      <li>• Child counts objects but names the number</li>
                      <li>• Same physical object = different numerical labels</li>
                      <li>• Cognitive dissonance drives learning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">✅ Simple Approach Features:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">⚡</span>
                  <span>Fast loading</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">📱</span>
                  <span>Mobile responsive</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🎯</span>
                  <span>Clean implementation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🔄</span>
                  <span>CSS animations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🎨</span>
                  <span>Modern design</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">⚙️</span>
                  <span>No dependencies</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'advanced' && (
          <div className="space-y-8">
            {/* Advanced Demo */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">🚀 Advanced Animation Approach</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Animated Visual Demo */}
                <div className="bg-white/10 rounded-xl p-6 transform hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">🎭 Dynamic Counting</h3>
                  <div className="bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-lg p-6">
                    <div className="text-center text-white mb-4 animate-pulse">Count these animated pencils:</div>
                    <div className="flex justify-center gap-4 mb-4">
                      {[1, 2, 3].map(num => (
                        <div 
                          key={num} 
                          className="text-4xl cursor-pointer transform hover:rotate-12 hover:scale-125 transition-all duration-200"
                        >
                          ✏️
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3].map((num, index) => (
                        <div 
                          key={num} 
                          className="text-2xl animate-bounce"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          👉
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-black/30 rounded-lg p-4">
                    <div className="text-white/80 text-center mb-3">Animated counting:</div>
                    <div className="flex justify-center gap-3">
                      {['One', 'Two', 'Three'].map((word, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 rounded-lg shadow-lg transform hover:scale-110 transition-all"
                          style={{ animationDelay: `${index * 0.3}s` }}
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Content */}
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">📚 Enhanced Content</h3>
                  <div className="space-y-4 text-white">
                    <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 p-4 rounded-lg transform hover:translate-x-2 transition-transform">
                      <p><strong>Put three pencils in front of child and ask to count them.</strong></p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 p-4 rounded-lg transform hover:translate-x-2 transition-transform delay-100">
                      <p>Most likely, they'll immediately say: "Three."</p>
                    </div>
                    <div className="bg-gradient-to-r from-pink-500/30 to-red-500/30 p-4 rounded-lg transform hover:translate-x-2 transition-transform delay-200">
                      <p>But ask them to actually count. Count exactly these pencils.</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-500/40 to-orange-500/40 p-4 rounded-lg border border-orange-400/50 transform hover:scale-105 transition-all">
                      <p><strong>🤯 The Paradox:</strong> Same object gets different numerical labels depending on context!</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gradient-to-r from-green-500/30 to-teal-500/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">💡 Enhanced Insights:</h4>
                    <ul className="text-white/90 space-y-1 text-sm">
                      <li>• Smooth micro-interactions</li>
                      <li>• Professional animations</li>
                      <li>• Engaging user experience</li>
                      <li>• Visual feedback</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advanced Features */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">🚀 Advanced Approach Features:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">✨</span>
                  <span>Smooth animations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">🎯</span>
                  <span>Micro-interactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">📱</span>
                  <span>Touch optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">🎨</span>
                  <span>Professional polish</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">⚡</span>
                  <span>Performance focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">🔄</span>
                  <span>Modern transitions</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'icons' && (
          <div className="space-y-8">
            {/* Icons Demo */}
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">🎨 SVG Educational Icons</h2>
              
              {/* Icon Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                {[
                  { name: 'Observation', icon: '👁️', color: 'blue', desc: 'Visual learning' },
                  { name: 'Counting', icon: '🔢', color: 'yellow', desc: 'Numerical concepts' },
                  { name: 'Abstraction', icon: '🧠', color: 'purple', desc: 'Abstract thinking' },
                  { name: 'Paradox', icon: '🤯', color: 'red', desc: 'Cognitive challenges' },
                  { name: 'Learning', icon: '📚', color: 'green', desc: 'Knowledge building' }
                ].map(({ name, icon, color, desc }) => (
                  <div 
                    key={name}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:scale-105 transition-transform border border-white/20"
                  >
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl shadow-lg"
                      style={{ backgroundColor: `${color === 'blue' ? '#3B82F6' : color === 'yellow' ? '#F59E0B' : color === 'purple' ? '#8B5CF6' : color === 'red' ? '#EF4444' : '#10B981'}30` }}
                    >
                      {icon}
                    </div>
                    <div className="text-white font-bold text-sm mb-1">{name}</div>
                    <div className="text-white/70 text-xs">{desc}</div>
                  </div>
                ))}
              </div>
              
              {/* Implementation Examples */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎯 Usage in Slides</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                      <span className="text-2xl">👁️</span>
                      <span className="text-white">Concept visualization and observation</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                      <span className="text-2xl">🔢</span>
                      <span className="text-white">Interactive counting demonstrations</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                      <span className="text-2xl">🤯</span>
                      <span className="text-white">Learning paradox explanations</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">💎 Key Benefits</h3>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✅</span>
                      <span>Scalable to any size without quality loss</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✅</span>
                      <span>Lightweight file sizes for fast loading</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✅</span>
                      <span>Consistent styling across all platforms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✅</span>
                      <span>Easy to customize colors and animations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✅</span>
                      <span>Perfect for educational content</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black/20 border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="text-white/60 mb-4">
            Enhanced Slide Demos for Lesson 2 - Testing Visual Improvements
          </div>
          <div className="text-sm text-white/40">
            Compare different approaches to find the best balance of performance and visual appeal
          </div>
        </div>
      </div>
    </div>
  )
}