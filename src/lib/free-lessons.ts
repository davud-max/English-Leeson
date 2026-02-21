import { prisma } from '@/lib/prisma'

const CONFIG_KEY = 'CONFIG_FREE_LESSONS'

/** Returns array of lesson order numbers that are free */
export async function getFreeLessons(): Promise<number[]> {
  try {
    const setting = await prisma.event.findFirst({
      where: { eventType: CONFIG_KEY },
      orderBy: { timestamp: 'desc' },
    })

    if (setting?.metadata) {
      const lessons = (setting.metadata as any).lessons
      if (Array.isArray(lessons)) return lessons
    }
  } catch (e) {
    console.error('getFreeLessons error:', e)
  }
  
  // Default: lesson 1 is free
  return [1]
}
