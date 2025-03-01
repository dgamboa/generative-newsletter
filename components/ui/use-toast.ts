"use client"

import { useState, useEffect, useCallback } from "react"

type ToastVariant = "default" | "destructive"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }
    
    setToasts((prevToasts) => [...prevToasts, newToast])
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))
    }, 5000)
    
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))
  }, [])

  // Render toasts in a portal
  useEffect(() => {
    if (toasts.length > 0) {
      const toastContainer = document.getElementById("toast-container")
      
      if (!toastContainer) {
        const container = document.createElement("div")
        container.id = "toast-container"
        container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2"
        document.body.appendChild(container)
      }
      
      return () => {
        const container = document.getElementById("toast-container")
        if (container && toasts.length === 0) {
          document.body.removeChild(container)
        }
      }
    }
  }, [toasts])

  // Render toasts
  useEffect(() => {
    const toastContainer = document.getElementById("toast-container")
    
    if (toastContainer) {
      toastContainer.innerHTML = ""
      
      toasts.forEach((toast) => {
        const toastElement = document.createElement("div")
        toastElement.className = `p-4 rounded-md shadow-md transition-all duration-300 ${
          toast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background border"
        }`
        
        const titleElement = document.createElement("div")
        titleElement.className = "font-medium"
        titleElement.textContent = toast.title
        
        const closeButton = document.createElement("button")
        closeButton.className = "absolute top-2 right-2 text-sm opacity-70 hover:opacity-100"
        closeButton.textContent = "×"
        closeButton.onclick = () => dismiss(toast.id)
        
        toastElement.appendChild(titleElement)
        
        if (toast.description) {
          const descriptionElement = document.createElement("div")
          descriptionElement.className = "text-sm opacity-90 mt-1"
          descriptionElement.textContent = toast.description
          toastElement.appendChild(descriptionElement)
        }
        
        toastElement.appendChild(closeButton)
        toastContainer.appendChild(toastElement)
      })
    }
  }, [toasts, dismiss])

  return { toast, dismiss }
} 