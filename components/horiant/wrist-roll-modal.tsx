"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Loader2, Image as ImageIcon, Watch } from "lucide-react"
import { createWristRoll } from "@/lib/actions/wrist-rolls"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// ─── Types ──────────────────────────────────────────────────────
// Flat interface — matches CollectionWatchItem shape directly.
// No nested `.watches` object. Simple and impossible to crash.

interface SimpleWatch {
    id: string
    brand: string
    model: string
}

interface WristRollModalProps {
    isOpen: boolean
    onClose: () => void
    watches: SimpleWatch[]
    initialWatchId?: string
}

// ─── Component ──────────────────────────────────────────────────

export function WristRollModal({ isOpen, onClose, watches = [], initialWatchId }: WristRollModalProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedWatchId, setSelectedWatchId] = useState(initialWatchId ?? "")
    const [caption, setCaption] = useState("")

    // ── Handlers ──

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB")
            return
        }

        setSelectedFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const resetForm = () => {
        setPreview(null)
        setSelectedFile(null)
        setCaption("")
        setSelectedWatchId(initialWatchId ?? "")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) return toast.error("Please select a photo.")
        if (!selectedWatchId) return toast.error("Please select a watch.")

        setIsSubmitting(true)

        const formData = new FormData()
        formData.append("watchId", selectedWatchId)
        formData.append("caption", caption)
        formData.append("image", selectedFile)

        const result = await createWristRoll(formData)

        if (result.success) {
            toast.success("Wrist-Roll published!")
            resetForm()
            onClose()
            router.refresh()
        } else {
            toast.error(result.message)
        }

        setIsSubmitting(false)
    }

    // ── Derived ──

    const safeWatches = (watches ?? []).filter(
        (w): w is SimpleWatch => w != null && typeof w.id === "string" && typeof w.brand === "string"
    )

    const hasWatches = safeWatches.length > 0

    // ── Render ──

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0F16] shadow-2xl">
                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-muted-foreground transition-colors hover:bg-black hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {!hasWatches ? (
                                /* ── Empty State ── */
                                <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                                        <Watch className="h-7 w-7 text-[#D4AF37]" />
                                    </div>
                                    <h3 className="mb-2 font-serif text-lg font-light text-foreground">
                                        No Watches in Your Vault
                                    </h3>
                                    <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                                        Add a watch to your collection first to post a wrist-roll to the community feed.
                                    </p>
                                </div>
                            ) : (
                                /* ── Upload Form ── */
                                <form onSubmit={handleSubmit} className="flex flex-col">
                                    {/* Image Uploader Area */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center border-b border-white/[0.04] transition-colors ${preview ? "bg-black" : "bg-[#131920] hover:bg-[#131920]/80"}`}
                                    >
                                        {preview ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center text-muted-foreground">
                                                <ImageIcon className="mb-4 h-8 w-8 opacity-50" />
                                                <span className="text-[11px] uppercase tracking-[0.15em]">Select Photo</span>
                                                <span className="mt-2 text-xs opacity-50">Max 5MB</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    {/* Form Fields */}
                                    <div className="p-6">
                                        <div className="mb-6">
                                            <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                                Which Watch?
                                            </label>
                                            <select
                                                value={selectedWatchId}
                                                onChange={(e) => setSelectedWatchId(e.target.value)}
                                                required
                                                className="w-full appearance-none rounded-lg border border-white/[0.08] bg-[#131920] px-4 py-3 text-sm text-foreground outline-none focus:border-[#D4AF37]/50"
                                            >
                                                <option value="" disabled>Select from your Vault...</option>
                                                {safeWatches.map((w) => (
                                                    <option key={w.id} value={w.id}>
                                                        {w.brand} {w.model}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-6">
                                            <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                                Caption
                                            </label>
                                            <textarea
                                                value={caption}
                                                onChange={(e) => setCaption(e.target.value)}
                                                placeholder="Write a caption..."
                                                rows={2}
                                                className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#131920] px-4 py-3 text-sm text-foreground outline-none focus:border-[#D4AF37]/50"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !selectedFile || !selectedWatchId}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition-transform duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4" /> Publish to Feed
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
