"use client"

import { HorizontalCarousel } from "./horizontal-carousel"
import { VaultCard } from "./vault-card"
import { WristRollCard } from "./wrist-roll-card"
import { AuthGateProvider } from "@/context/auth-gate-context"

interface SocialHubSectionProps {
    grandmasters: any[]
    trendingWristRolls: any[]
    latestVaults: any[]
    latestWristRolls: any[]
    currentUserId?: string
}

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
                <div className="gold-line mx-auto mb-8 max-w-xs" />

                {grandmasters.length > 0 && (
                    <HorizontalCarousel title="Grandmasters" subtitle="Legendary Collectors">
                        {grandmasters.map((p: any) => (
                            <VaultCard key={p.id} profile={p} />
                        ))}
                    </HorizontalCarousel>
                )}

                {trendingWristRolls.length > 0 && (
                    <HorizontalCarousel title="Trending In The Wild" subtitle="Most Admired Wrist Shots">
                        {trendingWristRolls.map((wr: any) => (
                            <div key={wr.id} className="w-[280px] flex-shrink-0 snap-start">
                                <WristRollCard post={wr} currentUserId={currentUserId} />
                            </div>
                        ))}
                    </HorizontalCarousel>
                )}

                {latestVaults.length > 0 && (
                    <HorizontalCarousel title="Newly Curated Vaults" subtitle="Fresh Collections">
                        {latestVaults.map((p: any) => (
                            <VaultCard key={p.id} profile={p} />
                        ))}
                    </HorizontalCarousel>
                )}

                {latestWristRolls.length > 0 && (
                    <HorizontalCarousel title="Latest Wrist Shots" subtitle="Just Posted">
                        {latestWristRolls.map((wr: any) => (
                            <div key={wr.id} className="w-[280px] flex-shrink-0 snap-start">
                                <WristRollCard post={wr} currentUserId={currentUserId} />
                            </div>
                        ))}
                    </HorizontalCarousel>
                )}

                <div className="gold-line mx-auto mt-8 max-w-xs" />
            </div>
        </AuthGateProvider>
    )
}
