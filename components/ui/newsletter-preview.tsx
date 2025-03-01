"use client"

interface NewsletterPreviewProps {
  title: string
  content: string
  className?: string
}

export default function NewsletterPreview({
  title,
  content,
  className = ""
}: NewsletterPreviewProps) {
  return (
    <div className={`border rounded-lg p-6 bg-white shadow-sm ${className}`}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
} 