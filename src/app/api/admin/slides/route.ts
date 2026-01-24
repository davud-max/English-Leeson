import { NextResponse } from 'next/server'
import { readFileSync, readdirSync, existsSync } from 'fs'
import path from 'path'

// Get list of all lessons with basic info
export async function GET() {
  try {
    const lessonsDir = path.join(process.cwd(), 'src/app/(course)/lessons')
    
    // Check if directory exists
    if (!existsSync(lessonsDir)) {
      return NextResponse.json([])
    }
    
    const items = readdirSync(lessonsDir, { withFileTypes: true })
    const lessonFolders = items
      .filter(item => item.isDirectory() && /^\d+$/.test(item.name))
      .map(item => parseInt(item.name))
      .sort((a, b) => a - b)
    
    const lessons = lessonFolders.map(num => {
      const pagePath = path.join(lessonsDir, num.toString(), 'page.tsx')
      let title = `Lesson ${num}`
      let slidesCount = 0
      
      try {
        if (existsSync(pagePath)) {
          const content = readFileSync(pagePath, 'utf-8')
          
          // Extract title from first slide
          const titleMatch = content.match(/title:\s*["']([^"']+)["']/)
          if (titleMatch) {
            title = titleMatch[1]
          }
          
          // Count slides
          const slidesMatch = content.match(/{\s*id:\s*\d+/g)
          if (slidesMatch) {
            slidesCount = slidesMatch.length
          }
        }
      } catch (e) {
        // Ignore file read errors
      }
      
      return {
        id: num,
        title,
        slidesCount
      }
    })
    
    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error reading lessons:', error)
    return NextResponse.json({ error: 'Failed to read lessons' }, { status: 500 })
  }
}
