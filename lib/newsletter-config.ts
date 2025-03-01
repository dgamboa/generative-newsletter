"use server"

import fs from "fs"
import path from "path"

export async function getNewsletterConfig(): Promise<string> {
  try {
    const configPath = path.join(process.cwd(), "prompts", "newsletter-config.md")
    const configContent = fs.readFileSync(configPath, "utf8")
    return configContent
  } catch (error) {
    console.error("Error reading newsletter config:", error)
    throw new Error("Failed to read newsletter configuration")
  }
}

export async function generatePromptFromConfig(): Promise<string> {
  try {
    const config = await getNewsletterConfig()
    
    return `Please generate a newsletter based on the following configuration:
    
${config}

Create a complete, well-structured newsletter that follows all the guidelines above. The newsletter should be formatted with HTML for email delivery.`
  } catch (error) {
    console.error("Error generating prompt from config:", error)
    throw new Error("Failed to generate prompt from configuration")
  }
} 