import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const watches = [
  {
    brand: "Patek Philippe",
    model: "Nautilus 5711/1A",
    image: "/images/watch-nautilus.jpg",
    ref: "5711/1A-010",
    movement: "Cal. 26-330 S C",
    price: "$148,500",
  },
  {
    brand: "Audemars Piguet",
    model: 'Royal Oak "Jumbo"',
    image: "/images/watch-royal-oak.jpg",
    ref: "16202ST.OO.1240ST.01",
    movement: "Cal. 7121",
    price: "$72,000",
  },
  {
    brand: "Rolex",
    model: "Submariner Date",
    image: "/images/watch-submariner.jpg",
    ref: "126610LN",
    movement: "Cal. 3235",
    price: "$14,200",
  },
]

function WatchCard({
  brand,
  model,
  image,
  ref: reference,
  movement,
  price,
}: (typeof watches)[0]) {
  return (
    <article className="card-glow group relative flex flex-col overflow-hidden rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117]">
      {/* Image area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={image}
          alt={`${brand} ${model} luxury watch`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
      </div>

      {/* Details */}
      <div className="relative flex flex-1 flex-col justify-between p-6 pt-4 lg:p-8 lg:pt-5">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
            {brand}
          </p>
          <h3 className="mb-4 font-serif text-xl font-light tracking-tight text-foreground lg:text-2xl">
            {model}
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-muted-foreground">Ref.</span>
              <span className="font-mono text-xs text-foreground/70">{reference}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-muted-foreground">Movement</span>
              <span className="font-mono text-xs text-foreground/70">{movement}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-white/[0.04] pt-5">
          <span className="font-mono text-sm text-foreground">{price}</span>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:text-[#D4AF37]"
            aria-label={`View details for ${brand} ${model}`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}

export function TrendingCollections() {
  return (
    <section id="sotc" className="relative px-6 py-24 lg:py-32">
      {/* Top divider */}
      <div className="gold-line mx-auto mb-24 max-w-xs" />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Community
            </p>
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
              <span className="text-balance">Trending Collections</span>
            </h2>
          </div>
          <a
            href="#"
            className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            View All
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Watch Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {watches.map((watch) => (
            <WatchCard key={watch.ref} {...watch} />
          ))}
        </div>
      </div>
    </section>
  )
}
