# Perplexity API Integration

This document provides instructions for setting up and using the Perplexity API integration for newsletter generation.

## Setup

1. Sign up for a Perplexity API key at [https://www.perplexity.ai/](https://www.perplexity.ai/)

2. Add your Perplexity API key to the `.env.local` file:
   ```
   PERPLEXITY_API_KEY=your_api_key_here
   ```

3. Restart your development server if it's running:
   ```bash
   npm run dev
   ```

## Testing the Integration

You can test the Perplexity API integration using the following commands:

1. Check if your environment variables are set correctly:
   ```bash
   npm run check:env
   ```

2. Test the Perplexity API with a sample newsletter generation:
   ```bash
   npm run test:perplexity
   ```

## Troubleshooting

If you encounter issues with the Perplexity API integration, check the following:

1. Make sure your Perplexity API key is correctly set in the `.env.local` file
2. Verify that the API key is valid and has not expired
3. Check the server logs for any error messages
4. Ensure you're using the correct model name ("sonar-pro")
5. Verify that your account has access to the sonar-pro model

### Common Issues

#### 401 Unauthorized Error

If you see a 401 Unauthorized error, it means your API key is invalid or has expired. Try the following:

1. Verify that your API key is correctly formatted and doesn't have any extra spaces or characters
2. Check that your Perplexity account has access to the API and the sonar-pro model
3. Generate a new API key if necessary

#### Environment Variable Not Found

If you see "PERPLEXITY_API_KEY is not set in environment variables", try the following:

1. Run the check:env script to verify your environment variables:
   ```bash
   npm run check:env
   ```

2. Make sure your `.env.local` file exists and contains the PERPLEXITY_API_KEY variable

3. Restart your development server after updating the `.env.local` file

## Using the Perplexity API in the Application

The application now supports both OpenAI and Perplexity as LLM providers for newsletter generation.

### Server Actions

To generate a newsletter using Perplexity, use the `generateNewsletterAction` with the provider parameter:

```typescript
import { generateNewsletterAction } from "@/actions/newsletter-generation-actions"

// Generate with Perplexity
const result = await generateNewsletterAction(prompt, title, "perplexity")
```

If you continue to experience issues, please refer to the [Perplexity API documentation](https://docs.perplexity.ai/api-reference/chat-completions) for more information. 