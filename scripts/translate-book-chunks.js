const fs = require('fs');

const inputFile = '/Users/davudzulumkhanov/Desktop/russian-text-temp.txt';
const outputFile = '/Users/davudzulumkhanov/Desktop/Elementary Economics - English.txt';

const text = fs.readFileSync(inputFile, 'utf-8');
const chunkSize = 15000;
const chunks = [];

for (let i = 0; i < text.length; i += chunkSize) {
  chunks.push(text.slice(i, Math.min(i + chunkSize, text.length)));
}

console.log(`Разделено на ${chunks.length} частей`);
console.log('Сохраняю части для перевода...');

for (let i = 0; i < chunks.length; i++) {
  fs.writeFileSync(`/Users/davudzulumkhanov/Desktop/chunk_${i+1}.txt`, chunks[i], 'utf-8');
}

console.log(`Создано ${chunks.length} файлов: chunk_1.txt до chunk_${chunks.length}.txt`);
