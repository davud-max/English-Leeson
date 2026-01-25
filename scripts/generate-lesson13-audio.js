// Generate audio for Lesson 13: The Sixth Human Level
// Run: node scripts/generate-lesson13-audio.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const slides = [
  {
    id: 1,
    text: `The first chapter of the Gospel of John almost word for word repeats the first chapter of the Old Testament — if we view them from the standpoint of the Theory of Abstraction.

In society, the law brought by Moses was at work. All walk under one God — that is, under one law — and this makes people equal before the law.

The system of protection of rights, freedoms, and property takes on a universal character for all members of one's own people. This gives impetus to economic development. A market is formed.`
  },
  {
    id: 2,
    text: `The commandments were sent through Moses in the form of tablets — that is, the letter of the law appeared, uniform for all.

The New Testament speaks of the spirit of the law. If the old law was sent through Moses, then this new thing must be brought by a new prophet.

The Apostle Paul says: "He has made us competent as ministers of a new covenant — not of the letter but of the Spirit; for the letter kills, but the Spirit gives life."

This is the transition from external regulation to internal understanding.`
  },
  {
    id: 3,
    text: `If attaining the level of Moses was marked by baptism with holy water, then the new level — the level of Jesus — is marked by baptism with the Holy Spirit.

John the Baptist says of this: "The one on whom you see the Spirit descend and remain is the one who will baptize with the Holy Spirit."

At the previous level, anyone who believed in the one Heavenly God and fulfilled the commandments — thou shalt not kill, thou shalt not steal — was recognized as human.

In essence, the foundations of market relations and trade were being introduced into life.`
  },
  {
    id: 4,
    text: `What new level of humanity does the new prophet proclaim?

Jesus answered: "Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit. Flesh gives birth to flesh, but the Spirit gives birth to spirit."

Here is a direct link to the first chapter of the Old Testament. Man must emerge from the water over which the Spirit of God hovered.

First, man distinguishes physical man; then, spiritual man. The New Testament speaks precisely of this.`
  },
  {
    id: 5,
    text: `Jesus said: "Unless you eat the flesh of the Son of Man and drink his blood, you have no life in you."

Many of His disciples, hearing this, said: "This is a hard teaching. Who can accept it?"

Most likely, the Eucharist is devoted precisely to this — the consecration of bread and wine and their subsequent consumption.

Bread — the body of Christ — is primordial earth. Blood of Christ — primordial heaven. Both together are primordial water, over which the Spirit of God hovered.

The division of water into heaven and earth occurred in man, in his consciousness.`
  },
  {
    id: 6,
    text: `John proclaims the new human level that Jesus brought. This is the level of grace and truth.

Grace is a blessing freely given by God to every person. Through it, the path to truth opens — the path to God.

And this blessing is the ability to abstract. This ability was given to man from the beginning. But only now, with its help, is man able to comprehend truth.

"No one has ever seen God." But He is comprehended through understanding the Trinity — the sacred threefold unity.`
  },
  {
    id: 7,
    text: `The Level of Moses: God is One, one for all people, and He is outside, above all people. He is an external force that gave people the law. Law is a formal prohibition on violence against man. Here death is punishment; it frightens man. Coercion is needed to observe the commandments. Being a man of the Old Testament is difficult.

The Level of Jesus: God is one in each person. He is an internal force giving man a soul. One who comprehends this no longer needs external law. He cannot violate the commandments. Death is the return of the soul to the Father; there is no longer fear. Being a man of the New Testament is easy, for its foundation is love.`
  },
  {
    id: 8,
    text: `The New Testament brings not only the message of the salvation of the soul. It allows expansion of the human circle.

The Apostle Paul says: "There is neither Jew nor Gentile, neither slave nor free, nor is there male and female, for you are all one in Christ Jesus."

This is the sixth human level, where not only a member of one's own people — united by blood, marked by circumcision, acknowledging the commandments — is human, but a representative of any people who opens God within himself and loves God is human.

In everyone there is the Spirit of truth. To awaken it, one must believe and accept. Logic and reason cannot accept this. One must make a leap of faith — a leap across infinity.

Thank you for your attention.`
  }
];

const outputDir = path.join(__dirname, '..', 'public', 'audio', 'lesson13');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created directory: ${outputDir}`);
}

async function generateAudio() {
  console.log('🎙️ Generating audio for Lesson 13: The Sixth Human Level\n');
  
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
  
  console.log('🎉 Audio generation complete for Lesson 13!');
}

generateAudio();
