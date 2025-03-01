"use server"

import { Suspense } from "react"
import { getNewslettersByUserIdAction } from "@/actions/db/newsletters-actions"
import { auth } from "@clerk/nextjs/server"
import DashboardContent from "./_components/dashboard-content"
import DashboardSkeleton from "./_components/dashboard-skeleton"

export default async function DashboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Newsletters</h1>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContentFetcher />
      </Suspense>
    </div>
  )
}

async function DashboardContentFetcher() {
  const { userId } = await auth()
  
  if (!userId) {
    return <div>You must be logged in to view your newsletters.</div>
  }
  
  const { data: newsletters, status } = await getNewslettersByUserIdAction(userId)
  
  return (
    <DashboardContent 
      initialNewsletters={newsletters || []} 
      userId={userId} 
    />
  )
} 