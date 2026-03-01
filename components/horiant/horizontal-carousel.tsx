"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HorizontalCarouselProps {
    title: string
    subtitle?: string
    children: React.ReactNode
}

export function HorizontalCarousel({ title, subtitle, children }: HorizontalCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (dir: number) => {
        scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" })
    }

    return (
        <section className="relative py-12 sm:py-16">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between px-1">
                <div>
                    {subtitle && (
                        <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                            {subtitle}
                        </p>
                    )}
                    <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
                        {title}
                    </h2>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                    <button
                        onClick={() => scroll(-1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-[#0A0F16] text-muted-foreground transition-colors hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-[#0A0F16] text-muted-foreground transition-colors hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Scrollable Row */}
            <div
                ref={scrollRef}
                className="flex flex-row flex-nowrap gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {children}
            </div>

            {/* Hide scrollbar globally via WebKit */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    )
}
