const fs = require('fs');
const path = require('path');
const textToSpeech = require('@google-cloud/text-to-speech');

// Initialize Google Cloud TTS client
const client = new textToSpeech.TextToSpeechClient();

// Lesson 8: Theory of Cognitive Resonance - Audio texts
const LESSON_8_TEXTS = [
  // Slide 1: Introduction
  `Lesson 8: Theory of Cognitive Resonance. Today we will talk about what happens at the very moment when a thought "comes" to you. Not when you build it brick by brick, but when it arrives suddenly, like an illumination. Why, out of thousands of possible ideas, does consciousness choose precisely this one? Why does one piece of knowledge remain dead weight, while another lights up the "Eureka!" bulb and changes behavior?`,
  
  // Slide 2: Our Approach
  `Introduction: How Does Thought Find Us? We will not turn to brain scanners. We will turn to inner experience. We will build a phenomenological model — a map of how we experience the process of thinking. The Theory of Cognitive Resonance is a model that places at the center not neurons, but YOU yourself — your unique "I", your feelings and capacity for discovery. This theory explains the selective mechanism of consciousness — why some thoughts become ours, while others pass by unnoticed.`,
  
  // Slide 3: Two Circuits of Consciousness
  `Part One: Two Circuits of Consciousness. To understand the mechanism of thought selection, let us imagine our consciousness consisting of two interconnected but fundamentally different circuits. The Analog Circuit is the world of immediate, bodily, sensory experience — the taste of an apple, pain from a burn, warmth of the sun, vague longing. The Digital Circuit is the world of abstractions, signs, concepts — the word "apple", medical terms, temperature in degrees, the word "melancholy". These two circuits speak different languages and have completely different properties!`,
  
  // Slide 4: The Analog Circuit
  `The Analog Circuit represents Proto-Knowledge. This is the world of direct experience. It cannot be transmitted in words — only experienced. Its language is NOT words, but EXPERIENCES. Its bandwidth is LOW — only dozens of states. But EACH state is deeply rooted, energetically saturated, a life lesson learned. This is the inner core, the foundation of personality. The taste of grandmother's pie. The first heartbreak. The triumph of a solved problem. Fear of heights. Joy of recognition. These experiences cannot be conveyed — they can only be lived through.`,
  
  // Slide 5: The Digital Circuit
  `The Digital Circuit functions as an Interface. This is the world of signs, symbols, abstract concepts. Its language is clear and communicable. Its bandwidth is COLOSSAL — billions of combinations per second. But by itself — it is EMPTY! The word "pain" is just a set of sounds. The digit "5" is an abstraction without an object. The formula E equals m c squared is symbols on paper. Key insight: The digital circuit can manipulate trillions of combinations, but without connection to the analog — it's just empty symbol shuffling.`,
  
  // Slide 6: The Resonance Mechanism
  `Part Two: The Mechanism of Thinking — Dialogue and Resonance. Where is thought born that we recognize as our own? Thinking is not the work of one circuit. It is a process of resonant dialogue between them! Here's how it works. First: Generation — the digital circuit proposes variants: "what if...", "this is similar to...". Second: Projection — each model is projected onto the analog core. Third: Resonance — the moment of truth: pattern match! Fourth: Birth of Thought — the amplified signal breaks through into consciousness.`,
  
  // Slide 7: Resonance or Not?
  `The Decisive Moment. What happens when the digital model meets the analog core? If NO RESONANCE: The model doesn't find response, the signal fades, it becomes an empty mind game, unimportant information. If RESONANCE EXISTS: The pattern matches! There is sharp AMPLIFICATION. An important thought emerges! Illumination! True desire! Formula of Thinking: The digital system asks questions, while the analog votes with the resource of attention and emotional energy. The winner gets the right to become a conscious thought.`,
  
  // Slide 8: The Inner Resonator
  `Part Three: The Inner Resonator and the Birth of Goals. What is this "analog core" that resonates so selectively? This is our unique Inner Resonator, or cognitive profile. What shapes it? First: Heredity — data "from the manufacturer", features of the nervous system. Second: Cultural Code — language, values, concepts of society. Third: Personal Experience — every experience, success and failure tunes the resonator. Each of us is a unique instrument that responds to its own frequencies!`,
  
  // Slide 9: Birth of Goals
  `How Goals Are Born. If a thought describes a reality more preferable than the current one, a chain reaction begins. First comes a THOUGHT: "It would be good if..." Then RESONANCE with the analog core occurs. This creates DESIRE — an emotionally charged image. Desire leads to ACTION — we begin to act. And finally, a GOAL emerges — a desire we embody in action. Important conclusion: Purposeful activity is not something separate from thinking. It is its DIRECT, NATURAL continuation!`,
  
  // Slide 10: Pedagogy of Resonance
  `Part Four: Pedagogy of Resonance — How to Develop Thinking? If thinking is resonance, then how do we develop it? The answer becomes crystal clear! The DEAD-END PATH is traditional memorization: Loading the digital circuit with empty signs, no connection to experience, no material for resonance. The student "doesn't want" to learn. The EFFECTIVE PATH is learning through experience: First comes EXPERIENCE, then NAME for it. This creates powerful RESONANCE! Knowledge becomes "one's own".`,
  
  // Slide 11: Logic of Effective Learning
  `The Logic of Effective Learning. Step One: Create ANALOG EXPERIENCE. Create a situation where the student feels the problem, acts, experiences. Step Two: Provide DIGITAL LABEL. At the moment of peak experience, give a name, a formula, a rule. Step Three: RESONANCE happens! Living experience connects with abstract sign. The "WOW!" effect. The Teacher's Task is not to transmit information, but to organize a meeting between the student's analog experience and the digital label of knowledge.`,
  
  // Slide 12: Conclusion
  `Conclusion: Thought as Encounter. WE ARE RESONATORS. We are not processors coldly sorting through data. We are unique resonators of meaning. THOUGHTS ARE GIFTS. Our thoughts are gifts that we discover within ourselves when a signal finds response in our experience. Care for the richness of your ANALOG world: Fill it with diverse experience, deep feelings, bold actions. And then more and more thoughts will find their resonance in you, and you — your unique place and PURPOSE in the world! Thank you for your attention!`
];

async function generateAudio(text, filename) {
  const request = {
    input: { text: text },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Standard-D', // Male voice
      ssmlGender: 'MALE'
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.95,
      pitch: 0
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson8');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, response.audioContent, 'binary');
    
    console.log(`✅ Generated: ${filename} (${Math.round(response.audioContent.length / 1024)}KB)`);
    return filePath;
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.message);
    throw error;
  }
}

async function generateAllAudio() {
  console.log('🎬 Starting audio generation for Lesson 8: Theory of Cognitive Resonance...');
  console.log(`📝 Total slides: ${LESSON_8_TEXTS.length}`);
  console.log('');
  
  try {
    for (let i = 0; i < LESSON_8_TEXTS.length; i++) {
      console.log(`🔊 Generating slide ${i + 1}/${LESSON_8_TEXTS.length}...`);
      await generateAudio(LESSON_8_TEXTS[i], `slide${i + 1}.mp3`);
      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('');
    console.log('🎉 All audio files generated successfully for Lesson 8!');
    console.log('📁 Location: public/audio/lesson8/');
    
  } catch (error) {
    console.error('💥 Audio generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateAllAudio();
}

module.exports = { generateAllAudio, LESSON_8_TEXTS };
