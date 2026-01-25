const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const LESSON_21_TEXTS = [
  // Slide 1: 
  `Everything begins with observation. But to observe is not simply to see. An animal sees, but does not observe. Only humans know how to observe. Observation is the artificial separation of a part from unified existence.`,

  // Slide 2: 
  `Imagine a child who sees an apple. At first, for them it is simply part of the general flow of impressions. Then they begin to separate this apple from the background. They observe it. This is the first step.`,

  // Slide 3: 
  `What is observed needs to be described in words. If ten people describe the same thing, they will give ten different descriptions. But what if we ask for the shortest description? It will be the same for everyone. This shortest description is the definition.`,

  // Slide 4: 
  `A definition is the shortest description of what is observed. A term is assigned to the definition. A term is a word used to designate the definition.`,

  // Slide 5: 
  `But there are special terms called primitive terms. They have no definitions. The first of them is a point. A point has no definition. It is zero-dimensional. A point made on paper with a pencil is not a point, but a spot.`,

  // Slide 6: 
  `Let us mentally stretch out a point and we get a straight line. A straight line is the first level, one-dimensional. Let us mentally stretch out a straight line crosswise and we get a plane. A plane is the second level, two-dimensional. Let us mentally stretch out a plane crosswise and we get space. Space is the third level, three-dimensional.`,

  // Slide 7: 
  `All these terms are limiting concepts. They cannot be observed. They exist only in the mind as pure abstraction. But they allow us to construct definitions of any abstract objects.`,

  // Slide 8: 
  `An abstract object can be described completely and definitively. A real object cannot. A real object has an infinite number of details. A word for a real object is a name. It can be shown. A word for an abstract object is a term. It cannot be shown, but it can be described completely.`,

  // Slide 9: 
  `After we learned to observe, describe, construct definitions and assign terms, a question arises: but how much? How much of what and where?`,

  // Slide 10: 
  `A set of identical terms forms a group. And immediately the question arises: how many are there in the group? Describing the quantity of objects in a group is what counting is.`,

  // Slide 11: 
  `Place three pencils in front of the child. He will begin: "One, two, three." But when saying "three," he points to one, the third pencil. When saying "two," to one, the second. But each pencil is one! The child is confused.`,

  // Slide 12: 
  `Show one pencil: "This is one pencil". Which word is unnecessary? The word "one" is unnecessary! "Pencil" is already in the singular form. Now show three pencils: "These are pencils". Five pencils: "And these are pencils". But the quantities are different! As soon as we speak in the plural form, we need to describe exactly how many are in each group.`,

  // Slide 13: 
  `Take three pencils, two pens, one marker. Pencils are three. Pens are two. Marker is one. And how many in total? Six.

Six of what? Six items. Depending on which term was mentioned, different groups and different quantities are formed.

A group is a set of items with the same name. Grouping is the combining of such items. Counting is describing the quantity of items in a group.`,

  // Slide 14: 
  `The term denoting the result of counting is a numeral: "three", "five", "twelve". The symbol denoting the numeral without regard to the term is a digit: three, five, twelve.`,

  // Slide 15: 
  `The very first method of counting was counting on fingers. People count on fingers silently. You set aside one object and bend one finger. You continue until you get a group of fingers equal to the group of objects. Then you show it and say: this many!`,

  // Slide 16: 
  `There are five fingers on one hand. But what if you need to count more than five? In ancient times people counted by dozens, which is twelve. They used the thumb to mark the segments on the other four fingers. Five dozens equals sixty, which was called a kopa. This is where the base sixty system comes from: sixty seconds in a minute, sixty minutes in an hour.`,

  // Slide 17: 
  `Then counting sticks appeared. They didn't count the sticks themselves, but counted with the sticks. One bird in the picture meant setting aside one stick. By showing how many sticks there were, they showed how many birds there were.`,

  // Slide 18: 
  `A numeral can be pronounced. A digit can be written down. But what is the number five? Try to imagine the number five. You will not succeed. You will imagine five objects - that is a group. Or the symbol five - that is a digit. But the number five itself is pure abstraction. It is impossible to imagine it.`,

  // Slide 19: 
  `We have traveled the path from observation to counting. From the ability to distinguish an object from existence to the ability to describe the quantity of such objects. This is the foundation. Next comes how to connect these quantities with each other.`,
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