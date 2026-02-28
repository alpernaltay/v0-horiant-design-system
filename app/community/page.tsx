import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import { ReviewsFeed } from "@/components/horiant/reviews-feed"
import { getWatches } from "@/lib/actions/watches"
import Link from "next/link"
import Image from "next/image"

import { createClient } from "@/lib/supabase/server"

export const metadata = {
    title: "The Pulse | Horiant Community"
}

export const dynamic = "force-dynamic"

export default async function CommunityPage() {
    const supabase = await createClient()
    const watches = await getWatches()

    // Fetch live users sorted by Legacy Score
    const { data: trendingVaultsRaw } = await supabase
        .from('profiles')
        .select('*')
        .order('legacy_score', { ascending: false })
        .limit(10)

    const trendingVaults = trendingVaultsRaw || []

    return (
        <main className="relative min-h-screen bg-background">
            <TopNav />

            {/* Community Hero */}
            <section className="relative px-6 pt-32 pb-20 lg:pt-40 lg:pb-32">
                <div className="mx-auto max-w-[1440px] text-center">
                    <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                        Community
                    </p>
                    <h1 className="mb-8 font-serif text-5xl font-light tracking-tight text-foreground md:text-7xl">
                        The Pulse of the Vault
                    </h1>
                    <div className="gold-line mx-auto mb-8 max-w-xs" />
                    <p className="mx-auto max-w-2xl font-serif text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
                        Discover breathtaking collections, read enthusiast reviews, and see what the world's most passionate collectors are acquiring today.
                    </p>
                </div>
            </section>

            {/* Trending Vaults */}
            <section className="relative px-6 pb-24 lg:pb-32">
                <div className="mx-auto max-w-[1440px]">
                    <div className="mb-12 border-b border-white/[0.04] pb-6">
                        <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
                            Trending Vaults
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">Peer into the curated collections of our top members.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {trendingVaults.map((vault: any, index: number) => {
                            const isGrandmaster = index === 0 && vault.legacy_score > 0;
                            const initials = vault.username ? vault.username.substring(0, 2).toUpperCase() : "AA";
                            // Ensure there is always a cover image, even if they haven't uploaded one
                            const coverImg = vault.vault_image_url || "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop"

                            return (
                                <Link
                                    key={vault.id}
                                    href={`/vault/${vault.username}`}
                                    className={`group relative flex flex-col overflow-hidden rounded-lg border bg-[#0A0F16] transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] ${isGrandmaster ? 'border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20 relative' : 'border-white/[0.04] hover:border-[#D4AF37]/30'
                                        }`}
                                >
                                    {isGrandmaster && (
                                        <div className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full bg-[#131920]/80 backdrop-blur-md px-3 py-1 border border-[#D4AF37]/50 shadow-xl">
                                            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold">Grandmaster</span>
                                        </div>
                                    )}

                                    {/* Cover Image */}
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={coverImg}
                                            alt={`${vault.username}'s Vault`}
                                            fill
                                            className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F16] via-transparent to-transparent" />

                                        {/* User Avatar Badge */}
                                        <div className={`absolute -bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-[#131920] shadow-xl ${isGrandmaster ? 'border-[#D4AF37]' : 'border-[#0A0F16]'
                                            }`}>
                                            <span className="text-xs font-medium tracking-wider text-[#D4AF37]">
                                                {initials}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-6 pt-10">
                                        <h3 className="mb-2 font-serif text-xl tracking-wide text-foreground">
                                            {vault.username || "Anonymous"}
                                        </h3>
                                        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">
                                            {vault.bio || "Enthusiastic horology collector."}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between border-t border-white/[0.04] pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
                                                    Legacy Score
                                                </span>
                                                <span className="font-mono text-xs text-foreground/80">
                                                    {vault.legacy_score?.toLocaleString() || 0} PTS
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
                                                    Pieces &amp; Features
                                                </span>
                                                <span className="font-mono text-xs tracking-wider text-[#D4AF37]/80">
                                                    {vault.total_pieces || 0} • {vault.total_complications || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Latest Reviews Map */}
            <ReviewsFeed watches={watches} />

            <Footer />
        </main>
    )
}
