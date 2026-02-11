#!/bin/bash

# Устанавливаем переменные окружения
export NODE_ENV=production

# Выполняем миграцию базы данных
echo "Running database migrations..."
npx prisma migrate deploy --skip-generate

# Запускаем приложение
echo "Starting application..."
exec npm start