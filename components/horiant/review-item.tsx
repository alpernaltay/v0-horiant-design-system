"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThumbsUp, ThumbsDown, MessageSquare, CornerDownRight, Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { voteReview } from "@/lib/actions/reviews"
import { useAuthGate } from "@/context/auth-gate-context"

export interface ReviewProps {
    id: string
    author?: string
    avatar?: string
    date?: string
    rating?: number
    title?: string
    body: string
    likes: number
    dislikes?: number
    replies?: ReviewProps[]
    user_id?: string
    parent_id?: string
    profiles?: { username: string }
    author_name?: string
    created_at?: string
}

interface ReviewItemProps {
    review: ReviewProps
    onReply?: (parentId: string, replyText: string) => Promise<void>
    onDelete?: (id: string) => Promise<void>
    onEdit?: (id: string, newTitle: string | undefined, newBody: string) => Promise<void>
    userVotes: Record<string, 'up' | 'down'>
    isReply?: boolean
    level?: number
    currentUserId?: string
}

// Simple deterministic hash for avatar colors
function getAvatarProps(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Pick a subtle gold-ish or metallic accent
    const palettes = [
        { text: "text-[#D4AF37]", bg: "bg-[#D4AF37]/5", border: "border-[#D4AF37]/20" },
        { text: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
        { text: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20" },
        { text: "text-slate-300", bg: "bg-slate-400/5", border: "border-slate-400/20" },
    ]
    const index = Math.abs(hash) % palettes.length
    return palettes[index]
}

export function ReviewItem({ review, onReply, onDelete, onEdit, userVotes, isReply = false, level = 0, currentUserId }: ReviewItemProps) {
    const router = useRouter()
    const { checkAuth } = useAuthGate()
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(review.title || "")
    const [editText, setEditText] = useState(review.body)
    const [isEditingSubmitting, setIsEditingSubmitting] = useState(false)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Pagination for replies
    const [repliesExpanded, setRepliesExpanded] = useState(false)
    const [visibleReplies, setVisibleReplies] = useState(3)

    // Explicit UI Component local state injection as requested by user
    const [likes, setLikes] = useState(review.likes || 0);
    const [dislikes, setDislikes] = useState(review.dislikes || 0);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(userVotes[review.id] || null);

    // Ensure prop changes reflect back upward
    useEffect(() => { setLikes(review.likes || 0) }, [review.likes]);
    useEffect(() => { setDislikes(review.dislikes || 0) }, [review.dislikes]);
    useEffect(() => { setUserVote(userVotes[review.id] || null) }, [userVotes, review.id]);

    // Ensure strict permission checks. 
    // If the user's ID matches the review.user_id, they own the review.
    const isAuthor = currentUserId && review.user_id === currentUserId

    const isLiked = userVote === 'up'
    const isDisliked = userVote === 'down'

    const handleVote = async (type: 'up' | 'down') => {
        if (!checkAuth()) return
        // 1. OPTIMISTIC UI UPDATE (Instant)
        const previousVote = userVote;
        const previousLikes = likes;
        const previousDislikes = dislikes;

        if (previousVote === type) {
            // Removing vote
            setUserVote(null);
            type === 'up' ? setLikes(l => l - 1) : setDislikes(d => d - 1);
        } else {
            // Changing or adding vote
            setUserVote(type);
            if (type === 'up') {
                setLikes(l => l + 1);
                if (previousVote === 'down') setDislikes(d => Math.max(0, d - 1));
            } else {
                setDislikes(d => d + 1);
                if (previousVote === 'up') setLikes(l => Math.max(0, l - 1));
            }
        }

        // 2. BACKGROUND SERVER REQUEST
        try {
            const result = await voteReview(review.id, type);
            if (!result?.success) throw new Error(result?.message || "Failed");
        } catch (err) {
            // 3. ROLLBACK ON ERROR
            setUserVote(previousVote);
            setLikes(previousLikes);
            setDislikes(previousDislikes);
            toast.error("Vote failed, reverting.");
        }
    };

    // Determine name and date since we might be receiving raw db rows
    const displayAuthor = review.profiles?.username || review.author_name || review.author || "Community Member"
    const initials = review.avatar || displayAuthor.substring(0, 2).toUpperCase()
    const avatarStyle = getAvatarProps(displayAuthor)

    const displayDate = review.created_at
        ? `${new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • ${new Date(review.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`
        : review.date || "Unknown Date"

    async function handleSubmitReply(e: React.FormEvent) {
        e.preventDefault()
        if (!replyText.trim() || !onReply) return
        setIsSubmitting(true)
        await onReply(review.id, replyText)
        setReplyText("")
        setShowReplyForm(false)
        setIsSubmitting(false)
        router.refresh()
    }

    async function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!editText.trim() || !onEdit) return
        setIsEditingSubmitting(true)
        await onEdit(review.id, editTitle.trim() !== "" ? editTitle.trim() : undefined, editText)
        setIsEditing(false)
        setIsEditingSubmitting(false)
    }

    async function handleConfirmDelete() {
        if (!onDelete) return
        setIsDeleting(true)
        await onDelete(review.id)
        setIsDeleting(false)
        setShowDeleteModal(false)
    }

    const isMock = review.id.toString().startsWith("mock-") || review.id.toString().startsWith("new-") || review.id.toString().startsWith("reply-");

    return (
        <div className={`flex flex-col ${isReply ? "mt-4" : ""}`}>
            <article className={`card-glow relative rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] ${isReply ? 'p-4 sm:p-5' : 'p-5 sm:p-8 lg:p-10'}`}>

                {/* If it's a deep reply, maybe show an icon */}
                {level > 0 && (
                    <CornerDownRight className="absolute -left-6 top-5 h-4 w-4 text-muted-foreground/30 hidden sm:block" />
                )}

                <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`flex items-center justify-center rounded-full border ${avatarStyle.border} ${avatarStyle.bg} ${isReply ? 'h-8 w-8' : 'h-10 w-10'}`}>
                            <span className={`font-medium tracking-wider ${avatarStyle.text} ${isReply ? 'text-[9px]' : 'text-[11px]'}`}>
                                {initials}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-foreground">{displayAuthor}</p>
                                {isAuthor && (
                                    <div className="flex items-center gap-2 ml-2">
                                        <button
                                            onClick={() => {
                                                setEditTitle(review.title || "")
                                                setEditText(review.body)
                                                setIsEditing(!isEditing)
                                            }}
                                            className="text-muted-foreground/40 hover:text-foreground transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </button>
                                        {onDelete && (
                                            <button
                                                onClick={() => setShowDeleteModal(true)}
                                                className="text-muted-foreground/40 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">{displayDate}</p>
                        </div>
                    </div>
                    {review.rating && !isReply && (
                        <div className="flex items-center gap-1">
                            {/* 5 stars */}
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-3 w-3 ${star <= review.rating! ? "fill-[#D4AF37] text-[#D4AF37]" : "text-muted-foreground/30"}`}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            ))}
                        </div>
                    )}
                </div>

                {review.title && !isReply && (
                    <h3 className="mb-3 font-serif text-lg font-light tracking-tight text-foreground sm:mb-4 sm:text-xl">{review.title}</h3>
                )}

                <p className="font-serif text-sm font-light italic leading-relaxed text-muted-foreground/80 break-words whitespace-pre-wrap">
                    {`\u201C${review.body}\u201D`}
                </p>

                <div className="mt-4 flex items-center gap-4 border-t border-white/[0.04] pt-4 sm:mt-5 sm:pt-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleVote('up')}
                            className={`flex min-h-10 items-center gap-1.5 text-[11px] transition-colors duration-300 hover:text-[#D4AF37] disabled:opacity-50 ${isLiked ? 'text-[#D4AF37]' : 'text-muted-foreground'}`}
                            title="Helpful"
                        >
                            <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-[#D4AF37]' : ''}`} />
                            {likes}
                        </button>
                        <span className="text-muted-foreground/30">|</span>
                        <button
                            onClick={() => handleVote('down')}
                            className={`flex min-h-10 items-center gap-1.5 text-[11px] transition-colors duration-300 hover:text-red-400 disabled:opacity-50 ${isDisliked ? 'text-red-400' : 'text-muted-foreground'}`}
                            title="Not Helpful"
                        >
                            <ThumbsDown className={`h-3.5 w-3.5 ${isDisliked ? 'fill-red-400' : ''}`} />
                            {dislikes}
                        </button>
                    </div>

                    {onReply && (
                        <>
                            <span className="text-muted-foreground/30">|</span>
                            <button
                                onClick={() => {
                                    if (isMock) {
                                        toast.error("Cannot reply to archived data.")
                                        return
                                    }
                                    setShowReplyForm(!showReplyForm)
                                }}
                                className="min-h-10 text-[11px] text-muted-foreground transition-colors duration-300 hover:text-foreground flex items-center gap-2"
                            >
                                <MessageSquare className="h-3 w-3" />
                                Reply
                            </button>
                        </>
                    )}
                </div>

                {showReplyForm && (
                    <form onSubmit={handleSubmitReply} className="mt-4 border-t border-white/[0.04] pt-4">
                        <div className="flex gap-3">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full resize-none rounded-md border border-white/[0.06] bg-[#0A0F16] px-3 py-2 text-sm text-foreground outline-none focus:border-[#D4AF37]/50"
                                rows={2}
                                required
                            />
                        </div>
                        <div className="mt-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowReplyForm(false)}
                                className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground px-3 py-1.5"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] disabled:opacity-50 px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-[#D4AF37]/20 transition-colors"
                            >
                                {isSubmitting ? "Posting..." : "Post Reply"}
                            </button>
                        </div>
                    </form>
                )}
            </article>

            {/* Render nested replies (Paginated) */}
            {review.replies && review.replies.length > 0 && (
                <div className="mt-4 border-l border-white/[0.04]">
                    {!repliesExpanded ? (
                        <button
                            onClick={() => { setRepliesExpanded(true); setVisibleReplies(3); }}
                            className="ml-4 mt-2 flex items-center gap-2 text-[11px] font-medium tracking-wide text-[#D4AF37]/80 transition-colors hover:text-[#D4AF37]"
                        >
                            <span className="h-[1px] w-6 bg-[#D4AF37]/40" />
                            View {review.replies.length} {review.replies.length === 1 ? 'reply' : 'replies'}
                        </button>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {review.replies.slice(0, visibleReplies).map((reply: any) => (
                                <div className="ml-4 mt-3" key={reply.id}>
                                    <ReviewItem
                                        review={reply}
                                        onReply={onReply}
                                        onDelete={onDelete}
                                        onEdit={onEdit}
                                        userVotes={userVotes}
                                        isReply={true}
                                        level={level + 1}
                                        currentUserId={currentUserId}
                                    />
                                </div>
                            ))}
                            <div className="ml-4 mt-3 flex items-center gap-4">
                                {visibleReplies < review.replies.length && (
                                    <button
                                        onClick={() => setVisibleReplies(v => v + 3)}
                                        className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-[#D4AF37]/80 transition-colors hover:text-[#D4AF37]"
                                    >
                                        <span className="h-[1px] w-6 bg-[#D4AF37]/40" />
                                        Show more
                                    </button>
                                )}
                                <button
                                    onClick={() => { setRepliesExpanded(false); setVisibleReplies(3); }}
                                    className={`flex items-center gap-2 text-[11px] font-medium tracking-wide transition-colors ${visibleReplies >= review.replies.length ? "text-[#D4AF37]/80 hover:text-[#D4AF37]" : "text-muted-foreground/60 hover:text-white"}`}
                                >
                                    {visibleReplies >= review.replies.length && <span className="h-[1px] w-6 bg-[#D4AF37]/40" />}
                                    Hide
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {
                showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-lg border border-[#D4AF37]/40 bg-gradient-to-b from-[#131920] to-[#0d1117] p-6 shadow-2xl">
                            <h3 className="mb-4 text-center font-serif text-lg text-foreground">
                                Are you sure you want to remove this piece from the database?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                    className="rounded border border-white/[0.08] px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-white/[0.04] disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="rounded border border-red-500/40 bg-red-500/10 px-4 py-2 text-[11px] uppercase tracking-wider text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                                >
                                    {isDeleting ? "Removing..." : "Remove"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Modal */}
            {
                isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg rounded-lg border border-[#D4AF37]/40 bg-gradient-to-b from-[#131920] to-[#0d1117] p-6 shadow-2xl">
                            <h3 className="mb-4 font-serif text-lg text-foreground">Edit Review</h3>
                            <form onSubmit={handleEditSubmit}>
                                {!isReply && (
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Review Title"
                                        className="mb-4 w-full rounded-md border border-white/[0.06] bg-[#0A0F16] px-4 py-3 text-sm text-foreground outline-none focus:border-[#D4AF37]/50"
                                    />
                                )}
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full resize-none rounded-md border border-white/[0.06] bg-[#0A0F16] px-4 py-3 text-sm text-foreground outline-none focus:border-[#D4AF37]/50"
                                    rows={4}
                                    required
                                />
                                <div className="mt-6 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="rounded border border-white/[0.08] px-5 py-2.5 text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-white/[0.04]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isEditingSubmitting}
                                        className="rounded border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-5 py-2.5 text-[11px] uppercase tracking-wider text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/20 flex items-center justify-center min-w-[120px] disabled:opacity-50"
                                    >
                                        {isEditingSubmitting ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
