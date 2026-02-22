"use client"

import { ChevronDown } from "lucide-react"

interface HeroSectionProps {
  onViewSpecs: () => void
}

export function HeroSection({ onViewSpecs }: HeroSectionProps) {
  return (
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
            {"A. Lange & S\u00F6hne"}
          </span>
          <br />
          <span className="text-balance text-[#D4AF37]/90">Datograph.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 max-w-lg text-base font-light leading-relaxed tracking-wide text-muted-foreground md:text-lg">
          The pinnacle of German watchmaking.
        </p>

        {/* Buttons */}
        <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <button
            onClick={onViewSpecs}
            className="group relative inline-flex items-center gap-2 border border-[#D4AF37]/40 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-500 hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/5"
          >
            View Specs
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              {"->"}
            </span>
          </button>
          <button className="inline-flex items-center gap-2 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-all duration-500 hover:text-foreground">
            Add to SOTC
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Scroll
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce text-muted-foreground/30" />
      </div>
    </section>
  )
}
