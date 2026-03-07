import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function detectStripeMode(key?: string) {
  const normalized = key?.trim().replace(/^"+|"+$/g, '').replace(/[\r\n\t]/g, '') || ''

  if (!normalized) {
    return { configured: false, mode: 'missing' as const }
  }

  if (normalized.startsWith('sk_live_') || normalized.startsWith('pk_live_')) {
    return { configured: true, mode: 'live' as const }
  }

  if (normalized.startsWith('sk_test_') || normalized.startsWith('pk_test_')) {
    return { configured: true, mode: 'test' as const }
  }

  return { configured: true, mode: 'unknown' as const }
}

export async function GET() {
  const secret = detectStripeMode(process.env.STRIPE_SECRET_KEY)
  const publishable = detectStripeMode(process.env.STRIPE_PUBLISHABLE_KEY)

  return NextResponse.json({
    stripe: {
      secret,
      publishable,
      consistent: secret.mode === publishable.mode,
    },
  })
}
