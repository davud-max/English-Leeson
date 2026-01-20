# Algorithms of Thinking and Cognition - English Version

A production-ready EdTech course platform built with Next.js, PostgreSQL, and Stripe.

## Features

- ✅ SEO-optimized landing page
- ✅ Stripe payment integration
- ✅ User authentication (NextAuth)
- ✅ PostgreSQL database with Prisma ORM
- ✅ 17 lessons (Lesson 1 fully seeded with content)
- ✅ Progress tracking
- ✅ Event analytics system
- ✅ Admin panel (coming soon)
- ✅ Responsive design
- ✅ Markdown lesson content

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Deployment**: Railway

## Local Development

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use Railway's managed database)

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd thinking-course-en
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/thinking_course"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Get after setting up webhook
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. Generate Prisma client and push schema:
```bash
npm run db:generate
npm run db:push
```

6. Seed the database:
```bash
npm run db:seed
```

This will create:
- Admin user (email: admin@example.com, password: admin123)
- Main course with all 17 lessons
- Lesson 1 with full English content

7. Run development server:
```bash
npm run dev
```

Visit http://localhost:3000

## Deployment to Railway

### Step 1: Prepare GitHub Repository

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect Next.js

### Step 3: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will provision a database and add `DATABASE_URL` to your environment

### Step 4: Configure Environment Variables

In Railway project settings, add these variables:

```
NODE_ENV=production
NEXTAUTH_URL=https://your-app.up.railway.app
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
STRIPE_SECRET_KEY=sk_live_... (or sk_test_ for testing)
STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_)
STRIPE_WEBHOOK_SECRET=whsec_... (configure after deployment)
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
ADMIN_EMAIL=admin@example.com
```

### Step 5: Deploy

1. Railway will automatically build and deploy
2. Wait for deployment to complete
3. Click on the generated URL (e.g., `your-app.up.railway.app`)

### Step 6: Seed Production Database

After first deployment, run seed command in Railway:

1. Go to your Railway project
2. Click on your Next.js service
3. Go to "Settings" → "Deploy"
4. Add a custom build command:
```bash
npm run db:generate && npm run db:push && npm run db:seed && npm run build
```

Or use Railway CLI:
```bash
railway run npm run db:seed
```

### Step 7: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://your-app.up.railway.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`
5. Copy the webhook signing secret
6. Add to Railway environment variables as `STRIPE_WEBHOOK_SECRET`

## Default Admin Access

After seeding:
- **Email**: admin@example.com
- **Password**: admin123

⚠️ **Change this password immediately in production!**

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Landing, checkout pages
│   ├── (auth)/            # Login page
│   ├── (course)/          # Dashboard, lessons (auth required)
│   ├── admin/             # Admin panel
│   └── api/
│       ├── auth/          # NextAuth
│       ├── checkout/      # Stripe checkout
│       ├── webhooks/      # Stripe webhook
│       └── lessons/       # Lesson API
│
├── components/
│   ├── ui/                # Reusable UI components
│   └── course/            # Course-specific components
│
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── stripe.ts          # Stripe client
│   ├── auth.ts            # NextAuth config
│   └── analytics.ts       # Event tracking
│
├── hooks/                 # Custom React hooks
└── styles/                # Global styles

prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed script with Lesson 1
```

## Database Schema

- **User**: Authentication and user data
- **Course**: Course information
- **Lesson**: Individual lessons (Markdown content)
- **Enrollment**: User course access
- **Purchase**: Payment records (linked to Stripe)
- **Progress**: Lesson completion tracking
- **Event**: Analytics and tracking

## Payment Flow

1. User fills checkout form → Creates account
2. Redirects to Stripe Checkout
3. After payment, Stripe webhook triggers
4. Webhook creates Enrollment and updates Purchase
5. User gets automatic access to course

## Testing Payments

Use Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Any future expiry date and CVC

## Analytics Events

The system tracks:
- `page_view`
- `cta_click`
- `checkout_started`
- `checkout_completed`
- `lesson_viewed`
- `lesson_completed`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://... |
| NEXTAUTH_URL | App URL for auth | https://yourapp.com |
| NEXTAUTH_SECRET | Secret for JWT signing | 32-char random string |
| STRIPE_SECRET_KEY | Stripe secret key | sk_test_... or sk_live_... |
| STRIPE_PUBLISHABLE_KEY | Stripe public key | pk_test_... or pk_live_... |
| STRIPE_WEBHOOK_SECRET | Webhook signing secret | whsec_... |
| NEXT_PUBLIC_APP_URL | Public app URL | https://yourapp.com |

## Troubleshooting

### Database connection errors
- Check DATABASE_URL is correct
- Ensure database is accessible from Railway
- Run `npm run db:push` to sync schema

### Stripe webhook not working
- Verify webhook URL is correct
- Check webhook signing secret matches
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### NextAuth errors
- Ensure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches deployment URL
- Verify callback URLs in production

## Support

For issues, please create a GitHub issue or contact support.

## License

Proprietary - All rights reserved
