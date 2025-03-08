"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-b from-background to-muted/30 text-foreground sticky top-0 z-50 border-b border-border p-5">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between border-t border-white">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl font-medium tracking-tight transition-transform group-hover:scale-105">
            <span className="text-foreground">New</span>
            <span className="text-primary">Stream</span>
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">
                Sign In
              </span>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <span className="text-foreground hover:text-primary transition-colors font-medium mr-4">
                Dashboard
              </span>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="hover:bg-foreground/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-background text-foreground p-4 animate-in slide-in-from-top-5 duration-200">
          <ul className="space-y-2">
            <SignedIn>
              <li>
                <Link
                  href="/dashboard"
                  className="block py-2 px-3 hover:bg-foreground/10 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
              </li>
            </SignedIn>
          </ul>
        </nav>
      )}
    </header>
  );
}