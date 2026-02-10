#!/bin/bash

echo "🔍 ПОИСК ФУНКЦИИ generateAudio в Lesson Editor"
echo "=============================================="
echo ""

FILE="/Users/davudzulumkhanov/thinking-course-en/src/app/admin/lesson-editor/page.tsx"

echo "Файл: $FILE"
echo ""

echo "1️⃣ Поиск определения функции generateAudio:"
echo "----------------------------------------------"
grep -n "const generateAudio\|function generateAudio" "$FILE" | head -5
echo ""

echo "2️⃣ Поиск fetch запросов для генерации аудио:"
echo "----------------------------------------------"
grep -n -A 10 "const generateAudio.*async" "$FILE" | grep -E "fetch|POST|GET" | head -10
echo ""

echo "3️⃣ Полная функция generateAudio (первые 50 строк):"
echo "----------------------------------------------"
awk '/const generateAudio.*async.*\(index/,/^  \}/' "$FILE" | head -50
echo ""

echo "================================================"
echo "🎯 РЕЗУЛЬТАТ"
echo "================================================"
echo ""
echo "Найди строку с fetch('/api/...')  "
echo "Это и будет проблемный API endpoint"
echo ""
