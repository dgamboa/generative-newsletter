"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { createEmailListAction } from "@/actions/db/email-lists-actions"
import { useToast } from "@/components/ui/use-toast"

interface SaveEmailListModalProps {
  isOpen: boolean
  onClose: () => void
  emails: string[]
  onSuccess?: () => void
}

export default function SaveEmailListModal({
  isOpen,
  onClose,
  emails,
  onSuccess
}: SaveEmailListModalProps) {
  const [name, setName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your email list",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)

    try {
      const result = await createEmailListAction({
        name: name.trim(),
        emails
      })

      if (result.status === "error") {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Success",
        description: "Email list saved successfully"
      })

      setName("")
      onClose()
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving email list:", error)
      toast({
        title: "Error",
        description: "Failed to save email list",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Email List</DialogTitle>
          <DialogDescription>
            Save these {emails.length} email addresses as a list for future use.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Email List Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for this email list"
              autoFocus
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 