const fs = require('fs');
const mammoth = require('mammoth');

async function main() {
  const inputFile = '/Users/davudzulumkhanov/Desktop/Элементарная Экономика.docx';
  const outputFile = '/Users/davudzulumkhanov/Desktop/Elementary Economics - English.txt';
  
  console.log('📖 Чтение файла...');
  const result = await mammoth.extractRawText({ path: inputFile });
  const russianText = result.value;
  
  console.log(`📊 Всего символов: ${russianText.length.toLocaleString()}`);
  
  // Сохраним текст для перевода
  const tempFile = '/Users/davudzulumkhanov/Desktop/russian-text-temp.txt';
  fs.writeFileSync(tempFile, russianText, 'utf-8');
  console.log(`✅ Текст сохранен в: ${tempFile}`);
  console.log('Начинаю перевод...');
}

main().catch(console.error);
