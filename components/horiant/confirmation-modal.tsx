"use client"

import { motion, AnimatePresence } from "framer-motion"

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message: string
    confirmLabel?: string
    isLoading?: boolean
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Removal",
    message,
    confirmLabel = "Confirm",
    isLoading = false,
}: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-1/2 top-1/2 z-[60] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-4"
                    >
                        <div className="overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#0A0F16] shadow-2xl">
                            <div className="p-6">
                                <h3 className="mb-2 font-serif text-lg font-light tracking-tight text-foreground">
                                    {title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {message}
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-3 border-t border-white/[0.04] px-6 py-4">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="rounded-lg px-5 py-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="rounded-lg bg-[#D4AF37] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
                                >
                                    {isLoading ? "..." : confirmLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
