import { TopNav } from "@/components/horiant/top-nav"
import { BentoSpecs } from "@/components/horiant/bento-specs"
import { DiscoverGrid } from "@/components/horiant/discover-grid"
import { ReviewsFeed } from "@/components/horiant/reviews-feed"
import { WatchFinder } from "@/components/horiant/watch-finder"
import { Footer } from "@/components/horiant/footer"
import { getWatches, getFeaturedWatch } from "@/lib/actions/watches"
import { getGrandmasters, getLatestVaults, getTrendingWristRolls, getLatestWristRolls } from "@/lib/actions/community"
import { createClient } from "@/lib/supabase/server"
import { HomepageClient } from "@/components/horiant/homepage-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Page() {
  const supabase = await createClient()

  const [
    watches,
    featured,
    grandmasters,
    trendingWristRolls,
    latestVaults,
    latestWristRolls,
    { data: { session } }
  ] = await Promise.all([
    getWatches(),
    getFeaturedWatch(),
    getGrandmasters(15),
    getTrendingWristRolls(15),
    getLatestVaults(15),
    getLatestWristRolls(15),
    supabase.auth.getSession()
  ])

  const trendingWatches = watches.filter((w) => w.id !== featured.id)

  return (
    <main className="relative min-h-screen bg-background">
      <TopNav />

      {/* AuthGateProvider wraps both HeroSection and SocialHubSection */}
      <HomepageClient
        featured={featured}
        grandmasters={grandmasters}
        trendingWristRolls={trendingWristRolls}
        latestVaults={latestVaults}
        latestWristRolls={latestWristRolls}
        currentUserId={session?.user?.id}
      />

      <div className="gold-line mx-auto max-w-xs" />
      <BentoSpecs />
      <DiscoverGrid watches={trendingWatches} />

      <ReviewsFeed watches={watches} />
      <WatchFinder />

      <Footer />
    </main>
  )
}
