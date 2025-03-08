"use client"

import { SelectNewsletter } from "@/db/schema"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Edit, Eye, Trash2 } from "lucide-react"

interface NewsletterCardProps {
  newsletter: SelectNewsletter
  onDelete: (id: string) => void
}

export default function NewsletterCard({
  newsletter,
  onDelete
}: NewsletterCardProps) {
  const { id, title, status, createdAt, sentAt } = newsletter
  
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true
  })
  
  const formattedSentDate = sentAt
    ? formatDistanceToNow(new Date(sentAt), { addSuffix: true })
    : null

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md group border-border/70 hover:border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold line-clamp-1">{title}</CardTitle>
            <CardDescription className="text-xs mt-1">Created {formattedDate}</CardDescription>
          </div>
          <Badge 
            variant={status === "draft" ? "outline" : "default"}
            className={status === "draft" 
              ? "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
              : "bg-green-50 text-green-900 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            }
          >
            {status === "draft" ? "Draft" : "Sent"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {status === "sent" && sentAt ? (
          <p className="text-sm text-muted-foreground flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Sent {formattedSentDate}
          </p>
        ) : (
          <div className="h-6"></div> 
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/20 pt-3 pb-3">
        <Button variant="ghost" asChild className="gap-2 text-sm font-normal group-hover:bg-background/80">
          <Link href={`/newsletters/${id}`}>
            {status === "draft" ? (
              <>
                <Edit size={14} /> Edit
              </>
            ) : (
              <>
                <Eye size={14} /> View
              </>
            )}
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => onDelete(id)}
          className="gap-2 text-sm font-normal text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 size={14} /> Delete
        </Button>
      </CardFooter>
    </Card>
  )
} 