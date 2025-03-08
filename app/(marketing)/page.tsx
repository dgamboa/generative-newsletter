"use client"

import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ArrowRight, Mail, Sparkles, Clock, Edit } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-16 md:py-24 lg:py-32 flex flex-col items-center text-center border-b">
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Newsletter Creation Made Simple
          </div>
          <h1 className="text-5xl md:text-6xl tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700">
            Generate Professional Newsletters with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-[700px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-900">
          Configure, generate, and send engaging newsletters to your audience in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-in fade-in slide-in-from-bottom-7 duration-1000">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="gap-2 shadow-lg bg-primary hover:bg-primary/90">
                  Get Started <ArrowRight size={16} />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="gap-2 shadow-lg bg-primary hover:bg-primary/90" asChild>
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Key Features</h2>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Everything you need to create and distribute professional newsletters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-secondary/20 flex flex-col items-center text-center p-8 border rounded-xl shadow-md">
            <div className="bg-primary/10 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI-Powered Generation</h3>
            <p className="text-muted-foreground">
              Generate complete, well-structured newsletters with a single click using advanced AI.
            </p>
          </div>

          <div className="bg-secondary/20 flex flex-col items-center text-center p-8 border rounded-xl shadow-md">
            <div className="bg-primary/10 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
              <Edit className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Rich Text Editor</h3>
            <p className="text-muted-foreground">
              Easily edit and refine your newsletter content with our intuitive rich text editor.
            </p>
          </div>

          <div className="bg-secondary/20 flex flex-col items-center text-center p-8 border rounded-xl shadow-md">
            <div className="bg-primary/10 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Direct Email Sending</h3>
            <p className="text-muted-foreground">
              Send your newsletters directly to your audience with just a few clicks.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
