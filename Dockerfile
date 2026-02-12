FROM node:18-slim

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "start.sh"]
