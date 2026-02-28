// ============================================================
// Hand-written Database types matching the SQL schema.
// Replace with auto-generated types via `supabase gen types`
// once your project is live.
// ============================================================

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    wrist_size: number | null
                    bio: string
                    avatar_url: string
                    is_pro: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username?: string | null
                    wrist_size?: number | null
                    bio?: string
                    avatar_url?: string
                    is_pro?: boolean
                }
                Update: {
                    username?: string | null
                    wrist_size?: number | null
                    bio?: string
                    avatar_url?: string
                    is_pro?: boolean
                }
            }
            watches: {
                Row: {
                    id: string
                    brand: string
                    model: string
                    reference: string
                    year: number | null
                    caliber: string | null
                    power_reserve: string | null
                    case_size: string | null
                    lug_to_lug: string | null
                    thickness: string | null
                    material: string | null
                    water_resistance: string | null
                    crystal: string | null
                    bracelet: string | null
                    story_text: string
                    image_url: string
                    category: string | null
                    price: string | null
                    market_trend: string | null
                    transactions: number
                    rating: number
                    frequency: string | null
                    jewels: string | null
                    chrono24_url: string
                    complications: string[]
                    slug: string
                    is_featured: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    brand: string
                    model: string
                    reference: string
                    year?: number | null
                    caliber?: string | null
                    power_reserve?: string | null
                    case_size?: string | null
                    lug_to_lug?: string | null
                    thickness?: string | null
                    material?: string | null
                    water_resistance?: string | null
                    crystal?: string | null
                    bracelet?: string | null
                    story_text?: string
                    image_url?: string
                    category?: string | null
                    price?: string | null
                    market_trend?: string | null
                    transactions?: number
                    rating?: number
                    frequency?: string | null
                    jewels?: string | null
                    chrono24_url?: string
                    complications?: string[]
                    slug: string
                    is_featured?: boolean
                }
                Update: Partial<Database["public"]["Tables"]["watches"]["Insert"]>
            }
            collections: {
                Row: {
                    id: string
                    user_id: string
                    watch_id: string
                    is_verified: boolean
                    added_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    watch_id: string
                    is_verified?: boolean
                }
                Update: {
                    is_verified?: boolean
                }
            }
            reviews: {
                Row: {
                    id: string
                    user_id: string
                    watch_id: string
                    rating: number
                    title: string
                    comment: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    watch_id: string
                    rating: number
                    title?: string
                    comment?: string
                }
                Update: {
                    rating?: number
                    title?: string
                    comment?: string
                }
            }
        }
    }
}

// Helper type to extract Row types
export type Tables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"]

// Convenience aliases
export type Watch = Tables<"watches">
export type Profile = Tables<"profiles">
export type CollectionItem = Tables<"collections">
export type Review = Tables<"reviews">

// Watch with collection join info
export type CollectionWatch = Watch & {
    is_verified: boolean
    added_at: string
}
