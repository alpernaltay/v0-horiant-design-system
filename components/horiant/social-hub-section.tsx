"use client"

import { HorizontalCarousel } from "./horizontal-carousel"
import { VaultPreviewCard, VaultPreviewSkeleton } from "./vault-preview-card"
import { WristRollCard } from "./wrist-roll-card"
import { AuthGateProvider } from "@/context/auth-gate-context"

interface SocialHubSectionProps {
    grandmasters: any[]
    trendingWristRolls: any[]
    latestVaults: any[]
    latestWristRolls: any[]
    currentUserId?: string
}

// ─── Skeleton for Wrist-Roll cards ───────────────────────────────
function WristRollSkeleton() {
    return (
        <div className="w-[280px] flex-shrink-0 snap-start overflow-hidden rounded-xl border border-white/[0.04] bg-[#0A0F16]">
            <div className="aspect-square w-full animate-pulse bg-white/[0.03]" />
            <div className="p-4 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />
            </div>
        </div>
    )
}

const SKELETON_COUNT = 3

export function SocialHubSection({
    grandmasters,
    trendingWristRolls,
    latestVaults,
    latestWristRolls,
    currentUserId
}: SocialHubSectionProps) {
    return (
        <AuthGateProvider currentUserId={currentUserId}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="gold-line mx-auto mb-4 max-w-xs" />

                {/* 1. Grandmasters */}
                <HorizontalCarousel title="Grandmasters" subtitle="Legendary Collectors">
                    {grandmasters.length > 0
                        ? grandmasters.map((p: any) => (
                            <VaultPreviewCard key={p.id} profile={p} />
                        ))
                        : Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <VaultPreviewSkeleton key={`gm-skel-${i}`} />
                        ))
                    }
                </HorizontalCarousel>

                {/* 2. Trending In The Wild */}
                <HorizontalCarousel title="Trending In The Wild" subtitle="Most Admired Wrist Shots">
                    {trendingWristRolls.length > 0
                        ? trendingWristRolls.map((wr: any) => (
                            <div key={wr.id} className="w-[280px] flex-shrink-0 snap-start">
                                <WristRollCard post={wr} currentUserId={currentUserId} />
                            </div>
                        ))
                        : Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <WristRollSkeleton key={`twr-skel-${i}`} />
                        ))
                    }
                </HorizontalCarousel>

                {/* 3. Newly Curated Vaults */}
                <HorizontalCarousel title="Newly Curated Vaults" subtitle="Fresh Collections">
                    {latestVaults.length > 0
                        ? latestVaults.map((p: any) => (
                            <VaultPreviewCard key={p.id} profile={p} />
                        ))
                        : Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <VaultPreviewSkeleton key={`lv-skel-${i}`} />
                        ))
                    }
                </HorizontalCarousel>

                {/* 4. Latest Wrist Shots */}
                <HorizontalCarousel title="Latest Wrist Shots" subtitle="Just Posted">
                    {latestWristRolls.length > 0
                        ? latestWristRolls.map((wr: any) => (
                            <div key={wr.id} className="w-[280px] flex-shrink-0 snap-start">
                                <WristRollCard post={wr} currentUserId={currentUserId} />
                            </div>
                        ))
                        : Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <WristRollSkeleton key={`lwr-skel-${i}`} />
                        ))
                    }
                </HorizontalCarousel>

                <div className="gold-line mx-auto mt-4 max-w-xs" />
            </div>
        </AuthGateProvider>
    )
}
