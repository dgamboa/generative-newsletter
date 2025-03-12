"use client"

import { useEffect, useState } from "react"
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
import { createEmailListAction, getEmailListsByUserIdAction } from "@/actions/db/email-lists-actions"
import { useToast } from "@/components/ui/use-toast"
import { SelectEmailList } from "@/db/schema/email-lists-schema"

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
  const [existingLists, setExistingLists] = useState<SelectEmailList[]>([])
  const [isNameTaken, setIsNameTaken] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { toast } = useToast()

  // Fetch existing lists when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchExistingLists()
    } else {
      // Reset state when modal closes
      setName("")
      setIsNameTaken(false)
    }
  }, [isOpen])

  // Check if name is taken when name changes
  useEffect(() => {
    if (name.trim()) {
      const nameExists = existingLists.some(
        list => list.name.toLowerCase() === name.trim().toLowerCase()
      )
      setIsNameTaken(nameExists)
    } else {
      setIsNameTaken(false)
    }
  }, [name, existingLists])

  const fetchExistingLists = async () => {
    setIsFetching(true)
    try {
      const result = await getEmailListsByUserIdAction()
      
      if (result.status === "success" && result.data) {
        setExistingLists(result.data)
      }
    } catch (error) {
      console.error("Error fetching email lists:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your email list",
        variant: "destructive"
      })
      return
    }

    if (isNameTaken) {
      toast({
        title: "Error",
        description: "A list with this name already exists. Please choose a different name.",
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
          <DialogTitle>Create Email List</DialogTitle>
          <DialogDescription>
            Save these {emails.length} email addresses as a new list.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Email List Name</Label>
            <div className="relative">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for this email list"
                autoFocus
                className={isNameTaken ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {isNameTaken && (
                <p className="text-sm text-red-500 mt-1">
                  A list with this name already exists
                </p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isNameTaken || !name.trim() || isFetching}
          >
            {isSaving ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 