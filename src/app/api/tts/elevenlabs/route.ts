// ElevenLabs TTS API Endpoint
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const ELEVENLABS_API_KEY = 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274'
const PROXY_URL = 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      text, 
      voiceId = 'pNInz6obpgDQGcFmaJgB', // Adam by default
      stability = 0.5,
      similarityBoost = 0.75 
    } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Check text length
    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 5000 characters.' },
        { status: 400 }
      )
    }

    console.log('Generating audio with ElevenLabs:', {
      textLength: text.length,
      voiceId: voiceId.substring(0, 8) + '...'
    })

    // Call ElevenLabs via proxy
    const response = await axios.post(
      PROXY_URL,
      {
        apiKey: ELEVENLABS_API_KEY,
        voiceId: voiceId,
        text: text,
        stability: stability,
        similarity_boost: similarityBoost
      },
      {
        timeout: 180000, // 3 minutes
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.success && response.data.audio) {
      // Return base64 audio
      return NextResponse.json({
        success: true,
        audio: response.data.audio,
        contentType: 'audio/mpeg'
      })
    } else {
      throw new Error(response.data.error || 'Failed to generate audio')
    }

  } catch (error: any) {
    console.error('ElevenLabs TTS Error:', error.response?.data || error.message)
    
    // Return detailed error
    return NextResponse.json(
      { 
        error: 'Failed to generate speech with ElevenLabs',
        details: error.response?.data?.error || error.message,
        success: false
      },
      { status: 500 }
    )
  }
}
