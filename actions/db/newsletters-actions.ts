"use server"

import {
  createNewsletter,
  deleteNewsletter,
  getNewsletterById,
  getNewslettersByUserId,
  updateNewsletter
} from "@/db/queries/newsletters-queries"
import { InsertNewsletter, SelectNewsletter } from "@/db/schema"
import { ActionState } from "@/types"
import { revalidatePath } from "next/cache"

export async function createNewsletterAction(
  newsletter: InsertNewsletter
): Promise<ActionState> {
  try {
    const newNewsletter = await createNewsletter(newsletter)
    revalidatePath("/")
    return {
      status: "success",
      message: "Newsletter created successfully",
      data: newNewsletter
    }
  } catch (error) {
    console.error("Error creating newsletter:", error)
    return { status: "error", message: "Failed to create newsletter" }
  }
}

export async function getNewslettersByUserIdAction(
  userId: string
): Promise<ActionState> {
  try {
    const newsletters = await getNewslettersByUserId(userId)
    return {
      status: "success",
      message: "Newsletters retrieved successfully",
      data: newsletters
    }
  } catch (error) {
    console.error("Error getting newsletters:", error)
    return { status: "error", message: "Failed to get newsletters" }
  }
}

export async function getNewsletterByIdAction(
  id: string
): Promise<ActionState> {
  try {
    const newsletter = await getNewsletterById(id)
    if (!newsletter) {
      return { status: "error", message: "Newsletter not found" }
    }
    return {
      status: "success",
      message: "Newsletter retrieved successfully",
      data: newsletter
    }
  } catch (error) {
    console.error("Error getting newsletter:", error)
    return { status: "error", message: "Failed to get newsletter" }
  }
}

export async function updateNewsletterAction(
  id: string,
  data: Partial<InsertNewsletter>
): Promise<ActionState> {
  try {
    const updatedNewsletter = await updateNewsletter(id, data)
    revalidatePath("/")
    revalidatePath(`/newsletters/${id}`)
    return {
      status: "success",
      message: "Newsletter updated successfully",
      data: updatedNewsletter
    }
  } catch (error) {
    console.error("Error updating newsletter:", error)
    return { status: "error", message: "Failed to update newsletter" }
  }
}

export async function deleteNewsletterAction(
  id: string
): Promise<ActionState> {
  try {
    const deletedNewsletter = await deleteNewsletter(id)
    revalidatePath("/")
    return {
      status: "success",
      message: "Newsletter deleted successfully",
      data: deletedNewsletter
    }
  } catch (error) {
    console.error("Error deleting newsletter:", error)
    return { status: "error", message: "Failed to delete newsletter" }
  }
} 