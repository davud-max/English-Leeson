// Generate audio for Lesson 2 using Google TTS
import { TTSService } from '../src/lib/alternative-tts';

const ttsService = new TTSService();

const LESSON_2_TEXTS = [
  "Lesson 2: From Term to Number and Counting. How counting is born. How terms multiply and create the need for numbers. From individual terms to groups, from counting to numbers.",
  
  "The Need: From Terms to Groups. We have a drawing with circles, centers, chords, radii. Question: Are there identical terms on this drawing? Group - Collection of objects designated by one term. Group of chords. Group of radii. Group of points.",
  
  "The Essence of Counting: It's Not What You Think. Put three pencils in front of you. Ask a child to count them. They point to the first: One, second: Two, third: Three. Paradox: On the word Three, ask: How many pencils is this? They'll say: Three! But they just counted THREE pencils by saying the number THREE.",
  
  "The Discovery: Counting is Comparison. Insight: The child compared their group of pencils with an etalon group - their fingers! Counting equals comparing one group with another, etalon group. We don't count objects directly. We compare our group with a standard group and name the result.",
  
  "What is a Number? Number - The name of an etalon group used for comparison with other groups. Examples: Finger group equals Five. Hand group equals Five. Foot group equals Ten.",
  
  "Numerals and Digits. Numeral - Symbol representing a number. Examples: 1, 2, 3, 4, 5. Digit - Single symbol used in numerals. Digits: 0 through 9. Number - The concept, the etalon group. Numeral - How we write it. Digit - Building blocks of numerals.",
  
  "Traditional Counting Systems. Dozen equals 12 items. Origin: Counting finger segments. Score equals 20 items. Origin: Counting all fingers and toes. Gross equals 144 items. Origin: 12 dozens.",
  
  "Natural Numbers. Natural numbers equal counting numbers. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 and so on. They emerge naturally from our counting algorithm: Term to Group to Counting to Number to Natural Number.",
  
  "Two Paths of Thinking. Analysis Path: From concrete to abstract. Reality to Observations to Grouping to Counting to Numbers. Synthesis Path: From abstract to concrete. Numbers to Etalon groups to Matching to Finding objects in reality.",
  
  "Lesson Summary. We've traced the birth of counting: Term to Group to Counting to Number. Key insight: Counting is comparison with etalon groups. Foundation of mathematics: From terms to numbers through systematic grouping."
];

export async function generateLesson2Audio() {
  console.log('🎬 Starting audio generation for Lesson 2...');
  
  try {
    for (let i = 0; i < LESSON_2_TEXTS.length; i++) {
      await ttsService.generateWithGoogleTTS(LESSON_2_TEXTS[i], `slide${i + 1}.mp3`);
      console.log(`✅ Generated slide ${i + 1}/${LESSON_2_TEXTS.length}`);
    }
    
    console.log('🎉 All slides generated successfully for Lesson 2!');
    
  } catch (error) {
    console.error('💥 Audio generation failed:', error);
  }
}