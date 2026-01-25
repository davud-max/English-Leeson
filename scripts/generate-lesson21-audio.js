const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const LESSON_21_TEXTS = [
  // Slide 1
  `Everything begins with observation. But to observe is not simply to see. An animal sees, but does not observe. Only humans know how to observe. Observation is the artificial separation of a part from unified existence.`,

  // Slide 2
  `Imagine a child who sees an apple. At first, for them it is simply part of the general flow of impressions. Then they begin to distinguish this apple from the background. They observe it. This is the first step.`,

  // Slide 3
  `Observed phenomena must be described in words. If ten people describe the same thing, they will give ten different descriptions. But what if we ask for the shortest description? It will be identical for everyone. This shortest description is the definition.`,

  // Slide 4
  `Definition — the shortest description of what is observed. A term is assigned to the definition. Term — a word used to designate the definition.`,

  // Slide 5
  `But there are special terms — fundamental terms. They have no definitions. The first of these is point. A point has no definition. It is zero-dimensional. A point made on paper with a pencil is not a point, but a spot.`,

  // Slide 6
  `If we mentally extend a point — we get a line. A line is the first level, one-dimensional. If we mentally extend a line crosswise — we get a plane. A plane is the second level, two-dimensional. If we mentally extend a plane crosswise — we get space. Space is the third level, three-dimensional. Through mental abstraction, we progress from point to line to plane to space, each step adding a new dimension to our conceptual framework.`,

  // Slide 7
  `All these terms are ultimate concepts. They cannot be observed. They exist only in the mind as pure abstraction. But they allow us to construct definitions of any abstract objects. These terms exist only in the mind as pure abstraction, yet they enable the construction of definitions for any abstract objects.`,

  // Slide 8
  `An abstract object can be described completely and definitively. A real object cannot. A real object has an infinite number of details. A word for a real object is a name. It can be shown. A word for an abstract object is a term. It cannot be shown, but it can be described completely.`,

  // Slide 9
  `After we have learned to observe, describe, construct definitions, and assign terms, a question arises: How many? How many of what and where?`,

  // Slide 10
  `A set of identical terms forms a group. And immediately the question arises: how many are there in the group? The description of the quantity of objects in a group is what constitutes counting.`,

  // Slide 11
  `Place three pencils in front of a child. They will begin: One, two, three. But when saying three, they point to one—the third pencil. When saying two—to one, the second pencil. But each pencil is one! The child becomes confused. The child experiences confusion when the numerical sequence conflicts with the individual identity of each object.`,

  // Slide 12
  `Show one pencil: This is one pencil. Which word is unnecessary? The word one is unnecessary! Pencil is already in singular form. Now show three pencils: These are pencils. Five pencils: And these are pencils. But the quantities are different! As soon as we speak in plural form, we need to describe exactly how many are in each group.`,

  // Slide 13
  `Take three pencils, two pens, one marker. Pencils — three. Pens — two. Marker — one. How many in total? Six. Six what? Six objects. Depending on which term is used, we get different groups and different quantities. A group is a set of objects with the same name. Grouping is the process of combining such objects. Counting is describing the quantity of objects in a group.`,

  // Slide 14
  `The term designating the result of counting is a numeral: three, five, twelve. The symbol representing a numeral without regard to the term is a digit: 3, 5, 12.`,

  // Slide 15
  `The very first method of counting is counting on fingers. People count on their fingers silently. You set aside one object — you bend one finger. Until you get a group of fingers equal to the group of objects. You show: that's how many!`,

  // Slide 16
  `Five fingers on one hand. But what if you need to count more than five? In ancient times, people counted by dozens — twelve. They used the thumb to mark the phalanges on the other four fingers. Five dozen — sixty, a copa. This is where the sexagesimal system comes from: 60 seconds in a minute, 60 minutes in an hour.`,

  // Slide 17
  `Then came counting sticks. They didn't count the sticks themselves, but counted with the sticks. One bird in the picture — set aside one stick. Show how many sticks — that's how many birds there are.`,

  // Slide 18
  `You can pronounce a numeral. You can write down a digit. But what is the number five? Try to imagine the number five. You won't be able to do it. You will imagine five objects — that's a group. Or the symbol 5 — that's a digit. But the number five itself is a pure abstraction. It's impossible to visualize.`,

  // Slide 19
  `We have traveled the path from observation to counting. From the ability to distinguish an object from existence to the ability to describe the quantity of such objects. This is the foundation. What comes next is how to connect these quantities to one another.`,
];

const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';

async function generateAudio(text, outputPath) {
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'\\''");
  const command = `edge-tts --voice "${VOICE}" --rate="${RATE}" --text "${escapedText}" --write-media "${outputPath}"`;
  await execPromise(command);
}

async function main() {
  console.log('🎬 Generating audio for Lesson 21...');
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson21');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_21_TEXTS.length; i++) {
    const filename = `slide${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    console.log(`🔊 Slide ${i + 1}/${LESSON_21_TEXTS.length}...`);
    
    try {
      await generateAudio(LESSON_21_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ ${filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ ${filename}: ${error.message}`);
    }
  }
  
  console.log('🎉 Done!');
}

main().catch(console.error);
