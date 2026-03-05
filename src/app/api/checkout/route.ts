import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'
export const preferredRegion = ['iad1']

function getAppBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://www.davudx.com'
  const cleaned = raw.trim().replace(/^"+|"+$/g, '').replace(/[\r\n\t]/g, '')
  try {
    const url = new URL(cleaned)
    return url.origin
  } catch {
    return 'https://www.davudx.com'
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check Stripe key first
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured', details: 'STRIPE_SECRET_KEY missing' },
        { status: 500 }
      )
    }

    const session = await getServerSession(authOptions)
    const body = await req.json()
    const { email, name, phone, password } = body

    let user

    // If user is logged in, use their account
    if (session?.user?.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found', details: 'Logged in user not in database' },
          { status: 404 }
        )
      }
    } else {
      // Not logged in - require email and password
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        )
      }

      // Check if user exists
      user = await prisma.user.findUnique({
        where: { email },
      })

      // If user doesn't exist, create one
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await prisma.user.create({
          data: {
            email,
            name: name || null,
            phone: phone || null,
            password: hashedPassword,
          },
        })
      }
    }

    // Get the course
    const course = await prisma.course.findFirst({
      where: { published: true },
      orderBy: { updatedAt: 'desc' },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found', details: 'No published course in database. Run sync-lessons first.' },
        { status: 404 }
      )
    }

    // Check if user already purchased
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
        status: 'COMPLETED',
      },
    })

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You already have access to this course' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    let stripe
    try {
      stripe = getStripe()
    } catch (stripeError: any) {
      return NextResponse.json(
        { error: 'Stripe initialization failed', details: stripeError.message },
        { status: 500 }
      )
    }

    let stripeSession
    try {
      const appBaseUrl = getAppBaseUrl()
      stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: course.currency.toLowerCase(),
              product_data: {
                name: course.title,
                description: course.description.substring(0, 500),
              },
              unit_amount: Math.round(course.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${appBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appBaseUrl}/checkout`,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          courseId: course.id,
        },
      })
    } catch (stripeError: any) {
      console.error('Stripe session creation error:', stripeError)
      return NextResponse.json(
        {
          error: 'Stripe error',
          details: stripeError?.message || 'Unknown Stripe error',
          stripeType: stripeError?.type || null,
          stripeCode: stripeError?.code || null,
          proxyConfigured: Boolean(process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY),
        },
        { status: 500 }
      )
    }

    // Create pending purchase
    await prisma.purchase.create({
      data: {
        userId: user.id,
        courseId: course.id,
        amount: course.price,
        currency: course.currency,
        stripeSessionId: stripeSession.id,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    )
  }
}
