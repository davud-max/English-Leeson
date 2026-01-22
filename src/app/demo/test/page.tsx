// Direct test page - no imports needed
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DirectTestPage() {
  const [activeTab, setActiveTab] = useState('simple')

  // Simple Demo Component
  const SimpleDemo = () => (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            ✅ Simple Enhanced Slide Demo
          </h1>
          <p className="text-white/90 text-center">Clean implementation with CSS animations</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">🎯 Counting Demo</h2>
            <div className="bg-amber-500/30 rounded-xl p-6">
              <div className="text-center text-white mb-4">Count these pencils:</div>
              <div className="flex justify-center gap-4 mb-4">
                {[1, 2, 3].map(num => (
                  <div key={num} className="text-5xl hover:scale-110 transition-transform cursor-pointer">
                    ✏️
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map(num => (
                  <div key={num} className="text-3xl animate-pulse">👉</div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">📚 Lesson Content</h2>
            <div className="bg-blue-500/20 rounded-xl p-6">
              <div className="text-white space-y-3">
                <p><strong>Put three pencils in front of child and ask to count them.</strong></p>
                <p>Most likely, they'll immediately say: "Three."</p>
                <p>But ask them to actually count. Count exactly these pencils.</p>
                <div className="bg-red-500/30 p-3 rounded-lg">
                  <strong>Paradox:</strong> Same object gets different numerical labels!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Framer Motion Style Demo (CSS animations)
  const FramerStyleDemo = () => (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            🚀 Framer Motion Style Demo
          </h1>
          <p className="text-white/90 text-center">Advanced animations and smooth transitions</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">🎭 Dynamic Counting</h2>
            <div className="bg-gradient-to-br from-amber-500/40 to-orange-500/40 rounded-2xl p-6">
              <div className="text-center text-white mb-4">Count these animated pencils:</div>
              <div className="flex justify-center gap-4 mb-4">
                {[1, 2, 3].map(num => (
                  <div 
                    key={num} 
                    className="text-5xl cursor-pointer transform hover:rotate-12 hover:scale-125 transition-all duration-200"
                  >
                    ✏️
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((num, index) => (
                  <div 
                    key={num} 
                    className="text-3xl animate-bounce"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    👉
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">📚 Enhanced Content</h2>
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl p-6">
              <div className="text-white space-y-4">
                <p className="transform hover:translate-x-2 transition-transform">
                  <strong>Put three pencils in front of child and ask to count them.</strong>
                </p>
                <p className="transform hover:translate-x-2 transition-transform delay-100">
                  Most likely, they'll immediately say: "Three."
                </p>
                <p className="transform hover:translate-x-2 transition-transform delay-200">
                  But ask them to actually count. Count exactly these pencils.
                </p>
                <div className="bg-gradient-to-r from-red-500/40 to-pink-500/40 p-4 rounded-lg transform hover:scale-105 transition-all">
                  <strong className="text-lg">🤯 The Paradox:</strong>
                  <p>Same object gets different numerical labels depending on context!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Icons Demo
  const IconsDemo = () => (
    <div className="bg-gradient-to-br from-green-600 to-teal-600 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            🎨 SVG Educational Icons
          </h1>
          <p className="text-white/90 text-center">Scalable vector graphics for learning concepts</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {[
            { name: 'observation', icon: '👁️', color: '#3B82F6' },
            { name: 'counting', icon: '🔢', color: '#F59E0B' },
            { name: 'abstraction', icon: '🧠', color: '#8B5CF6' },
            { name: 'paradox', icon: '🤯', color: '#EF4444' },
            { name: 'learning', icon: '📚', color: '#10B981' }
          ].map(({ name, icon, color }) => (
            <div 
              key={name} 
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center hover:scale-105 transition-transform border border-white/30"
            >
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl shadow-lg"
                style={{ backgroundColor: `${color}30` }}
              >
                {icon}
              </div>
              <div className="text-white font-medium capitalize">{name}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Implementation Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Usage Examples</h3>
              <div className="space-y-4 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👁️</span>
                  <span>Concept visualization</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔢</span>
                  <span>Interactive demonstrations</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤯</span>
                  <span>Learning paradoxes</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Key Advantages</h3>
              <ul className="space-y-2 text-white/80">
                <li>✅ Scalable to any size</li>
                <li>✅ Lightweight and fast</li>
                <li>✅ Consistent styling</li>
                <li>✅ Easy to customize</li>
                <li>✅ Perfect for education</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'simple', name: 'Simple Demo', icon: '✅' },
              { id: 'framer', name: 'Framer Style', icon: '🚀' },
              { id: 'icons', name: 'SVG Icons', icon: '🎨' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-white bg-blue-600 border-b-2 border-blue-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="pb-20">
        {activeTab === 'simple' && <SimpleDemo />}
        {activeTab === 'framer' && <FramerStyleDemo />}
        {activeTab === 'icons' && <IconsDemo />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-lg border-t border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-white">
            <span className="font-bold">Enhanced Slide Demos</span>
            <span className="text-gray-400 ml-2">Testing all approaches</span>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href="/lessons/2" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              Back to Lesson 2
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}