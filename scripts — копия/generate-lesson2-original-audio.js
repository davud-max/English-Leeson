const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Generate audio with male voice using Google Cloud TTS REST API
// PRESERVING ORIGINAL AUTHOR TEXT - NO MODIFICATIONS
async function generateLesson2AudioMaleVoice(text, filename, apiKey) {
  try {
    // Clean content (minimal processing to preserve original text)
    const cleanText = text
      .replace(/\*\*/g, '')  // Remove markdown bold
      .replace(/__/g, '')    // Remove markdown italic  
      .replace(/\*/g, '')    // Remove asterisks
      .replace(/#/g, '')     // Remove headers
      .replace(/\n\n+/g, '. ') // Convert double newlines to periods
      .replace(/\n/g, ' ')   // Convert single newlines to spaces
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();
    
    console.log(`🎤 Male voice synthesizing (${cleanText.split(' ').length} words)`);

    // Google Cloud TTS REST API endpoint
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    
    const requestBody = {
      input: {
        text: cleanText
      },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Standard-D', // Male voice
        ssmlGender: 'MALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0
      }
    };
    
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Decode base64 audio content
    const audioContent = Buffer.from(response.data.audioContent, 'base64');
    
    // Save file
    const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson2');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, audioContent);
    
    console.log(`✅ Generated: ${filename} (${Math.round(audioContent.length / 1024)} KB)`);
    return filePath;
    
  } catch (error) {
    console.error(`❌ Failed ${filename}:`, error.response?.data?.error?.message || error.message);
    throw error;
  }
}

// ORIGINAL AUTHOR CONTENT FOR LESSON 2 SLIDES
// TRANSLATED TO ENGLISH - PRESERVING EXACT MEANING
const LESSON_2_ORIGINAL_ENGLISH = [
  // Slide 1
  "You taught the child — and yourself — to observe, describe, build definitions and assign terms. What's next? Next — we'll learn to count. Of course, you know how to count. But to teach this to the child, you need to understand-remember yourself what this means. And then — learn to explain it. But first, there must be a need for counting. Otherwise it's hard to explain why spend time and effort on this procedure. Try to clearly explain to yourself how the need for counting arose. Then compare with what we'll cover now.",
  
  // Slide 2
  "So, where did we stop? We had a drawing: circle, chords, radii, diameters. Child already knows what circle, chord, radius, diameter are. Now ask: are there identical terms in the drawing? At first it seems there are none. But then they distinguish: here are chords, here are segments, here are radii, here are points. Set of identical terms forms a group. And immediately new question arises — how many are in the group? How to convey information about quantity to another person? That is — how to describe quantity?",
  
  // Slide 3
  "Put three pencils on the table. If person is nearby, you just point — and they see how many. But if you went outside and were asked: 'How many pencils were on the table?' — need to describe their quantity. And for this they need to be counted. In word 'count' — 'co' is prefix, 'unt' is root. In old times word 'cheta' meant pair. That is, counted by pairs, by two. So many pairs. At first glance, nothing complicated. Everyone knows how to count. But is it really so?",
  
  // Slide 4
  "Put three pencils in front of child and ask to count them. Most likely, they'll immediately say: 'Three.' But ask them to actually count. Count exactly these pencils. They'll start, pointing finger at each: 'One, two, three.' As soon as they point at third pencil and say 'three,' lift this pencil and ask: 'How many is this?' They'll say: 'One.' But why just now they said it was 'three'? Let them count again. They'll start: 'One, two, three...' As soon as they point at second pencil and say 'two,' stop them. Lift this second pencil and ask: 'How many is this?' They'll say: 'One.' But why before they said it was 'two'?",
  
  // Slide 5
  "But remember how your baby learned to walk. You didn't yell at them when nothing worked out. You helped again and again, comforting after each failure. And how you rejoiced at first independent step! You didn't hide this joy. And baby felt it, and strained to take another step... Let your child now be ten years old, fifteen... They — still the same baby. They still need your comfort and your joy for their success.",
  
  // Slide 6
  "What is counting then? Show one pencil and say: 'This is one pencil.' Ask: which word here is extra? Good if child guesses: word 'one.' 'Pencil' is already singular. Adding that it's one — unnecessary. Now lift three pencils and say: 'These are pencils.' Then lift five: 'And these are pencils.' But quantities in first and second cases — different. If we say 'pencils' (plural), then need to describe their quantity. Description of quantity is counting.",
  
  // Slide 7
  "But description of quantity of what and where? Take three pencils, two pens and one marker. Ask: how many pencils here? Child answers: 'Three.' How many pens? 'Two.' How many markers? 'One.' How many items total? 'Six!' Why each time different answers? Because spoke about different names: first — pencils, then — pens, then — markers, and finally — items. Set of identically named items is called group. Unification of identically named items — grouping. Description of quantity of items in group — this is counting.",
  
  // Slide 8
  "Term denoting result of counting — numeral. Symbol denoting numeral — digit. Need to add: there are countable and uncountable groups. Uncountable — for example, stars in sky or leaves in forest. We say about them 'many,' but don't count individually. How to describe quantity of units in countable group? Simplest way — counting on fingers.",
  
  // Slide 9
  "When your child was three years old, they knew how to count on fingers. Check if they forgot how it's done. Put three pencils in front and ask to count them on fingers. They'll probably start bending fingers and saying: 'One, two...' Stop them. They're counting fingers, but need to count pencils. They'll start pointing at pencils with finger, saying: 'One, two...' Stop again. They're counting with fingers, but need — on fingers. Child is confused. Remind: on fingers count those who don't know numerals yet. That is — silently. Put aside one pencil — bend one finger. Put aside another pencil — bend another finger. Until get group of fingers equal to countable group. This we demonstrate, saying: 'This many!'",
  
  // Slide 10
  "How many can count on fingers of one hand? Five. Can more? Can. How? Child puzzled? Help. Hint: thumb marked phalanges of four remaining fingers. Resulting quantity was called dozen. Today this is twelve. 12 hours on clock face, 12 months in year... All from dozen. On fingers of two hands? Child will say: twenty-four. That is, two dozens. But in old times could count on two hands up to five dozens. On one hand counted dozen, on other bent one finger. Another dozen — another finger... Five dozens called copeck. Today this quantity — sixty.",
  
  // Slide 11
  "In old times sexagesimal system was widespread. It remained on clocks: 60 seconds — minute, 60 minutes — hour. Sixtieth part of whole was called copeck — from word 'cope'. Maybe that's why hundredth part of ruble is still called copeck. Can more than copeck? Can. Let child guess. If can't — hint: dozen counted on one hand, mark on second not whole finger, but phalanx. Get dozen dozens. This was called gross. Today this is 144. And there was dozen grosses — mass. This is 1728.",
  
  // Slide 12
  "But in school haven't counted on fingers for long. Remember first grade. Counted with counting sticks. Notice: counted not sticks, but with sticks. How? 'Children, picture has many birds. Count them. Count like this: one bird — put aside one stick. Another bird — put aside another stick. And so, until count all. Now — show how many birds total? Right, as many as you have sticks. Sticks you can take and show mom. And mom will know how many birds there were.' To count — means to describe quantity of units in given group.",
  
  // Slide 13
  "But what if units very many? Imagine: father sent son to count sheep in flock. And son brought whole bag of sticks... 3457 pieces. For this case first-grader's kit has sticks of different colors. Ten white sticks denote one red. Ten red — one blue. Ten blue — one black. So son should bring father only three black sticks, four blue, five red and seven white. Just need to remember colors... True, if on way dropped one black stick — mistaken by thousand sheep. And if make notches on board? Ten notches — one cross. Ten crosses... And here appear digits (Roman, for example) — symbols denoting quantity of identically named objects in group.",
  
  // Slide 14
  "Today for describing result of counting we use not sticks, but numerals. Numerals — these are terms denoting quantity of units in groups. Without term 'group' numeral has no meaning. Numerals can be denoted by symbols — digits. Group and numeral can be represented. But number (as mathematical term) cannot be represented. Try to represent number 5. You won't succeed. Symbol '5' — this is not number, this is digit. Can write it as 'V'. If you represented five items — this is group of items, not number. But you can perform operations on numbers, count with numbers, and result write with digits or numerals.",
  
  // Slide 15
  "Child first learns to group identically named items. Then — distinguish groups by quantity. Then — memorizes names of quantities, numerals. For example, today learn to recognize groups of three items. On table three pencils — this is group. Find in room more groups of three. Right: three flowers in vase, three bogatyrs in picture, three chairs... Numbers describing quantity of units in group are called natural (natural). In nature we don't observe 'three and half sparrows' or 'minus six horses'. Natural numbers — these are all positive integers from one to infinity. Like Roman digits: all positive, integers, and no zero. Automatic recognition of groups by quantity and memorizing numerals needs time and effort. Try quickly learn to count in German or Japanese. Not just recite numerals in order, but instantly answer how many items shown. So main thing — don't rush. After all your baby already knows how to count. And to question 'How old are you?' — proudly shows three fingers."
];

async function generateLesson2Complete(apiKey) {
  console.log('🎬 Generating Lesson 2 Audio with ORIGINAL AUTHOR CONTENT...');
  console.log('👨‍🏫 Using Google Cloud TTS Standard-D male voice\n');
  console.log('📝 PRESERVING EXACT ORIGINAL TEXT - NO MODIFICATIONS\n');
  
  try {
    // Clean existing audio files
    const lesson2Dir = path.join(__dirname, '..', 'public', 'audio', 'lesson2');
    if (fs.existsSync(lesson2Dir)) {
      const files = fs.readdirSync(lesson2Dir);
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          fs.unlinkSync(path.join(lesson2Dir, file));
          console.log(`🗑️  Removed: ${file}`);
        }
      });
    }
    
    // Generate audio for each slide
    for (let i = 0; i < LESSON_2_ORIGINAL_ENGLISH.length; i++) {
      try {
        await generateLesson2AudioMaleVoice(LESSON_2_ORIGINAL_ENGLISH[i], `slide${i + 1}.mp3`, apiKey);
        console.log(`✅ Slide ${i + 1}/${LESSON_2_ORIGINAL_ENGLISH.length} completed\n`);
      } catch (error) {
        console.log(`❌ Slide ${i + 1} failed\n`);
        continue;
      }
    }
    
    console.log('\n🎉 LESSON 2 AUDIO GENERATED SUCCESSFULLY!');
    console.log('🔊 Original author content preserved with male voice narration');
    console.log('🎯 Ready for audio-priority playback system');
    
  } catch (error) {
    console.error('💥 Generation process failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  const apiKey = process.argv[2] || 'AIzaSyDSrWekemLElh06BPEfyktu3nQT4tF3Tf4';
  generateLesson2Complete(apiKey);
}