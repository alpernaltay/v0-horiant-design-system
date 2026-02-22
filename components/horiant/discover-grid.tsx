"use client"

import Image from "next/image"
import { Star, ArrowUpRight } from "lucide-react"

export interface WatchData {
  id: string
  brand: string
  model: string
  image: string
  reference: string
  movement: string
  price: string
  rating: number
  caseDiameter: string
  thickness: string
  material: string
  powerReserve: string
  frequency: string
  jewels: string
  marketTrend: string
  transactions: number
}

export const allWatches: WatchData[] = [
  {
    id: "nautilus",
    brand: "Patek Philippe",
    model: "Nautilus 5711/1A",
    image: "/images/watch-nautilus.jpg",
    reference: "5711/1A-010",
    movement: "Cal. 26-330 S C",
    price: "$148,500",
    rating: 4.9,
    caseDiameter: "40.0 mm",
    thickness: "8.3 mm",
    material: "Stainless Steel",
    powerReserve: "45 Hours",
    frequency: "28,800 vph",
    jewels: "29",
    marketTrend: "+8.2%",
    transactions: 89,
  },
  {
    id: "royal-oak",
    brand: "Audemars Piguet",
    model: 'Royal Oak "Jumbo"',
    image: "/images/watch-royal-oak.jpg",
    reference: "16202ST.OO.1240ST.01",
    movement: "Cal. 7121",
    price: "$72,000",
    rating: 4.8,
    caseDiameter: "39.0 mm",
    thickness: "8.1 mm",
    material: "Stainless Steel",
    powerReserve: "55 Hours",
    frequency: "28,800 vph",
    jewels: "36",
    marketTrend: "+5.1%",
    transactions: 62,
  },
  {
    id: "submariner",
    brand: "Rolex",
    model: "Submariner Date",
    image: "/images/watch-submariner.jpg",
    reference: "126610LN",
    movement: "Cal. 3235",
    price: "$14,200",
    rating: 4.7,
    caseDiameter: "41.0 mm",
    thickness: "12.7 mm",
    material: "Oystersteel",
    powerReserve: "70 Hours",
    frequency: "28,800 vph",
    jewels: "31",
    marketTrend: "+3.6%",
    transactions: 214,
  },
  {
    id: "snowflake",
    brand: "Grand Seiko",
    model: "Snowflake SBGA211",
    image: "/images/watch-snowflake.jpg",
    reference: "SBGA211",
    movement: "Cal. 9R65",
    price: "$5,800",
    rating: 4.8,
    caseDiameter: "41.0 mm",
    thickness: "12.5 mm",
    material: "Titanium",
    powerReserve: "72 Hours",
    frequency: "28,800 vph",
    jewels: "30",
    marketTrend: "+2.9%",
    transactions: 156,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= Math.round(rating)
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
  onSelectWatch: (watch: WatchData) => void
}

export function DiscoverGrid({ onSelectWatch }: DiscoverGridProps) {
  return (
    <section className="relative px-6 py-24 lg:py-32">
      <div className="gold-line mx-auto mb-24 max-w-xs" />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Curated Selection
            </p>
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
              <span className="text-balance">Trending on Horiant</span>
            </h2>
          </div>
          <button className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground">
            View All
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Watch Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {allWatches.map((watch) => (
            <button
              key={watch.id}
              onClick={() => onSelectWatch(watch)}
              className="card-glow group relative flex flex-col overflow-hidden rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920]/80 to-[#0d1117]/80 text-left backdrop-blur-sm"
            >
              {/* Image area */}
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={watch.image}
                  alt={`${watch.brand} ${watch.model} luxury watch`}
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
                <h3 className="mb-3 font-serif text-lg font-light tracking-tight text-foreground">
                  {watch.model}
                </h3>
                <StarRating rating={watch.rating} />
                <div className="mt-4 flex items-end justify-between border-t border-white/[0.04] pt-4">
                  <span className="font-mono text-sm text-foreground">{watch.price}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:text-[#D4AF37]">
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
