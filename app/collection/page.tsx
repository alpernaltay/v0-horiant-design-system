import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserCollection } from "@/lib/actions/collections"
import { getUserWishlist } from "@/lib/actions/wishlists"
import { getReviewsForProfile } from "@/lib/actions/reviews"
import { getWristRollsByProfile } from "@/lib/actions/wrist-rolls"
import { CollectionClient } from "./collection-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
    title: "My Collection — HORIANT",
    description: "Your curated vault of fine timepieces. Explore your collection, verify ownership, and connect with the community.",
}

export default async function CollectionPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const [
        watches,
        wishlistWatches,
        { data: profileRaw },
        topLevelReviews,
        wristRolls
    ] = await Promise.all([
        getUserCollection(user.id),
        getUserWishlist(user.id),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        getReviewsForProfile(user.id),
        getWristRollsByProfile(user.id)
    ])

    const profile = profileRaw as any

    const vaultImageUrl = profile?.vault_image_url || null
    const username = profile?.username || null
    const wristSize = profile?.wrist_size || null
    const legacyScore = profile?.legacy_score || 0
    const totalPieces = profile?.total_pieces || 0
    const totalComps = profile?.total_complications || 0
    const isAdmin = !!profile?.is_admin

    return <CollectionClient
        watches={watches}
        wishlistWatches={wishlistWatches}
        vaultImageUrl={vaultImageUrl}
        username={username}
        wristSize={wristSize}
        legacyScore={legacyScore}
        totalPieces={totalPieces}
        totalComplications={totalComps}
        profileId={user.id}
        initialReviews={topLevelReviews}
        currentUserId={user.id}
        isOwner={true}
        isAdmin={isAdmin}
        initialWristRolls={wristRolls}
    />
}
