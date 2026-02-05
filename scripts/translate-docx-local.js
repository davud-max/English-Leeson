const https = require('https');
const fs = require('fs');
const mammoth = require('mammoth');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

async function translateText(text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8096,
      messages: [{
        role: 'user',
        content: `You are translating educational content about "Theory of Abstraction" and cognitive philosophy from Russian to English.

TASK: Translate the following Russian text to English and format it properly.

FORMATTING RULES:
1. Use **bold** for key concepts and important terms
2. Use > for important quotes or key statements (blockquotes)
3. Keep paragraphs short and readable
4. If the text contains enumerated points, format them as a proper list
5. Preserve any existing structure and emphasis
6. Make the translation academically clear but accessible
7. The translation should sound natural in English, not literal

RUSSIAN TEXT:
${text}

Return ONLY the translated and formatted English text in Markdown format. Do not include any explanations or notes.`
      }]
    });
    
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error(`❌ Error ${res.statusCode}: ${body}`);
          reject(new Error(`Translation failed: ${body}`));
          return;
        }
        try {
          const result = JSON.parse(body);
          const translated = result.content[0].text;
          resolve(translated);
        } catch (e) {
          console.error('❌ Parse error:', e, 'Body:', body);
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    process.exit(1);
  }
  
  const inputFile = '/Users/davudzulumkhanov/Desktop/Элементарная Экономика.docx';
  const outputFile = '/Users/davudzulumkhanov/Desktop/Elementary Economics.txt';
  
  console.log('Reading .docx file...');
  const result = await mammoth.extractRawText({ path: inputFile });
  const russianText = result.value;
  
  console.log(`Total characters: ${russianText.length}`);
  
  // Разбиваем на части по 3000 символов
  const chunkSize = 3000;
  const chunks = [];
  
  for (let i = 0; i < russianText.length; i += chunkSize) {
    chunks.push(russianText.slice(i, i + chunkSize));
  }
  
  console.log(`Split into ${chunks.length} chunks`);
  
  let translatedText = '';
  
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Translating chunk ${i + 1}/${chunks.length}...`);
    try {
      const translated = await translateText(chunks[i]);
      translatedText += translated + '\n\n';
      
      // Пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.error(`Failed chunk ${i + 1}:`, e.message);
      // Продолжаем со следующим
    }
  }
  
  fs.writeFileSync(outputFile, translatedText, 'utf-8');
  console.log(`✅ Translation saved to: ${outputFile}`);
}

main().catch(console.error);
