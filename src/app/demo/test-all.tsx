// Test page for all enhanced slide demos
import Link from 'next/link'
import SimpleEnhancedSlide from './simple-enhanced-slide'
import FramerMotionEnhancedSlide from './framer-motion-enhanced-slide'
import IconDemo from '@/components/EducationalIcons'

export default function TestAllDemos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">
            🎯 Enhanced Slide Demos Test Center
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Testing all three enhancement approaches for Lesson 2 slides
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              href="#simple-demo" 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              Simple Demo
            </Link>
            <Link 
              href="#framer-demo" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              Framer Motion Demo
            </Link>
            <Link 
              href="#icons-demo" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              SVG Icons Demo
            </Link>
          </div>
        </div>

        {/* Simple Enhanced Demo */}
        <section id="simple-demo" className="mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              ✅ Simple Enhanced Slide Demo
            </h2>
            <p className="text-white/80 text-lg">
              Clean implementation without external dependencies. Shows basic visual enhancements.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-400/30">
            <SimpleEnhancedSlide />
          </div>
        </section>

        {/* Framer Motion Demo */}
        <section id="framer-demo" className="mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              🚀 Framer Motion Enhanced Slide Demo
            </h2>
            <p className="text-white/80 text-lg">
              Advanced animations and micro-interactions. Professional-grade motion design.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-400/30">
            <FramerMotionEnhancedSlide />
          </div>
        </section>

        {/* SVG Icons Demo */}
        <section id="icons-demo" className="mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              🎨 SVG Educational Icons Library
            </h2>
            <p className="text-white/80 text-lg">
              Scalable vector graphics for all educational concepts. Reusable icon components.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-green-400/30">
            <IconDemo />
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            📊 Feature Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Simple Demo</th>
                  <th className="text-center p-4">Framer Motion</th>
                  <th className="text-center p-4">SVG Icons</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/20">
                  <td className="p-4 font-medium">Performance</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="p-4 font-medium">Animations</td>
                  <td className="p-4 text-center">⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="p-4 font-medium">Complexity</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="p-4 font-medium">Bundle Size</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="p-4 font-medium">Customization</td>
                  <td className="p-4 text-center">⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Browser Support</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐</td>
                  <td className="p-4 text-center">⭐⭐⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Recommendations */}
        <section className="mt-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-400/30">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            💡 Implementation Recommendations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">🎯 For Production</h3>
              <p className="text-white/80">
                Use <strong>Simple Demo</strong> approach for best performance and reliability. 
                Add selective Framer Motion for key interactions.
              </p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-orange-300 mb-3">🎨 For Engagement</h3>
              <p className="text-white/80">
                Combine <strong>SVG Icons</strong> library with subtle CSS animations. 
                Provides rich visuals without heavy dependencies.
              </p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-3">🚀 For Premium</h3>
              <p className="text-white/80">
                Full <strong>Framer Motion</strong> implementation for maximum polish. 
                Best for showcase pages and marketing materials.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link 
            href="/lessons/2" 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl transform hover:scale-105"
          >
            Return to Lesson 2
          </Link>
        </div>
      </div>
    </div>
  )
}