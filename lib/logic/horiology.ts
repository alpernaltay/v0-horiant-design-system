import { createClient } from "@/lib/supabase/server"

// Watch Data passed into the engine
export interface VaultWatch {
    id: string
    brand: string
    category: string
    complications?: string[]
}

// Weighting dictionary based on horological prestige
const BRAND_TIERS: Record<string, number> = {
    // Holy Trinity
    "Patek Philippe": 100,
    "Audemars Piguet": 100,
    "Vacheron Constantin": 100,
    "A. Lange & Söhne": 100,

    // Haute Horlogerie / True Independents
    "F.P. Journe": 80,
    "Richard Mille": 80,
    "MB&F": 80,
    "De Bethune": 80,
    "Rexhep Rexhepi": 80,
    "Kari Voutilainen": 80,

    // Heritage & Primary Majors
    "Rolex": 50,
    "Jaeger-LeCoultre": 50,
    "Breguet": 50,
    "Blancpain": 50,
    "Cartier": 40,
    "Omega": 40,
    "Grand Seiko": 40,

    // Enthusiast & Tool
    "Tudor": 25,
    "IWC": 25,
    "Panerai": 25,
    "Zenith": 25,
    "Breitling": 25,
    "Nomos": 20,

    // Accessible Luxury
    "Longines": 10,
    "Oris": 10,
    "Hamilton": 10,
    "Seiko": 5,
    "Tissot": 5
}

/**
 * Calculates the Total Complications by summing the length of the complications arrays
 */
export function calculateTotalComplications(watches: VaultWatch[]): number {
    return watches.reduce((acc, watch) => {
        // Assume empty/undefined is 0
        const compCount = watch.complications && Array.isArray(watch.complications)
            ? watch.complications.length
            : 0;
        return acc + compCount;
    }, 0)
}

/**
 * Computes the Legacy Score based on Brand Tier weights, Collection Diversity, and Community Rating.
 */
export function calculateLegacyScore(watches: VaultWatch[], vaultRating: number = 0): number {
    if (!watches || watches.length === 0) return 0;

    // 1. Base Score (Sum of Brand Tiers)
    let baseScore = 0;
    const uniqueCategories = new Set<string>();

    for (const watch of watches) {
        // Fallback to Enthusiast tier (25) if brand not explicitly in our luxury dictionary
        const brandWeight = BRAND_TIERS[watch.brand] || 25;
        baseScore += brandWeight;

        if (watch.category) {
            uniqueCategories.add(watch.category);
        }
    }

    // 2. Diversity Bonus (20 points per unique category - Diver, Dress, Chrono etc.)
    const diversityBonus = uniqueCategories.size * 20;

    // Subtotal before community modifier
    const subtotal = baseScore + diversityBonus;

    // 3. Community Weight Modifier: (Rating / 5) -> 3.5 rating = 70% of max potential weight
    // If vault rating is 0 (no reviews), give them a neutral 1.0 multiplier so they aren't punished for being new.
    let multiplier = 1.0;
    if (vaultRating > 0) {
        // Normalizes 0-5 stars to 0.5-1.5 multiplier (rewards high ratings, slightly penalizes low ratings)
        multiplier = 0.5 + (vaultRating / 5);
    }

    // Return the final rounded score
    return Math.round(subtotal * multiplier);
}

/**
 * Triggers a full recalculation of a user's collection metrics and saves to Supabase.
 * Should be called whenever they Add/Remove a watch, or when their Vault receives a review.
 */
export async function syncProfileStats(userId: string) {
    const supabase = await createClient()

    // 1. Fetch user's watch collection
    // We join watches through the collections table
    const { data: vaultItems, error: vaultError } = await (supabase as any)
        .from('collections')
        .select(`
            watches (
                id,
                brand,
                category,
                complications
            )
        `)
        .eq('user_id', userId)

    if (vaultError) {
        console.error("syncProfileStats Error fetching vault items:", vaultError)
        return null
    }

    // Extract raw watch objects
    const watchesData = vaultItems
        ?.map((item: any) => item.watches)
        ?.filter((w: any) => w !== null) as VaultWatch[] || []

    // 2. Fetch user's community Vault Rating (average of reviews)
    const { data: reviewsData } = await (supabase as any)
        .from('reviews')
        .select('rating')
        .eq('target_profile_id', userId)
        // only tally top level ratings, not nested replies
        .is('parent_id', null)

    let vaultRating = 0;
    if (reviewsData && reviewsData.length > 0) {
        const sum = reviewsData.reduce((acc: any, rev: any) => acc + (rev.rating || 0), 0)
        vaultRating = sum / reviewsData.length;
    }

    // 3. Calculate New Metrics
    const totalPieces = watchesData.length;
    const totalComplications = calculateTotalComplications(watchesData);
    const legacyScore = calculateLegacyScore(watchesData, vaultRating);

    // 4. Update the Profile in DB
    const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({
            total_pieces: totalPieces,
            total_complications: totalComplications,
            legacy_score: legacyScore,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)

    if (updateError) {
        console.error("syncProfileStats Error updating profile:", updateError)
        return false;
    }

    return { totalPieces, totalComplications, legacyScore, vaultRating }
}
