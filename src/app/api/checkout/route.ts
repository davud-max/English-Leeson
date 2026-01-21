import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Lazy load stripe to avoid build errors
const getStripe = async () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required')
  }
  const { stripe } = await import('@/lib/stripe')
  return stripe
}

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
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

    // Get the course
    const course = await prisma.course.findFirst({
      where: { published: true },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
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
    const stripe = await getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: course.currency.toLowerCase(),
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.round(course.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      customer_email: email,
      metadata: {
        userId: user.id,
        courseId: course.id,
      },
    })

    // Create pending purchase
    await prisma.purchase.create({
      data: {
        userId: user.id,
        courseId: course.id,
        amount: course.price,
        currency: course.currency,
        stripeSessionId: session.id,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
