import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateNewsletter(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional newsletter writer. Your task is to create a well-structured, informative, and engaging newsletter based on the provided prompt. 
          
          Format the content with appropriate HTML tags for email rendering.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    return response.choices[0].message.content || "Failed to generate newsletter content."
  } catch (error) {
    console.error("Error generating newsletter:", error)
    throw new Error("Failed to generate newsletter content")
  }
} 