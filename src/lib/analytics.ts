import { prisma } from './prisma'

export type EventType =
  | 'page_view'
  | 'cta_click'
  | 'checkout_started'
  | 'checkout_completed'
  | 'lesson_viewed'
  | 'lesson_completed'

interface TrackEventParams {
  userId?: string
  sessionId?: string
  eventType: EventType
  metadata?: Record<string, any>
}

export async function trackEvent({
  userId,
  sessionId,
  eventType,
  metadata,
}: TrackEventParams) {
  try {
    await prisma.event.create({
      data: {
        userId,
        sessionId,
        eventType,
        metadata: metadata || {},
      },
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

export async function getAnalytics(startDate?: Date, endDate?: Date) {
  const where = {
    timestamp: {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    },
  }

  const [
    pageViews,
    ctaClicks,
    checkoutStarts,
    checkoutCompletes,
    lessonViews,
    lessonCompletes,
  ] = await Promise.all([
    prisma.event.count({ where: { ...where, eventType: 'page_view' } }),
    prisma.event.count({ where: { ...where, eventType: 'cta_click' } }),
    prisma.event.count({ where: { ...where, eventType: 'checkout_started' } }),
    prisma.event.count({ where: { ...where, eventType: 'checkout_completed' } }),
    prisma.event.count({ where: { ...where, eventType: 'lesson_viewed' } }),
    prisma.event.count({ where: { ...where, eventType: 'lesson_completed' } }),
  ])

  return {
    funnel: {
      pageViews,
      ctaClicks,
      checkoutStarts,
      checkoutCompletes,
      conversionRate: pageViews > 0 ? (checkoutCompletes / pageViews) * 100 : 0,
    },
    learning: {
      lessonViews,
      lessonCompletes,
      completionRate: lessonViews > 0 ? (lessonCompletes / lessonViews) * 100 : 0,
    },
  }
}
