// Generate audio for Lesson 9: Sacred Text and the Nature of Reality
// Run: node scripts/generate-lesson9-audio.js
// Or: python generate_audio_edge.py (modify for lesson 9)

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const slides = [
  {
    id: 1,
    text: `In the beginning God created the heaven and the earth. Thus begins the Book of Genesis.

The concepts of heaven and earth are foundational for the first chapters of the Bible. They constitute the starting point. And here, heaven and earth are not the familiar heaven and earth we know, but abstract concepts denoting, respectively, the observable and the unobservable.

In modern vocabulary, the concepts closest in meaning to heaven and earth are, respectively, Nothing and the World.`
  },
  {
    id: 2,
    text: `And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters. So says the second verse.

The earth that was without form, and darkness upon the deep, that is, heaven. What water is being spoken of?

In the beginning, the boundary between earth and heaven was not yet distinguishable, and both were unobservable. Therefore, they both are something unified, boundless, formless, indistinguishable, which is called water. In modern vocabulary, the most appropriate word for this concept is Being.

The Spirit of God moved upon the waters. The Spirit of God belongs neither to heaven nor to earth. Essentially, water and the Holy Spirit together are conditionally God. Any attempt to see God leads to water or the Holy Spirit. But all three are one.`
  },
  {
    id: 3,
    text: `And God said, Let there be light: and there was light. So says the third verse.

The Spirit of God, moving upon the waters, having fertilized the primordial water, that is, Being, gives birth to light. But what is this light?

Here it is not physical light, which, for example, comes from the sun. The sun does not yet exist. Moreover, nothing observable exists, as there is no observer.

The ability to abstract is the light — that is, that through which man distinguishes, observes. An animal has vision, it can see. But this is merely a reaction to ordinary physical light. An animal cannot observe.

To observe means to distinguish the boundaries between the observable, that is, the World, and the unobservable, that is, Nothing. This is possible only with the ability to look from the outside, only with the ability to abstract.`
  },
  {
    id: 4,
    text: `And God saw the light, that it was good: and God divided the light from the darkness. So says the fourth verse.

So who saw? God? It turns out that God only after creating light saw, learned that it was good. But God is the unity of water and the Holy Spirit, that is, the absolute All. He is omniscient.

To see means to distinguish boundaries. And this is a violation of the principle of boundlessness and unity of God. But man himself does not yet exist, for he has not yet seen himself. Therefore it is said that God saw.

To distinguish good from evil, to distinguish what is good from what is not good — only God can do this. Only God knows the final purpose of man, by which alone it is possible to determine what is good and what is not good.`
  },
  {
    id: 5,
    text: `And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters. And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament. So say the sixth and seventh verses.

Thus, water was divided from water. What does this mean?

Before the appearance of light, water was not yet divided, that is, Being, and earth and heaven were indistinguishable, that is, the World and Nothing.

The firmament is the boundary that divided the World and Nothing after light appeared, that is, after the ability to abstract appeared.

One could say that the boundary between heaven and earth existed before, but it was not visible. Light was needed to distinguish the firmament. And it is about this light that they will speak when they talk about the end of light.`
  },
  {
    id: 6,
    text: `Through light came the birth from water of the observer himself, Man. For to see the World within its boundaries, beyond which is Nothing, one can only be outside both this World and this Nothing. One must emerge from the water.

For comparison, the same in the Quran in the Surah Al-Furqan: And it is He who has created from water a human being.

The process of material evolution began long before the appearance of the firmament, that is, boundaries. Only the appearance of a specific human being with a specific metric allows human consciousness to distinguish the specific structure of our World.

At the same time, no one guarantees that there are no other beings with a different metric. They will split the same Being in completely different boundaries. Within the same Being, potentially exist many different Worlds.

Thank you for your attention.`
  }
];

const outputDir = path.join(__dirname, '..', 'public', 'audio', 'lesson9');

// Create output directory if not exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created directory: ${outputDir}`);
}

// Generate audio for each slide using edge-tts
async function generateAudio() {
  console.log('🎙️ Generating audio for Lesson 9: Sacred Text and the Nature of Reality\n');
  
  for (const slide of slides) {
    const outputFile = path.join(outputDir, `slide${slide.id}.mp3`);
    const textFile = path.join(outputDir, `slide${slide.id}.txt`);
    
    // Write text to temp file
    fs.writeFileSync(textFile, slide.text);
    
    console.log(`🔊 Generating slide ${slide.id}...`);
    
    try {
      // Using edge-tts with en-US-GuyNeural voice (natural male voice)
      execSync(`edge-tts --voice en-US-GuyNeural --rate="-5%" --file "${textFile}" --write-media "${outputFile}"`, {
        stdio: 'inherit'
      });
      
      // Clean up temp text file
      fs.unlinkSync(textFile);
      
      console.log(`✅ Slide ${slide.id} complete: ${outputFile}\n`);
    } catch (error) {
      console.error(`❌ Error generating slide ${slide.id}:`, error.message);
      console.log('   Make sure edge-tts is installed: pip install edge-tts');
    }
  }
  
  console.log('🎉 Audio generation complete for Lesson 9!');
  console.log('\n📌 If edge-tts is not installed, run: pip install edge-tts');
}

generateAudio();
