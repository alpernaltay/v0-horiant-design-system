"use client"

import Link from "next/link"
import { SafeImage } from "./safe-image"
import { Star, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import type { WatchData } from "@/lib/mock-watches"
import { CompareButton } from "./compare-button"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${star <= Math.round(rating)
            ? "fill-[#D4AF37] text-[#D4AF37]"
            : "text-muted-foreground/30"
            }`}
        />
      ))}
      <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">
        {rating}
      </span>
    </div>
  )
}

interface DiscoverGridProps {
  watches: WatchData[]
}

export function DiscoverGrid({ watches }: DiscoverGridProps) {
  return (
    <section className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Curated Selection
            </p>
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
              <span className="text-balance">Trending Timepieces</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/watches" className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground">
              View All
              <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Watch Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {watches.map((watch, index) => (
            <motion.div
              key={watch.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
              className="h-full"
            >
              <Link
                href={`/watch/${watch.id}`}
                onClick={() => console.log("NAV_DEBUG: Clicking watch", watch)}
                className="cursor-pointer card-glow group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920]/80 to-[#0d1117]/80 text-left backdrop-blur-sm"
              >
                {/* Compare Button */}
                <CompareButton watch={{
                  id: watch.id,
                  slug: (watch as any).slug || watch.id,
                  brand: watch.brand,
                  model: watch.model,
                  image: watch.image || null
                }} />

                {/* Style badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="rounded-sm border border-white/[0.06] bg-[#0A0F16]/70 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70 backdrop-blur-sm">
                    {watch.style}
                  </span>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <SafeImage
                    brandName={watch.brand}
                    src={watch.image || "/images/placeholder-watch.png"}
                    alt={`${watch.brand} ${watch.model} luxury watch`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 6}
                    loading={index >= 6 ? "lazy" : undefined}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/30 to-transparent" />
                </div>

                {/* Details */}
                <div className="relative flex flex-1 flex-col p-5 pt-4">
                  <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                    {watch.brand}
                  </p>
                  <h3 className="mb-2 font-serif text-lg font-light tracking-tight text-foreground">
                    {watch.model}
                  </h3>
                  <StarRating rating={watch.rating} />

                  {/* Year + Reference */}
                  <div className="mt-4 flex items-end justify-between border-t border-white/[0.04] pt-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">
                        Year / Reference
                      </span>
                      <span className="font-mono text-xs text-foreground/80">
                        {watch.year} &middot; {watch.reference}
                      </span>
                    </div>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:text-[#D4AF37]">
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
