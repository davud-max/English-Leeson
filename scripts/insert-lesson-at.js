#!/usr/bin/env node

/**
 * Insert a lesson at specific order without audio drift.
 *
 * What it does:
 * 1) Shift DB lesson orders >= target by +1 (within one course).
 * 2) Create a new placeholder lesson at target order.
 * 3) Shift filesystem audio folders: public/audio/lessonN -> lessonN+1
 * 4) Shift question audio folders: public/audio/questions/lessonN -> lessonN+1
 * 5) Shift question JSON files: public/data/questions/lessonN.json -> lessonN+1.json
 * 6) Create empty folders/files for the new lesson.
 *
 * Usage:
 *   node scripts/insert-lesson-at.js <order>
 *   node scripts/insert-lesson-at.js <order> --dry-run
 *   node scripts/insert-lesson-at.js <order> --course <courseId>
 *   node scripts/insert-lesson-at.js <order> --no-db
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function parseArgs(argv) {
  const args = argv.slice(2);
  if (!args.length) throw new Error('Missing <order>. Example: node scripts/insert-lesson-at.js 5');

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

function ensureDir(p, dryRun) {
  if (dryRun) {
    console.log(`[DRY] mkdir -p ${p}`);
    return;
  }
  fs.mkdirSync(p, { recursive: true });
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

function shiftOrderFolders(baseDir, targetOrder, dryRun) {
  const max = findMaxOrderFolder(baseDir, /^lesson(\d+)$/);
  if (max < targetOrder) return;

  for (let n = max; n >= targetOrder; n--) {
    const from = path.join(baseDir, `lesson${n}`);
    const to = path.join(baseDir, `lesson${n + 1}`);
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

async function shiftDbAndCreateLesson(courseId, order, dryRun) {
  const lessonsToShift = await prisma.lesson.findMany({
    where: { courseId, order: { gte: order } },
    orderBy: { order: 'desc' },
    select: { id: true, order: true, title: true },
  });

  console.log(`DB: lessons to shift: ${lessonsToShift.length}`);
  lessonsToShift.forEach((l) => console.log(`  ${dryRun ? '[DRY]' : '[SHIFT]'} #${l.order} -> #${l.order + 1} | ${l.title}`));

  const placeholder = {
    courseId,
    order,
    title: `New Lesson ${order}`,
    description: 'New lesson description',
    content: '',
    duration: 25,
    published: false,
    emoji: '📖',
    color: 'from-blue-500 to-indigo-600',
    available: false,
    slides: [],
  };

  if (dryRun) {
    console.log(`[DRY] create lesson #${order}: ${placeholder.title}`);
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const l of lessonsToShift) {
      await tx.lesson.update({
        where: { id: l.id },
        data: { order: l.order + 1 },
      });
    }

    await tx.lesson.create({ data: placeholder });
  });

  console.log(`DB: created placeholder lesson at order #${order}`);
}

function shiftQuestionJson(rootDir, targetOrder, dryRun) {
  if (!exists(rootDir)) return;
  const names = fs.readdirSync(rootDir);
  let max = 0;
  for (const name of names) {
    const m = /^lesson(\d+)\.json$/.exec(name);
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isInteger(n) && n > max) max = n;
  }
  if (max < targetOrder) return;

  for (let n = max; n >= targetOrder; n--) {
    const from = path.join(rootDir, `lesson${n}.json`);
    const to = path.join(rootDir, `lesson${n + 1}.json`);
    if (!exists(from)) continue;
    renameSafe(from, to, dryRun);
  }

  const createdPath = path.join(rootDir, `lesson${targetOrder}.json`);
  if (dryRun) {
    console.log(`[DRY] write ${createdPath}`);
    return;
  }

  if (!exists(createdPath)) {
    fs.writeFileSync(
      createdPath,
      JSON.stringify({ lessonId: targetOrder, lessonTitle: '', generatedAt: '', questions: [] }, null, 2) + '\n',
      'utf8'
    );
  }

  // Update lessonId fields for shifted files >= targetOrder+1.
  const afterNames = fs.readdirSync(rootDir);
  for (const name of afterNames) {
    const m = /^lesson(\d+)\.json$/.exec(name);
    if (!m) continue;
    const n = Number(m[1]);
    if (!Number.isInteger(n) || n < targetOrder + 1) continue;
    const filePath = path.join(rootDir, name);
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);
      data.lessonId = n;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    } catch (e) {
      console.warn(`WARN: failed to update ${filePath}: ${e.message || e}`);
    }
  }
}

async function main() {
  const { order, dryRun, noDb, courseId } = parseArgs(process.argv);

  const root = path.resolve(__dirname, '..');
  const audioRoot = path.join(root, 'public', 'audio');
  const lessonAudioRoot = audioRoot;
  const questionAudioRoot = path.join(audioRoot, 'questions');
  const questionJsonRoot = path.join(root, 'public', 'data', 'questions');

  console.log(`Insert lesson at order #${order}`);
  console.log(`Mode: ${dryRun ? 'DRY-RUN' : 'APPLY'}`);

  if (!noDb) {
    const resolvedCourseId = await resolveCourseId(courseId);
    await shiftDbAndCreateLesson(resolvedCourseId, order, dryRun);
  } else {
    console.log('DB step skipped (--no-db)');
  }

  // Shift order-based lesson audio folders.
  shiftOrderFolders(lessonAudioRoot, order, dryRun);
  ensureDir(path.join(lessonAudioRoot, `lesson${order}`), dryRun);

  // Shift question audio folders.
  shiftOrderFolders(questionAudioRoot, order, dryRun);
  ensureDir(path.join(questionAudioRoot, `lesson${order}`), dryRun);

  // Shift question JSON files.
  shiftQuestionJson(questionJsonRoot, order, dryRun);

  console.log('Done.');
  console.log('Next: generate/upload audio for the new lesson folder and verify lesson-to-audio mapping.');
}

main()
  .catch((err) => {
    console.error(`ERROR: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
