"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { NewsletterConfig } from "@/types"
import { generateNewsletterAction } from "@/actions/newsletter-generation-actions"
import { generatePromptFromCustomConfig } from "@/lib/newsletter-config"

interface NewsletterConfigFormProps {
  initialConfig: string;
  title: string;
}

export default function NewsletterConfigForm({ initialConfig, title }: NewsletterConfigFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [config, setConfig] = useState<NewsletterConfig>({
    title: title,
    focus: "",
    timePeriod: "",
    tone: "Formal & Professional",
    structure: "",
    additionalInstructions: "",
    templateStyle: "classic"
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Parse the initial config to populate the form
    if (initialConfig) {
      const focusMatch = initialConfig.match(/## Focus\n([\s\S]*?)(?=\n## |$)/)
      const timePeriodMatch = initialConfig.match(/## Time Period\n([\s\S]*?)(?=\n## |$)/)
      const structureMatch = initialConfig.match(/## Structure\n([\s\S]*?)(?=\n## |$)/)
      const additionalInstructionsMatch = initialConfig.match(/## Additional Instructions\n([\s\S]*?)(?=\n## |$)/)

      setConfig({
        title: title,
        focus: focusMatch ? focusMatch[1].trim() : "",
        timePeriod: timePeriodMatch ? timePeriodMatch[1].trim() : "",
        tone: "Formal & Professional", // Default value
        structure: structureMatch ? structureMatch[1].trim() : "",
        additionalInstructions: additionalInstructionsMatch ? additionalInstructionsMatch[1].trim() : "",
        templateStyle: "classic" // Default template style
      })
    }
  }, [initialConfig, title])

  const handleChange = (field: keyof NewsletterConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!config.title?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your newsletter",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    
    try {
      // Generate a custom prompt based on the form values
      const customPrompt = await generatePromptFromCustomConfig(config)
      
      // Generate the newsletter
      const result = await generateNewsletterAction(customPrompt, config.title)
      
      if (result.status === "success" && result.data) {
        toast({
          title: "Success",
          description: "Newsletter generated successfully"
        })
        
        // Set redirecting state before navigation
        setIsRedirecting(true)
        
        // Navigate to the edit page for the new newsletter
        router.push(`/newsletters/${result.data.id}`)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate newsletter",
          variant: "destructive"
        })
        setIsGenerating(false)
      }
    } catch (error) {
      console.error("Error generating newsletter:", error)
      toast({
        title: "Error",
        description: "Failed to generate newsletter",
        variant: "destructive"
      })
      setIsGenerating(false)
    }
  }

  // Form is disabled if either generating or redirecting
  const isFormDisabled = isGenerating || isRedirecting

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Newsletter Title</Label>
            <Input
              id="title"
              value={config.title || ""}
              onChange={(e) => handleChange("title", e.target.value.slice(0, 50))}
              placeholder="Enter a title for your newsletter (max 50 characters)"
              maxLength={50}
              disabled={isFormDisabled}
            />
            <p className="text-sm text-muted-foreground">
              {50 - (config.title?.length || 0)} characters remaining
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="focus">Focus</Label>
            <Input
              id="focus"
              value={config.focus}
              onChange={(e) => handleChange("focus", e.target.value.slice(0, 150))}
              placeholder="What should the newsletter focus on?"
              maxLength={150}
              disabled={isFormDisabled}
            />
            <p className="text-sm text-muted-foreground">
              {150 - (config.focus?.length || 0)} characters remaining
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timePeriod">Time Period</Label>
            <Input
              id="timePeriod"
              value={config.timePeriod}
              onChange={(e) => handleChange("timePeriod", e.target.value.slice(0, 150))}
              placeholder="What time period should the newsletter cover?"
              maxLength={150}
              disabled={isFormDisabled}
            />
            <p className="text-sm text-muted-foreground">
              {150 - (config.timePeriod?.length || 0)} characters remaining
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select
              value={config.tone}
              onValueChange={(value) => handleChange("tone", value)}
              disabled={isFormDisabled}
            >
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal & Professional">Formal & Professional</SelectItem>
                <SelectItem value="Casual & Friendly">Casual & Friendly</SelectItem>
                <SelectItem value="Technical & Detailed">Technical & Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="structure">Structure</Label>
            <Textarea
              id="structure"
              value={config.structure}
              onChange={(e) => handleChange("structure", e.target.value.slice(0, 1000))}
              placeholder="Define the structure of your newsletter"
              className="min-h-32"
              maxLength={1000}
              disabled={isFormDisabled}
            />
            <p className="text-sm text-muted-foreground">
              {1000 - (config.structure?.length || 0)} characters remaining
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalInstructions">Additional Instructions (Optional)</Label>
            <Textarea
              id="additionalInstructions"
              value={config.additionalInstructions || ""}
              onChange={(e) => handleChange("additionalInstructions", e.target.value.slice(0, 300))}
              placeholder="Any additional instructions for the newsletter generation"
              className="min-h-32"
              maxLength={300}
              disabled={isFormDisabled}
            />
            <p className="text-sm text-muted-foreground">
              {300 - (config.additionalInstructions?.length || 0)} characters remaining
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isFormDisabled}
            className="w-full bg-[#208036] hover:bg-[#208036]/90 dark:bg-[#40b25d] dark:hover:bg-[#40b25d]/90"
          >
            {isGenerating ? "Generating..." : isRedirecting ? "Redirecting..." : "Generate Newsletter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 