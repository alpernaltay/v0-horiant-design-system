"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  CheckCircle2,
  MessageSquare,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  Trophy,
  Cog,
  Ruler,
  Send,
  Camera,
  Loader2,
  Trash2,
  Share,
  Share2,
  Check,
  Star,
} from "lucide-react"
import { communityComments } from "@/lib/mock-watches"
import { createClient } from "@/lib/supabase/client"
import { ProfileSettingsModal } from "./profile-settings-modal"
import { ReviewItem } from "./review-item"
import { addReview, updateReview, deleteReview, voteReview, replyToReview } from "@/lib/actions/reviews"
import { SafeImage } from "@/components/horiant/safe-image"
import { CompareButton } from "./compare-button"
import { ReviewsFeed } from "./reviews-feed"
import { WristRollModal } from "./wrist-roll-modal"

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
}

interface SOTCProfileProps {
  watches?: any[]
  wishlistWatches?: any[]
  vaultImageUrl?: string | null
  username?: string | null
  profileId?: string
  wristSize?: number | null
  isOwner?: boolean
  initialReviews?: any[]
  currentUserId?: string
  legacyScore?: number
  totalPieces?: number
  totalComplications?: number
  isAdmin?: boolean
}

export function SOTCProfile({
  watches = [],
  wishlistWatches = [],
  vaultImageUrl,
  username,
  profileId,
  wristSize,
  isOwner = false,
  initialReviews = [],
  currentUserId,
  legacyScore = 0,
  totalPieces = 0,
  totalComplications = 0,
  isAdmin = false
}: SOTCProfileProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab = tabParam === 'grails' ? 'wishlist' : 'collection'

  const handleTabChange = (tab: 'collection' | 'wishlist') => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (tab === 'wishlist') {
      newParams.set('tab', 'grails')
    } else {
      newParams.delete('tab')
    }
    router.replace(`?${newParams.toString()}`, { scroll: false })
  }
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({})
  const [commentText, setCommentText] = useState("")
  const [reviews, setReviews] = useState(initialReviews)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  // Tab State handled by URL Search Params

  // Vault Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(vaultImageUrl || null)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isWristRollModalOpen, setIsWristRollModalOpen] = useState(false)

  // Calculate Average Rating dynamically based on explicit ratings
  const ratedReviews = reviews.filter((r: any) => typeof r.rating === 'number' && r.rating > 0)
  const averageRating = ratedReviews.length > 0
    ? (ratedReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / ratedReviews.length).toFixed(1)
    : "0.0"

  // --- Real Review Handlers ---

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim() || !profileId) return

    setIsSubmittingReview(true)
    const res = await addReview(profileId, { rating, title: "", body: commentText }, 'profile')

    if (res.success) {
      toast("Review posted!", { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' })
      setCommentText("")
      setRating(5)
      // Optimistically add to UI
      setReviews([{
        id: res.data?.id || `new-${Date.now()}`,
        author: "You",
        avatar: "YO",
        created_at: new Date().toISOString(),
        rating: rating,
        title: "",
        body: commentText,
        likes: 0,
        user_id: currentUserId,
        parent_id: null
      }, ...reviews])
      router.refresh()
    } else {
      if (res.message === 'duplicate_review') {
        toast("Heritage shared. You have already rated this piece. Please edit your existing review to add more thoughts.", { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' })
      } else {
        toast.error(res.message || "Failed to submit review")
      }
    }
    setIsSubmittingReview(false)
  }

  async function handleReply(parentId: string, replyText: string) {
    if (!profileId) return

    const res = await replyToReview(parentId, replyText, undefined, profileId)
    if (res.success) {
      toast("Reply posted!", { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' })
      setReviews(prev => [...prev, {
        id: res.data?.id || `reply-${Date.now()}`,
        author: "You",
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

  async function handleEditReview(id: string, newTitle: string | undefined, newBody: string) {
    const res = await updateReview(id, { title: newTitle, body: newBody })
    if (res.success) {
      toast.success(res.message)
      setReviews(prev => prev.map(r => r.id === id ? { ...r, title: newTitle !== undefined ? newTitle : r.title, body: newBody } : r))
      router.refresh()
    } else {
      toast.error(res.message)
    }
  }

  async function handleDeleteReview(id: string) {
    const res = await deleteReview(id)
    if (res.success) {
      toast.success(res.message)
      setReviews(prev => prev.filter(r => r.id !== id && r.parent_id !== id))
      router.refresh()
    } else {
      toast.error(res.message)
    }
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("You must be logged in to upload.")
      setIsUploading(false)
      return
    }

    // Show optimistic preview
    const objectUrl = URL.createObjectURL(file)
    setLocalImageUrl(objectUrl)
    toast.success("Uploading image...")

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/vault_cover.${fileExt}`

    try {
      // 1. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('vault_images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vault_images')
        .getPublicUrl(filePath)

      // 3. Update profile
      const { error: updateError } = await ((supabase as any)
        .from('profiles')
        .update({ vault_image_url: publicUrl })
        .eq('id', user.id))

      if (updateError) throw updateError

      setLocalImageUrl(publicUrl)
      toast.success("Vault image updated securely.")

    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to upload image.")
      // Revert optimistic update
      setLocalImageUrl(vaultImageUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleRemovePhoto(e: React.MouseEvent) {
    e.stopPropagation() // Prevent triggering the file input click

    if (!localImageUrl || isUploading) return

    setIsUploading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("You must be logged in.")
      setIsUploading(false)
      return
    }

    try {
      // Find files for this user and remove them
      const { data: files } = await supabase.storage.from("vault_images").list(user.id)
      if (files && files.length > 0) {
        const filePaths = files.map(file => `${user.id}/${file.name}`)
        const { error: deleteError } = await supabase.storage.from("vault_images").remove(filePaths)
        if (deleteError) throw deleteError
      }

      // Update profile
      const { error: updateError } = await ((supabase as any)
        .from('profiles')
        .update({ vault_image_url: null })
        .eq('id', user.id))

      if (updateError) throw updateError

      setLocalImageUrl(null)
      toast.success("Vault image removed.")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to remove image.")
    } finally {
      setIsUploading(false)
    }
  }

  function handleShareVault() {
    const slug = username || profileId;
    navigator.clipboard.writeText(window.location.origin + '/vault/' + slug)
    toast.success("Vault link copied to clipboard.")
  }
  const hasReviewed = currentUserId ? reviews.some(r => r.user_id === currentUserId && !r.parent_id) : false;

  return (
    <section className="relative min-h-screen px-4 pt-24 pb-20 sm:px-6 lg:pt-32 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Profile Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-16 sm:mb-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-4">
              The Collection
            </p>
            <h1 className="mb-3 font-serif text-3xl font-light tracking-tight text-foreground sm:mb-4 md:text-4xl lg:text-5xl xl:text-6xl flex items-center gap-3 flex-wrap">
              {isOwner ? "My Vault" : `${username || "Collector"}'s Vault`}
              {isAdmin && (
                <Link href="/admin" className="text-xs text-[#D4AF37] ml-2 underline font-sans tracking-widest uppercase">
                  Lab Admin
                </Link>
              )}
            </h1>
            <p className="text-sm tracking-wide text-muted-foreground">
              Curating since 2019
            </p>
          </div>

          <div className="flex w-full flex-col sm:w-auto sm:flex-row items-center gap-3">
            {isOwner && (
              <button
                onClick={() => setIsWristRollModalOpen(true)}
                className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-6 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37]/20"
              >
                <Camera className="h-3.5 w-3.5" />
                Post a Wrist-Roll
              </button>
            )}
            {username && (
              <button
                onClick={handleShareVault}
                className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-6 text-[10px] uppercase tracking-[0.2em] text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                <Share className="h-3.5 w-3.5" />
                Share Vault
              </button>
            )}
          </div>
        </motion.div>

        {/* ──────────── STATS ROW ──────────── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-16 grid grid-cols-1 gap-3 sm:mb-20 sm:grid-cols-3 sm:gap-4"
        >
          <div className="card-glow rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] p-6 text-center sm:p-8">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 sm:mb-4">
              <Trophy className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-3">Legacy Score</p>
            <p className="font-serif text-2xl font-light tracking-tight text-foreground sm:text-3xl">{legacyScore}</p>
          </div>
          <div className="card-glow rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] p-6 text-center sm:p-8">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 sm:mb-4">
              <Cog className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-3">Pieces &amp; Features</p>
            <p className="font-serif text-2xl font-light tracking-tight text-foreground sm:text-3xl">{totalPieces} / {totalComplications}</p>
          </div>
          <div className="card-glow rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] p-6 text-center sm:p-8">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 sm:mb-4">
              <Star className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-3">Vault Rating</p>
            <p className="font-serif text-2xl font-light tracking-tight text-foreground sm:text-3xl">{averageRating}</p>
          </div>
        </motion.div>

        {/* ──────────── TABS NAV ──────────── */}
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-white/[0.04] sm:mb-16 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleTabChange('collection')}
              className={`relative pb-4 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${activeTab === 'collection' ? 'text-[#D4AF37]' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              The Vault
              {activeTab === 'collection' && (
                <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-[#D4AF37]" />
              )}
            </button>
            <button
              onClick={() => handleTabChange('wishlist')}
              className={`relative pb-4 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${activeTab === 'wishlist' ? 'text-[#D4AF37]' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {isOwner ? "My Grails" : "Grails"}
              {activeTab === 'wishlist' && (
                <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-[#D4AF37]" />
              )}
            </button>
          </div>

        </div>

        {activeTab === 'collection' ? (
          <>
            {/* ──────────── THE BOX SHOT ──────────── */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mb-16 sm:mb-20"
            >
              <div className="gold-line mx-auto mb-12 max-w-xs sm:mb-16" />
              <p className="mb-4 text-center text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-6">
                The Watch Box
              </p>
              <div className="card-glow overflow-hidden rounded-lg border border-white/[0.04]">
                <div
                  className={`group relative h-[280px] w-full md:aspect-[21/7] md:h-auto ${isOwner ? 'cursor-pointer' : ''}`}
                  onClick={() => isOwner && !isUploading && fileInputRef.current?.click()}
                >
                  <Image
                    src={localImageUrl || "/images/watch-box.jpg"}
                    alt="Luxury watch box displaying the collection"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F16] via-[#0A0F16]/40 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                  {/* Upload Overlay */}
                  {isOwner && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/40 backdrop-blur-sm">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                          </div>
                          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/80">Uploading to Vault...</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col items-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-colors hover:bg-white/10">
                              <Camera className="h-6 w-6 text-white" />
                            </div>
                            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/80">
                              {localImageUrl ? "Change Photo" : "Upload Vault Photo"}
                            </p>
                          </div>

                          {localImageUrl && (
                            <div
                              className="group/remove flex flex-col items-center"
                              onClick={handleRemovePhoto}
                            >
                              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-black/40 backdrop-blur-md transition-colors hover:bg-red-500/20">
                                <Trash2 className="h-6 w-6 text-red-400 group-hover/remove:text-red-300" />
                              </div>
                              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-red-400/80 group-hover/remove:text-red-300">
                                Remove Photo
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </motion.div>

            {/* ──────────── COLLECTION GRID ──────────── */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mb-16 sm:mb-24"
            >
              <div className="mb-12 sm:mb-16">
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-4">
                  The Collection
                </p>
                <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl lg:text-4xl">
                  <span className="text-balance">Four Pillars</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {watches.length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      {isOwner ? "Your vault is empty. Discover watches to add them here." : "This vault is currently empty."}
                    </p>
                    <Link href="/" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-8 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10">
                      Discover Timepieces
                    </Link>
                  </div>
                ) : watches.map((watch) => (
                  <Link
                    key={watch.id}
                    href={`/watch/${watch.id}`}
                    onClick={() => console.log("NAV_DEBUG: Clicking watch", watch)}
                    className="cursor-pointer card-glow group relative flex min-h-12 flex-col overflow-hidden rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] text-left"
                  >
                    <CompareButton watch={{
                      id: watch.id,
                      slug: (watch as any).slug || watch.id,
                      brand: watch.brand,
                      model: watch.model,
                      image: watch.image || null
                    }} />

                    {watch.verified && (
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-2.5 py-1 backdrop-blur-sm">
                        <CheckCircle2 className="h-3 w-3 text-[#D4AF37]" />
                        <span className="text-[9px] uppercase tracking-[0.15em] text-[#D4AF37]">Verified Owner</span>
                      </div>
                    )}
                    <div className="relative aspect-square w-full overflow-hidden">
                      <SafeImage
                        brandName={watch.brand}
                        src={watch.image || "/images/placeholder-watch.png"}
                        alt={`${watch.brand} ${watch.model}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/20 to-transparent" />
                    </div>
                    <div className="relative flex flex-1 flex-col p-4 pt-3 sm:p-5">
                      <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">{watch.brand}</p>
                      <h3 className="mb-1 font-serif text-base font-light tracking-tight text-foreground sm:text-lg">{watch.model}</h3>
                      <div className="mb-3 flex flex-wrap gap-1">
                        {(watch.complications || []).map((c: string) => (
                          <span key={c} className="rounded-sm border border-white/[0.04] bg-white/[0.02] px-1.5 py-0.5 text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50">
                            {c}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-end justify-between border-t border-white/[0.04] pt-3 sm:pt-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">Year / Reference</span>
                          <span className="font-mono text-xs text-foreground/80">{watch.year} &middot; {watch.reference}</span>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:text-[#D4AF37] sm:h-7 sm:w-7">
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* ──────────── COMMUNITY THREAD ──────────── */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="gold-line mx-auto mb-16 max-w-xs sm:mb-24" />
              <div className="mb-12 sm:mb-16">
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-4">Community Thread</p>
                <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl lg:text-4xl">
                  <span className="text-balance">What the Community Says</span>
                </h2>
              </div>

              {!isOwner && !hasReviewed && (
                <div className="mb-6 rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920]/80 to-[#0d1117]/80 p-4 sm:mb-8 sm:p-6">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] sm:mb-4">Rate This Vault</p>

                  {/* Star Rating Selection */}
                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${star <= (hoveredStar ?? rating)
                            ? "fill-[#D4AF37] text-[#D4AF37]"
                            : "text-muted-foreground/30"
                            }`}
                        />
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts on this collection..."
                      rows={3}
                      className="w-full resize-none rounded-md border border-white/[0.06] bg-[#0A0F16] px-3 py-3 text-sm text-foreground placeholder-muted-foreground/40 outline-none transition-colors duration-300 focus:border-[#D4AF37]/25 sm:px-4"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingReview || !currentUserId}
                        className="inline-flex min-h-12 items-center gap-2 rounded-md border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-5 py-2 text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37]/10 disabled:opacity-50"
                      >
                        <Send className="h-3 w-3" />
                        {isSubmittingReview ? "Posting..." : "Post Review"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="flex flex-col gap-4 sm:gap-5">
                {(() => {
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
                    // Sort top level by newest
                    return roots.sort((a, b) => {
                      const dateA = new Date(a.created_at || a.date || Date.now()).getTime();
                      const dateB = new Date(b.created_at || b.date || Date.now()).getTime();
                      return dateB - dateA;
                    });
                  };

                  const reviewRoots = buildTree(reviews);

                  if (reviewRoots.length === 0) {
                    return <p className="py-8 text-center text-sm text-muted-foreground italic">No reviews yet. Be the first to share your thoughts!</p>;
                  }

                  return reviewRoots.map((review: any) => (
                    <ReviewItem
                      key={review.id}
                      review={review}
                      currentUserId={currentUserId}
                      onReply={handleReply}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                      userVotes={userVotes}
                    />
                  ));
                })()}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            key="wishlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-16 sm:mb-24"
          >
            <div className="mb-12 sm:mb-16">
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-4">
                Wishlist
              </p>
              <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl lg:text-4xl">
                <span className="text-balance">{isOwner ? "My Grails" : "Grails"}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {wishlistWatches.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isOwner ? "You haven't added any watches to your Grails yet." : "No grails have been curated yet."}
                  </p>
                  <Link href="/" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-8 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10">
                    Discover Timepieces
                  </Link>
                </div>
              ) : wishlistWatches.map((watch) => (
                <Link
                  key={watch.id}
                  href={`/watch/${watch.id}`}
                  onClick={() => console.log("NAV_DEBUG: Clicking watch", watch)}
                  className="cursor-pointer card-glow group relative flex min-h-12 flex-col overflow-hidden rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] text-left"
                >
                  <CompareButton watch={{
                    id: watch.id,
                    slug: (watch as any).slug || watch.id,
                    brand: watch.brand,
                    model: watch.model,
                    image: watch.image || null
                  }} />

                  <div className="relative aspect-square w-full overflow-hidden">
                    <SafeImage
                      brandName={watch.brand}
                      src={watch.image || "/images/placeholder-watch.png"}
                      alt={`${watch.brand} ${watch.model}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/20 to-transparent" />
                  </div>
                  <div className="relative flex flex-1 flex-col p-4 pt-3 sm:p-5">
                    <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">{watch.brand}</p>
                    <h3 className="mb-1 font-serif text-base font-light tracking-tight text-foreground sm:text-lg">{watch.model}</h3>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {(watch.complications || []).map((c: string) => (
                        <span key={c} className="rounded-sm border border-white/[0.04] bg-white/[0.02] px-1.5 py-0.5 text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-end justify-between border-t border-white/[0.04] pt-3 sm:pt-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50">Market Value</span>
                        <span className="font-sans text-xs font-medium text-[#D4AF37]/60">{watch.price}</span>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:text-[#D4AF37] sm:h-7 sm:w-7">
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )
        }
      </div >

      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUsername={username || ""}
        currentWristSize={wristSize || null}
      />

      <WristRollModal
        isOpen={isWristRollModalOpen}
        onClose={() => setIsWristRollModalOpen(false)}
        watches={watches}
      />
    </section >
  )
}
