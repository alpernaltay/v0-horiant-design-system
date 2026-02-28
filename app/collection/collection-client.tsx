"use client"

import { SOTCProfile } from "@/components/horiant/sotc-profile"
import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import type { CollectionWatchItem } from "@/lib/actions/collections"
import type { WishlistWatchItem } from "@/lib/actions/wishlists"

export function CollectionClient({
    watches,
    wishlistWatches,
    vaultImageUrl,
    username,
    wristSize,
    profileId,
    initialReviews,
    currentUserId,
    isOwner,
    legacyScore,
    totalPieces,
    totalComplications,
    isAdmin,
    initialWristRolls
}: {
    watches: CollectionWatchItem[]
    wishlistWatches: WishlistWatchItem[]
    vaultImageUrl: string | null
    username: string | null
    wristSize: number | null
    profileId: string
    initialReviews: any[]
    currentUserId: string
    isOwner: boolean
    legacyScore?: number
    totalPieces?: number
    totalComplications?: number
    isAdmin?: boolean
    initialWristRolls?: any[]
}) {
    return (
        <main className="relative min-h-screen bg-background">
            <TopNav />
            <SOTCProfile
                watches={watches}
                wishlistWatches={wishlistWatches}
                vaultImageUrl={vaultImageUrl}
                username={username}
                wristSize={wristSize}
                profileId={profileId}
                initialReviews={initialReviews}
                currentUserId={currentUserId}
                isOwner={isOwner}
                legacyScore={legacyScore}
                totalPieces={totalPieces}
                totalComplications={totalComplications}
                isAdmin={isAdmin}
                initialWristRolls={initialWristRolls}
            />
        </main>
    )
}
