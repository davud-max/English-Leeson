import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST() {
  try {
    const result = await prisma.lesson.update({
      where: { id: 'cmks5saj0000v11nt8a2ati54' },
      data: { slides: Prisma.JsonNull }
    });
    
    return NextResponse.json({
      success: true,
      message: `Cleared slides for lesson ${result.order}: ${result.title}`
    });
  } catch (error) {
    console.error('Error clearing slides:', error);
    return NextResponse.json(
      { error: 'Failed to clear slides' },
      { status: 500 }
    );
  }
}
