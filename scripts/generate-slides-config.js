const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '..', 'public', 'audio');
const outputFile = path.join(__dirname, '..', 'public', 'data', 'slides-config.json');

const config = {};

// Читаем все папки уроков
const items = fs.readdirSync(audioDir);

items.forEach(item => {
  const match = item.match(/^lesson(\d+)$/);
  if (match) {
    const lessonNum = parseInt(match[1]);
    const lessonDir = path.join(audioDir, item);
    
    if (fs.statSync(lessonDir).isDirectory()) {
      const files = fs.readdirSync(lessonDir);
      const slideFiles = files.filter(f => f.match(/^slide\d+\.mp3$/));
      config[lessonNum] = slideFiles.length;
    }
  }
});

// Создаём директорию если нет
const dataDir = path.dirname(outputFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(config, null, 2));
console.log('Created slides config:', config);
