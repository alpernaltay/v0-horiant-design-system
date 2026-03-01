"use client"

import Link from "next/link"

interface VaultCardProps {
    profile: {
        id: string
        username: string
        avatar_url?: string | null
        legacy_score?: number
        total_pieces?: number
    }
    size?: "normal" | "hero"
}

export function VaultCard({ profile, size = "normal" }: VaultCardProps) {
    const initial = (profile.username || "?").charAt(0).toUpperCase()
    const isHero = size === "hero"

    return (
        <Link
            href={`/vault/${profile.username || profile.id}`}
            className={`group snap-start flex-shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-b from-[#131920] to-[#0A0F16] transition-all duration-300 hover:border-[#D4AF37]/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.04)] ${isHero ? "w-[320px] sm:w-[360px]" : "w-[240px] sm:w-[260px]"}`}
        >
            <div className={`flex flex-col items-center gap-3 ${isHero ? "px-8 py-10" : "px-5 py-6"}`}>
                {/* Avatar */}
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt={profile.username}
                        className={`rounded-full border-2 border-[#D4AF37]/20 object-cover ${isHero ? "h-20 w-20" : "h-14 w-14"}`}
                    />
                ) : (
                    <div className={`flex items-center justify-center rounded-full border-2 border-[#D4AF37]/20 bg-[#D4AF37]/5 font-serif text-[#D4AF37] ${isHero ? "h-20 w-20 text-2xl" : "h-14 w-14 text-lg"}`}>
                        {initial}
                    </div>
                )}

                {/* Name */}
                <span className={`font-serif tracking-tight text-foreground group-hover:text-[#D4AF37] transition-colors ${isHero ? "text-xl" : "text-base"}`}>
                    {profile.username || "Collector"}
                </span>

                {/* Stats */}
                <div className="flex items-center gap-4">
                    {profile.legacy_score != null && (
                        <div className="flex flex-col items-center">
                            <span className="font-mono text-sm text-[#D4AF37]">{profile.legacy_score}</span>
                            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">Legacy</span>
                        </div>
                    )}
                    {profile.total_pieces != null && (
                        <div className="flex flex-col items-center">
                            <span className="font-mono text-sm text-foreground">{profile.total_pieces}</span>
                            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">Pieces</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative bottom accent */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent" />
        </Link>
    )
}
