// Check slides content for lessons 2-4
// Run: DATABASE_URL="postgresql://..." npx tsx scripts/check-slides.ts

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
const AUDIO_DIR = path.join(process.cwd(), 'public/audio')

async function check() {
  const lessons = await prisma.lesson.findMany({
    where: { order: { in: [1, 2, 3, 4, 5] } },
    orderBy: { order: 'asc' },
    select: { id: true, order: true, title: true, slides: true }
  })

  for (const lesson of lessons) {
    const slides = Array.isArray(lesson.slides) ? lesson.slides : []
    
    console.log('='.repeat(100))
    console.log(`LESSON ${lesson.order}: "${lesson.title}" (ID: ${lesson.id})`)
    console.log(`DB slides: ${slides.length}`)
    
    // Audio files
    const orderDir = path.join(AUDIO_DIR, `lesson${lesson.order}`)
    const idDir = path.join(AUDIO_DIR, `lesson-${lesson.id}`)
    
    const orderFiles = fs.existsSync(orderDir) 
      ? fs.readdirSync(orderDir).filter(f => f.endsWith('.mp3')).sort((a,b) => 
          parseInt(a.match(/\d+/)?.[0]||'0') - parseInt(b.match(/\d+/)?.[0]||'0'))
      : []
    const idFiles = fs.existsSync(idDir)
      ? fs.readdirSync(idDir).filter(f => f.endsWith('.mp3')).sort((a,b) => 
          parseInt(a.match(/\d+/)?.[0]||'0') - parseInt(b.match(/\d+/)?.[0]||'0'))
      : []

    console.log(`lesson${lesson.order}/ audio: ${orderFiles.length} files → ${orderFiles.join(', ')}`)
    console.log(`lesson-${lesson.id}/ audio: ${idFiles.length} files → ${idFiles.join(', ')}`)
    
    console.log(`\nSlide details:`)
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i] as any
      const title = s.title || s.emoji || ''
      const contentPreview = (s.content || s.audioText || '').substring(0, 80).replace(/\n/g, ' ')
      const hasOrderAudio = orderFiles.includes(`slide${i+1}.mp3`)
      const hasIdAudio = idFiles.includes(`slide${i+1}.mp3`)
      const audioStatus = hasOrderAudio ? '✅' : '❌'
      
      console.log(`  Slide ${i+1} ${audioStatus} | "${title}" | ${contentPreview}...`)
    }
    
    // Check for extra audio beyond slide count
    const maxSlideNum = Math.max(
      ...orderFiles.map(f => parseInt(f.match(/\d+/)?.[0]||'0')),
      ...idFiles.map(f => parseInt(f.match(/\d+/)?.[0]||'0')),
      0
    )
    if (maxSlideNum > slides.length) {
      console.log(`\n  ⚠ Extra audio files beyond ${slides.length} slides: slide${slides.length+1}→slide${maxSlideNum}`)
    }
    
    console.log()
  }

  await prisma.$disconnect()
}

check().catch(e => { console.error(e); prisma.$disconnect() })
