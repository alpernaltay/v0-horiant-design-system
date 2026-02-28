"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ─── Helpers ────────────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    return !!(url && key && !url.includes("your-project-id"))
}

async function findWatchId(supabase: any, watchId: string): Promise<string | null> {
    const { data: bySlug } = await supabase
        .from("watches")
        .select("id")
        .eq("slug", watchId)
        .maybeSingle()
    if (bySlug) return bySlug.id

    const { data: byId } = await supabase
        .from("watches")
        .select("id")
        .eq("id", watchId)
        .maybeSingle()
    if (byId) return byId.id

    return null
}

// ─── Server Actions ─────────────────────────────────────────────

export async function checkWishlistStatus(watchId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const resolvedWatchId = await findWatchId(supabase, watchId)
    if (!resolvedWatchId) return false

    const { data } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("watch_id", resolvedWatchId)
        .maybeSingle()

    return !!data
}

export async function toggleWishlist(watchId: string): Promise<{ success: boolean; message: string; isWishlisted: boolean }> {
    if (!isSupabaseConfigured()) {
        return { success: true, message: "Demo mode toggled", isWishlisted: true }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "Please sign in to add to your wishlist", isWishlisted: false }
    }

    const resolvedWatchId = await findWatchId(supabase, watchId)

    if (!resolvedWatchId) {
        return { success: false, message: "Watch not found", isWishlisted: false }
    }

    // Check current status
    const isWishlisted = await checkWishlistStatus(watchId)

    if (isWishlisted) {
        // Remove
        const { error } = await supabase
            .from("wishlists")
            .delete()
            .eq("user_id", user.id)
            .eq("watch_id", resolvedWatchId)

        if (error) return { success: false, message: "Failed to remove from wishlist", isWishlisted: true }
        revalidatePath('/', 'layout')
        return { success: true, message: "Removed from your Grails", isWishlisted: false }
    } else {
        // Add
        const { error } = await supabase
            .from("wishlists")
            .insert({
                user_id: user.id,
                watch_id: resolvedWatchId,
            } as any)

        if (error) return { success: false, message: "Failed to add to wishlist", isWishlisted: false }
        revalidatePath('/', 'layout')
        return { success: true, message: "Added to your Grails!", isWishlisted: true }
    }
}

export interface WishlistWatchItem {
    id: string
    brand: string
    model: string
    image: string
    reference: string
    year: number
    complications: string[]
    price: string
    slug: string
    addedAt: string
}

export async function getUserWishlist(userId?: string): Promise<WishlistWatchItem[]> {
    if (!isSupabaseConfigured()) return []

    const supabase = await createClient()

    let targetUserId = userId
    if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser()
        targetUserId = user?.id
    }

    if (!targetUserId) return []

    const { data, error } = await supabase
        .from("wishlists")
        .select(`
            added_at,
            watches (
                id,
                slug,
                brand,
                model,
                image_url,
                reference,
                year,
                complications,
                price
            )
        `)
        .eq("user_id", targetUserId)
        .order("added_at", { ascending: false })

    if (error || !data) return []

    return data.map((item: any) => ({
        id: item.watches.slug ?? item.watches.id,
        brand: item.watches.brand,
        model: item.watches.model,
        image: item.watches.image_url,
        reference: item.watches.reference,
        year: item.watches.year ?? 2024,
        complications: item.watches.complications ?? [],
        price: item.watches.price ?? "N/A",
        slug: item.watches.slug ?? item.watches.id,
        addedAt: item.added_at,
    }))
}
