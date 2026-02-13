FROM node:18-slim

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV CACHE_BUST=2026-02-13-v3

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "echo '=== DB SYNC ===' && npx prisma db push --skip-generate || true && echo '=== STARTING ===' && exec npx next start -p ${PORT:-3000} -H 0.0.0.0"]
