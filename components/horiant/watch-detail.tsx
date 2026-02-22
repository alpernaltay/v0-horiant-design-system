"use client"

import Image from "next/image"
import { ArrowLeft, TrendingUp, CheckCircle2, Star, ThumbsUp } from "lucide-react"
import type { WatchData } from "./discover-grid"

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`card-glow relative overflow-hidden rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] p-8 ${className}`}
    >
      {children}
    </div>
  )
}

const reviews = [
  {
    author: "WatchScholar_CH",
    avatar: "WS",
    date: "14 Feb 2026",
    rating: 5,
    title: "Caliber finishing is beyond reproach",
    body: "Having examined this reference under a loupe, the level of hand-finishing on the movement is extraordinary. The three-quarter plate features impeccable Glashutte ribbing, and the hand-engraved balance cock is a work of art unto itself. The column-wheel chronograph operates with a tactile precision that puts most Swiss competitors to shame. This is, quite simply, the finest manually-wound chronograph movement in production today.",
  },
  {
    author: "HorologistMark",
    avatar: "HM",
    date: "3 Jan 2026",
    rating: 4,
    title: "Lug-to-lug wearability is the surprise standout",
    body: "On paper, 41mm with 13.1mm thickness sounds chunky for a dress chronograph. In practice, the case is superbly sculpted. The downturned lugs hug a 17cm wrist beautifully, and the slim bezel makes the dial feel expansive. The platinum version carries real heft, but it sits flat and stable. I wore it comfortably under a French cuff for a full evening. Lange understands ergonomics far better than the spec sheet suggests.",
  },
]

interface WatchDetailProps {
  watch: WatchData
  onBack: () => void
}

export function WatchDetail({ watch, onBack }: WatchDetailProps) {
  return (
    <section className="relative min-h-screen px-6 pt-28 pb-24 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="group mb-12 flex items-center gap-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Discover
        </button>

        {/* Hero header */}
        <div className="mb-16">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
            {watch.brand}
          </p>
          <h1 className="mb-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {watch.model}
          </h1>
          <p className="text-sm tracking-wide text-muted-foreground">
            Ref. {watch.reference}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {/* Box 1: Large Image */}
          <BentoCard className="flex items-center justify-center lg:col-span-1 lg:row-span-2">
            <div className="relative aspect-square w-full">
              <Image
                src={watch.image}
                alt={`${watch.brand} ${watch.model} luxury watch`}
                fill
                className="rounded object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </BentoCard>

          {/* Box 2: The Caliber */}
          <BentoCard>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              The Caliber
            </p>
            <h3 className="mb-6 font-serif text-2xl font-light tracking-tight text-foreground">
              {watch.movement}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-xs text-muted-foreground">Power Reserve</span>
                <span className="font-mono text-sm text-foreground">{watch.powerReserve}</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-xs text-muted-foreground">Frequency</span>
                <span className="font-mono text-sm text-foreground">{watch.frequency}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Jewels</span>
                <span className="font-mono text-sm text-foreground">{watch.jewels}</span>
              </div>
            </div>
          </BentoCard>

          {/* Box 3: Dimensions */}
          <BentoCard>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Dimensions
            </p>
            <h3 className="mb-6 font-serif text-2xl font-light tracking-tight text-foreground">
              {watch.caseDiameter} {"\u00D7"} {watch.thickness}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-xs text-muted-foreground">Case Diameter</span>
                <span className="font-mono text-sm text-foreground">{watch.caseDiameter}</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-xs text-muted-foreground">Thickness</span>
                <span className="font-mono text-sm text-foreground">{watch.thickness}</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-xs text-muted-foreground">Material</span>
                <span className="font-mono text-sm text-foreground">{watch.material}</span>
              </div>
              {/* Wrist Match Feature */}
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/5 border border-emerald-500/10 px-3 py-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-emerald-300/90">
                  Perfect fit for your 17cm wrist
                </span>
              </div>
            </div>
          </BentoCard>

          {/* Box 4: Market Value - spans 2 cols */}
          <BentoCard className="lg:col-span-2">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                  Market Value
                </p>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
                    {watch.price}
                  </h3>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">
                      {watch.marketTrend}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Based on {watch.transactions} recent transactions
                </p>
              </div>
              {/* Mini chart visualization */}
              <div className="flex items-end gap-1">
                {[35, 42, 38, 55, 48, 60, 52, 65, 70, 68, 75, 82].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="w-2 rounded-sm bg-emerald-500/20 transition-all duration-300 hover:bg-emerald-500/40"
                      style={{ height: `${h}px` }}
                    />
                  )
                )}
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Community Reviews Section */}
        <div className="mt-24">
          <div className="gold-line mx-auto mb-24 max-w-xs" />

          <div className="mb-16">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Community
            </p>
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
              <span className="text-balance">Expert Reviews</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {reviews.map((review) => (
              <article
                key={review.author}
                className="card-glow rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] p-8 lg:p-10"
              >
                {/* Review header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                      <span className="text-[11px] font-medium tracking-wider text-[#D4AF37]">
                        {review.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{review.author}</p>
                      <p className="text-[11px] text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= review.rating
                            ? "fill-[#D4AF37] text-[#D4AF37]"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review content */}
                <h3 className="mb-4 font-serif text-xl font-light tracking-tight text-foreground">
                  {review.title}
                </h3>
                <p className="font-serif text-sm font-light leading-relaxed text-muted-foreground/80 italic">
                  {`"${review.body}"`}
                </p>

                {/* Review footer */}
                <div className="mt-6 flex items-center gap-4 border-t border-white/[0.04] pt-5">
                  <button className="flex items-center gap-2 text-[11px] text-muted-foreground transition-colors duration-300 hover:text-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    Helpful
                  </button>
                  <span className="text-muted-foreground/30">|</span>
                  <button className="text-[11px] text-muted-foreground transition-colors duration-300 hover:text-foreground">
                    Reply
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
