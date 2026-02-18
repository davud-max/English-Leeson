#!/usr/bin/env node

/**
 * Verify lesson-to-audio mapping.
 *
 * Data source modes:
 *  --source db   : expected slides from local DB (requires DATABASE_URL access)
 *  --source api  : expected slides from API /api/lessons/{order} (most up-to-date if API is current)
 *  --source fs   : filesystem-only structural checks (no expected count)
 *
 * Usage examples:
 *  node scripts/verify-lesson-audio-map.js --source db --from 1 --to 12
 *  node scripts/verify-lesson-audio-map.js --source api --api-base https://english-leeson-production.up.railway.app --from 1 --to 12
 *  node scripts/verify-lesson-audio-map.js --source fs --from 1 --to 27
 *
 * Optional for API auth:
 *  VERIFY_COOKIE='next-auth.session-token=...' node ... --source api ...
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const idx = args.indexOf(name);
  return idx >= 0 ? args[idx + 1] : fallback;
};

const source = (getArg('--source', 'db') || 'db').toLowerCase();
const from = Number(getArg('--from', '1'));
const to = Number(getArg('--to', '27'));
const apiBase = getArg('--api-base', 'http://localhost:3000');
const verifyCookie = process.env.VERIFY_COOKIE || '';

if (!['db', 'api', 'fs'].includes(source)) {
  console.error(`Invalid --source: ${source}. Use db|api|fs`);
  process.exit(1);
}
if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to < from) {
  console.error(`Invalid range: --from ${from} --to ${to}`);
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const audioRoot = path.join(root, 'public', 'audio');

function listSlideNums(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .map((name) => {
      const m = /^slide(\d+)\.mp3$/i.exec(name);
      return m ? Number(m[1]) : null;
    })
    .filter((n) => Number.isInteger(n))
    .sort((a, b) => a - b);
}

function contiguousInfo(nums) {
  if (!nums.length) return { first: 0, last: 0, missingInternal: [] };
  const first = nums[0];
  const last = nums[nums.length - 1];
  const set = new Set(nums);
  const missingInternal = [];
  for (let i = first; i <= last; i++) {
    if (!set.has(i)) missingInternal.push(i);
  }
  return { first, last, missingInternal };
}

function compact(list) {
  if (!list.length) return '-';
  const out = [];
  let s = list[0], p = list[0];
  for (let i = 1; i < list.length; i++) {
    const n = list[i];
    if (n === p + 1) { p = n; continue; }
    out.push(s === p ? `${s}` : `${s}-${p}`);
    s = p = n;
  }
  out.push(s === p ? `${s}` : `${s}-${p}`);
  return out.join(', ');
}

async function fetchExpectedByDb(order) {
  const prisma = new PrismaClient();
  try {
    const lesson = await prisma.lesson.findFirst({
      where: { order, published: true },
      select: { id: true, order: true, title: true, content: true, slides: true },
    });
    if (!lesson) return null;
    const expected = Array.isArray(lesson.slides) && lesson.slides.length > 0
      ? lesson.slides.length
      : (typeof lesson.content === 'string' && lesson.content.trim().length > 0 ? 1 : 0);
    return { title: lesson.title, expected };
  } finally {
    await prisma.$disconnect();
  }
}

async function fetchExpectedByApi(order) {
  const url = `${apiBase.replace(/\/$/, '')}/api/lessons/${order}`;
  const headers = verifyCookie ? { cookie: verifyCookie } : {};
  const res = await fetch(url, { headers });

  if (res.status === 404) return null;
  if (res.status === 401 || res.status === 403) {
    throw new Error(`API auth required for ${url} (status ${res.status}). Set VERIFY_COOKIE or use dev bypass.`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API error ${res.status} for ${url}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const lesson = data?.lesson;
  if (!lesson) return null;
  const slides = Array.isArray(lesson.slides) ? lesson.slides : [];
  const expected = slides.length > 0 ? slides.length : (lesson.content ? 1 : 0);
  return { title: lesson.title || `Lesson ${order}`, expected };
}

async function getExpected(order) {
  if (source === 'fs') return { title: `Lesson ${order}`, expected: null };
  if (source === 'db') return fetchExpectedByDb(order);
  return fetchExpectedByApi(order);
}

(async () => {
  console.log(`Verify source: ${source}`);
  if (source === 'api') console.log(`API base: ${apiBase}`);
  console.log(`Range: ${from}..${to}\n`);

  let issues = 0;
  for (let order = from; order <= to; order++) {
    let expectedInfo;
    try {
      expectedInfo = await getExpected(order);
    } catch (e) {
      console.error(`Lesson ${order}: ERROR ${e.message}`);
      issues++;
      continue;
    }

    // If db/api mode and lesson missing, skip silently.
    if ((source === 'db' || source === 'api') && !expectedInfo) continue;

    const title = expectedInfo?.title || `Lesson ${order}`;
    const expected = expectedInfo?.expected;

    const dir = path.join(audioRoot, `lesson${order}`);
    const exists = fs.existsSync(dir);
    const nums = listSlideNums(dir);
    const ci = contiguousInfo(nums);

    const currentIssues = [];
    if (!exists) currentIssues.push('audio folder missing');
    if (nums.length && ci.first !== 1) currentIssues.push(`audio starts at slide${ci.first} (expected slide1)`);
    if (ci.missingInternal.length) currentIssues.push(`missing internal files: ${compact(ci.missingInternal)}`);

    if (expected !== null) {
      const set = new Set(nums);
      const missingExpected = [];
      for (let i = 1; i <= expected; i++) if (!set.has(i)) missingExpected.push(i);
      const extraBeyond = nums.filter((n) => n > expected);

      if (nums.length !== expected) currentIssues.push(`count mismatch expected=${expected} actual=${nums.length}`);
      if (missingExpected.length) currentIssues.push(`missing expected files: ${compact(missingExpected)}`);
      if (extraBeyond.length) currentIssues.push(`extra files beyond expected: ${compact(extraBeyond)}`);
    }

    if (currentIssues.length) {
      issues++;
      console.log(`Lesson ${order} - ${title}`);
      console.log(`  folder: ${exists ? 'ok' : 'MISSING'} (${dir})`);
      console.log(`  audio files: ${nums.length}${nums.length ? ` (slide${ci.first}..slide${ci.last})` : ''}`);
      if (expected !== null) console.log(`  expected slides: ${expected}`);
      currentIssues.forEach((x) => console.log(`  - ${x}`));
      console.log('');
    }
  }

  if (!issues) {
    console.log('No issues detected in selected range.');
  } else {
    console.log(`Detected issues in ${issues} lesson(s).`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
