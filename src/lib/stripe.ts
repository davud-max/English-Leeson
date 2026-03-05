import Stripe from 'stripe'
import https from 'https'

let stripeClient: Stripe | null = null

function normalizeStripeKey(raw: string | undefined): string {
  if (!raw) return ''
  // Handle values copied with quotes/newlines/spaces from dashboards or .env files.
  return raw
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/[\r\n\t]/g, '')
}

export function getStripe(): Stripe {
  const stripeSecretKey = normalizeStripeKey(process.env.STRIPE_SECRET_KEY)
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY not configured')
  }
  if (!stripeSecretKey.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY has invalid format')
  }

  if (stripeClient) return stripeClient

  const httpsAgent = new https.Agent({
    keepAlive: true,
    family: 4,
  })

  stripeClient = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
    typescript: true,
    maxNetworkRetries: 2,
    timeout: 20_000,
    httpAgent: httpsAgent,
  })

  return stripeClient
}
