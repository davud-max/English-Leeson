#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Audio content for Lesson 14 (split into smaller chunks to avoid rate limiting)
const AUDIO_SEGMENTS = [
  "We began with something simple: 'Describe what you see.' And we encountered a paradox: to describe, you already need to know words. But words are terms, and terms are labels for definitions. We get a closed circle.",
  "Only one thing can break it — the act of primary distinction. Even before words. Even before definitions.",
  "Imagine absolute darkness. Not physical, but meaningful. There is no 'here' or 'there', no 'I' or 'not-I'. This is what ancient texts call 'water' — homogeneous, indistinguishable Being.",
  "What can happen in this 'water'? Only one thing — the appearance of a boundary. But for this, light is needed.",
  "Light is not photons. It's the ability to draw a line and say: 'this is not that.'",
  "In the Bible, this moment is described thus: 'And God said: let there be light. And there was light.' Notice: God didn't 'create' light in the usual sense. He named it. That is, light appears as an act of naming, as the first operation of distinction.",
  "Light separated from darkness. What does this mean in our conceptual system? The observable separated from the unobservable. 'Earth' — World — separated from 'heaven' — Nothing. A firmament appeared — that very first boundary.",
  "Let's recall our first lecture. What happened when we started describing a circle?",
  "Object — chalk mark on board — this is analogous to 'water', indistinguishable Being.",
  "Observer — the child who looks — this is analogous to the Spirit that 'moves over the water.'",
  "Act of description — drawing boundaries: curved, closed, equidistant — this is the light itself.",
  "Here are the three inseparable elements:",
  "Being — what is.",
  "Consciousness — what distinguishes.",
  "Act of distinction — light, giving birth to boundaries.",
  "In religious tradition, this is called Father, Son, and Holy Spirit. But in our system, this is not mysticism, but a strict scheme of cognition.",
  "Father equals Being — the source material.",
  "Son equals Logos, Word, act of distinction — light.",
  "Holy Spirit equals Consciousness, spirit of the observer.",
  "Pay attention: in our first lecture, a term was born only after definition. Here too: the world is born only after the act of distinction. God didn't 'create' the world like a carpenter creates a table. The world 'appeared' as a result of an Observer capable of distinguishing it appearing.",
  "Here's the key point. If the world appears only when there is someone to distinguish it, then man is not a passive spectator. He is a co-creator.",
  "In the Bible: 'And the Lord God formed man from the dust of the ground, and breathed into his nostrils the breath of life.' 'Dust of the ground' — this is still undifferentiated material of being. 'Breath of life' — this is that same light, the ability to distinguish, which makes man living consciousness.",
  "The terrible meaning of the phrase becomes clear: 'And I saw a new heaven and a new earth, for the first heaven and the first earth had passed away.' This is not about the end of the planet. This is about a change in consciousness paradigm. When a person's way of distinguishing changes — 'new light' appears — for him the old world disappears and a new one appears.",
  "We live not in 'objective reality'. We live in reality distinguished by our consciousness.",
  "Your table, your cup, your friend — all this is boundaries drawn by your light-consciousness in the indivisible fabric of Being. These boundaries are stable because our way of distinguishing — our 'metric', as physicists would say — is common to all people raised in the same culture.",
  "But imagine a creature with a different 'metric' — for example, a dolphin, a bat, or an alien. For them, the firmament passes in different places. Their 'earth' and their 'heaven' are different. They live in a different world, though the physical Being is one.",
  "Exercise: Look at any object in the room. Try to stop recognizing it. Forget its name, function. Try to see in it simply 'a piece of distinguished Being'. This is an attempt to return to 'water' before the appearance of light. You will feel slight dizziness. This is the experience of dissolving boundaries."
];

// Multiple fallback services with different voices
const SERVICES = [
  {
    name: 'Google Translate TTS',
    url: 'https://translate.google.com/translate_tts',
    voice: 'en-US-GuyNeural',
    getUserAgent: () => `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * 100 + 90)}.0.0.0 Safari/537.36`
  },
  {
    name: 'Alternative Google TTS',
    url: 'https://www.google.com/speech-api/v1/synthesize',
    voice: 'en-US-Male',
    getUserAgent: () => `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * 100 + 90)}.0.0.0 Safari/537.36`
  }
];

async function generateAudioWithService(text, index, service, retryCount = 0) {
  try {
    console.log(`Trying ${service.name} for segment ${index + 1}...`);
    
    const params = new URLSearchParams({
      text: text,
      tl: 'en',
      ie: 'UTF-8',
      total: '1',
      idx: '0',
      client: 'tw-ob',
      textlen: text.length.toString()
    });
    
    const response = await axios.get(`${service.url}?${params}`, {
      headers: {
        'User-Agent': service.getUserAgent(),
        'Accept': 'audio/mpeg',
        'Referer': 'https://translate.google.com/'
      },
      responseType: 'arraybuffer',
      timeout: 15000
    });
    
    // Validate response
    if (response.data && response.data.byteLength > 1000) {
      return response.data;
    } else {
      throw new Error('Invalid audio response');
    }
  } catch (error) {
    if (retryCount < 2) {
      console.log(`  Retry ${retryCount + 1}/2 for ${service.name}...`);
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      return generateAudioWithService(text, index, service, retryCount + 1);
    }
    throw error;
  }
}

async function generateAudioSegment(text, index) {
  console.log(`\n--- Generating audio for segment ${index + 1}/${AUDIO_SEGMENTS.length} ---`);
  
  // Try each service in order
  for (let i = 0; i < SERVICES.length; i++) {
    const service = SERVICES[i];
    try {
      const audioBuffer = await generateAudioWithService(text, index, service);
      
      // Save successful result
      const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lessons', '14');
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      
      const filename = `segment-${(index + 1).toString().padStart(2, '0')}.mp3`;
      const filepath = path.join(audioDir, filename);
      
      fs.writeFileSync(filepath, Buffer.from(audioBuffer));
      console.log(`✓ Success with ${service.name}: ${filename}`);
      
      return filepath;
    } catch (error) {
      console.log(`✗ Failed with ${service.name}: ${error.message}`);
      if (i < SERVICES.length - 1) {
        console.log(`  Trying next service...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  throw new Error(`All services failed for segment ${index + 1}`);
}

async function generateAllSegments() {
  console.log('🚀 Starting robust TTS generation for Lesson 14...');
  console.log('Using multiple fallback services to ensure success\n');
  
  const generatedFiles = [];
  const failedSegments = [];
  
  // Generate segments with intelligent retry logic
  for (let i = 0; i < AUDIO_SEGMENTS.length; i++) {
    try {
      const filepath = await generateAudioSegment(AUDIO_SEGMENTS[i], i);
      generatedFiles.push(filepath);
      
      // Random delay to avoid rate limiting (1-3 seconds)
      if (i < AUDIO_SEGMENTS.length - 1) {
        const delay = Math.floor(Math.random() * 2000) + 1000;
        console.log(`Waiting ${delay}ms before next request...\n`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`❌ Segment ${i + 1} failed permanently: ${error.message}`);
      failedSegments.push(i + 1);
      continue;
    }
  }
  
  // Create detailed manifest
  const manifest = {
    lessonId: 14,
    title: "How Consciousness Creates Reality",
    servicesAttempted: SERVICES.map(s => s.name),
    totalSegments: AUDIO_SEGMENTS.length,
    generatedSegments: generatedFiles.length,
    failedSegments: failedSegments,
    successRate: `${Math.round((generatedFiles.length / AUDIO_SEGMENTS.length) * 100)}%`,
    createdAt: new Date().toISOString(),
    segmentsInfo: generatedFiles.map((filepath, index) => ({
      segment: index + 1,
      status: 'success',
      characterCount: AUDIO_SEGMENTS[index].length,
      wordCount: AUDIO_SEGMENTS[index].split(/\s+/).filter(word => word.length > 0).length,
      filename: path.basename(filepath),
      filesize: fs.statSync(filepath).size
    }))
  };
  
  // Add failed segments to manifest
  failedSegments.forEach(segmentNum => {
    manifest.segmentsInfo.push({
      segment: segmentNum,
      status: 'failed',
      characterCount: AUDIO_SEGMENTS[segmentNum - 1].length,
      wordCount: AUDIO_SEGMENTS[segmentNum - 1].split(/\s+/).filter(word => word.length > 0).length,
      error: 'All TTS services failed'
    });
  });
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lessons', '14');
  const manifestPath = path.join(audioDir, 'robust-tts-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📄 Created manifest: robust-tts-manifest.json`);
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 TTS GENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${generatedFiles.length}/${AUDIO_SEGMENTS.length} segments`);
  console.log(`❌ Failed: ${failedSegments.length} segments`);
  console.log(`📊 Success Rate: ${manifest.successRate}`);
  console.log(`📁 Output Directory: ${audioDir}`);
  
  if (failedSegments.length > 0) {
    console.log(`\n⚠️  Failed segments: ${failedSegments.join(', ')}`);
    console.log('💡 Recommendations:');
    console.log('   1. Run script again (temporary network issues)');
    console.log('   2. Use Google Cloud TTS for remaining segments');
    console.log('   3. Manually record missing segments');
  }
  
  console.log('\n🎵 Generated files are ready for use in Lesson 14!');
  return generatedFiles.length;
}

// Run with error handling
generateAllSegments()
  .then(generatedCount => {
    console.log(`\n✨ Process completed. Generated ${generatedCount} audio files.`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Fatal error in TTS generation:', error);
    process.exit(1);
  });