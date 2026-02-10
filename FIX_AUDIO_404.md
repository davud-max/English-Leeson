# РЕШЕНИЕ: Ошибка 404 при озвучивании в админке

## 🔍 Проблема

В админке при озвучивании текста слайда возникает ошибка **404 Not Found** на запросе:
```
POST /api/admin/generate-audio
```

## ✅ Диагностика

Файл **СУЩЕСТВУЕТ** по пути:
```
/src/app/api/admin/generate-audio/route.ts
```

Код корректный, есть `export async function POST`.

## 🎯 Причины ошибки 404

### 1. Файл не задеплоен на Railway
Изменения есть локально, но не запушены на GitHub/Railway.

### 2. Next.js не видит route.ts
Build cache или ошибка компиляции.

### 3. Проблема с путями в Next.js 14
App Router требует строгую структуру папок.

---

## ✅ РЕШЕНИЕ

### Шаг 1: Проверь Git статус

```bash
cd /Users/davudzulumkhanov/thinking-course-en

git status
```

Если файл **modified** или **untracked**:

```bash
git add src/app/api/admin/generate-audio/route.ts
git commit -m "fix: ensure generate-audio API is deployed"
git push origin main
```

### Шаг 2: Проверь структуру файла

Открой `/src/app/api/admin/generate-audio/route.ts` и убедись:

1. ✅ Файл называется **route.ts** (не route.tsx, не index.ts)
2. ✅ Экспорт функции: `export async function POST(request: Request)`
3. ✅ Нет синтаксических ошибок

### Шаг 3: Очисти Next.js cache

На **локале**:
```bash
rm -rf .next
npm run build
npm run dev
```

На **Railway**:
Railway автоматически пересобирает при push, но можно:
1. Railway Dashboard → твой проект
2. Settings → Redeploy
3. Или:
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

### Шаг 4: Проверь деплой Railway

1. Открой Railway Dashboard
2. Найди свой проект
3. Проверь **Deploy Logs**
4. Ищи ошибки компиляции:
   ```
   Error: ...
   BUILD FAILED
   ```

Если есть ошибки → исправь их и push снова.

### Шаг 5: Проверь переменные окружения

В `/src/app/api/admin/generate-audio/route.ts` используется:

```typescript
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_...';
```

На **Railway**:
1. Settings → Variables
2. Убедись, что `ELEVENLABS_API_KEY` установлен

Если не установлен → добавь:
```
ELEVENLABS_API_KEY=sk_24708aff82ec3e2fe533c19311a9a159326917faabf53274
```

---

## 🧪 ТЕСТИРОВАНИЕ

После деплоя проверь API напрямую через **curl**:

```bash
curl -X POST https://english-leeson-production.up.railway.app/api/admin/generate-audio \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world test",
    "voiceId": "TxGEqnHWrfWFTfGW9XjX"
  }'
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "audioUrl": "data:audio/mpeg;base64,...",
  "audioBase64": "...",
  "textLength": 16
}
```

**Если 404:**
- API не задеплоен
- Проверь Deploy Logs на Railway

**Если 500:**
- API работает, но ошибка в коде
- Проверь переменные окружения

---

## 📋 CHECKLIST

Выполни по порядку:

- [ ] 1. `git status` - проверь, закоммичен ли файл
- [ ] 2. `git push origin main` - если нет, push
- [ ] 3. Подожди деплой Railway (2-3 мин)
- [ ] 4. Проверь Deploy Logs на Railway
- [ ] 5. Протестируй через curl
- [ ] 6. Проверь в админке

---

## 🚨 БЫСТРОЕ РЕШЕНИЕ

Если нет времени разбираться:

```bash
cd /Users/davudzulumkhanov/thinking-course-en

# 1. Убедись что файл есть
ls -la src/app/api/admin/generate-audio/route.ts

# 2. Принудительный коммит
git add .
git commit -m "fix: ensure generate-audio API endpoint exists"
git push origin main

# 3. Подожди 2-3 минуты

# 4. Проверь
curl -X POST https://english-leeson-production.up.railway.app/api/admin/generate-audio \
  -H "Content-Type: application/json" \
  -d '{"text":"test","voiceId":"TxGEqnHWrfWFTfGW9XjX"}'
```

---

## 💡 ДОПОЛНИТЕЛЬНО

Если проблема сохраняется:

### Проверь App Router syntax

В Next.js 14 App Router файлы API должны:
- Быть в папке `/app/api/...`
- Называться `route.ts` или `route.js`
- Экспортировать именованные функции: GET, POST, PUT, DELETE и т.д.

### Проверь middleware

Если есть middleware, убедись что он не блокирует `/api/admin/*`:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Проверь, не блокируется ли /api/admin/generate-audio
}
```

### Проверь next.config.js

```javascript
// next.config.js
module.exports = {
  // Убедись что нет rewrites которые конфликтуют
}
```

---

**Запускай решение по шагам и пиши результат!** 🚀
