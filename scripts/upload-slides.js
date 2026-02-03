const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://english-leeson-production.up.railway.app';

async function updateLesson(lessonId, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(`/api/admin/lessons/${lessonId}`, API_URL);
    const body = JSON.stringify(data);
    
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`Status ${res.statusCode}: ${responseData}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function getLessons() {
  return new Promise((resolve, reject) => {
    https.get(`${API_URL}/api/admin/lessons`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

(async () => {
  const lessons = [21, 22, 23, 24, 25, 26, 27];
  const allLessons = await getLessons();
  
  for (const lessonNum of lessons) {
    const filePath = path.join(__dirname, '..', 'src', 'app', '(course)', 'lessons', String(lessonNum), 'page.tsx');
    
    if (!fs.existsSync(filePath)) {
      console.log(`Lesson ${lessonNum}: file not found`);
      continue;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
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
    
    // Находим ID урока в базе
    const lessonInDb = allLessons.find(l => l.order === lessonNum);
    if (!lessonInDb) {
      console.log(`Lesson ${lessonNum}: not found in DB`);
      continue;
    }
    
    try {
      await updateLesson(lessonInDb.id, { slides, content: fullContent });
      console.log(`Lesson ${lessonNum}: ✓ updated (${slides.length} slides, ${fullContent.length} chars)`);
    } catch (error) {
      console.error(`Lesson ${lessonNum}: ✗ error - ${error.message}`);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\nDone!');
})();
