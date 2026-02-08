#!/bin/bash

echo "📊 Checking lessons count in Railway database..."
echo ""

cd /Users/davudzulumkhanov/thinking-course-en

# Run the check script
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const lessons = await prisma.lesson.findMany({
      select: { id: true, order: true, title: true, published: true },
      orderBy: { order: 'asc' }
    });
    
    const pub = lessons.filter(l => l.published);
    
    console.log('📊 Total lessons:', lessons.length);
    console.log('✅ Published:', pub.length);
    console.log('❌ Unpublished:', lessons.length - pub.length);
    console.log('');
    console.log('📚 Lessons list:');
    lessons.forEach(l => {
      const s = l.published ? '✅' : '❌';
      console.log(\`  \${s} #\${l.order}: \${l.title}\`);
    });
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.\$disconnect();
  }
}

check();
"
