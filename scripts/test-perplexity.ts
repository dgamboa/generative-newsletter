import dotenv from "dotenv"
import { generateNewsletterWithPerplexity } from "../lib/perplexity"
import path from "path"
import fs from "fs"

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local")
console.log(`Loading environment variables from: ${envPath}`)
console.log(`File exists: ${fs.existsSync(envPath) ? "Yes" : "No"}`)

dotenv.config({ path: envPath })

async function testPerplexityAPI() {
  try {
    console.log("\nTesting Perplexity API...")
    
    // Check if API key is set
    const apiKey = process.env.PERPLEXITY_API_KEY
    console.log(`PERPLEXITY_API_KEY: ${apiKey ? "Found (length: " + apiKey.length + ")" : "Not found"}`)
    
    if (!apiKey) {
      console.error("Error: PERPLEXITY_API_KEY is not set in environment variables")
      console.log("\nPlease add your Perplexity API key to the .env.local file:")
      console.log("PERPLEXITY_API_KEY=your_api_key_here")
      console.log("\nAfter adding the API key, restart your development server if it's running.")
      return
    }
    
    console.log("API Key found. Proceeding with test...")
    
    const testPrompt = "Generate a short newsletter about AI advancements in 2025."
    console.log(`Using test prompt: "${testPrompt}"`)
    
    console.log("Generating newsletter with Perplexity...")
    const result = await generateNewsletterWithPerplexity(testPrompt)
    
    console.log("\n--- Generated Newsletter ---\n")
    console.log(result)
    console.log("\n--- End of Newsletter ---\n")
    
    console.log("Test completed successfully!")
  } catch (error: any) {
    console.error("Test failed:", error)
    
    if (error.message && typeof error.message === 'string' && error.message.includes("401")) {
      console.log("\nYou received a 401 Unauthorized error. This means your API key is invalid or has expired.")
      console.log("Please check the following:")
      console.log("1. Verify that your API key is correctly formatted and doesn't have any extra spaces")
      console.log("2. Check that your Perplexity account has access to the API and the sonar-pro model")
      console.log("3. Generate a new API key if necessary")
    }
  }
}

// Run the test
testPerplexityAPI() 