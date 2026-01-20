import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Check if user has access to the course
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: session.user.id,
    },
  })

  if (!enrollment) {
    redirect('/checkout')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            Thinking Course
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
