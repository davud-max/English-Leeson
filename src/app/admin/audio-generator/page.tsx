'use client';

import { useState, useEffect } from 'react';

// ElevenLabs голоса
const ELEVENLABS_VOICES: Record<string, { name: string; type: string }> = {
  // Custom voices (trained)
  'kFVUJfjBCiv9orAbWhZN': { name: 'Custom Voice ⭐', type: 'custom' },
  '8Hdxm8QJKOFknq47BhTz': { name: 'dZulu', type: 'custom' },
  'ma4IY0Z4IUybdEpvYzBW': { name: 'dZulu2', type: 'custom' },
  'dvlvChDGquF1SgaKcL95': { name: 'DavudZ10', type: 'custom' },
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
  order: number;
  title: string;
  audioText?: string;
  content?: string;
}

interface Slide {
  number: number;
  text: string;
  status: 'pending' | 'generating' | 'done' | 'error' | 'uploading' | 'uploaded';
  audioUrl?: string;
  previewAudioUrl?: string;
  audioBase64?: string;
  error?: string;
}

function audioBase64ToObjectUrl(audioBase64: string): string {
  const binary = atob(audioBase64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const blob = new Blob([bytes], { type: 'audio/mpeg' })
  return URL.createObjectURL(blob)
}


export default function AudioGeneratorPage() {
  // State
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('dvlvChDGquF1SgaKcL95'); // DavudZ10 by default
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
      setLessons(data || []);
    } catch (err) {
      setError('Не удалось загрузить уроки: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Синхронизация контента уроков из статических файлов в БД
  const syncLessonContent = async () => {
    setIsSyncing(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const res = await fetch('/api/admin/sync-lesson-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to sync');
      }
      
      const data = await res.json();
      setSuccessMessage(`✅ ${data.message}`);
      
      // Перезагружаем уроки и выбранный урок
      await fetchLessons();
      if (selectedLesson) {
        await handleSelectLesson(selectedLesson.id);
      }
    } catch (err) {
      setError('Ошибка синхронизации: ' + (err as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Выбор урока
  const handleSelectLesson = async (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    setSelectedLesson(lesson);
    setUseManualInput(false);
    setSuccessMessage(null);
    
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`);
      if (!res.ok) throw new Error('Failed to fetch lesson details');
      const data = await res.json();
      
      const audioText = data.lesson.audioText || data.lesson.content || '';
      parseTextToSlides(audioText);
    } catch (err) {
      setError('Не удалось загрузить урок: ' + (err as Error).message);
    }
  };

  // Парсинг текста на слайды
  const parseTextToSlides = (text: string) => {
    let slideTexts: string[] = [];
    
    const slideMarkerMatch = text.match(/\[SLIDE:\d+\]/g);
    if (slideMarkerMatch && slideMarkerMatch.length > 0) {
      const parts = text.split(/\[SLIDE:\d+\]/);
      slideTexts = parts.filter(p => p.trim()).map(p => p.trim());
    } else if (text.includes('---')) {
      slideTexts = text.split('---').filter(p => p.trim()).map(p => p.trim());
    } else {
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
    setSuccessMessage(null);
    parseTextToSlides(manualText);
  };

  // Генерация аудио для одного слайда
  const generateSlideAudio = async (slideIndex: number): Promise<boolean> => {
    const slide = slides[slideIndex];
    if (!slide) return false;

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
      
      setSlides(prev => prev.map((s, i) => 
        i === slideIndex ? { 
          ...s, 
          status: 'done' as const, 
          audioUrl: data.audioUrl,
          previewAudioUrl: audioBase64ToObjectUrl(data.audioBase64),
          audioBase64: data.audioBase64,
        } : s
      ));
      
      return true;
    } catch (err) {
      setSlides(prev => prev.map((s, i) => 
        i === slideIndex ? { ...s, status: 'error' as const, error: (err as Error).message } : s
      ));
      return false;
    }
  };

  // Генерация всех слайдов
  const generateAllAudios = async () => {
    if (slides.length === 0) return;

    setIsGenerating(true);
    setProgress({ current: 0, total: slides.length });
    setSuccessMessage(null);

    for (let i = 0; i < slides.length; i++) {
      setProgress({ current: i + 1, total: slides.length });
      await generateSlideAudio(i);
      if (i < slides.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsGenerating(false);
  };

  // Загрузка одного аудио в репозиторий
  const uploadSlideAudio = async (slideIndex: number): Promise<boolean> => {
    const slide = slides[slideIndex];
    if (!slide || !slide.audioBase64 || !selectedLesson) return false;

    setSlides(prev => prev.map((s, i) => 
      i === slideIndex ? { ...s, status: 'uploading' as const } : s
    ));

    try {
      const res = await fetch('/api/admin/upload-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonNumber: selectedLesson.order,
          slideNumber: slide.number,
          audioBase64: slide.audioBase64,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload audio');
      }

      setSlides(prev => prev.map((s, i) => 
        i === slideIndex ? { ...s, status: 'uploaded' as const } : s
      ));
      
      return true;
    } catch (err) {
      setSlides(prev => prev.map((s, i) => 
        i === slideIndex ? { ...s, status: 'error' as const, error: (err as Error).message } : s
      ));
      return false;
    }
  };

  // Сохранить все в репозиторий (удалить старые + загрузить новые)
  const saveAllToRepository = async () => {
    if (!selectedLesson) {
      setError('Выберите урок для сохранения');
      return;
    }

    const completedSlides = slides.filter(s => s.status === 'done' && s.audioBase64);
    if (completedSlides.length === 0) {
      setError('Нет готовых аудио для сохранения. Сначала сгенерируйте аудио.');
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: completedSlides.length + 1 });
    setError(null);
    setSuccessMessage(null);

    try {
      // Шаг 1: Удаляем старые аудио
      setUploadProgress({ current: 0, total: completedSlides.length + 1 });
      
      const clearRes = await fetch('/api/admin/clear-lesson-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonNumber: selectedLesson.order }),
      });

      if (!clearRes.ok) {
        const errorData = await clearRes.json();
        throw new Error(`Ошибка удаления старых файлов: ${errorData.error}`);
      }

      const clearData = await clearRes.json();
      console.log(`Deleted ${clearData.deleted} old files`);

      // Шаг 2: Загружаем новые аудио
      let uploadedCount = 0;
      for (let i = 0; i < slides.length; i++) {
        if (slides[i].status === 'done' && slides[i].audioBase64) {
          setUploadProgress({ current: uploadedCount + 1, total: completedSlides.length });
          const success = await uploadSlideAudio(i);
          if (success) uploadedCount++;
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // Шаг 3: Триггерим редеплой Railway
      try {
        const deployRes = await fetch('/api/admin/trigger-deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        
        if (deployRes.ok) {
          setSuccessMessage(`✅ Сохранено ${uploadedCount} аудио файлов! 🚀 Railway деплой запущен автоматически.`);
        } else {
          setSuccessMessage(`✅ Сохранено ${uploadedCount} аудио файлов! ⚠️ Не удалось запустить автодеплой. Выполните git pull && git push вручную.`);
        }
      } catch (deployErr) {
        console.error('Deploy trigger failed:', deployErr);
        setSuccessMessage(`✅ Сохранено ${uploadedCount} аудио файлов! ⚠️ Автодеплой недоступен. Выполните git pull && git push вручную.`);
      }
    } catch (err) {
      setError('Ошибка сохранения: ' + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
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

  // Скачивание всех аудио
  const downloadAllAudios = async () => {
    const completedSlides = slides.filter(s => (s.status === 'done' || s.status === 'uploaded') && s.audioUrl);
    if (completedSlides.length === 0) {
      alert('Нет готовых аудиофайлов для скачивания');
      return;
    }

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
    done: slides.filter(s => s.status === 'done' || s.status === 'uploaded').length,
    uploaded: slides.filter(s => s.status === 'uploaded').length,
    error: slides.filter(s => s.status === 'error').length,
    pending: slides.filter(s => s.status === 'pending').length,
  };

  const canSaveToRepo = selectedLesson && stats.done > 0 && !isGenerating && !isUploading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎙️ Audio Generator
          </h1>
          <p className="text-slate-400 mt-2">
            Автоматическая генерация и сохранение аудио для уроков
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
            <p className="text-green-300">{successMessage}</p>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="text-green-400 underline mt-2"
            >
              Закрыть
            </button>
          </div>
        )}

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
            {/* Sync Content Button */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur rounded-xl p-4 border border-amber-500/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-amber-300">⚠️ Синхронизация</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Перед генерацией синхронизируйте полный текст слайдов
                  </p>
                </div>
                <button
                  onClick={syncLessonContent}
                  disabled={isSyncing || isGenerating || isUploading}
                  className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap text-sm"
                >
                  {isSyncing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Синх...
                    </span>
                  ) : (
                    '🔄 Синхронизировать'
                  )}
                </button>
              </div>
            </div>

            {/* Lesson Selection */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                📚 Выбор урока
              </h2>
              
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-slate-700 rounded"></div>
                </div>
              ) : (
                <select
                  value={selectedLesson?.id || ''}
                  onChange={(e) => handleSelectLesson(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isGenerating || isUploading}
                >
                  <option value="">-- Выберите урок --</option>
                  {lessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      Урок {lesson.order}: {lesson.title}
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
                    disabled={isGenerating || isUploading}
                  />
                  <span className="text-slate-300">Ручной ввод текста</span>
                </label>
              </div>

              {useManualInput && (
                <div className="mt-4">
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Вставьте текст урока...&#10;&#10;Разделители: [SLIDE:1] или ---"
                    className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                    disabled={isGenerating || isUploading}
                  />
                  <button
                    onClick={handleManualTextSubmit}
                    disabled={!manualText.trim() || isGenerating || isUploading}
                    className="mt-2 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Разобрать на слайды
                  </button>
                </div>
              )}
            </div>

            {/* Voice Selection */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">🎤 Голос</h2>
              
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating || isUploading}
              >
                <optgroup label="Custom Voices">
                  {Object.entries(ELEVENLABS_VOICES)
                    .filter(([, v]) => v.type === 'custom')
                    .map(([id, voice]) => (
                      <option key={id} value={id}>{voice.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Built-in Voices">
                  {Object.entries(ELEVENLABS_VOICES)
                    .filter(([, v]) => v.type === 'builtin')
                    .map(([id, voice]) => (
                      <option key={id} value={id}>{voice.name}</option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Actions */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 space-y-4">
              {/* Generate Button */}
              <button
                onClick={generateAllAudios}
                disabled={slides.length === 0 || isGenerating || isUploading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg"
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
                  <span>🎙️ Сгенерировать аудио ({slides.length})</span>
                )}
              </button>

              {/* Progress bar for generation */}
              {isGenerating && (
                <div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Save to Repository Button */}
              <button
                onClick={saveAllToRepository}
                disabled={!canSaveToRepo}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Сохранение... {uploadProgress.current}/{uploadProgress.total}
                  </span>
                ) : (
                  <span>💾 Сохранить в проект ({stats.done})</span>
                )}
              </button>

              {/* Progress bar for upload */}
              {isUploading && (
                <div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats */}
              {slides.length > 0 && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                    <span className="text-green-400">✅ {stats.done}</span>
                    <span className="text-slate-400 ml-1">готово</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                    <span className="text-blue-400">📤 {stats.uploaded}</span>
                    <span className="text-slate-400 ml-1">сохранено</span>
                  </div>
                </div>
              )}

              {/* Download all */}
              {stats.done > 0 && (
                <button
                  onClick={downloadAllAudios}
                  disabled={isGenerating || isUploading}
                  className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  📥 Скачать локально ({stats.done})
                </button>
              )}
            </div>
          </div>

          {/* Right Panel - Slides */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">
                📝 Слайды ({slides.length})
              </h2>

              {slides.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-6xl mb-4">📄</p>
                  <p>Выберите урок или введите текст вручную</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.number}
                      className={`bg-slate-700/50 rounded-lg p-4 border transition-all ${
                        slide.status === 'uploaded' ? 'border-blue-500/50' :
                        slide.status === 'done' ? 'border-green-500/50' :
                        slide.status === 'error' ? 'border-red-500/50' :
                        slide.status === 'generating' || slide.status === 'uploading' ? 'border-purple-500/50 animate-pulse' :
                        'border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="bg-slate-600 text-white text-xs font-bold px-2 py-1 rounded">
                              #{slide.number}
                            </span>
                            {slide.status === 'uploaded' && (
                              <span className="text-blue-400 text-xs">📤 Сохранено</span>
                            )}
                            {slide.status === 'done' && (
                              <span className="text-green-400 text-xs">✅ Готово</span>
                            )}
                            {slide.status === 'generating' && (
                              <span className="text-purple-400 text-xs animate-pulse">⏳ Генерация...</span>
                            )}
                            {slide.status === 'uploading' && (
                              <span className="text-purple-400 text-xs animate-pulse">📤 Сохранение...</span>
                            )}
                            {slide.status === 'error' && (
                              <span className="text-red-400 text-xs">❌ Ошибка</span>
                            )}
                            <span className="text-slate-500 text-xs">{slide.text.length} симв.</span>
                          </div>
                          
                          <p className="text-slate-300 text-sm line-clamp-2">
                            {slide.text.substring(0, 150)}
                            {slide.text.length > 150 && '...'}
                          </p>

                          {slide.error && (
                            <p className="text-red-400 text-xs mt-1">{slide.error}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {(slide.status === 'done' || slide.status === 'uploaded') && slide.audioUrl && (
                            <>
                              <audio
                                src={slide.previewAudioUrl || slide.audioUrl}
                                controls
                                className="w-36 h-8"
                              />
                              <button
                                onClick={() => downloadAudio(slide.number, slide.audioUrl!)}
                                className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded"
                              >
                                📥
                              </button>
                            </>
                          )}
                          
                          {slide.status === 'pending' && !isGenerating && !isUploading && (
                            <button
                              onClick={() => generateSlideAudio(index)}
                              className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                            >
                              🎙️
                            </button>
                          )}

                          {slide.status === 'error' && (
                            <button
                              onClick={() => generateSlideAudio(index)}
                              className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded"
                            >
                              🔄
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
          <p>Powered by ElevenLabs TTS API • Auto-save to GitHub</p>
        </div>
      </div>
    </div>
  );
}
