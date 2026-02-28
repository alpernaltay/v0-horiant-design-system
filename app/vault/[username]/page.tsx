import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import { SOTCProfile } from "@/components/horiant/sotc-profile"
import { getReviewsForProfile } from "@/lib/actions/reviews"
import { getUserCollection } from "@/lib/actions/collections"
import { getUserWishlist } from "@/lib/actions/wishlists"
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
        // Fallback: check if username is actually an ID
        const { data: fallbackProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', username)
            .maybeSingle()
        profileRaw = fallbackProfile
    }

    console.log("DB_QUERY_RESULT:", profileRaw)
    const profile = profileRaw as any;

    console.log("VAULT_DEBUG: Username Param:", username, "Profile Found:", profile);

    if (profileError || !profile) {
        notFound()
    }

    // 2. Fetch their collection and wishlist
    const watches = await getUserCollection(profile.id)
    const wishlistWatches = await getUserWishlist(profile.id)

    const { data: { session } } = await supabase.auth.getSession()
    const isOwner = session?.user?.id === profile.id || profile.username === session?.user?.user_metadata?.username;

    // 3. Fetch reviews directed at this profile
    const topLevelReviews = await getReviewsForProfile(profile.id)

    // We can fetch wishlist if we want, currently we just map watches
    // Ensure nested watches array gets flattened if we must
    return (
        <main className="relative min-h-screen bg-background">
            <TopNav />
            <SOTCProfile
                watches={watches}
                wishlistWatches={wishlistWatches}
                vaultImageUrl={profile.vault_image_url}
                username={profile.username}
                profileId={profile.id}
                wristSize={profile.wrist_size}
                isOwner={isOwner}
                initialReviews={topLevelReviews}
                currentUserId={session?.user?.id}
            />
            <Footer />
        </main >
    )
}
