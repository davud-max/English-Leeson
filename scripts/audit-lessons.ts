// Full audit: DB lessons ↔ audio folders ↔ slides
// Run: DATABASE_URL="postgresql://..." npx tsx scripts/audit-lessons.ts

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
const AUDIO_DIR = path.join(process.cwd(), 'public/audio')

function getAudioInfo(dirPath: string) {
  if (!fs.existsSync(dirPath)) return null
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mp3'))
  const nums = files.map(f => parseInt(f.match(/\d+/)?.[0] || '0')).sort((a, b) => a - b)
  return { count: files.length, nums, max: Math.max(0, ...nums) }
}

async function audit() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, order: true, title: true, slides: true, published: true, available: true }
  })

  console.log('='.repeat(100))
  console.log('FULL LESSON ↔ AUDIO ↔ SLIDES AUDIT')
  console.log('='.repeat(100))
  console.log(`DB lessons: ${lessons.length}\n`)

  const issues: string[] = []
  const matchedDirs = new Set<string>()

  for (const lesson of lessons) {
    const slides = Array.isArray(lesson.slides) ? lesson.slides : []
    const slideCount = slides.length

    const orderDir = `lesson${lesson.order}`
    const idDir = `lesson-${lesson.id}`

    const orderPath = path.join(AUDIO_DIR, orderDir)
    const idPath = path.join(AUDIO_DIR, idDir)

    const orderAudio = getAudioInfo(orderPath)
    const idAudio = getAudioInfo(idPath)

    if (orderAudio) matchedDirs.add(orderDir)
    if (idAudio) matchedDirs.add(idDir)

    const problems: string[] = []

    // Primary audio source (API sets audioUrl to ID-based for DB lessons)
    const primaryAudio = idAudio || orderAudio
    const primaryDir = idAudio ? idDir : orderAudio ? orderDir : null

    if (!orderAudio && !idAudio) {
      problems.push('NO AUDIO FOLDER (neither by order nor by ID)')
    }

    if (orderAudio && idAudio) {
      if (orderAudio.count !== idAudio.count) {
        problems.push(`DUPLICATE & DIFFERENT: ${orderDir}/ has ${orderAudio.count}, ${idDir}/ has ${idAudio.count}`)
      } else {
        problems.push(`DUPLICATE (same count): both ${orderDir}/ and ${idDir}/ exist (${orderAudio.count} files)`)
      }
    }

    if (slideCount === 0) {
      problems.push('NO SLIDES in DB — uses SLIDES_CONFIG fallback')
    }

    if (primaryAudio && slideCount > 0 && primaryAudio.count !== slideCount) {
      problems.push(`SLIDE/AUDIO MISMATCH: ${slideCount} slides vs ${primaryAudio.count} audio in ${primaryDir}/`)
    }

    if (primaryAudio && slideCount > 0) {
      const expected = Array.from({length: slideCount}, (_, i) => i + 1)
      const missing = expected.filter(n => !primaryAudio.nums.includes(n))
      const extra = primaryAudio.nums.filter(n => n > slideCount)
      if (missing.length > 0) problems.push(`Missing: ${missing.map(n => `slide${n}`).join(', ')}`)
      if (extra.length > 0) problems.push(`Extra beyond ${slideCount}: ${extra.map(n => `slide${n}`).join(', ')}`)
    }

    // API maps DB lessons to: github/lesson-{id}/slide{n}.mp3
    // If ID folder doesn't exist but order folder does = audio won't load on first try
    if (!idAudio && orderAudio) {
      problems.push(`⚡ API will try lesson-${lesson.id}/ first (doesn't exist!) → falls back to ${orderDir}/`)
    }

    const status = problems.length === 0 ? '✅' : (problems.some(p => p.includes('MISMATCH') || p.includes('NO AUDIO')) ? '❌' : '⚠️')
    
    console.log(`${status} Lesson ${lesson.order} | ID: ${lesson.id}`)
    console.log(`   "${lesson.title}"`)
    console.log(`   DB slides: ${slideCount} | ${idDir}/: ${idAudio?.count ?? 'NONE'} | ${orderDir}/: ${orderAudio?.count ?? 'NONE'}`)
    
    for (const p of problems) {
      console.log(`   ⚠ ${p}`)
      issues.push(`L${lesson.order}: ${p}`)
    }
    console.log()
  }

  // Orphan dirs
  const allDirs = fs.readdirSync(AUDIO_DIR)
    .filter(d => fs.statSync(path.join(AUDIO_DIR, d)).isDirectory() && d.startsWith('lesson'))
    .filter(d => !['lessons', 'background', 'questions'].includes(d) && !d.includes('_with_bg'))

  const orphans = allDirs.filter(d => !matchedDirs.has(d))
  if (orphans.length > 0) {
    console.log('='.repeat(100))
    console.log('ORPHAN FOLDERS')
    console.log('='.repeat(100))
    for (const d of orphans) {
      const info = getAudioInfo(path.join(AUDIO_DIR, d))!
      console.log(`  🗑 ${d}/ (${info.count} files)`)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(100))
  console.log(`SUMMARY: ${issues.length} issues`)
  console.log('='.repeat(100))
  for (const i of issues) console.log(`  • ${i}`)

  await prisma.$disconnect()
}

audit().catch(e => { console.error(e); prisma.$disconnect() })
