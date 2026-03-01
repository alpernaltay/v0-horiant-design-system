"use client"

import { HorizontalCarousel } from "@/components/horiant/horizontal-carousel"
import { VaultPreviewCard, VaultPreviewSkeleton } from "@/components/horiant/vault-preview-card"
import { WristRollCard } from "@/components/horiant/wrist-roll-card"
import { AuthGateProvider } from "@/context/auth-gate-context"
import { motion } from "framer-motion"

interface CommunityClientProps {
    heroVaults: any[]
    carouselVaults: any[]
    heroWristRolls: any[]
    carouselWristRolls: any[]
    latestVaults: any[]
    latestWristRolls: any[]
    currentUserId?: string
}

// ─── Skeleton Grids ──────────────────────────────────────────────
function HeroVaultSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-[#0A0F16]">
            <div className="aspect-[16/9] w-full animate-pulse bg-white/[0.03]" />
            <div className="flex items-center justify-between px-4 py-3">
                <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-3 w-12 animate-pulse rounded bg-white/[0.06]" />
            </div>
        </div>
    )
}

function HeroWristRollSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-[#0A0F16]">
            <div className="aspect-square w-full animate-pulse bg-white/[0.03]" />
            <div className="p-4 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />
            </div>
        </div>
    )
}

function WristRollSkeleton() {
    return (
        <div className="w-[280px] flex-shrink-0 snap-start overflow-hidden rounded-xl border border-white/[0.04] bg-[#0A0F16]">
            <div className="aspect-square w-full animate-pulse bg-white/[0.03]" />
            <div className="p-4 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />
            </div>
        </div>
    )
}

export function CommunityClient({
    heroVaults,
    carouselVaults,
    heroWristRolls,
    carouselWristRolls,
    latestVaults,
    latestWristRolls,
    currentUserId
}: CommunityClientProps) {
    return (
        <AuthGateProvider currentUserId={currentUserId}>
            {/* ── Page Hero ── */}
            <section className="relative px-6 pt-32 pb-16 lg:pt-40 lg:pb-20">
                <div className="mx-auto max-w-6xl text-center">
                    <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                        Community
                    </p>
                    <h1 className="mb-6 font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
                        The Pulse of the Vault
                    </h1>
                    <div className="gold-line mx-auto mb-6 max-w-xs" />
                    <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-muted-foreground md:text-base">
                        Legendary collectors, breathtaking wrist shots, and the latest curations from the global horology community.
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">

                {/* ──── THE PANTHEON — Top 3 Vaults ──── */}
                <section className="mb-16 sm:mb-20">
                    <div className="mb-8 text-center">
                        <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">The Pantheon</p>
                        <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">The Grandmasters</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {heroVaults.length > 0
                            ? heroVaults.map((p: any, i: number) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                >
                                    <VaultPreviewCard profile={p} size="hero" />
                                </motion.div>
                            ))
                            : Array.from({ length: 3 }).map((_, i) => (
                                <HeroVaultSkeleton key={`hv-skel-${i}`} />
                            ))
                        }
                    </div>
                </section>

                {/* ──── HALL OF FAME — Top 3 Wrist Rolls ──── */}
                <section className="mb-16 sm:mb-20">
                    <div className="gold-line mx-auto mb-10 max-w-xs" />
                    <div className="mb-8 text-center">
                        <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Most Admired</p>
                        <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">Hall of Fame — Wrist Rolls</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {heroWristRolls.length > 0
                            ? heroWristRolls.map((wr: any, i: number) => (
                                <motion.div
                                    key={wr.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                >
                                    <WristRollCard post={wr} currentUserId={currentUserId} />
                                </motion.div>
                            ))
                            : Array.from({ length: 3 }).map((_, i) => (
                                <HeroWristRollSkeleton key={`hwr-skel-${i}`} />
                            ))
                        }
                    </div>
                </section>

                {/* ──── CAROUSELS — Items #4-#18 (deduplicated) ──── */}
                <div className="gold-line mx-auto mb-4 max-w-xs" />

                <HorizontalCarousel title="Best Vaults" subtitle="Ranked by Legacy Score">
                    {carouselVaults.length > 0
                        ? carouselVaults.map((p: any) => (
                            <VaultPreviewCard key={p.id} profile={p} />
                        ))
                        : Array.from({ length: 3 }).map((_, i) => (
                            <VaultPreviewSkeleton key={`cv-skel-${i}`} />
                        ))
                    }
                </HorizontalCarousel>

                <HorizontalCarousel title="Best Wrist Rolls" subtitle="Most Liked of All Time">
                    {carouselWristRolls.length > 0
                        ? carouselWristRolls.map((wr: any) => (
                            <div key={wr.id} className="w-[280px] flex-shrink-0 snap-start">
                                <WristRollCard post={wr} currentUserId={currentUserId} />
                            </div>
                        ))
                        : Array.from({ length: 3 }).map((_, i) => (
                            <WristRollSkeleton key={`cwr-skel-${i}`} />
                        ))
                    }
                </HorizontalCarousel>

                <HorizontalCarousel title="Newly Curated Vaults" subtitle="Fresh Collections">
                    {latestVaults.length > 0
                        ? latestVaults.map((p: any) => (
                            <VaultPreviewCard key={p.id} profile={p} />
                        ))
                        : Array.from({ length: 3 }).map((_, i) => (
                            <VaultPreviewSkeleton key={`nlv-skel-${i}`} />
                        ))
                    }
                </HorizontalCarousel>

                <HorizontalCarousel title="Latest Wrist Shots" subtitle="Just Posted">
                    {latestWristRolls.length > 0
                        ? latestWristRolls.map((wr: any) => (
                            <div key={wr.id} className="w-[280px] flex-shrink-0 snap-start">
                                <WristRollCard post={wr} currentUserId={currentUserId} />
                            </div>
                        ))
                        : Array.from({ length: 3 }).map((_, i) => (
                            <WristRollSkeleton key={`nlwr-skel-${i}`} />
                        ))
                    }
                </HorizontalCarousel>
            </div>
        </AuthGateProvider>
    )
}
