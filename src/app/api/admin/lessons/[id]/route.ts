import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/lessons/[id] - получить детали урока
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        order: true,
        title: true,
        content: true,
        description: true,
        duration: true,
        published: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      lesson: {
        id: lesson.id,
        order: lesson.order,
        title: lesson.title,
        content: lesson.content || '',
        description: lesson.description || '',
        duration: lesson.duration || 25,
        published: lesson.published ?? false,
      }
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/lessons/[id] - обновить урок
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/lessons/[id] - удалить урок
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lesson.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}
