// API to get pre-generated questions for a lesson
import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get('lessonId')
  
  if (!lessonId) {
    return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 })
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'questions', `lesson${lessonId}.json`)
    const fileRaw = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileRaw)
    
    return NextResponse.json({
      success: true,
      lessonId: data.lessonId,
      lessonTitle: data.lessonTitle,
      questions: data.questions,
      count: data.questions?.length || 0,
    })

  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Questions not found for this lesson',
      questions: [] 
    }, { status: 404 })
  }
}
