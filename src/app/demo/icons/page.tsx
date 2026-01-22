// SVG Icons Demo Page
'use client'

import Link from 'next/link'

const EDUCATIONAL_ICONS = {
  observation: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#3B82F6" opacity="0.2"/><circle cx="50" cy="50" r="35" fill="#3B82F6" opacity="0.4"/><circle cx="50" cy="50" r="25" fill="#3B82F6" opacity="0.6"/><circle cx="50" cy="50" r="15" fill="#3B82F6"/><text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="20" fill="white">👁️</text></svg>`,
  
  counting: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="20" width="80" height="60" rx="10" fill="#F59E0B" opacity="0.3"/><circle cx="30" cy="45" r="8" fill="#F59E0B"/><circle cx="50" cy="45" r="8" fill="#F59E0B"/><circle cx="70" cy="45" r="8" fill="#F59E0B"/><text x="50" y="75" text-anchor="middle" font-family="Arial" font-size="16" fill="#F59E0B" font-weight="bold">1 2 3</text></svg>`,
  
  abstraction: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" /><stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" /></linearGradient></defs><rect x="20" y="20" width="60" height="60" rx="15" fill="url(#grad1)" opacity="0.7"/><text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="24" fill="white">🧠</text></svg>`,
  
  paradox: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#EF4444" opacity="0.3"/><path d="M30,30 Q50,20 70,30 Q80,50 70,70 Q50,80 30,70 Q20,50 30,30" fill="#EF4444" opacity="0.5"/><text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="20" fill="#EF4444">🤯</text></svg>`,
  
  learning: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20,40 L50,20 L80,40 L80,80 L20,80 Z" fill="#10B981" opacity="0.4"/><text x="50" y="60" text-anchor="middle" font-family="Arial" font-size="20" fill="#10B981">📚</text><text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="12" fill="#10B981">LEARN</text></svg>`
};

export default function IconsDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎨 SVG Educational Icons Demo
          </h1>
          <p className="text-xl text-white/80">
            Scalable Vector Graphics for Learning Concepts
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {Object.entries(EDUCATIONAL_ICONS).map(([name, svg]) => (
            <div key={name} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:border-white/40 transition-all">
              <div 
                className="mx-auto mb-4"
                style={{ width: '80px', height: '80px' }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
              <div className="text-white font-medium capitalize">
                {name}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Implementation Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Usage in Slides</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div dangerouslySetInnerHTML={{ __html: EDUCATIONAL_ICONS.observation }} style={{ width: '32px', height: '32px' }} />
                  <span className="text-white">Concept visualization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div dangerouslySetInnerHTML={{ __html: EDUCATIONAL_ICONS.counting }} style={{ width: '32px', height: '32px' }} />
                  <span className="text-white">Interactive demonstrations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div dangerouslySetInnerHTML={{ __html: EDUCATIONAL_ICONS.paradox }} style={{ width: '32px', height: '32px' }} />
                  <span className="text-white">Learning paradoxes</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Benefits</h3>
              <ul className="space-y-2 text-white/80">
                <li>✅ Scalable to any size</li>
                <li>✅ Lightweight file sizes</li>
                <li>✅ Consistent styling</li>
                <li>✅ Easy to customize</li>
                <li>✅ Perfect for educational content</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/demo/test-all" 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            ← Back to All Demos
          </Link>
        </div>
      </div>
    </div>
  )
}