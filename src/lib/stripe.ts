import Stripe from 'stripe'
import https from 'https'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY not configured')
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
