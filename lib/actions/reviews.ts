"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { syncProfileStats } from "@/lib/logic/horiology"

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

export async function addReview(targetId: string, payload: { rating: number; title: string; body: string }, targetType: 'watch' | 'profile' = 'watch') {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, message: "Please sign in to write a review." }
        }

        const { data: profileRaw } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        const profile = profileRaw as any;

        let resolvedWatchId = null;
        let profileId = null;

        if (targetType === 'watch') {
            resolvedWatchId = await findWatchId(supabase, targetId);
            if (!resolvedWatchId) return { success: false, message: "Invalid watch." }
        } else {
            profileId = targetId; // Using the provided profile ID
        }
        const authorName = profile?.username || profile?.full_name || "Anonymous Member"

        const { data: newReviewRaw, error } = await supabase.from("reviews").insert({
            user_id: user.id,
            watch_id: resolvedWatchId || null,
            profile_id: profileId || null,
            rating: payload.rating,
            title: payload.title || "",
            body: payload.body,
            author_name: authorName,
            likes: 0
        } as any).select().single()

        const newReview = newReviewRaw as any;

        if (error) {
            if (error.code === '23505') {
                return { success: false, message: "duplicate_review" }
            }
            console.error("REVIEW_INSERT_ERROR:", error)
            return { success: false, message: "Failed to submit review." }
        }

        if (targetType === 'watch') {
            revalidatePath('/watch/[slug]', 'page')
            revalidatePath('/watches')
        } else if (profileId) {
            await syncProfileStats(profileId)
            revalidatePath('/vault/[username]', 'page')
            revalidatePath('/collection')
        }
        return { success: true, message: "Review published successfully!", data: { id: newReview?.id } }
    } catch (err: any) {
        console.error(err)
        return { success: false, message: "Unexpected error." }
    }
}

export async function likeReview(reviewId: string) {
    try {
        // Normally we'd track who liked what to prevent duplicate likes, 
        // but for now we simply increment the likes column natively via RPC or fallback to an update if needed.
        const supabase = await createClient()

        // Let's manually fetch and update for simplicity, though RPC `increment` is better
        const { data } = await (supabase as any).from("reviews").select("likes").eq("id", reviewId).single()
        if (!data) return { success: false }

        const { error } = await (supabase as any)
            .from("reviews")
            .update({ likes: data.likes + 1 })
            .eq("id", reviewId)
        if (error) return { success: false, message: error.message }

        return { success: true }
    } catch (err) {
        return { success: false }
    }
}

export async function replyToReview(parentId: string, body: string, watchId?: string, profileId?: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error("AUTH_ERROR:", authError)
            return { success: false, message: "You must be logged in to reply." }
        }

        const { data: profileRaw } = await supabase
            .from("profiles")
            .select("username, full_name")
            .eq("id", user.id)
            .single()

        const profile = profileRaw as any;

        const authorName = profile?.username || profile?.full_name || "Community Member"

        // Resolve watch_id slug -> UUID
        let resolvedWatchId = null;
        if (watchId) {
            resolvedWatchId = await findWatchId(supabase, watchId);
        }

        const { data: newReplyRaw, error } = await supabase.from("reviews").insert({
            user_id: user.id,
            watch_id: resolvedWatchId || null, // ensure watch_id is provided or null
            profile_id: profileId || null,
            parent_id: parentId,
            body: body,
            author_name: authorName,
            likes: 0
        } as any).select().single()

        const newReply = newReplyRaw as any;

        if (error) {
            console.error("REVIEW_REPLY_INSERT_ERROR:", error)
            return { success: false, message: "Failed to submit reply." }
        }

        if (watchId) {
            revalidatePath('/watch/[slug]', 'page')
            revalidatePath('/watches')
        }
        if (profileId) {
            await syncProfileStats(profileId)
            revalidatePath('/vault/[username]', 'page')
            revalidatePath('/collection')
        }
        return { success: true, message: "Reply published!", data: { id: newReply?.id } }
    } catch (err: any) {
        console.error(err)
        return { success: false, message: "Unexpected error." }
    }
}

export async function voteReview(reviewId: string, voteType: 'up' | 'down') {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, message: "Must be logged in to vote." }

        // 1. Query existing vote
        const { data: existingVote } = await (supabase as any)
            .from('review_votes')
            .select('*')
            .eq('review_id', reviewId)
            .eq('user_id', user.id)
            .maybeSingle();

        // 2. Fetch current counts from reviews table
        const { data: reviewRaw } = await supabase.from('reviews').select('likes, dislikes, watch_id, profile_id').eq('id', reviewId).single();
        const review: any = reviewRaw;

        // 3. Execute STRICT Toggle Logic
        if (existingVote) {
            if (existingVote.vote_type === voteType) {
                // SCENARIO 1: USER CLICKS THE SAME BUTTON -> REMOVE VOTE
                await (supabase as any).from('review_votes').delete().eq('id', existingVote.id);
                const newCount = Math.max(0, review[voteType + 's'] - 1);
                await (supabase as any).from('reviews').update({ [voteType + 's']: newCount }).eq('id', reviewId);
            } else {
                // SCENARIO 2: USER SWAPS VOTE (Like -> Dislike or vice versa)
                await (supabase as any).from('review_votes').update({ vote_type: voteType }).eq('id', existingVote.id);
                const oldType = existingVote.vote_type;
                const newOldCount = Math.max(0, review[oldType + 's'] - 1);
                const newCurrentCount = review[voteType + 's'] + 1;
                await (supabase as any).from('reviews').update({
                    [oldType + 's']: newOldCount,
                    [voteType + 's']: newCurrentCount
                }).eq('id', reviewId);
            }
        } else {
            // SCENARIO 3: BRAND NEW VOTE
            await (supabase as any).from('review_votes').insert({ review_id: reviewId, user_id: user.id, vote_type: voteType });
            const newCount = review[voteType + 's'] + 1;
            await (supabase as any).from('reviews').update({ [voteType + 's']: newCount }).eq('id', reviewId);
        }


        const { data: updatedReviewRaw } = await supabase.from('reviews').select('likes, dislikes').eq('id', reviewId).single();
        const updatedReview: any = updatedReviewRaw;

        let finalVoteType: 'up' | 'down' | null = null;
        if (existingVote) {
            if (existingVote.vote_type !== voteType) finalVoteType = voteType;
        } else {
            finalVoteType = voteType;
        }

        return { success: true, likes: updatedReview?.likes || 0, dislikes: updatedReview?.dislikes || 0, userVote: finalVoteType }
    } catch (err: any) {
        console.error("VOTE_ERROR:", err.message)
        return { success: false, message: "Unexpected error" }
    }
}

export async function deleteReview(reviewId: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, message: "Unauthorized" }
        }

        const { data: existingRevRaw } = await supabase.from('reviews').select('watch_id, profile_id').eq('id', reviewId).maybeSingle()
        const existingRev = existingRevRaw as any;

        const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", reviewId)
            .eq("user_id", user.id)

        if (error) {
            console.error("REVIEW_DELETE_ERROR:", error)
            return { success: false, message: "Failed to delete review." }
        }

        if (existingRev?.watch_id) {
            revalidatePath('/watch/[slug]', 'page')
            revalidatePath('/watches')
        }
        if (existingRev?.profile_id) {
            await syncProfileStats(existingRev.profile_id)
            revalidatePath('/vault/[username]', 'page')
            revalidatePath('/collection')
        }
        return { success: true, message: "Review deleted successfully" }
    } catch (err) {
        return { success: false, message: "Unexpected error" }
    }
}

export async function updateReview(reviewId: string, payload: { title?: string, body: string }) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, message: "Unauthorized" }
        }

        const updateData: any = { body: payload.body }
        if (payload.title !== undefined) {
            updateData.title = payload.title
        }

        const { error } = await (supabase as any)
            .from("reviews")
            .update(updateData)
            .eq("id", reviewId)
            .eq("user_id", user.id)

        if (error) {
            console.error("REVIEW_UPDATE_ERROR:", error)
            return { success: false, message: "Failed to update review." }
        }

        const { data: existingRevRaw } = await supabase.from('reviews').select('watch_id, profile_id').eq('id', reviewId).maybeSingle()
        const existingRev = existingRevRaw as any;
        if (existingRev?.watch_id) {
            revalidatePath('/watch/[slug]', 'page')
            revalidatePath('/watches')
        }
        if (existingRev?.profile_id) {
            revalidatePath('/vault/[username]', 'page')
            revalidatePath('/collection')
        }
        return { success: true, message: "Review updated successfully" }
    } catch (err) {
        return { success: false, message: "Unexpected error" }
    }
}

/**
 * Fetches all reviews for a watch and returning the flat array.
 */
export async function getReviewsForWatch(watchId: string) {
    try {
        const supabase = await createClient()
        const { data: allReviewsRaw } = await supabase
            .from('reviews')
            .select('*, profiles!reviews_user_id_fkey(username)')
            .eq('watch_id', watchId)
            .order('created_at', { ascending: true })

        return allReviewsRaw || []
    } catch (err) {
        console.error("Failed to fetch reviews for watch:", err)
        return []
    }
}

/**
 * Fetches all reviews for a profile and returning the flat array.
 */
export async function getReviewsForProfile(profileId: string) {
    try {
        const supabase = await createClient()
        const { data: allReviewsRaw } = await supabase
            .from('reviews')
            .select('*, profiles!reviews_user_id_fkey(username)')
            .eq('profile_id', profileId)
            .order('created_at', { ascending: true })

        return allReviewsRaw || []
    } catch (err) {
        console.error("Failed to fetch reviews for profile:", err)
        return []
    }
}
