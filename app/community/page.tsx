import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import { CommunityClient } from "./community-client"
import { getGrandmasters, getLatestVaults, getTrendingWristRolls, getLatestWristRolls } from "@/lib/actions/social"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
    title: "Community | Horiant",
    description: "Explore the Horiant community — legendary collectors, trending wrist shots, and newly curated vaults.",
}

export default async function CommunityPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    // Fetch 18 items for "Best" lists to deduplicate Top 3 from carousel
    const [bestVaults, bestWristRolls, latestVaults, latestWristRolls] = await Promise.all([
        getGrandmasters(18),
        getTrendingWristRolls(18),
        getLatestVaults(15),
        getLatestWristRolls(15),
    ])

    // Deduplication: Top 3 for hero, #4-#18 for carousels
    const heroVaults = bestVaults.slice(0, 3)
    const carouselVaults = bestVaults.slice(3, 18)
    const heroWristRolls = bestWristRolls.slice(0, 3)
    const carouselWristRolls = bestWristRolls.slice(3, 18)

    return (
        <main className="relative min-h-screen bg-background">
            <TopNav />
            <CommunityClient
                heroVaults={heroVaults}
                carouselVaults={carouselVaults}
                heroWristRolls={heroWristRolls}
                carouselWristRolls={carouselWristRolls}
                latestVaults={latestVaults}
                latestWristRolls={latestWristRolls}
                currentUserId={session?.user?.id}
            />
            <Footer />
        </main>
    )
}
