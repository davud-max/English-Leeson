#!/usr/bin/env node

/**
 * Fixes lesson order + slide audio mapping after insert/delete drift.
 *
 * What it does:
 * 1) Reindexes lessons to contiguous order 1..N (within each course), preserving current order sorting.
 * 2) Rewrites each slide.audioUrl to /audio/lesson{order}/slide{index}.mp3.
 *
 * Run:
 *   node scripts/fix-lesson-order-and-audio-mapping.js
 *
 * Dry run:
 *   DRY_RUN=1 node scripts/fix-lesson-order-and-audio-mapping.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dryRun = process.env.DRY_RUN === '1';

function normalizeSlides(slides, lessonOrder) {
  if (!Array.isArray(slides)) return slides;

  return slides.map((slide, idx) => {
    const slideNumber = idx + 1;
    const next = slide && typeof slide === 'object' ? { ...slide } : { id: slideNumber };
    next.audioUrl = `/audio/lesson${lessonOrder}/slide${slideNumber}.mp3`;
    if (typeof next.id !== 'number') next.id = slideNumber;
    return next;
  });
}

async function main() {
  const courses = await prisma.course.findMany({ select: { id: true, title: true } });
  if (!courses.length) {
    console.log('No courses found.');
    return;
  }

  for (const course of courses) {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        order: true,
        title: true,
        slides: true,
      },
    });

    console.log(`\nCourse: ${course.title} (${course.id})`);
    console.log(`Lessons: ${lessons.length}`);

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const newOrder = i + 1;
      const newSlides = normalizeSlides(lesson.slides, newOrder);

      const orderChanged = lesson.order !== newOrder;
      const slidesChanged = Array.isArray(lesson.slides)
        ? lesson.slides.some((s, idx) => {
            const expected = `/audio/lesson${newOrder}/slide${idx + 1}.mp3`;
            return !s || typeof s !== 'object' || s.audioUrl !== expected || s.id !== idx + 1;
          })
        : false;

      if (!orderChanged && !slidesChanged) {
        console.log(`  = #${lesson.order} ${lesson.title}`);
        continue;
      }

      console.log(
        `  ${dryRun ? '[DRY]' : '[FIX]'} #${lesson.order} -> #${newOrder} | ${lesson.title}`
      );

      if (!dryRun) {
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            order: newOrder,
            slides: newSlides,
          },
        });
      }
    }
  }

  console.log(`\nDone${dryRun ? ' (dry-run only)' : ''}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
