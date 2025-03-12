"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { getEmailListsByUserIdAction, updateEmailListAction } from "@/actions/db/email-lists-actions"
import { useToast } from "@/components/ui/use-toast"
import { SelectEmailList } from "@/db/schema/email-lists-schema"

interface UpdateEmailListModalProps {
  isOpen: boolean
  onClose: () => void
  emails: string[]
}

export default function UpdateEmailListModal({
  isOpen,
  onClose,
  emails
}: UpdateEmailListModalProps) {
  const [emailLists, setEmailLists] = useState<SelectEmailList[]>([])
  const [selectedListId, setSelectedListId] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { toast } = useToast()

  // Fetch email lists when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchEmailLists()
    } else {
      // Reset state when modal closes
      setSelectedListId("")
    }
  }, [isOpen])

  const fetchEmailLists = async () => {
    setIsFetching(true)
    try {
      const result = await getEmailListsByUserIdAction()
      
      if (result.status === "success" && result.data) {
        setEmailLists(result.data)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch email lists",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching email lists:", error)
      toast({
        title: "Error",
        description: "Failed to fetch email lists",
        variant: "destructive"
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedListId) return
    
    setIsUpdating(true)
    
    try {
      const selectedList = emailLists.find(list => list.id === selectedListId)
      
      if (!selectedList) {
        toast({
          title: "Error",
          description: "Selected list not found",
          variant: "destructive"
        })
        return
      }
      
      const result = await updateEmailListAction(selectedListId, {
        emails
      })
      
      if (result.status === "success") {
        toast({
          title: "Success",
          description: `Updated "${selectedList.name}" with ${emails.length} email addresses`
        })
        onClose()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update email list",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating email list:", error)
      toast({
        title: "Error",
        description: "Failed to update email list",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Email List</DialogTitle>
          <DialogDescription>
            Select an email list to update with the current {emails.length} email addresses.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isFetching ? (
            <div className="h-10 bg-muted/20 rounded-md animate-pulse" />
          ) : emailLists.length === 0 ? (
            <p className="text-muted-foreground">You don't have any saved email lists yet.</p>
          ) : (
            <Select
              value={selectedListId}
              onValueChange={setSelectedListId}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an email list to update" />
              </SelectTrigger>
              <SelectContent>
                {emailLists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name} ({list.emails.length} {list.emails.length === 1 ? "email" : "emails"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating || !selectedListId || emailLists.length === 0}
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 