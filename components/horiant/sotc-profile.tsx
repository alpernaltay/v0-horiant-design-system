"use client"

import Image from "next/image"
import {
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  ArrowUpRight,
} from "lucide-react"
import {
  sotcWatches,
  communityComments,
  getFullWatchData,
  type WatchData,
} from "@/lib/mock-watches"

interface SOTCProfileProps {
  onSelectWatch: (watch: WatchData) => void
}

export function SOTCProfile({ onSelectWatch }: SOTCProfileProps) {
  return (
    <section className="relative min-h-screen px-6 pt-28 pb-24 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="mb-20">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
            State of the Collection
          </p>
          <h1 className="mb-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {"JohnDoe\u2019s Vault"}
          </h1>
          <p className="text-sm tracking-wide text-muted-foreground">
            Curating since 2019
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Pieces", value: "4" },
            { label: "Est. Value", value: "$32,000" },
            { label: "Wrist Size", value: "17 cm" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card-glow rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] p-8 text-center"
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                {stat.label}
              </p>
              <p className="font-serif text-3xl font-light tracking-tight text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* The Box Shot */}
        <div className="mb-20">
          <div className="gold-line mx-auto mb-16 max-w-xs" />
          <p className="mb-6 text-center text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
            The Watch Box
          </p>
          <div className="card-glow overflow-hidden rounded-lg border border-white/[0.04]">
            <div className="relative aspect-[21/9] w-full">
              <Image
                src="/images/watch-box.jpg"
                alt="Luxury watch box displaying the collection"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F16] via-transparent to-transparent opacity-40" />
            </div>
          </div>
        </div>

        {/* Collection Grid */}
        <div className="mb-24">
          <div className="mb-16">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              The Collection
            </p>
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
              <span className="text-balance">Four Pillars</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sotcWatches.map((watch) => (
              <button
                key={watch.id}
                onClick={() => onSelectWatch(getFullWatchData(watch))}
                className="card-glow group relative flex flex-col overflow-hidden rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] text-left"
              >
                {/* Verified badge */}
                {watch.verified && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-2.5 py-1 backdrop-blur-sm">
                    <CheckCircle2 className="h-3 w-3 text-[#D4AF37]" />
                    <span className="text-[9px] uppercase tracking-[0.15em] text-[#D4AF37]">
                      Verified Owner
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={watch.image}
                    alt={`${watch.brand} ${watch.model}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/20 to-transparent" />
                </div>

                {/* Details */}
                <div className="relative flex flex-1 flex-col p-5 pt-3">
                  <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                    {watch.brand}
                  </p>
                  <h3 className="mb-1 font-serif text-lg font-light tracking-tight text-foreground">
                    {watch.model}
                  </h3>
                  <p className="mb-3 font-mono text-[11px] text-muted-foreground/60">
                    {watch.reference}
                  </p>
                  <div className="mt-auto flex items-end justify-between border-t border-white/[0.04] pt-4">
                    <span className="font-mono text-sm text-foreground">
                      {watch.price}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:text-[#D4AF37]">
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Community Thread */}
        <div>
          <div className="gold-line mx-auto mb-24 max-w-xs" />

          <div className="mb-16">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Community Thread
            </p>
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
              <span className="text-balance">What the Community Says</span>
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            {communityComments.map((comment) => (
              <article
                key={comment.author}
                className="card-glow rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] p-7 lg:p-8"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5">
                      <span className="text-[10px] font-medium tracking-wider text-[#D4AF37]">
                        {comment.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{comment.author}</p>
                      <p className="text-[11px] text-muted-foreground/60">
                        {comment.timeAgo}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="font-serif text-sm font-light italic leading-relaxed text-muted-foreground/80">
                  {`\u201C${comment.body}\u201D`}
                </p>

                <div className="mt-5 flex items-center gap-4 border-t border-white/[0.04] pt-4">
                  <button className="flex items-center gap-2 text-[11px] text-muted-foreground transition-colors duration-300 hover:text-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    {comment.likes}
                  </button>
                  <span className="text-muted-foreground/20">|</span>
                  <button className="flex items-center gap-2 text-[11px] text-muted-foreground transition-colors duration-300 hover:text-foreground">
                    <MessageSquare className="h-3 w-3" />
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
