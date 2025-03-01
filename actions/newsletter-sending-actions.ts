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

    // Send the newsletter to each recipient
    const msg = {
      to: recipients,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "",
        name: "Daniel's Newsletter"
      },
      subject: newsletter.title,
      html: newsletter.content
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