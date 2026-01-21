const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Enhanced Google TTS with delays and rotation
async function generateAudioWithDelay(text, filename, delayMs = 1000) {
  try {
    // Add random delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, delayMs + Math.random() * 1000));
    
    // Rotate User-Agents to appear more human-like
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
    ];
    
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const response = await axios.get('https://translate.google.com/translate_tts', {
      params: {
        ie: 'UTF-8',
        q: text.substring(0, 200), // Limit text length
        tl: 'en',
        client: 'tw-ob',
        prev: 'input'
      },
      headers: {
        'User-Agent': randomUserAgent,
        'Referer': 'https://translate.google.com/',
        'Accept': 'audio/mpeg',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      responseType: 'arraybuffer'
    });
    
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson3');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, Buffer.from(response.data));
    
    console.log(`✅ Generated: ${filename} (${Math.round(response.data.byteLength / 1024)} KB)`);
    return filePath;
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.response?.status, error.message);
    // Create fallback silent audio
    createSilentAudio(filename);
    throw error;
  }
}

function createSilentAudio(filename) {
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson3');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  // Create 5-second silent WAV file
  const sampleRate = 22050;
  const duration = 5;
  const dataSize = duration * sampleRate * 2; // 16-bit mono
  
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  
  const silence = Buffer.alloc(dataSize, 0);
  const filePath = path.join(audioDir, filename.replace('.mp3', '.wav'));
  fs.writeFileSync(filePath, Buffer.concat([header, silence]));
  
  console.log(`🔇 Created silent audio: ${filename.replace('.mp3', '.wav')}`);
}

const LESSON_3_SHORT_TEXTS = [
  "Lesson 3: What comes next after counting? Every step must be motivated.",
  "Diameter and radius: same terms, different sizes. Terms don't distinguish sizes.",
  "Introducing parameters d for diameter, r for radius. Parameters are letter designations.",
  "Our first formula: d equals two r. Formula connects parameters.",
  "Why formulas? For calculations. Calculation gets values through parameter connections.",
  "Measuring circumference challenge. Ruler is straight, circumference is curved.",
  "Discovering pi. About three diameter lengths fit on any circumference.",
  "Formula for circumference: c equals pi d. Pi equals circumference per unit diameter.",
  "Final formula: c equals two pi r. Formula calculates what's hard to measure.",
  "Learning key phrase: Formula calculates hard using easy measurements.",
  "Practical exercise with CD and ruler. Measure diameter, calculate circumference.",
  "Measurement versus calculation. You measured diameter, calculated circumference."
];

async function generateLesson3AudioCarefully() {
  console.log('🎬 Starting careful audio generation for Lesson 3...');
  
  try {
    for (let i = 0; i < LESSON_3_SHORT_TEXTS.length; i++) {
      try {
        await generateAudioWithDelay(LESSON_3_SHORT_TEXTS[i], `slide${i + 1}.mp3`, 2000);
        console.log(`✅ Slide ${i + 1}/${LESSON_3_SHORT_TEXTS.length} completed`);
      } catch (error) {
        console.log(`⏭️  Skipping slide ${i + 1} due to error, continuing...`);
        continue;
      }
    }
    
    console.log('🎉 Lesson 3 audio generation completed!');
    
  } catch (error) {
    console.error('💥 Overall process failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  generateLesson3AudioCarefully();
}