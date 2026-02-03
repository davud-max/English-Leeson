const fs = require('fs');
const path = require('path');

const lessons = [21, 22, 23, 24, 25, 26, 27];

for (const lessonNum of lessons) {
  const filePath = path.join(__dirname, '..', 'src', 'app', '(course)', 'lessons', String(lessonNum), 'page.tsx');
  
  if (!fs.existsSync(filePath)) {
    console.log(`Lesson ${lessonNum}: file not found`);
    continue;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Извлекаем слайды
  const contentMatches = [...fileContent.matchAll(/content: `([\s\S]*?)`,/g)];
  const slides = contentMatches.map((match, index) => ({
    id: index + 1,
    title: `Part ${index + 1}`,
    content: match[1],
    emoji: '📖',
    duration: 20000
  }));
  
  if (slides.length === 0) {
    console.log(`Lesson ${lessonNum}: no slides extracted`);
    continue;
  }
  
  const fullContent = slides.map(s => s.content).join('\n\n---\n\n');
  
  console.log(`Lesson ${lessonNum}: ${slides.length} slides, ${fullContent.length} chars`);
  console.log(JSON.stringify({ slides, content: fullContent }, null, 2));
  console.log('\n---\n');
}
