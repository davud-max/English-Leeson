'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { data: session } = useSession()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!agreed) {
      setError('Please agree to the terms and conditions')
      return
    }

    // If not logged in, require password
    if (!session && (!formData.email || !formData.password)) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || session?.user?.name,
          email: formData.email || session?.user?.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create checkout session')
        return
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-gray-800">
            <span>🧠</span>
            <span>Thinking Course</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Order Summary */}
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-4 text-2xl">
                      🧠
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Algorithms of Thinking and Cognition</h3>
                      <p className="text-gray-500 text-sm mt-1">Full Course • Lifetime Access</p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    '25+ interactive lessons',
                    'AI-generated questions',
                    'Voice input support',
                    'Audio narration',
                    'Lifetime access',
                    'Certificate of completion',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <span className="text-green-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">$30.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">$30.00 USD</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700">
                    <span>🔒</span>
                    <span className="text-sm font-medium">30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="order-1 md:order-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
                <p className="text-gray-600 mb-8">
                  {session ? 'You are logged in. Complete payment below.' : 'Create an account or sign in to continue'}
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!session && (
                    <>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Create Password *
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="Min. 6 characters"
                          required
                          minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Already have an account?{' '}
                          <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
                        </p>
                      </div>
                    </>
                  )}

                  {session && (
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-blue-700">
                        Logged in as <strong>{session.user?.email}</strong>
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !agreed}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        🔒 Pay $30.00 with Stripe
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-4 text-gray-400 text-sm">
                  <span>Secure payment by</span>
                  <span className="font-bold text-gray-600">Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
