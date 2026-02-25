# Vercel Production Checklist

Use this checklist after each production deploy.

## 1) Vercel Project Settings

- Project linked to `davud-max/English-Leeson`
- Production branch is `main`
- Framework preset is `Next.js`
- Build command is `npm run build`
- Root directory is empty (project root)
- Deploy was created from the latest commit
- For incident recovery, redeploy `Without Build Cache`

## 2) Domain & DNS

- Domain added in Vercel:
  - `davudx.com`
  - `www.davudx.com`
- Cloudflare DNS records:
  - `A @ -> 76.76.21.21` (DNS only during validation)
  - `CNAME www -> cname.vercel-dns.com` (DNS only during validation)
- Remove old Railway records for `@` and `www`

## 3) Environment Variables (Vercel)

Required:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ADMIN_SECRET_KEY`
- `ANTHROPIC_API_KEY`
- `ELEVENLABS_API_KEY`
- `GITHUB_TOKEN`
- `RESEND_API_KEY`
- `EMAIL_FROM`

Optional/legacy (only if used by current flows):

- `GOOGLE_CLOUD_TTS_API_KEY`
- `DEV_BYPASS_AUTH`
- `RAILWAY_API_TOKEN`
- `RAILWAY_PROJECT_ID`
- `RAILWAY_SERVICE_ID`

## 4) Post-Deploy Smoke Tests

Public routes:

- `/`
- `/lessons`
- `/lessons/2`
- `/lessons/3`
- `/lessons/4`
- `/checkout`

Auth/admin routes:

- `/login`
- `/admin/login`
- `/admin/lesson-editor`

API checks:

- `GET /api/lessons` returns `200`
- Stripe webhook endpoint is configured and healthy

Feature checks:

- Lesson slide text matches its audio for lessons 2-4
- Background music toggle works (on/off)
- Translation from Russian to English works in admin lesson editor

## 5) Stripe/Email Verification

- Test checkout session can be created
- Payment verification endpoint works
- Webhook events are received in Stripe dashboard
- Purchase success email sends successfully (if email is enabled)

## 6) Rollback Procedure

If production is broken:

1. Open Vercel Deployments
2. Pick last known good `Ready` deployment
3. Promote or redeploy that commit
4. If issue persists, redeploy without build cache
5. Record incident cause and commit hash in project notes

## 7) Release Record Template

Copy this block for each release:

```txt
Release commit:
Deployment URL:
Time (UTC):
Schema/env changes:
Smoke tests passed:
Known issues:
Rollback target:
```
