"use client"

import { useState, useEffect } from "react"
import { SelectNewsletter } from "@/db/schema"
import { updateNewsletterAction } from "@/actions/db/newsletters-actions"
import { sendNewsletterAction } from "@/actions/newsletter-sending-actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import TipTapEditor from "@/components/ui/tiptap-editor"
import NewsletterPreview from "@/components/ui/newsletter-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SaveIcon, SendIcon } from "lucide-react"

interface NewsletterEditorProps {
  initialNewsletter: SelectNewsletter
}

export default function NewsletterEditor({
  initialNewsletter
}: NewsletterEditorProps) {
  const [title, setTitle] = useState(initialNewsletter.title)
  const [content, setContent] = useState(initialNewsletter.content)
  const [recipients, setRecipients] = useState<string[]>(initialNewsletter.recipients || [])
  const [recipientInput, setRecipientInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Auto-save when switching to recipients tab
  useEffect(() => {
    if (activeTab === "recipients" && title.trim()) {
      handleSave(false)
    }
  }, [activeTab])

  const handleSave = async (showToast = true) => {
    if (!title.trim()) {
      if (showToast) {
        toast({
          title: "Error",
          description: "Please enter a title for your newsletter",
          variant: "destructive"
        })
      }
      return
    }

    setIsSaving(true)
    
    try {
      const result = await updateNewsletterAction(initialNewsletter.id, {
        title,
        content
      })
      
      if (result.status === "success") {
        if (showToast) {
          toast({
            title: "Success",
            description: "Newsletter saved successfully"
          })
        }
      } else {
        if (showToast) {
          toast({
            title: "Error",
            description: result.message || "Failed to save newsletter",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      console.error("Error saving newsletter:", error)
      if (showToast) {
        toast({
          title: "Error",
          description: "Failed to save newsletter",
          variant: "destructive"
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddRecipient = () => {
    if (!recipientInput.trim()) return
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientInput)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }
    
    if (!recipients.includes(recipientInput)) {
      setRecipients([...recipients, recipientInput])
    }
    
    setRecipientInput("")
  }

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email))
  }

  const handleSend = async () => {
    if (recipients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one recipient",
        variant: "destructive"
      })
      return
    }

    setIsSending(true)
    
    try {
      const result = await sendNewsletterAction(initialNewsletter.id, recipients)
      
      if (result.status === "success") {
        toast({
          title: "Success",
          description: "Newsletter sent successfully"
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send newsletter",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error sending newsletter:", error)
      toast({
        title: "Error",
        description: "Failed to send newsletter",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Newsletter</h1>
          <div className="h-10 w-24 bg-muted/20 rounded-md animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted/20 rounded-md animate-pulse" />
        </div>
        <div className="h-[400px] w-full bg-muted/20 rounded-md animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Newsletter</h1>
        <Button 
          onClick={() => handleSave(true)} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <SaveIcon size={16} />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Newsletter Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter newsletter title"
            className="dark:bg-[#222] dark:border-gray-700"
          />
        </div>
      </div>
      
      <Tabs defaultValue="edit" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4 bg-white rounded-md p-4">
          <TipTapEditor value={content} onChange={setContent} />
        </TabsContent>
        
        <TabsContent value="preview">
          <NewsletterPreview title={title} content={content} />
        </TabsContent>
        
        <TabsContent value="recipients" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recipients</h3>
            
            <div className="flex gap-2">
              <Input
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                placeholder="Enter email address"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddRecipient()
                  }
                }}
              />
              <Button onClick={handleAddRecipient}>Add</Button>
            </div>
            
            <div className="space-y-2">
              {recipients.length === 0 ? (
                <p className="text-muted-foreground">No recipients added yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recipients.map((email) => (
                    <div
                      key={email}
                      className="bg-muted px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span className="text-sm">{email}</span>
                      <button
                        onClick={() => handleRemoveRecipient(email)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              onClick={handleSend}
              disabled={isSending || recipients.length === 0}
              className="flex items-center gap-2"
            >
              <SendIcon size={16} />
              {isSending ? "Sending..." : "Send Newsletter"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 