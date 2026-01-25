// API to get pre-generated questions for a lesson
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get('lessonId')
  
  if (!lessonId) {
    return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 })
  }

  try {
    // Fetch questions from static JSON file
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/data/questions/lesson${lessonId}.json`)
    
    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'Questions not found for this lesson',
        questions: [] 
      }, { status: 404 })
    }

    const data = await response.json()
    
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
      error: 'Questions not available',
      questions: [] 
    }, { status: 500 })
  }
}
