// Generate Lesson 1 audio using Google TTS (no API key required)
import { generateLesson1WithGoogleTTS } from '../src/lib/alternative-tts';

async function main() {
  console.log('🎵 Starting audio generation with Google TTS...');
  console.log('ℹ️  No API key required - using Google Translate TTS service');
  
  try {
    await generateLesson1WithGoogleTTS();
    console.log('\n✅ Audio generation completed successfully!');
    console.log('📁 Audio files saved to: /public/audio/lesson1/');
    console.log('🎧 You can now test the audio in your lesson!');
    
  } catch (error) {
    console.error('❌ Audio generation failed:', error);
  }
}

main();