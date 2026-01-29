// Generate audio for Lesson 12: Three Steps to Heaven
// Run: node scripts/generate-lesson12-audio.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const slides = [
  {
    id: 1,
    text: `"Here is wisdom. Let him who has understanding count the number of the beast, for it is the number of a man; his number is six hundred sixty-six." So it is written in the Revelation of John the Theologian.

Augustine said: "A sense is that by which the soul is informed of what the body experiences."

How many physical senses are there? We know five. They say there is a sixth, but it is said to be something metaphysical. All information from the external world comes to us through the sense organs. For each kind of external influence there is its own organ.`
  },
  {
    id: 2,
    text: `The ear hears sounds. The eyes react to light, see. The nose reacts to smells. The mouth feels taste. The skin feels touch. Five basic physical senses. But is it five?

What if there were six? Six, like the sixes in the Apocalypse. Yes — it is the sexual sense and the sexual organs. It is entirely physical and has its own organ. And this is a sense that cannot be obtained through other sense organs or replaced by other senses.

The flourishing of the world of the beast is the final formation of six physical senses operating on the basis of instincts and reflexes. This first six — the first sign in the number 666 — is the number of the beast.

In the first six, each unit is isolated. Each sense works independently. Each sense is directed inward and shows only what the beast's own body experiences. And the beast has no concern for what another body experiences.`
  },
  {
    id: 3,
    text: `Man, having received the ability to abstract, looked at the first six senses from the outside. He began gradually to abstract from them. Thereby he gained the ability not to submit to them, but to rule over them. To rule under the sign of love.

Ordinary, physical love is the unification of all six senses under a single human sign for the understanding by one person of the feelings of another person. Paraphrasing Augustine: ordinary, physical love is that by which the soul is informed of what another body experiences.

This awareness is as yet the only path to knowing another soul. The unified second six was at first weaker than the number of the beast. But over time, the human began to overcome the bestial. The second six in the number 666 is the human number.

Let us explain with an example: six real apples are a group of isolated units. But at the second level, the group is presented as something unified, indivisible. And it is designated not by a set of units, but by an abstract symbol — the digit 6.`
  },
  {
    id: 4,
    text: `Jesus, in turn, brought a new Love. Love with a capital letter. Love in which the bestial, the physical, is finally overcome through complete abstraction from the sensory.

The third six in the number 666 is the transcendence of both the sign of the beast and the sign of man. The third six is love of God and the divine number.

Paraphrasing Augustine again: supreme love is that by which the soul is informed of what another soul experiences. And love of the Lord, or divine love, is the direct communion of the individual soul with the universal soul. This is the limit of man.

This is like a sacred mathematical trinity: quantity — digit — number. The third step — number — completely transcends both the apples themselves and the sign of the quantity of apples. This is complete abstraction. It is impossible to represent a number. Any attempt to represent a number leads to the appearance of either its sign — a digit — or a concrete quantity of what is being counted.`
  },
  {
    id: 5,
    text: `By most people, the call of Jesus was understood literally. Christians call for departure from the sensory through rejection of it. They declared everything sensory, bodily, to be sin, and succeeded so well in this that the sexual sense is not even perceived as one of the human senses. Moreover, it is associated with sin. Therefore, people speak only of five senses.

True love, of which Jesus spoke, is complete abstraction from physical love, from the six senses — not rejection of them.

This is like the smile of the Cheshire Cat without the cat. But destroy the cat — and you destroy the smile. Destroy the physical senses — and you destroy divine love.`
  },
  {
    id: 6,
    text: `No matter how high a level of abstraction man may reach, no matter how exalted a love he may attain, no matter how deeply he may penetrate into understanding the soul of another person — a physical boundary between souls still remains.

The number of the beast will never be completely overcome, for it is also the human number. Therefore, man will exist only as long as human souls are separated by the physical.

Loving one's neighbor, through communion with his living soul, man learns, as it were, to commune with the universal soul — with God.

When the final transition is accomplished and the human number is overcome, the last six — the number of God — will be attained. And the third step to heaven will be overcome. And all souls will merge into one and unite with God.

And the end of Light will come, for God has no need of light. And man will disappear.

Thank you for your attention.`
  }
];

const outputDir = path.join(__dirname, '..', 'public', 'audio', 'lesson12');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created directory: ${outputDir}`);
}

async function generateAudio() {
  console.log('🎙️ Generating audio for Lesson 12: Three Steps to Heaven\n');
  
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
  
  console.log('🎉 Audio generation complete for Lesson 12!');
}

generateAudio();
