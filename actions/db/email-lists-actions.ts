"use server"

import { createEmailList, deleteEmailList, getEmailListById, getEmailListsByUserId, updateEmailList } from "@/db/queries/email-lists-queries"
import { InsertEmailList, SelectEmailList } from "@/db/schema/email-lists-schema"
import { ActionState } from "@/types"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function createEmailListAction(
  emailList: Omit<InsertEmailList, "userId">
): Promise<ActionState> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        status: "error",
        message: "You must be logged in to create an email list"
      }
    }

    const newEmailList = await createEmailList({
      ...emailList,
      userId
    })

    revalidatePath("/")
    
    return {
      status: "success",
      message: "Email list created successfully",
      data: newEmailList
    }
  } catch (error) {
    console.error("Error creating email list:", error)
    return {
      status: "error",
      message: "Failed to create email list"
    }
  }
}

export async function getEmailListsByUserIdAction(): Promise<ActionState> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        status: "error",
        message: "You must be logged in to get email lists"
      }
    }

    const emailLists = await getEmailListsByUserId(userId)
    
    return {
      status: "success",
      message: "Email lists retrieved successfully",
      data: emailLists
    }
  } catch (error) {
    console.error("Error getting email lists:", error)
    return {
      status: "error",
      message: "Failed to get email lists"
    }
  }
}

export async function getEmailListByIdAction(
  id: string
): Promise<ActionState> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        status: "error",
        message: "You must be logged in to get an email list"
      }
    }

    const emailList = await getEmailListById(id)
    
    if (!emailList) {
      return {
        status: "error",
        message: "Email list not found"
      }
    }

    if (emailList.userId !== userId) {
      return {
        status: "error",
        message: "You do not have permission to access this email list"
      }
    }
    
    return {
      status: "success",
      message: "Email list retrieved successfully",
      data: emailList
    }
  } catch (error) {
    console.error("Error getting email list:", error)
    return {
      status: "error",
      message: "Failed to get email list"
    }
  }
}

export async function updateEmailListAction(
  id: string,
  data: Partial<InsertEmailList>
): Promise<ActionState> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        status: "error",
        message: "You must be logged in to update an email list"
      }
    }

    // Check if the email list exists and belongs to the user
    const emailList = await getEmailListById(id)
    
    if (!emailList) {
      return {
        status: "error",
        message: "Email list not found"
      }
    }

    if (emailList.userId !== userId) {
      return {
        status: "error",
        message: "You do not have permission to update this email list"
      }
    }

    const updatedEmailList = await updateEmailList(id, data)
    
    revalidatePath("/")
    
    return {
      status: "success",
      message: "Email list updated successfully",
      data: updatedEmailList
    }
  } catch (error) {
    console.error("Error updating email list:", error)
    return {
      status: "error",
      message: "Failed to update email list"
    }
  }
}

export async function deleteEmailListAction(
  id: string
): Promise<ActionState> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return {
        status: "error",
        message: "You must be logged in to delete an email list"
      }
    }

    // Check if the email list exists and belongs to the user
    const emailList = await getEmailListById(id)
    
    if (!emailList) {
      return {
        status: "error",
        message: "Email list not found"
      }
    }

    if (emailList.userId !== userId) {
      return {
        status: "error",
        message: "You do not have permission to delete this email list"
      }
    }

    const deletedEmailList = await deleteEmailList(id)
    
    revalidatePath("/")
    
    return {
      status: "success",
      message: "Email list deleted successfully",
      data: deletedEmailList
    }
  } catch (error) {
    console.error("Error deleting email list:", error)
    return {
      status: "error",
      message: "Failed to delete email list"
    }
  }
} 