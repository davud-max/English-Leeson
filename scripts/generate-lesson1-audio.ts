// Script to generate audio for Lesson 1 using ElevenLabs API
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const ELEVENLABS_API_KEY = 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274';
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // English male voice

// Slide texts for Lesson 1
const SLIDE_TEXTS = [
  "🎯 Terms and Definitions. How precise knowledge is born. How observation transforms into words, and words into instruments of thought.",
  
  "🔍 From Observation to Term. Everything begins with observation. What we observe must be described clearly so others can understand exactly what we see.",
  
  "📘 What is a Definition? A definition is the shortest description that helps someone else understand what you observed.",
  
  "🏷️ What is a Term? A term is a word linked to a definition for easier use and communication.",
  
  "📍 The Point Concept. Point is a fundamental term with zero dimensions. It cannot be observed - just an idea in our minds!",
  
  "📏 The Line Concept. Line is a first-level term with one dimension. It's a point that extends, made of infinite unobservable points!",
  
  "📐 The Plane Concept. Plane is a second-level term with two dimensions. Like an infinite flat surface with lines extending sideways!",
  
  "🌌 The Space Concept. Space is a third-level term with three dimensions. The vast container of everything with planes extending in all directions!",
  
  "🔑 Four Fundamental Terms. Point (0D), Line (1D), Plane (2D), Space (3D). These building blocks create all abstract ideas!",
  
  "⚖️ Key Distinction. Abstract objects can be fully described and defined. Real objects cannot be completely described. Reality is infinitely complex!",
  
  "🏷️ vs 📘 Name vs Term. Name points to real things but cannot be fully described. Term cannot point to anything but can be fully described.",
  
  "🔄 Two Directions of Thinking. Reality to Abstraction: Observe, Describe, Define, Term. Abstraction to Reality: Term, Find matching objects.",
  
  "👶 Learning Process Example. Child sees red apple - 'This is apple'. Show green apple - Child: 'Not apple!'. Later understands 'Apple' = general concept.",
  
  "🌱 Birth of Abstraction. Child forms 'apple in general' - an abstraction. Now recognizes any apple instantly! The word transforms from name to term.",
  
  "🎓 Essence of Education. Teaching free movement in both directions: Reality ⇄ Abstraction. Developing ability to translate between worlds.",
  
  "💭 Foundation of Thinking. See invisible behind visible. Find visible forms of invisible ideas. This dual translation ability is foundation of human thinking!"
];

async function generateAudioForSlide(text: string, slideNumber: number): Promise<void> {
  try {
    console.log(`Generating audio for slide ${slideNumber}...`);
    
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    // Create audio directory if it doesn't exist
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'lesson1');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Save audio file
    const filePath = path.join(audioDir, `slide${slideNumber}.mp3`);
    const writer = fs.createWriteStream(filePath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Slide ${slideNumber} audio saved to ${filePath}`);
        resolve();
      });
      writer.on('error', reject);
    });

  } catch (error) {
    console.error(`❌ Failed to generate audio for slide ${slideNumber}:`, error);
    throw error;
  }
}

async function generateAllSlides() {
  console.log('🎬 Starting audio generation for Lesson 1...');
  
  try {
    for (let i = 0; i < SLIDE_TEXTS.length; i++) {
      await generateAudioForSlide(SLIDE_TEXTS[i], i + 1);
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('🎉 All audio files generated successfully!');
    console.log('📁 Files saved to: /public/audio/lesson1/');
    
  } catch (error) {
    console.error('💥 Audio generation failed:', error);
  }
}

// Run the generation
generateAllSlides();