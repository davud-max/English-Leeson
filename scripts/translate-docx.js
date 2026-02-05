const https = require('https');
const fs = require('fs');

// Для .docx нужна библиотека mammoth
// npm install mammoth

const mammoth = require('mammoth');

const API_URL = 'https://english-leeson-production.up.railway.app';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

async function translateText(text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      text: text,
      type: 'content',
      adminKey: ADMIN_KEY
    });
    
    const options = {
      hostname: 'english-leeson-production.up.railway.app',
      path: '/api/admin/translate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
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
          if (!result.result) {
            console.error('❌ No result field in response:', result);
            reject(new Error('Invalid response format'));
            return;
          }
          resolve(result.result);
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
  const inputFile = '/Users/davudzulumkhanov/Desktop/Элементарная Экономика.docx';
  const outputFile = '/Users/davudzulumkhanov/Desktop/Elementary Economics.txt';
  
  console.log('Reading .docx file...');
  const result = await mammoth.extractRawText({ path: inputFile });
  const russianText = result.value;
  
  console.log(`Total characters: ${russianText.length}`);
  
  // Разбиваем на части по 4000 символов
  const chunkSize = 4000;
  const chunks = [];
  
  for (let i = 0; i < russianText.length; i += chunkSize) {
    chunks.push(russianText.slice(i, i + chunkSize));
  }
  
  console.log(`Split into ${chunks.length} chunks`);
  
  let translatedText = '';
  
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Translating chunk ${i + 1}/${chunks.length}...`);
    const translated = await translateText(chunks[i]);
    translatedText += translated + '\n\n';
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  fs.writeFileSync(outputFile, translatedText, 'utf-8');
  console.log(`✅ Translation saved to: ${outputFile}`);
}

main().catch(console.error);
