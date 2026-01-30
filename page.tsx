'use client';

import { useState, useEffect, useCallback } from 'react';

// ElevenLabs голоса
const ELEVENLABS_VOICES = {
  // Custom voices (trained)
  'kFVUJfjBCiv9orAbWhZN': { name: 'Custom Voice ⭐', type: 'custom' },
  '8Hdxm8QJKOFknq47BhTz': { name: 'dZulu', type: 'custom' },
  'ma4IY0Z4IUybdEpvYzBW': { name: 'dZulu2', type: 'custom' },
  'erDx71FK2teMZ7g6khzw': { name: 'New Voice', type: 'custom' },
  // Built-in English voices (male)
  'pNInz6obpgDQGcFmaJgB': { name: 'Adam (Male, Deep)', type: 'builtin' },
  'TxGEqnHWrfWFTfGW9XjX': { name: 'Josh (Male, Young)', type: 'builtin' },
  'yoZ06aMxZJJ28mfd3POQ': { name: 'Sam (Male, Raspy)', type: 'builtin' },
  'ErXwobaYiN019PkySvjV': { name: 'Antoni (Male, Soft)', type: 'builtin' },
  // Built-in English voices (female)
  'EXAVITQu4vr4xnSDxMaL': { name: 'Bella (Female)', type: 'builtin' },
  '21m00Tcm4TlvDq8ikWAM': { name: 'Rachel (Female)', type: 'builtin' },
  'AZnzlk1XvdvUeBnXmlld': { name: 'Domi (Female)', type: 'builtin' },
  'MF3mGyEYCl7XYWbV9V6O': { name: 'Elli (Female)', type: 'builtin' },
};

interface Lesson {
  id: string;
  number: number;
  title: string;
  audioText?: string;
  content?: string;
}

interface Slide {
  number: number;
  text: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  audioUrl?: string;
  error?: string;
}

export default function AudioGeneratorPage() {
  // State
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('TxGEqnHWrfWFTfGW9XjX'); // Josh by default
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [generatedAudios, setGeneratedAudios] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);

  // Загрузка списка уроков
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/lessons');
      if (!res.ok) throw new Error('Failed to fetch lessons');
      const data = await res.json();
      setLessons(data.lessons || []);
    } catch (err) {
      setError('Не удалось загрузить уроки: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Выбор урока
  const handleSelectLesson = async (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    setSelectedLesson(lesson);
    setUseManualInput(false);
    setGeneratedAudios({});
    
    // Получаем детали урока с текстом
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`);
      if (!res.ok) throw new Error('Failed to fetch lesson details');
      const data = await res.json();
      
      // Парсим текст на слайды
      const audioText = data.lesson.audioText || data.lesson.content || '';
      parseTextToSlides(audioText);
    } catch (err) {
      setError('Не удалось загрузить урок: ' + (err as Error).message);
    }
  };

  // Парсинг текста на слайды
  const parseTextToSlides = (text: string) => {
    // Поддержка разных форматов:
    // 1. [SLIDE:1] ... [SLIDE:2] ...
    // 2. --- разделитель ---
    // 3. Просто абзацы
    
    let slideTexts: string[] = [];
    
    // Проверяем формат [SLIDE:N]
    const slideMarkerMatch = text.match(/\[SLIDE:\d+\]/g);
    if (slideMarkerMatch && slideMarkerMatch.length > 0) {
      // Разбиваем по маркерам слайдов
      const parts = text.split(/\[SLIDE:\d+\]/);
      slideTexts = parts.filter(p => p.trim()).map(p => p.trim());
    } 
    // Проверяем формат с разделителем ---
    else if (text.includes('---')) {
      slideTexts = text.split('---').filter(p => p.trim()).map(p => p.trim());
    }
    // Просто разбиваем по двойным переносам строк
    else {
      slideTexts = text.split(/\n\n+/).filter(p => p.trim() && p.length > 20).map(p => p.trim());
    }

    const newSlides: Slide[] = slideTexts.map((slideText, index) => ({
      number: index + 1,
      text: slideText,
      status: 'pending' as const,
    }));

    setSlides(newSlides);
  };

  // Ручной ввод текста
  const handleManualTextSubmit = () => {
    if (!manualText.trim()) return;
    setUseManualInput(true);
    setSelectedLesson(null);
    setGeneratedAudios({});
    parseTextToSlides(manualText);
  };

  // Генерация аудио для одного слайда
  const generateSlideAudio = async (slideIndex: number): Promise<string | null> => {
    const slide = slides[slideIndex];
    if (!slide) return null;

    // Обновляем статус
    setSlides(prev => prev.map((s, i) => 
      i === slideIndex ? { ...s, status: 'generating' as const } : s
    ));

    try {
      const res = await fetch('/api/admin/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: slide.text,
          voiceId: selectedVoice,
          slideNumber: slide.number,
          lessonId: selectedLesson?.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const data = await res.json();
      
      // Обновляем статус и сохраняем аудио
      setSlides(prev => prev.map((s, i) => 
        i === slideIndex ? { ...s, status: 'done' as const, audioUrl: data.audioUrl } : s
      ));
      
      setGeneratedAudios(prev => ({ ...prev, [slide.number]: data.audioUrl }));
      
      return data.audioUrl;
    } catch (err) {
      setSlides(prev => prev.map((s, i) => 
        i === slideIndex ? { ...s, status: 'error' as const, error: (err as Error).message } : s
      ));
      return null;
    }
  };

  // Генерация всех слайдов
  const generateAllAudios = async () => {
    if (slides.length === 0) return;

    setIsGenerating(true);
    setProgress({ current: 0, total: slides.length });

    for (let i = 0; i < slides.length; i++) {
      setProgress({ current: i + 1, total: slides.length });
      await generateSlideAudio(i);
      // Пауза между запросами чтобы не превысить лимит API
      if (i < slides.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsGenerating(false);
  };

  // Скачивание одного аудио
  const downloadAudio = async (slideNumber: number, audioUrl: string) => {
    try {
      const res = await fetch(audioUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slide${slideNumber}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Ошибка скачивания: ' + (err as Error).message);
    }
  };

  // Скачивание всех аудио как ZIP
  const downloadAllAsZip = async () => {
    const completedSlides = slides.filter(s => s.status === 'done' && s.audioUrl);
    if (completedSlides.length === 0) {
      alert('Нет готовых аудиофайлов для скачивания');
      return;
    }

    // Для ZIP нужно использовать библиотеку JSZip
    // Пока скачиваем по отдельности
    for (const slide of completedSlides) {
      if (slide.audioUrl) {
        await downloadAudio(slide.number, slide.audioUrl);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  // Статистика
  const stats = {
    total: slides.length,
    done: slides.filter(s => s.status === 'done').length,
    error: slides.filter(s => s.status === 'error').length,
    pending: slides.filter(s => s.status === 'pending').length,
    generating: slides.filter(s => s.status === 'generating').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎙️ Audio Generator
          </h1>
          <p className="text-slate-400 mt-2">
            Автоматическая генерация аудио для уроков через ElevenLabs
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 underline mt-2"
            >
              Закрыть
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Lesson Selection */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                📚 Выбор урока
              </h2>
              
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-slate-700 rounded mb-2"></div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                </div>
              ) : (
                <select
                  value={selectedLesson?.id || ''}
                  onChange={(e) => handleSelectLesson(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isGenerating}
                >
                  <option value="">-- Выберите урок --</option>
                  {lessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      Урок {lesson.number}: {lesson.title}
                    </option>
                  ))}
                </select>
              )}

              {/* Manual input toggle */}
              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useManualInput}
                    onChange={(e) => {
                      setUseManualInput(e.target.checked);
                      if (e.target.checked) setSelectedLesson(null);
                    }}
                    className="w-4 h-4 text-purple-500 rounded"
                    disabled={isGenerating}
                  />
                  <span className="text-slate-300">Ручной ввод текста</span>
                </label>
              </div>

              {useManualInput && (
                <div className="mt-4">
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Вставьте текст урока здесь...&#10;&#10;Используйте [SLIDE:1], [SLIDE:2] или --- для разделения слайдов"
                    className="w-full h-40 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 resize-none"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={handleManualTextSubmit}
                    disabled={!manualText.trim() || isGenerating}
                    className="mt-2 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Разобрать на слайды
                  </button>
                </div>
              )}
            </div>

            {/* Voice Selection */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🎤 Голос
              </h2>
              
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              >
                <optgroup label="Custom Voices">
                  {Object.entries(ELEVENLABS_VOICES)
                    .filter(([_, v]) => v.type === 'custom')
                    .map(([id, voice]) => (
                      <option key={id} value={id}>{voice.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Built-in Voices">
                  {Object.entries(ELEVENLABS_VOICES)
                    .filter(([_, v]) => v.type === 'builtin')
                    .map(([id, voice]) => (
                      <option key={id} value={id}>{voice.name}</option>
                    ))}
                </optgroup>
              </select>

              <p className="text-slate-400 text-sm mt-2">
                Выбрано: {ELEVENLABS_VOICES[selectedVoice as keyof typeof ELEVENLABS_VOICES]?.name}
              </p>
            </div>

            {/* Generate Button */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <button
                onClick={generateAllAudios}
                disabled={slides.length === 0 || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Генерация... {progress.current}/{progress.total}
                  </span>
                ) : (
                  <span>🚀 Сгенерировать все ({slides.length} слайдов)</span>
                )}
              </button>

              {/* Progress bar */}
              {isGenerating && (
                <div className="mt-4">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-center text-slate-400 text-sm mt-2">
                    {Math.round((progress.current / progress.total) * 100)}% завершено
                  </p>
                </div>
              )}

              {/* Stats */}
              {slides.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                    <span className="text-green-400">✅ {stats.done}</span>
                    <span className="text-slate-400 ml-1">готово</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                    <span className="text-yellow-400">⏳ {stats.pending}</span>
                    <span className="text-slate-400 ml-1">ожидает</span>
                  </div>
                  {stats.error > 0 && (
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center col-span-2">
                      <span className="text-red-400">❌ {stats.error}</span>
                      <span className="text-slate-400 ml-1">ошибок</span>
                    </div>
                  )}
                </div>
              )}

              {/* Download all */}
              {stats.done > 0 && (
                <button
                  onClick={downloadAllAsZip}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  📥 Скачать все ({stats.done} файлов)
                </button>
              )}
            </div>
          </div>

          {/* Right Panel - Slides */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                📝 Слайды ({slides.length})
              </h2>

              {slides.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-6xl mb-4">📄</p>
                  <p>Выберите урок или введите текст вручную</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.number}
                      className={`bg-slate-700/50 rounded-lg p-4 border transition-all ${
                        slide.status === 'done' ? 'border-green-500/50' :
                        slide.status === 'error' ? 'border-red-500/50' :
                        slide.status === 'generating' ? 'border-purple-500/50 animate-pulse' :
                        'border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-slate-600 text-white text-xs font-bold px-2 py-1 rounded">
                              Слайд {slide.number}
                            </span>
                            {slide.status === 'done' && (
                              <span className="text-green-400 text-sm">✅ Готово</span>
                            )}
                            {slide.status === 'generating' && (
                              <span className="text-purple-400 text-sm animate-pulse">⏳ Генерация...</span>
                            )}
                            {slide.status === 'error' && (
                              <span className="text-red-400 text-sm">❌ Ошибка</span>
                            )}
                          </div>
                          
                          <p className="text-slate-300 text-sm line-clamp-3">
                            {slide.text.substring(0, 200)}
                            {slide.text.length > 200 && '...'}
                          </p>
                          
                          <p className="text-slate-500 text-xs mt-1">
                            {slide.text.length} символов
                          </p>

                          {slide.error && (
                            <p className="text-red-400 text-xs mt-1">{slide.error}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          {slide.status === 'done' && slide.audioUrl && (
                            <>
                              <audio
                                src={slide.audioUrl}
                                controls
                                className="w-48 h-8"
                              />
                              <button
                                onClick={() => downloadAudio(slide.number, slide.audioUrl!)}
                                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                              >
                                📥 Скачать
                              </button>
                            </>
                          )}
                          
                          {slide.status === 'pending' && !isGenerating && (
                            <button
                              onClick={() => generateSlideAudio(index)}
                              className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                            >
                              🎙️ Озвучить
                            </button>
                          )}

                          {slide.status === 'error' && (
                            <button
                              onClick={() => generateSlideAudio(index)}
                              className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded"
                            >
                              🔄 Повторить
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Powered by ElevenLabs TTS API</p>
        </div>
      </div>
    </div>
  );
}
