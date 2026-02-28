"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Watch } from "@/lib/supabase/types"
import {
    featuredWatch,
    trendingWatches,
    type WatchData,
} from "@/lib/mock-watches"

const PLACEHOLDER_IMAGE = "/images/placeholder-watch.png"

// ─── Helpers ────────────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const configured = !!(url && key && !url.includes("your-project-id"))
    return configured
}

/** Map a Supabase Watch row → frontend WatchData shape */
function mapWatchToWatchData(w: Watch): WatchData {
    return {
        id: w.slug ?? w.id,  // prefer slug for SEO URLs, fallback to UUID
        brand: w.brand,
        model: w.model,
        image: w.image_url || PLACEHOLDER_IMAGE,
        reference: w.reference,
        movement: w.caliber ?? "---",
        price: w.price ?? "N/A",
        rating: w.rating,
        caseDiameter: w.case_size ?? "---",
        thickness: w.thickness ?? "---",
        lugToLug: w.lug_to_lug ?? "---",
        waterResistance: w.water_resistance ?? "---",
        crystal: w.crystal ?? "---",
        bracelet: w.bracelet ?? "---",
        material: w.material ?? "---",
        powerReserve: w.power_reserve ?? "---",
        frequency: w.frequency ?? "---",
        jewels: w.jewels ?? "---",
        marketTrend: w.market_trend ?? "+0.0%",
        transactions: w.transactions,
        year: w.year ?? 2024,
        style: w.category ?? "Dress",
        complications: w.complications ?? [],
        legacy: w.story_text,
        reviewSnippets: [],
        chrono24Url: w.chrono24_url,
    }
}

// ─── Server Actions ─────────────────────────────────────────────

export async function getWatches(filters?: {
    category?: string
    brand?: string
    query?: string
    material?: string
    movement?: string
    sort?: string
}): Promise<WatchData[]> {
    if (!isSupabaseConfigured()) {
        console.log("[getWatches] Supabase not configured, using mock data")
        let watches = [featuredWatch, ...trendingWatches]
        if (filters?.category) {
            watches = watches.filter((w) => w.style.toLowerCase() === filters.category!.toLowerCase())
        }
        if (filters?.brand) {
            watches = watches.filter((w) => w.brand.toLowerCase() === filters.brand!.toLowerCase())
        }
        if (filters?.material) {
            watches = watches.filter((w) => w.material.toLowerCase() === filters.material!.toLowerCase())
        }
        if (filters?.movement) {
            watches = watches.filter((w) => w.movement.toLowerCase() === filters.movement!.toLowerCase())
        }
        if (filters?.query) {
            const q = filters.query.toLowerCase()
            watches = watches.filter(w =>
                w.brand.toLowerCase().includes(q) ||
                w.model.toLowerCase().includes(q) ||
                w.reference.toLowerCase().includes(q) ||
                w.movement.toLowerCase().includes(q)
            )
        }
        return watches
    }

    try {
        const supabase = await createClient()
        let query = supabase.from("watches").select("*")

        if (filters?.sort) {
            switch (filters.sort) {
                case "price_asc":
                    query = query.order("price", { ascending: true })
                    break
                case "price_desc":
                    query = query.order("price", { ascending: false })
                    break
                case "year_newest":
                    query = query.order("year", { ascending: false })
                    break
                case "rating":
                    query = query.order("rating", { ascending: false })
                    break
                case "newest":
                default:
                    query = query.order("created_at", { ascending: false })
                    break
            }
        } else {
            query = query.order("created_at", { ascending: false })
        }

        if (filters?.category) {
            query = query.ilike("category", filters.category)
        }
        if (filters?.brand) {
            query = query.ilike("brand", filters.brand)
        }
        if (filters?.material) {
            query = query.ilike("material", `%${filters.material}%`)
        }
        if (filters?.movement) {
            query = query.ilike("caliber", `%${filters.movement}%`)
        }
        if (filters?.query) {
            query = query.or(`brand.ilike.%${filters.query}%,model.ilike.%${filters.query}%,reference.ilike.%${filters.query}%,caliber.ilike.%${filters.query}%`)
        }

        const { data, error } = await query

        if (error) {
            console.error("[getWatches] Supabase query error:", error.message, error.code, error.details)
            return [featuredWatch, ...trendingWatches]
        }

        if (!data || data.length === 0) {
            console.warn("[getWatches] Supabase returned 0 rows — did you run seed.sql?")
            return [featuredWatch, ...trendingWatches]
        }

        console.log(`[getWatches] Fetched ${data.length} watches from Supabase`)
        return (data as any[]).map(mapWatchToWatchData)
    } catch (err) {
        console.error("[getWatches] Unexpected error:", err)
        return [featuredWatch, ...trendingWatches]
    }
}

export async function getWatchDetail(slug: string): Promise<WatchData | null> {
    if (!isSupabaseConfigured()) {
        console.log("[getWatchDetail] Supabase not configured, using mock data for:", slug)
        const all = [featuredWatch, ...trendingWatches]
        return all.find((w) => w.id === slug) ?? null
    }

    try {
        const supabase = await createClient()

        // Try slug first (SEO-friendly URLs like /watch/datograph)
        const { data: bySlugRaw } = await supabase
            .from("watches")
            .select("*")
            .eq("slug", slug)
            .maybeSingle()

        const bySlug = bySlugRaw as any

        if (bySlug) {
            console.log(`[getWatchDetail] Found by slug: "${bySlug.brand} ${bySlug.model}"`)
            return mapWatchToWatchData(bySlug)
        }

        // Fallback: try matching by UUID primary key (e.g. /watch/1f250d96-...)
        const { data: byIdRaw } = await supabase
            .from("watches")
            .select("*")
            .eq("id", slug)
            .maybeSingle()

        const byId = byIdRaw as any

        if (byId) {
            console.log(`[getWatchDetail] Found by UUID: "${byId.brand} ${byId.model}"`)
            return mapWatchToWatchData(byId)
        }

        console.warn(`[getWatchDetail] No watch found for slug/id: "${slug}"`)
        // Final fallback to mock data
        const all = [featuredWatch, ...trendingWatches]
        return all.find((w) => w.id === slug) ?? null
    } catch (err) {
        console.error("[getWatchDetail] Unexpected error:", err)
        const all = [featuredWatch, ...trendingWatches]
        return all.find((w) => w.id === slug) ?? null
    }
}

export async function getFeaturedWatch(): Promise<WatchData> {
    if (!isSupabaseConfigured()) {
        return featuredWatch
    }

    try {
        const supabase = await createClient()
        const { data: dataRaw, error } = await supabase
            .from("watches")
            .select("*")
            .eq("is_featured", true)
            .limit(1)
            .maybeSingle()

        const data = dataRaw as any

        if (error || !data) {
            console.error("[getFeaturedWatch] Supabase error:", error?.message)
            return featuredWatch
        }

        console.log(`[getFeaturedWatch] Fetched "${data.brand} ${data.model}" from Supabase`)
        return mapWatchToWatchData(data)
    } catch (err) {
        console.error("[getFeaturedWatch] Unexpected error:", err)
        return featuredWatch
    }
}

export async function createWatch(formData: any) {
    if (!isSupabaseConfigured()) {
        return { success: false, message: "Supabase not configured." }
    }

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, message: "Unauthorized" }

        const { data: profileRaw } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
        const profile = profileRaw as any
        if (!profile?.is_admin) return { success: false, message: "Unauthorized: Admins only" }

        const slugStr = `${formData.brand}-${formData.model}-${formData.reference}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

        const insertData = {
            brand: formData.brand,
            model: formData.model,
            reference: formData.reference,
            year: formData.year ? parseInt(formData.year.toString()) : null,
            caliber: formData.caliber,
            power_reserve: formData.powerReserve,
            case_size: formData.caseSize,
            lug_to_lug: formData.lugToLug,
            thickness: formData.thickness,
            material: formData.material,
            water_resistance: formData.waterResistance,
            story_text: formData.story,
            category: formData.category,
            image_url: formData.imageUrl,
            complications: formData.features || [],
            slug: slugStr
        }

        const { data, error } = await (supabase as any).from('watches').insert(insertData).select().single()

        if (error) {
            console.error("CREATE_WATCH_ERROR", error)
            return { success: false, message: "Failed to insert watch: " + error.message }
        }

        revalidatePath('/watches')
        revalidatePath('/')

        return { success: true, message: "Watch added successfully!", watch: data }
    } catch (err: any) {
        console.error("CREATE_WATCH_ERROR", err)
        return { success: false, message: "An unexpected error occurred." }
    }
}

export async function deleteWatch(watchId: string) {
    if (!isSupabaseConfigured()) {
        return { success: false, message: "Supabase not configured." }
    }

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, message: "Unauthorized" }

        const { data: profileRaw } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
        const profile = profileRaw as any
        if (!profile?.is_admin) return { success: false, message: "Unauthorized: Admins only" }

        const { error } = await supabase.from('watches').delete().eq('id', watchId)

        if (error) {
            console.error("DELETE_WATCH_ERROR", error)
            return { success: false, message: "Failed to delete watch: " + error.message }
        }

        revalidatePath('/admin')
        revalidatePath('/watches')
        revalidatePath('/')

        return { success: true, message: "Watch deleted successfully." }
    } catch (err: any) {
        console.error("DELETE_WATCH_ERROR", err)
        return { success: false, message: "An unexpected error occurred." }
    }
}
