import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// GET /api/audio/lesson1/slide1.mp3
export async function GET(
  request: Request,
  { params }: { params: { lesson: string; slide: string } }
) {
  try {
    const lesson = params.lesson;
    const slide = params.slide; // e.g., "slide1.mp3"
    
    // Security: prevent directory traversal
    if (lesson.includes('..') || slide.includes('..') || 
        lesson.includes('://') || slide.includes('://')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    
    // Build the path to the audio file
    const audioFilePath = path.join(process.cwd(), 'public', 'audio', lesson, slide);
    
    console.log('API: Looking for audio file:', audioFilePath);
    
    // Check if file exists
    if (!fs.existsSync(audioFilePath)) {
      console.log('API: Audio file not found:', audioFilePath);
      return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(audioFilePath);
    console.log('API: Serving audio file, size:', fileBuffer.length);
    
    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('API: Error serving audio file:', error);
    return NextResponse.json({ error: 'Failed to serve audio' }, { status: 500 });
  }
}