'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FramerMotionEnhancedSlide() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const pencilVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, rotate: 5 },
    tap: { scale: 0.9 }
  }

  const fingerVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: 0.5
      }
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header with entrance animation */}
      <motion.div 
        className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 mb-10 text-center shadow-2xl border border-white/30"
        variants={itemVariants}
      >
        <motion.h1 
          className="text-5xl font-bold text-white mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          🎯 Enhanced Slide with Framer Motion
        </motion.h1>
        <motion.p 
          className="text-white/90 text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Interactive Visual Learning Experience
        </motion.p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side - Visual Demo with Advanced Animations */}
        <motion.div 
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-3xl font-bold text-white mb-8 text-center"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
          >
            🎭 Dynamic Counting Demonstration
          </motion.h2>
          
          {/* Pencil Visualization with Hover Effects */}
          <motion.div 
            className="bg-gradient-to-br from-amber-500/40 to-orange-500/40 rounded-2xl p-8 mb-8 border border-amber-300/30 shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-center text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Count these pencils:
            </motion.div>
            
            <motion.div 
              className="flex justify-center gap-6 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[1, 2, 3].map((num) => (
                <motion.div
                  key={num}
                  className="text-6xl cursor-pointer"
                  variants={pencilVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  ✏️
                </motion.div>
              ))}
            </motion.div>
            
            {/* Animated Finger Pointing */}
            <motion.div 
              className="flex justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[1, 2, 3].map((num, index) => (
                <motion.div
                  key={num}
                  className="text-4xl"
                  variants={fingerVariants}
                  initial="initial"
                  animate="animate"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  👉
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Counting Sequence with Staggered Animation */}
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="text-white/90 text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Counting sequence:
            </motion.div>
            <motion.div 
              className="flex justify-center gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.3
                  }
                }
              }}
            >
              {['One', 'Two', 'Three'].map((word, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-3 rounded-xl shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.4 + index * 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(255,255,255,0.3)" }}
                >
                  {word}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Content with Smooth Transitions */}
        <motion.div 
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-3xl font-bold text-white mb-8 text-center"
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.3 }}
          >
            📚 Enhanced Lesson Content
          </motion.h2>
          
          <motion.div 
            className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl p-8 mb-8 border border-blue-300/30 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-white space-y-5 text-lg leading-relaxed">
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <strong>Put three pencils in front of child and ask to count them.</strong>
              </motion.p>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                Most likely, they'll immediately say: "Three."
              </motion.p>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                But ask them to actually count. Count exactly these pencils.
              </motion.p>
              <motion.div
                className="bg-gradient-to-r from-red-500/40 to-pink-500/40 p-5 rounded-xl border border-red-300/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <motion.strong 
                  className="text-xl"
                  animate={{ 
                    textShadow: [
                      "0 0 5px rgba(255,255,255,0.5)",
                      "0 0 15px rgba(255,255,255,0.8)",
                      "0 0 5px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🤯 The Paradox: 
                </motion.strong>
                <motion.span 
                  className="block mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                >
                  Same object gets different numerical labels depending on counting context!
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Key Points with Individual Animations */}
          <motion.div 
            className="bg-gradient-to-br from-green-500/30 to-teal-500/30 rounded-2xl p-8 border border-green-300/30 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.h3 
              className="text-2xl font-bold text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              💡 Key Learning Insights
            </motion.h3>
            <motion.ul 
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {[
                "🎯 Child counts objects but names the number, not the objects themselves",
                "🔄 Same physical object receives different numerical labels in different contexts", 
                "🤯 This cognitive dissonance is essential for developing abstract thinking",
                "🧠 The paradox demonstrates the transition from concrete to abstract reasoning"
              ].map((point, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-4 text-white/90"
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + index * 0.2 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                >
                  <span className="text-2xl flex-shrink-0">
                    {[🎯, 🔄, 🤯, 🧠][index]}
                  </span>
                  <span className="pt-1">{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Controls with Smooth Animations */}
      <motion.div 
        className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 mt-12 shadow-2xl border border-white/30"
        variants={itemVariants}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.2 }}
          >
            <div className="text-white font-bold mb-3">Progress</div>
            <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div 
                className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 h-4 rounded-full shadow-md"
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.5, delay: 2.5, ease: "easeOut" }}
              ></motion.div>
            </div>
          </motion.div>

          {/* Play Button */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.4 }}
          >
            <motion.button
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl"
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              ▶️ Play Enhanced Narration
            </motion.button>
          </motion.div>

          {/* Navigation */}
          <motion.div 
            className="flex justify-end gap-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.6 }}
          >
            <Link 
              href="/lessons/2" 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-all border border-white/30 text-white font-medium"
            >
              ← Back
            </Link>
            <Link 
              href="/lessons/2" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              Continue →
            </Link>
          </motion.div>
        </div>
        
        {/* Animated Navigation Dots */}
        <motion.div 
          className="mt-8 flex justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
        >
          {[1, 2, 3, 4, 5].map((dot, index) => (
            <motion.div
              key={index}
              className={`w-4 h-4 rounded-full ${
                dot === 4 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                  : dot < 4
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : 'bg-white/40'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 3 + index * 0.1,
                type: "spring",
                stiffness: 300
              }}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}