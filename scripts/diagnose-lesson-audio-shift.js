#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const audioRoot = path.join(root, 'public', 'audio');
const cfgPath = path.join(root, 'public', 'data', 'slides-config.json');

const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {};

function listSlideNums(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .map((name) => {
      const m = /^slide(\d+)\.mp3$/i.exec(name);
      return m ? Number(m[1]) : null;
    })
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

function findMissing(expected, presentSet) {
  const missing = [];
  for (let i = 1; i <= expected; i++) {
    if (!presentSet.has(i)) missing.push(i);
  }
  return missing;
}

function findBeyond(expected, nums) {
  return nums.filter((n) => n > expected);
}

function summarizeRange(list) {
  if (!list.length) return '-';
  const chunks = [];
  let start = list[0], prev = list[0];
  for (let i = 1; i < list.length; i++) {
    const n = list[i];
    if (n === prev + 1) {
      prev = n;
      continue;
    }
    chunks.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = prev = n;
  }
  chunks.push(start === prev ? `${start}` : `${start}-${prev}`);
  return chunks.join(', ');
}

const reports = [];
for (let lesson = 1; lesson <= 27; lesson++) {
  const dir = path.join(audioRoot, `lesson${lesson}`);
  const nums = listSlideNums(dir);
  const expected = Number(cfg[String(lesson)] || 0);
  const set = new Set(nums);

  const missing = expected > 0 ? findMissing(expected, set) : [];
  const beyond = expected > 0 ? findBeyond(expected, nums) : [];
  const duplicates = nums.filter((n, idx) => idx > 0 && nums[idx - 1] === n);

  reports.push({
    lesson,
    dirExists: fs.existsSync(dir),
    fileCount: nums.length,
    expected,
    maxSlide: nums.length ? nums[nums.length - 1] : 0,
    missing,
    beyond,
    duplicates,
  });
}

console.log('Lesson audio diagnostics (order-based folders lesson1..lesson27)\n');

let problems = 0;
for (const r of reports) {
  const hasIssue =
    !r.dirExists ||
    (r.expected > 0 && (r.missing.length > 0 || r.beyond.length > 0 || r.fileCount !== r.expected)) ||
    r.duplicates.length > 0;

  if (!hasIssue) continue;
  problems++;

  console.log(`Lesson ${r.lesson}:`);
  if (!r.dirExists) {
    console.log('  - folder missing');
    continue;
  }

  console.log(`  - files: ${r.fileCount}`);
  console.log(`  - expected (from slides-config): ${r.expected || 'n/a'}`);
  console.log(`  - max slide number: ${r.maxSlide}`);

  if (r.expected > 0) {
    if (r.fileCount !== r.expected) {
      console.log(`  - count mismatch: expected ${r.expected}, got ${r.fileCount}`);
    }
    if (r.missing.length) {
      console.log(`  - missing slides: ${summarizeRange(r.missing)}`);
    }
    if (r.beyond.length) {
      console.log(`  - extra slides beyond expected: ${summarizeRange(r.beyond)}`);
    }
  } else {
    console.log('  - no expected count in slides-config (manual verify needed)');
  }

  if (r.duplicates.length) {
    console.log(`  - duplicate slide numbers: ${summarizeRange(r.duplicates)}`);
  }
}

if (!problems) {
  console.log('No structural mismatches found in lesson1..lesson27 folders.');
}
