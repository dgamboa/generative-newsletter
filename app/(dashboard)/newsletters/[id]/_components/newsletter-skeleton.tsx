"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function NewsletterSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
} 