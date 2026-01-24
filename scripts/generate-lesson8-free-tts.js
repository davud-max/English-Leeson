const fs = require('fs');
const path = require('path');
const https = require('https');

// Lesson 8: Theory of Cognitive Resonance - Audio texts
const LESSON_8_TEXTS = [
  // Slide 1
  `Lesson 8: Theory of Cognitive Resonance. Today we will talk about what happens at the very moment when a thought comes to you. Not when you build it brick by brick, but when it arrives suddenly, like an illumination. Why, out of thousands of possible ideas, does consciousness choose precisely this one?`,
  
  // Slide 2
  `How Does Thought Find Us? We will not turn to brain scanners. We will turn to inner experience. We will build a phenomenological model, a map of how we experience the process of thinking. The Theory of Cognitive Resonance is a model that places at the center not neurons, but you yourself, your unique I, your feelings and capacity for discovery.`,
  
  // Slide 3
  `Two Circuits of Consciousness. To understand the mechanism of thought selection, let us imagine our consciousness consisting of two interconnected but fundamentally different circuits. The Analog Circuit is the world of immediate, bodily, sensory experience. The Digital Circuit is the world of abstractions, signs, and concepts. These two circuits speak different languages.`,
  
  // Slide 4
  `The Analog Circuit represents Proto-Knowledge. This is the world of direct experience. It cannot be transmitted in words, only experienced. Its language is not words, but experiences. Its bandwidth is low, only dozens of states. But each state is deeply rooted, energetically saturated, a life lesson learned. This is the inner core, the foundation of personality.`,
  
  // Slide 5
  `The Digital Circuit functions as an Interface. This is the world of signs, symbols, abstract concepts. Its language is clear and communicable. Its bandwidth is colossal, billions of combinations per second. But by itself, it is empty. The word pain is just a set of sounds. The digit five is an abstraction without an object.`,
  
  // Slide 6
  `The Mechanism of Thinking: Dialogue and Resonance. Thinking is not the work of one circuit. It is a process of resonant dialogue between them. First, Generation: the digital circuit proposes variants. Second, Projection: each model is projected onto the analog core. Third, Resonance: the moment of truth, pattern match. Fourth, Birth of Thought: the amplified signal breaks through into consciousness.`,
  
  // Slide 7
  `The Decisive Moment. What happens when the digital model meets the analog core? If no resonance, the model doesn't find response, the signal fades, it becomes empty mind game. If resonance exists, the pattern matches, there is sharp amplification. An important thought emerges. The digital system asks questions, while the analog votes with attention and emotional energy.`,
  
  // Slide 8
  `The Inner Resonator. What is this analog core that resonates so selectively? This is our unique Inner Resonator, or cognitive profile. What shapes it? Heredity, data from the manufacturer. Cultural Code, language, values, concepts of society. Personal Experience, every success and failure tunes the resonator. Each of us is a unique instrument.`,
  
  // Slide 9
  `How Goals Are Born. If a thought describes a reality more preferable than the current one, a chain reaction begins. First comes a thought. Then resonance with the analog core occurs. This creates desire, an emotionally charged image. Desire leads to action. And finally, a goal emerges. Purposeful activity is the direct, natural continuation of thinking.`,
  
  // Slide 10
  `Pedagogy of Resonance. How to Develop Thinking? If thinking is resonance, then how do we develop it? The dead-end path is traditional memorization: loading the digital circuit with empty signs, no connection to experience. The effective path is learning through experience: first experience, then name for it. This creates powerful resonance. Knowledge becomes one's own.`,
  
  // Slide 11
  `The Logic of Effective Learning. Step One: Create analog experience, a situation where the student feels the problem, acts, experiences. Step Two: Provide digital label, at the moment of peak experience, give a name, a formula, a rule. Step Three: Resonance happens. Living experience connects with abstract sign, the wow effect. The teacher's task is to organize this meeting.`,
  
  // Slide 12
  `Conclusion: Thought as Encounter. We are not processors coldly sorting through data. We are unique resonators of meaning. Our thoughts are gifts that we discover within ourselves when a signal finds response in our experience. Care for the richness of your analog world. Fill it with diverse experience, deep feelings, bold actions. Thank you for your attention.`
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadTTS(text, outputPath) {
  return new Promise((resolve, reject) => {
    // Split text into chunks (Google Translate TTS limit is ~200 chars)
    const maxLen = 200;
    const chunks = [];
    let remaining = text;
    
    while (remaining.length > 0) {
      if (remaining.length <= maxLen) {
        chunks.push(remaining);
        break;
      }
      
      // Find last space before maxLen
      let splitIndex = remaining.lastIndexOf(' ', maxLen);
      if (splitIndex === -1) splitIndex = maxLen;
      
      chunks.push(remaining.substring(0, splitIndex));
      remaining = remaining.substring(splitIndex + 1);
    }
    
    const audioBuffers = [];
    let completedChunks = 0;
    
    const downloadChunk = (index) => {
      if (index >= chunks.length) {
        // All chunks done, combine
        const combined = Buffer.concat(audioBuffers);
        fs.writeFileSync(outputPath, combined);
        resolve();
        return;
      }
      
      const chunk = encodeURIComponent(chunks[index]);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${chunk}`;
      
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        }
      };
      
      https.get(url, options, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Follow redirect
          https.get(response.headers.location, options, (res2) => {
            const data = [];
            res2.on('data', chunk => data.push(chunk));
            res2.on('end', () => {
              audioBuffers[index] = Buffer.concat(data);
              completedChunks++;
              setTimeout(() => downloadChunk(index + 1), 500);
            });
          }).on('error', reject);
        } else if (response.statusCode === 200) {
          const data = [];
          response.on('data', chunk => data.push(chunk));
          response.on('end', () => {
            audioBuffers[index] = Buffer.concat(data);
            completedChunks++;
            setTimeout(() => downloadChunk(index + 1), 500);
          });
        } else {
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      }).on('error', reject);
    };
    
    downloadChunk(0);
  });
}

async function generateAllAudio() {
  console.log('🎬 Starting audio generation for Lesson 8 (Free Google TTS)...');
  console.log(`📝 Total slides: ${LESSON_8_TEXTS.length}`);
  console.log('');
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson8');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_8_TEXTS.length; i++) {
    const filename = `slide${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    console.log(`🔊 Generating slide ${i + 1}/${LESSON_8_TEXTS.length}...`);
    
    try {
      await downloadTTS(LESSON_8_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ Generated: ${filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ Failed: ${filename} - ${error.message}`);
    }
    
    // Delay between slides to avoid rate limiting
    await sleep(1500);
  }
  
  console.log('');
  console.log('🎉 Audio generation complete!');
  console.log(`📁 Location: ${audioDir}`);
}

generateAllAudio().catch(console.error);
