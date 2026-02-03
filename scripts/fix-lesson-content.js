const https = require('https');

const API_URL = 'https://english-leeson-production.up.railway.app';

async function getLessons() {
  return new Promise((resolve, reject) => {
    https.get(`${API_URL}/api/admin/lessons`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

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

(async () => {
  try {
    const lessons = await getLessons();
    
    for (const lesson of lessons) {
      if (!lesson.slides || lesson.slides.length === 0) {
        console.log(`Lesson ${lesson.order}: no slides, skipping`);
        continue;
      }
      
      // Собираем контент из слайдов
      const fullContent = lesson.slides.map(s => s.content).join('\n\n---\n\n');
      
      // Проверяем нужно ли обновление
      if (lesson.content === fullContent) {
        console.log(`Lesson ${lesson.order}: content already matches slides`);
        continue;
      }
      
      // Обновляем только если контент отличается
      await updateLesson(lesson.id, { content: fullContent });
      console.log(`Lesson ${lesson.order}: ✓ content updated (${lesson.content.length} -> ${fullContent.length} chars)`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
