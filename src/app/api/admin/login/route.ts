import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminSecretKey } = body;

    // Проверяем секретный ключ администратора
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid admin secret key' },
        { status: 401 }
      );
    }

    // Находим или создаем администратора
    let adminUser = await prisma.user.findFirst({
      where: { email: 'admin@davudx.com' }
    });

    if (!adminUser) {
      // Создаем нового администратора, если не существует
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@davudx.com',
          name: 'Administrator',
          role: 'ADMIN',
          password: '', // Без пароля, т.к. используется специальный вход
        }
      });
    } else {
      // Обновляем роль на ADMIN, если пользователь уже существует
      adminUser = await prisma.user.update({
        where: { id: adminUser.id },
        data: { role: 'ADMIN' },
      });
    }

    // Возвращаем информацию о пользователе для создания сессии
    return NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}