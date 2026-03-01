"use client"

import Link from "next/link"
import Image from "next/image"

interface VaultPreviewCardProps {
    profile: {
        id: string
        username: string
        avatar_url?: string | null
        vault_image_url?: string | null
        legacy_score?: number
        total_pieces?: number
    }
    isGrandmaster?: boolean
    size?: "normal" | "hero"
}

export function VaultPreviewCard({ profile, isGrandmaster = false, size = "normal" }: VaultPreviewCardProps) {
    const initial = (profile.username || "?").charAt(0).toUpperCase()
    const coverImg = profile.vault_image_url || "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop"
    const isHero = size === "hero"

    return (
        <Link
            href={`/vault/${profile.username || profile.id}`}
            className={`group snap-start flex-shrink-0 relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0F16] transition-all duration-500 hover:border-[#D4AF37]/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.06)] ${isHero ? "w-full aspect-[21/9]" : "w-[400px] sm:w-[500px] aspect-[16/9]"}`}
        >
            {/* Background Image with Zoom Effect */}
            <Image
                src={coverImg}
                alt={`${profile.username}'s Vault`}
                fill
                className="object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                sizes={isHero ? "(max-width: 1024px) 100vw, 33vw" : "500px"}
            />

            {/* Deep Dark-to-Transparent Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F16] via-[#0A0F16]/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F16]/60 via-transparent to-transparent pointer-events-none" />

            {/* Content Overlay Container */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 transition-all duration-300">

                {/* Top Row: Avatar & Name (Left) + Badge (Right) */}
                <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.username}
                                className={`rounded-full border border-white/[0.1] object-cover ${isHero ? "h-12 w-12" : "h-10 w-10"}`}
                            />
                        ) : (
                            <div className={`flex items-center justify-center rounded-full border border-white/[0.1] bg-[#131920]/80 font-serif text-[#D4AF37] backdrop-blur-md ${isHero ? "h-12 w-12 text-lg" : "h-10 w-10 text-base"}`}>
                                {initial}
                            </div>
                        )}
                        <span className={`font-serif tracking-tight text-white drop-shadow-md group-hover:text-[#D4AF37] transition-colors ${isHero ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
                            {profile.username || "Collector"}
                        </span>
                    </div>

                    {isGrandmaster && (
                        <div className="flex items-center justify-center rounded-full bg-[#131920]/80 backdrop-blur-md px-3 py-1.5 border border-[#D4AF37]/50 shadow-lg shrink-0">
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">Grandmaster</span>
                        </div>
                    )}
                </div>

                {/* Bottom Row: Stats */}
                <div className="flex items-center gap-4 mt-auto">
                    {profile.total_pieces != null && (
                        <div className="flex items-center gap-2 rounded-md bg-[#0A0F16]/80 backdrop-blur-sm px-3 py-1.5 border border-white/[0.04]">
                            <span className="font-mono text-sm text-white drop-shadow-sm">{profile.total_pieces}</span>
                            <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Timepieces</span>
                        </div>
                    )}
                    {profile.legacy_score != null && (
                        <div className="flex items-center gap-2 rounded-md bg-[#0A0F16]/80 backdrop-blur-sm px-3 py-1.5 border border-white/[0.04]">
                            <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Legacy Score</span>
                            <span className="font-mono text-sm text-[#D4AF37] drop-shadow-sm">{profile.legacy_score}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
    )
}
