'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/checkout')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration moved</h1>
        <p className="text-gray-600 mb-6">
          Create your account during checkout in a single step.
        </p>
        <Link
          href="/checkout"
          className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition"
        >
          Go to checkout
        </Link>
      </div>
    </div>
  )
}
