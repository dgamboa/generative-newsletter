"use server"

import { createNewsletterAction } from "@/actions/db/newsletters-actions"
import { generateNewsletter } from "@/lib/openai"
import { generateNewsletterWithPerplexity } from "@/lib/perplexity"
import { ActionState } from "@/types"
import { auth } from "@clerk/nextjs/server"

export type LLMProvider = "openai" | "perplexity"

export async function generateNewsletterAction(
  prompt: string,
  title: string,
  provider: LLMProvider = "perplexity"
): Promise<ActionState> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        status: "error",
        message: "You must be logged in to generate a newsletter"
      }
    }

    // Generate newsletter content using the selected provider
    let content: string
    if (provider === "perplexity") {
      content = await generateNewsletterWithPerplexity(prompt)
    } else {
      content = await generateNewsletter(prompt)
    }

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
      message: `Newsletter generated successfully using ${provider}`,
      data: result.data
    }
  } catch (error) {
    console.error(`Error generating newsletter with ${provider}:`, error)
    return {
      status: "error",
      message: `Failed to generate newsletter with ${provider}`
    }
  }
} 