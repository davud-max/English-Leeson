'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold text-gray-800 mb-3 mt-6">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-500 pl-4 py-2 my-6 bg-gray-50 rounded-r">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2">
              {children}
            </ol>
          ),
          hr: () => <hr className="my-8 border-gray-300" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
