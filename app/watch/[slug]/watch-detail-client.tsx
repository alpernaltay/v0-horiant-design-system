"use client"

import { WatchDetail } from "@/components/horiant/watch-detail"
import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import type { WatchData } from "@/lib/mock-watches"

interface WatchDetailClientProps {
    watch: WatchData
    initialReviews?: any[]
    initialInCollection?: boolean
    initialInWishlist?: boolean
    initialWristRolls?: any[]
    currentUserId?: string
}

export function WatchDetailClient({ watch, initialReviews, initialInCollection, initialInWishlist, initialWristRolls, currentUserId }: WatchDetailClientProps) {
    return (
        <main className="relative min-h-screen bg-background">
            <TopNav />
            <WatchDetail watch={watch} initialReviews={initialReviews} initialInCollection={initialInCollection} initialInWishlist={initialInWishlist} initialWristRolls={initialWristRolls} currentUserId={currentUserId} />
            <Footer />
        </main>
    )
}
