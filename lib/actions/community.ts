"use server"

import { createClient } from "@/lib/supabase/server"

// ─── Grandmasters / Best Vaults ─────────────────────────────────

export async function getGrandmasters(limit: number = 15): Promise<any[]> {
    try {
        const supabase = await createClient()
        const { data, error } = await (supabase as any)
            .from("profiles")
            .select("id, username, avatar_url, vault_image_url, legacy_score, vault_rating, total_pieces")
            .order("legacy_score", { ascending: false })
            .limit(limit)
        if (error) { console.error("getGrandmasters error:", error.message); return [] }
        return data ?? []
    } catch (e) { console.error("getGrandmasters crashed:", e); return [] }
}

export async function getLatestVaults(limit: number = 15): Promise<any[]> {
    try {
        const supabase = await createClient()
        const { data, error } = await (supabase as any)
            .from("profiles")
            .select("id, username, avatar_url, vault_image_url, legacy_score, vault_rating, total_pieces, created_at")
            .order("created_at", { ascending: false })
            .limit(limit)
        if (error) { console.error("getLatestVaults error:", error.message); return [] }
        return data ?? []
    } catch (e) { console.error("getLatestVaults crashed:", e); return [] }
}

// ─── Trending / Latest / Best Wrist Rolls ───────────────────────

export async function getTrendingWristRolls(limit: number = 15): Promise<any[]> {
    try {
        const supabase = await createClient()
        const { data, error } = await (supabase as any)
            .from("wrist_rolls")
            .select("*, profiles!wrist_rolls_user_id_fkey(username, avatar_url), watches(brand, model, slug)")
            .order("likes", { ascending: false })
            .limit(limit)
        if (error) { console.error("getTrendingWristRolls error:", error.message); return [] }
        return data ?? []
    } catch (e) { console.error("getTrendingWristRolls crashed:", e); return [] }
}

export async function getLatestWristRolls(limit: number = 15): Promise<any[]> {
    try {
        const supabase = await createClient()
        const { data, error } = await (supabase as any)
            .from("wrist_rolls")
            .select("*, profiles!wrist_rolls_user_id_fkey(username, avatar_url), watches(brand, model, slug)")
            .order("created_at", { ascending: false })
            .limit(limit)
        if (error) { console.error("getLatestWristRolls error:", error.message); return [] }
        return data ?? []
    } catch (e) { console.error("getLatestWristRolls crashed:", e); return [] }
}
