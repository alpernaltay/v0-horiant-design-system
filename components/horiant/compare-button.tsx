"use client"

import { Plus, Check } from "lucide-react"
import { useCompare, CompareWatch } from "@/context/compare-context"
import { motion, AnimatePresence } from "framer-motion"

interface CompareButtonProps {
    watch: CompareWatch;
    className?: string;
}

export function CompareButton({ watch, className = "" }: CompareButtonProps) {
    const { compareList, addToCompare, removeFromCompare, isHydrated } = useCompare()

    if (!isHydrated) return null

    const isSelected = compareList.some((w) => w.id === watch.id)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isSelected) {
            removeFromCompare(watch.id)
        } else {
            addToCompare(watch)
        }
    }

    return (
        <button
            onClick={handleClick}
            className={`absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${isSelected
                    ? "bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37]"
                    : "bg-black/40 border border-white/10 text-white/70 hover:bg-black/60 hover:text-white"
                } ${className}`}
            aria-label={isSelected ? "Remove from comparison" : "Add to comparison"}
        >
            <AnimatePresence mode="wait">
                {isSelected ? (
                    <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                    >
                        <Check className="h-4 w-4" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="plus"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                    >
                        <Plus className="h-4 w-4" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    )
}
