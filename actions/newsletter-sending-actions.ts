"use server"

import { getNewsletterByIdAction, updateNewsletterAction } from "@/actions/db/newsletters-actions"
import { ActionState } from "@/types"
import { auth } from "@clerk/nextjs/server"
import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export async function sendNewsletterAction(
  newsletterId: string,
  recipients: string[]
): Promise<ActionState> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        status: "error",
        message: "You must be logged in to send a newsletter"
      }
    }

    // Get the newsletter
    const newsletterResult = await getNewsletterByIdAction(newsletterId)
    
    if (newsletterResult.status === "error" || !newsletterResult.data) {
      return {
        status: "error",
        message: "Newsletter not found"
      }
    }

    const newsletter = newsletterResult.data

    // Check if the newsletter belongs to the user
    if (newsletter.userId !== userId) {
      return {
        status: "error",
        message: "You do not have permission to send this newsletter"
      }
    }

    // Generate the email HTML using the template style
    const emailHtml = getEmailTemplate(
      newsletter.title,
      newsletter.content,
      newsletter.citations || [],
      newsletter.templateStyle as "classic" | "modern" | "minimal" || "classic"
    )

    // Send the newsletter to each recipient
    const msg = {
      to: recipients,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "",
        name: newsletter.title
      },
      subject: newsletter.title,
      html: emailHtml
    }

    await sgMail.send(msg)

    // Update the newsletter status to sent
    const updateResult = await updateNewsletterAction(newsletterId, {
      status: "sent",
      recipients,
      sentAt: new Date()
    })

    return {
      status: "success",
      message: "Newsletter sent successfully",
      data: updateResult.data
    }
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return {
      status: "error",
      message: "Failed to send newsletter"
    }
  }
}

// Email template generator
function getEmailTemplate(
  title: string, 
  content: string, 
  citations: string[] = [], 
  templateStyle: "classic" | "modern" | "minimal"
): string {
  // Base styles
  let headerStyle = '';
  let contentStyle = '';
  let footerStyle = '';
  let containerStyle = '';
  let bodyStyle = '';
  
  // Apply styles based on template selection
  switch(templateStyle) {
    case "modern":
      headerStyle = `
        background-color: #8B5CF6;
        color: white;
        padding: 20px;
        border-radius: 8px 8px 0 0;
        text-align: center;
      `;
      contentStyle = `
        padding: 24px;
        background-color: #ffffff;
        color: #333;
        line-height: 1.8;
      `;
      footerStyle = `
        background-color: #F3F4F6;
        padding: 15px;
        border-radius: 0 0 8px 8px;
        font-size: 12px;
        color: #666;
        text-align: center;
      `;
      containerStyle = `
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 0 auto;
      `;
      bodyStyle = `
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0 auto;
        padding: 20px;
        background-color: #F9FAFB;
      `;
      break;
      
    case "minimal":
      headerStyle = `
        border-bottom: 1px solid #eaeaea;
        padding: 15px;
        text-align: left;
      `;
      contentStyle = `
        padding: 24px;
        background-color: #ffffff;
        color: #333;
        line-height: 1.8;
      `;
      footerStyle = `
        border-top: 1px solid #eaeaea;
        padding: 15px;
        font-size: 12px;
        color: #888;
        text-align: left;
      `;
      containerStyle = `
        max-width: 600px;
        margin: 0 auto;
        border: 1px solid #eaeaea;
      `;
      bodyStyle = `
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
      `;
      break;
      
    case "classic":
    default:
      headerStyle = `
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 5px 5px 0 0;
        border-bottom: 2px solid #e0e0e0;
      `;
      contentStyle = `
        padding: 15px;
      `;
      footerStyle = `
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 0 0 5px 5px;
        border-top: 2px solid #e0e0e0;
        font-size: 12px;
        color: #666;
        text-align: center;
      `;
      containerStyle = '';
      bodyStyle = `
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      `;
      break;
  }

  // Generate citations HTML if available
  let citationsHtml = '';
  if (citations && citations.length > 0) {
    citationsHtml = `
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Sources</h3>
        <ol style="padding-left: 20px;">
          ${citations.map((citation, index) => `
            <li style="margin-bottom: 5px;">
              <a href="${citation}" style="color: #0066cc; text-decoration: underline;">${citation}</a>
            </li>
          `).join('')}
        </ol>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="${bodyStyle}">
      <div class="newsletter-container" style="${containerStyle}">
        <div class="newsletter-header" style="${headerStyle}">
          <h1 style="margin: 0; color: ${templateStyle === 'modern' ? '#ffffff' : '#444'}; font-size: 20px;">${title}</h1>
        </div>
        <div class="newsletter-content" style="${contentStyle}">
          ${content}
          ${citationsHtml}
        </div>
        <div class="newsletter-footer" style="${footerStyle}">
          <p>You received this newsletter because you subscribed to our mailing list.</p>
          <p><a href="#" style="color: #0066cc;">Unsubscribe</a> | <a href="#" style="color: #0066cc;">View in browser</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
} 