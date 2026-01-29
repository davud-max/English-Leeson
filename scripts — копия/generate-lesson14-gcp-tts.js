#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Audio content for Lesson 14 (only missing segments from previous attempt)
const MISSING_SEGMENTS = [
  { index: 0, text: "We began with something simple: 'Describe what you see.' And we encountered a paradox: to describe, you already need to know words. But words are terms, and terms are labels for definitions. We get a closed circle." },
  { index: 5, text: "In the Bible, this moment is described thus: 'And God said: let there be light. And there was light.' Notice: God didn't 'create' light in the usual sense. He named it. That is, light appears as an act of naming, as the first operation of distinction." },
  { index: 6, text: "Light separated from darkness. What does this mean in our conceptual system? The observable separated from the unobservable. 'Earth' — World — separated from 'heaven' — Nothing. A firmament appeared — that very first boundary." },
  { index: 19, text: "Your table, your cup, your friend — all this is boundaries drawn by your light-consciousness in the indivisible fabric of Being. These boundaries are stable because our way of distinguishing — our 'metric', as physicists would say — is common to all people raised in the same culture." },
  { index: 21, text: "But imagine a creature with a different 'metric' — for example, a dolphin, a bat, or an alien. For them, the firmament passes in different places. Their 'earth' and their 'heaven' are different. They live in a different world, though the physical Being is one." },
  { index: 22, text: "Exercise: Look at any object in the room. Try to stop recognizing it. Forget its name, function. Try to see in it simply 'a piece of distinguished Being'. This is an attempt to return to 'water' before the appearance of light. You will feel slight dizziness. This is the experience of dissolving boundaries." },
  { index: 24, text: "The terrible meaning of the phrase becomes clear: 'And I saw a new heaven and a new earth, for the first heaven and the first earth had passed away.' This is not about the end of the planet. This is about a change in consciousness paradigm. When a person's way of distinguishing changes — 'new light' appears — for him the old world disappears and a new one appears." },
  { index: 25, text: "We live not in 'objective reality'. We live in reality distinguished by our consciousness." },
  { index: 26, text: "Here's the key point. If the world appears only when there is someone to distinguish it, then man is not a passive spectator. He is a co-creator." }
];

// Google Cloud TTS configuration (most reliable)
const GCP_TTS_CONFIG = {
  languageCode: 'en-US',
  name: 'en-US-Neural2-J', // Premium male voice
  ssmlGender: 'MALE'
};

async function generateWithGCPTTS(text, segmentIndex) {
  try {
    console.log(`Generating segment ${segmentIndex + 1} with Google Cloud TTS...`);
    
    if (!process.env.GOOGLE_CLOUD_TTS_API_KEY) {
      throw new Error('GOOGLE_CLOUD_TTS_API_KEY environment variable not set');
    }
    
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_CLOUD_TTS_API_KEY}`,
      {
        input: { text: text },
        voice: {
          languageCode: GCP_TTS_CONFIG.languageCode,
          name: GCP_TTS_CONFIG.name,
          ssmlGender: GCP_TTS_CONFIG.ssmlGender
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.9,
          pitch: 0.0,
          volumeGainDb: 0.0
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    // Decode base64 audio
    const audioBuffer = Buffer.from(response.data.audioContent, 'base64');
    
    // Save audio file
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lessons', '14');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filename = `segment-${(segmentIndex + 1).toString().padStart(2, '0')}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    fs.writeFileSync(filepath, audioBuffer);
    console.log(`✓ Saved: ${filename} (${Math.round(audioBuffer.length / 1024)} KB)`);
    
    return {
      success: true,
      filepath: filepath,
      size: audioBuffer.length,
      segment: segmentIndex + 1
    };
  } catch (error) {
    console.error(`✗ Failed segment ${segmentIndex + 1}: ${error.message}`);
    return {
      success: false,
      error: error.message,
      segment: segmentIndex + 1
    };
  }
}

async function generateMissingSegments() {
  console.log('🚀 Google Cloud TTS - Generating missing segments for Lesson 14');
  console.log(`🎯 Target: ${MISSING_SEGMENTS.length} segments`);
  console.log(`🎤 Voice: ${GCP_TTS_CONFIG.name} (${GCP_TTS_CONFIG.ssmlGender})\n`);
  
  const results = [];
  
  // Generate each missing segment
  for (let i = 0; i < MISSING_SEGMENTS.length; i++) {
    const segment = MISSING_SEGMENTS[i];
    const result = await generateWithGCPTTS(segment.text, segment.index);
    results.push(result);
    
    // Add delay between requests
    if (i < MISSING_SEGMENTS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  // Summary statistics
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 GOOGLE CLOUD TTS RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successful.length}/${MISSING_SEGMENTS.length}`);
  console.log(`❌ Failed: ${failed.length}/${MISSING_SEGMENTS.length}`);
  console.log(`📈 Success Rate: ${Math.round((successful.length / MISSING_SEGMENTS.length) * 100)}%`);
  
  if (successful.length > 0) {
    const totalSize = successful.reduce((sum, r) => sum + r.size, 0);
    console.log(`💾 Total Size: ${Math.round(totalSize / 1024)} KB`);
    console.log('\n✅ Generated files:');
    successful.forEach(r => console.log(`   • ${path.basename(r.filepath)}`));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed segments:');
    failed.forEach(r => console.log(`   • Segment ${r.segment}: ${r.error}`));
  }
  
  // Create/update manifest
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lessons', '14');
  const manifestPath = path.join(audioDir, 'gcp-tts-manifest.json');
  
  const manifest = {
    lessonId: 14,
    title: "How Consciousness Creates Reality",
    service: "Google Cloud TTS",
    voice: GCP_TTS_CONFIG.name,
    gender: GCP_TTS_CONFIG.ssmlGender,
    totalRequested: MISSING_SEGMENTS.length,
    successfullyGenerated: successful.length,
    failedSegments: failed.map(r => r.segment),
    successRate: `${Math.round((successful.length / MISSING_SEGMENTS.length) * 100)}%`,
    totalAudioSizeKB: Math.round(successful.reduce((sum, r) => sum + r.size, 0) / 1024),
    createdAt: new Date().toISOString(),
    generatedFiles: successful.map(r => ({
      segment: r.segment,
      filename: path.basename(r.filepath),
      sizeKB: Math.round(r.size / 1024)
    }))
  };
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📄 Manifest saved: gcp-tts-manifest.json`);
  
  console.log('\n🎉 Google Cloud TTS process completed!');
  return successful.length;
}

// Check if API key is available
if (!process.env.GOOGLE_CLOUD_TTS_API_KEY) {
  console.log('⚠️  GOOGLE_CLOUD_TTS_API_KEY environment variable not found');
  console.log('Please set your Google Cloud TTS API key:');
  console.log('  export GOOGLE_CLOUD_TTS_API_KEY="your-api-key-here"');
  console.log('Then run: node scripts/generate-lesson14-gcp-tts.js');
  process.exit(1);
}

// Run the generator
generateMissingSegments()
  .then(generatedCount => {
    console.log(`\n✨ Process finished. Generated ${generatedCount} audio files with Google Cloud TTS.`);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });