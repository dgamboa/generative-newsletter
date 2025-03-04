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
    <div className="container mx-auto px-4">
      {children}
    </div>
  )
} 