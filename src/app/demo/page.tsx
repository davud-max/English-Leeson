// Main Test Page for All Enhanced Slide Demos
import Link from 'next/link'

export default function TestAllMainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            🎯 Enhanced Slide Demos Test Center
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
            Testing all three enhancement approaches for Lesson 2 slides. 
            Compare performance, visual appeal, and implementation complexity.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/demo/simple" 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Simple Demo
            </Link>
            <Link 
              href="/demo/framer" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Framer Motion Demo
            </Link>
            <Link 
              href="/demo/icons" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              SVG Icons Demo
            </Link>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            📊 Feature Comparison Matrix
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">Simple Demo</th>
                  <th className="text-center p-4 font-bold">Framer Motion</th>
                  <th className="text-center p-4 font-bold">SVG Icons</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/20 hover:bg-white/5">
                  <td className="p-4 font-medium">⚡ Performance</td>
                  <td className="p-4 text-center text-green-400">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center text-yellow-400">⭐⭐⭐⭐</td>
                  <td className="p-4 text-center text-green-400">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-white/20 hover:bg-white/5">
                  <td className="p-4 font-medium">🎭 Animations</td>
                  <td className="p-4 text-center text-orange-400">⭐⭐</td>
                  <td className="p-4 text-center text-green-400">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center text-yellow-400">⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-white/20 hover:bg-white/5">
                  <td className="p-4 font-medium">🔧 Complexity</td>
                  <td className="p-4 text-center text-green-400">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center text-red-400">⭐⭐</td>
                  <td className="p-4 text-center text-yellow-400">⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-white/20 hover:bg-white/5">
                  <td className="p-4 font-medium">📦 Bundle Size</td>
                  <td className="p-4 text-center text-green-400">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center text-orange-400">⭐⭐⭐</td>
                  <td className="p-4 text-center text-green-400">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-white/20 hover:bg-white/5">
                  <td className="p-4 font-medium">🎨 Customization</td>
                  <td className="p-4 text-center text-yellow-400">⭐⭐⭐</td>
                  <td className="p-4 text-center text-green-400">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center text-yellow-400">⭐⭐⭐⭐</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-4 font-medium">🌐 Browser Support</td>
                  <td className="p-4 text-center text-green-400">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center text-yellow-400">⭐⭐⭐⭐</td>
                  <td className="p-4 text-center text-green-400">⭐⭐⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">🎯 For Production</h3>
            <p className="text-white/80 mb-4">
              Use <strong>Simple Demo</strong> approach for best performance and reliability. 
              Add selective advanced animations for key interactions.
            </p>
            <div className="text-sm text-yellow-200">
              <div>✅ Fast loading</div>
              <div>✅ Minimal dependencies</div>
              <div>✅ Broad browser support</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30">
            <h3 className="text-xl font-bold text-blue-300 mb-4">🎨 For Engagement</h3>
            <p className="text-white/80 mb-4">
              Combine <strong>SVG Icons</strong> library with subtle CSS animations. 
              Provides rich visuals without heavy dependencies.
            </p>
            <div className="text-sm text-blue-200">
              <div>✅ Rich visual elements</div>
              <div>✅ Scalable graphics</div>
              <div>✅ Easy maintenance</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4">🚀 For Premium</h3>
            <p className="text-white/80 mb-4">
              Full <strong>Framer Motion</strong> implementation for maximum polish. 
              Best for showcase pages and marketing materials.
            </p>
            <div className="text-sm text-purple-200">
              <div>✅ Professional animations</div>
              <div>✅ Micro-interactions</div>
              <div>✅ Premium feel</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/demo/simple" 
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-6 py-3 rounded-xl transition-all border border-blue-400/30"
            >
              Simple Enhanced Slide
            </Link>
            <Link 
              href="/demo/framer" 
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-6 py-3 rounded-xl transition-all border border-purple-400/30"
            >
              Framer Motion Slide
            </Link>
            <Link 
              href="/demo/icons" 
              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-6 py-3 rounded-xl transition-all border border-green-400/30"
            >
              SVG Icons Library
            </Link>
            <Link 
              href="/lessons/2" 
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              Return to Lesson 2
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}