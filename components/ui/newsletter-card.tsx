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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>Created {formattedDate}</CardDescription>
          </div>
          <Badge variant={status === "draft" ? "outline" : "default"}>
            {status === "draft" ? "Draft" : "Sent"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {status === "sent" && sentAt && (
          <p className="text-sm text-muted-foreground">Sent {formattedSentDate}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/newsletters/${id}`}>
            {status === "draft" ? "Edit" : "View"}
          </Link>
        </Button>
        <Button variant="destructive" onClick={() => onDelete(id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
} 