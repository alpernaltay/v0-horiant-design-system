import { TopNav } from "@/components/horiant/top-nav"
import { HeroSection } from "@/components/horiant/hero-section"
import { BentoSpecs } from "@/components/horiant/bento-specs"
import { DiscoverGrid } from "@/components/horiant/discover-grid"
import { ReviewsFeed } from "@/components/horiant/reviews-feed"
import { WatchFinder } from "@/components/horiant/watch-finder"
import { Footer } from "@/components/horiant/footer"
import { getWatches, getFeaturedWatch } from "@/lib/actions/watches"

// Force dynamic rendering so Supabase data is fetched on every request
export const dynamic = "force-dynamic"

export default async function Page() {
  const [watches, featured] = await Promise.all([
    getWatches(),
    getFeaturedWatch(),
  ])

  // Separate featured watch from the trending list
  const trendingWatches = watches.filter((w) => w.id !== featured.id)

  return (
    <main className="relative min-h-screen bg-background">
      <TopNav />

      <HeroSection featured={featured} />
      <div className="gold-line mx-auto max-w-xs" />
      <BentoSpecs />
      <DiscoverGrid watches={trendingWatches} />
      <div className="gold-line mx-auto max-w-xs" />
      <ReviewsFeed watches={watches} />
      <WatchFinder />

      <Footer />
    </main>
  )
}
