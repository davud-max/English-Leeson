import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Algorithms of Thinking and Cognition
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          A Philosophical Course for the Development of Critical Thinking
        </p>
        <Link
          href="/checkout"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Get Started – USD $30
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Who Is This Course For?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            'Develop critical and systems thinking',
            'Understand the fundamental principles of cognition',
            'Learn to discern the essence of things',
            'Master tools of analysis and abstraction',
            'Study the philosophical foundations of thinking',
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-4">Special Price</h2>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$30</span>
            <p className="text-blue-100 mt-2">Lifetime access</p>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-white text-blue-600 hover:bg-gray-50 text-center font-semibold px-6 py-4 rounded-lg transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
