// Alternative TTS services that work without geographic restrictions
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export class TTSService {
  private services = {
    // Google Translate TTS (free, no API key needed)
    google: {
      baseUrl: 'https://translate.google.com/translate_tts',
      maxLength: 200 // chars
    },
    
    // OpenAI TTS (if you have OpenAI API key)
    openai: {
      baseUrl: 'https://api.openai.com/v1/audio/speech'
    }
  };

  async generateWithGoogleTTS(text: string, filename: string): Promise<string> {
    try {
      // Split long text into chunks
      const chunks = this.splitTextIntoChunks(text, this.services.google.maxLength);
      const audioBuffers: Buffer[] = [];
      
      for (let i = 0; i < chunks.length; i++) {
        console.log(`Generating chunk ${i + 1}/${chunks.length}...`);
        
        const response = await axios.get(this.services.google.baseUrl, {
          params: {
            ie: 'UTF-8',
            q: chunks[i],
            tl: 'en',
            total: chunks.length,
            idx: i,
            textlen: chunks[i].length,
            client: 'tw-ob'
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          responseType: 'arraybuffer'
        });
        
        audioBuffers.push(Buffer.from(response.data));
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Combine all chunks
      const combinedBuffer = Buffer.concat(audioBuffers);
      
      // Save file
      const audioDir = path.join(process.cwd(), 'public', 'audio', 'lesson1');
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      
      const filePath = path.join(audioDir, filename);
      fs.writeFileSync(filePath, combinedBuffer);
      
      console.log(`✅ Audio saved: ${filePath}`);
      return filePath;
      
    } catch (error) {
      console.error('Google TTS failed:', error);
      throw error;
    }
  }

  async generateWithOpenAITTS(text: string, filename: string, apiKey: string): Promise<string> {
    try {
      const response = await axios.post(
        this.services.openai.baseUrl,
        {
          model: 'tts-1',
          input: text,
          voice: 'alloy' // or 'echo', 'fable', 'onyx', 'nova', 'shimmer'
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );
      
      // Save file
      const audioDir = path.join(process.cwd(), 'public', 'audio', 'lesson1');
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      
      const filePath = path.join(audioDir, filename);
      fs.writeFileSync(filePath, Buffer.from(response.data));
      
      console.log(`✅ OpenAI Audio saved: ${filePath}`);
      return filePath;
      
    } catch (error) {
      console.error('OpenAI TTS failed:', error);
      throw error;
    }
  }

  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }
}

// Usage examples
const ttsService = new TTSService();

// Generate audio using Google TTS (no API key needed)
export async function generateLesson1WithGoogleTTS() {
  const slideTexts = [
    "Terms and Definitions. How precise knowledge is born. How observation transforms into words.",
    "From Observation to Term. Everything begins with observation and clear description.",
    "What is a Definition? The shortest description that helps others understand what you observed.",
    "What is a Term? A word linked to a definition for easier communication.",
    "The Point Concept. A fundamental term with zero dimensions, just an idea in our minds.",
    "The Line Concept. A first-level term with one dimension, extending infinitely.",
    "The Plane Concept. A second-level term with two dimensions, like an infinite flat surface.",
    "The Space Concept. A third-level term with three dimensions, containing everything.",
    "Four Fundamental Terms. Point, Line, Plane, Space - building blocks of abstract ideas.",
    "Key Distinction. Abstract objects can be fully described. Real objects cannot.",
    "Name vs Term. Names point to real things. Terms can be fully described but not pointed to.",
    "Two Directions. Reality to Abstraction and back again.",
    "Learning Process. Child learns that apple means general concept, not just one fruit.",
    "Birth of Abstraction. Mental image forms - now any apple is recognized instantly.",
    "Essence of Education. Teaching movement between reality and abstraction.",
    "Foundation of Thinking. Seeing invisible behind visible, finding forms of invisible ideas."
  ];

  console.log('🎬 Starting Google TTS generation for Lesson 1...');
  
  try {
    for (let i = 0; i < slideTexts.length; i++) {
      await ttsService.generateWithGoogleTTS(slideTexts[i], `slide${i + 1}.mp3`);
      console.log(`✅ Generated slide ${i + 1}/${slideTexts.length}`);
    }
    
    console.log('🎉 All slides generated successfully with Google TTS!');
    
  } catch (error) {
    console.error('💥 Generation failed:', error);
  }
}

// If you have OpenAI API key
export async function generateLesson1WithOpenAI(openaiApiKey: string) {
  const slideTexts = [
    // Same texts as above
  ];
  
  // Implementation similar to Google TTS but using OpenAI
}