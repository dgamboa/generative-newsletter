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
import { getEmailListsByUserIdAction, getEmailListByIdAction } from "@/actions/db/email-lists-actions"
import { useToast } from "@/components/ui/use-toast"
import { SelectEmailList } from "@/db/schema/email-lists-schema"

interface LoadEmailListModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (emails: string[]) => void
}

export default function LoadEmailListModal({
  isOpen,
  onClose,
  onLoad
}: LoadEmailListModalProps) {
  const [emailLists, setEmailLists] = useState<SelectEmailList[]>([])
  const [selectedListId, setSelectedListId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
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

  const handleLoad = async () => {
    if (!selectedListId) return
    
    setIsLoading(true)
    
    try {
      const result = await getEmailListByIdAction(selectedListId)
      
      if (result.status === "success" && result.data) {
        onLoad(result.data.emails)
        onClose()
        toast({
          title: "Success",
          description: `Loaded ${result.data.emails.length} email addresses from "${result.data.name}"`
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load email list",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error loading email list:", error)
      toast({
        title: "Error",
        description: "Failed to load email list",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Load Email List</DialogTitle>
          <DialogDescription>
            Select an email list to load into your newsletter.
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
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an email list" />
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
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleLoad} 
            disabled={isLoading || !selectedListId || emailLists.length === 0}
          >
            {isLoading ? "Loading..." : "Load"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 