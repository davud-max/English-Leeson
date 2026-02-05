#!/bin/bash

echo "🔍 Проверка статуса Git..."
cd /Users/davudzulumkhanov/thinking-course-en

echo ""
echo "📁 Текущая директория:"
pwd

echo ""
echo "🌿 Текущая ветка:"
git branch --show-current

echo ""
echo "📊 Git статус:"
git status

echo ""
echo "📝 Последние коммиты:"
git log --oneline -5

echo ""
echo "🔗 Удалённые репозитории:"
git remote -v
