#!/bin/bash

echo "🔍 ДИАГНОСТИКА: API generate-audio ошибка 404"
echo "=============================================="
echo ""

cd /Users/davudzulumkhanov/thinking-course-en

# 1. Проверяем существование файла
echo "1️⃣ Проверка файла:"
if [ -f "src/app/api/admin/generate-audio/route.ts" ]; then
  echo "   ✅ Файл route.ts существует"
  echo "   Размер: $(wc -c < src/app/api/admin/generate-audio/route.ts) bytes"
else
  echo "   ❌ Файл route.ts НЕ НАЙДЕН!"
  exit 1
fi

echo ""

# 2. Проверяем синтаксис (базово)
echo "2️⃣ Проверка синтаксиса:"
if grep -q "export async function POST" src/app/api/admin/generate-audio/route.ts; then
  echo "   ✅ Экспорт POST функции найден"
else
  echo "   ❌ Экспорт POST функции НЕ НАЙДЕН!"
fi

echo ""

# 3. Git статус
echo "3️⃣ Git статус:"
if git diff --quiet src/app/api/admin/generate-audio/route.ts; then
  echo "   ✅ Файл закоммичен"
else
  echo "   ⚠️  Файл изменён локально (не закоммичен)"
  echo ""
  git diff src/app/api/admin/generate-audio/route.ts | head -20
fi

echo ""

# 4. Проверяем синхронизацию с origin
echo "4️⃣ Синхронизация с GitHub:"
git fetch origin main 2>/dev/null
if git diff --quiet origin/main src/app/api/admin/generate-audio/route.ts; then
  echo "   ✅ Файл синхронизирован с origin/main"
else
  echo "   ⚠️  Локальная версия отличается от origin/main"
fi

echo ""

# 5. Тестируем API на production
echo "5️⃣ Тест production API:"
echo "   Отправляю запрос на Railway..."

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  https://english-leeson-production.up.railway.app/api/admin/generate-audio \
  -H "Content-Type: application/json" \
  -d '{"text":"test","voiceId":"TxGEqnHWrfWFTfGW9XjX"}')

if [ "$response" = "200" ]; then
  echo "   ✅ API работает! (200 OK)"
elif [ "$response" = "404" ]; then
  echo "   ❌ API не найден! (404 NOT FOUND)"
  echo "   Причина: файл не задеплоен на Railway"
elif [ "$response" = "500" ]; then
  echo "   ⚠️  API найден, но ошибка выполнения (500)"
  echo "   Причина: проблема в коде или env переменных"
else
  echo "   ⚠️  Неожиданный ответ: $response"
fi

echo ""
echo "================================================"
echo "🎯 РЕЗУЛЬТАТ ДИАГНОСТИКИ"
echo "================================================"
echo ""

if [ "$response" = "404" ]; then
  echo "❌ ПРОБЛЕМА: API endpoint не найден на production"
  echo ""
  echo "РЕШЕНИЕ:"
  echo "  1. git add src/app/api/admin/generate-audio/route.ts"
  echo "  2. git commit -m 'fix: add generate-audio API'"
  echo "  3. git push origin main"
  echo "  4. Подожди 2-3 минуты"
  echo "  5. Запусти этот скрипт снова"
elif [ "$response" = "200" ]; then
  echo "✅ ВСЁ РАБОТАЕТ!"
  echo ""
  echo "API доступен на production."
  echo "Если в админке всё равно 404, очисти кэш браузера (Cmd+Shift+R)"
else
  echo "⚠️  ПРОВЕРЬ:"
  echo "  1. Railway Deploy Logs"
  echo "  2. Переменные окружения ELEVENLABS_API_KEY"
  echo "  3. Build errors в логах"
fi

echo ""
