#!/bin/bash

# Устанавливаем переменные окружения
export NODE_ENV=production
export HOSTNAME=0.0.0.0

# Выполняем миграцию базы данных
echo "Running database migrations..."
npx prisma migrate deploy --skip-generate

# Запускаем приложение на порту Railway
echo "Starting application on port ${PORT:-3000}..."
exec node .next/standalone/server.js