import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assertAdminKey, getAdminKeyFromHeaders } from '@/lib/admin-key'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ImportRequest = {
  adminKey?: string
  order?: number
  title?: string
  description?: string
  duration?: number
  available?: boolean
  sourceFile?: string
  sourceUrl?: string
  sourceText?: string
  delimiter?: '---'
}

type Slide = {
  id: number
  title: string
  content: string
  emoji: string
  duration: number
}

const MAX_SOURCE_BYTES = 1_500_000
const DEFAULT_SLIDE_DURATION_MS = 30_000
const DEFAULT_EMOJI = '📖'
const TARGET_SLIDE_CHARS = 900
const MAX_SLIDE_CHARS = 1500
const ALLOWED_SOURCE_URL_HOSTS = new Set(['raw.githubusercontent.com'])

async function loadSourceText(body: ImportRequest) {
  if (typeof body.sourceText === 'string' && body.sourceText.trim()) {
    const txt = body.sourceText
    if (Buffer.byteLength(txt, 'utf8') > MAX_SOURCE_BYTES) {
      throw new Error('sourceText too large')
    }
    return { text: txt, source: { mode: 'inline', bytes: Buffer.byteLength(txt, 'utf8') } as const }
  }

  if (typeof body.sourceUrl === 'string' && body.sourceUrl.trim()) {
    const url = new URL(body.sourceUrl.trim())
    if (url.protocol !== 'https:') throw new Error('sourceUrl must be https')
    if (!ALLOWED_SOURCE_URL_HOSTS.has(url.hostname)) throw new Error('sourceUrl host not allowed')

    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) throw new Error(`sourceUrl fetch failed: ${res.status}`)

    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.byteLength > MAX_SOURCE_BYTES) throw new Error('sourceUrl content too large')
    const text = buf.toString('utf8')
    return { text, source: { mode: 'url', url: url.toString(), bytes: buf.byteLength } as const }
  }

  const sourceFile = typeof body.sourceFile === 'string' ? body.sourceFile.trim() : ''
  if (!sourceFile) throw new Error('sourceFile is required (or provide sourceUrl/sourceText)')

  const filePath = resolveSourcePath(sourceFile)
  if (!fs.existsSync(filePath)) throw new Error('sourceFile not found')

  const stat = fs.statSync(filePath)
  if (stat.size > MAX_SOURCE_BYTES) throw new Error('sourceFile too large')

  const text = fs.readFileSync(filePath, 'utf8')
  return { text, source: { mode: 'file', sourceFile, filePath, bytes: stat.size } as const }
}

function resolveSourcePath(sourceFile: string): string {
  const root = path.resolve(process.cwd(), 'content', 'lessons')
  const candidate = path.resolve(root, sourceFile)

  if (!candidate.startsWith(root + path.sep)) {
    throw new Error('Invalid sourceFile path')
  }

  return candidate
}

function chunkParagraphs(paragraphs: string[]): string[] {
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

    if (size > 0 && size + next.length > MAX_SLIDE_CHARS) {
      flush()
    }

    buf.push(next)
    size += next.length

    if (size >= TARGET_SLIDE_CHARS) {
      flush()
    }
  }

  flush()
  return slides
}

function splitIntoSlides(text: string, delimiter: '---' | undefined): Slide[] {
  const cleaned = text.replace(/\r\n/g, '\n').trim()
  if (!cleaned) return []

  const rawParts =
    delimiter === '---'
      ? cleaned.split(/\n\s*---\s*\n/g).map((p) => p.trim()).filter(Boolean)
      : []

  const parts =
    rawParts.length > 0
      ? rawParts
      : chunkParagraphs(cleaned.split(/\n\s*\n/g))

  return parts
    .map((content, idx) => ({
      id: idx + 1,
      title: `Part ${idx + 1}`,
      content: content.trim(),
      emoji: DEFAULT_EMOJI,
      duration: DEFAULT_SLIDE_DURATION_MS,
    }))
    .filter((s) => s.content.length > 0)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as ImportRequest
    const headerAdminKey = getAdminKeyFromHeaders(req.headers)
    assertAdminKey(body.adminKey || headerAdminKey)

    const order = Number(body.order)
    if (!Number.isInteger(order) || order < 1) {
      return NextResponse.json({ error: 'order must be a positive integer' }, { status: 400 })
    }

    const { text: fileText, source } = await loadSourceText(body)
    const slides = splitIntoSlides(fileText, body.delimiter)
    if (slides.length === 0) {
      return NextResponse.json({ error: 'sourceFile is empty' }, { status: 400 })
    }

    const course = await prisma.course.findFirst({ orderBy: { updatedAt: 'desc' } })
    if (!course) {
      return NextResponse.json({ error: 'Course not found. Run seed/sync first.' }, { status: 404 })
    }

    const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : `Lesson ${order}`
    const description =
      typeof body.description === 'string' && body.description.trim()
        ? body.description.trim()
        : slides[0].content.slice(0, 160)

    const duration = Number.isFinite(Number(body.duration)) ? Math.max(1, Number(body.duration)) : 25
    const available = body.available !== false

    const fullContent = slides.map((s) => s.content).join('\n\n---\n\n')

    const existing = await prisma.lesson.findFirst({
      where: { courseId: course.id, order },
      select: { id: true },
    })

    const lesson = existing
      ? await prisma.lesson.update({
          where: { id: existing.id },
          data: {
            title,
            description,
            duration,
            available,
            published: true,
            content: fullContent,
            slides: slides as any,
          },
        })
      : await prisma.lesson.create({
          data: {
            courseId: course.id,
            order,
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

    return NextResponse.json({
      success: true,
      lesson: { id: lesson.id, order: lesson.order, title: lesson.title },
      source,
      slides: { count: slides.length },
    })
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
