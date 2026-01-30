// API endpoint for generating question audio using ElevenLabs
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const ELEVENLABS_API_KEY = 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274'
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB' // Adam voice
const PROXY_URL = 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs'

interface Question {
  id: number
  question: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, questions, adminKey } = body

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

    // Setup audio directory
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'questions', `lesson${lessonId}`)
    
    // Delete old audio files first
    if (existsSync(audioDir)) {
      console.log('🗑️  Cleaning old question audio files...')
      const files = await readdir(audioDir)
      for (const file of files) {
        if (file.endsWith('.mp3')) {
          await unlink(path.join(audioDir, file))
          console.log(`   Deleted: ${file}`)
        }
      }
    } else {
      await mkdir(audioDir, { recursive: true })
    }

    const results = []
    let successCount = 0
    let failCount = 0

    // Generate audio for each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const questionText = `Question ${i + 1}. ${question.question}`
      const filename = `question${i + 1}.mp3`
      const filepath = path.join(audioDir, filename)

      console.log(`🔊 Generating ${i + 1}/${questions.length}: ${filename}`)

      try {
        // Call ElevenLabs API
        const response = await fetch(PROXY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: ELEVENLABS_API_KEY,
            voiceId: VOICE_ID,
            text: questionText,
            stability: 0.5,
            similarity_boost: 0.75
          }),
        })

        const data = await response.json()

        if (data.success && data.audio) {
          // Save audio file
          const audioBuffer = Buffer.from(data.audio, 'base64')
          await writeFile(filepath, audioBuffer)
          
          const sizeKB = Math.round(audioBuffer.length / 1024)
          console.log(`✅ Generated: ${filename} (${sizeKB}KB)`)
          
          results.push({
            question: i + 1,
            filename,
            success: true,
            size: sizeKB
          })
          successCount++
        } else {
          throw new Error(data.error || 'Failed to generate audio')
        }

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
      audioPath: `/audio/questions/lesson${lessonId}/`
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
