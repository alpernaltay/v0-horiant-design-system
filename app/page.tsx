import { TopNav } from "@/components/horiant/top-nav"
import { HeroSection } from "@/components/horiant/hero-section"
import { BentoSpecs } from "@/components/horiant/bento-specs"
import { DiscoverGrid } from "@/components/horiant/discover-grid"
import { SocialHubSection } from "@/components/horiant/social-hub-section"
import { ReviewsFeed } from "@/components/horiant/reviews-feed"
import { WatchFinder } from "@/components/horiant/watch-finder"
import { Footer } from "@/components/horiant/footer"
import { getWatches, getFeaturedWatch } from "@/lib/actions/watches"
import { getGrandmasters, getLatestVaults, getTrendingWristRolls, getLatestWristRolls } from "@/lib/actions/community"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

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

      <HeroSection featured={featured} />
      <div className="gold-line mx-auto max-w-xs" />
      <BentoSpecs />
      <DiscoverGrid watches={trendingWatches} />

      {/* ── Dynamic Social Hub (4 carousels, 15 items each) ── */}
      <SocialHubSection
        grandmasters={grandmasters}
        trendingWristRolls={trendingWristRolls}
        latestVaults={latestVaults}
        latestWristRolls={latestWristRolls}
        currentUserId={session?.user?.id}
      />

      <ReviewsFeed watches={watches} />
      <WatchFinder />

      <Footer />
    </main>
  )
}
