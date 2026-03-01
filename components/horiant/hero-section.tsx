"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { addToCollection } from "@/lib/actions/collections"
import { createClient } from "@/lib/supabase/client"
import type { WatchData } from "@/lib/mock-watches"

interface HeroSectionProps {
  featured: WatchData
}

export function HeroSection({ featured }: HeroSectionProps) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Check auth on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u))
  }, [])

  async function handleAddToCollection() {
    // Auth gate: if no user, show modal or redirect
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setAdding(true)
    try {
      const result = await addToCollection(featured.id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setAdding(false)
    }
  }

  return (
    <>
      <section className="mesh-gradient noise-overlay relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* Subtle radial highlight behind text */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_50%_45%,rgba(212,175,55,0.03),transparent)]" />

        <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
          {/* Super-title label */}
          <p className="mb-6 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
            Featured Timepiece
          </p>

          {/* Decorative gold line */}
          <div className="gold-line mb-10 w-16" />

          {/* Main heading */}
          <h1 className="font-serif text-4xl font-light leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="text-balance">
              {featured.brand}
            </span>
            <br />
            <span className="text-balance text-[#D4AF37]/90">{featured.model}.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 max-w-lg text-base font-light leading-relaxed tracking-wide text-muted-foreground md:text-lg">
            The pinnacle of {featured.style === "Chronograph" ? "German" : "fine"} watchmaking.
          </p>

          {/* Buttons */}
          <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href={`/watch/${featured.id}`}
              className="group relative inline-flex min-h-12 items-center gap-2 border border-[#D4AF37]/40 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-500 hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/5"
            >
              View Specs
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                {"->"}
              </span>
            </Link>
            <button
              onClick={handleAddToCollection}
              disabled={adding}
              className="inline-flex min-h-12 items-center gap-2 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-all duration-500 hover:text-foreground disabled:opacity-50"
            >
              {adding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to Collection"
              )}
            </button>
          </div>
        </div>

        {/* Scroll indicator — clickable */}
        <button
          onClick={() => document.getElementById('specs')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Scroll to content"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4 animate-bounce text-muted-foreground/30" />
        </button>
      </section>

      {/* Auth Gate Modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuthModal(false) }}
        >
          <div className="mx-4 w-full max-w-md rounded-xl border border-[#D4AF37]/20 bg-[#0D1117] p-8 shadow-2xl">
            <h3 className="mb-3 font-serif text-2xl tracking-tight text-foreground">Join the Heritage</h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Sign in to secure your vault, track your collection, and join the global horology community.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const returnTo = encodeURIComponent(window.location.pathname)
                  router.push(`/auth?returnTo=${returnTo}`)
                }}
                className="w-full rounded-lg bg-[#D4AF37] py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0F16] transition-colors hover:bg-[#C4A032]"
              >
                Sign In / Register
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
