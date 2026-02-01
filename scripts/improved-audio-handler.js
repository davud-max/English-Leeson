/**
 * Улучшенный обработчик аудио для урока 1
 * Решает проблему с зависанием при повторном запуске
 */

const improvedAudioLogic = `
// Улучшенный обработчик аудио с учетом особенностей браузеров

const [audioState, setAudioState] = useState({
  isInitialized: false,
  isLoading: false,
  error: null,
  retryCount: 0
});

// Функция для подготовки аудио перед воспроизведением
const prepareAudio = async (audioFile) => {
  if (!audioRef.current) return false;
  
  try {
    // Устанавливаем источник
    audioRef.current.src = audioFile;
    
    // Ждем загрузки метаданных
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Audio metadata loading timeout'));
      }, 5000);
      
      audioRef.current.onloadedmetadata = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      audioRef.current.onerror = (e) => {
        clearTimeout(timeout);
        reject(e);
      };
    });
    
    return true;
  } catch (error) {
    console.error('Failed to prepare audio:', error);
    return false;
  }
};

// Улучшенная функция воспроизведения
const playAudio = async (audioFile) => {
  if (audioState.isLoading) return;
  
  setAudioState(prev => ({ ...prev, isLoading: true, error: null }));
  
  try {
    // Подготовка аудио
    const isPrepared = await prepareAudio(audioFile);
    if (!isPrepared) {
      throw new Error('Failed to prepare audio file');
    }
    
    // Попытка воспроизведения
    await audioRef.current.play();
    
    // Успешное воспроизведение
    setAudioState({
      isInitialized: true,
      isLoading: false,
      error: null,
      retryCount: 0
    });
    
    console.log('Audio playing successfully');
    
  } catch (error) {
    console.error('Audio playback failed:', error);
    
    // Обработка различных типов ошибок
    if (error.name === 'NotAllowedError') {
      // Браузер блокирует автовоспроизведение
      setAudioState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Browser blocked autoplay - user interaction required'
      }));
    } else if (error.name === 'AbortError') {
      // Воспроизведение было прервано
      setAudioState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Playback was aborted'
      }));
    } else {
      // Другие ошибки - пробуем повторить
      const newRetryCount = audioState.retryCount + 1;
      
      if (newRetryCount <= 3) {
        console.log(\`Retrying playback (attempt \${newRetryCount}/3)\`);
        setAudioState(prev => ({
          ...prev,
          isLoading: false,
          retryCount: newRetryCount
        }));
        
        // Повтор через небольшую задержку
        setTimeout(() => {
          playAudio(audioFile);
        }, 1000 * newRetryCount);
      } else {
        // Превышено количество попыток
        setAudioState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to play audio after multiple attempts'
        }));
      }
    }
  }
};

// Обновленный useEffect для аудио
useEffect(() => {
  if (!isPlaying || !lesson) return;

  const audioFile = \`/audio/lesson\${lessonOrder}/slide\${currentSlide + 1}.mp3\`;
  
  // Сброс состояния при смене слайда
  if (audioState.isInitialized) {
    setAudioState({
      isInitialized: false,
      isLoading: false,
      error: null,
      retryCount: 0
    });
  }
  
  // Запуск воспроизведения
  playAudio(audioFile);

  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };
}, [currentSlide, isPlaying, lesson, lessonOrder]);

// Улучшенный обработчик завершения аудио
const handleAudioEnded = () => {
  if (currentSlide < totalSlides - 1) {
    setCurrentSlide(prev => prev + 1);
    setProgress(0);
    // Сброс состояния аудио для следующего слайда
    setAudioState({
      isInitialized: false,
      isLoading: false,
      error: null,
      retryCount: 0
    });
  } else {
    setIsPlaying(false);
    setProgress(100);
  }
};

// Улучшенный togglePlay с учетом состояния аудио
const togglePlay = () => {
  if (isPlaying) {
    audioRef.current?.pause();
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setAudioState(prev => ({ ...prev, isInitialized: false }));
  } else {
    setIsPlaying(true);
    setProgress(0);
    // Сброс ошибок при новой попытке воспроизведения
    setAudioState(prev => ({ 
      ...prev, 
      error: null,
      retryCount: 0
    }));
  }
};
`;

console.log('🔧 Улучшенный обработчик аудио для решения проблемы зависания\n');
console.log('Основные улучшения:');
console.log('1. Подготовка аудио перед воспроизведением (ожидание метаданных)');
console.log('2. Система повторных попыток с экспоненциальной задержкой');
console.log('3. Лучшая обработка различных типов ошибок браузера');
console.log('4. Сброс состояния при смене слайдов');
console.log('5. Отдельное состояние для отслеживания инициализации аудио\n');

console.log('Проблема с 10-минутным зависанием может быть связана с:');
console.log('- Медленной загрузкой аудио-файла');
console.log('- Ожиданием метаданных аудио');
console.log('- Блокировкой воспроизведения браузером');
console.log('- Проблемами с сетевым подключением\n');

console.log('Решение:');
console.log('1. Добавлен таймаут ожидания метаданных (5 секунд)');
console.log('2. Реализована система повторных попыток (до 3 раз)');
console.log('3. Улучшена обработка ошибок браузера');
console.log('4. Добавлены логи для диагностики проблем\n');

console.log('Для применения изменений:');
console.log('1. Замените существующий код аудио-обработчика в компоненте урока');
console.log('2. Добавьте новое состояние audioState');
console.log('3. Используйте улучшенные функции playAudio и prepareAudio');
console.log('4. Обновите useEffect и обработчики событий');