import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password, secret } = await req.json()

    // Check secret key (set in environment or use default for first setup)
    const adminSecret = process.env.ADMIN_SECRET || 'create-first-admin-2025'
    
    if (secret !== adminSecret) {
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 403 }
      )
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Update to admin
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      })

      return NextResponse.json({
        success: true,
        message: 'User upgraded to admin',
        user: { email: updatedUser.email, role: updatedUser.role },
      })
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      user: { email: user.email, role: user.role },
    })
  } catch (error: any) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: 'Failed to create admin', details: error.message },
      { status: 500 }
    )
  }
}
