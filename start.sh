#!/bin/bash

# Устанавливаем переменные окружения
export NODE_ENV=production

# Выполняем миграцию базы данных
echo "Running database migrations..."
npx prisma migrate deploy --skip-generate

# Запускаем приложение на порту Railway
echo "Starting application on port ${PORT:-3000}..."
exec npx next start -p ${PORT:-3000}