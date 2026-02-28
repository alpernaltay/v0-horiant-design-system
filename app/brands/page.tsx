import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export const metadata = {
    title: "Brand Directory | Horiant"
}

const prestigeTiers = [
    {
        title: "The Holy Trinity",
        description: "The undeniable pinnacle of Swiss watchmaking heritage and craftsmanship.",
        brands: ["Patek Philippe", "Audemars Piguet", "Vacheron Constantin"]
    },
    {
        title: "Haute Horlogerie",
        description: "Masters of complexity, pushing the boundaries of mechanical art.",
        brands: ["A. Lange & Söhne", "Breguet", "F.P. Journe", "Jaeger-LeCoultre", "Blancpain"]
    },
    {
        title: "Heritage Manufactures",
        description: "The titans of the industry, combining storied history with modern precision.",
        brands: ["Rolex", "Omega", "Cartier", "Grand Seiko", "IWC Schaffhausen", "Zenith", "Breitling"]
    },
    {
        title: "Independent Avant-Garde",
        description: "Visionary creators breaking conventions with radical designs and new age mechanics.",
        brands: ["MB&F", "H. Moser & Cie.", "Ming", "De Bethune", "Urwerk", "Laurent Ferrier"]
    },
    {
        title: "Enthusiast Icons",
        description: "Beloved tool watches and design classics favored by collectors worldwide.",
        brands: ["Tudor", "Nomos", "Oris", "Sinn", "Longines", "Doxa"]
    },
    {
        title: "Accessible Mastery",
        description: "Exceptional value propositions providing entry into true mechanical horology.",
        brands: ["Seiko", "Tissot", "Hamilton", "Casio", "Citizen", "Baltic"]
    }
]

export default function BrandsPage() {
    return (
        <main className="relative min-h-screen bg-background">
            <TopNav />

            {/* Directory Hero */}
            <section className="relative px-6 pt-32 pb-20 lg:pt-40 lg:pb-32">
                <div className="mx-auto max-w-[1440px]">
                    <div className="max-w-3xl">
                        <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                            Encyclopedia
                        </p>
                        <h1 className="mb-8 font-serif text-5xl font-light tracking-tight text-foreground md:text-7xl">
                            The Directory
                        </h1>
                        <p className="font-serif text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
                            From the historic houses of Geneva to the avant-garde independents shaping the future of time. Explore our comprehensive archive of the world's finest watchmakers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tiers Grid */}
            <section className="relative px-6 pb-24 lg:pb-32">
                <div className="mx-auto max-w-[1440px]">
                    <div className="grid grid-cols-1 gap-16 lg:gap-24">
                        {prestigeTiers.map((tier) => (
                            <div key={tier.title} className="group relative">
                                {/* Tier Header */}
                                <div className="mb-10 border-b border-white/[0.04] pb-6 md:mb-12">
                                    <h2 className="mb-3 font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
                                        {tier.title}
                                    </h2>
                                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                        {tier.description}
                                    </p>
                                </div>

                                {/* Brand Grid for this Tier */}
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {tier.brands.map((brand) => {
                                        // Create URL slug: "A. Lange & Söhne" -> "a.-lange-&-sohne"
                                        const slug = brand.toLowerCase().replace(/\s+/g, '-')
                                        return (
                                            <Link
                                                key={brand}
                                                href={`/brand/${slug}`}
                                                className="group/brand flex min-h-[100px] flex-col justify-between overflow-hidden rounded-lg border border-white/[0.04] bg-[#131920]/40 p-5 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/[0.02]"
                                            >
                                                <span className="font-serif text-sm tracking-wide text-foreground/90 transition-colors group-hover/brand:text-foreground">
                                                    {brand}
                                                </span>
                                                <div className="mt-4 flex opacity-0 transition-opacity duration-300 group-hover/brand:opacity-100">
                                                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">
                                                        Explore &rarr;
                                                    </span>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
