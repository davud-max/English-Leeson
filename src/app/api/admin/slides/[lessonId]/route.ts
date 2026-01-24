import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'

interface Slide {
  id: number
  title: string
  content: string
  emoji: string
  duration: number
}

// Parse slides from page.tsx content
function parseSlides(content: string): Slide[] {
  const slides: Slide[] = []
  
  // Find the SLIDES array
  const slidesMatch = content.match(/const\s+LESSON_\d+_SLIDES\s*=\s*\[([\s\S]*?)\];/)
  if (!slidesMatch) return slides
  
  const slidesContent = slidesMatch[1]
  
  // Parse each slide object
  const slideRegex = /{\s*id:\s*(\d+),\s*title:\s*["']([^"']+)["'],\s*content:\s*[`"']([^`"']*(?:[`"'][^`"']*)*)[`"'],\s*emoji:\s*["']([^"']+)["'],\s*duration:\s*(\d+)\s*}/gs
  
  let match
  while ((match = slideRegex.exec(slidesContent)) !== null) {
    slides.push({
      id: parseInt(match[1]),
      title: match[2],
      content: match[3].replace(/\\n/g, '\n').replace(/\\`/g, '`'),
      emoji: match[4],
      duration: parseInt(match[5])
    })
  }
  
  return slides
}

// GET slides for a specific lesson
export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lessonId = params.lessonId
    const pagePath = path.join(
      process.cwd(),
      'src/app/(course)/lessons',
      lessonId,
      'page.tsx'
    )
    
    if (!existsSync(pagePath)) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }
    
    const content = readFileSync(pagePath, 'utf-8')
    const slides = parseSlides(content)
    
    return NextResponse.json({
      lessonId: parseInt(lessonId),
      slides
    })
  } catch (error) {
    console.error('Error reading slides:', error)
    return NextResponse.json({ error: 'Failed to read slides' }, { status: 500 })
  }
}

// PUT - Update slides for a lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lessonId = params.lessonId
    const { slides } = await request.json() as { slides: Slide[] }
    
    const pagePath = path.join(
      process.cwd(),
      'src/app/(course)/lessons',
      lessonId,
      'page.tsx'
    )
    
    if (!existsSync(pagePath)) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }
    
    let content = readFileSync(pagePath, 'utf-8')
    
    // Generate new slides code
    const slidesCode = slides.map(slide => `  {
    id: ${slide.id},
    title: "${slide.title.replace(/"/g, '\\"')}",
    content: \`${slide.content.replace(/`/g, '\\`')}\`,
    emoji: "${slide.emoji}",
    duration: ${slide.duration}
  }`).join(',\n')
    
    const newSlidesArray = `const LESSON_${lessonId}_SLIDES = [\n${slidesCode}\n];`
    
    // Replace the old slides array
    content = content.replace(
      /const\s+LESSON_\d+_SLIDES\s*=\s*\[[\s\S]*?\];/,
      newSlidesArray
    )
    
    writeFileSync(pagePath, content, 'utf-8')
    
    return NextResponse.json({ success: true, slidesCount: slides.length })
  } catch (error) {
    console.error('Error saving slides:', error)
    return NextResponse.json({ error: 'Failed to save slides' }, { status: 500 })
  }
}
