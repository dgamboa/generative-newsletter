"use client"

interface NewsletterPreviewProps {
  title: string
  content: string
  citations?: string[]
  className?: string
}

export default function NewsletterPreview({
  title,
  content,
  citations = [],
  className = ""
}: NewsletterPreviewProps) {
  return (
    <div className={`border rounded-lg p-6 bg-white shadow-sm ${className}`}>
      <div className="max-w-2xl mx-auto">
        
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        {citations && citations.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Sources</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-600">
              {citations.map((citation, index) => (
                <li key={index}>
                  <a 
                    href={citation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {citation}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
} 