"use server"

import { Suspense } from "react"
import { getNewsletterByIdAction } from "@/actions/db/newsletters-actions"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import NewsletterEditor from "./_components/newsletter-editor"
import NewsletterSkeleton from "./_components/newsletter-skeleton"

interface NewsletterPageProps {
  params: {
    id: string
  }
}

export default async function NewsletterPage(props: NewsletterPageProps) {
  const { id } = props.params
  
  return (
    <div className="py-8">
      <Suspense fallback={<NewsletterSkeleton />}>
        <NewsletterEditorFetcher id={id} />
      </Suspense>
    </div>
  )
}

async function NewsletterEditorFetcher({ id }: { id: string }) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/login")
  }
  
  const { data: newsletter, status } = await getNewsletterByIdAction(id)
  
  if (status === "error" || !newsletter) {
    notFound()
  }
  
  // Check if the newsletter belongs to the user
  if (newsletter.userId !== userId) {
    redirect("/dashboard")
  }
  
  return <NewsletterEditor initialNewsletter={newsletter} />
} 