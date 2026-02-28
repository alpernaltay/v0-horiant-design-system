"use client"

import { useState, useEffect } from "react"
import { SafeImage } from "./safe-image"
import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"
import { toggleWristRollLike, getWristRollLikeStatus } from "@/lib/actions/wrist-rolls"
import { PostDetailModal } from "./post-detail-modal"
import { useAuthGate } from "@/context/auth-gate-context"

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const h = d.getHours().toString().padStart(2, "0")
    const m = d.getMinutes().toString().padStart(2, "0")
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} • ${h}:${m}`
}

interface WristRollCardProps {
    post: any
    currentUserId?: string
}

export function WristRollCard({ post, currentUserId }: WristRollCardProps) {
    const { checkAuth } = useAuthGate()
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const author = post?.profiles?.username ?? "Collector"
    const fallbackAvatar = author.charAt(0).toUpperCase()
    const watchLink = post?.watches ? `/watch/${post.watches.slug || post.watches.id}` : "#"
    const watchName = post?.watches ? `${post.watches.brand} ${post.watches.model}` : "Unknown Timepiece"

    useEffect(() => {
        getWristRollLikeStatus(post.id).then(({ count, userLiked }) => {
            setLikeCount(count)
            setLiked(userLiked)
        })
    }, [post.id])

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!checkAuth()) return
        const wasLiked = liked
        setLiked(!wasLiked)
        setLikeCount((c) => (wasLiked ? c - 1 : c + 1))
        const result = await toggleWristRollLike(post.id)
        setLiked(result.liked)
    }

    return (
        <>
            <div className="flex flex-col overflow-hidden rounded-xl border border-white/[0.04] bg-[#131920]/80 backdrop-blur-md transition-all hover:bg-[#131920]">

                {/* Header */}
                <div className="flex items-center gap-3 p-4">
                    <Link
                        href={`/vault/${author}`}
                        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0F16] border border-white/[0.08] text-[10px] font-medium uppercase text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors overflow-hidden"
                    >
                        {post?.profiles?.avatar_url ? (
                            <SafeImage src={post.profiles.avatar_url} alt={author} fill className="rounded-full object-cover" brandName={author} />
                        ) : fallbackAvatar}
                    </Link>
                    <div className="min-w-0 flex-1">
                        <Link href={`/vault/${author}`} className="text-xs font-medium tracking-wide text-foreground hover:text-[#D4AF37] transition-colors">{author}</Link>
                        <span className="block text-[9px] text-muted-foreground/40">{formatDate(post.created_at)}</span>
                    </div>
                </div>

                {/* Photo */}
                <button onClick={() => setIsModalOpen(true)} className="relative aspect-[4/5] w-full bg-[#0A0F16] cursor-pointer group">
                    <SafeImage brandName="Horiant" src={post.image_url} alt={`${author}'s ${watchName}`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </button>

                {/* Actions */}
                <div className="p-4">
                    <div className="mb-3 flex items-center gap-4">
                        <button onClick={handleLike} className="flex items-center gap-1.5 transition-colors">
                            <Heart className={`h-5 w-5 transition-all ${liked ? "fill-[#D4AF37] text-[#D4AF37]" : "text-muted-foreground hover:text-[#D4AF37]"}`} />
                            {likeCount > 0 && <span className="text-xs text-muted-foreground">{likeCount}</span>}
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="text-muted-foreground hover:text-white transition-colors">
                            <MessageCircle className="h-5 w-5" />
                        </button>
                    </div>

                    {post?.watches && (
                        <Link href={watchLink} className="inline-block mb-2 text-[10px] uppercase tracking-[0.15em] text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors">{watchName}</Link>
                    )}

                    {post?.caption && (
                        <p className="text-sm text-foreground/90 leading-relaxed font-light">
                            <span className="font-medium mr-2">{author}</span>
                            {post.caption}
                        </p>
                    )}
                </div>
            </div>

            <PostDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} post={post} currentUserId={currentUserId} />
        </>
    )
}
