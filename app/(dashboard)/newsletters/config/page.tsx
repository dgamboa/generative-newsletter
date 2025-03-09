"use server"

import { Suspense } from "react"
import { getNewsletterConfig } from "@/lib/newsletter-config"
import NewsletterConfigForm from "./_components/newsletter-config-form"
import NewsletterConfigSkeleton from "./_components/newsletter-config-skeleton"

interface NewsletterConfigPageProps {
  searchParams: { title?: string }
}

export default async function NewsletterConfigPage({ searchParams }: NewsletterConfigPageProps) {
  const title = searchParams.title || ""
  
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-2">Newsletter Configuration</h1>
      <Suspense fallback={<NewsletterConfigSkeleton />}>
        <NewsletterConfigFetcher title={title} />
      </Suspense>
    </div>
  )
}

async function NewsletterConfigFetcher({ title }: { title: string }) {
  const configContent = await getNewsletterConfig()
  
  return <NewsletterConfigForm initialConfig={configContent} title={title} />
} 