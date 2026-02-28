import { getWatches } from "@/lib/actions/watches"
import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export const dynamic = "force-dynamic"

// Basic brand lore placeholder mapping
const brandLore: Record<string, string> = {
    "rolex": "Defining prestige since 1905, Rolex watches are crafted from the finest raw materials and assembled with scrupulous attention to detail.",
    "omega": "Pioneering spirit meets horological excellence. From the depths of the ocean to the surface of the moon.",
    "patek-philippe": "You never actually own a Patek Philippe. You merely look after it for the next generation.",
    "audemars-piguet": "To break the rules, you must first master them. The pioneers of the luxury sports watch category.",
    "a.-lange-&-sohne": "State-of-the-art horology from Glashütte. Never standing still, always striving for perfection.",
    "vacheron-constantin": "The oldest continually operating watch manufacturer in the world, embodying the true spirit of Haute Horlogerie since 1755."
}

export default async function BrandPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    // Clean slug: "patek-philippe" -> "Patek Philippe" for querying/display
    const brandName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    const watches = await getWatches({ brand: brandName })
    const lore = brandLore[slug.toLowerCase()] || `Explore the exquisite craftsmanship and heritage of ${brandName}, a hallmark of luxury horology.`

    return (
        <main className="relative min-h-screen bg-background">
            <TopNav />

            {/* Brand Hero */}
            <section className="relative px-6 pt-32 pb-24 lg:pt-40 lg:pb-32">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F16] via-background to-background" />
                <div className="relative mx-auto max-w-4xl text-center">
                    <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                        Brand Hub
                    </p>
                    <h1 className="mb-8 font-serif text-5xl font-light tracking-tight text-foreground md:text-7xl lg:text-8xl">
                        {brandName}
                    </h1>
                    <div className="gold-line mx-auto mb-8 max-w-xs" />
                    <p className="mx-auto max-w-2xl font-serif text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
                        {lore}
                    </p>
                </div>
            </section>

            {/* Brand Catalog */}
            <section className="relative px-6 pb-24 lg:pb-32">
                <div className="mx-auto max-w-[1440px]">
                    <div className="mb-12 flex items-center justify-between border-b border-white/[0.04] pb-6">
                        <h2 className="font-serif text-2xl text-foreground">The Collection</h2>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                            {watches.length} {watches.length === 1 ? 'Timepiece' : 'Timepieces'}
                        </span>
                    </div>

                    {watches.length === 0 ? (
                        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-lg border border-white/[0.04] bg-white/[0.01] p-8 text-center">
                            <p className="mb-2 font-serif text-xl tracking-wide text-foreground">No {brandName} watches in the vault yet.</p>
                            <p className="text-sm text-muted-foreground">Check back soon for new additions to the encyclopedia.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {watches.map((watch) => (
                                <Link
                                    key={watch.id}
                                    href={`/watch/${watch.id}`}
                                    className="card-glow group relative flex flex-col overflow-hidden rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920]/80 to-[#0d1117]/80 text-left backdrop-blur-sm"
                                >
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="rounded-sm border border-white/[0.06] bg-[#0A0F16]/70 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70 backdrop-blur-sm">
                                            {watch.style}
                                        </span>
                                    </div>

                                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                                        <Image
                                            src={watch.image || "/images/placeholder-watch.png"}
                                            alt={`${watch.brand} ${watch.model}`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/30 to-transparent" />
                                    </div>

                                    <div className="relative flex flex-1 flex-col p-5 pt-4">
                                        <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                                            {watch.brand}
                                        </p>
                                        <h3 className="mb-4 font-serif text-lg font-light tracking-tight text-foreground">
                                            {watch.model}
                                        </h3>
                                        <div className="mt-auto flex items-end justify-between border-t border-white/[0.04] pt-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">
                                                    Year / Reference
                                                </span>
                                                <span className="font-mono text-xs text-foreground/80 truncate max-w-[150px]">
                                                    {watch.year} &middot; {watch.reference}
                                                </span>
                                            </div>
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:text-[#D4AF37]">
                                                <ArrowUpRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}
