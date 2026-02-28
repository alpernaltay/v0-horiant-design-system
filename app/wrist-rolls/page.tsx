import type { Metadata } from "next"
import { getGlobalWristRolls } from "@/lib/actions/wrist-rolls"
import { WristRollCard } from "@/components/horiant/wrist-roll-card"
import { TopNav } from "@/components/horiant/top-nav"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
    title: "Wrist Rolls — HORIANT",
    description: "The luxury social feed for watch collectors. Discover timepieces in the wild.",
}

export default async function WristRollsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const posts = await getGlobalWristRolls()

    return (
        <main className="min-h-screen bg-[#0A0F16] selection:bg-[#D4AF37]/30">
            <TopNav />

            <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12 flex flex-col items-center justify-center text-center">
                    <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                        Social Feed
                    </p>
                    <h1 className="mb-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-showcase">
                        Wrist <span className="text-[#D4AF37]">Rolls</span>
                    </h1>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        Timepieces in their natural habitat. Explore the collections curated by the Horiant community.
                        To post your own, navigate to <strong className="text-white/80 font-normal border-b border-white/20 pb-0.5">My Collection</strong>.
                    </p>
                </div>

                {/* Feed Grid (Masonry approach using CSS columns) */}
                {posts.length === 0 ? (
                    <div className="py-24 text-center">
                        <p className="text-muted-foreground">The feed is empty. Be the first to post a wrist roll.</p>
                    </div>
                ) : (
                    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6">
                        {posts.map((post: any) => (
                            <div key={post.id} className="break-inside-avoid">
                                <WristRollCard post={post} currentUserId={user?.id} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
