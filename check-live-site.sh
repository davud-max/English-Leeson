#!/bin/bash

echo "🌐 ПРОВЕРКА LIVE САЙТА - Уроки 21-27"
echo "===================================="
echo ""

# Твой production URL на Railway
SITE_URL="https://english-leeson-production.up.railway.app"

echo "📍 Сайт: $SITE_URL"
echo ""
echo "🔍 Проверка уроков через API..."
echo ""

# Проверяем уроки 21-27 через API
for i in 21 22 23 24 25 26 27; do
  echo -n "Lesson $i: "
  
  # Делаем запрос к API
  response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/lessons/$i")
  
  if [ "$response" = "200" ]; then
    echo "✅ СУЩЕСТВУЕТ (API returns 200)"
  elif [ "$response" = "404" ]; then
    echo "❌ НЕ НАЙДЕН (API returns 404)"
  else
    echo "⚠️  Ошибка $response"
  fi
done

echo ""
echo "================================================"
echo "🎯 РЕЗУЛЬТАТ"
echo "================================================"
echo ""
echo "Если все уроки 404 → они НЕ в БД, нужно добавить"
echo "Если все уроки 200 → проблема в кэше браузера"
echo ""
echo "🌐 Открой эти ссылки в браузере:"
echo ""
echo "   $SITE_URL/lessons/21"
echo "   $SITE_URL/lessons/22"
echo "   $SITE_URL/lessons/23"
echo "   $SITE_URL/lessons/27"
echo ""
echo "И нажми Cmd+Shift+R для hard reload!"
echo ""
