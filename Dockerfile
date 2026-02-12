# Используем официальный образ Node.js
FROM node:18-slim

# Устанавливаем зависимости для Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --legacy-peer-deps

# Копируем остальные файлы
COPY . .

# Генерируем Prisma клиента
RUN npx prisma generate

# Собираем приложение
RUN npm run build

# Экспортируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["sh", "start.sh"]