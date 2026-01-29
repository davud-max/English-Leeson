#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Lesson 14 audio files...\n');

const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lessons', '14');
const files = fs.readdirSync(audioDir);

console.log('📁 Audio directory contents:');
files.forEach(file => {
  if (file.endsWith('.mp3')) {
    const stats = fs.statSync(path.join(audioDir, file));
    console.log(`  ✅ ${file} - ${(stats.size / 1024).toFixed(1)} KB`);
  }
});

console.log('\n🔗 Testing file accessibility:');
const testFiles = [
  'segment-01.mp3',
  'segment-02.mp3', 
  'segment-03.mp3'
];

testFiles.forEach(file => {
  const filePath = path.join(audioDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} exists and is accessible`);
  } else {
    console.log(`  ❌ ${file} not found`);
  }
});

console.log('\n📝 File paths for web access:');
testFiles.forEach(file => {
  console.log(`  /audio/lessons/14/${file}`);
});

console.log('\n💡 Troubleshooting steps:');
console.log('1. Check browser console for audio errors');
console.log('2. Verify files are served correctly by Next.js');
console.log('3. Test direct URL access to audio files');
console.log('4. Check browser autoplay policies');