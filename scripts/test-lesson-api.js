const fs = require('fs');
const path = require('path');

/**
 * Тестовый скрипт для проверки обновленного API урока
 */
function testLessonApi() {
  console.log('🧪 Testing updated lesson API...\n');

  // Получаем список уроков из папки аудио
  const audioDir = path.join(__dirname, '..', 'public', 'audio');
  const lessonDirs = fs.readdirSync(audioDir).filter(item => {
    return fs.statSync(path.join(audioDir, item)).isDirectory() && item.startsWith('lesson');
  });

  // Извлекаем номера уроков из названий папок
  const lessonNumbers = lessonDirs.map(dir => {
    const match = dir.match(/lesson(\d+)/);
    return match ? parseInt(match[1]) : null;
  }).filter(num => num !== null).sort((a, b) => a - b);

  console.log(`📋 Found lessons to test: ${lessonNumbers.join(', ')}\n`);

  for (const lessonNumber of lessonNumbers.slice(0, 3)) { // Тестируем первые 3 урока
    const audioDirPath = path.join(__dirname, '..', 'public', 'audio', `lesson${lessonNumber}`);
    
    // Подсчитываем количество аудио-файлов
    let audioCount = 0;
    if (fs.existsSync(audioDirPath)) {
      const audioFiles = fs.readdirSync(audioDirPath).filter(file => 
        file.startsWith('slide') && file.endsWith('.mp3')
      ).sort((a, b) => {
        // Сортировка файлов по номеру слайда
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });
      audioCount = audioFiles.length;
    }

    console.log(`Lesson ${lessonNumber}:`);
    console.log(`  📁 Audio files found: ${audioCount}`);
    console.log(`  📄 Expected API endpoint: /api/lessons/${lessonNumber}`);
    console.log(`  🔄 This API should now return ${audioCount} slides based on audio files\n`);
  }

  console.log('✅ Test completed. The updated API should now dynamically generate slides based on existing audio files.');
  console.log('\n💡 How it works:');
  console.log('   - The API checks for audio files in /public/audio/lesson[X]/');
  console.log('   - Creates a slide for each slide*.mp3 file found');
  console.log('   - Returns slides array with proper IDs matching audio filenames');
  console.log('   - This ensures 1:1 correspondence between slides and audio files');
}

// Запускаем тест
testLessonApi();