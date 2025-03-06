"use server"

import { Suspense } from "react"
import { getNewsletterConfig } from "@/lib/newsletter-config"
import NewsletterConfigForm from "./_components/newsletter-config-form"
import NewsletterConfigSkeleton from "./_components/newsletter-config-skeleton"

export default async function NewsletterConfigPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">Newsletter Configuration</h1>
      
      <Suspense fallback={<NewsletterConfigSkeleton />}>
        <NewsletterConfigFetcher />
      </Suspense>
    </div>
  )
}

async function NewsletterConfigFetcher() {
  const configContent = await getNewsletterConfig()
  
  return <NewsletterConfigForm initialConfig={configContent} />
} 