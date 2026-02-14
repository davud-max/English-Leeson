import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { sendPurchaseSuccessEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const { userId, courseId } = session.metadata || {}

      if (!userId || !courseId) {
        throw new Error('Missing metadata')
      }

      // Update purchase status
      await prisma.purchase.updateMany({
        where: {
          stripeSessionId: session.id,
          userId,
          courseId,
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      })

      // Create enrollment
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        create: {
          userId,
          courseId,
        },
        update: {},
      })

      // Track event
      await prisma.event.create({
        data: {
          userId,
          sessionId: session.id,
          eventType: 'checkout_completed',
          metadata: {
            courseId,
            amount: session.amount_total ? session.amount_total / 100 : 0,
          },
        },
      })

      const [user, course] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        }),
        prisma.course.findUnique({
          where: { id: courseId },
          select: { title: true },
        }),
      ])

      if (user?.email && course?.title) {
        try {
          await sendPurchaseSuccessEmail({
            to: user.email,
            courseTitle: course.title,
            amountUsd: session.amount_total ? session.amount_total / 100 : undefined,
          })
        } catch (emailError) {
          console.error('Purchase email error:', emailError)
        }
      }

      console.log('Successfully processed checkout for user:', userId)
    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json(
        { error: 'Webhook handler failed' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
