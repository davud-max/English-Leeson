#!/bin/bash

echo "🔍 ДИАГНОСТИКА ПРОБЛЕМЫ С УРОКАМИ 21-27"
echo "========================================"
echo ""

cd /Users/davudzulumkhanov/thinking-course-en

echo "1️⃣ Git статус:"
git status --short

echo ""
echo "2️⃣ Последние коммиты:"
git log --oneline -5

echo ""
echo "3️⃣ Локальные изменения vs origin/main:"
git diff origin/main --name-only | head -10

echo ""
echo "4️⃣ Проверка файла page.tsx:"
if git diff origin/main src/app/\(course\)/lessons/\[order\]/page.tsx | head -20; then
  echo "✅ Есть изменения в page.tsx"
else
  echo "❌ Нет изменений в page.tsx"
fi

echo ""
echo "📊 РЕЗУЛЬТАТ:"
echo "-------------"
echo "Если файл НЕ закоммичен → git add + git commit"
echo "Если НЕ запушен → git push"
echo "Если запушен, но Railway не задеплоил → проверь Railway Dashboard"
