// Public TTS endpoint - generates audio on-the-fly using ElevenLabs
import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274'
const DEFAULT_VOICE_ID = 'erDx71FK2teMZ7g6khzw' // New Voice
const PROXY_URL = 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs'

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json()

    if (!text || text.trim().length < 2) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Limit text length
    const cleanText = text.trim().substring(0, 3000)
    const voice = voiceId || DEFAULT_VOICE_ID

    const requestId = `tts-${Date.now()}-${voice}`
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: ELEVENLABS_API_KEY,
        voiceId: voice,
        voice_id: voice,
        voice: voice,
        text: cleanText,
        stability: 0.5,
        similarity_boost: 0.75,
        requestId,
        cacheBust: requestId,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`ElevenLabs proxy error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    if (!data.success || !data.audio) {
      throw new Error(data.error || 'No audio returned')
    }

    return NextResponse.json({
      success: true,
      audioBase64: data.audio,
      audioUrl: `data:audio/mpeg;base64,${data.audio}`,
    })
  } catch (error: any) {
    console.error('TTS error:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
