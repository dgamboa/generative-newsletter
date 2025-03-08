"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/login")
  }
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        {children}
      </div>
    </div>
  )
} 