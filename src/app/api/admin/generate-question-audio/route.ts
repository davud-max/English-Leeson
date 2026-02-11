// API endpoint for generating question audio using ElevenLabs
import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274'
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB' // Adam voice
const PROXY_URL = 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs'
const ELEVENLABS_DIRECT_URL = 'https://api.elevenlabs.io/v1/text-to-speech'

interface Question {
  id: number
  question: string
}

// Generate via proxy
async function generateViaProxy(text: string, voiceId: string): Promise<string> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: ELEVENLABS_API_KEY,
      voiceId: voiceId,
      text: text,
      stability: 0.5,
      similarity_boost: 0.75,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Proxy error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  if (!data.success || !data.audio) {
    throw new Error(data.error || 'No audio returned from proxy')
  }

  return data.audio
}

// Generate via direct ElevenLabs API
async function generateViaDirect(text: string, voiceId: string): Promise<string> {
  const response = await fetch(`${ELEVENLABS_DIRECT_URL}/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return buffer.toString('base64')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, questions, adminKey, voiceId = 'pNInz6obpgDQGcFmaJgB' } = body // Используем Adam как голос по умолчанию

    // Verify admin key
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 403 }
      )
    }

    if (!lessonId || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Invalid request. Need lessonId and questions array.' },
        { status: 400 }
      )
    }

    console.log(`🎤 Starting audio generation for Lesson ${lessonId} questions...`)
    console.log(`🔊 Using voice ID: ${voiceId}`)

    const results = []
    let successCount = 0
    let failCount = 0

    // Generate audio for each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const questionText = `Question ${i + 1}. ${question.question}`
      const filename = `question${i + 1}.mp3`

      console.log(`🔊 Generating ${i + 1}/${questions.length}: ${filename}`)

      try {
        // Try proxy first, then direct API
        let audioBase64: string
        try {
          audioBase64 = await generateViaProxy(questionText, voiceId)
        } catch (proxyError) {
          console.log('Proxy failed, trying direct API...', proxyError)
          audioBase64 = await generateViaDirect(questionText, voiceId)
        }
        
        const sizeKB = Math.round((audioBase64.length * 3 / 4) / 1024)
        console.log(`✅ Generated: ${filename} (${sizeKB}KB)`)
        
        results.push({
          question: i + 1,
          filename,
          success: true,
          size: sizeKB,
          audioBase64,
          audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
        })
        successCount++

        // Pause between requests to avoid rate limiting
        if (i < questions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

      } catch (error: any) {
        console.error(`❌ Failed ${filename}:`, error.message)
        results.push({
          question: i + 1,
          filename,
          success: false,
          error: error.message
        })
        failCount++
      }
    }

    console.log(`🎉 Audio generation complete! Success: ${successCount}, Failed: ${failCount}`)

    return NextResponse.json({
      success: true,
      message: `Generated ${successCount} audio files (${failCount} failed)`,
      results,
      lessonId,
    })

  } catch (error: any) {
    console.error('Question audio generation error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate question audio',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
