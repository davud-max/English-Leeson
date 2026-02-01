import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// GET /api/audio/lesson1/slide1.mp3
export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    // Build the path from the URL segments
    const audioPath = params.path.join('/');
    
    // Security: prevent directory traversal
    if (audioPath.includes('..') || audioPath.includes('://')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    
    // Build the full path to the audio file
    const audioFilePath = path.join(process.cwd(), 'public', 'audio', audioPath);
    
    // Check if file exists
    if (!fs.existsSync(audioFilePath)) {
      console.log('Audio file not found:', audioFilePath);
      return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(audioFilePath);
    
    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving audio file:', error);
    return NextResponse.json({ error: 'Failed to serve audio' }, { status: 500 });
  }
}