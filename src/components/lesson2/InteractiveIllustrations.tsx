'use client'

import { useState } from 'react'

// 🖐️ Интерактивная иллюстрация: Счет на пальцах
export function FingerCountingIllustration() {
  const [activeFingers, setActiveFingers] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const fingers = [
    { id: 0, label: 'Thumb', x: 60, y: 100, width: 25 },
    { id: 1, label: 'Index', x: 100, y: 40, width: 22 },
    { id: 2, label: 'Middle', x: 140, y: 20, width: 22 },
    { id: 3, label: 'Ring', x: 180, y: 40, width: 22 },
    { id: 4, label: 'Pinky', x: 220, y: 80, width: 20 },
  ]

  const addFinger = () => {
    if (activeFingers.length < 5 && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveFingers([...activeFingers, activeFingers.length])
        setIsAnimating(false)
      }, 300)
    }
  }

  const reset = () => {
    setActiveFingers([])
  }

  const countValue = activeFingers.length

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-8 rounded-2xl border-2 border-orange-200 shadow-xl">
      <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
        ✋ Interactive: Counting on Fingers
      </h3>
      <p className="text-gray-600 text-center mb-6">
        Click &quot;Count +1&quot; to bend fingers one by one
      </p>
      
      {/* Hand SVG */}
      <div className="flex justify-center mb-6">
        <svg width="300" height="220" viewBox="0 0 300 220" className="drop-shadow-2xl">
          {/* Palm */}
          <ellipse 
            cx="150" 
            cy="160" 
            rx="75" 
            ry="50" 
            fill="#FFD1A9" 
            stroke="#FF9A56" 
            strokeWidth="3"
            className="drop-shadow-lg"
          />
          
          {/* Fingers */}
          {fingers.map((finger) => {
            const isActive = activeFingers.includes(finger.id)
            const yOffset = isActive ? 0 : 50
            const height = isActive ? 90 : 50
            
            return (
              <g key={finger.id}>
                {/* Finger body */}
                <rect
                  x={finger.x}
                  y={finger.y + yOffset}
                  width={finger.width}
                  height={height}
                  rx="12"
                  fill={isActive ? '#FFD1A9' : '#D0D0D0'}
                  stroke={isActive ? '#FF9A56' : '#A0A0A0'}
                  strokeWidth="3"
                  className="transition-all duration-500 ease-out"
                  style={{
                    transformOrigin: `${finger.x + finger.width/2}px ${finger.y + height}px`
                  }}
                />
                
                {/* Fingertip */}
                <ellipse
                  cx={finger.x + finger.width/2}
                  cy={finger.y + yOffset}
                  rx={finger.width/2 + 2}
                  ry="15"
                  fill={isActive ? '#FFD1A9' : '#D0D0D0'}
                  stroke={isActive ? '#FF9A56' : '#A0A0A0'}
                  strokeWidth="3"
                  className="transition-all duration-500 ease-out"
                />
                
                {/* Number badge when active */}
                {isActive && (
                  <g>
                    <circle
                      cx={finger.x + finger.width/2}
                      cy={finger.y + 15}
                      r="18"
                      fill="#4F46E5"
                      className="animate-pulse"
                    />
                    <text
                      x={finger.x + finger.width/2}
                      y={finger.y + 22}
                      textAnchor="middle"
                      fill="white"
                      fontSize="20"
                      fontWeight="bold"
                    >
                      {finger.id + 1}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Count Display */}
      <div className="text-center mb-6">
        <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-2xl shadow-lg">
          <p className="text-sm font-semibold mb-1">Current Count</p>
          <p className="text-5xl font-bold">{countValue}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={addFinger}
          disabled={activeFingers.length === 5 || isAnimating}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
        >
          Count +1 ☝️
        </button>
        <button
          onClick={reset}
          className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Reset 🔄
        </button>
      </div>

      {countValue === 5 && (
        <div className="mt-6 bg-green-100 border-2 border-green-400 rounded-xl p-4 animate-bounce">
          <p className="text-green-800 text-center font-bold">
            🎉 Perfect! You counted to 5!
          </p>
        </div>
      )}
    </div>
  )
}

// 📦 Интерактивная иллюстрация: Группировка объектов
export function GroupingIllustration() {
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'pencils' | 'pens' | 'markers'>('all')
  
  const items = [
    { id: 1, type: 'pencil', x: 50, y: 50, color: '#FCD34D', label: '✏️' },
    { id: 2, type: 'pencil', x: 100, y: 50, color: '#FCD34D', label: '✏️' },
    { id: 3, type: 'pencil', x: 150, y: 50, color: '#FCD34D', label: '✏️' },
    { id: 4, type: 'pen', x: 220, y: 50, color: '#60A5FA', label: '🖊️' },
    { id: 5, type: 'pen', x: 270, y: 50, color: '#60A5FA', label: '🖊️' },
    { id: 6, type: 'marker', x: 340, y: 50, color: '#F87171', label: '🖍️' },
  ]

  const counts = {
    all: items.length,
    pencils: items.filter(i => i.type === 'pencil').length,
    pens: items.filter(i => i.type === 'pen').length,
    markers: items.filter(i => i.type === 'marker').length,
  }

  const isHighlighted = (item: typeof items[0]) => {
    if (selectedGroup === 'all') return true
    if (selectedGroup === 'pencils') return item.type === 'pencil'
    if (selectedGroup === 'pens') return item.type === 'pen'
    if (selectedGroup === 'markers') return item.type === 'marker'
    return false
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-8 rounded-2xl border-2 border-purple-200 shadow-xl">
      <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
        📦 Interactive: Grouping Objects
      </h3>
      <p className="text-gray-600 text-center mb-6">
        Click buttons to see different groups
      </p>

      {/* Items Display */}
      <div className="bg-white rounded-xl p-8 mb-6 shadow-inner">
        <svg width="400" height="120" viewBox="0 0 400 120" className="mx-auto">
          {items.map((item) => {
            const highlighted = isHighlighted(item)
            return (
              <g key={item.id} className="transition-all duration-300">
                {/* Item circle */}
                <circle
                  cx={item.x}
                  cy={item.y}
                  r={highlighted ? 25 : 20}
                  fill={highlighted ? item.color : '#E5E7EB'}
                  stroke={highlighted ? '#374151' : '#9CA3AF'}
                  strokeWidth={highlighted ? 3 : 2}
                  className="transition-all duration-300"
                  opacity={highlighted ? 1 : 0.3}
                />
                {/* Emoji */}
                <text
                  x={item.x}
                  y={item.y + 8}
                  textAnchor="middle"
                  fontSize={highlighted ? '28' : '20'}
                  className="transition-all duration-300"
                  opacity={highlighted ? 1 : 0.3}
                >
                  {item.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Group Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => setSelectedGroup('all')}
          className={`p-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
            selectedGroup === 'all'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl mb-1">📚</div>
          <div className="text-sm">All Items</div>
          <div className="text-lg font-bold">{counts.all}</div>
        </button>
        
        <button
          onClick={() => setSelectedGroup('pencils')}
          className={`p-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
            selectedGroup === 'pencils'
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl mb-1">✏️</div>
          <div className="text-sm">Pencils</div>
          <div className="text-lg font-bold">{counts.pencils}</div>
        </button>
        
        <button
          onClick={() => setSelectedGroup('pens')}
          className={`p-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
            selectedGroup === 'pens'
              ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl mb-1">🖊️</div>
          <div className="text-sm">Pens</div>
          <div className="text-lg font-bold">{counts.pens}</div>
        </button>
        
        <button
          onClick={() => setSelectedGroup('markers')}
          className={`p-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
            selectedGroup === 'markers'
              ? 'bg-gradient-to-r from-red-400 to-rose-600 text-white scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl mb-1">🖍️</div>
          <div className="text-sm">Markers</div>
          <div className="text-lg font-bold">{counts.markers}</div>
        </button>
      </div>

      {/* Explanation */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
        <p className="text-gray-700 font-medium">
          {selectedGroup === 'all' && '📚 Counting ALL items: different types grouped together'}
          {selectedGroup === 'pencils' && '✏️ Counting ONLY pencils: 3 items in this group'}
          {selectedGroup === 'pens' && '🖊️ Counting ONLY pens: 2 items in this group'}
          {selectedGroup === 'markers' && '🖍️ Counting ONLY markers: 1 item in this group'}
        </p>
      </div>
    </div>
  )
}

// 🧮 Интерактивная иллюстрация: Системы счисления
export function NumberSystemsIllustration() {
  const [selectedSystem, setSelectedSystem] = useState<'decimal' | 'dozen' | 'sexagesimal'>('decimal')
  
  const systems = {
    decimal: {
      name: 'Decimal (Base 10)',
      emoji: '🔟',
      base: 10,
      description: 'Modern system: 10 digits (0-9)',
      examples: ['1, 2, 3... 10', '10 ones = 1 ten', 'Used everywhere today'],
      color: 'from-blue-500 to-cyan-600'
    },
    dozen: {
      name: 'Dozen (Base 12)',
      emoji: '🕐',
      base: 12,
      description: 'Ancient system: counting on finger phalanges',
      examples: ['12 units = 1 dozen', '12 hours on clock', '12 months in year'],
      color: 'from-amber-500 to-orange-600'
    },
    sexagesimal: {
      name: 'Sexagesimal (Base 60)',
      emoji: '⏰',
      base: 60,
      description: 'Babylonian system: used in time',
      examples: ['60 seconds = 1 minute', '60 minutes = 1 hour', 'Still used in clocks!'],
      color: 'from-purple-500 to-pink-600'
    }
  }

  const current = systems[selectedSystem]

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-indigo-200 shadow-xl">
      <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
        🧮 Interactive: Number Systems Through History
      </h3>
      <p className="text-gray-600 text-center mb-6">
        Explore different counting systems
      </p>

      {/* System Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(systems).map(([key, system]) => (
          <button
            key={key}
            onClick={() => setSelectedSystem(key as typeof selectedSystem)}
            className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg ${
              selectedSystem === key
                ? `bg-gradient-to-r ${system.color} text-white scale-105 shadow-2xl`
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="text-4xl mb-2">{system.emoji}</div>
            <div className="font-bold text-sm mb-1">{system.name}</div>
            <div className={`text-3xl font-bold ${selectedSystem === key ? 'text-white' : 'text-gray-900'}`}>
              Base {system.base}
            </div>
          </button>
        ))}
      </div>

      {/* System Details */}
      <div className={`bg-gradient-to-r ${current.color} rounded-2xl p-8 text-white shadow-2xl transform transition-all duration-500`}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{current.emoji}</div>
          <h4 className="text-3xl font-bold mb-2">{current.name}</h4>
          <p className="text-lg opacity-90">{current.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {current.examples.map((example, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300">
              <p className="text-center font-medium">{example}</p>
            </div>
          ))}
        </div>

        {/* Visual Representation */}
        <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {Array.from({ length: Math.min(current.base, 12) }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center font-bold text-xl animate-fadeIn shadow-lg"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {i + 1}
              </div>
            ))}
            {current.base > 12 && (
              <div className="text-2xl font-bold">...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
