/**
 * Тестирование ответа API для урока 1
 * Этот скрипт имитирует работу API, чтобы проверить, 
 * какие данные будут возвращены для урока 1
 */

const fs = require('fs');
const path = require('path');

// Эмуляция функции, которая проверяет аудио-файлы (как в обновленном API)
function getSlidesFromAudioFiles(orderNum, lesson) {
  const audioDir = path.join(process.cwd(), 'public', 'audio', `lesson${orderNum}`);
  let slides = null;

  if (fs.existsSync(audioDir)) {
    const audioFiles = fs.readdirSync(audioDir)
      .filter(file => file.startsWith('slide') && file.endsWith('.mp3'))
      .sort((a, b) => {
        // Сортировка файлов по номеру слайда (slide1.mp3, slide2.mp3, и т.д.)
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    if (audioFiles.length > 0) {
      // Создаем слайды на основе количества аудио-файлов
      slides = audioFiles.map((file, index) => {
        const slideNumber = index + 1;
        return {
          id: slideNumber,
          title: `Slide ${slideNumber}`,
          content: `Content for slide ${slideNumber} of lesson ${orderNum}`,
          emoji: lesson.emoji || '📖',
          duration: 30000
        };
      });
    }
  }

  // Если слайды не были созданы из аудио-файлов, создаем один общий слайд
  if (!slides) {
    slides = [{
      id: 1,
      title: lesson.title,
      content: lesson.content,
      emoji: lesson.emoji || '📖',
      duration: 30000,
    }];
  }

  return slides;
}

// Тестовые данные для урока 1
const mockLesson1 = {
  id: 'lesson1-id',
  order: 1,
  title: 'Lesson 1',
  description: 'Basic concepts',
  content: 'Full content of lesson 1...',
  duration: 30,
  emoji: '📚',
  color: 'from-blue-500 to-indigo-600',
  available: true
};

console.log('🔍 Тестирование API ответа для урока 1\n');

// Проверяем наличие аудио-файлов
const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lesson1');
console.log('📁 Проверяем папку:', audioDir);

if (fs.existsSync(audioDir)) {
  const audioFiles = fs.readdirSync(audioDir).filter(file => 
    file.startsWith('slide') && file.endsWith('.mp3')
  );
  console.log(`✅ Найдено аудио-файлов: ${audioFiles.length}`);
  audioFiles.forEach(file => {
    const stats = fs.statSync(path.join(audioDir, file));
    console.log(`   📄 ${file} (${Math.round(stats.size / 1024)} KB)`);
  });
} else {
  console.log('❌ Папка с аудио не найдена');
}

console.log('\n🔄 Генерация слайдов на основе аудио-файлов...');

const slides = getSlidesFromAudioFiles(1, mockLesson1);

console.log(`\n📊 Результат:`);
console.log(`   Количество слайдов: ${slides.length}`);
console.log(`   Структура слайдов:`);
slides.forEach((slide, index) => {
  console.log(`     ${index + 1}. ID: ${slide.id}, Title: "${slide.title}", Duration: ${slide.duration}ms`);
});

// Проверяем, соответствует ли первый слайд аудио-файлу
const expectedAudioFile = 'slide1.mp3';
const audioFileExists = fs.existsSync(path.join(__dirname, '..', 'public', 'audio', 'lesson1', expectedAudioFile));

console.log(`\n🔍 Проверка соответствия:`);
console.log(`   Ожидаемый аудио-файл для слайда 1: ${expectedAudioFile}`);
console.log(`   Файл существует: ${audioFileExists ? '✅ Да' : '❌ Нет'}`);

if (slides.length > 0) {
  const firstSlide = slides[0];
  console.log(`   Первый слайд ID: ${firstSlide.id}`);
  console.log(`   Ожидаемый путь к аудио: /audio/lesson1/slide${firstSlide.id}.mp3`);
  
  const audioPath = `/audio/lesson1/slide${firstSlide.id}.mp3`;
  const fullPath = path.join(__dirname, '..', 'public', 'audio', 'lesson1', `slide${firstSlide.id}.mp3`);
  console.log(`   Полный путь: ${fullPath}`);
  console.log(`   Аудио-файл доступен: ${fs.existsSync(fullPath) ? '✅ Да' : '❌ Нет'}`);
}

console.log('\n💡 Возможные причины проблемы:');
console.log('   1. Браузер блокирует автовоспроизведение аудио');
console.log('   2. Ошибка в компоненте урока при обработке данных');
console.log('   3. Проблема с CORS или доступом к аудио-файлам на сервере');
console.log('   4. Ошибки в консоли браузера, мешающие воспроизведению');

console.log('\n🔧 Рекомендуемые действия:');
console.log('   1. Проверить консоль браузера на наличие ошибок');
console.log('   2. Убедиться, что аудио-файл доступен по прямой ссылке');
console.log('   3. Проверить, вызывается ли метод воспроизведения аудио');