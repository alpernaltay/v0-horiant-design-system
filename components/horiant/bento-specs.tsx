import { TrendingUp } from "lucide-react"
import Image from "next/image"

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

export function BentoSpecs() {
  return (
    <section id="specs" className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
            Technical Specifications
          </p>
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
            <span className="text-balance">The Datograph, Deconstructed</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {/* Box 1: Large Image - spans 2 cols, 2 rows */}
          <BentoCard className="flex items-center justify-center lg:col-span-1 lg:row-span-2">
            <div className="relative aspect-square w-full">
              <Image
                src="/images/datograph-hero.jpg"
                alt="A. Lange and Sohne Datograph luxury chronograph watch with rose gold case and white dial"
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
              L951.6
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-xs text-muted-foreground">Power Reserve</span>
                <span className="font-mono text-sm text-foreground">60 Hours</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-xs text-muted-foreground">Frequency</span>
                <span className="font-mono text-sm text-foreground">18,000 vph</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Jewels</span>
                <span className="font-mono text-sm text-foreground">40</span>
              </div>
            </div>
          </BentoCard>

          {/* Box 3: Dimensions */}
          <BentoCard>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Dimensions
            </p>
            <h3 className="mb-6 font-serif text-2xl font-light tracking-tight text-foreground">
              {"41 \u00D7 13.1 mm"}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-xs text-muted-foreground">Case Diameter</span>
                <span className="font-mono text-sm text-foreground">41.0 mm</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
                <span className="text-xs text-muted-foreground">Thickness</span>
                <span className="font-mono text-sm text-foreground">13.1 mm</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Material</span>
                <span className="font-mono text-sm text-foreground">Platinum 950</span>
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
                    $92,000
                  </h3>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">
                      +12.4%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Based on 24 recent transactions
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
      </div>
    </section>
  )
}
