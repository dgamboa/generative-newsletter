"use server"

import { Suspense } from "react"
import { getNewslettersByUserIdAction } from "@/actions/db/newsletters-actions"
import { auth } from "@clerk/nextjs/server"
import DashboardContent from "./_components/dashboard-content"
import DashboardSkeleton from "./_components/dashboard-skeleton"

export default async function DashboardPage() {
  return (
    <div className="py-6 md:py-8">
      <div className="flex items-center mb-8 gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Your Newsletters</h1>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm border p-6 md:p-8 shadow-[0_0_5px_rgba(0,0,0,0.1)] dark:shadow-[0_0_5px_rgba(255,255,255,0.1)]">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContentFetcher />
        </Suspense>
      </div>
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