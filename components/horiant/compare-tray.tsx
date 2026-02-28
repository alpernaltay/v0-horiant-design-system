"use client"

import { useCompare } from "@/context/compare-context"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { X, ArrowRight } from "lucide-react"

export function CompareTray() {
    const { compareList, removeFromCompare, clearCompare, isHydrated } = useCompare()

    if (!isHydrated) return null

    const hasItems = compareList.length > 0

    // Format the query parameters correctly based on slug vs id availability
    const idsParam = compareList.map((w) => w.slug || w.id).join(",")

    return (
        <AnimatePresence>
            {hasItems && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 w-full max-w-4xl px-4 pointer-events-none"
                >
                    <div className="flex h-20 items-center justify-between rounded-2xl border border-[#D4AF37]/30 bg-[#0A0F16]/80 px-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto">

                        {/* Left: Selected Watches */}
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Compare</span>
                                <span className="text-xs text-muted-foreground">{compareList.length} / 3 Selected</span>
                            </div>

                            <div className="hidden sm:block h-10 w-[1px] bg-white/[0.08]" />

                            <div className="flex items-center gap-2 sm:gap-3">
                                {compareList.map((watch) => (
                                    <div key={watch.id} className="group relative h-12 w-12 overflow-hidden rounded-lg border border-white/[0.08] bg-black/40">
                                        {watch.image ? (
                                            <Image
                                                src={watch.image}
                                                alt={watch.model}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-white/[0.02] p-1 text-center text-[8px] leading-tight text-muted-foreground">
                                                {watch.brand}
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                removeFromCompare(watch.id)
                                            }}
                                            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100"
                                        >
                                            <X className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                ))}

                                {/* Empty slots placeholders */}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="h-12 w-12 rounded-lg border border-dashed border-white/[0.1] bg-white/[0.02]" />
                                ))}
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={clearCompare}
                                className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
                            >
                                Clear
                            </button>
                            <Link
                                href={`/compare?ids=${idsParam}`}
                                className="flex items-center gap-2 rounded-full bg-[#D4AF37] px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.15em] text-black transition-transform hover:scale-105"
                            >
                                <span className="hidden sm:inline">Compare Technicals</span>
                                <span className="inline sm:hidden">Compare</span>
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
