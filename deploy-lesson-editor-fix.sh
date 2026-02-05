#!/bin/bash

# Скрипт для применения исправлений редактора уроков

echo "🚀 Применение исправлений редактора уроков..."
echo ""

cd /Users/davudzulumkhanov/thinking-course-en

echo "📝 Проверка изменений..."
git status

echo ""
echo "➕ Добавление файлов..."
git add src/app/admin/lesson-editor/page.tsx
git add src/app/api/admin/sync-lesson-content/route.ts
git add src/app/admin/lesson-editor/page-old-backup.tsx
git add src/app/api/admin/sync-lesson-content/route-old-backup.ts

echo ""
echo "💾 Коммит изменений..."
git commit -m "Fix lesson editor: sync from static files + correct audio upload API

- Fixed lesson editor to sync content from static files
- Fixed audio upload to use lessonNumber instead of lessonOrder
- Extended sync API to handle all lessons (9-15, 21-27)
- Added progress indicators for audio generation
- Improved error handling and status messages"

echo ""
echo "📤 Пуш в GitHub..."
git push origin main

echo ""
echo "✅ Готово! Изменения отправлены в GitHub."
echo "🔄 Railway автоматически задеплоит обновления (~2-3 минуты)"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Открыть: https://english-leeson-production.up.railway.app/admin/lesson-editor"
echo "   2. Нажать '🔄 Синхронизировать все'"
echo "   3. Выбрать урок → вкладка '🎵 Аудио'"
echo "   4. Генерировать аудио!"
echo ""
