"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewsletterNotFound() {
  return (
    <div className="container py-12 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Newsletter Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The newsletter you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
      </p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  )
} 