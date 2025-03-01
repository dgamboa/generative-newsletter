"use server"

import { createNewsletterAction } from "@/actions/db/newsletters-actions"
import { generateNewsletter } from "@/lib/openai"
import { ActionState } from "@/types"
import { auth } from "@clerk/nextjs/server"

export async function generateNewsletterAction(
  prompt: string,
  title: string
): Promise<ActionState> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        status: "error",
        message: "You must be logged in to generate a newsletter"
      }
    }

    // Generate newsletter content using OpenAI
    const content = await generateNewsletter(prompt)

    // Create a new newsletter in the database
    const result = await createNewsletterAction({
      userId,
      title,
      content,
      status: "draft",
      recipients: []
    })

    return {
      status: "success",
      message: "Newsletter generated successfully",
      data: result.data
    }
  } catch (error) {
    console.error("Error generating newsletter:", error)
    return {
      status: "error",
      message: "Failed to generate newsletter"
    }
  }
} 