import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getWatchDetail } from "@/lib/actions/watches"
import { getReviewsForWatch } from "@/lib/actions/reviews"
import { checkCollectionStatus } from "@/lib/actions/collections"
import { checkWishlistStatus } from "@/lib/actions/wishlists"
import { getWristRollsByWatch } from "@/lib/actions/wrist-rolls"
import { WatchDetailClient } from "./watch-detail-client"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface WatchPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
    const { slug } = await params
    const watch = await getWatchDetail(slug)

    if (!watch) {
        return { title: "Watch Not Found — HORIANT" }
    }

    return {
        title: `${watch.brand} ${watch.model} — HORIANT`,
        description: `${watch.brand} ${watch.model} Ref. ${watch.reference}. ${watch.complications.join(", ")}. Explore specs, market insights, and expert reviews.`,
        openGraph: {
            title: `${watch.brand} ${watch.model}`,
            description: watch.legacy.slice(0, 160),
            images: [{ url: watch.image, width: 1200, height: 630 }],
        },
    }
}

export default async function WatchPage({ params }: WatchPageProps) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // Helper to fetch the UUID in parallel
    const fetchUUID = async () => {
        const { data } = await supabase.from('watches').select('id').eq('slug', slug).maybeSingle()
        if ((data as any)?.id) return (data as any).id
        const { data: byId } = await supabase.from('watches').select('id').eq('id', slug).maybeSingle()
        return (byId as any)?.id
    }

    // 1. Fetch Watch UI Details and the DB UUID Simultaneously
    const [watch, actualWatchId] = await Promise.all([
        getWatchDetail(slug),
        fetchUUID()
    ])

    if (!watch) {
        notFound()
    }

    let topLevelReviews: any[] = []
    let initialInCollection = false
    let initialInWishlist = false
    let initialWristRolls: any[] = []

    // 2. Fetch all dependent user/social data in Parallel
    if (actualWatchId) {
        const [reviews, inCollection, inWishlist, wristRolls] = await Promise.all([
            getReviewsForWatch(actualWatchId),
            checkCollectionStatus(actualWatchId),
            checkWishlistStatus(actualWatchId),
            getWristRollsByWatch(actualWatchId)
        ])

        topLevelReviews = reviews
        initialInCollection = inCollection
        initialInWishlist = inWishlist
        initialWristRolls = wristRolls
    }

    return <WatchDetailClient watch={watch} initialReviews={topLevelReviews} initialInCollection={initialInCollection} initialInWishlist={initialInWishlist} initialWristRolls={initialWristRolls} currentUserId={currentUser?.id} />
}
