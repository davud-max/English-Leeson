// API for creating lesson files on the server
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

interface CreateLessonRequest {
  adminKey: string
  action: string
  lessonNumber?: number
  lessonTitle?: string
  lessonDescription?: string
  lessonColor?: string
  lessonDuration?: number
  questions?: Array<{
    id: number
    question: string
    correct_answer: string
    difficulty: string
    points: number
  }>
  pageCode?: string
  audioScript?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateLessonRequest = await request.json()
    const { adminKey, action, lessonNumber } = body

    // Admin authentication
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const baseDir = process.cwd()

    // Action: Create page.tsx
    if (action === 'create_page' && lessonNumber && body.pageCode) {
      const lessonDir = path.join(baseDir, 'src', 'app', '(course)', 'lessons', String(lessonNumber))
      
      if (!existsSync(lessonDir)) {
        await mkdir(lessonDir, { recursive: true })
      }

      const pageFile = path.join(lessonDir, 'page.tsx')
      await writeFile(pageFile, body.pageCode, 'utf8')

      return NextResponse.json({
        success: true,
        message: `Created page.tsx for lesson ${lessonNumber}`,
        path: `src/app/(course)/lessons/${lessonNumber}/page.tsx`
      })
    }

    // Action: Create audio script
    if (action === 'create_audio_script' && lessonNumber && body.audioScript) {
      const scriptsDir = path.join(baseDir, 'scripts')
      
      if (!existsSync(scriptsDir)) {
        await mkdir(scriptsDir, { recursive: true })
      }

      const scriptFile = path.join(scriptsDir, `generate-lesson${lessonNumber}-audio.js`)
      await writeFile(scriptFile, body.audioScript, 'utf8')

      return NextResponse.json({
        success: true,
        message: `Created audio script for lesson ${lessonNumber}`,
        path: `scripts/generate-lesson${lessonNumber}-audio.js`
      })
    }

    // Action: Create questions JSON
    if (action === 'create_questions' && lessonNumber && body.questions) {
      const questionsDir = path.join(baseDir, 'public', 'data', 'questions')
      
      if (!existsSync(questionsDir)) {
        await mkdir(questionsDir, { recursive: true })
      }

      const questionsFile = path.join(questionsDir, `lesson${lessonNumber}.json`)
      await writeFile(questionsFile, JSON.stringify({
        lessonId: lessonNumber,
        lessonTitle: body.lessonTitle || `Lesson ${lessonNumber}`,
        generatedAt: new Date().toISOString(),
        questions: body.questions,
      }, null, 2), 'utf8')

      return NextResponse.json({
        success: true,
        message: `Created questions for lesson ${lessonNumber}`,
        path: `public/data/questions/lesson${lessonNumber}.json`
      })
    }

    // Action: Update lessons list
    if (action === 'update_lessons_list' && lessonNumber) {
      const lessonsPagePath = path.join(baseDir, 'src', 'app', '(course)', 'lessons', 'page.tsx')
      
      let content = await readFile(lessonsPagePath, 'utf8')
      
      // Find the LESSONS array and add new lesson
      const newLessonEntry = `  { 
    order: ${lessonNumber}, 
    title: '${body.lessonTitle || `Lesson ${lessonNumber}`}', 
    description: '${body.lessonDescription || ''}',
    duration: ${body.lessonDuration || 25},
    available: true,
    color: '${body.lessonColor || 'from-blue-500 to-indigo-600'}'
  },`

      // Check if lesson already exists
      if (content.includes(`order: ${lessonNumber},`)) {
        return NextResponse.json({
          success: true,
          message: `Lesson ${lessonNumber} already exists in list`,
          alreadyExists: true
        })
      }

      // Find position to insert (before the closing bracket of LESSONS array)
      const lessonsArrayMatch = content.match(/const LESSONS = \[([\s\S]*?)\n\]/m)
      if (lessonsArrayMatch) {
        const arrayContent = lessonsArrayMatch[1]
        const lastBraceIndex = arrayContent.lastIndexOf('},')
        
        if (lastBraceIndex !== -1) {
          const insertPosition = content.indexOf(arrayContent) + lastBraceIndex + 2
          content = content.slice(0, insertPosition) + '\n' + newLessonEntry + content.slice(insertPosition)
        }
      }

      // Update statistics
      const availableCount = (content.match(/available: true/g) || []).length + 1
      const totalCount = (content.match(/order: \d+/g) || []).length + 1
      const lockedCount = totalCount - availableCount
      const progressPercent = Math.round((availableCount / totalCount) * 100)

      // Update progress text
      content = content.replace(
        /\d+ of \d+ lessons available/,
        `${availableCount} of ${totalCount} lessons available`
      )
      content = content.replace(
        /<div className="text-3xl font-bold text-blue-600">\d+<\/div>\s*<div className="text-sm text-gray-500">Available<\/div>/,
        `<div className="text-3xl font-bold text-blue-600">${availableCount}</div>\n                <div className="text-sm text-gray-500">Available</div>`
      )
      content = content.replace(
        /<div className="text-3xl font-bold text-gray-400">\d+<\/div>\s*<div className="text-sm text-gray-500">Locked<\/div>/,
        `<div className="text-3xl font-bold text-gray-400">${lockedCount}</div>\n                <div className="text-sm text-gray-500">Locked</div>`
      )
      content = content.replace(
        /width: '\d+%'/,
        `width: '${progressPercent}%'`
      )
      content = content.replace(
        /Unlock All \d+ Lessons/,
        `Unlock All ${totalCount} Lessons`
      )

      await writeFile(lessonsPagePath, content, 'utf8')

      return NextResponse.json({
        success: true,
        message: `Added lesson ${lessonNumber} to lessons list`,
        stats: { available: availableCount, total: totalCount, locked: lockedCount }
      })
    }

    // Action: Create audio directory placeholder
    if (action === 'create_audio_dir' && lessonNumber) {
      const audioDir = path.join(baseDir, 'public', 'audio', `lesson${lessonNumber}`)
      
      if (!existsSync(audioDir)) {
        await mkdir(audioDir, { recursive: true })
        await writeFile(
          path.join(audioDir, '.gitkeep'), 
          `# Audio files will be generated using edge-tts\n# Run: node scripts/generate-lesson${lessonNumber}-audio.js\n`
        )
      }

      return NextResponse.json({
        success: true,
        message: `Created audio directory for lesson ${lessonNumber}`,
        path: `public/audio/lesson${lessonNumber}/`
      })
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 })

  } catch (error) {
    console.error('Create lesson error:', error)
    return NextResponse.json(
      { error: 'Failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
