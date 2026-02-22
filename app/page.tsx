"use client"

import { useState } from "react"
import { TopNav } from "@/components/horiant/top-nav"
import { HeroSection } from "@/components/horiant/hero-section"
import { BentoSpecs } from "@/components/horiant/bento-specs"
import { DiscoverGrid } from "@/components/horiant/discover-grid"
import { WatchDetail } from "@/components/horiant/watch-detail"
import { SOTCProfile } from "@/components/horiant/sotc-profile"
import { Footer } from "@/components/horiant/footer"
import { featuredWatch, type WatchData } from "@/lib/mock-watches"

type View = "discover" | "watchDetail" | "sotcProfile"

export default function Page() {
  const [activeView, setActiveView] = useState<View>("discover")
  const [selectedWatch, setSelectedWatch] = useState<WatchData | null>(null)

  function handleSelectWatch(watch: WatchData) {
    setSelectedWatch(watch)
    setActiveView("watchDetail")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleNavigate(view: View) {
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="relative min-h-screen bg-background">
      <TopNav activeView={activeView} onNavigate={handleNavigate} />

      {activeView === "discover" && (
        <>
          <HeroSection onViewSpecs={() => handleSelectWatch(featuredWatch)} />
          <div className="gold-line mx-auto max-w-xs" />
          <BentoSpecs />
          <DiscoverGrid onSelectWatch={handleSelectWatch} />
        </>
      )}

      {activeView === "watchDetail" && selectedWatch && (
        <WatchDetail
          watch={selectedWatch}
          onBack={() => handleNavigate("discover")}
        />
      )}

      {activeView === "sotcProfile" && (
        <SOTCProfile onSelectWatch={handleSelectWatch} />
      )}

      <Footer />
    </main>
  )
}
