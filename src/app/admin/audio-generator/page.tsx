'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AudioGeneratorPage() {
  const [lessonNumber, setLessonNumber] = useState(9)
  const [slides, setSlides] = useState<{ text: string }[]>([{ text: '' }])
  const [generatedScript, setGeneratedScript] = useState('')

  const addSlide = () => {
    setSlides([...slides, { text: '' }])
  }

  const updateSlide = (index: number, text: string) => {
    const newSlides = [...slides]
    newSlides[index].text = text
    setSlides(newSlides)
  }

  const removeSlide = (index: number) => {
    if (slides.length > 1) {
      setSlides(slides.filter((_, i) => i !== index))
    }
  }

  const generateScript = () => {
    const texts = slides
      .map((s, i) => `  // Slide ${i + 1}\n  \`${s.text.replace(/`/g, '\\`')}\`,`)
      .join('\n\n')

    const script = `const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Lesson ${lessonNumber} Audio texts
const LESSON_${lessonNumber}_TEXTS = [
${texts}
];

const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';

async function generateAudio(text, outputPath) {
  const escapedText = text.replace(/"/g, '\\\\"').replace(/'/g, "'\\\\''");
  const command = \`edge-tts --voice "\${VOICE}" --rate="\${RATE}" --text "\${escapedText}" --write-media "\${outputPath}"\`;
  await execPromise(command);
}

async function main() {
  console.log('🎬 Starting audio generation for Lesson ${lessonNumber}...');
  console.log(\`📝 Total slides: \${LESSON_${lessonNumber}_TEXTS.length}\`);
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson${lessonNumber}');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_${lessonNumber}_TEXTS.length; i++) {
    const filename = \`slide\${i + 1}.mp3\`;
    const filepath = path.join(audioDir, filename);
    
    console.log(\`🔊 Generating slide \${i + 1}/\${LESSON_${lessonNumber}_TEXTS.length}...\`);
    
    try {
      await generateAudio(LESSON_${lessonNumber}_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(\`✅ Generated: \${filename} (\${Math.round(stats.size / 1024)}KB)\`);
    } catch (error) {
      console.error(\`❌ Failed: \${filename} - \${error.message}\`);
    }
  }
  
  console.log('🎉 Audio generation complete!');
}

main().catch(console.error);`

    setGeneratedScript(script)
  }

  const copyScript = () => {
    navigator.clipboard.writeText(generatedScript)
    alert('Script copied to clipboard!')
  }

  const downloadScript = () => {
    const blob = new Blob([generatedScript], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generate-lesson${lessonNumber}-audio.js`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🔊 Audio Generator</h1>
              <p className="text-gray-600 text-sm">Generate TTS audio scripts for lessons</p>
            </div>
            <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Number
              </label>
              <input
                type="number"
                value={lessonNumber}
                onChange={(e) => setLessonNumber(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-900">Slide Texts ({slides.length})</h2>
                <button
                  onClick={addSlide}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  + Add Slide
                </button>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {slides.map((slide, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        Slide {index + 1}
                      </label>
                      {slides.length > 1 && (
                        <button
                          onClick={() => removeSlide(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <textarea
                      value={slide.text}
                      onChange={(e) => updateSlide(index, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      rows={4}
                      placeholder="Enter the text to be spoken for this slide..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {slide.text.length} characters
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={generateScript}
                className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                🔧 Generate Script
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Generated Script</h2>
              {generatedScript && (
                <div className="flex gap-2">
                  <button
                    onClick={copyScript}
                    className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={downloadScript}
                    className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                  >
                    💾 Download
                  </button>
                </div>
              )}
            </div>

            {generatedScript ? (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs max-h-[60vh]">
                {generatedScript}
              </pre>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                <p>Enter slide texts and click "Generate Script"</p>
              </div>
            )}

            {generatedScript && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">📖 How to use:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Copy or download the script</li>
                  <li>Save it to <code className="bg-blue-100 px-1 rounded">scripts/generate-lesson{lessonNumber}-audio.js</code></li>
                  <li>Make sure edge-tts is installed: <code className="bg-blue-100 px-1 rounded">pip3 install edge-tts</code></li>
                  <li>Run: <code className="bg-blue-100 px-1 rounded">node scripts/generate-lesson{lessonNumber}-audio.js</code></li>
                  <li>Push to git: <code className="bg-blue-100 px-1 rounded">git add . && git commit -m "Add audio" && git push</code></li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
