const fs = require('fs');
const path = require('path');

// Mock TTS function that creates unique audio files with different durations
function createUniqueMockAudio(text, filename, slideIndex) {
  try {
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson3');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    // Create unique mock audio content based on slide index
    // In real implementation, this would call actual TTS service
    const mockAudioContent = `Mock audio for slide ${slideIndex + 1}: ${text.substring(0, 50)}...`;
    const buffer = Buffer.from(mockAudioContent, 'utf-8');
    
    const filePath = path.join(audioDir, filename);
    
    // Write different sized files to simulate different audio lengths
    const sizeMultiplier = 1 + (slideIndex % 4); // Different sizes for variety
    const extendedBuffer = Buffer.alloc(buffer.length * sizeMultiplier, buffer);
    
    fs.writeFileSync(filePath, extendedBuffer);
    
    console.log(`✅ Created unique audio: ${filename} (size: ${extendedBuffer.length} bytes)`);
    return filePath;
  } catch (error) {
    console.error(`❌ Failed to create ${filename}:`, error.message);
    throw error;
  }
}

const LESSON_3_TEXTS = [
  "Lesson 3: What's Next After Counting? We've learned to observe, describe, define, assign terms, measure, distinguish groups, and count. What comes next? Important: Every next step must be seriously motivated. The child must understand the necessity of the next step. Otherwise, they won't take it.",
  
  "Diameter and Radius: Same Terms, Different Sizes. Draw a familiar circle. Draw a chord through its center. This is diameter. Connect a point on the circle with its center. This is radius. Children can measure these with a ruler - it's easy. Do the same with another circle larger or smaller. Compare two diameters. They differ in size. Yet both are diameters. Conclusion: Terms don't distinguish sizes.",
  
  "Introducing Parameters. We need to denote these different sizes of the same thing. Let's denote diameter length with letter d, radius length with letter r. These are parameters. For the first circle: diameter length will be d one, for the second: d two. And so on for any circle: common notation stays, only indices change. Parameter equals letter designation of quantity. Quantity equals result of counting or measuring.",
  
  "Our First Formula! Notice the obvious fact: Diameter consists of two radii. Therefore, we can write: d equals two r. This is our first formula! What is a formula? Formula equals parametric record of connection between quantities. Or simply equals connection between parameters. Don't worry that children are too young for formulas. Third-graders comfortably operate with parameters - they're already dealing with algebra basics.",
  
  "Why Formulas? For Calculations. Purpose: Formula allows calculations. What is calculation? Calculation equals obtaining parameter value not by measurement, but through its connections with other parameters. Example: If we measured radius length, there's no need to measure diameter length. It can be calculated - multiply radius length by two. Child might say: Too simple. Why calculate diameter when it can also be measured? Measuring is even more interesting... And you'd agree!",
  
  "Measuring Circumference: The Challenge. Can we measure chord length with ruler? Yes. Diameter length? Yes. Radius length? Also yes. Circumference length? No. What to do? Let's denote circumference length with letter c. Ruler is straight, circumference is curved. Can't measure with ruler. What else can we measure with? If child guesses string - excellent! Wrap string along circumference, then stretch and measure. String length equals circumference length. But: One not quite accurate. Two string not always handy...",
  
  "Discovering Pi. We know two radii fit on diameter length. How many diameter lengths fit on circumference length? We have measured circumference value. Divide it by measured diameter value of the same circle. Result is approximately three. Do the same with circles of different sizes - result is the same. About three diameter lengths fit on any circumference length. More precisely: Three point one four. Even more precisely: Three point one four one five nine two six five three five... This is the famous, special number. Called pi.",
  
  "Formula for Circumference. Therefore, we can write: c equals pi d. Pi equals circumference length per unit of its diameter length. Or: Pi equals circumference length of unit diameter. Tedious circumference measurement can be replaced by simple diameter measurement and multiplying result by pi. We calculated what's difficult to measure.",
  
  "Final Circumference Formula. But measuring radius is even easier than diameter! For diameter we need to align three points with ruler, for radius - only two. We know d equals two r. Substitute this into our formula. Get: c equals two pi r. This is the final circumference formula. Formula allows calculating what's hard or impossible to measure using what's easy to measure.",
  
  "Learning the Key Phrase. Ask child to repeat this expression in words: Formula allows calculating what's hard to measure using what's easy to measure. They likely won't get it first try. Make them memorize this phrase and say it fluently. How? Not by forcing. Everything will work out naturally. Child understands meaning, but their tongue doesn't obey yet. When they stumble - just smile and ask to repeat. Can use stopwatch for competition: who says it faster and clearer.",
  
  "Practical Exercise. Give child old CD and ruler. Let them figure out circumference length. Observe. Likely they'll try applying ruler to edge. Let them struggle with this impossibility. Maybe they'll guess to wrap with string. Eventually, let them measure diameter - this is easy. Then let them write formula: c equals pi d. Substitute measured d value - about twelve centimeters. Calculate: c approximately equals three point one four times twelve equals thirty-seven point six eight centimeters.",
  
  "Measurement vs Calculation. Now ask: Did you measure circumference length? They'll likely answer: Yes! Gentle but firm correction: No. You measured diameter length. Circumference length - you calculated. This is very important. Show and reinforce distinction between measurement and calculation from the beginning. Formula is bridge between them. It doesn't cancel measurement, but overcomes its limitations. Thus necessity gave birth to parameter concept. From parameter connections - formula. From formula - power of calculation. Your child now knows not just how to count, but why those strange letters in math. They hold key - c equals two pi r. This key opens door from world of what can be seen and measured to world of what can be understood and derived."
];

async function createAllUniqueAudio() {
  console.log('🎬 Creating unique audio files for Lesson 3...');
  
  try {
    // Clean existing files first
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson3');
    if (fs.existsSync(audioDir)) {
      const files = fs.readdirSync(audioDir);
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          fs.unlinkSync(path.join(audioDir, file));
        }
      });
    }
    
    // Create unique audio for each slide
    for (let i = 0; i < LESSON_3_TEXTS.length; i++) {
      await createUniqueMockAudio(LESSON_3_TEXTS[i], `slide${i + 1}.mp3`, i);
    }
    
    console.log('🎉 All unique audio files created successfully for Lesson 3!');
    console.log('Note: These are mock files. For real TTS, integrate with Google TTS or similar service.');
    
  } catch (error) {
    console.error('💥 Audio creation failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  createAllUniqueAudio();
}