"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { SafeImage } from "./safe-image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle2,
  Star,
  ThumbsUp,
  Heart,
  Plus,
  ExternalLink,
  Droplets,
  Gem,
  Watch,
  Ruler,
  Loader2,
  Check,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { expertReviews, type WatchData } from "@/lib/mock-watches"
import { toggleCollection } from "@/lib/actions/collections"
import { checkWishlistStatus, toggleWishlist } from "@/lib/actions/wishlists"
import { addReview, voteReview, replyToReview, deleteReview, updateReview } from "@/lib/actions/reviews"
import { createClient } from "@/lib/supabase/client"
import { WristFitVisualizer } from "./wrist-fit-visualizer"
import { ReviewItem, type ReviewProps } from "./review-item"
import { WristRollCard } from "./wrist-roll-card"
import { WristRollModal } from "./wrist-roll-modal"
import { useAuthGate } from "@/context/auth-gate-context"

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
}

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`card-glow relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-b from-[#131920] to-[#0d1117] shadow-inner shadow-white/5 p-4 sm:p-5 h-auto ${className}`}
    >
      {children}
    </div>
  )
}

function SpecRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm text-foreground">{value}</span>
    </div>
  )
}

interface WatchDetailProps {
  watch: WatchData
  initialReviews?: any[]
  initialInCollection?: boolean
  initialInWishlist?: boolean
  initialWristRolls?: any[]
  currentUserId?: string
}

// ─── Carousel With Arrows ────────────────────────────────────

function CarouselWithArrows({ wristRolls, currentUserId }: { wristRolls: any[], currentUserId?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll, { passive: true })
    return () => el.removeEventListener("scroll", checkScroll)
  }, [checkScroll])

  const scrollBy = (direction: number) => {
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" })
  }

  return (
    <div className="group/carousel relative">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#0A0F16]/90 text-[#D4AF37] opacity-0 transition-all group-hover/carousel:opacity-100 hover:bg-[#D4AF37]/20 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#0A0F16]/90 text-[#D4AF37] opacity-0 transition-all group-hover/carousel:opacity-100 hover:bg-[#D4AF37]/20 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: "1.25rem",
          paddingBottom: "1rem",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        className="-mx-4 px-4 sm:-mx-6 sm:px-6"
      >
        <style>{`div[style*="scroll-snap-type"]::-webkit-scrollbar { display: none !important; }`}</style>
        {wristRolls.map((post: any) => (
          <div key={post.id} style={{ minWidth: "300px", width: "300px", flexShrink: 0, scrollSnapAlign: "start" }}>
            <WristRollCard post={post} currentUserId={currentUserId} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function WatchDetail({ watch, initialReviews, initialInCollection, initialInWishlist, initialWristRolls = [], currentUserId }: WatchDetailProps) {
  const router = useRouter()
  const { checkAuth } = useAuthGate()
  const [inCollection, setInCollection] = useState(initialInCollection || false)
  const [inWishlist, setInWishlist] = useState(initialInWishlist || false)
  const [isWristRollModalOpen, setIsWristRollModalOpen] = useState(false)

  // Reviews State
  const [reviews, setReviews] = useState<any[]>(() =>
    initialReviews && initialReviews.length > 0 ? initialReviews :
      expertReviews.map((r, i) => ({ ...r, id: `mock-${i}`, likes: ((i * 37) % 80) + 10 }))
  )
  const [reviewSort, setReviewSort] = useState<'helpful' | 'newest'>('helpful')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({})

  const [wristSize, setWristSize] = useState<number | null>(null)
  const [currentUsername, setCurrentUsername] = useState<string | undefined>()

  const [newRating, setNewRating] = useState(5)
  const [newTitle, setNewTitle] = useState("")
  const [newBody, setNewBody] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    async function fetchVotes() {
      if (!currentUserId) return;
      const supabase = createClient();
      const { data: votesData } = await (supabase as any).from('review_votes').select('review_id, vote_type').eq('user_id', currentUserId);
      if (votesData) {
        const votesMap: Record<string, 'up' | 'down'> = {};
        votesData.forEach((v: any) => votesMap[v.review_id] = v.vote_type);
        setUserVotes(votesMap);
      }
    }
    fetchVotes();
  }, [currentUserId]);

  const buildTree = (flatReviews: any[]) => {
    const map = new Map();
    const roots: any[] = [];
    flatReviews.forEach(r => map.set(r.id, { ...r, replies: [] }));
    flatReviews.forEach(r => {
      if (r.parent_id && map.has(r.parent_id)) {
        map.get(r.parent_id).replies.push(map.get(r.id));
      } else {
        roots.push(map.get(r.id));
      }
    });
    return roots;
  };

  const reviewRoots = buildTree(reviews);

  const sortedReviews = [...reviewRoots].sort((a, b) => {
    if (reviewSort === 'helpful') {
      return (b.likes || 0) - (a.likes || 0)
    } else {
      const dateA = new Date(a.created_at || a.date || Date.now()).getTime();
      const dateB = new Date(b.created_at || b.date || Date.now()).getTime();
      return dateB - dateA;
    }
  })

  const visibleReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 10)

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!checkAuth()) return
    if (!newTitle.trim()) {
      toast("Review Title is required.", { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' })
      return
    }
    if (!newBody.trim()) {
      toast("Review details are required.", { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' })
      return
    }

    setIsSubmittingReview(true)
    const res = await addReview(watch.id, { rating: newRating, title: newTitle, body: newBody })

    if (res.success) {
      toast(res.message, { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' })
      setReviews(prev => [{
        id: res.data?.id || `new-${Date.now()}`,
        author: currentUsername || "Community Member",
        avatar: undefined,
        created_at: new Date().toISOString(),
        rating: newRating,
        title: newTitle,
        body: newBody,
        likes: 0,
        user_id: currentUserId,
        parent_id: null
      }, ...prev])
      setShowReviewForm(false)
      setNewTitle("")
      setNewBody("")
      setNewRating(5)
      router.refresh()
    } else {
      if (res.message === 'duplicate_review') {
        toast("Heritage shared. You have already rated this piece. Please edit your existing review to add more thoughts.", { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' })
      } else {
        toast(res.message, { style: { background: '#131920', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }, icon: '⚠️' })
      }
    }
    setIsSubmittingReview(false)
  }

  async function handleReply(parentId: string, replyText: string) {
    if (!checkAuth()) return
    const res = await replyToReview(parentId, replyText, watch.id)
    if (res.success) {
      toast(res.message, { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' })
      setReviews(prev => [...prev, {
        id: res.data?.id || `reply-${Date.now()}`,
        author: currentUsername || "Community Member",
        avatar: undefined,
        created_at: new Date().toISOString(),
        body: replyText,
        likes: 0,
        user_id: currentUserId,
        parent_id: parentId
      }])
      router.refresh()
    } else {
      toast.error(res.message)
    }
  }

  async function handleDeleteReview(id: string) {
    const res = await deleteReview(id)
    if (res.success) {
      toast.success(res.message)
      // Delete from flat array
      setReviews(prev => prev.filter(r => r.id !== id && r.parent_id !== id))
      router.refresh()
    } else {
      toast.error(res.message)
    }
  }

  async function handleEditReview(id: string, newTitle: string | undefined, newBody: string) {
    const res = await updateReview(id, { title: newTitle, body: newBody })
    if (res.success) {
      toast.success(res.message)
      // Update in flat array
      setReviews(prev => prev.map(r => r.id === id ? { ...r, title: newTitle !== undefined ? newTitle : r.title, body: newBody } : r))
      router.refresh()
    } else {
      toast.error(res.message)
    }
  }

  // Check wishlist status and profile on mount
  useEffect(() => {
    async function checkStatus() {
      const status = await checkWishlistStatus(watch.id)
      setInWishlist(status)

      if (!currentUserId) return

      const supabase = createClient()
      const { data } = await (supabase as any).from('profiles').select('wrist_size, username, full_name').eq('id', currentUserId).single()
      if (data?.wrist_size) setWristSize(data.wrist_size)
      if (data) setCurrentUsername(data.username || data.full_name || "Community Member")

      // Fetch existing votes
      const { data: votesData } = await (supabase as any).from('review_votes').select('review_id, vote_type').eq('user_id', currentUserId);
      if (votesData) {
        const votesMap: Record<string, 'up' | 'down'> = {};
        votesData.forEach((v: any) => votesMap[v.review_id] = v.vote_type);
        setUserVotes(votesMap);
      }
    }
    checkStatus()
  }, [watch.id, currentUserId])

  function handleAddToCollection() {
    if (!checkAuth()) return
    // 1. Optimistic UI toggle
    const previousState = inCollection;
    setInCollection(!inCollection);
    toast(
      <div className="flex items-center justify-between w-full gap-4">
        <span>{!inCollection ? "Added to your collection!" : "Removed from your collection"}</span>
        {!inCollection && (
          <button
            onClick={() => router.push('/collection')}
            className="shrink-0 text-[10px] font-medium uppercase tracking-[0.15em] text-[#D4AF37] underline underline-offset-2 hover:text-[#D4AF37]/80"
          >
            View Vault
          </button>
        )}
      </div>,
      { style: { background: '#131920', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' } }
    )

    // 2. Background server action
    toggleCollection(watch.id).then((result) => {
      // 3. Rollback on failure
      if (!result.success) {
        setInCollection(previousState)
        toast.error(result.message)
      }
    }).catch(() => {
      setInCollection(previousState)
      toast.error("Something went wrong. Please try again.")
    })
  }

  function handleAddToWishlist() {
    if (!checkAuth()) return
    // 1. Optimistic UI toggle
    const previousState = inWishlist;
    setInWishlist(!inWishlist);

    toast(
      <div className="flex items-center justify-between w-full gap-4">
        <span>{!inWishlist ? "Added to your Grails!" : "Removed from your Grails"}</span>
        {!inWishlist && (
          <button
            onClick={() => router.push('/collection?tab=grails')}
            className="shrink-0 text-[10px] font-medium uppercase tracking-[0.15em] text-[#D4AF37] underline underline-offset-2 hover:text-[#D4AF37]/80"
          >
            View Grails
          </button>
        )}
      </div>,
      { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' }
    );

    // 2. Background server action
    toggleWishlist(watch.id).then((result) => {
      // 3. Rollback on failure
      if (!result.success) {
        setInWishlist(previousState);
        toast.error(result.message);
      }
    }).catch(() => {
      setInWishlist(previousState);
      toast.error("Failed to update wishlist");
    });
  }

  const hasReviewed = currentUserId ? reviews.some(r => r.user_id === currentUserId && !r.parent_id) : false;

  // Aggregated rating
  const { averageRating, ratingCount } = useMemo(() => {
    const rated = reviews.filter(r => r.rating && !r.parent_id);
    if (rated.length === 0) return { averageRating: 0, ratingCount: 0 };
    const sum = rated.reduce((acc: number, r: any) => acc + (r.rating || 0), 0);
    return { averageRating: Math.round((sum / rated.length) * 10) / 10, ratingCount: rated.length };
  }, [reviews]);

  return (
    <section className="relative min-h-screen px-4 pt-24 pb-20 sm:px-6 lg:pt-32 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="group mb-8 flex min-h-12 items-center gap-3 rounded-lg px-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground sm:mb-12"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to All Watches
          </Link>
        </motion.div>

        {/* Hero header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-4">
            {watch.brand}
          </p>
          <h1 className="mb-3 font-serif text-3xl font-light tracking-tight text-foreground sm:mb-4 md:text-4xl lg:text-5xl xl:text-6xl">
            {watch.model}
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <p className="text-sm tracking-wide text-muted-foreground">
              Ref. {watch.reference}
            </p>
            <span className="hidden text-muted-foreground/20 sm:inline">|</span>
            <p className="text-sm tracking-wide text-muted-foreground">
              {watch.year}
            </p>
            <span className="hidden text-muted-foreground/20 sm:inline">|</span>
            <div className="flex flex-wrap items-center gap-1">
              {watch.complications.map((c) => (
                <span
                  key={c}
                  className="rounded-sm border border-[#D4AF37]/10 bg-[#D4AF37]/5 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-[#D4AF37]/70"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-12 flex flex-col gap-3 sm:mb-16 sm:flex-row sm:gap-6"
        >
          <button
            onClick={handleAddToCollection}
            className={`group flex min-h-12 w-full sm:w-[320px] items-center justify-center gap-3 border px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 sm:py-4 ${inCollection
              ? "border-white/[0.15] text-muted-foreground hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400"
              : "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5"
              }`}
          >
            {inCollection ? (
              <>
                <Check className="h-4 w-4 group-hover:hidden" />
                <span className="group-hover:hidden">IN COLLECTION</span>
                <span className="hidden group-hover:inline">× REMOVE FROM COLLECTION</span>
              </>
            ) : (
              <>
                <span>+ ADD TO MY COLLECTION</span>
              </>
            )}
          </button>
          <button
            onClick={handleAddToWishlist}
            className={`group flex min-h-12 w-full sm:w-[320px] items-center justify-center gap-3 border px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 sm:py-4 ${inWishlist
              ? "border-[#D4AF37]/40 text-[#D4AF37] hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400"
              : "border-white/[0.15] text-foreground hover:bg-white/[0.02] hover:border-white/[0.3]"
              }`}
          >
            {inWishlist ? (
              <>
                <Heart className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37] group-hover:hidden" />
                <span className="group-hover:hidden">WISHLISTED</span>
                <span className="hidden group-hover:inline">× REMOVE FROM WISHLIST</span>
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                <span>ADD TO WISHLIST</span>
              </>
            )}
          </button>
        </motion.div>

        {/* ──────────── THE LEGACY ──────────── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 sm:mb-20"
        >
          <div className="gold-line mx-auto mb-12 max-w-xs sm:mb-16" />
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-6">
              The Legacy
            </p>
            <h2 className="mb-8 font-serif text-2xl font-light tracking-tight text-foreground sm:mb-10 md:text-3xl lg:text-4xl">
              <span className="text-balance">A Story Worth Telling</span>
            </h2>
            <blockquote className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 font-serif text-5xl text-[#D4AF37]/15 sm:text-6xl">
                {"\u201C"}
              </div>
              <p className="font-serif text-base font-light italic leading-[1.9] tracking-wide text-foreground/70 md:text-lg">
                {watch.legacy}
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 sm:mt-8">
                <div className="gold-line w-8 sm:w-12" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/60">
                  {watch.brand} Heritage
                </span>
                <div className="gold-line w-8 sm:w-12" />
              </div>
            </blockquote>
          </div>
        </motion.div>

        {/* ──────────── THE WATCH IMAGE ──────────── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 sm:mb-20"
        >
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg border border-white/[0.04]">
            <SafeImage
              brandName={watch.brand}
              src={watch.image || "/images/placeholder-watch.png"}
              alt={`${watch.brand} ${watch.model} luxury watch`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </motion.div>

        {/* ──────────── BENTO GRID — SPECS & MARKET ──────────── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 sm:mb-20"
        >
          <div className="gold-line mx-auto mb-12 max-w-xs sm:mb-16" />
          <div className="mb-12 text-center sm:mb-16">
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-4">
              Technical Specifications & Market
            </p>
            <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl lg:text-4xl">
              <span className="text-balance">The Details, Deconstructed</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
            {/* Box 1 (Top Left): The Caliber */}
            <BentoCard className="p-6 h-auto">
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                The Caliber
              </p>
              <h3 className="mb-4 font-serif text-xl font-light tracking-tight text-foreground sm:mb-6 sm:text-2xl">
                {watch.movement}
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                <SpecRow label="Power Reserve" value={watch.powerReserve} />
                <SpecRow label="Frequency" value={watch.frequency} />
                <SpecRow label="Jewels" value={watch.jewels} />
              </div>
            </BentoCard>

            {/* Box 2 (Top Right): Dimensions + Wrist Match */}
            <BentoCard className="p-6 h-auto">
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                Dimensions
              </p>
              <h3 className="mb-4 font-serif text-xl font-light tracking-tight text-foreground sm:mb-6 sm:text-2xl">
                {watch.caseDiameter} {"\u00D7"} {watch.thickness}
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                <SpecRow label="Case Diameter" value={watch.caseDiameter} />
                <SpecRow label="Thickness" value={watch.thickness} />
                <SpecRow label="Lug-to-Lug" value={watch.lugToLug} />
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Material</span>
                  <span className="font-mono text-sm text-foreground">
                    {watch.material}
                  </span>
                </div>
                {wristSize ? (
                  <WristFitVisualizer
                    lugToLugMs={parseFloat(watch.lugToLug)}
                    wristCircumference={wristSize}
                    className="mt-2"
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-md border border-white/[0.04] bg-[#0A0F16]/50 px-3 py-2.5">
                    <span className="text-xs text-muted-foreground/80">
                      Set your wrist size in your Profile to unlock Smart Wrist Match
                    </span>
                  </div>
                )}
              </div>
            </BentoCard>

            {/* Box 3 (Bottom Full-Width): Market Value & Technical Specs */}
            <BentoCard className="lg:col-span-2">
              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

                {/* Left side: Market Value */}
                <div className="flex-1">
                  <p className="mb-3 text-[9px] uppercase tracking-widest text-[#D4AF37]/60">
                    Market Value
                  </p>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="font-sans text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
                      {watch.price}
                    </h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-[#D4AF37]/60" />
                      <span className="text-xs font-medium text-[#D4AF37]/60">{watch.marketTrend}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Based on {watch.transactions} recent transactions
                  </p>
                  <a
                    href={watch.chrono24Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex min-h-12 items-center gap-3 rounded-md border border-[#D4AF37]/30 px-5 py-3 text-[11px] uppercase tracking-[0.15em] text-[#D4AF37] transition-all duration-500 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 sm:px-6"
                  >
                    View on Chrono24
                    <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>

                {/* Right side: Technical Specs (Water Res, Crystal, Bracelet) */}
                <div className="flex-1 border-t border-white/[0.04] pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                  <div className="grid h-full grid-cols-1 items-center gap-4 sm:grid-cols-3 sm:gap-6">
                    <div className="flex flex-row items-center gap-4 sm:flex-col sm:gap-3 sm:text-center">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]">
                        <Gem className="h-5 w-5 text-[#D4AF37]/60" />
                      </div>
                      <div className="flex flex-col sm:items-center">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Crystal</span>
                        <span className="font-mono text-sm text-foreground">{watch.crystal}</span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-4 sm:flex-col sm:gap-3 sm:text-center">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]">
                        <Droplets className="h-5 w-5 text-[#D4AF37]/60" />
                      </div>
                      <div className="flex flex-col sm:items-center">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Water Resistance</span>
                        <span className="font-mono text-sm text-foreground">{watch.waterResistance}</span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-4 sm:flex-col sm:gap-3 sm:text-center">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]">
                        <Watch className="h-5 w-5 text-[#D4AF37]/60" />
                      </div>
                      <div className="flex flex-col sm:items-center">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Bracelet / Strap</span>
                        <span className="font-mono text-sm text-foreground">{watch.bracelet}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </BentoCard>
          </div>
        </motion.div>

        {/* ──────────── IN THE WILD ──────────── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 sm:mt-24"
        >
          <div className="gold-line mx-auto mb-16 max-w-xs sm:mb-24" />

          <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-4">
                Social Feed
              </p>
              <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl lg:text-4xl">
                <span className="text-balance">In the Wild</span>
              </h2>
            </div>
            <button
              onClick={() => setIsWristRollModalOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-6 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37]/20"
            >
              <Camera className="h-3.5 w-3.5" />
              Share your Wrist Shot
            </button>
          </div>

          {initialWristRolls.length === 0 ? (
            <div className="rounded-lg border border-white/[0.04] bg-[#0A0F16] p-8 text-center text-sm text-muted-foreground sm:p-12">
              No sightings yet. Be the first to share your wrist roll for the {watch.model}.
            </div>
          ) : (
            <CarouselWithArrows wristRolls={initialWristRolls} currentUserId={currentUserId} />
          )}
        </motion.div>

        {/* ──────────── HOROLOGIST REVIEWS ──────────── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 sm:mt-24"
        >
          <div className="gold-line mx-auto mb-16 max-w-xs sm:mb-24" />

          <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-4">
                Horologist Reviews
              </p>
              <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl lg:text-4xl">
                <span className="text-balance">Expert Perspectives</span>
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-full border border-white/[0.08] bg-[#0A0F16] p-1">
                <button
                  onClick={() => setReviewSort('helpful')}
                  className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${reviewSort === 'helpful' ? 'bg-white/[0.08] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Most Helpful
                </button>
                <button
                  onClick={() => setReviewSort('newest')}
                  className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${reviewSort === 'newest' ? 'bg-white/[0.08] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Newest
                </button>
              </div>
              {!hasReviewed && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
                >
                  {showReviewForm ? <ArrowLeft className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  {showReviewForm ? 'Cancel' : 'Write Review'}
                </button>
              )}
            </div>
          </div>

          {/* ── Aggregated Rating Display ── */}
          {ratingCount > 0 && (
            <div className="mb-10 flex items-center gap-5 rounded-lg border border-white/[0.04] bg-[#0A0F16]/60 px-6 py-5">
              <span className="font-serif text-4xl font-light tracking-tight text-foreground">{averageRating.toFixed(1)}</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= Math.round(averageRating) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-muted-foreground/20'}`} />
                  ))}
                </div>
                <span className="text-[11px] tracking-wide text-muted-foreground/60">based on {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}</span>
              </div>
            </div>
          )}

          {showReviewForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleReviewSubmit}
              className="mb-12 overflow-hidden rounded-lg border border-[#D4AF37]/20 bg-gradient-to-b from-[#D4AF37]/10 to-transparent p-6 sm:p-8"
            >
              <h3 className="mb-6 font-serif text-xl tracking-tight text-foreground">Draft Your Perspective</h3>

              <div className="mb-6 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={`h-6 w-6 ${star <= newRating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-muted-foreground/30"}`} />
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Review Title (e.g. A Masterpiece of Engineering)"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="mb-4 w-full rounded-md border border-white/[0.08] bg-[#0A0F16] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[#D4AF37]/50"
              />

              <textarea
                placeholder="Share your horological perspective..."
                value={newBody}
                onChange={e => setNewBody(e.target.value)}
                className="mb-6 min-h-[120px] w-full resize-none rounded-md border border-white/[0.08] bg-[#0A0F16] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[#D4AF37]/50"
              />

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-[#D4AF37] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0F16] transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isSubmittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Publish Review
              </button>
            </motion.form>
          )}

          <div className="flex flex-col gap-4 sm:gap-6">
            {visibleReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review as ReviewProps}
                onReply={handleReply}
                onDelete={handleDeleteReview}
                onEdit={handleEditReview}
                userVotes={userVotes}
                currentUserId={currentUserId}
              />
            ))}
          </div>

          {reviews.length > 10 && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="rounded-full border border-white/[0.08] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-foreground transition-all hover:bg-white/[0.04]"
              >
                {showAllReviews ? "Show Less" : `Load ${reviews.length - 10} More Reviews`}
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <WristRollModal
        isOpen={isWristRollModalOpen}
        onClose={() => setIsWristRollModalOpen(false)}
        watches={[{ id: watch.id, brand: watch.brand, model: watch.model }]}
        initialWatchId={watch.id}
      />
    </section>
  )
}
