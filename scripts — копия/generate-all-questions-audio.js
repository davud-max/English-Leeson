const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';

async function generateAudio(text, outputPath) {
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'\\''");
  const command = `edge-tts --voice "${VOICE}" --rate="${RATE}" --text "${escapedText}" --write-media "${outputPath}"`;
  await execPromise(command);
}

async function generateQuestionsAudio(lessonId) {
  const questionsFile = path.join(__dirname, '..', 'public', 'data', 'questions', `lesson${lessonId}.json`);
  
  if (!fs.existsSync(questionsFile)) {
    console.log(`❌ Questions file not found: ${questionsFile}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
  const questions = data.questions;
  
  if (!questions || questions.length === 0) {
    console.log(`❌ No questions found for lesson ${lessonId}`);
    return;
  }
  
  console.log(`\n🎤 Generating audio for Lesson ${lessonId} (${questions.length} questions)...`);
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'questions', `lesson${lessonId}`);
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const filename = `question${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    // Generate audio text with question number
    const audioText = `Question ${i + 1}. ${q.question}`;
    
    console.log(`  🔊 Question ${i + 1}/${questions.length}...`);
    
    try {
      await generateAudio(audioText, filepath);
      const stats = fs.statSync(filepath);
      console.log(`  ✅ ${filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`  ❌ ${filename}: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🎬 Quiz Questions Audio Generator');
  console.log('==================================');
  console.log(`Voice: ${VOICE}`);
  console.log(`Rate: ${RATE}`);
  
  // Generate for lessons 8-15 and 21
  const lessons = [8, 9, 10, 11, 12, 13, 14, 15, 21];
  
  for (const lessonId of lessons) {
    await generateQuestionsAudio(lessonId);
  }
  
  console.log('\n🎉 Done!');
  console.log('\nAudio files saved to: public/audio/questions/lessonX/');
  console.log('Remember to commit and push to deploy!');
}

main().catch(console.error);
