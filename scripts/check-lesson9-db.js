#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLesson9() {
  try {
    // Поиск урока с order=9
    const lesson9 = await prisma.lesson.findFirst({
      where: {
        order: 9
      }
    });

    if (lesson9) {
      console.log("=== Урок 9 (по порядку) ===");
      console.log("ID:", lesson9.id);
      console.log("Заголовок:", lesson9.title);
      console.log("Описание:", lesson9.description);
      console.log("Контент:", lesson9.content ? lesson9.content.substring(0, 200) + "..." : "пусто");
      console.log("Доступен:", lesson9.available);
      console.log("Опубликован:", lesson9.published);
      console.log("Продолжительность:", lesson9.duration);
      console.log("Слайды:", lesson9.slides ? lesson9.slides.length : 0);
      console.log("");
      
      if (lesson9.slides) {
        console.log("Слайды:");
        lesson9.slides.forEach((slide, index) => {
          console.log(`  ${index + 1}. ${slide.title}`);
          console.log(`     Content preview: ${slide.content ? slide.content.substring(0, 100) + "..." : "empty"}`);
          console.log("");
        });
      }
    } else {
      console.log("Урок с order=9 не найден");
    }

    // Также проверим, может быть, урок 9 имеет другой order (вдруг была вставка)
    const allLessons = await prisma.lesson.findMany({
      where: {
        title: {
          contains: "Genesis",
          mode: "insensitive"
        }
      }
    });

    if (allLessons.length > 0) {
      console.log("\n=== Уроки, содержащие 'Genesis' в названии ===");
      allLessons.forEach(lesson => {
        console.log(`Order: ${lesson.order}, Title: ${lesson.title}`);
      });
    }

    // Проверим все уроки с описаниями, содержащими ключевые слова
    const lessonsWithKeywords = await prisma.lesson.findMany({
      where: {
        OR: [
          {
            description: {
              contains: "Genesis",
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: "Heaven and earth",
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: "water and light",
              mode: "insensitive"
            }
          }
        ]
      }
    });

    if (lessonsWithKeywords.length > 0) {
      console.log("\n=== Уроки с ключевыми словами в описании ===");
      lessonsWithKeywords.forEach(lesson => {
        console.log(`Order: ${lesson.order}, Title: ${lesson.title}`);
        console.log(`Description: ${lesson.description}`);
        console.log("");
      });
    }

  } catch (error) {
    console.error("Ошибка при получении данных из базы:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLesson9();