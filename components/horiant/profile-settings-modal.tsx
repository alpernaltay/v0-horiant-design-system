"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Save, User as UserIcon, Loader2 } from "lucide-react"
import { updateProfileSettings } from "@/lib/actions/collections"
import { toast } from "sonner"

interface ProfileSettingsModalProps {
    isOpen: boolean
    onClose: () => void
    currentUsername: string | null
    currentWristSize: number | null
}

export function ProfileSettingsModal({ isOpen, onClose, currentUsername, currentWristSize }: ProfileSettingsModalProps) {
    const [username, setUsername] = useState(currentUsername || "")
    const [wristSize, setWristSize] = useState<string>(currentWristSize ? currentWristSize.toString() : "")
    const [isSaving, setIsSaving] = useState(false)

    if (!isOpen) return null

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        if (!username.trim()) {
            toast.error("Username is required")
            return
        }

        setIsSaving(true)
        const sizeParsed = wristSize ? parseFloat(wristSize) : null
        const res = await updateProfileSettings(username, sizeParsed)

        if (res.success) {
            toast.success(res.message)
            onClose()
            // Reload to reflect changes
            window.location.reload()
        } else {
            toast.error(res.message)
        }
        setIsSaving(false)
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-[#131920] to-[#0A0F16] p-6 shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                            <UserIcon className="h-5 w-5 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h2 className="font-serif text-xl tracking-tight text-foreground">Profile Settings</h2>
                            <p className="text-xs text-muted-foreground">Manage your vault identity and fit preferences.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Unique Username</label>
                            <input
                                type="text"
                                placeholder="horology_enthusiast"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                className="w-full rounded-md border border-white/[0.08] bg-[#0A0F16] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[#D4AF37]/50"
                                required
                            />
                            <p className="text-[10px] text-muted-foreground/60">Letters, numbers, and underscores only. This modifies your public vault URL.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Wrist Size (cm)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="10"
                                max="25"
                                placeholder="17.0"
                                value={wristSize}
                                onChange={(e) => setWristSize(e.target.value)}
                                className="w-full rounded-md border border-white/[0.08] bg-[#0A0F16] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[#D4AF37]/50"
                            />
                            <p className="text-[10px] text-muted-foreground/60">Used to calculate the Smart Wrist Match across timepieces.</p>
                        </div>

                        <div className="mt-4 flex justify-end gap-3 border-t border-white/[0.08] pt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-2 rounded-md bg-[#D4AF37] px-6 py-2 text-xs font-semibold tracking-wider text-[#0A0F16] transition-opacity hover:opacity-90 disabled:opacity-60"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
