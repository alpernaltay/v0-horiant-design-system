import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { VaultClient } from "./vault-client"
import { getReviewsForProfile } from "@/lib/actions/reviews"
import { getUserCollection } from "@/lib/actions/collections"
import { getUserWishlist } from "@/lib/actions/wishlists"
import { getWristRollsByProfile } from "@/lib/actions/wrist-rolls"
import type { Metadata } from 'next'

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({
    params
}: {
    params: Promise<{ username: string }>
}): Promise<Metadata> {
    const { username } = await params

    return {
        title: `${username}'s Vault | Horiant`,
        description: `Explore ${username}'s curated watch collection on Horiant, the definitive database for haute horlogerie.`,
        openGraph: {
            title: `${username}'s Vault | Horiant`,
            description: `Explore ${username}'s curated watch collection on Horiant.`,
        }
    }
}

export default async function PublicVaultPage({
    params
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params
    const supabase = await createClient()

    // 1. Fetch user profile by username to get their ID
    let { data: profileRaw, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle()

    if (!profileRaw && !profileError) {
        const { data: fallbackProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', username)
            .maybeSingle()
        profileRaw = fallbackProfile
    }

    const profile = profileRaw as any;

    if (profileError || !profile) {
        notFound()
    }

    // 2. Fetch everything in Parallel
    const [
        watches,
        wishlistWatches,
        topLevelReviews,
        wristRolls,
        { data: { session } }
    ] = await Promise.all([
        getUserCollection(profile.id),
        getUserWishlist(profile.id),
        getReviewsForProfile(profile.id),
        getWristRollsByProfile(profile.id),
        supabase.auth.getSession()
    ])

    const isOwner = session?.user?.id === profile.id || profile.username === session?.user?.user_metadata?.username;

    return (
        <VaultClient
            watches={watches}
            wishlistWatches={wishlistWatches}
            vaultImageUrl={profile.vault_image_url}
            username={profile.username}
            profileId={profile.id}
            wristSize={profile.wrist_size}
            isOwner={isOwner}
            initialReviews={topLevelReviews}
            currentUserId={session?.user?.id}
            initialWristRolls={wristRolls}
        />
    )
}
