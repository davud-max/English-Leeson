const fs = require('fs');
const path = require('path');

function checkSlideAudioMatch() {
  try {
    console.log('🔍 Checking slide and audio file correspondence...\n');

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

    console.log(`📋 Found ${lessonNumbers.length} lessons with audio folders\n`);

    // Для каждого урока проверим соответствие слайдов и аудио-файлов
    for (const lessonNumber of lessonNumbers) {
      const audioDir = path.join(__dirname, '..', 'public', 'audio', `lesson${lessonNumber}`);
      
      // Подсчитываем количество аудио-файлов
      let audioCount = 0;
      if (fs.existsSync(audioDir)) {
        const audioFiles = fs.readdirSync(audioDir).filter(file => 
          file.startsWith('slide') && file.endsWith('.mp3')
        );
        audioCount = audioFiles.length;
      }
      
      // Попробуем получить информацию о слайдах из соответствующего файла урока
      let slideCount = 0;
      let lessonTitle = `Lesson ${lessonNumber}`;
      
      // Проверим, существует ли соответствующий файл урока
      const lessonFilePath = path.join(__dirname, '..', 'src', 'app', '(course)', 'lessons', lessonNumber.toString(), 'page.tsx');
      
      if (fs.existsSync(lessonFilePath)) {
        const lessonFileContent = fs.readFileSync(lessonFilePath, 'utf-8');
        
        // Попробуем найти количество слайдов по наличию объектов слайдов в файле
        const slideMatches = lessonFileContent.match(/\{\s*id:\s*(\d+)/g);
        if (slideMatches) {
          slideCount = slideMatches.length;
        }
        
        // Попробуем получить название урока
        const titleMatch = lessonFileContent.match(/title:\s*"([^"]+)"|title:\s*'([^']+)'/);
        if (titleMatch) {
          lessonTitle = titleMatch[1] || titleMatch[2];
        }
      }
      
      const status = slideCount === audioCount ? '✅ OK' : 
                    slideCount > audioCount ? '⚠️ Missing Audio' : 
                    '⚠️ Extra Audio';

      console.log(`Lesson ${lessonNumber}: ${lessonTitle}`);
      console.log(`  Slides: ${slideCount}, Audio Files: ${audioCount} - ${status}`);
      
      if (slideCount !== audioCount) {
        console.log(`  📍 Path: ${audioDir}`);
        console.log(`  📊 Difference: ${Math.abs(slideCount - audioCount)} files`);
      }
      
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking slide-audio correspondence:', error);
  }
}

// Запускаем функцию
checkSlideAudioMatch();