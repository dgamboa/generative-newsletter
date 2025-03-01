"use client"

import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ArrowRight, Mail, Sparkles, Clock, Edit } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Generate Professional Newsletters with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Create, edit, and send beautiful newsletters in minutes using the power of AI.
            Save time and deliver consistent, high-quality content to your audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight size={16} />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="gap-2" asChild>
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Everything you need to create and distribute professional newsletters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Generation</h3>
            <p className="text-muted-foreground">
              Generate complete, well-structured newsletters with a single click using advanced AI.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Edit className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Rich Text Editor</h3>
            <p className="text-muted-foreground">
              Easily edit and refine your newsletter content with our intuitive rich text editor.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Direct Email Sending</h3>
            <p className="text-muted-foreground">
              Send your newsletters directly to your audience with just a few clicks.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 border-t">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto mb-8">
            Join today and create your first AI-generated newsletter in minutes.
          </p>
          <div className="flex justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="gap-2">
                  Sign Up Now <ArrowRight size={16} />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="gap-2" asChild>
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>
    </div>
  )
}
