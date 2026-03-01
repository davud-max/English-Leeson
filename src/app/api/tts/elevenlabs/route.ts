// ElevenLabs TTS API Proxy Endpoint
// Vercel is outside Russia, so it can reach ElevenLabs directly
import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274'
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      text, 
      voiceId = 'erDx71FK2teMZ7g6khzw',
      voice_id,
      stability = 0.5,
      similarityBoost,
      similarity_boost = 0.75,
      apiKey
    } = body

    const finalVoiceId = voice_id || voiceId
    const finalSimilarityBoost = similarityBoost || similarity_boost
    const finalApiKey = apiKey || ELEVENLABS_API_KEY

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: 'Text too long. Maximum 5000 characters.' }, { status: 400 })
    }

    console.log('ElevenLabs proxy: generating audio', {
      textLength: text.length,
      voiceId: finalVoiceId
    })

    // Call ElevenLabs directly (Vercel is not geo-blocked)
    const elevenResp = await fetch(`${ELEVENLABS_API_URL}/${finalVoiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': finalApiKey,
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: stability,
          similarity_boost: finalSimilarityBoost,
        },
      }),
      // @ts-ignore
      signal: AbortSignal.timeout(120000),
    })

    if (!elevenResp.ok) {
      const errText = await elevenResp.text()
      console.error('ElevenLabs error:', elevenResp.status, errText)
      return NextResponse.json(
        { error: `ElevenLabs API error: ${elevenResp.status}`, details: errText, success: false },
        { status: 502 }
      )
    }

    const audioBuffer = await elevenResp.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({
      success: true,
      audio: base64Audio,
      contentType: 'audio/mpeg',
    })

  } catch (error: any) {
    console.error('ElevenLabs proxy error:', error.message)
    return NextResponse.json(
      { error: 'Failed to generate speech', details: error.message, success: false },
      { status: 500 }
    )
  }
}
