import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("CRITICAL: MISSING SUPABASE URL or ANON KEY in browser client.")
        throw new Error("Supabase environment variables are not configured.")
    }

    return createBrowserClient<Database>(
        supabaseUrl,
        supabaseAnonKey
    )
}
