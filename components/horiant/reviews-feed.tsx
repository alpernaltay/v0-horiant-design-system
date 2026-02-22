"use client"

import { MessageSquare } from "lucide-react"
import { communityReviewSnippets, trendingWatches, featuredWatch, type WatchData } from "@/lib/mock-watches"

interface ReviewsFeedProps {
  onSelectWatch: (watch: WatchData) => void
}

export function ReviewsFeed({ onSelectWatch }: ReviewsFeedProps) {
  const allWatches = [featuredWatch, ...trendingWatches]

  return (
    <section className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
            From the Community
          </p>
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
            <span className="text-balance">Latest Enthusiast Reviews</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {communityReviewSnippets.map((review) => {
            const watch = allWatches.find((w) => w.id === review.watchId)
            return (
              <button
                key={review.author}
                onClick={() => watch && onSelectWatch(watch)}
                className="card-glow group rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920]/80 to-[#0d1117]/80 p-7 text-left transition-all duration-500"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5">
                      <span className="text-[9px] font-medium tracking-wider text-[#D4AF37]">
                        {review.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-foreground">{review.author}</p>
                      <p className="text-[10px] text-muted-foreground/50">
                        {review.timeAgo}
                      </p>
                    </div>
                  </div>
                  {watch && (
                    <span className="rounded-sm border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                      {watch.brand}
                    </span>
                  )}
                </div>

                <p className="font-serif text-sm font-light italic leading-relaxed text-muted-foreground/80">
                  {`\u201C${review.snippet}\u201D`}
                </p>

                <div className="mt-5 flex items-center gap-2 text-[10px] text-muted-foreground/40 transition-colors duration-300 group-hover:text-muted-foreground/70">
                  <MessageSquare className="h-3 w-3" />
                  Read full review
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
