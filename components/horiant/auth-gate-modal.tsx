"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Shield } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGateModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AuthGateModal({ isOpen, onClose }: AuthGateModalProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handleSignIn = () => {
        onClose()
        // Encode current path so user returns here after login
        const returnTo = encodeURIComponent(pathname)
        router.push(`/login?returnTo=${returnTo}`)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-lg"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 10 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
                    >
                        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#131920] to-[#0A0F16] shadow-[0_0_80px_rgba(212,175,55,0.05)]">

                            {/* Decorative top line */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

                            {/* Content */}
                            <div className="flex flex-col items-center px-8 py-12 text-center sm:px-12 sm:py-16">

                                {/* Icon */}
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                                    <Shield className="h-7 w-7 text-[#D4AF37]" />
                                </div>

                                {/* Title */}
                                <h2 className="mb-3 font-serif text-2xl font-light tracking-tight text-foreground sm:text-3xl">
                                    Join the Heritage
                                </h2>

                                {/* Description */}
                                <p className="mb-10 max-w-xs text-sm leading-relaxed text-muted-foreground/70">
                                    Secure your vault, track your collection, and participate in the global horology community.
                                </p>

                                {/* CTA Button */}
                                <button
                                    onClick={handleSignIn}
                                    className="group mb-4 w-full max-w-[280px] rounded-lg border border-[#D4AF37]/60 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-[#0A0F16] shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:brightness-110"
                                >
                                    Sign In / Register
                                </button>

                                {/* Later button */}
                                <button
                                    onClick={onClose}
                                    className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
                                >
                                    Later
                                </button>
                            </div>

                            {/* Decorative bottom line */}
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
