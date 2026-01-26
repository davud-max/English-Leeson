const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const LESSON_22_TEXTS = [
  // Slide 1: Untitled
  `Let's draw a circle. A line segment connecting two points on the circle is called a chord. This is the definition and term. A chord that passes through the center of the circle is called a diameter. If we connect a point on the circle with its center, this is called a radius. Their sizes can be measured. Easy.`,

  // Slide 2: Untitled
  `Let's draw another circle, a larger one. Again we'll measure the radius and diameter. They will be different in size. But the terms are the same! Conclusion: the terms do not distinguish between sizes.`,

  // Slide 3: Untitled
  `Let us denote by the letter d the length of the diameter, and by the letter r the length of the radius. These are parameters. A parameter is a letter designation of a quantity. A quantity is the result of counting or measurement.`,

  // Slide 4: Untitled
  `Now an obvious thing: the diameter consists of two radii. Let's write it down: d equals two r. This is our first formula! A formula is a parametric record of the relationship between quantities. Or simply, a relationship between parameters.`,

  // Slide 5: Untitled
  `What is it needed for? The formula allows for calculations. Calculation is obtaining the value of a parameter not through measurement, but by using its connections with other parameters.`,

  // Slide 6: Untitled
  `They measured the radius r and calculated the diameter d by multiplying by two. Too simple, a child will say. The diameter can be measured directly anyway. And you will agree.`,

  // Slide 7: Untitled
  `But what cannot be measured with a ruler? The length of the circumference itself! A ruler is straight, a circle is curved. You can take a string, lay it along the circumference, then stretch it out and measure it. But this is inconvenient and not always accurate.`,

  // Slide 8: Untitled
  `Let's denote the length of the circumference with the letter c. How many diameter lengths fit into the length of the circumference? We measure the length of the circumference with a string, we measure the diameter with a ruler, we divide c by d. We get approximately three. With any circle, approximately three.`,

  // Slide 9: Untitled
  `Approximately is not precise. More precisely, three point one four. Even more precisely, three point one four one five nine two six five three five and so on. This is the number pi. It equals the length of a circle's circumference per unit length of its diameter.`,

  // Slide 10: Untitled
  `Let's write it down: c equals pi times d. We calculated something that is difficult to measure! We measured the easily measurable diameter and multiplied it by a known number.`,

  // Slide 11: Untitled
  `But measuring the radius is even simpler than measuring the diameter! For the diameter you need to align three points with the ruler: two on the circle and the center. For the radius, only two points. And we remember: d equals two r. Let's substitute into the formula: c equals two pi r. There it is, the final formula for the circumference of a circle.`,

  // Slide 12: Untitled
  `The formula allows you to calculate what is difficult or impossible to measure using what is easy to measure.`,

  // Slide 13: Untitled
  `Give the child a compact disc and a ruler. Let them find the length of its circumference. They will try to place the ruler against the edge. Let them struggle with it. Then, maybe, they will figure out to wrap it with thread. In the end, they will measure the diameter, which is easy. And using the formula c equals pi d, they will calculate the length of the circumference.`,

  // Slide 14: Untitled
  `Ask: "Did you measure the length of the circumference?" He will answer: "Yes!" Correct him: "No. You measured the length of the diameter. But the length of the circumference - you calculated that."`,

  // Slide 15: Untitled
  `This is important. The difference between measurement and calculation. A formula is a bridge between them. It does not cancel out measurement, but overcomes its limitations.`,

  // Slide 16: Untitled
  `Where does a person get the ability to create such formulas? From the ability to abstract. Abstraction is the process of isolating and distinguishing a part of existence. An abstraction is a part of existence that is perceived as a separate whole.`,

  // Slide 17: Untitled
  `An animal cannot think in abstract terms. For an animal, neither the external world nor the animal itself exists as separate concepts. Everything is a unified system of signals and reactions. A squirrel sees a nut, but cannot imagine a nut when it is not present.`,

  // Slide 18: Untitled
  `A human being is different. He separates parts from existence: the physical world, nothingness, himself. Then he breaks down the physical world into parts: the sun, the sky, water. Then he combines similar parts into a higher-order abstraction called being. For example, from many apples is born the image of an apple in general.`,

  // Slide 19: Untitled
  `To each abstraction, a person assigns a sign - a sound, gesture, or symbol. Signs and abstractions form knowledge. Knowledge is abstraction translated into sign form. By operating with knowledge, a person builds models of events and actions. He begins to think. Thinking is operations over abstractions.`,

  // Slide 20: Untitled
  `Constant work with definitions and terms develops a new quality - the ability to act according to rules. Literacy is action according to rules. A literate person speaks briefly and precisely, using terms. An illiterate person is forced to give lengthy descriptions.`,

  // Slide 21: Untitled
  `There are connections between objects. These can also be described with symbols. For example, the connection between distance and time is speed. A concept is a term that denotes the connection between quantities or phenomena.`,

  // Slide 22: Untitled
  `The knowledge library contains all terms and concepts. By operating with them, a person can model a state better than the present one. This model becomes a thought. If a person begins to act, the thought becomes a goal. A goal is an abstract model of what is desired.`,

  // Slide 23: Untitled
  `To achieve a goal, new actions are needed that are purposeful. A human being is a creature capable of acting with purpose. In this area, humans are free from instincts.`,

  // Slide 24: Untitled
  `But how do you achieve the goal? You can use trial and error. Or you can build models of actions and choose the best one, which means applying analysis. The discovered sequence of actions is saved as a rule. A rule is the result of analysis, a sequence of actions that leads to the goal.`,

  // Slide 25: Untitled
  `Repeated application of a rule forms a skill, an action brought to the level of automatism. By perfecting skills in using knowledge, a person creates language, and speech appears. And with it comes the possibility of cooperation, coordinated activity for a common goal.`,

  // Slide 26: Untitled
  `This is what the path looks like: abstraction leads to knowledge leads to thinking leads to purpose leads to rule. This is the path of a thinking person, a person of action. But is this enough for human activity? No. Because there is also violence. And there is law.`,
];

const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';

async function generateAudio(text, outputPath) {
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'\\''");
  const command = `edge-tts --voice "${VOICE}" --rate="${RATE}" --text "${escapedText}" --write-media "${outputPath}"`;
  await execPromise(command);
}

async function main() {
  console.log('🎬 Generating audio for Lesson 22...');
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson22');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_22_TEXTS.length; i++) {
    const filename = `slide${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    console.log(`🔊 Slide ${i + 1}/${LESSON_22_TEXTS.length}...`);
    
    try {
      await generateAudio(LESSON_22_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ ${filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ ${filename}: ${error.message}`);
    }
  }
  
  console.log('🎉 Done!');
}

main().catch(console.error);
