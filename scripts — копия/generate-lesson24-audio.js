const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const LESSON_24_TEXTS = [
  // Slide 1: Untitled
  `Until now we have been talking about abstract principles. But how are they embodied in real life? How did money, markets and banks emerge from simple exchanges between people? Let us trace this path.`,

  // Slide 2: Untitled
  `In closed patriarchal-communal societies, trade does not exist. In prehistoric times, the main part of resources is at the disposal of only the heads of families, clans, or tribal chiefs. People worked together and ate together from a common pot. There is no property yet. The formation of new goals is handled exclusively by the leaders.`,

  // Slide 3: Untitled
  `Within the community everything is shared, there is no exchange, there is no property. The community's border is defended against encroachments by outsiders. Between communities interaction occurs through gifts between chiefs. This is the first stage: goods move, people do not. Gifts are passed along in a chain from chief to chief. Rare items can arrive from very distant places. Exchange occurs only between foreign groups.`,

  // Slide 4: Untitled
  `The uniqueness and high usefulness of certain goods received as gifts from neighboring tribes encourages sending a special group of people to search for them. Expeditions for rare goods become regular. Routes become increasingly diverse and distant. Now it is not the goods themselves that move, but people who move them. This is how merchants and caravans emerge.`,

  // Slide 5: Untitled
  `The place where several caravan routes intersect becomes a location for shared rest stops. Here the exchange of goods and information takes place. Merchants arrange to meet in the following season. This is how seasonal fairs emerge.`,

  // Slide 6: Untitled
  `The number of fairs begins to grow. Each of them develops its own rules. Those fairs grow faster where the conditions for exchange are better. Community rules are based on kinship, tradition, and submission to a leader. Fair rules are formal and do not depend on kinship, ethnicity, or race. The owners of the fairs are interested in protecting the new rules. They allocate part of their forces and resources to ensure the operation of new rules on their territory. This is how a market emerges - territories with unified exchange rules that do not depend on tribal, ethnic, or racial differences of the participants.`,

  // Slide 7: Untitled
  `Land at the intersection of trade routes was rented for the placement of warehouses, workshops, and markets. Payment was calculated daily. As the market grew, keeping track of payments became important. After payment, a merchant received a tag as proof of payment. The tag was short-lived and easy to forge. Then the clan mark called tamga began to be placed on durable materials like copper, bronze, silver, and gold. Cast coins with relief clan marks appeared.`,

  // Slide 8: Untitled
  `How to achieve reusable coins? How to return coins from merchants back to the owner? They created a treasury, from the Turkic word khazna, a special house, a storage for valuables, where natural payments for rent were accepted. In exchange for products, coins were issued. Controllers walked around the market every day and collected the coins back. No coin meant the shop was closed or a fine was imposed. There was a separate entrance for buyers, through which only people could pass, but pack animals could not. Coins issued at the cashier were returned back to the same cashier. A closed cycle.`,

  // Slide 9: Untitled
  `A merchant could end the season early and sell the remaining coins to neighbors. Or buy a coin from a neighbor if it was time to pay. The price of the coin changed depending on demand. The coin gradually becomes a means of payment between the merchants themselves. The owner began using the cash register not only to receive payments, but also to issue coins as loans, as credit. This mechanism unexpectedly began bringing in large profits.`,

  // Slide 10: Untitled
  `Cast coins are durable but easy to counterfeit. Later they invented minting, which is the application of an impression that is harder to counterfeit. Bracteates appeared, which are coins with one-sided minting.`,

  // Slide 11: Untitled
  `The increase in silver coin production led to the practice of debasing them by scraping off part of the silver. This changed the weight of the coin and therefore its value. This led to conflicts during payments and undermined faith in the currency. The owner bore the costs of identifying and remelting debased and counterfeit coins.`,

  // Slide 12: Untitled
  `Good money is that which owners strictly monitor, preventing damage and counterfeiting. There is more trust in it. Bad money means less control, more counterfeits, less trust. In a free market, good money drives out bad money, bringing greater profit to its owners. In a non-free market, bad money drives out good money. This is the so-called Gresham's Law.`,

  // Slide 13: Untitled
  `The owners of coins, seeing profit from minting, try to expand their area of use. They rent places in other markets to open branches of their treasury. This way the treasury transforms into a bank, from the Latin word banco meaning bench or money changer's table, a house where all operations take place from minting to exchange and credit. A network of branches appears in different markets.`,

  // Slide 14: Untitled
  `The development of retail trade made it possible to create permanent markets. Agricultural producers themselves bring their products, exchange them for coins, and buy goods. Cities appear. Property owners who have separated from the community emerge - Cossacks or farmers.`,

  // Slide 15: Untitled
  `Two inventions that changed the world: the coin and the bank. The coin evolved from a payment token to a universal means of payment. The bank developed from a cashbox to a network system of minting, exchange and credit. The market established formal rules independent of kinship and ethnicity. The city became a permanent place of trade and the birthplace of property owners.`,
];

const VOICE = 'en-US-GuyNeural';
const RATE = '-5%';

async function generateAudio(text, outputPath) {
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'\\''");
  const command = `edge-tts --voice "${VOICE}" --rate="${RATE}" --text "${escapedText}" --write-media "${outputPath}"`;
  await execPromise(command);
}

async function main() {
  console.log('🎬 Generating audio for Lesson 24...');
  
  const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson24');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  for (let i = 0; i < LESSON_24_TEXTS.length; i++) {
    const filename = `slide${i + 1}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    console.log(`🔊 Slide ${i + 1}/${LESSON_24_TEXTS.length}...`);
    
    try {
      await generateAudio(LESSON_24_TEXTS[i], filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ ${filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ ${filename}: ${error.message}`);
    }
  }
  
  console.log('🎉 Done!');
}

main().catch(console.error);
