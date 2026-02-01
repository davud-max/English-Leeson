import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const getStripe = async () => {
  const { stripe } = await import('@/lib/stripe')
  return stripe
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const stripe = await getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      // Update purchase status
      const purchase = await prisma.purchase.findFirst({
        where: { stripeSessionId: sessionId },
      })

      if (purchase && purchase.status !== 'COMPLETED') {
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        })

        // Create enrollment
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: purchase.userId,
              courseId: purchase.courseId,
            },
          },
          create: {
            userId: purchase.userId,
            courseId: purchase.courseId,
          },
          update: {},
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified',
        email: session.customer_email,
      })
    }

    return NextResponse.json(
      { error: 'Payment not completed' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error.message },
      { status: 500 }
    )
  }
}
