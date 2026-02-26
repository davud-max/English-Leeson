import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/lesson-history/[id] - получить историю изменений урока
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем существование урока
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Получаем историю изменений урока
    const historyRecords = await prisma.lessonHistory.findMany({
      where: { lessonId: params.id },
      orderBy: { changedAt: 'desc' },
      take: 20, // последние 20 изменений
    });

    // Преобразуем записи истории для ответа
    const history = historyRecords.map((record: any) => ({
      id: record.id,
      lessonId: record.lessonId,
      title: record.title,
      description: record.description,
      content: record.content,
      slides: record.slides,
      duration: record.duration,
      published: record.published,
      emoji: record.emoji,
      color: record.color,
      available: record.available,
      changedAt: record.changedAt.toISOString(),
      changedBy: record.changedBy ? record.changedBy.name || record.changedBy.email : 'System'
    }));

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching lesson history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson history' },
      { status: 500 }
    );
  }
}

// POST /api/admin/lesson-history/[id]/rollback - откатить урок к предыдущей версии
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { error: 'Version ID is required for rollback' },
        { status: 400 }
      );
    }

    // Получаем версию для восстановления
    const versionToRestore = await prisma.lessonHistory.findUnique({
      where: { id: versionId }
    });

    if (!versionToRestore) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Проверяем, что эта версия принадлежит уроку, который мы пытаемся откатить
    if (versionToRestore.lessonId !== params.id) {
      return NextResponse.json(
        { error: 'Version does not belong to this lesson' },
        { status: 400 }
      );
    }

    // Обновляем урок данными из выбранной версии
    const updatedLesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        title: versionToRestore.title,
        description: versionToRestore.description,
        content: versionToRestore.content,
        slides: versionToRestore.slides,
        duration: versionToRestore.duration,
        published: versionToRestore.published,
        emoji: versionToRestore.emoji,
        color: versionToRestore.color,
        available: versionToRestore.available,
        updatedAt: new Date(),
      }
    });

    // Логгируем действие отката в истории
    await prisma.lessonHistory.create({
      data: {
        lessonId: params.id,
        title: versionToRestore.title,
        description: versionToRestore.description,
        content: versionToRestore.content,
        slides: versionToRestore.slides,
        duration: versionToRestore.duration,
        published: versionToRestore.published,
        emoji: versionToRestore.emoji,
        color: versionToRestore.color,
        available: versionToRestore.available,
        // changedById: userId // в реальном приложении нужно добавить ID пользователя
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Lesson successfully rolled back to previous version',
      updatedLesson: {
        id: updatedLesson.id,
        title: updatedLesson.title,
        description: updatedLesson.description,
        content: updatedLesson.content,
        slides: updatedLesson.slides,
        duration: updatedLesson.duration,
        published: updatedLesson.published,
        emoji: updatedLesson.emoji,
        color: updatedLesson.color,
        available: updatedLesson.available,
      }
    });
  } catch (error) {
    console.error('Error rolling back lesson:', error);
    return NextResponse.json(
      { error: 'Failed to rollback lesson' },
      { status: 500 }
    );
  }
}