import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Algorithms of Thinking and Cognition | Philosophy Course',
  description: 'A Philosophical Course for the Development of Critical Thinking. 17 interactive lessons with AI-generated questions and lifetime access.',
  keywords: ['philosophy', 'critical thinking', 'cognition', 'education', 'online course'],
  openGraph: {
    title: 'Algorithms of Thinking and Cognition',
    description: 'A Philosophical Course for the Development of Critical Thinking',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
