// Generate audio for Lesson 11: The Number 666
// Run: node scripts/generate-lesson11-audio.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const slides = [
  {
    id: 1,
    text: `We have traveled a path from the circle to the Sacred Description. We have seen how the act of distinction creates the world. Now before us lies the final riddle — the number of the Beast, 666.

"Here is wisdom. Let him who has understanding count the number of the beast, for it is the number of a man..."

The key word is "count." Not "learn," not "memorize." "Count" — calculate, derive, understand the algorithm.`
  },
  {
    id: 2,
    text: `Six is the number of the fullness of physical perception. Five senses: sight, hearing, smell, taste, touch. Plus a sixth — the sense of bodily attraction, of instinct.

The first six is a world ruled by six isolated senses. Each pulls in its own direction. This is the world of pure reaction, the kingdom of the Beast.

In this world there is no "other." There is only "I" and what my senses register as food, threat, or mate. Each sense operates independently. Each is directed inward, showing only what the beast's own body experiences.`
  },
  {
    id: 3,
    text: `Then Light appears — the ability to abstract. Man looks at his six senses from the outside. He begins to unite them. With what? With Love.

Love is a new principle of organizing the six senses. Now they are directed outward — toward understanding another "I."

The second six is the Human number. Six senses unite in the phenomenon of human love. Paraphrasing Augustine: ordinary, physical love is that by which the soul is informed of what another body experiences.`
  },
  {
    id: 4,
    text: `But even this is not the limit. What if one rises even higher?

Jesus speaks of Divine Love — Agape. This is the principle of connecting souls directly, bypassing the mediation of the senses.

The third six is the Divine number. The transition to the level of pure spirit.

Six One equals the Beast equals senses. Six Two equals Human equals love. Six Three equals God equals Agape.

Divine love is that by which the soul is informed of what another soul experiences.`
  },
  {
    id: 5,
    text: `Now we can count. Six hundred sixty-six is not one number. It is a formula: six-one, six-two, six-three. A three-step path of ascent.

"The number of a man" — an indication of the second step. But wisdom lies in seeing the entire staircase as a whole.

This is like the sacred mathematical trinity: Quantity — concrete apples. Digit — the symbol "6". Number — pure abstraction. Each level transcends and includes the previous one.`
  },
  {
    id: 6,
    text: `And then the final words become clear.

"The End of Light": Light was needed to travel the path from six-one to six-three. When the goal is reached, the need for distinction falls away. The "end of Light" arrives — not a catastrophe, but the completion of its mission.

"And Man shall disappear" — he will overcome himself and become what the Apostle Paul called a "spiritual body."

As long as human souls are separated by the physical, man will exist. When the third six is fully achieved, all souls will merge and unite with God.

Thank you for your attention.`
  }
];

const outputDir = path.join(__dirname, '..', 'public', 'audio', 'lesson11');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created directory: ${outputDir}`);
}

async function generateAudio() {
  console.log('🎙️ Generating audio for Lesson 11: The Number 666\n');
  
  for (const slide of slides) {
    const outputFile = path.join(outputDir, `slide${slide.id}.mp3`);
    const textFile = path.join(outputDir, `slide${slide.id}.txt`);
    
    fs.writeFileSync(textFile, slide.text);
    
    console.log(`🔊 Generating slide ${slide.id}...`);
    
    try {
      execSync(`edge-tts --voice en-US-GuyNeural --rate="-5%" --file "${textFile}" --write-media "${outputFile}"`, {
        stdio: 'inherit'
      });
      
      fs.unlinkSync(textFile);
      
      console.log(`✅ Slide ${slide.id} complete: ${outputFile}\n`);
    } catch (error) {
      console.error(`❌ Error generating slide ${slide.id}:`, error.message);
    }
  }
  
  console.log('🎉 Audio generation complete for Lesson 11!');
}

generateAudio();
