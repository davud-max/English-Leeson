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

# Копируем static и public в standalone (нужно для standalone output)
RUN cp -r .next/static .next/standalone/.next/static || true
RUN cp -r public .next/standalone/public || true

# Копируем prisma и start.sh в standalone
RUN cp -r prisma .next/standalone/prisma || true
RUN cp start.sh .next/standalone/start.sh || true
RUN cp -r node_modules/.prisma .next/standalone/node_modules/.prisma || true
RUN cp -r node_modules/@prisma .next/standalone/node_modules/@prisma || true

# Экспортируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["sh", "start.sh"]
