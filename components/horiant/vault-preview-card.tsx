"use client"

import Link from "next/link"

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop"

interface VaultPreviewCardProps {
    profile: {
        id: string
        username?: string
        avatar_url?: string | null
        vault_image_url?: string | null
        legacy_score?: number
        total_pieces?: number
    }
    size?: "normal" | "hero"
}

export function VaultPreviewCard({ profile, size = "normal" }: VaultPreviewCardProps) {
    const initial = (profile.username || "?").charAt(0).toUpperCase()
    const isHero = size === "hero"
    const coverImg = profile.vault_image_url || PLACEHOLDER_IMG

    return (
        <Link
            href={`/vault/${profile.username || profile.id}`}
            className={`group snap-start flex-shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0F16] transition-all duration-300 hover:border-[#D4AF37]/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.04)] ${isHero ? "w-full" : "w-[300px]"}`}
        >
            {/* Cover Image — landscape 16:9 */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                    src={coverImg}
                    alt={`${profile.username || "Collector"}'s vault`}
                    className="h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F16] via-transparent to-transparent" />

                {/* Avatar badge */}
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.username || ""}
                            className="h-10 w-10 rounded-full border-2 border-[#D4AF37]/30 object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#D4AF37]/30 bg-[#131920] font-serif text-sm text-[#D4AF37]">
                            {initial}
                        </div>
                    )}
                    <span className="font-serif text-sm tracking-tight text-foreground drop-shadow-lg">
                        {profile.username || "Collector"}
                    </span>
                </div>
            </div>

            {/* Stats bar */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/50">Legacy</span>
                    <span className="font-mono text-xs text-[#D4AF37]">{profile.legacy_score ?? 0}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/50">Pieces</span>
                    <span className="font-mono text-xs text-foreground">{profile.total_pieces ?? 0}</span>
                </div>
            </div>
        </Link>
    )
}

// ─── Skeleton Card (shown when list is empty) ────────────────────

export function VaultPreviewSkeleton() {
    return (
        <div className="w-[300px] flex-shrink-0 snap-start overflow-hidden rounded-xl border border-white/[0.04] bg-[#0A0F16]">
            <div className="aspect-[16/9] w-full animate-pulse bg-white/[0.03]" />
            <div className="flex items-center justify-between px-4 py-3">
                <div className="h-3 w-16 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-3 w-10 animate-pulse rounded bg-white/[0.06]" />
            </div>
        </div>
    )
}
