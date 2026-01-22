// Google Cloud TTS API Endpoint
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, languageCode = 'en-US', voiceName = 'en-US-Neural2-D', ssmlGender = 'MALE' } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Google Cloud TTS REST API
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_CLOUD_TTS_API_KEY}`,
      {
        input: {
          text: text
        },
        voice: {
          languageCode: languageCode,
          name: voiceName,
          ssmlGender: ssmlGender
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
          volumeGainDb: 0.0
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    // Return base64 audio data
    return NextResponse.json({
      audioContent: response.data.audioContent,
      audioUrl: `data:audio/mp3;base64,${response.data.audioContent}`
    })

  } catch (error: any) {
    console.error('TTS API Error:', error.response?.data || error.message)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        details: error.response?.data?.error?.message || error.message
      },
      { status: 500 }
    )
  }
}