"use client"

import Link from "next/link"

interface VaultPreviewCardProps {
    profile: {
        id: string
        username: string
        avatar_url?: string | null
        vault_image_url?: string | null
        legacy_score?: number
        total_pieces?: number
    }
    rank?: number
    variant?: "normal" | "hero"
}

export function VaultPreviewCard({ profile, rank, variant = "normal" }: VaultPreviewCardProps) {
    const initial = (profile.username || "?").charAt(0).toUpperCase()
    const isHero = variant === "hero"
    const isGrandmaster = rank != null && rank <= 3
    const fallbackBg = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop"
    const bgImage = profile.vault_image_url || fallbackBg

    return (
        <Link
            href={`/vault/${profile.username || profile.id}`}
            className={`group relative block flex-shrink-0 snap-start overflow-hidden rounded-xl border border-white/[0.06] transition-all duration-500 hover:border-[#D4AF37]/25 hover:shadow-[0_0_40px_rgba(212,175,55,0.06)] ${isHero ? "w-full" : "w-[360px] sm:w-[400px]"}`}
        >
            {/* Background Image */}
            <div className={`relative w-full overflow-hidden ${isHero ? "aspect-[21/9]" : "aspect-[16/9]"}`}>
                <img
                    src={bgImage}
                    alt={`${profile.username}'s vault`}
                    className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                />

                {/* Deep gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F16] via-[#0A0F16]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F16]/40 to-transparent" />

                {/* Grandmaster Badge — Top Right */}
                {isGrandmaster && (
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#131920]/80 px-3 py-1 backdrop-blur-md">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">Grandmaster</span>
                    </div>
                )}

                {/* Top Left — Avatar + Username */}
                <div className="absolute top-4 left-5 z-10 flex items-center gap-3">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.username}
                            className="h-10 w-10 rounded-full border-2 border-[#D4AF37]/30 object-cover shadow-lg"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#D4AF37]/30 bg-[#D4AF37]/10 font-serif text-sm text-[#D4AF37] shadow-lg">
                            {initial}
                        </div>
                    )}
                    <span className="font-serif text-base tracking-tight text-foreground drop-shadow-lg transition-colors group-hover:text-[#D4AF37]">
                        {profile.username || "Collector"}
                    </span>
                </div>

                {/* Bottom Left — Stats */}
                <div className="absolute bottom-4 left-5 z-10 flex items-center gap-5">
                    {profile.total_pieces != null && (
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-medium text-foreground drop-shadow-lg">{profile.total_pieces}</span>
                            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70">Timepieces</span>
                        </div>
                    )}
                    {profile.legacy_score != null && (
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-medium text-[#D4AF37] drop-shadow-lg">{profile.legacy_score}</span>
                            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70">Legacy</span>
                        </div>
                    )}
                </div>

                {/* Bottom gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
            </div>
        </Link>
    )
}
