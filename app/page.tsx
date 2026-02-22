import { TopNav } from "@/components/horiant/top-nav"
import { HeroSection } from "@/components/horiant/hero-section"
import { BentoSpecs } from "@/components/horiant/bento-specs"
import { TrendingCollections } from "@/components/horiant/trending-collections"
import { Footer } from "@/components/horiant/footer"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background">
      <TopNav />
      <HeroSection />

      {/* Divider between hero and specs */}
      <div className="gold-line mx-auto max-w-xs" />

      <BentoSpecs />
      <TrendingCollections />
      <Footer />
    </main>
  )
}
