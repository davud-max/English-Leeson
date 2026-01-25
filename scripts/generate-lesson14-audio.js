#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Audio content for Lesson 14
const AUDIO_SEGMENTS = [
  "We began with something simple: 'Describe what you see.' And we encountered a paradox: to describe, you already need to know words. But words are terms, and terms are labels for definitions. We get a closed circle.",
  "Only one thing can break it — the act of primary distinction. Even before words. Even before definitions.",
  "Imagine absolute darkness. Not physical, but meaningful. There is no 'here' or 'there', no 'I' or 'not-I'. This is what ancient texts call 'water' — homogeneous, indistinguishable Being.",
  "What can happen in this 'water'? Only one thing — the appearance of a boundary. But for this, light is needed.",
  "Light is not photons. It's the ability to draw a line and say: 'this is not that.'",
  "In the Bible, this moment is described thus: 'And God said: let there be light. And there was light.' Notice: God didn't 'create' light in the usual sense. He named it. That is, light appears as an act of naming, as the first operation of distinction.",
  "Light separated from darkness. What does this mean in our conceptual system? The observable separated from the unobservable. 'Earth' — World — separated from 'heaven' — Nothing. A firmament appeared — that very first boundary.",
  "Let's recall our first lecture. What happened when we started describing a circle?",
  "Object — chalk mark on board — this is analogous to 'water', indistinguishable Being.",
  "Observer — the child who looks — this is analogous to the Spirit that 'moves over the water.'",
  "Act of description — drawing boundaries: curved, closed, equidistant — this is the light itself.",
  "Here are the three inseparable elements:",
  "Being — what is.",
  "Consciousness — what distinguishes.",
  "Act of distinction — light, giving birth to boundaries.",
  "In religious tradition, this is called Father, Son, and Holy Spirit. But in our system, this is not mysticism, but a strict scheme of cognition.",
  "Father equals Being — the source material.",
  "Son equals Logos, Word, act of distinction — light.",
  "Holy Spirit equals Consciousness, spirit of the observer.",
  "Pay attention: in our first lecture, a term was born only after definition. Here too: the world is born only after the act of distinction. God didn't 'create' the world like a carpenter creates a table. The world 'appeared' as a result of an Observer capable of distinguishing it appearing.",
  "Here's the key point. If the world appears only when there is someone to distinguish it, then man is not a passive spectator. He is a co-creator.",
  "In the Bible: 'And the Lord God formed man from the dust of the ground, and breathed into his nostrils the breath of life.' 'Dust of the ground' — this is still undifferentiated material of being. 'Breath of life' — this is that same light, the ability to distinguish, which makes man living consciousness.",
  "The terrible meaning of the phrase becomes clear: 'And I saw a new heaven and a new earth, for the first heaven and the first earth had passed away.' This is not about the end of the planet. This is about a change in consciousness paradigm. When a person's way of distinguishing changes — 'new light' appears — for him the old world disappears and a new one appears.",
  "We live not in 'objective reality'. We live in reality distinguished by our consciousness.",
  "Your table, your cup, your friend — all this is boundaries drawn by your light-consciousness in the indivisible fabric of Being. These boundaries are stable because our way of distinguishing — our 'metric', as physicists would say — is common to all people raised in the same culture.",
  "But imagine a creature with a different 'metric' — for example, a dolphin, a bat, or an alien. For them, the firmament passes in different places. Their 'earth' and their 'heaven' are different. They live in a different world, though the physical Being is one.",
  "Exercise: Look at any object in the room. Try to stop recognizing it. Forget its name, function. Try to see in it simply 'a piece of distinguished Being'. This is an attempt to return to 'water' before the appearance of light. You will feel slight dizziness. This is the experience of dissolving boundaries."
];

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lessons', '14');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

console.log('Generating Lesson 14 audio segments...');
console.log(`Target directory: ${audioDir}`);

// Create individual segment files
AUDIO_SEGMENTS.forEach((text, index) => {
  const segmentNumber = index + 1;
  const filename = `segment-${segmentNumber.toString().padStart(2, '0')}.txt`;
  const filepath = path.join(audioDir, filename);
  
  fs.writeFileSync(filepath, text, 'utf8');
  console.log(`Created: ${filename}`);
});

// Create combined file
const combinedContent = AUDIO_SEGMENTS.join('\n\n=== SLIDE BREAK ===\n\n');
const combinedPath = path.join(audioDir, 'lesson-14-complete.txt');
fs.writeFileSync(combinedPath, combinedContent, 'utf8');
console.log(`\nCreated combined file: lesson-14-complete.txt`);

// Create JSON manifest
const manifest = {
  lessonId: 14,
  title: "How Consciousness Creates Reality",
  segments: AUDIO_SEGMENTS.length,
  createdAt: new Date().toISOString(),
  segmentsInfo: AUDIO_SEGMENTS.map((text, index) => ({
    segment: index + 1,
    characterCount: text.length,
    wordCount: text.split(/\s+/).filter(word => word.length > 0).length
  }))
};

const manifestPath = path.join(audioDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Created manifest: manifest.json`);

console.log('\n✅ Lesson 14 audio generation complete!');
console.log(`Total segments: ${AUDIO_SEGMENTS.length}`);
console.log(`Total characters: ${AUDIO_SEGMENTS.reduce((sum, text) => sum + text.length, 0)}`);
console.log(`Total words: ${AUDIO_SEGMENTS.reduce((sum, text) => sum + text.split(/\s+/).filter(word => word.length > 0).length, 0)}`);