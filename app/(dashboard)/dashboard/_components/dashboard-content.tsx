"use client"

import { useState } from "react"
import { SelectNewsletter } from "@/db/schema"
import { deleteNewsletterAction } from "@/actions/db/newsletters-actions"
import { generateNewsletterAction } from "@/actions/newsletter-generation-actions"
import { generatePromptFromConfig } from "@/lib/newsletter-config"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import NewsletterCard from "@/components/ui/newsletter-card"
import { PlusIcon } from "lucide-react"

interface DashboardContentProps {
  initialNewsletters: SelectNewsletter[]
  userId: string
}

export default function DashboardContent({
  initialNewsletters,
  userId
}: DashboardContentProps) {
  const [newsletters, setNewsletters] = useState<SelectNewsletter[]>(initialNewsletters)
  const [isGenerating, setIsGenerating] = useState(false)
  const [title, setTitle] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleGenerateNewsletter = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your newsletter",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const prompt = await generatePromptFromConfig()
      const result = await generateNewsletterAction(prompt, title)
      
      if (result.status === "success" && result.data) {
        toast({
          title: "Success",
          description: "Newsletter generated successfully"
        })
        
        // Navigate to the edit page for the new newsletter
        router.push(`/newsletters/${result.data.id}`)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate newsletter",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error generating newsletter:", error)
      toast({
        title: "Error",
        description: "Failed to generate newsletter",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
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
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Newsletter Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter newsletter title"
            disabled={isGenerating}
            className="dark:bg-[#222] dark:border-gray-700"
          />
        </div>
        <Button 
          onClick={handleGenerateNewsletter} 
          disabled={isGenerating}
          className="flex items-center gap-2 bg-[#208036] hover:bg-[#208036]/90 dark:bg-[#40b25d] dark:hover:bg-[#40b25d]/90"
        >
          <PlusIcon size={16} />
          {isGenerating ? "Generating..." : "Generate Newsletter"}
        </Button>
      </div>

      {newsletters.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <h3 className="text-lg font-medium mb-2">No newsletters yet</h3>
          <p className="text-muted-foreground mb-4">
            Generate your first newsletter to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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