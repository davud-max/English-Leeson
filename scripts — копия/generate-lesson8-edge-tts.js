const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Lesson 8: Theory of Cognitive Resonance - Audio texts
const LESSON_8_TEXTS = [
  `Lesson 8: Theory of Cognitive Resonance. Today we will talk about what happens at the very moment when a thought comes to you. Not when you build it brick by brick, but when it arrives suddenly, like an illumination. Why, out of thousands of possible ideas, does consciousness choose precisely this one? Why does one piece of knowledge remain dead weight, while another lights up the Eureka bulb and changes behavior?`,
  
  `How Does Thought Find Us? We will not turn to brain scanners. We will turn to inner experience. We will build a phenomenological model — a map of how we experience the process of thinking. The Theory of Cognitive Resonance is a model that places at the center not neurons, but you yourself — your unique I, your feelings and capacity for discovery. This theory explains the selective mechanism of consciousness — why some thoughts become ours, while others pass by unnoticed.`,
  
  `Part One: Two Circuits of Consciousness. To understand the mechanism of thought selection, let us imagine our consciousness consisting of two interconnected but fundamentally different circuits. The Analog Circuit is the world of immediate, bodily, sensory experience — the taste of an apple, pain from a burn, warmth of the sun, vague longing. The Digital Circuit is the world of abstractions, signs, concepts — the word apple, medical terms, temperature in degrees. These two circuits speak different languages and have completely different properties.`,
  
  `The Analog Circuit represents Proto-Knowledge. This is the world of direct experience. It cannot be transmitted in words — only experienced. Its language is not words, but experiences. Its bandwidth is low, only dozens of states. But each state is deeply rooted, energetically saturated, a life lesson learned. This is the inner core, the foundation of personality. The taste of grandmother's pie. The first heartbreak. The triumph of a solved problem. These experiences cannot be conveyed — they can only be lived through.`,
  
  `The Digital Circuit functions as an Interface. This is the world of signs, symbols, abstract concepts. Its language is clear and communicable. Its bandwidth is colossal — billions of combinations per second. But by itself — it is empty! The word pain is just a set of sounds. The digit five is an abstraction without an object. The formula E equals m c squared is symbols on paper. Key insight: The digital circuit can manipulate trillions of combinations, but without connection to the analog — it's just empty symbol shuffling.`,
  
  `Part Two: The Mechanism of Thinking — Dialogue and Resonance. Where is thought born that we recognize as our own? Thinking is not the work of one circuit. It is a process of resonant dialogue between them! First: Generation — the digital circuit proposes variants: what if, this is similar to. Second: Projection — each model is projected onto the analog core. Third: Resonance — the moment of truth: pattern match! Fourth: Birth of Thought — the amplified signal breaks through into consciousness.`,
  
  `The Decisive Moment. What happens when the digital model meets the analog core? If no resonance: the model doesn't find response, the signal fades, it becomes an empty mind game, unimportant information. If resonance exists: the pattern matches! There is sharp amplification. An important thought emerges! Illumination! True desire! Formula of Thinking: The digital system asks questions, while the analog votes with the resource of attention and emotional energy. The winner gets the right to become a conscious thought.`,
  
  `Part Three: The Inner Resonator and the Birth of Goals. What is this analog core that resonates so selectively? This is our unique Inner Resonator, or cognitive profile. What shapes it? First: Heredity — data from the manufacturer, features of the nervous system. Second: Cultural Code — language, values, concepts of society. Third: Personal Experience — every experience, success and failure tunes the resonator. Each of us is a unique instrument that responds to its own frequencies!`,
  
  `How Goals Are Born. If a thought describes a reality more preferable than the current one, a chain reaction begins. First comes a thought: It would be good if. Then resonance with the analog core occurs. This creates desire — an emotionally charged image. Desire leads to action — we begin to act. And finally, a goal emerges — a desire we embody in action. Important conclusion: Purposeful activity is not something separate from thinking. It is its direct, natural continuation!`,
  
  `Part Four: Pedagogy of Resonance — How to Develop Thinking? If thinking is resonance, then how do we develop it? The answer becomes crystal clear! The dead-end path is traditional memorization: loading the digital circuit with empty signs, no connection to experience, no material for resonance. The student doesn't want to learn. The effective path is learning through experience: first experience, then name for it. This creates powerful resonance! Knowledge becomes one's own.`,
  
  `The Logic of Effective Learning. Step One: Create analog experience. Create a situation where the student feels the problem, acts, experiences. Step Two: Provide digital label. At the moment of peak experience, give a name, a formula, a rule. Step Three: Resonance happens! Living experience connects with abstract sign — the wow effect. The teacher's task is not to transmit information, but to organize a meeting between the student's analog experience and the digital label of knowledge.`,
  
  `Conclusion: Thought as Encounter. We are not processors coldly sorting through data. We are unique resonators of meaning. Our thoughts are gifts that we discover within ourselves when a signal finds response in our experience. Care for the richness of your analog world: Fill it with diverse experience, deep feelings, bold actions. And then more and more thoughts will find their resonance in you, and you — your unique place and purpose in the world! Thank you for your attention.`
];

// Voice options: en-US-GuyNeural (male), en-US-JennyNeural (female), en-GB-RyanNeural (British male)
const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';  // Slightly slower

async function checkEdgeTTS() {
  try {
    await execPromise('edge-tts --version');
    return true;
  } catch {
    return false;
  }
}

async function generateAudio(text, outputPath) {
  // Escape quotes for shell
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'\\''");
  const command = `edge-tts --voice "${VOICE}" --rate="${RATE}" --text "${escapedText}" --write-media "${outputPath}"`;
  
  await execPromise(command);
}

async function main() {
  console.log('🎬 Starting audio generation for Lesson 8 (Microsoft Edge TTS)...');
  console.log(`🎤 Voice: ${VOICE}`);
  console.log(`📝 Total slides: ${LESSON_8_TEXTS.length}`);
  console.log('');
  
  // Check if edge-tts is installed
  const hasEdgeTTS = await checkEdgeTTS();
  if (!hasEdgeTTS) {
    console.log('❌ edge-tts not found. Installing...');
    console.log('');
    console.log('Run this command first:');
    console.log('  pip install edge-tts');
    console.log('');
    console.log('Or with pip3:');
    console.log('  pip3 install edge-tts');
    process.exit(1);
  }
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson8');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_8_TEXTS.length; i++) {
    const filename = `slide${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    console.log(`🔊 Generating slide ${i + 1}/${LESSON_8_TEXTS.length}...`);
    
    try {
      await generateAudio(LESSON_8_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ Generated: ${filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ Failed: ${filename} - ${error.message}`);
    }
  }
  
  console.log('');
  console.log('🎉 Audio generation complete!');
  console.log(`📁 Location: ${audioDir}`);
}

main().catch(console.error);
