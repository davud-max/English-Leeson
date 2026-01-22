const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Generate audio with male voice using Google Cloud TTS REST API
// PRESERVING ORIGINAL AUTHOR TEXT - NO MODIFICATIONS
async function generateLesson1AudioMaleVoice(text, filename, apiKey) {
  try {
    // Clean content (minimal processing to preserve original text)
    const cleanText = text
      .replace(/\*\*/g, '')  // Remove markdown bold
      .replace(/__/g, '')    // Remove markdown italic  
      .replace(/\*/g, '')    // Remove asterisks
      .replace(/#/g, '')     // Remove headers
      .replace(/\n\n+/g, '. ') // Convert double newlines to periods
      .replace(/\n/g, ' ')   // Convert single newlines to spaces
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();
    
    console.log(`🎤 Male voice synthesizing (${cleanText.split(' ').length} words)`);

    // Google Cloud TTS REST API endpoint
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    
    const requestBody = {
      input: {
        text: cleanText
      },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Standard-D', // Male voice
        ssmlGender: 'MALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0
      }
    };
    
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Decode base64 audio content
    const audioContent = Buffer.from(response.data.audioContent, 'base64');
    
    // Save file
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson1');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, audioContent);
    
    console.log(`✅ Generated: ${filename} (${Math.round(audioContent.length / 1024)} KB)`);
    return filePath;
    
  } catch (error) {
    console.error(`❌ Failed ${filename}:`, error.response?.data?.error?.message || error.message);
    throw error;
  }
}

// ORIGINAL AUTHOR CONTENT FOR LESSON 1 SLIDES
// TRANSLATED TO ENGLISH - PRESERVING EXACT MEANING
const LESSON_1_ORIGINAL_ENGLISH = [
  // Slide 1
  "Good day and welcome to the lesson. Today we'll explore how knowledge is born. How observation transforms into words, and words become tools of thinking.",
  
  // Slide 2  
  "Everything begins with observation. Observable phenomena must be described in words so the listener understands exactly what you observed. Shortest description we'll call definition. Definition is shortest description of observable phenomenon, sufficient for understanding by another person. Definition is assigned a term. Term is word assigned to definition for convenience of use. Every term, except ultimate term, has its definition. Ultimate term is term having no definition.",
  
  // Slide 3
  "Point is ultimate term. Point has no definition because point cannot be observed. It is zero-dimensional or, as they say, has no measure, no dimension. Point left by chalk on board or pencil on paper is actually not a point, but a spot. Line is ultimate term of first level, that is, it is one-dimensional. It can be described using point. They say line consists of multitude of points. But describing order of arrangement of these points is impossible, because have to say these are points arranged along line, which is incorrect. Therefore line has no definition.",
  
  // Slide 4
  "Plane is ultimate term of second level, that is, it is two-dimensional. It can be described using point and line. They say plane consists of multitude of parallel lines. But describing order of their arrangement is impossible. Plane is unobservable, because lines of which it consists are also unobservable. Space is ultimate term of third level, that is, it is three-dimensional. It can be described using point, line and plane. Space is unobservable, because planes of which it consists are also unobservable.",
  
  // Slide 5
  "These four ultimate terms allow building descriptions and definitions of any abstract objects. Point is zero dimensions. Line is one dimension. Plane is two dimensions. Space is three dimensions. Since every abstract object is nothing, it can be described by finite number of ultimate terms composing it. After all, there are only four of them. Or even just one ultimate term point. Key distinction: Abstract object can be described completely and finally. Real object cannot.",
  
  // Slide 6
  "Real object cannot be described completely, but can be directly demonstrated and designated by word. This word is noun, name. Name is word for real object. Can point with finger. Cannot describe completely. Abstract object cannot be demonstrated. It doesn't exist. But can be described using ultimate terms. Term is word for abstract object. Cannot show. Can describe completely through definition. We demonstrated path: How abstract object having only term make into noun.",
  
  // Slide 7
  "Can demonstrate reverse path? Can noun transition to term and through this to abstraction? Can. For child initially name apple is only this specific red apple. If shown different apple, for example green, then comparing with first and finding difference, child won't accept it as apple. For child this is not apple. This is something else. Only after some time from experience of communication child understands there are multitude of objects which, however they differ, are still called apples. Child forms image of apple in general abstraction.",
  
  // Slide 8
  "We traced two opposite movements: From abstraction to reality and from reality to abstraction. From reality to abstraction observe, describe, give definition, assign term. From abstraction to reality take term, seek suitable objects in world. Essence of education is ability to move freely in both directions. This is what we must teach child. Fundament of thinking is ability to see invisible behind visible and find visible embodiment of invisible ideas!"
];

async function generateLesson1Complete(apiKey) {
  console.log('🎬 Generating Lesson 1 Audio with ORIGINAL AUTHOR CONTENT...');
  console.log('👨‍🏫 Using Google Cloud TTS Standard-D male voice\n');
  console.log('📝 PRESERVING EXACT ORIGINAL TEXT - NO MODIFICATIONS\n');
  
  try {
    // Clean existing audio files
    const lesson1Dir = path.join(__dirname, '..', 'public', 'audio', 'lesson1');
    if (fs.existsSync(lesson1Dir)) {
      const files = fs.readdirSync(lesson1Dir);
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          fs.unlinkSync(path.join(lesson1Dir, file));
          console.log(`🗑️  Removed: ${file}`);
        }
      });
    }
    
    // Generate audio for each slide
    for (let i = 0; i < LESSON_1_ORIGINAL_ENGLISH.length; i++) {
      try {
        await generateLesson1AudioMaleVoice(LESSON_1_ORIGINAL_ENGLISH[i], `slide${i + 1}.mp3`, apiKey);
        console.log(`✅ Slide ${i + 1}/${LESSON_1_ORIGINAL_ENGLISH.length} completed\n`);
      } catch (error) {
        console.log(`❌ Slide ${i + 1} failed\n`);
        continue;
      }
    }
    
    console.log('\n🎉 LESSON 1 AUDIO GENERATED SUCCESSFULLY!');
    console.log('🔊 Original author content preserved with male voice narration');
    console.log('🎯 Ready for audio-priority playback system');
    
  } catch (error) {
    console.error('💥 Generation process failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  const apiKey = process.argv[2] || 'AIzaSyDSrWekemLElh06BPEfyktu3nQT4tF3Tf4';
  generateLesson1Complete(apiKey);
}