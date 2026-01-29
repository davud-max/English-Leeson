const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Lesson 1 Audio texts
const LESSON_1_TEXTS = [
  // Slide 1
  ``,
];

// ElevenLabs Configuration
const ELEVENLABS_API_KEY = 'sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274';
const VOICE_ID = 'erDx71FK2teMZ7g6khzw';
const PROXY_URL = 'https://elevenlabs-proxy-two.vercel.app/api/elevenlabs';

async function generateAudioElevenLabs(text, outputPath) {
  try {
    const response = await axios.post(PROXY_URL, {
      apiKey: ELEVENLABS_API_KEY,
      voiceId: VOICE_ID,
      text: text,
      stability: 0.5,
      similarity_boost: 0.75
    }, {
      timeout: 180000
    });

    if (response.data.success && response.data.audio) {
      const audioBuffer = Buffer.from(response.data.audio, 'base64');
      fs.writeFileSync(outputPath, audioBuffer);
      return true;
    } else {
      throw new Error(response.data.error || 'Failed to generate audio');
    }
  } catch (error) {
    throw new Error(`ElevenLabs API error: ${error.message}`);
  }
}

async function main() {
  console.log('🎬 Starting ElevenLabs audio generation for Lesson 1...');
  console.log(`📝 Total slides: ${LESSON_1_TEXTS.length}`);
  console.log(`🎙️ Voice ID: ${VOICE_ID}`);
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson1');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_1_TEXTS.length; i++) {
    const filename = `slide${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    console.log(`🔊 Generating slide ${i + 1}/${LESSON_1_TEXTS.length}...`);
    
    try {
      await generateAudioElevenLabs(LESSON_1_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ Generated: ${filename} (${Math.round(stats.size / 1024)}KB)`);
      
      // Pause between requests
      if (i < LESSON_1_TEXTS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Failed: ${filename} - ${error.message}`);
    }
  }
  
  console.log('🎉 Audio generation complete!');
}

main().catch(console.error);