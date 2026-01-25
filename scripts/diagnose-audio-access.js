#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic: Checking Lesson 14 audio file accessibility\n');

// Check if we're in development or production
const isDev = process.env.NODE_ENV !== 'production';
console.log(`Environment: ${isDev ? 'Development' : 'Production'}`);

// Check file existence
const audioFiles = [
  'segment-01.mp3',
  'segment-02.mp3',
  'segment-07.mp3',
  'segment-08.mp3'
];

const audioDir = path.join(__dirname, '..', 'public', 'audio', 'lessons', '14');

console.log('\n📁 Local file system check:');
audioFiles.forEach(file => {
  const fullPath = path.join(audioDir, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`  ✅ ${file} - ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
  }
});

// Check build output if in production
if (!isDev) {
  const buildDir = path.join(__dirname, '..', '.next', 'static', 'media');
  if (fs.existsSync(buildDir)) {
    console.log('\n🏗️  Build output check:');
    const buildFiles = fs.readdirSync(buildDir);
    const mp3Files = buildFiles.filter(f => f.endsWith('.mp3'));
    console.log(`  Found ${mp3Files.length} MP3 files in build output`);
    
    // Check if our specific files are there
    audioFiles.forEach(file => {
      const found = mp3Files.some(buildFile => buildFile.includes(file.replace('.mp3', '')));
      console.log(`  ${found ? '✅' : '❌'} ${file} in build output`);
    });
  }
}

console.log('\n🌐 Web paths that should work:');
audioFiles.forEach(file => {
  console.log(`  /audio/lessons/14/${file}`);
});

console.log('\n🔧 Troubleshooting suggestions:');
console.log('1. Restart the development server');
console.log('2. Clear browser cache');
console.log('3. Check if files are properly copied to .next/static/media in production');
console.log('4. Verify nginx/Apache configuration if using reverse proxy');
console.log('5. Check if files need to be imported differently in Next.js 14');

// Test importing strategy
console.log('\n🧪 Testing Next.js import strategy:');
console.log('Option 1: Direct public path (current approach)');
console.log('Option 2: Import files as modules');
console.log('Option 3: Use Next.js Image component approach for assets');