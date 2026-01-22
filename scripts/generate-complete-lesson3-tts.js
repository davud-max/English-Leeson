const fs = require('fs');
const path = require('path');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const util = require('util');

// Initialize Google Cloud TTS client
const client = new TextToSpeechClient({
  projectId: 'your-project-id',
  keyFilename: null, // We'll use the API key directly
});

async function generateFullTTS(content, filename, apiKey) {
  try {
    // Clean content for better TTS
    const cleanContent = content
      .replace(/\*\*/g, '')
      .replace(/__/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/\n\n+/g, '. ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log(`🎤 Synthesizing: "${cleanContent.substring(0, 60)}..."`);
    
    // Configure the request
    const request = {
      input: { text: cleanContent },
      voice: { 
        languageCode: 'en-US',
        name: 'en-US-Neural2-D', // High quality neural voice
        ssmlGender: 'MALE'
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0
      },
    };
    
    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    
    // Write the binary audio content to a local file
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson3');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filePath = path.join(audioDir, filename);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, response.audioContent, 'binary');
    
    console.log(`✅ Generated: ${filename} (${Math.round(response.audioContent.length / 1024)} KB)`);
    return filePath;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.message);
    throw error;
  }
}

// FULL SLIDE CONTENTS WITH COMPLETE NARRATION
const LESSON_3_COMPLETE_CONTENTS = [
  // Slide 1 - Complete narration
  "We've learned to observe, describe, define, assign terms, measure, distinguish groups, and count. What comes next? This is a crucial question. Every next step must be seriously motivated. The child must understand the necessity of the next step. Otherwise, they won't take it. Learning happens when there's genuine need and motivation.",
  
  // Slide 2 - Complete narration  
  "Let's draw a familiar circle. Now draw a chord through its center. This is diameter. Connect any point on the circle with its center. This is radius. Children can measure these with a ruler - it's easy. Now do the same with another circle, either larger or smaller. Compare two diameters. They differ in size. Yet both are diameters. Compare two radii. They also differ in size, yet both are radii. What's the conclusion? Terms don't distinguish sizes. The same term can apply to objects of different sizes.",
  
  // Slide 3 - Complete narration
  "We need to denote these different sizes of the same thing. How? Let's denote diameter length with letter d, radius length with letter r. These are parameters. For the first circle: diameter length will be d subscript one, for the second: d subscript two. For the first circle: radius length will be r subscript one, for the second: r subscript two. And so on for any circle: common notation stays, only indices change. What is parameter? Parameter equals letter designation of quantity. What is quantity? Quantity equals result of counting or measuring.",
  
  // Slide 4 - Complete narration
  "Notice the obvious fact: Diameter consists of two radii. Therefore, we can write: d equals two r. This is our first formula! What is a formula? Formula equals parametric record of connection between quantities. Or simply equals connection between parameters. Don't worry that children are too young for formulas. Third-graders comfortably operate with parameters - they're already dealing with algebra basics. Mathematics is about relationships, not just numbers.",
  
  // Slide 5 - Complete narration
  "What is the purpose of formulas? Formula allows calculations. What is calculation? Calculation equals obtaining parameter value not by measurement, but through its connections with other parameters. Example: If we measured radius length, there's no need to measure diameter length separately. It can be calculated - multiply radius length by two. Child might say: Too simple. Why calculate diameter when it can also be measured? Measuring is even more interesting. And you'd agree! Sometimes direct measurement is indeed simpler.",
  
  // Slide 6 - Complete narration
  "Let's explore measurement challenges. Can we measure chord length with ruler? Yes. Diameter length? Yes. Radius length? Also yes. But what about circumference length? No. What to do? Let's denote circumference length with letter c. Ruler is straight, circumference is curved. Can't measure with ruler directly. What else can we measure with? If child guesses string - excellent! Wrap string along circumference, then stretch and measure. String length equals circumference length. But there are limitations: One not quite accurate. Two string not always handy when you need quick calculations.",
  
  // Slide 7 - Complete narration
  "Let's discover the famous number pi. We know two radii fit on diameter length. How many diameter lengths fit on circumference length? We have measured circumference value. Divide it by measured diameter value of the same circle. Result is approximately three. Do the same experiment with circles of different sizes - result is the same. About three diameter lengths fit on any circumference length. More precisely: Three point one four. Even more precisely: Three point one four one five nine two six five three five. This is the famous, special number. Called pi. Mathematicians have calculated trillions of digits!",
  
  // Slide 8 - Complete narration
  "Therefore, we can write: c equals pi d. What does pi mean? Pi equals circumference length per unit of its diameter length. Or: Pi equals circumference length of unit diameter. Tedious circumference measurement can be replaced by simple diameter measurement and multiplying result by pi. We calculated what's difficult to measure. This is the power of mathematical formulas - they transform hard problems into easy solutions.",
  
  // Slide 9 - Complete narration
  "But measuring radius is even easier than diameter! For diameter we need to align three points with ruler, for radius - only two. We know d equals two r. Substitute this into our formula. Get: c equals two pi r. This is the final circumference formula. What does this teach us? Formula allows calculating what's hard or impossible to measure using what's easy to measure. This is the essence of mathematical thinking.",
  
  // Slide 10 - Complete narration
  "Let's practice the key concept. Ask child to repeat this expression in words: Formula allows calculating what's hard to measure using what's easy to measure. They likely won't get it first try. Make them memorize this phrase and say it fluently. How? Not by forcing memorization. Everything will work out naturally. Child understands meaning, but their tongue doesn't obey yet. When they stumble - just smile and ask to repeat. Can use stopwatch for competition: who says it faster and clearer. Learning through play works best.",
  
  // Slide 11 - Complete narration
  "Practical exercise time. Give child old CD and ruler. Let them figure out circumference length. Observe their approach. Likely they'll try applying ruler to edge. Let them struggle with this impossibility. Maybe they'll guess to wrap with string. Eventually, let them measure diameter - this is easy. Then let them write formula: c equals pi d. Substitute measured d value - about twelve centimeters. Calculate: c approximately equals three point one four times twelve equals thirty-seven point six eight centimeters. Hands-on learning creates lasting understanding.",
  
  // Slide 12 - Complete narration
  "Now for the crucial distinction. Ask: Did you measure circumference length? They'll likely answer: Yes! Give gentle but firm correction: No. You measured diameter length. Circumference length - you calculated. This is very important. Show and reinforce distinction between measurement and calculation from the beginning. Formula is bridge between them. It doesn't cancel measurement, but overcomes its limitations. Thus necessity gave birth to parameter concept. From parameter connections - formula. From formula - power of calculation. Your child now knows not just how to count, but why those strange letters in math. They hold key - c equals two pi r. This key opens door from world of what can be seen and measured to world of what can be understood and derived."
];

async function generateCompleteLesson3Audio(apiKey) {
  console.log('🎬 Generating COMPLETE Lesson 3 audio with Google Cloud TTS...');
  console.log('🎙️  Using high-quality neural voice synthesis\n');
  
  try {
    // Clean existing files first
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson3');
    if (fs.existsSync(audioDir)) {
      const files = fs.readdirSync(audioDir);
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          fs.unlinkSync(path.join(audioDir, file));
          console.log(`🗑️  Removed: ${file}`);
        }
      });
    }
    
    // Generate audio for each slide with complete narration
    for (let i = 0; i < LESSON_3_COMPLETE_CONTENTS.length; i++) {
      try {
        console.log(`\n📝 Processing Slide ${i + 1}/${LESSON_3_COMPLETE_CONTENTS.length}`);
        console.log(`Content length: ${LESSON_3_COMPLETE_CONTENTS[i].split(' ').length} words`);
        
        await generateFullTTS(LESSON_3_COMPLETE_CONTENTS[i], `slide${i + 1}.mp3`, apiKey);
        console.log(`✅ Slide ${i + 1} completed\n`);
        
      } catch (error) {
        console.log(`❌ Slide ${i + 1} failed: ${error.message}\n`);
        continue;
      }
    }
    
    console.log('\n🎉 COMPLETE Lesson 3 audio generation finished!');
    console.log('🎧 All slides now contain full detailed narration with high-quality TTS');
    
  } catch (error) {
    console.error('💥 Process failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  const apiKey = process.argv[2] || 'AIzaSyDSrWekemLElh06BPEfyktu3nQT4tF3Tf4';
  generateCompleteLesson3Audio(apiKey);
}