// API for generating TTS audio using edge-tts (same voice as lessons)
// This requires edge-tts to be installed: pip install edge-tts

import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const execPromise = promisify(exec)

const VOICE = 'en-US-GuyNeural'
const RATE = '-5%'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Create temp directory if not exists
    const tempDir = path.join(process.cwd(), 'tmp')
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true })
    }

    const filename = `tts-${randomUUID()}.mp3`
    const filepath = path.join(tempDir, filename)

    // Escape text for command line
    const escapedText = text
      .replace(/"/g, '\\"')
      .replace(/'/g, "'\\''")
      .replace(/\n/g, ' ')
      .substring(0, 2000) // Limit length

    try {
      // Try using edge-tts
      const command = `edge-tts --voice "${VOICE}" --rate="${RATE}" --text "${escapedText}" --write-media "${filepath}"`
      await execPromise(command, { timeout: 30000 })

      // Read the generated file
      const { readFile } = await import('fs/promises')
      const audioBuffer = await readFile(filepath)
      
      // Clean up temp file
      await unlink(filepath).catch(() => {})

      // Return audio as base64
      const base64Audio = audioBuffer.toString('base64')
      
      return NextResponse.json({
        success: true,
        audio: base64Audio,
        contentType: 'audio/mpeg',
      })
    } catch (edgeTtsError) {
      console.log('edge-tts not available, returning text for browser TTS:', edgeTtsError)
      
      // Fallback: return null audio, client will use browser TTS
      return NextResponse.json({
        success: true,
        audio: null,
        fallback: true,
        text: text,
      })
    }
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json(
      { error: 'TTS failed', fallback: true },
      { status: 500 }
    )
  }
}
