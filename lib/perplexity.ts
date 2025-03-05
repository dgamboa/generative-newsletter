import axios from "axios"

// Create axios client without setting the Authorization header at initialization
const perplexityClient = axios.create({
  baseURL: "https://api.perplexity.ai",
  headers: {
    "Content-Type": "application/json"
  }
})

export async function generateNewsletterWithPerplexity(prompt: string): Promise<{ content: string; citations: string[] }> {
  try {
    // Get API key at function call time
    const apiKey = process.env.PERPLEXITY_API_KEY
    
    if (!apiKey) {
      throw new Error("PERPLEXITY_API_KEY is not set in environment variables")
    }

    const response = await perplexityClient.post("/chat/completions", {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: `You are a professional newsletter writer. Your task is to create a well-structured, informative, and engaging newsletter based on the provided prompt. 
          
          The newsletter should include:
          1. A compelling title
          2. An introduction that sets the context
          3. 3-5 main sections with relevant content
          4. A conclusion or call to action
          
          Format the content with appropriate HTML tags for email rendering.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    })

    console.log("Perplexity response:", response.data)

    const content = response.data.choices[0].message.content || "Failed to generate newsletter content."
    const citations = response.data.citations || []

    return { content, citations }
  } catch (error) {
    console.error("Error generating newsletter with Perplexity:", error)
    throw new Error("Failed to generate newsletter content with Perplexity")
  }
}

// Test function to verify the Perplexity API implementation
export async function testPerplexityAPI(): Promise<boolean> {
  try {
    // Get API key at function call time
    const apiKey = process.env.PERPLEXITY_API_KEY
    
    if (!apiKey) {
      console.error("PERPLEXITY_API_KEY is not set in environment variables")
      return false
    }
    
    const testPrompt = "Generate a short test newsletter about technology trends."
    const result = await generateNewsletterWithPerplexity(testPrompt)
    return result.content.length > 0
  } catch (error) {
    console.error("Perplexity API test failed:", error)
    return false
  }
} 