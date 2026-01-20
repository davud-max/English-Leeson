'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Enroll in the Course
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            Algorithms of Thinking and Cognition
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              17 interactive lessons
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              AI-generated questions
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Voice input for answers
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Practical assignments
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Lifetime access
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total:</span>
              <span className="text-primary-600">USD 30</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">One-time payment • Lifetime access</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold mb-6">Payment Information</h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="name@example.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                Access to the course will be sent to this email
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Create Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Minimum 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold px-6 py-4 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Secure payment powered by{' '}
            <span className="font-semibold">Stripe</span>
          </p>
        </div>
      </div>
    </div>
  )
}
