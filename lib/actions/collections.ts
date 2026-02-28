"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { WatchData } from "@/lib/mock-watches"
import {
    sotcWatches,
    getFullWatchData,
    getTotalComplications,
} from "@/lib/mock-watches"
import { syncProfileStats } from "@/lib/logic/horiology"

// ─── Helpers ────────────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    return !!(url && key && !url.includes("your-project-id"))
}

/** Find a watch by slug or UUID */
async function findWatchId(supabase: any, watchId: string): Promise<string | null> {
    // Try slug first
    const { data: bySlug } = await supabase
        .from("watches")
        .select("id")
        .eq("slug", watchId)
        .maybeSingle()
    if (bySlug) return bySlug.id

    // Try UUID
    const { data: byId } = await supabase
        .from("watches")
        .select("id")
        .eq("id", watchId)
        .maybeSingle()
    if (byId) return byId.id

    return null
}

// ─── Server Actions ─────────────────────────────────────────────

export async function checkCollectionStatus(watchId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const resolvedWatchId = await findWatchId(supabase, watchId)
    if (!resolvedWatchId) return false

    const { data } = await supabase
        .from("collections")
        .select("id")
        .eq("user_id", user.id)
        .eq("watch_id", resolvedWatchId)
        .maybeSingle()

    return !!data
}

export async function toggleCollection(watchId: string): Promise<{ success: boolean; message: string; inCollection: boolean }> {
    if (!isSupabaseConfigured()) {
        return { success: true, message: "Demo mode toggled", inCollection: true }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "Please sign in", inCollection: false }
    }

    const resolvedWatchId = await findWatchId(supabase, watchId)

    if (!resolvedWatchId) {
        return { success: false, message: "Watch not found", inCollection: false }
    }

    const inCollection = await checkCollectionStatus(watchId)

    if (inCollection) {
        const { error } = await supabase
            .from("collections")
            .delete()
            .eq("user_id", user.id)
            .eq("watch_id", resolvedWatchId)

        if (error) return { success: false, message: "Failed to remove from collection", inCollection: true }
        await syncProfileStats(user.id)
        revalidatePath('/', 'layout')
        return { success: true, message: "Removed from your collection", inCollection: false }
    } else {
        const { error } = await supabase
            .from("collections")
            .insert({
                user_id: user.id,
                watch_id: resolvedWatchId,
            } as any)

        if (error) return { success: false, message: "Failed to add to collection", inCollection: false }
        await syncProfileStats(user.id)
        revalidatePath('/', 'layout')
        return { success: true, message: "Added to your collection!", inCollection: true }
    }
}

export async function addToCollection(
    watchId: string
): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
        // Demo mode: simulate success
        return { success: true, message: "Added to your collection (demo mode)" }
    }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "Please sign in to add watches to your collection" }
    }

    // Find watch by slug or UUID
    const resolvedWatchId = await findWatchId(supabase, watchId)

    if (!resolvedWatchId) {
        return { success: false, message: "Watch not found" }
    }

    const { error } = await supabase.from("collections").insert({
        user_id: user.id,
        watch_id: resolvedWatchId,
    } as any)

    if (error) {
        if (error.code === "23505") {
            // Unique constraint violation
            return { success: false, message: "This watch is already in your collection" }
        }
        console.error("[addToCollection] Supabase error:", error)
        return { success: false, message: "Failed to add watch. Please try again." }
    }

    await syncProfileStats(user.id)
    revalidatePath('/', 'layout')
    return { success: true, message: "Added to your collection!" }
}

export async function removeFromCollection(
    watchId: string
): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
        return { success: true, message: "Removed from collection (demo mode)" }
    }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "Please sign in" }
    }

    // Find watch by slug or UUID
    const resolvedWatchId = await findWatchId(supabase, watchId)

    if (!resolvedWatchId) {
        return { success: false, message: "Watch not found" }
    }

    const { error } = await supabase
        .from("collections")
        .delete()
        .eq("user_id", user.id)
        .eq("watch_id", resolvedWatchId)

    if (error) {
        console.error("[removeFromCollection] Supabase error:", error)
        return { success: false, message: "Failed to remove. Please try again." }
    }

    revalidatePath('/', 'layout')
    return { success: true, message: "Removed from your collection" }
}

export interface CollectionWatchItem {
    id: string
    brand: string
    model: string
    image: string
    reference: string
    year: number
    verified: boolean
    complications: string[]
    price: string
    slug: string
    addedAt: string
}

export async function getUserCollection(
    userId?: string
): Promise<CollectionWatchItem[]> {
    if (!isSupabaseConfigured()) {
        // Fallback to mock data
        return sotcWatches.map((w) => ({
            id: w.id,
            brand: w.brand,
            model: w.model,
            image: w.image,
            reference: w.reference,
            year: w.year,
            verified: w.verified,
            complications: w.complications,
            price: w.price,
            slug: w.id,
            addedAt: new Date().toISOString(),
        }))
    }

    const supabase = await createClient()

    // If no specific userId, get current user
    let targetUserId = userId
    if (!targetUserId) {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        targetUserId = user?.id
    }

    if (!targetUserId) {
        // Not authenticated, return mock data as demo
        return sotcWatches.map((w) => ({
            id: w.id,
            brand: w.brand,
            model: w.model,
            image: w.image,
            reference: w.reference,
            year: w.year,
            verified: w.verified,
            complications: w.complications,
            price: w.price,
            slug: w.id,
            addedAt: new Date().toISOString(),
        }))
    }

    const { data, error } = await supabase
        .from("collections")
        .select(`
      id,
      is_verified,
      added_at,
      watches (
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

    if (error || !data) {
        console.error("[getUserCollection] Supabase error:", error)
        return sotcWatches.map((w) => ({
            id: w.id,
            brand: w.brand,
            model: w.model,
            image: w.image,
            reference: w.reference,
            year: w.year,
            verified: w.verified,
            complications: w.complications,
            price: w.price,
            slug: w.id,
            addedAt: new Date().toISOString(),
        }))
    }

    return data.map((item: any) => ({
        id: item.watches.slug ?? item.watch_id,
        brand: item.watches.brand,
        model: item.watches.model,
        image: item.watches.image_url,
        reference: item.watches.reference,
        year: item.watches.year ?? 2024,
        verified: item.is_verified,
        complications: item.watches.complications ?? [],
        price: item.watches.price ?? "N/A",
        slug: item.watches.slug ?? item.watch_id,
        addedAt: item.added_at,
    }))
}

export async function updateProfileSettings(username: string, wristSize: number | null): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
        return { success: true, message: "Profile updated (demo mode)" }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "You must be signed in." }
    }

    const { error } = await (supabase as any)
        .from('profiles')
        .update({ username, wrist_size: wristSize })
        .eq('id', user.id)

    if (error) {
        if (error.code === '23505') {
            return { success: false, message: "Username is already taken" }
        }
        console.error("Update profile error:", error)
        return { success: false, message: "Failed to update profile." }
    }

    revalidatePath('/', 'layout')
    return { success: true, message: "Profile settings saved!" }
}
