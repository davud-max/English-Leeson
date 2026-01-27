const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const LESSON_23_TEXTS = [
  // Slide 1: Untitled
  `In the previous lesson we stopped at the point that humans know how to set goals and act according to rules. But among all rules there is one that is the most important. It was not invented, but discovered, like a law of physics. This is the prohibition of violence against another person. This is the Law.`,

  // Slide 2: Untitled
  `Human activity is activity directed toward achieving formed goals without the use of violence. A goal is born from uneasiness, from the desire to improve one's situation. But a human being, unlike a beast, cannot use violence against another human being to achieve a goal. This is taboo. But how did it arise?`,

  // Slide 3: Untitled
  `To achieve goals, resources and energy are needed. In the human context, resources used to achieve goals are called goods. Goods are limited. People face a dual task: how to obtain the necessary goods and how to distribute them among competing goals.`,

  // Slide 4: Untitled
  `The theory that describes optimal ways of achieving established goals is called praxeology, which is the science of action. Its core is analysis, the search for paths to goals within the framework of rules. And economics is human activity directed toward obtaining goods and distributing them among goals according to their rank of importance.`,

  // Slide 5: Untitled
  `It is important to distinguish that the formation of goals themselves is the domain of psychology. Economics begins when a goal already exists and you need to find a non-violent way to provide it with resources.`,

  // Slide 6: Untitled
  `Before taking action, a person evaluates not only effectiveness, but also reputational risks. Violating informal rules of cooperation threatens the loss of trust, and therefore future benefits. These spontaneously formed rules of non-coercive interaction between people we call ethics.`,

  // Slide 7: Untitled
  `A person can model the path to their goal in advance. And when modeling doesn't work out, they act through trial and error, gaining experience. Experience is the connection between objects or phenomena, obtained as a result of unintentional actions. Acquiring experience is often associated with risk.`,

  // Slide 8: Untitled
  `How does economic science fundamentally differ from physics? Physics discovers objective laws that are independent of opinion. Gravity acts on everyone equally. Economics, however, deals with people's private value judgments, which are constantly changing. You cannot track every molecule of gas, but you can identify statistical regularities. It is the same in economics: we rely on basic postulates that are true for the majority. A person prefers a greater good to a lesser one. A person prefers a present good to a future one. But these postulates are relative, not absolute.`,

  // Slide 9: Untitled
  `Key difference: economic theory works with uncertainty, striving to reduce it, but is unable to eliminate it completely. Any theory that promises complete certainty in economics is false - this is an intellectual perpetual motion machine.`,

  // Slide 10: Untitled
  `Human activity based on voluntary cooperation and rejection of violence generates phenomenal growth in prosperity. Creation leads to growth, while destruction, robbery, and deception lead to decline. Therefore, those who use violence are forced to mimic legitimate activity. They create an imitation of human activity, they too have business, profit, and services. But for an honest person, profit is the result of voluntary exchange. For a robber, the spoils are the result of coercion.`,

  // Slide 11: Untitled
  `The danger of imitation lies in the fact that its metastases, penetrating the body of society under plausible pretexts like fair redistribution, lead to crises, famine and wars.`,

  // Slide 12: Untitled
  `Language, born from signs for abstractions, enables something completely new: the exchange of knowledge. People begin to communicate. Communication is the exchange of knowledge. And communication leads to the possibility of making agreements, uniting in groups, and acting together toward a common goal. Society is a group of people united by a shared information field. Thus, the ability to think abstractly gave birth to society.`,

  // Slide 13: Untitled
  `Here one must not confuse society and organization. An organization is created intentionally to unite efforts toward achieving a common goal. In an organization the goal is known. It is written in the charter. The organization's resources are also known, they are also described in the charter. But what exactly and how one needs to do things in order to successfully achieve the goal using these resources - this is unknown. This is only assumed. And this is described in the program. Programs can change. Society on the contrary has no goal, or rather it is unknown to any of us mortals. Society emerges spontaneously. But on the other hand the rules of society are known: these are the ten commandments.`,

  // Slide 14: Untitled
  `But what else happens when people begin to interact? Conflicts arise. The most terrible of them is violence, the use of force against another person. Violence deprives freedom, the right to act, property. Over millennia of spontaneous selection, the main, saving rule crystallized - the prohibition of violence. This is not a rule that someone invented. It was discovered. Law is a formal prohibition on the use of violence against a person.`,

  // Slide 15: Untitled
  `But if violence is prohibited, then how can one defend against those who still use it? The answer is: what is prohibited is specifically violence, the use of force against human rights, freedom and property. Force can and should be used against violence. This is defense. And organized forceful protection of humans from violence is politics. Civilization is a society protected by politics. The word itself comes from the Latin civilis, meaning fenced or protected.`,

  // Slide 16: Untitled
  `Do all people equally understand against whom violence should not be used? History shows: no. Humanity develops in leaps. Each level is a new circle of people that a person recognizes as their own. The first level is family. Only members of my family are my own. The second is clan or tribe. The entire tribe is my own. The third is people, nation. All who speak my language are my own. And the fourth, highest level is civil society. Anyone who has renounced violence is my own. Each of us in childhood goes through these levels, and our upbringing is the purposeful raising to a higher level.`,

  // Slide 17: Untitled
  `Conflict between people of different levels is a civilizational conflict. For a person at the tribe level, a representative of another tribe is not human, and violence can be used against them. For a person at the people level, both tribes are their own, and violence is unacceptable. Therefore, the modern definition of human can be clarified: a human is a being who distinguishes another human and recognizes their rights, freedom and property.`,

  // Slide 18: Untitled
  `Learning to see the difference between genuine human activity and imitation is the main practical goal. To achieve this, one must be honest with oneself, accept the conclusions of formal logic, and use exclusively one's own reason for analysis.`,

  // Slide 19: Untitled
  `Economics is the main and true business of every citizen. For this business, like daily hygiene, it is worth finding time and energy. Because only in this way can we protect the genuinely human world, built on abstractions, rules and voluntary cooperation.`,
];

const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';

async function generateAudio(text, outputPath) {
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'\\''");
  const command = `edge-tts --voice "${VOICE}" --rate="${RATE}" --text "${escapedText}" --write-media "${outputPath}"`;
  await execPromise(command);
}

async function main() {
  console.log('🎬 Generating audio for Lesson 23...');
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson23');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_23_TEXTS.length; i++) {
    const filename = `slide${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    console.log(`🔊 Slide ${i + 1}/${LESSON_23_TEXTS.length}...`);
    
    try {
      await generateAudio(LESSON_23_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ ${filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ ${filename}: ${error.message}`);
    }
  }
  
  console.log('🎉 Done!');
}

main().catch(console.error);
