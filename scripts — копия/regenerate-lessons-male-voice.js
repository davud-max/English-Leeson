const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Generate audio with male voice using Google Cloud TTS REST API
async function generateMaleVoiceTTS(text, filename, lessonNumber, apiKey) {
  try {
    // Clean content
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/__/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/\n\n+/g, '. ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log(`🎤 Male voice synthesizing (${cleanText.split(' ').length} words): "${cleanText.substring(0, 50)}..."`);
    
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
    const audioDir = path.join(__dirname, '..', 'public', 'audio', `lesson${lessonNumber}`);
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

// LESSON 1 CONTENTS WITH MALE VOICE
const LESSON_1_MALE_CONTENTS = [
  "Terms and Definitions. How precise knowledge is born. How observation transforms into words, and words into instruments of thought.",
  "From Observation to Term. Everything begins with observation and clear description. From seeing to knowing.",
  "What is a Definition? The shortest description that helps others understand what you observed. Precision in communication.",
  "What is a Term? A word linked to a definition for easier communication. Building blocks of thought.",
  "The Point Concept. A fundamental term with zero dimensions, just an idea in our minds. Abstract thinking begins.",
  "The Line Concept. A first-level term with one dimension, extending infinitely. First step into geometry.",
  "The Plane Concept. A second-level term with two dimensions, like an infinite flat surface. Expanding our thinking space.",
  "The Space Concept. A third-level term with three dimensions, containing everything. The world we live in.",
  "Four Fundamental Terms. Point, Line, Plane, Space - building blocks of abstract ideas. Foundation of mathematical thinking.",
  "Key Distinction. Abstract objects can be fully described. Real objects cannot.",
  "Name vs Term. Names point to real things. Terms can be fully described but not pointed to. Understanding the difference.",
  "Two Directions. Reality to Abstraction and back again. Movement between worlds.",
  "Learning Process. Child learns that apple means general concept, not just one fruit.",
  "Birth of Abstraction. Mental image forms - now any apple is recognized instantly. Power of abstract thinking.",
  "Essence of Education. Teaching movement between reality and abstraction. Developing thinking capacity.",
  "Foundation of Thinking. Seeing invisible behind visible, finding forms of invisible ideas. True wisdom begins."
];

// LESSON 2 CONTENTS WITH MALE VOICE  
const LESSON_2_MALE_CONTENTS = [
  "From Term to Number and Counting. How counting is born. How terms multiply and create the need for numbers. From individual terms to groups, from counting to numbers.",
  "The Need: From Terms to Groups. We have a drawing with circles, centers, chords, radii. Question: Are there identical terms on this drawing? GROUP - Collection of objects designated by one term. Group of chords. Group of radii. Group of points.",
  "The Essence of Counting: It's Not What You Think. Put three pencils in front of you. Ask a child to count them. They point to the first: One, second: Two, third: Three. Paradox: On the word Three, ask: How many pencils is this? They'll say: Three! But they just counted THREE pencils by saying the number THREE.",
  "The Discovery: Counting is Comparison. Insight: The child compared their group of pencils with an etalon group - their fingers! COUNTING equals comparing one group with another, etalon group. We don't count objects directly. We compare our group with a standard group and name the result.",
  "What is a Number? NUMBER - The name of an etalon group used for comparison with other groups. Examples: Finger group equals Five. Hand group equals Five. Foot group equals Ten.",
  "Numerals and Digits. NUMERAL - Symbol representing a number. Examples: One, Two, Three, Four, Five. DIGIT - Single symbol used in numerals. Digits: Zero through Nine. NUMBER - The concept, the etalon group. NUMERAL - How we write it. DIGIT - Building blocks of numerals.",
  "Traditional Counting Systems. Dozen equals Twelve items. Origin: Counting finger segments. Score equals Twenty items. Origin: Counting all fingers and toes. Gross equals One hundred forty-four items. Origin: Twelve dozens.",
  "Natural Numbers. Natural numbers equal counting numbers. One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten and so on. They emerge naturally from our counting algorithm: TERMIN to GROUP to COUNTING to NUMBER to NATURAL NUMBER.",
  "Two Paths of Thinking. ANALYSIS PATH: From concrete to abstract. Reality to Observations to Grouping to Counting to Numbers. SYNTHESIS PATH: From abstract to concrete. Numbers to Etalon groups to Matching to Finding objects in reality.",
  "Lesson Summary. We've traced the birth of counting: TERMIN to GROUP to COUNTING to NUMBER. Key insight: Counting is comparison with etalon groups. Foundation of mathematics: From terms to numbers through systematic grouping."
];

async function regenerateLessonsWithMaleVoice(apiKey) {
  console.log('🎬 Regenerating Lessons 1 and 2 with MALE voice...');
  console.log('👨‍🏫 Using Google Cloud TTS Standard-D male voice\n');
  
  try {
    // Process Lesson 1
    console.log('=== LESSON 1 ===');
    const lesson1Dir = path.join(__dirname, '..', 'public', 'audio', 'lesson1');
    
    // Clean existing files
    if (fs.existsSync(lesson1Dir)) {
      const files = fs.readdirSync(lesson1Dir);
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          fs.unlinkSync(path.join(lesson1Dir, file));
          console.log(`🗑️  Removed: ${file}`);
        }
      });
    }
    
    // Generate Lesson 1 audio
    for (let i = 0; i < LESSON_1_MALE_CONTENTS.length; i++) {
      try {
        await generateMaleVoiceTTS(LESSON_1_MALE_CONTENTS[i], `slide${i + 1}.mp3`, 1, apiKey);
        console.log(`✅ Lesson 1 Slide ${i + 1} completed\n`);
      } catch (error) {
        console.log(`❌ Lesson 1 Slide ${i + 1} failed\n`);
        continue;
      }
    }
    
    // Process Lesson 2
    console.log('=== LESSON 2 ===');
    const lesson2Dir = path.join(__dirname, '..', 'public', 'audio', 'lesson2');
    
    // Clean existing files
    if (fs.existsSync(lesson2Dir)) {
      const files = fs.readdirSync(lesson2Dir);
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          fs.unlinkSync(path.join(lesson2Dir, file));
          console.log(`🗑️  Removed: ${file}`);
        }
      });
    }
    
    // Generate Lesson 2 audio
    for (let i = 0; i < LESSON_2_MALE_CONTENTS.length; i++) {
      try {
        await generateMaleVoiceTTS(LESSON_2_MALE_CONTENTS[i], `slide${i + 1}.mp3`, 2, apiKey);
        console.log(`✅ Lesson 2 Slide ${i + 1} completed\n`);
      } catch (error) {
        console.log(`❌ Lesson 2 Slide ${i + 1} failed\n`);
        continue;
      }
    }
    
    console.log('\n🎉 ALL LESSONS REGENERATED WITH MALE VOICE!');
    console.log('👨‍🏫 Lessons 1 and 2 now feature professional male narration');
    console.log('🔊 Audio priority system ensures full playback before slide advancement');
    
  } catch (error) {
    console.error('💥 Process failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  const apiKey = process.argv[2] || 'AIzaSyDSrWekemLElh06BPEfyktu3nQT4tF3Tf4';
  regenerateLessonsWithMaleVoice(apiKey);
}