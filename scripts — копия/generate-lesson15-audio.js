const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const LESSON_15_TEXTS = [
  // Slide 1: 
  ``,

  // Slide 2: 
  ``,

  // Slide 3: 
  ``,

  // Slide 4: 
  ``,

  // Slide 5: 
  ``,

  // Slide 6: 
  ``,

  // Slide 7: 
  ``,

  // Slide 8: 
  ``,

  // Slide 9: 
  ``,

  // Slide 10: 
  ``,

  // Slide 11: 
  ``,

  // Slide 12: 
  ``,

  // Slide 13: 
  ``,

  // Slide 14: 
  ``,

  // Slide 15: 
  ``,

  // Slide 16: 
  ``,

  // Slide 17: 
  ``,

  // Slide 18: 
  ``,

  // Slide 19: 
  ``,

  // Slide 20: 
  ``,

  // Slide 21: 
  ``,

  // Slide 22: 
  ``,

  // Slide 23: 
  ``,

  // Slide 24: 
  ``,

  // Slide 25: 
  ``,

  // Slide 26: 
  ``,

  // Slide 27: 
  ``,

  // Slide 28: 
  ``,

  // Slide 29: 
  ``,

  // Slide 30: 
  ``,

  // Slide 31: 
  ``,

  // Slide 32: 
  ``,

  // Slide 33: 
  ``,

  // Slide 34: 
  ``,

  // Slide 35: 
  ``,

  // Slide 36: 
  ``,

  // Slide 37: 
  ``,

  // Slide 38: 
  ``,

  // Slide 39: 
  ``,

  // Slide 40: 
  ``,

  // Slide 41: 
  ``,

  // Slide 42: 
  ``,

  // Slide 43: 
  ``,
];

const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';

async function generateAudio(text, outputPath) {
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'\\''");
  const command = `edge-tts --voice "${VOICE}" --rate="${RATE}" --text "${escapedText}" --write-media "${outputPath}"`;
  await execPromise(command);
}

async function main() {
  console.log('🎬 Generating audio for Lesson 15...');
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson15');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_15_TEXTS.length; i++) {
    const filename = `slide${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    console.log(`🔊 Slide ${i + 1}/${LESSON_15_TEXTS.length}...`);
    
    try {
      await generateAudio(LESSON_15_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ ${filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ ${filename}: ${error.message}`);
    }
  }
  
  console.log('🎉 Done!');
}

main().catch(console.error);