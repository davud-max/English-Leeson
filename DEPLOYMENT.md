# Quick Deployment Guide to Railway

## Prerequisites
- GitHub account (connected to Railway)
- Stripe account (test or live keys)
- This project pushed to GitHub repository

## Step-by-Step Deployment

### 1. Push to GitHub
```bash
# If not already done
git init
git add .
git commit -m "Initial commit - English course platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Deploy to Railway

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway auto-detects Next.js ✓

### 3. Add PostgreSQL Database

1. In Railway project dashboard, click **"New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Database URL is automatically added to environment ✓

### 4. Set Environment Variables

Click on your Next.js service → **"Variables"** tab:

```env
# Required variables
NEXTAUTH_URL=https://YOUR_APP.up.railway.app
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
NEXT_PUBLIC_APP_URL=https://YOUR_APP.up.railway.app
NODE_ENV=production

# Webhook secret (add after step 6)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

### 5. First Deployment

Railway will automatically:
- Install dependencies
- Build Next.js app
- Deploy to production

Wait ~2-3 minutes for deployment.

### 6. Seed Database

Option A: Via Railway Dashboard
1. Service → Settings → Build Command
2. Add: `npm run db:generate && npm run db:push && npm run db:seed && npm run build`
3. Trigger redeploy

Option B: Via Railway CLI
```bash
railway login
railway link
railway run npm run db:seed
```

This creates:
- Admin user (admin@example.com / admin123)
- Course with 17 lessons
- Lesson 1 with full content

### 7. Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://YOUR_APP.up.railway.app/api/webhooks/stripe`
4. Select event: **checkout.session.completed**
5. Copy **Signing secret**
6. Add to Railway variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy (Railway will auto-redeploy on env change)

### 8. Test the Platform

1. Visit your Railway URL
2. Click **"Get Started"** on landing page
3. Fill checkout form
4. Use test card: **4242 4242 4242 4242**
5. After payment, you should be redirected to dashboard
6. Access to Lesson 1 should be granted automatically

### 9. Admin Access

Login at: `https://YOUR_APP.up.railway.app/login`
- Email: admin@example.com
- Password: admin123

⚠️ **IMPORTANT**: Change admin password immediately!

## Troubleshooting

**Database errors:**
```bash
railway run npx prisma db push
railway run npx prisma generate
```

**Can't access after payment:**
- Check Stripe webhook is configured
- Verify webhook secret in Railway
- Check Railway logs for errors

**Build fails:**
- Ensure all dependencies are in package.json
- Check Railway build logs
- Verify Node.js version compatibility

## Custom Domain (Optional)

1. Railway project → Settings → Domains
2. Click **"Custom Domain"**
3. Add your domain
4. Update DNS records (provided by Railway)
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`

## Monitoring

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, network usage
- **Deployments**: History and rollback capability

## Next Steps

- [ ] Change admin password
- [ ] Add remaining lesson content
- [ ] Configure production Stripe keys
- [ ] Set up custom domain
- [ ] Enable HTTPS (automatic with Railway)
- [ ] Configure email notifications (optional)

---

**Need help?** Check Railway docs: https://docs.railway.app
