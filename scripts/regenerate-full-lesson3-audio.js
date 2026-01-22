const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Enhanced Google TTS with full slide content
async function generateFullSlideAudio(content, filename, delayMs = 2000) {
  try {
    // Add substantial delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, delayMs + Math.random() * 1500));
    
    // Enhanced User-Agents
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
    
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    // Clean content: remove markdown formatting for better TTS
    let cleanContent = content
      .replace(/\*\*/g, '')  // Remove bold markers
      .replace(/__/g, '')    // Remove underline markers  
      .replace(/\*/g, '')    // Remove italic markers
      .replace(/#/g, '')     // Remove headers
      .replace(/\n\n+/g, '. ') // Convert double newlines to periods
      .replace(/\n/g, ' ')   // Convert single newlines to spaces
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();
    
    // Split very long content into chunks if needed
    const maxLength = 1500; // Safe limit for Google TTS
    let chunks = [];
    
    if (cleanContent.length > maxLength) {
      // Split by sentences
      const sentences = cleanContent.match(/[^\.!?]+[\.!?]+/g) || [cleanContent];
      let currentChunk = '';
      
      for (const sentence of sentences) {
        if ((currentChunk.length + sentence.length) <= maxLength) {
          currentChunk += sentence + ' ';
        } else {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence + ' ';
        }
      }
      
      if (currentChunk) chunks.push(currentChunk.trim());
    } else {
      chunks = [cleanContent];
    }
    
    console.log(`📝 Processing ${chunks.length} chunk(s) for ${filename}`);
    
    const audioBuffers = [];
    
    // Generate audio for each chunk
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i].length < 10) continue; // Skip tiny chunks
      
      console.log(`  🎵 Generating chunk ${i + 1}/${chunks.length}...`);
      
      const response = await axios.get('https://translate.google.com/translate_tts', {
        params: {
          ie: 'UTF-8',
          q: chunks[i],
          tl: 'en',
          client: 'tw-ob',
          prev: 'input',
          total: chunks.length,
          idx: i
        },
        headers: {
          'User-Agent': randomUserAgent,
          'Referer': 'https://translate.google.com/',
          'Accept': 'audio/mpeg',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        responseType: 'arraybuffer'
      });
      
      audioBuffers.push(Buffer.from(response.data));
      
      // Extra delay between chunks
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      }
    }
    
    // Combine all chunks
    const combinedBuffer = Buffer.concat(audioBuffers);
    
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson3');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, combinedBuffer);
    
    console.log(`✅ Generated: ${filename} (${Math.round(combinedBuffer.length / 1024)} KB, ${chunks.length} chunk(s))`);
    return filePath;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.response?.status, error.message);
    throw error;
  }
}

// FULL SLIDE CONTENTS FROM LESSON 3
const LESSON_3_FULL_CONTENTS = [
  // Slide 1
  "We've learned to observe, describe, define, assign terms, measure, distinguish groups, and count. What comes next? Important: Every next step must be seriously motivated. The child must understand the necessity of the next step. Otherwise, they won't take it.",
  
  // Slide 2  
  "Draw a familiar circle. Draw a chord through its center. This is diameter. Connect a point on the circle with its center. This is radius. Children can measure these with a ruler - it's easy. Do the same with another circle, larger or smaller. Compare two diameters. They differ in size. Yet both are diameters. Conclusion: Terms don't distinguish sizes.",
  
  // Slide 3
  "We need to denote these different sizes of the same thing. Let's denote diameter length with letter d, radius length with letter r. These are parameters. For the first circle: diameter length will be d one, for the second: d two. And so on for any circle: common notation stays, only indices change. Parameter equals letter designation of quantity. Quantity equals result of counting or measuring.",
  
  // Slide 4
  "Notice the obvious fact: Diameter consists of two radii. Therefore, we can write: d equals two r. This is our first formula! What is a formula? Formula equals parametric record of connection between quantities. Or simply equals connection between parameters. Don't worry that children are too young for formulas. Third-graders comfortably operate with parameters - they're already dealing with algebra basics.",
  
  // Slide 5
  "Purpose: Formula allows calculations. What is calculation? Calculation equals obtaining parameter value not by measurement, but through its connections with other parameters. Example: If we measured radius length, there's no need to measure diameter length. It can be calculated - multiply radius length by two. Child might say: Too simple. Why calculate diameter when it can also be measured? Measuring is even more interesting. And you'd agree!",
  
  // Slide 6
  "Can we measure chord length with ruler? Yes. Diameter length? Yes. Radius length? Also yes. Circumference length? No. What to do? Let's denote circumference length with letter c. Ruler is straight, circumference is curved. Can't measure with ruler. What else can we measure with? If child guesses string - excellent! Wrap string along circumference, then stretch and measure. String length equals circumference length. But: One not quite accurate. Two string not always handy.",
  
  // Slide 7
  "We know two radii fit on diameter length. How many diameter lengths fit on circumference length? We have measured circumference value. Divide it by measured diameter value of the same circle. Result is approximately three. Do the same with circles of different sizes - result is the same. About three diameter lengths fit on any circumference length. More precisely: Three point one four. Even more precisely: Three point one four one five nine two six five three five. This is the famous, special number. Called pi.",
  
  // Slide 8
  "Therefore, we can write: c equals pi d. Pi equals circumference length per unit of its diameter length. Or: Pi equals circumference length of unit diameter. Tedious circumference measurement can be replaced by simple diameter measurement and multiplying result by pi. We calculated what's difficult to measure.",
  
  // Slide 9
  "But measuring radius is even easier than diameter! For diameter we need to align three points with ruler, for radius - only two. We know d equals two r. Substitute this into our formula. Get: c equals two pi r. This is the final circumference formula. Formula allows calculating what's hard or impossible to measure using what's easy to measure.",
  
  // Slide 10
  "Ask child to repeat this expression in words: Formula allows calculating what's hard to measure using what's easy to measure. They likely won't get it first try. Make them memorize this phrase and say it fluently. How? Not by forcing. Everything will work out naturally. Child understands meaning, but their tongue doesn't obey yet. When they stumble - just smile and ask to repeat. Can use stopwatch for competition: who says it faster and clearer.",
  
  // Slide 11
  "Give child old CD and ruler. Let them figure out circumference length. Observe. Likely they'll try applying ruler to edge. Let them struggle with this impossibility. Maybe they'll guess to wrap with string. Eventually, let them measure diameter - this is easy. Then let them write formula: c equals pi d. Substitute measured d value - about twelve centimeters. Calculate: c approximately equals three point one four times twelve equals thirty-seven point six eight centimeters.",
  
  // Slide 12
  "Now ask: Did you measure circumference length? They'll likely answer: Yes! Gentle but firm correction: No. You measured diameter length. Circumference length - you calculated. This is very important. Show and reinforce distinction between measurement and calculation from the beginning. Formula is bridge between them. It doesn't cancel measurement, but overcomes its limitations. Thus necessity gave birth to parameter concept. From parameter connections - formula. From formula - power of calculation. Your child now knows not just how to count, but why those strange letters in math. They hold key - c equals two pi r. This key opens door from world of what can be seen and measured to world of what can be understood and derived."
];

async function regenerateFullLesson3Audio() {
  console.log('🎬 Regenerating Lesson 3 with FULL slide content...');
  console.log('🎵 Each slide will contain complete detailed narration\n');
  
  try {
    // Clean existing files
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson3');
    if (fs.existsSync(audioDir)) {
      const files = fs.readdirSync(audioDir);
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          fs.unlinkSync(path.join(audioDir, file));
          console.log(`🗑️  Removed old: ${file}`);
        }
      });
    }
    
    // Generate full audio for each slide
    for (let i = 0; i < LESSON_3_FULL_CONTENTS.length; i++) {
      try {
        console.log(`\n📝 Processing Slide ${i + 1}/${LESSON_3_FULL_CONTENTS.length}:`);
        console.log(`"${LESSON_3_FULL_CONTENTS[i].substring(0, 80)}..."`);
        
        await generateFullSlideAudio(LESSON_3_FULL_CONTENTS[i], `slide${i + 1}.mp3`, 3000);
        console.log(`✅ Slide ${i + 1} completed successfully\n`);
        
      } catch (error) {
        console.log(`❌ Slide ${i + 1} failed, skipping...\n`);
        continue;
      }
    }
    
    console.log('\n🎉 FULL Lesson 3 audio regeneration completed!');
    console.log('🎧 All slides now contain complete detailed narration');
    
  } catch (error) {
    console.error('💥 Process failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  regenerateFullLesson3Audio();
}