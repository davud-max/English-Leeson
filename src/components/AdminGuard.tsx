'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/admin/login')
      return
    }

    // Check if user is admin
    checkAdminStatus()
  }, [session, status, router])

  const checkAdminStatus = async () => {
    try {
      const res = await fetch('/api/admin/check')
      const data = await res.json()
      
      if (!data.isAdmin) {
        router.push('/admin/login')
        return
      }
      
      setIsAdmin(true)
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setChecking(false)
    }
  }

  if (status === 'loading' || checking || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
