import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getLessons() {
  return await prisma.lesson.findMany({
    include: {
      course: { select: { title: true } },
    },
    orderBy: { order: 'asc' },
  })
}

export default async function ContentPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const lessons = await getLessons()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Content Management</h1>
            <Link href="/admin" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Course Lessons</h2>
            <p className="text-gray-600 mt-1">Manage lesson content, order, and publication status</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Lesson {lesson.order}
                      </span>
                      {lesson.published ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Duration: {lesson.duration} min</span>
                      <span>•</span>
                      <span>Content: {lesson.content.length} chars</span>
                      <span>•</span>
                      <span>Last updated: {new Date(lesson.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors">
                      Edit
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Content Management Features</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Lesson 1 is fully seeded with content and published</li>
            <li>• Other lessons have placeholder content and can be edited</li>
            <li>• Use the Edit button to modify lesson content in Markdown format</li>
            <li>• Toggle publication status to control student access</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
