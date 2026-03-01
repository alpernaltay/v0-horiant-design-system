"use client"

import { HorizontalCarousel } from "@/components/horiant/horizontal-carousel"
import { VaultPreviewCard } from "@/components/horiant/vault-preview-card"
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
            {/* Page Hero */}
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
                {heroVaults.length > 0 && (
                    <section className="mb-16 sm:mb-24">
                        <div className="mb-10 text-center">
                            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">The Pantheon</p>
                            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">The Grandmasters</h2>
                        </div>
                        <div className="flex flex-col gap-6">
                            {heroVaults.map((p: any, i: number) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                >
                                    <VaultPreviewCard profile={p} rank={i + 1} variant="hero" />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ──── HALL OF FAME — Top 3 Wrist Rolls ──── */}
                {heroWristRolls.length > 0 && (
                    <section className="mb-16 sm:mb-24">
                        <div className="gold-line mx-auto mb-12 max-w-xs" />
                        <div className="mb-10 text-center">
                            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Most Admired</p>
                            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">Hall of Fame — Wrist Rolls</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {heroWristRolls.map((wr: any, i: number) => (
                                <motion.div
                                    key={wr.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                >
                                    <WristRollCard post={wr} currentUserId={currentUserId} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ──── CAROUSELS (Items #4-#18, deduplicated) ──── */}
                <div className="gold-line mx-auto mb-8 max-w-xs" />

                {carouselVaults.length > 0 && (
                    <HorizontalCarousel title="Best Vaults" subtitle="Ranked by Legacy Score">
                        {carouselVaults.map((p: any) => (
                            <VaultPreviewCard key={p.id} profile={p} />
                        ))}
                    </HorizontalCarousel>
                )}

                {carouselWristRolls.length > 0 && (
                    <HorizontalCarousel title="Best Wrist Rolls" subtitle="Most Liked of All Time">
                        {carouselWristRolls.map((wr: any) => (
                            <div key={wr.id} className="w-[280px] flex-shrink-0 snap-start">
                                <WristRollCard post={wr} currentUserId={currentUserId} />
                            </div>
                        ))}
                    </HorizontalCarousel>
                )}

                {latestVaults.length > 0 && (
                    <HorizontalCarousel title="Newly Curated Vaults" subtitle="Fresh Collections">
                        {latestVaults.map((p: any) => (
                            <VaultPreviewCard key={p.id} profile={p} />
                        ))}
                    </HorizontalCarousel>
                )}

                {latestWristRolls.length > 0 && (
                    <HorizontalCarousel title="Latest Wrist Shots" subtitle="Just Posted">
                        {latestWristRolls.map((wr: any) => (
                            <div key={wr.id} className="w-[280px] flex-shrink-0 snap-start">
                                <WristRollCard post={wr} currentUserId={currentUserId} />
                            </div>
                        ))}
                    </HorizontalCarousel>
                )}
            </div>
        </AuthGateProvider>
    )
}
