import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assertAdminKey, getAdminKeyFromHeaders } from '@/lib/admin-key'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type InsertRequest = {
  adminKey?: string
  targetOrder?: number
  title?: string
  description?: string
  duration?: number
  available?: boolean
  sourceFile?: string
  delimiter?: '---'
}

type Slide = {
  id: number
  title: string
  content: string
  emoji: string
  duration: number
}

const CONTENT_ROOT = path.resolve(process.cwd(), 'content', 'lessons')
const MAX_PUBLIC_ORDER = 23
const MAX_SOURCE_BYTES = 2_500_000
const DEFAULT_SLIDE_DURATION_MS = 30_000
const DEFAULT_EMOJI = '📖'

function resolveSourcePath(sourceFile: string): string {
  const candidate = path.resolve(CONTENT_ROOT, sourceFile)
  if (!candidate.startsWith(CONTENT_ROOT + path.sep)) {
    throw new Error('Invalid sourceFile path')
  }
  return candidate
}

function normalizeText(text: string) {
  return text.replace(/\r\n/g, '\n').trim()
}

function isHeading(line: string) {
  const trimmed = line.trim()
  if (!trimmed) return false
  if (trimmed.length > 80) return false
  if (/[.?!:]$/.test(trimmed)) return false
  // avoid single-word noise like "Abstract" is ok, but exclude very short
  return trimmed.length >= 4
}

function chunkParagraphs(paragraphs: string[], targetChars = 900, maxChars = 1500) {
  const slides: string[] = []
  let buf: string[] = []
  let size = 0

  const flush = () => {
    const txt = buf.join('\n\n').trim()
    if (txt) slides.push(txt)
    buf = []
    size = 0
  }

  for (const p of paragraphs) {
    const next = p.trim()
    if (!next) continue

    if (size > 0 && size + next.length > maxChars) {
      flush()
    }

    buf.push(next)
    size += next.length

    if (size >= targetChars) {
      flush()
    }
  }

  flush()
  return slides
}

function splitIntoSlides(text: string, delimiter?: '---'): Slide[] {
  const cleaned = normalizeText(text)
  if (!cleaned) return []

  const parts =
    delimiter === '---'
      ? cleaned.split(/\n\s*---\s*\n/g).map((p) => p.trim()).filter(Boolean)
      : []

  // If no explicit delimiter, auto-split into headings/paragraph chunks.
  const autoParts = (() => {
    const paragraphs = cleaned.split(/\n\s*\n/g).map((p) => p.trim()).filter(Boolean)
    if (paragraphs.length <= 1) return [cleaned]

    const blocks: Array<{ title?: string; paras: string[] }> = []
    let current: { title?: string; paras: string[] } = { paras: [] }

    for (const para of paragraphs) {
      const lines = para.split('\n').map((l) => l.trim()).filter(Boolean)
      if (lines.length === 1 && isHeading(lines[0])) {
        if (current.paras.length) blocks.push(current)
        current = { title: lines[0], paras: [] }
        continue
      }
      current.paras.push(para)
    }
    if (current.paras.length) blocks.push(current)

    const out: Array<{ title?: string; content: string }> = []
    for (const block of blocks) {
      const chunks = chunkParagraphs(block.paras)
      chunks.forEach((chunk, idx) => {
        const heading = block.title ? block.title.trim() : ''
        const title = heading ? (idx === 0 ? heading : `${heading} (cont.)`) : undefined
        out.push({ title, content: chunk })
      })
    }

    return out
  })()

  const finalParts =
    parts.length > 0
      ? parts.map((content) => ({ content }))
      : autoParts

  return finalParts.map((raw: any, idx: number) => {
    const content = typeof raw === 'string' ? raw : String(raw.content || '')
    const title =
      typeof raw === 'string'
        ? `Part ${idx + 1}`
        : (raw.title && String(raw.title).trim()) || `Part ${idx + 1}`

    return {
      id: idx + 1,
      title,
      content: content.trim(),
      emoji: DEFAULT_EMOJI,
      duration: DEFAULT_SLIDE_DURATION_MS,
    }
  }).filter((s) => s.content.length > 0)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as InsertRequest
    const headerAdminKey = getAdminKeyFromHeaders(req.headers)
    assertAdminKey(body.adminKey || headerAdminKey)

    const targetOrder = Number(body.targetOrder)
    if (!Number.isInteger(targetOrder) || targetOrder < 1) {
      return NextResponse.json({ error: 'targetOrder must be a positive integer' }, { status: 400 })
    }

    const sourceFile = typeof body.sourceFile === 'string' ? body.sourceFile.trim() : ''
    if (!sourceFile) {
      return NextResponse.json({ error: 'sourceFile is required' }, { status: 400 })
    }

    const course = await prisma.course.findFirst({ orderBy: { updatedAt: 'desc' } })
    if (!course) {
      return NextResponse.json({ error: 'Course not found. Run seed/sync first.' }, { status: 404 })
    }

    const filePath = resolveSourcePath(sourceFile)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'sourceFile not found', filePath }, { status: 404 })
    }

    const stat = fs.statSync(filePath)
    if (stat.size > MAX_SOURCE_BYTES) {
      return NextResponse.json(
        { error: 'sourceFile too large', maxBytes: MAX_SOURCE_BYTES, size: stat.size },
        { status: 400 }
      )
    }

    const fileText = fs.readFileSync(filePath, 'utf8')
    const slides = splitIntoSlides(fileText, body.delimiter)
    if (slides.length === 0) {
      return NextResponse.json({ error: 'sourceFile is empty or could not be parsed into slides' }, { status: 400 })
    }

    const title =
      typeof body.title === 'string' && body.title.trim()
        ? body.title.trim()
        : 'Contract Sovereignty'
    const description =
      typeof body.description === 'string' && body.description.trim()
        ? body.description.trim()
        : slides[0].content.slice(0, 160)
    const duration = Number.isFinite(Number(body.duration)) ? Math.max(1, Number(body.duration)) : 30
    const available = body.available !== false
    const fullContent = slides.map((s) => s.content).join('\n\n---\n\n')

    const existingAtTarget = await prisma.lesson.findFirst({
      where: { courseId: course.id, order: targetOrder },
      select: { id: true, title: true },
    })
    if (existingAtTarget && existingAtTarget.title.toLowerCase().includes('contract sovereignty')) {
      return NextResponse.json(
        { error: `Lesson already exists at #${targetOrder}: ${existingAtTarget.title}` },
        { status: 409 }
      )
    }

    // Shift lessons in descending order to satisfy @@unique(courseId, order).
    const lessonsToShift = await prisma.lesson.findMany({
      where: { courseId: course.id, order: { gte: targetOrder } },
      orderBy: { order: 'desc' },
      select: { id: true, order: true, title: true },
    })

    const result = await prisma.$transaction(async (tx) => {
      for (const lesson of lessonsToShift) {
        await tx.lesson.update({
          where: { id: lesson.id },
          data: { order: lesson.order + 1 },
        })
      }

      const inserted = await tx.lesson.create({
        data: {
          courseId: course.id,
          order: targetOrder,
          title,
          description,
          duration,
          available,
          published: true,
          content: fullContent,
          slides: slides as any,
          emoji: DEFAULT_EMOJI,
          color: 'from-blue-500 to-indigo-600',
        },
      })

      // Ensure only the first MAX_PUBLIC_ORDER lessons remain published.
      await tx.lesson.updateMany({
        where: {
          courseId: course.id,
          order: { gt: MAX_PUBLIC_ORDER },
        },
        data: { published: false },
      })

      return { inserted }
    })

    return NextResponse.json({
      success: true,
      inserted: { id: result.inserted.id, order: result.inserted.order, title: result.inserted.title },
      shifted: { count: lessonsToShift.length, fromOrder: targetOrder },
      notes: existingAtTarget ? `Shifted lesson #${targetOrder} → #${targetOrder + 1}: ${existingAtTarget.title}` : null,
      source: { sourceFile, filePath, bytes: stat.size },
      slides: { count: slides.length },
    })
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
