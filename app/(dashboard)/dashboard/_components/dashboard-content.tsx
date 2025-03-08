"use client"

import { useState } from "react"
import { SelectNewsletter } from "@/db/schema"
import { deleteNewsletterAction } from "@/actions/db/newsletters-actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import NewsletterCard from "@/components/ui/newsletter-card"
import { ArrowRight, PlusCircle } from "lucide-react"

interface DashboardContentProps {
  initialNewsletters: SelectNewsletter[]
  userId: string
}

export default function DashboardContent({
  initialNewsletters,
  userId
}: DashboardContentProps) {
  const [newsletters, setNewsletters] = useState<SelectNewsletter[]>(initialNewsletters)
  const [title, setTitle] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleNavigateToConfig = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your newsletter",
        variant: "destructive"
      })
      return
    }
    
    // Pass the title as a query parameter
    router.push(`/newsletters/config?title=${encodeURIComponent(title)}`)
  }

  const handleDeleteNewsletter = async (id: string) => {
    try {
      const result = await deleteNewsletterAction(id)
      
      if (result.status === "success") {
        setNewsletters(newsletters.filter(newsletter => newsletter.id !== id))
        toast({
          title: "Success",
          description: "Newsletter deleted successfully"
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete newsletter",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error deleting newsletter:", error)
      toast({
        title: "Error",
        description: "Failed to delete newsletter",
        variant: "destructive"
      })
    }
  }

  return (
    <div>
      <div className="mb-8 p-6 border bg-card/50 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Create a New Newsletter</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="title" className="block text-sm font-medium mb-2 text-foreground/80">
              Newsletter Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter newsletter title"
              className="bg-background dark:bg-card border-input/50 focus:ring-2 ring-primary/20 transition-all"
            />
          </div>
          <Button 
            onClick={handleNavigateToConfig} 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-sm hover:shadow transition-all"
          >
            <PlusCircle size={16} />
            Create Newsletter
          </Button>
        </div>
      </div>

      {newsletters.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/20 animate-in fade-in duration-500">
          <h3 className="text-lg font-medium mb-3">No newsletters yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Generate your first newsletter to get started with AI-powered content creation
          </p>
          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {newsletters.map((newsletter) => (
            <NewsletterCard
              key={newsletter.id}
              newsletter={newsletter}
              onDelete={handleDeleteNewsletter}
            />
          ))}
        </div>
      )}
    </div>
  )
} 