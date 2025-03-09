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
  const [templateStyle, setTemplateStyle] = useState<"classic" | "modern" | "minimal">(
    initialNewsletter.templateStyle as "classic" | "modern" | "minimal" || "classic"
  )
  const [citations, setCitations] = useState<string[]>(initialNewsletter.citations || [])
  const [recipients, setRecipients] = useState<string[]>(initialNewsletter.recipients || [])
  const [recipientInput, setRecipientInput] = useState("")
  const [citationInput, setCitationInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")
  const [sourcesExpanded, setSourcesExpanded] = useState(
    (initialNewsletter.citations && initialNewsletter.citations.length > 0) || false
  )
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
      toast({
        title: "Title required",
        description: "Please enter a title for your newsletter",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)

    try {
      const result = await updateNewsletterAction(initialNewsletter.id, {
        title,
        content,
        citations,
        recipients,
        templateStyle
      })

      if (result.status === "error") {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        })
        return
      }

      if (showToast) {
        toast({
          title: "Saved",
          description: "Your newsletter has been saved"
        })
      }

      router.refresh()
    } catch (error) {
      console.error("Error saving newsletter:", error)
      toast({
        title: "Error",
        description: "Failed to save newsletter",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handle template style change
  const handleTemplateChange = (template: "classic" | "modern" | "minimal") => {
    setTemplateStyle(template)
    // Auto-save when template changes
    if (title.trim()) {
      updateNewsletterAction(initialNewsletter.id, {
        templateStyle: template
      }).then(() => {
        router.refresh()
      })
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

  // Add a URL validation function
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAddCitation = () => {
    if (!citationInput.trim()) return;
    
    // URL validation
    if (!isValidUrl(citationInput)) {
      toast({
        title: "Error",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive"
      });
      return;
    }
    
    setCitations([...citations, citationInput.trim()]);
    setCitationInput("");
  };

  const handleUpdateCitation = (index: number, value: string) => {
    // Allow empty value during editing
    if (!value.trim()) {
      const newCitations = [...citations];
      newCitations[index] = value;
      setCitations(newCitations);
      return;
    }
    
    // URL validation
    if (!isValidUrl(value)) {
      toast({
        title: "Error",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive"
      });
      return;
    }
    
    const newCitations = [...citations];
    newCitations[index] = value.trim();
    setCitations(newCitations);
  };

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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => handleSave()}
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
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-black">
                Sources {citations.length > 0 && `(${citations.length})`}
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${sourcesExpanded ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            
            {sourcesExpanded && (
              <div className="space-y-3 mt-3">
                {citations.map((citation, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={citation}
                        onChange={(e) => {
                          // Allow typing without validation
                          const newCitations = [...citations];
                          newCitations[index] = e.target.value;
                          setCitations(newCitations);
                        }}
                        onBlur={(e) => handleUpdateCitation(index, e.target.value)}
                        placeholder="Enter source URL"
                        className={`pr-8 ${citation && !isValidUrl(citation) ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                      {citation && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          {isValidUrl(citation) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-green-500"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-red-500"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newCitations = citations.filter((_, i) => i !== index);
                        setCitations(newCitations);
                      }}
                      className="shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Add a new source URL"
                      value={citationInput}
                      onChange={(e) => setCitationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCitation();
                        }
                      }}
                      className={`pr-8 ${citationInput && !isValidUrl(citationInput) ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {citationInput && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {isValidUrl(citationInput) ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-500"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleAddCitation}
                    className="shrink-0"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <NewsletterPreview 
            title={title} 
            content={content} 
            citations={citations} 
            templateStyle={templateStyle}
            onTemplateChange={handleTemplateChange}
          />
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