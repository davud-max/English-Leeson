'use client'

import { useState } from 'react'
import Link from 'next/link'

// ElevenLabs voices from Russian site
const ELEVENLABS_VOICES = {
  CUSTOM: { id: 'kFVUJfjBCiv9orAbWhZN', name: 'Your Custom Voice (Male) ⭐' },
  DZULU: { id: '8Hdxm8QJKOFknq47BhTz', name: 'dZulu Custom (Male)' },
  DZULU2: { id: 'ma4IY0Z4IUybdEpvYzBW', name: 'dZulu2 Custom (Male)' },
  NEW: { id: 'erDx71FK2teMZ7g6khzw', name: 'New Voice (Male)' },
  BELLA: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Female, Russian)' },
  RACHEL: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female, Calm)' },
  DOMI: { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Female, Energetic)' },
  ELLI: { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Female, Young)' },
  ADAM: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Male, Deep)' },
  JOSH: { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Male, Strong)' },
  SAM: { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam (Male, Low)' },
  ANTONI: { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Male, Soft)' },
}

export default function AudioGeneratorPage() {
  const [lessonNumber, setLessonNumber] = useState(9)
  const [slides, setSlides] = useState<{ text: string }[]>([{ text: '' }])
  const [generatedScript, setGeneratedScript] = useState('')
  const [provider, setProvider] = useState<'edge-tts' | 'elevenlabs'>('elevenlabs')
  const [voiceId, setVoiceId] = useState(ELEVENLABS_VOICES.ADAM.id)

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

    if (provider === 'elevenlabs') {
      // ElevenLabs script
      const script = `const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Lesson ${lessonNumber} Audio texts
const LESSON_${lessonNumber}_TEXTS = [
${texts}
];

// ElevenLabs Configuration
const ELEVENLABS_API_KEY = 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274';
const VOICE_ID = '${voiceId}';
const PROXY_URL = 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs';

async function generateAudioElevenLabs(text, outputPath) {
  try {
    const response = await axios.post(PROXY_URL, {
      apiKey: ELEVENLABS_API_KEY,
      voiceId: VOICE_ID,
      text: text,
      stability: 0.5,
      similarity_boost: 0.75
    }, {
      timeout: 180000
    });

    if (response.data.success && response.data.audio) {
      const audioBuffer = Buffer.from(response.data.audio, 'base64');
      fs.writeFileSync(outputPath, audioBuffer);
      return true;
    } else {
      throw new Error(response.data.error || 'Failed to generate audio');
    }
  } catch (error) {
    throw new Error(\`ElevenLabs API error: \${error.message}\`);
  }
}

async function main() {
  console.log('🎬 Starting ElevenLabs audio generation for Lesson ${lessonNumber}...');
  console.log(\`📝 Total slides: \${LESSON_${lessonNumber}_TEXTS.length}\`);
  console.log(\`🎙️ Voice ID: \${VOICE_ID}\`);
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson${lessonNumber}');
  
  // Delete old audio files first
  if (fs.existsSync(audioDir)) {
    console.log('🗑️  Cleaning old audio files...');
    const files = fs.readdirSync(audioDir);
    files.forEach(file => {
      if (file.endsWith('.mp3')) {
        fs.unlinkSync(path.join(audioDir, file));
        console.log(\`   Deleted: \${file}\`);
      }
    });
  } else {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_${lessonNumber}_TEXTS.length; i++) {
    const filename = \`slide\${i + 1}.mp3\`;
    const filepath = path.join(audioDir, filename);
    
    console.log(\`🔊 Generating slide \${i + 1}/\${LESSON_${lessonNumber}_TEXTS.length}...\`);
    
    try {
      await generateAudioElevenLabs(LESSON_${lessonNumber}_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(\`✅ Generated: \${filename} (\${Math.round(stats.size / 1024)}KB)\`);
      
      // Pause between requests
      if (i < LESSON_${lessonNumber}_TEXTS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(\`❌ Failed: \${filename} - \${error.message}\`);
    }
  }
  
  console.log('🎉 Audio generation complete!');
}

main().catch(console.error);`
      
      setGeneratedScript(script)
    } else {
      // Edge-TTS script (original)
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
  
  // Delete old audio files first
  if (fs.existsSync(audioDir)) {
    console.log('🗑️  Cleaning old audio files...');
    const files = fs.readdirSync(audioDir);
    files.forEach(file => {
      if (file.endsWith('.mp3')) {
        fs.unlinkSync(path.join(audioDir, file));
        console.log(\`   Deleted: \${file}\`);
      }
    });
  } else {
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
    a.download = `generate-lesson${lessonNumber}-audio-${provider}.js`
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
              <p className="text-gray-600 text-sm">Generate TTS audio scripts for lessons with Edge-TTS or ElevenLabs</p>
            </div>
            <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            {/* Lesson Number */}
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

            {/* Provider Selection */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                TTS Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setProvider('edge-tts')}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    provider === 'edge-tts'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">🎤</div>
                  <div className="text-sm">Edge-TTS</div>
                  <div className="text-xs text-gray-500">Free, fast</div>
                </button>
                <button
                  onClick={() => setProvider('elevenlabs')}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    provider === 'elevenlabs'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">⭐</div>
                  <div className="text-sm">ElevenLabs</div>
                  <div className="text-xs text-gray-500">High quality</div>
                </button>
              </div>
            </div>

            {/* ElevenLabs Voice Selection */}
            {provider === 'elevenlabs' && (
              <div className="bg-white rounded-lg shadow p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Voice Selection
                </label>
                <select
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <optgroup label="Custom Voices">
                    {['CUSTOM', 'DZULU', 'DZULU2', 'NEW'].map(key => (
                      <option key={key} value={ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].id}>
                        {ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Built-in Voices">
                    {['ADAM', 'JOSH', 'SAM', 'ANTONI', 'BELLA', 'RACHEL', 'DOMI', 'ELLI'].map(key => (
                      <option key={key} value={ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].id}>
                        {ELEVENLABS_VOICES[key as keyof typeof ELEVENLABS_VOICES].name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Voice ID: <code className="bg-gray-100 px-1 py-0.5 rounded">{voiceId}</code>
                </p>
              </div>
            )}

            {/* Slides */}
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
                className={`w-full mt-4 px-4 py-3 text-white rounded-lg font-medium ${
                  provider === 'elevenlabs'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                🔧 Generate {provider === 'elevenlabs' ? 'ElevenLabs' : 'Edge-TTS'} Script
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
                <p>Select provider, enter slide texts and click Generate Script</p>
              </div>
            )}

            {generatedScript && (
              <div className={`mt-4 p-4 rounded-lg ${
                provider === 'elevenlabs' ? 'bg-purple-50' : 'bg-blue-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  provider === 'elevenlabs' ? 'text-purple-900' : 'text-blue-900'
                }`}>
                  📖 How to use:
                </h3>
                <ol className={`text-sm space-y-1 list-decimal list-inside ${
                  provider === 'elevenlabs' ? 'text-purple-800' : 'text-blue-800'
                }`}>
                  <li>Copy or download the script</li>
                  <li>Save it to <code className={`px-1 rounded ${
                    provider === 'elevenlabs' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>scripts/generate-lesson{lessonNumber}-audio-{provider}.js</code></li>
                  {provider === 'elevenlabs' ? (
                    <>
                      <li>Make sure axios is installed: <code className="bg-purple-100 px-1 rounded">npm install axios</code></li>
                      <li>Run: <code className="bg-purple-100 px-1 rounded">node scripts/generate-lesson{lessonNumber}-audio-elevenlabs.js</code></li>
                    </>
                  ) : (
                    <>
                      <li>Make sure edge-tts is installed: <code className="bg-blue-100 px-1 rounded">pip3 install edge-tts</code></li>
                      <li>Run: <code className="bg-blue-100 px-1 rounded">node scripts/generate-lesson{lessonNumber}-audio-edge-tts.js</code></li>
                    </>
                  )}
                  <li>Push to git: <code className={`px-1 rounded ${
                    provider === 'elevenlabs' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>git add . && git commit -m &quot;Add lesson{lessonNumber} audio&quot; && git push</code></li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
