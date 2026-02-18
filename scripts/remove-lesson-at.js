#!/usr/bin/env node

/**
 * Remove a lesson at specific order without audio drift.
 *
 * What it does:
 * 1) Delete DB lesson at target order (within one course).
 * 2) Shift DB lesson orders > target by -1.
 * 3) Remove filesystem audio folder public/audio/lesson{target}
 * 4) Shift audio folders down: lesson{target+1} -> lesson{target}, ...
 * 5) Remove question audio folder public/audio/questions/lesson{target}
 * 6) Shift question folders down similarly.
 *
 * Usage:
 *   node scripts/remove-lesson-at.js <order>
 *   node scripts/remove-lesson-at.js <order> --dry-run
 *   node scripts/remove-lesson-at.js <order> --course <courseId>
 *   node scripts/remove-lesson-at.js <order> --no-db
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function parseArgs(argv) {
  const args = argv.slice(2);
  if (!args.length) throw new Error('Missing <order>. Example: node scripts/remove-lesson-at.js 5');

  const order = Number(args[0]);
  if (!Number.isInteger(order) || order < 1) {
    throw new Error(`Invalid order "${args[0]}". Must be integer >= 1.`);
  }

  const flags = {
    order,
    dryRun: args.includes('--dry-run'),
    noDb: args.includes('--no-db'),
    courseId: null,
  };

  const courseIdx = args.indexOf('--course');
  if (courseIdx >= 0) {
    flags.courseId = args[courseIdx + 1] || null;
    if (!flags.courseId) throw new Error('--course requires value');
  }

  return flags;
}

function exists(p) {
  return fs.existsSync(p);
}

function removeDirSafe(p, dryRun) {
  if (!exists(p)) return;
  if (dryRun) {
    console.log(`[DRY] rm -rf ${p}`);
    return;
  }
  fs.rmSync(p, { recursive: true, force: true });
}

function renameSafe(from, to, dryRun) {
  if (!exists(from)) return;
  if (dryRun) {
    console.log(`[DRY] mv ${from} -> ${to}`);
    return;
  }
  fs.renameSync(from, to);
}

function findMaxOrderFolder(baseDir, prefixRegex) {
  if (!exists(baseDir)) return 0;
  const names = fs.readdirSync(baseDir);
  let max = 0;
  for (const name of names) {
    const m = prefixRegex.exec(name);
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isInteger(n) && n > max) max = n;
  }
  return max;
}

function shiftOrderFoldersDown(baseDir, targetOrder, dryRun) {
  const max = findMaxOrderFolder(baseDir, /^lesson(\d+)$/);
  if (max <= targetOrder) return;

  for (let n = targetOrder + 1; n <= max; n++) {
    const from = path.join(baseDir, `lesson${n}`);
    const to = path.join(baseDir, `lesson${n - 1}`);
    renameSafe(from, to, dryRun);
  }
}

async function resolveCourseId(inputCourseId) {
  if (inputCourseId) return inputCourseId;

  const courses = await prisma.course.findMany({ select: { id: true, title: true } });
  if (!courses.length) throw new Error('No courses found in DB');
  if (courses.length > 1) {
    throw new Error(`Multiple courses found. Pass --course <id>. IDs: ${courses.map((c) => `${c.id}(${c.title})`).join(', ')}`);
  }
  return courses[0].id;
}

async function removeFromDbAndShift(courseId, order, dryRun) {
  const target = await prisma.lesson.findFirst({
    where: { courseId, order },
    select: { id: true, order: true, title: true },
  });

  if (!target) {
    console.log(`DB: no lesson found at order #${order}; skipping delete/shift.`);
    return;
  }

  const lessonsToShift = await prisma.lesson.findMany({
    where: { courseId, order: { gt: order } },
    orderBy: { order: 'asc' },
    select: { id: true, order: true, title: true },
  });

  console.log(`DB: delete #${target.order} | ${target.title}`);
  console.log(`DB: lessons to shift down: ${lessonsToShift.length}`);
  lessonsToShift.forEach((l) => console.log(`  ${dryRun ? '[DRY]' : '[SHIFT]'} #${l.order} -> #${l.order - 1} | ${l.title}`));

  if (dryRun) return;

  await prisma.$transaction(async (tx) => {
    await tx.lesson.delete({ where: { id: target.id } });
    for (const l of lessonsToShift) {
      await tx.lesson.update({
        where: { id: l.id },
        data: { order: l.order - 1 },
      });
    }
  });

  console.log(`DB: removed lesson #${order} and shifted following lessons.`);
}

async function main() {
  const { order, dryRun, noDb, courseId } = parseArgs(process.argv);

  const root = path.resolve(__dirname, '..');
  const audioRoot = path.join(root, 'public', 'audio');
  const lessonAudioRoot = audioRoot;
  const questionAudioRoot = path.join(audioRoot, 'questions');

  console.log(`Remove lesson at order #${order}`);
  console.log(`Mode: ${dryRun ? 'DRY-RUN' : 'APPLY'}`);

  if (!noDb) {
    const resolvedCourseId = await resolveCourseId(courseId);
    await removeFromDbAndShift(resolvedCourseId, order, dryRun);
  } else {
    console.log('DB step skipped (--no-db)');
  }

  // Remove target lesson audio folder, then shift down.
  removeDirSafe(path.join(lessonAudioRoot, `lesson${order}`), dryRun);
  shiftOrderFoldersDown(lessonAudioRoot, order, dryRun);

  // Remove target question folder, then shift down.
  removeDirSafe(path.join(questionAudioRoot, `lesson${order}`), dryRun);
  shiftOrderFoldersDown(questionAudioRoot, order, dryRun);

  console.log('Done.');
  console.log('Next: verify lesson-to-audio mapping on lessons around the removed index.');
}

main()
  .catch((err) => {
    console.error(`ERROR: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
