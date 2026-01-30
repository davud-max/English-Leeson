const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Questions for Lesson 8
const QUESTIONS = [
  // Question 1
  `Question 1. What are the two interconnected circuits that make up our consciousness according to the Theory of Cognitive Resonance?`,

  // Question 2
  `Question 2. Give an example of something that belongs to the Analog Circuit.`,

  // Question 3
  `Question 3. What does the Theory of Cognitive Resonance focus on instead of neurons?`,

  // Question 4
  `Question 4. What type of sudden thought arrival does this theory primarily address?`,

  // Question 5
  `Question 5. Which circuit contains abstractions, signs, and concepts?`,

  // Question 6
  `Question 6. Analyze how the selective mechanism of consciousness works according to this theory, explaining why some thoughts become ours while others don't.`,

  // Question 7
  `Question 7. Explain the concept of 'resonant dialogue' and describe the specific roles each circuit plays in the thinking process.`,

  // Question 8
  `Question 8. Compare and contrast how the word 'apple' versus the taste of an apple would be processed according to this theory.`,

  // Question 9
  `Question 9. Evaluate why this theory emphasizes the role of feelings and emotional energy in cognitive processes rather than purely logical mechanisms.`,

  // Question 10
  `Question 10. Synthesize how the Theory of Cognitive Resonance explains the difference between mechanical thinking and genuine insight or illumination.`,
];

const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';

async function generateAudio(text, outputPath) {
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'\\''");
  const command = `edge-tts --voice "${VOICE}" --rate="${RATE}" --text "${escapedText}" --write-media "${outputPath}"`;
  await execPromise(command);
}

async function main() {
  console.log('🎤 Generating question audio for Lesson 8...');
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'questions', 'lesson8');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < QUESTIONS.length; i++) {
    const filename = `question${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    console.log(`🔊 Question ${i + 1}/${QUESTIONS.length}...`);
    
    try {
      await generateAudio(QUESTIONS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ ${filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ ${filename}: ${error.message}`);
    }
  }
  
  console.log('🎉 Done! Audio files saved to public/audio/questions/lesson8/');
}

main().catch(console.error);