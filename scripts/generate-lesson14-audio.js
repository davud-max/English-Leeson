// Generate audio for Lesson 14: How Consciousness Creates Reality
// Run: node scripts/generate-lesson14-audio.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const slides = [
  {
    id: 1,
    text: `We began with something simple: "Describe what you see." But we encountered a fundamental paradox.

To describe something, you need words. But words are terms. And terms require definitions. Which brings us back to needing to describe... A closed circle.

Only one thing can break this cycle — the act of primary distinction. This is where cognition truly begins — not with ready-made concepts, but with the ability to draw a boundary between "this" and "not this."`
  },
  {
    id: 2,
    text: `Imagine absolute darkness — not physical darkness, but meaningful darkness.

In this state, there is no "here" or "there", no "self" or "other", no distinctions whatsoever.

This is what ancient texts call "water" — homogeneous, indistinguishable Being.

What can emerge from this unity? Only one thing — the appearance of boundaries. But for boundaries to appear, light is needed. And light is not photons — it's the ability to draw a line and say: "this is not that."`
  },
  {
    id: 3,
    text: `Biblical formulation: "And God said: let there be light. And there was light."

Key insight: God didn't "create" light in the usual sense. He named it.

What does this mean in our terms? Observable separates from unobservable. "Earth" — the World — separates from "Heaven" — Nothing. Firmament appears — the first boundary.

Light equals the first operation of distinction. Before naming, there was no difference. The act of naming creates the difference.`
  },
  {
    id: 4,
    text: `Let's recall our first lecture about the circle.

Object: Chalk mark on board equals "water" — indistinguishable Being.
Observer: Child watching equals Spirit "moving over water".
Description: Drawing boundaries — curved, closed, equidistant — equals Light.

These three elements are inseparable. Remove any one — and the circle doesn't exist. The circle is not "out there" waiting to be discovered. It emerges in the act of distinction performed by a conscious observer.`
  },
  {
    id: 5,
    text: `Three Inseparable Elements.

Being — what is — Father equals Source Material.
Consciousness — what distinguishes — Holy Spirit equals Observing Spirit.
Act of Distinction — light giving birth to boundaries — Son or Logos equals Word.

This is not mysticism, but a strict scheme of how cognition works.

Every cognitive act requires all three: Something to cognize — Being. Someone to cognize it — Consciousness. The act of cognizing — Distinction. Remove any element — and cognition disappears.`
  },
  {
    id: 6,
    text: `Key principle: Terms in our first lecture were born only after definitions. Similarly, the world is born only after acts of distinction.

God didn't "create" the world like a craftsman makes furniture. The world "appeared" when an Observer capable of distinction emerged.

This is not idealism denying external reality. This is a precise statement about the nature of cognition. Without an observer — no observed. Without distinction — no distinct objects. Without light — no boundaries.`
  },
  {
    id: 7,
    text: `Biblical perspective: "And the Lord God formed man from dust of the ground, and breathed into his nostrils breath of life."

Translation: "Dust of the ground" equals undifferentiated material of being. "Breath of life" equals the light of distinction that makes man conscious.

Man is not a passive observer but an active participant in creation. Every time you distinguish something — name it, categorize it, understand it — you participate in the ongoing act of creation.`
  },
  {
    id: 8,
    text: `Revelation 21:1: "And I saw a new heaven and a new earth, for the first heaven and the first earth had passed away."

This is not about planetary destruction. It's about consciousness paradigm shift.

Change in distinguishing ability. Appearance of "new light". Old world disappears, new world emerges.

Reality transforms when consciousness transforms. When humanity develops a new way of seeing — a new "light" — the entire world changes. Not physically, but cognitively.`
  },
  {
    id: 9,
    text: `We don't live in "objective reality." We live in reality distinguished by our consciousness.

Your objects — table, cup, friend — these are boundaries drawn by your light-consciousness in the fabric of Being.

Why are these boundaries stable? Our "metric" of distinction is shared culturally. Common cognitive framework. Similar distinguishing abilities.

Your reality is constructed by your consciousness. This is not solipsism — it's the recognition that cognition is always an active process.`
  },
  {
    id: 10,
    text: `Same physical Being, different distinctions. A dolphin distinguishes reality differently. A bat perceives different boundaries. An alien might have completely different "light".

Exercise: Look at any object. Try to stop recognizing it. Forget its name and function. See it as "piece of distinguished Being".

You'll feel dizziness — the experience of boundary dissolution. This is a glimpse of what lies beneath our constructed reality — the undifferentiated water of Being.

Thank you for your attention.`
  }
];

const outputDir = path.join(__dirname, '..', 'public', 'audio', 'lesson14');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created directory: ${outputDir}`);
}

async function generateAudio() {
  console.log('🎙️ Generating audio for Lesson 14: How Consciousness Creates Reality\n');
  
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
  
  console.log('🎉 Audio generation complete for Lesson 14!');
}

generateAudio();
