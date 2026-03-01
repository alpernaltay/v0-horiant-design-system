"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

// ─── Helpers ────────────────────────────────────────────────────

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function resolveWatchId(supabase: any, input: string): Promise<string | null> {
    const { data: bySlug } = await supabase.from("watches").select("id").eq("slug", input).maybeSingle()
    if (bySlug?.id) return bySlug.id
    if (!UUID_REGEX.test(input)) return null
    const { data: byId } = await supabase.from("watches").select("id").eq("id", input).maybeSingle()
    return byId?.id ?? null
}

function revalidateAll() {
    revalidatePath("/wrist-rolls")
    revalidatePath("/watch", "layout")
    revalidatePath("/collection")
    revalidatePath("/vault", "layout")
}

// ─── CRUD: Wrist Rolls ──────────────────────────────────────────

export async function createWristRoll(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "You must be logged in to post." }

    const rawWatchId = formData.get("watchId") as string
    const caption = formData.get("caption") as string
    const file = formData.get("image") as File

    if (!rawWatchId || !file) return { success: false, message: "Watch and image are required." }
    if (file.size > 5 * 1024 * 1024) return { success: false, message: "Image must be less than 5MB." }

    const watchId = await resolveWatchId(supabase, rawWatchId)
    if (!watchId) return { success: false, message: "Could not find the selected watch." }

    try {
        const fileExt = file.name.split(".").pop() || "jpg"
        const filePath = `${user.id}/${uuidv4()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("wrist_rolls").upload(filePath, file)
        if (uploadError) return { success: false, message: `Upload failed: ${uploadError.message}` }

        const { data: { publicUrl } } = supabase.storage.from("wrist_rolls").getPublicUrl(filePath)

        const { error: insertError } = await (supabase as any)
            .from("wrist_rolls")
            .insert({ user_id: user.id, watch_id: watchId, image_url: publicUrl, caption: caption || null })
        if (insertError) return { success: false, message: `Database error: ${insertError.message}` }

        // Auto-add to collection (silent)
        await (supabase as any)
            .from("collections")
            .upsert({ user_id: user.id, watch_id: watchId }, { onConflict: "user_id,watch_id", ignoreDuplicates: true })

        revalidateAll()
        return { success: true, message: "Wrist-Roll posted successfully." }
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred." }
    }
}

export async function deleteWristRoll(wristRollId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Not authenticated." }

    const { data: post } = await (supabase as any)
        .from("wrist_rolls").select("id, user_id").eq("id", wristRollId).single()
    if (!post || post.user_id !== user.id) return { success: false, message: "Not authorized." }

    await (supabase as any).from("wrist_rolls").delete().eq("id", wristRollId)
    revalidateAll()
    return { success: true, message: "Post deleted." }
}

export async function updateWristRollCaption(wristRollId: string, caption: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Not authenticated." }

    const { error } = await (supabase as any)
        .from("wrist_rolls").update({ caption }).eq("id", wristRollId).eq("user_id", user.id)
    if (error) return { success: false, message: error.message }

    revalidateAll()
    return { success: true, message: "Caption updated." }
}

// ─── Queries ────────────────────────────────────────────────────

export async function getGlobalWristRolls() {
    const supabase = await createClient()
    const { data, error } = await (supabase as any)
        .from("wrist_rolls")
        .select(`*, profiles!wrist_rolls_user_id_fkey ( username, avatar_url ), watches ( id, slug, brand, model )`)
        .order("created_at", { ascending: false })
    if (error) { console.error("Error fetching global wrist rolls:", error.message ?? error); return [] }
    return data ?? []
}

export async function getWristRollsByWatch(watchIdOrSlug: string) {
    const supabase = await createClient()
    const watchId = await resolveWatchId(supabase, watchIdOrSlug)
    if (!watchId) return []
    const { data, error } = await (supabase as any)
        .from("wrist_rolls")
        .select(`*, profiles!wrist_rolls_user_id_fkey ( username, avatar_url ), watches ( id, slug, brand, model )`)
        .eq("watch_id", watchId)
        .order("created_at", { ascending: false })
    if (error) { console.error("Error fetching wrist rolls for watch:", error.message ?? error); return [] }
    return data ?? []
}

export async function getWristRollsByProfile(userId: string) {
    const supabase = await createClient()
    const { data, error } = await (supabase as any)
        .from("wrist_rolls")
        .select(`*, profiles!wrist_rolls_user_id_fkey ( username, avatar_url ), watches ( id, slug, brand, model )`)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
    if (error) { console.error("Error fetching profile wrist rolls:", error.message ?? error); return [] }
    return data ?? []
}

// ─── Post Likes ─────────────────────────────────────────────────

export async function toggleWristRollLike(wristRollId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { liked: false, error: "Not authenticated." }

    const { data: existing } = await (supabase as any)
        .from("wrist_roll_likes").select("id").eq("user_id", user.id).eq("wrist_roll_id", wristRollId).maybeSingle()

    // Fetch current counts from main table
    const { data: postRaw } = await (supabase as any)
        .from('wrist_rolls')
        .select('likes')
        .eq('id', wristRollId)
        .single();
    const currentLikes = postRaw?.likes || 0;

    if (existing) {
        await (supabase as any).from("wrist_roll_likes").delete().eq("id", existing.id)
        const newCount = Math.max(0, currentLikes - 1);
        await (supabase as any).from("wrist_rolls").update({ likes: newCount }).eq("id", wristRollId)
        revalidateAll()
        return { liked: false }
    }

    await (supabase as any).from("wrist_roll_likes").insert({ user_id: user.id, wrist_roll_id: wristRollId })
    const newCount = currentLikes + 1;
    await (supabase as any).from("wrist_rolls").update({ likes: newCount }).eq("id", wristRollId)
    revalidateAll()
    return { liked: true }
}

export async function getWristRollLikeStatus(wristRollId: string) {
    const supabase = await createClient()
    const { count } = await (supabase as any)
        .from("wrist_roll_likes").select("*", { count: "exact", head: true }).eq("wrist_roll_id", wristRollId)
    const { data: { user } } = await supabase.auth.getUser()
    let userLiked = false
    if (user) {
        const { data: existing } = await (supabase as any)
            .from("wrist_roll_likes").select("id").eq("user_id", user.id).eq("wrist_roll_id", wristRollId).maybeSingle()
        userLiked = !!existing
    }
    return { count: count ?? 0, userLiked }
}

// ─── Comments ───────────────────────────────────────────────────

export async function addWristRollComment(wristRollId: string, content: string, parentId?: string | null) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Not authenticated." }
    if (!content.trim()) return { success: false, message: "Comment cannot be empty." }

    const record: any = { user_id: user.id, wrist_roll_id: wristRollId, content: content.trim() }
    if (parentId) record.parent_id = parentId

    const { error } = await (supabase as any)
        .from("wrist_roll_comments")
        .insert(record)
    if (error) return { success: false, message: error.message }

    revalidateAll()
    return { success: true }
}

export async function getWristRollComments(wristRollId: string) {
    const supabase = await createClient()
    const { data, error } = await (supabase as any)
        .from("wrist_roll_comments")
        .select(`id, content, created_at, user_id, parent_id, likes, dislikes, profiles ( username, avatar_url )`)
        .eq("wrist_roll_id", wristRollId)
        .order("created_at", { ascending: true })
    if (error) { console.error("Error fetching comments:", error.message ?? error); return [] }
    return data ?? []
}

export async function updateWristRollComment(commentId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Not authenticated." }
    if (!content.trim()) return { success: false, message: "Comment cannot be empty." }

    const { error } = await (supabase as any)
        .from("wrist_roll_comments")
        .update({ content: content.trim() })
        .eq("id", commentId)
        .eq("user_id", user.id)
    if (error) return { success: false, message: error.message }

    revalidateAll()
    return { success: true, message: "Comment updated." }
}

export async function deleteWristRollComment(commentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Not authenticated." }

    await (supabase as any)
        .from("wrist_roll_comments").delete().eq("id", commentId).eq("user_id", user.id)
    revalidateAll()
    return { success: true }
}

// ─── Comment Votes ──────────────────────────────────────────────

export async function voteWristRollComment(commentId: string, voteType: "up" | "down") {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { vote: null, error: "Not authenticated." }

    // Fetch existing logic
    const { data: existing } = await (supabase as any)
        .from("wrist_roll_comment_votes")
        .select("id, vote_type")
        .eq("user_id", user.id)
        .eq("comment_id", commentId)
        .maybeSingle()

    // Fetch current counts from main table
    const { data: commentRaw } = await (supabase as any)
        .from('wrist_roll_comments')
        .select('likes, dislikes')
        .eq('id', commentId)
        .single();

    // In case the row has nulls, default to 0
    const currentLikes = commentRaw?.likes || 0;
    const currentDislikes = commentRaw?.dislikes || 0;

    let finalVoteType: "up" | "down" | null = null;

    if (existing) {
        if (existing.vote_type === voteType) {
            // SCENARIO 1: Same vote -> Remove vote
            await (supabase as any).from("wrist_roll_comment_votes").delete().eq("id", existing.id)
            const newCount = Math.max(0, (voteType === 'up' ? currentLikes : currentDislikes) - 1);
            await (supabase as any).from("wrist_roll_comments").update({ [voteType + 's']: newCount }).eq("id", commentId)
            finalVoteType = null;
        } else {
            // SCENARIO 2: Swap vote
            await (supabase as any).from("wrist_roll_comment_votes").update({ vote_type: voteType }).eq("id", existing.id)
            const oldType = existing.vote_type;
            const newOldCount = Math.max(0, (oldType === 'up' ? currentLikes : currentDislikes) - 1);
            const newCurrentCount = (voteType === 'up' ? currentLikes : currentDislikes) + 1;
            await (supabase as any).from("wrist_roll_comments").update({
                [oldType + 's']: newOldCount,
                [voteType + 's']: newCurrentCount
            }).eq("id", commentId)
            finalVoteType = voteType;
        }
    } else {
        // SCENARIO 3: New vote
        await (supabase as any).from("wrist_roll_comment_votes").insert({ user_id: user.id, comment_id: commentId, vote_type: voteType })
        const newCount = (voteType === 'up' ? currentLikes : currentDislikes) + 1;
        await (supabase as any).from("wrist_roll_comments").update({ [voteType + 's']: newCount }).eq("id", commentId)
        finalVoteType = voteType;
    }

    revalidateAll()

    const { data: updatedComment } = await (supabase as any)
        .from('wrist_roll_comments')
        .select('likes, dislikes')
        .eq('id', commentId)
        .single();

    return {
        vote: finalVoteType,
        likes: updatedComment?.likes || 0,
        dislikes: updatedComment?.dislikes || 0
    }
}

export async function getCommentVotes(commentIds: string[]) {
    if (commentIds.length === 0) return {}
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: allVotes } = await (supabase as any)
        .from("wrist_roll_comment_votes")
        .select("comment_id, vote_type")
        .in("comment_id", commentIds)

    // Build counts
    const result: Record<string, { upCount: number; downCount: number; userVote: "up" | "down" | null }> = {}
    commentIds.forEach(id => { result[id] = { upCount: 0, downCount: 0, userVote: null } })

    if (allVotes) {
        allVotes.forEach((v: any) => {
            if (!result[v.comment_id]) result[v.comment_id] = { upCount: 0, downCount: 0, userVote: null }
            if (v.vote_type === "up") result[v.comment_id].upCount++
            else result[v.comment_id].downCount++
        })
    }

    // Get user's own votes
    if (user) {
        const { data: userVotes } = await (supabase as any)
            .from("wrist_roll_comment_votes")
            .select("comment_id, vote_type")
            .eq("user_id", user.id)
            .in("comment_id", commentIds)

        if (userVotes) {
            userVotes.forEach((v: any) => {
                if (result[v.comment_id]) result[v.comment_id].userVote = v.vote_type
            })
        }
    }

    return result
}
