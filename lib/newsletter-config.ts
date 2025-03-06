"use server"

import fs from "fs"
import path from "path"
import { NewsletterConfig } from "@/types"

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

export async function generatePromptFromCustomConfig(config: NewsletterConfig): Promise<string> {
  try {
    // Convert the config object to markdown format
    const configMarkdown = `# Newsletter Configuration

## Title
${config.title}

## Focus
${config.focus}

## Time Period
${config.timePeriod}

## Tone
${config.tone}

## Structure
${config.structure}

${config.additionalInstructions ? `## Additional Instructions
${config.additionalInstructions}` : ''}
`;
    
    return `Please generate a newsletter based on the following configuration:
    
${configMarkdown}

Create a complete, well-structured newsletter that follows all the guidelines above. The newsletter should be formatted with HTML for email delivery.`
  } catch (error) {
    console.error("Error generating prompt from custom config:", error)
    throw new Error("Failed to generate prompt from custom configuration")
  }
} 