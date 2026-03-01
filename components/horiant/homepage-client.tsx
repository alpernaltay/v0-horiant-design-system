"use client"

import { AuthGateProvider } from "@/context/auth-gate-context"
import { HeroSection } from "./hero-section"
import { SocialHubSection } from "./social-hub-section"
import type { WatchData } from "@/lib/mock-watches"

interface HomepageClientProps {
    featured: WatchData
    grandmasters: any[]
    trendingWristRolls: any[]
    latestVaults: any[]
    latestWristRolls: any[]
    currentUserId?: string
}

export function HomepageClient({
    featured,
    grandmasters,
    trendingWristRolls,
    latestVaults,
    latestWristRolls,
    currentUserId
}: HomepageClientProps) {
    return (
        <AuthGateProvider currentUserId={currentUserId}>
            <HeroSection featured={featured} />

            {/* ── Dynamic Social Hub (4 carousels, 15 items each) ── */}
            <SocialHubSection
                grandmasters={grandmasters}
                trendingWristRolls={trendingWristRolls}
                latestVaults={latestVaults}
                latestWristRolls={latestWristRolls}
                currentUserId={currentUserId}
            />
        </AuthGateProvider>
    )
}
