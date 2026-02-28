"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Heart, Send, Trash2, Pencil, Check, Loader2,
    ThumbsUp, ThumbsDown, Reply
} from "lucide-react"
import { SafeImage } from "./safe-image"
import { ConfirmationModal } from "./confirmation-modal"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    toggleWristRollLike,
    getWristRollLikeStatus,
    addWristRollComment,
    getWristRollComments,
    deleteWristRoll,
    updateWristRollCaption,
    deleteWristRollComment,
    updateWristRollComment,
    voteWristRollComment,
    getCommentVotes,
} from "@/lib/actions/wrist-rolls"

// ─── Helpers ────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const h = d.getHours().toString().padStart(2, "0")
    const m = d.getMinutes().toString().padStart(2, "0")
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} • ${h}:${m}`
}

/** Build a tree from flat comments array using parent_id */
const buildCommentTree = (flat: any[]): any[] => {
    const map = new Map<string, any>()
    const roots: any[] = []
    flat.forEach((c) => map.set(c.id, { ...c, replies: [] }))
    flat.forEach((c) => {
        const node = map.get(c.id)!
        if (c.parent_id && map.has(c.parent_id)) {
            map.get(c.parent_id)!.replies.push(node)
        } else {
            roots.push(node)
        }
    })
    return roots
}

// ─── Types ──────────────────────────────────────────────────────

interface PostDetailModalProps {
    isOpen: boolean
    onClose: () => void
    post: any
    currentUserId?: string
}

interface CommentVoteState {
    upCount: number
    downCount: number
    userVote: "up" | "down" | null
}

// ─── Component ──────────────────────────────────────────────────

export function PostDetailModal({ isOpen, onClose, post, currentUserId }: PostDetailModalProps) {
    const router = useRouter()

    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [isEditing, setIsEditing] = useState(false)
    const [editCaption, setEditCaption] = useState("")
    const [isSavingCaption, setIsSavingCaption] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showFullCaption, setShowFullCaption] = useState(false)
    const [showDeletePostConfirm, setShowDeletePostConfirm] = useState(false)

    const [flatComments, setFlatComments] = useState<any[]>([])
    const [commentText, setCommentText] = useState("")
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)
    const [commentVotes, setCommentVotes] = useState<Record<string, CommentVoteState>>({})
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editingCommentText, setEditingCommentText] = useState("")
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)
    const [replyingToId, setReplyingToId] = useState<string | null>(null)
    const [replyText, setReplyText] = useState("")

    const author = post?.profiles?.username ?? "Collector"
    const watchName = post?.watches ? `${post.watches.brand} ${post.watches.model}` : "Unknown"
    const watchLink = post?.watches ? `/watch/${post.watches.slug || post.watches.id}` : "#"
    const isOwner = currentUserId && post?.user_id === currentUserId

    const commentTree = buildCommentTree(flatComments)

    // ── Fetch on open ──
    useEffect(() => {
        if (!isOpen || !post?.id) return
        getWristRollLikeStatus(post.id).then(({ count, userLiked }) => { setLikeCount(count); setLiked(userLiked) })
        setEditCaption(post?.caption ?? "")
        setShowFullCaption(false)
        setReplyingToId(null)
        refreshComments()
    }, [isOpen, post?.id, post?.caption])

    const refreshComments = async () => {
        const data = await getWristRollComments(post.id)
        setFlatComments(data)
        if (data.length > 0) getCommentVotes(data.map((c: any) => c.id)).then(setCommentVotes)
    }

    // ── Post Actions ──

    const handleLike = async () => {
        const wasLiked = liked
        setLiked(!wasLiked)
        setLikeCount((c) => (wasLiked ? c - 1 : c + 1))
        const result = await toggleWristRollLike(post.id)
        setLiked(result.liked)
    }

    const handleDeletePost = async () => {
        setIsDeleting(true)
        const result = await deleteWristRoll(post.id)
        if (result.success) { toast.success("Post deleted."); setShowDeletePostConfirm(false); onClose(); router.refresh() }
        else toast.error(result.message)
        setIsDeleting(false)
    }

    const handleSaveCaption = async () => {
        setIsSavingCaption(true)
        const result = await updateWristRollCaption(post.id, editCaption)
        if (result.success) { toast.success("Caption updated."); setIsEditing(false); router.refresh() }
        else toast.error(result.message)
        setIsSavingCaption(false)
    }

    // ── Comment Actions ──

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!commentText.trim()) return
        setIsSubmittingComment(true)
        const result = await addWristRollComment(post.id, commentText, null)
        if (result.success) { setCommentText(""); await refreshComments(); router.refresh() }
        else toast.error(result.message)
        setIsSubmittingComment(false)
    }

    const handleAddReply = async (parentId: string) => {
        if (!replyText.trim()) return
        setIsSubmittingComment(true)
        const result = await addWristRollComment(post.id, replyText, parentId)
        if (result.success) { setReplyText(""); setReplyingToId(null); await refreshComments(); router.refresh() }
        else toast.error(result.message)
        setIsSubmittingComment(false)
    }

    const handleDeleteComment = async () => {
        if (!deletingCommentId) return
        const result = await deleteWristRollComment(deletingCommentId)
        if (result.success) { setFlatComments((prev) => prev.filter((c) => c.id !== deletingCommentId && c.parent_id !== deletingCommentId)); router.refresh() }
        setDeletingCommentId(null)
    }

    const handleSaveComment = async (commentId: string) => {
        if (!editingCommentText.trim()) return
        const result = await updateWristRollComment(commentId, editingCommentText)
        if (result.success) {
            setFlatComments((prev) => prev.map((c) => c.id === commentId ? { ...c, content: editingCommentText.trim() } : c))
            setEditingCommentId(null)
        } else toast.error(result.message)
    }

    const handleCommentVote = async (commentId: string, voteType: "up" | "down") => {
        setCommentVotes((prev) => {
            const current = prev[commentId] ?? { upCount: 0, downCount: 0, userVote: null }
            let { upCount, downCount } = current
            if (current.userVote === "up") upCount--
            if (current.userVote === "down") downCount--
            const newVote = current.userVote === voteType ? null : voteType
            if (newVote === "up") upCount++
            if (newVote === "down") downCount++
            return { ...prev, [commentId]: { upCount, downCount, userVote: newVote } }
        })
        const result = await voteWristRollComment(commentId, voteType)
        setCommentVotes((prev) => ({ ...prev, [commentId]: { ...prev[commentId], userVote: result.vote } }))
    }

    const captionTruncated = post?.caption && post.caption.length > 140 && !showFullCaption

    // ── Recursive Comment Renderer ──

    const renderComment = (c: any, depth: number = 0) => {
        const cAuthor = c.profiles?.username ?? "User"
        const cVotes = commentVotes[c.id] ?? { upCount: 0, downCount: 0, userVote: null }
        const isCommentOwner = currentUserId === c.user_id
        const isEditingThis = editingCommentId === c.id
        const isReplyingToThis = replyingToId === c.id

        return (
            <div key={c.id} style={{ marginLeft: depth > 0 ? `${Math.min(depth, 3) * 16}px` : 0 }}>
                <div className="group flex gap-2.5 py-1.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-[#131920] text-[8px] font-medium uppercase text-[#D4AF37]/70 mt-0.5">
                        {cAuthor.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        {isEditingThis ? (
                            <div className="flex gap-2">
                                <input value={editingCommentText} onChange={(e) => setEditingCommentText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveComment(c.id)} className="flex-1 rounded-md border border-white/[0.08] bg-[#131920] px-2.5 py-1.5 text-[13px] text-foreground outline-none focus:border-[#D4AF37]/50" autoFocus />
                                <button onClick={() => handleSaveComment(c.id)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#D4AF37] text-black"><Check className="h-3 w-3" /></button>
                                <button onClick={() => setEditingCommentId(null)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] text-muted-foreground hover:text-white"><X className="h-3 w-3" /></button>
                            </div>
                        ) : (
                            <>
                                <p className="text-[13px] leading-relaxed text-foreground/80">
                                    <span className="mr-1.5 font-medium text-foreground">{cAuthor}</span>
                                    {c.content}
                                </p>
                                <div className="mt-1 flex items-center gap-3 flex-wrap">
                                    <span className="text-[10px] text-muted-foreground/40">{formatDate(c.created_at)}</span>
                                    <button onClick={() => handleCommentVote(c.id, "up")} className="flex items-center gap-1 transition-colors">
                                        <ThumbsUp className={`h-3 w-3 ${cVotes.userVote === "up" ? "fill-[#D4AF37] text-[#D4AF37]" : "text-muted-foreground/40 hover:text-[#D4AF37]"}`} />
                                        {cVotes.upCount > 0 && <span className="text-[10px] text-muted-foreground/50">{cVotes.upCount}</span>}
                                    </button>
                                    <button onClick={() => handleCommentVote(c.id, "down")} className="flex items-center gap-1 transition-colors">
                                        <ThumbsDown className={`h-3 w-3 ${cVotes.userVote === "down" ? "fill-red-400 text-red-400" : "text-muted-foreground/40 hover:text-red-400"}`} />
                                        {cVotes.downCount > 0 && <span className="text-[10px] text-muted-foreground/50">{cVotes.downCount}</span>}
                                    </button>
                                    <button onClick={() => { setReplyingToId(isReplyingToThis ? null : c.id); setReplyText("") }} className="flex items-center gap-1 text-[10px] text-muted-foreground/40 hover:text-[#D4AF37] transition-colors">
                                        <Reply className="h-3 w-3" /> Reply
                                    </button>
                                    {isCommentOwner && (
                                        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingCommentId(c.id); setEditingCommentText(c.content) }} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/40 hover:text-[#D4AF37]" title="Edit"><Pencil className="h-2.5 w-2.5" /></button>
                                            <button onClick={() => setDeletingCommentId(c.id)} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/40 hover:text-red-400" title="Delete"><Trash2 className="h-2.5 w-2.5" /></button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Reply input */}
                        {isReplyingToThis && (
                            <div className="mt-2 flex gap-2">
                                <input
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddReply(c.id)}
                                    placeholder={`Reply to ${cAuthor}...`}
                                    className="flex-1 rounded-md border border-white/[0.08] bg-[#131920] px-2.5 py-1.5 text-[13px] text-foreground outline-none focus:border-[#D4AF37]/50"
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleAddReply(c.id)}
                                    disabled={isSubmittingComment || !replyText.trim()}
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#D4AF37] text-black disabled:opacity-30"
                                >
                                    {isSubmittingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Render child replies recursively */}
                {c.replies && c.replies.length > 0 && (
                    <div className="border-l border-white/[0.04]">
                        {c.replies.map((reply: any) => renderComment(reply, depth + 1))}
                    </div>
                )}
            </div>
        )
    }

    // ── Render ──

    return (
        <AnimatePresence>
            {isOpen && post && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
                    />

                    {/* Centering wrapper — click-outside target */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 lg:p-12"
                        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
                    >
                        <div className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0F16] shadow-2xl lg:max-h-[85vh] lg:flex-row">

                            <button onClick={onClose} className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/70 transition-colors hover:bg-black hover:text-white">
                                <X className="h-4 w-4" />
                            </button>

                            {/* Photo */}
                            <div className="relative w-full bg-black lg:w-[55%]">
                                <div className="relative aspect-square w-full lg:aspect-auto lg:h-full">
                                    <SafeImage brandName="Horiant" src={post.image_url} alt={`${author}'s ${watchName}`} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 55vw" />
                                </div>
                            </div>

                            {/* Social Panel */}
                            <div className="flex w-full flex-col lg:w-[45%] lg:h-full">

                                {/* Header — author + timestamp inline */}
                                <div className="flex items-center gap-3 border-b border-white/[0.04] p-4 shrink-0">
                                    <Link href={`/vault/${author}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#131920] text-[10px] font-medium uppercase text-[#D4AF37]">
                                        {author.charAt(0).toUpperCase()}
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <Link href={`/vault/${author}`} className="text-sm font-medium text-foreground hover:text-[#D4AF37] transition-colors">{author}</Link>
                                            <span className="text-[10px] text-muted-foreground/40">•</span>
                                            <span className="text-[10px] text-muted-foreground/40">{formatDate(post.created_at)}</span>
                                        </div>
                                        <Link href={watchLink} className="block truncate text-[10px] uppercase tracking-[0.15em] text-[#D4AF37]/70 hover:text-[#D4AF37]">{watchName}</Link>
                                    </div>
                                </div>

                                {/* Caption + Threaded Comments — scrollable */}
                                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                                    {isEditing ? (
                                        <div className="mb-4 flex gap-2">
                                            <input value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className="flex-1 rounded-lg border border-white/[0.08] bg-[#131920] px-3 py-2 text-sm text-foreground outline-none focus:border-[#D4AF37]/50" />
                                            <button onClick={handleSaveCaption} disabled={isSavingCaption} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37] text-black transition-transform hover:scale-105 disabled:opacity-50">
                                                {isSavingCaption ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                            </button>
                                        </div>
                                    ) : post?.caption ? (
                                        <div className="mb-4">
                                            <p className="text-sm leading-relaxed text-foreground/90">
                                                <span className="mr-2 font-medium">{author}</span>
                                                {captionTruncated ? post.caption.slice(0, 140) + "..." : post.caption}
                                            </p>
                                            {post.caption.length > 140 && (
                                                <button onClick={() => setShowFullCaption(!showFullCaption)} className="mt-1 text-[11px] text-muted-foreground/60 hover:text-[#D4AF37] transition-colors">
                                                    {showFullCaption ? "Show less" : "Show more"}
                                                </button>
                                            )}
                                        </div>
                                    ) : null}

                                    {commentTree.length > 0 && (
                                        <div className="space-y-1">
                                            {commentTree.map((c) => renderComment(c, 0))}
                                        </div>
                                    )}
                                </div>

                                {/* Action Bar — fixed bottom */}
                                <div className="border-t border-white/[0.04] p-4 shrink-0">
                                    <div className="mb-3 flex items-center gap-4">
                                        <button onClick={handleLike} className="flex items-center gap-1.5 transition-colors">
                                            <Heart className={`h-5 w-5 transition-all ${liked ? "fill-[#D4AF37] text-[#D4AF37] scale-110" : "text-muted-foreground hover:text-[#D4AF37]"}`} />
                                            {likeCount > 0 && <span className="text-xs text-muted-foreground">{likeCount}</span>}
                                        </button>
                                        {isOwner && (
                                            <div className="ml-auto flex items-center gap-2">
                                                <button onClick={() => setIsEditing(!isEditing)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-white/[0.04] hover:text-[#D4AF37]" title="Edit caption"><Pencil className="h-3.5 w-3.5" /></button>
                                                <button onClick={() => setShowDeletePostConfirm(true)} disabled={isDeleting} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-red-500/10 hover:text-red-400" title="Delete post">
                                                    {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <form onSubmit={handleAddComment} className="flex items-center gap-2">
                                        <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground/40 outline-none" />
                                        <button type="submit" disabled={isSubmittingComment || !commentText.trim()} className="text-[#D4AF37] transition-opacity disabled:opacity-30">
                                            {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <ConfirmationModal isOpen={showDeletePostConfirm} onClose={() => setShowDeletePostConfirm(false)} onConfirm={handleDeletePost} title="Delete Wrist-Roll" message="This will permanently remove your wrist-roll, including all likes and comments. This action cannot be undone." confirmLabel="Delete" isLoading={isDeleting} />
                    <ConfirmationModal isOpen={!!deletingCommentId} onClose={() => setDeletingCommentId(null)} onConfirm={handleDeleteComment} title="Delete Comment" message="Are you sure you want to remove this comment?" confirmLabel="Delete" />
                </>
            )}
        </AnimatePresence>
    )
}
