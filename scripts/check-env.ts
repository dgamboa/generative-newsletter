import dotenv from "dotenv"
import path from "path"
import fs from "fs"

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local")
console.log(`Loading environment variables from: ${envPath}`)
console.log(`File exists: ${fs.existsSync(envPath) ? "Yes" : "No"}`)

if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const envLines = envContent.split('\n').filter(line => line.trim() !== '')
    console.log(`File contains ${envLines.length} non-empty lines`)
    
    // Check if PERPLEXITY_API_KEY exists in the file (without showing the actual key)
    const hasPerplexityKey = envLines.some(line => line.startsWith('PERPLEXITY_API_KEY='))
    console.log(`PERPLEXITY_API_KEY in file: ${hasPerplexityKey ? "Yes" : "No"}`)
  } catch (error) {
    console.error("Error reading .env.local file:", error)
  }
}

dotenv.config({ path: envPath })

console.log("\nChecking environment variables...")

// Check Perplexity API key
const perplexityApiKey = process.env.PERPLEXITY_API_KEY
console.log("PERPLEXITY_API_KEY:", perplexityApiKey ? `✅ Set (length: ${perplexityApiKey.length})` : "❌ Not set")

// Check OpenAI API key
const openaiApiKey = process.env.OPENAI_API_KEY
console.log("OPENAI_API_KEY:", openaiApiKey ? `✅ Set (length: ${openaiApiKey.length})` : "❌ Not set")

// Check other important environment variables
const databaseUrl = process.env.DATABASE_URL
console.log("DATABASE_URL:", databaseUrl ? "✅ Set" : "❌ Not set")

console.log("\nNote: Make sure you have added the required API keys to your .env.local file.")

if (!perplexityApiKey) {
  console.log("\nTo set up the Perplexity API key:")
  console.log("1. Sign up for a Perplexity API key at https://www.perplexity.ai/")
  console.log("2. Add the following line to your .env.local file:")
  console.log("   PERPLEXITY_API_KEY=your_api_key_here")
  console.log("3. Restart your development server if it's running")
}

console.log("\nIf you're running this in a development environment, restart your dev server after updating environment variables.") 