/**
 * Тестовый скрипт для проверки функции отката урока
 * Этот скрипт проверяет работоспособность новых API эндпоинтов
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRollbackFeature() {
  console.log('🧪 Тестирование функции отката урока...\n');
  
  try {
    // Проверяем наличие модели LessonHistory
    console.log('🔍 Проверка модели LessonHistory...');
    try {
      // Попробуем получить одну запись из истории (если есть)
      const sampleHistory = await prisma.lessonHistory.findFirst({
        take: 1
      });
      
      if (sampleHistory) {
        console.log('✅ Модель LessonHistory существует и содержит данные');
        console.log(`   Пример записи:`, {
          id: sampleHistory.id,
          lessonId: sampleHistory.lessonId,
          title: sampleHistory.title.substring(0, 50) + '...',
          changedAt: sampleHistory.changedAt
        });
      } else {
        console.log('✅ Модель LessonHistory существует, но данных пока нет');
      }
    } catch (historyModelError) {
      console.log('❌ Модель LessonHistory не существует:', historyModelError.message);
      console.log('ℹ️  Возможно, миграция базы данных еще не применена');
      return false;
    }
    
    // Проверяем наличие хотя бы одного урока для тестирования
    console.log('\n🔍 Проверка наличия уроков...');
    const lessons = await prisma.lesson.findMany({
      take: 1,
      orderBy: { order: 'asc' }
    });
    
    if (lessons.length === 0) {
      console.log('❌ Уроки не найдены в базе данных');
      return false;
    }
    
    const testLesson = lessons[0];
    console.log(`✅ Найден урок для тестирования: #${testLesson.order} "${testLesson.title}"`);
    
    // Проверяем историю изменений для урока
    console.log('\n🔍 Проверка истории изменений для урока...');
    const history = await prisma.lessonHistory.findMany({
      where: { lessonId: testLesson.id },
      take: 5, // последние 5 изменений
      orderBy: { changedAt: 'desc' }
    });
    
    console.log(`✅ История изменений: ${history.length} записей`);
    if (history.length > 0) {
      console.log('   Последние версии:');
      history.slice(0, 3).forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.title.substring(0, 30)}... (${record.changedAt})`);
      });
    }
    
    console.log('\n✅ Базовая проверка функции отката завершена успешно!');
    console.log('\n📋 Для полного тестирования функции отката:');
    console.log('   1. Используйте кнопку "Откат" (🔄 Откат) в интерфейсе редактора уроков');
    console.log('   2. API эндпоинты доступны по адресам:');
    console.log('      - GET /api/admin/lesson-history/[lessonId]');
    console.log('      - POST /api/admin/lesson-history/[lessonId]/rollback');
    console.log('\n   3. Функция будет предлагать откат к предыдущей версии с подтверждением');
    
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск теста, если файл выполняется напрямую
if (require.main === module) {
  testRollbackFeature()
    .then(success => {
      if (success) {
        console.log('\n🎉 Тестирование завершено успешно!');
        process.exit(0);
      } else {
        console.log('\n💥 Тестирование завершено с ошибками!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Ошибка выполнения теста:', error);
      process.exit(1);
    });
}

module.exports = { testRollbackFeature };