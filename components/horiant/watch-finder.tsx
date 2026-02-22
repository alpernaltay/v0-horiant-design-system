import {
  Timer,
  Ruler,
  Anchor,
  Watch,
  Globe,
  Plane,
  ArrowRight,
} from "lucide-react"

const categories = [
  { icon: <Timer className="h-5 w-5" />, label: "Chronograph" },
  { icon: <Anchor className="h-5 w-5" />, label: "Diver" },
  { icon: <Globe className="h-5 w-5" />, label: "GMT" },
  { icon: <Watch className="h-5 w-5" />, label: "Dress" },
  { icon: <Plane className="h-5 w-5" />, label: "Pilot" },
  { icon: <Ruler className="h-5 w-5" />, label: "By Wrist Size" },
]

export function WatchFinder() {
  return (
    <section className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <div className="gold-line mx-auto mb-16 max-w-xs" />

        <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
          Watch Finder
        </p>
        <h2 className="mb-6 font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
          <span className="text-balance">Find Your Perfect Match</span>
        </h2>
        <p className="mx-auto mb-14 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
          Explore by complication, style, or wrist size. Every journey begins with knowing what speaks to you.
        </p>

        {/* Category Icons Grid */}
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4 sm:grid-cols-6">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="group flex flex-col items-center gap-3 rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920]/60 to-[#0d1117]/60 px-3 py-5 transition-all duration-500 hover:border-[#D4AF37]/15 hover:bg-[#D4AF37]/[0.03]"
            >
              <span className="text-muted-foreground/50 transition-colors duration-300 group-hover:text-[#D4AF37]/70">
                {cat.icon}
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button className="group mt-14 inline-flex items-center gap-3 border border-[#D4AF37]/30 px-10 py-4 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-500 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5">
          Explore the Database
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  )
}
