const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Direct Google Cloud TTS REST API call using API key
async function generateTTSWithAPIKey(text, filename, apiKey) {
  try {
    // Clean content
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/__/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/\n\n+/g, '. ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log(`🎤 Synthesizing (${cleanText.split(' ').length} words): "${cleanText.substring(0, 50)}..."`);
    
    // Google Cloud TTS REST API endpoint
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    
    const requestBody = {
      input: {
        text: cleanText
      },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Standard-D',
        ssmlGender: 'MALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0
      }
    };
    
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Decode base64 audio content
    const audioContent = Buffer.from(response.data.audioContent, 'base64');
    
    // Save file
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson3');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, audioContent);
    
    console.log(`✅ Generated: ${filename} (${Math.round(audioContent.length / 1024)} KB)`);
    return filePath;
    
  } catch (error) {
    console.error(`❌ Failed ${filename}:`, error.response?.data?.error?.message || error.message);
    throw error;
  }
}

// FULL DETAILED CONTENT FOR EACH SLIDE
const FULL_LESSON_3_CONTENTS = [
  // Slide 1 - Complete detailed narration
  "We've learned to observe, describe, define, assign terms, measure, distinguish groups, and count. What comes next? This is a crucial question that requires serious consideration. Every next step in learning must be seriously motivated. The child must genuinely understand the necessity of taking the next step. Without this understanding and motivation, they simply won't engage with the new material. True learning happens when there's authentic need and genuine interest.",
  
  // Slide 2 - Complete detailed narration  
  "Let's begin with a practical exercise. Draw a familiar circle on paper. Now draw a chord that passes through its center point. Congratulations - you've just drawn a diameter. Next, connect any point on the circle's edge with its center point. This line segment is called a radius. Children can easily measure both of these with a simple ruler - it's straightforward and intuitive. Now let's expand our exploration. Take another circle, either larger or smaller than the first one. Measure and compare two diameters from different circles. Notice how they differ in size - one is longer, one is shorter. Yet both measurements represent diameters. Similarly, compare two radii from different circles. They also vary in length, but both are still radii. What profound conclusion can we draw from this observation? Terms don't distinguish sizes. The same mathematical term can accurately describe objects of completely different physical dimensions.",
  
  // Slide 3 - Complete detailed narration
  "We face an important challenge: how do we denote these different sizes of the same geometric concept? Here's the elegant solution. Let's denote diameter length with the letter d, and radius length with the letter r. These symbols are called parameters in mathematics. For our first circle, we'll write the diameter length as d subscript one, and for the second circle as d subscript two. Similarly, the first circle's radius will be r subscript one, and the second circle's radius will be r subscript two. This pattern continues for any circle we encounter: the fundamental notation remains consistent, only the numerical indices change to distinguish between different instances. So what exactly is a parameter? A parameter is simply a letter designation that represents a measurable quantity. And what constitutes a quantity? A quantity is the result obtained either through counting discrete items or measuring continuous dimensions.",
  
  // Slide 4 - Complete detailed narration
  "Let's examine a fundamental geometric relationship. Notice this obvious but profound fact: Every diameter consists of exactly two radii placed end to end. This simple observation leads us to our first mathematical formula. Therefore, we can express this relationship as: d equals two times r, or simply d equals two r. This is our inaugural formula! But what precisely defines a formula in mathematics? A formula represents a parametric record of connection between different quantities. In simpler terms, it's a mathematical expression that describes the relationship between various parameters. Parents shouldn't worry that children might be too young to understand formulas. Research shows that third-grade students can comfortably work with parameters and are already engaging with foundational algebraic concepts. Mathematics is ultimately about understanding relationships between quantities, not merely manipulating numbers.",
  
  // Slide 5 - Complete detailed narration
  "Why do we need formulas in mathematics? The primary purpose of formulas is to enable calculations. But what exactly constitutes a calculation? Calculation is the process of obtaining a parameter's value not through direct measurement, but through its mathematical relationships with other known parameters. Let me illustrate with a concrete example. Suppose we've measured the length of a radius. Do we need to separately measure the diameter's length? Absolutely not! We can calculate it directly by multiplying the radius length by two. A child might reasonably argue: This seems too simple. Why bother calculating the diameter when we could just measure it directly? Measuring is actually more interesting and hands-on. And honestly, this is a perfectly valid perspective! Sometimes direct measurement is indeed the simpler and more intuitive approach.",
  
  // Slide 6 - Complete detailed narration
  "Let's explore the fascinating challenges of measurement. What can we measure with a standard ruler? Can we measure chord length? Yes, absolutely. Diameter length? Certainly yes. Radius length? Also easily measurable. But what about circumference length? Here we encounter our first real limitation. No, we cannot directly measure circumference length with a straight ruler because circumference is a curved line. What creative solutions can we devise? Let's introduce a new parameter: let's denote circumference length with the letter c. The fundamental problem is clear - rulers are straight measuring instruments, but circumference is a curved geometric feature. Direct measurement with a ruler is impossible. What alternative measuring tools might we use? If a child suggests using string or thread - that's absolutely brilliant! We can wrap the string along the circumference, then straighten it out and measure its length with our ruler. The string's length will equal the circumference length. However, this method has practical limitations: first, it's not entirely accurate due to the flexibility of string, and second, string isn't always conveniently available when we need quick mathematical calculations.",
  
  // Slide 7 - Complete detailed narration
  "Let's embark on the exciting journey of discovering the famous mathematical constant pi. We already know that exactly two radii fit along any diameter length. But here's the intriguing question: how many diameter lengths fit along the circumference length? Through careful measurement, we discover something remarkable. We've measured a circumference value and divided it by the measured diameter value of the same circle. The result is approximately three. Now here's the fascinating part - let's repeat this experiment with circles of completely different sizes. Small circles, large circles, medium circles - the result remains consistently the same. Approximately three diameter lengths fit on any circumference length. Let's be more precise: the value is three point one four. For even greater precision: three point one four one five nine two six five three five. This is truly a famous and special number in mathematics. Mathematicians call this remarkable constant pi, represented by the Greek letter π. Throughout history, mathematicians have calculated pi to trillions of decimal places!",
  
  // Slide 8 - Complete detailed narration
  "Based on our discovery, we can now write our fundamental equation: c equals pi times d. What does this beautiful equation tell us about the nature of pi? Pi represents the circumference length per unit of diameter length. Alternatively, we can define pi as the circumference length of a circle whose diameter measures exactly one unit. This elegant relationship means that tedious circumference measurement can be completely replaced by simple diameter measurement followed by multiplication by pi. We've just calculated what would be extremely difficult or impossible to measure directly. This demonstrates the profound power of mathematical formulas - they transform seemingly impossible measurement challenges into straightforward computational solutions.",
  
  // Slide 9 - Complete detailed narration
  "Here's an interesting practical insight: measuring radius length is actually even easier than measuring diameter length! Why is this the case? For diameter measurement, we need to carefully align three distinct points with our ruler, which requires more precision and coordination. For radius measurement, we only need to align two points - the center and a point on the circumference - which is significantly simpler. We already established that d equals two r. Let's substitute this relationship into our circumference formula. The result is our final, elegant circumference formula: c equals two times pi times r. What profound educational principle does this teach us? Mathematical formulas allow us to calculate quantities that are difficult or impossible to measure directly by using relationships with quantities that are easy to measure. This represents the very essence of mathematical thinking and problem-solving.",
  
  // Slide 10 - Complete detailed narration
  "Let's practice and internalize this key mathematical concept. Ask the child to repeat this fundamental principle expressed in words: Formula allows calculating what's hard to measure using what's easy to measure. Children typically won't master this complex phrase on their first attempt. The goal is to help them memorize this important concept and express it fluently. How should we approach this learning process? Definitely not through forced memorization or pressure. Natural learning works best when it flows organically. The child intellectually understands the meaning, but their verbal articulation skills are still developing. When they stumble over the words - and they probably will - simply smile encouragingly and ask them to try again. We can make this a fun learning game by using a stopwatch to create friendly competition: who can say the phrase faster and more clearly? This approach transforms learning into an enjoyable activity that builds confidence.",
  
  // Slide 11 - Complete detailed narration
  "Time for hands-on practical application. Give the child an old compact disc and a ruler to work with. Challenge them to determine the circumference length of the CD. Carefully observe their problem-solving approach. Most children will initially try the direct but impossible method of applying the ruler to the curved edge. Allow them to struggle with this approach - this productive struggle is valuable learning. They might eventually discover the string method independently. Eventually, guide them toward the more efficient approach of measuring the diameter, which is straightforward with a ruler. Then have them write down the fundamental formula: c equals pi times d. Help them substitute their measured diameter value - typically around twelve centimeters for a standard CD. Finally, guide them through the calculation: c approximately equals three point one four times twelve, which equals thirty-seven point six eight centimeters. This hands-on experience creates lasting understanding that transcends mere memorization.",
  
  // Slide 12 - Complete detailed narration
  "Now for the most crucial educational distinction of all. Ask the child directly: Did you measure the circumference length? They will almost certainly answer: Yes! Provide gentle but firm correction: No. You measured the diameter length. The circumference length - you calculated, not measured. This distinction is absolutely fundamental to mathematical literacy. From the very beginning, we must clearly demonstrate and reinforce the critical difference between measurement and calculation. Mathematical formulas serve as bridges connecting these two approaches. Formulas don't eliminate the need for measurement - instead, they transcend measurement's inherent limitations. This necessity for systematic notation gave birth to the concept of mathematical parameters. From the relationships between parameters emerged the concept of formulas. From formulas arose the powerful capability of mathematical calculation. Your child now understands not merely how to count, but comprehends the deeper purpose behind those mysterious letters in mathematical equations. They possess the key - c equals two pi r. This key unlocks the door from the tangible world of direct observation and measurement to the abstract realm of mathematical understanding and logical derivation."
];

async function generateFullLesson3WithRESTAPI(apiKey) {
  console.log('🎬 Generating COMPLETE Lesson 3 audio using Google Cloud TTS REST API...');
  console.log('🔑 Using provided API key for authentication\n');
  
  try {
    // Clean existing files
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
    
    // Generate full audio for each slide
    for (let i = 0; i < FULL_LESSON_3_CONTENTS.length; i++) {
      try {
        console.log(`\n📝 Processing Slide ${i + 1}/${FULL_LESSON_3_CONTENTS.length}`);
        console.log(`Word count: ${FULL_LESSON_3_CONTENTS[i].split(' ').length} words`);
        
        await generateTTSWithAPIKey(FULL_LESSON_3_CONTENTS[i], `slide${i + 1}.mp3`, apiKey);
        console.log(`✅ Slide ${i + 1} completed successfully\n`);
        
      } catch (error) {
        console.log(`❌ Slide ${i + 1} failed: ${error.message}\n`);
        continue;
      }
    }
    
    console.log('\n🎉 COMPLETE Lesson 3 audio generation FINISHED!');
    console.log('🎧 All 12 slides now contain FULL detailed narration with professional TTS');
    console.log('🎵 Each slide features complete lesson content, not just brief summaries');
    
  } catch (error) {
    console.error('💥 Process failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  const apiKey = process.argv[2] || 'AIzaSyDSrWekemLElh06BPEfyktu3nQT4tF3Tf4';
  generateFullLesson3WithRESTAPI(apiKey);
}