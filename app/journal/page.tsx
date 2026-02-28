import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Clock, User } from "lucide-react"

export const metadata = {
    title: "Journal | Horiant Editorial"
}

// Mock Editorial Content
const featuredArticle = {
    id: "evolution-of-moonwatch",
    title: "The Evolution of the Moonwatch",
    subtitle: "From Gemini to Artemis: How Omega's Speedmaster Professional secured its place in the cosmos and on the wrists of collectors worldwide.",
    category: "Historical Archive",
    author: "Alexander Black",
    readTime: "12 min read",
    date: "October 14, 2024",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2000&auto=format&fit=crop"
}

const recentArticles = [
    {
        id: "state-of-independents",
        title: "The State of Independents",
        subtitle: "Why brands like F.P. Journe and MB&F are outperforming traditional houses at auction.",
        category: "Market Analysis",
        author: "Elena M.",
        date: "October 10, 2024",
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "inside-geneva",
        title: "Inside Geneva: Watches and Wonders 2024",
        subtitle: "Our comprehensive guide to the biggest releases, surprises, and trends from the year's premier horology event.",
        category: "Event Coverage",
        author: "James Smith",
        date: "April 15, 2024",
        image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "anatomy-of-a-diver",
        title: "Anatomy of a True Diver",
        subtitle: "What makes a dive watch ISO 6425 compliant? We break down the engineering behind the sub-aquatic tool watch.",
        category: "Technical Guide",
        author: "Michael Chang",
        date: "September 28, 2024",
        image: "https://images.unsplash.com/photo-1639006570490-79c0c53f1080?q=80&w=800&auto=format&fit=crop"
    }
]

export default function JournalPage() {
    return (
        <main className="relative min-h-screen bg-background">
            <TopNav />

            {/* Featured Article Hero */}
            <section className="relative min-h-[90vh] w-full pt-14">
                {/* Full Bleed Image */}
                <div className="absolute inset-0">
                    <Image
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F16]/60 via-[#0A0F16]/40 to-[#0A0F16]" />
                </div>

                {/* Hero Content */}
                <div className="relative mx-auto flex min-h-[calc(90vh-3.5rem)] max-w-[1440px] flex-col justify-end px-6 pb-24 lg:pb-32">
                    <div className="max-w-4xl">
                        <div className="mb-6 flex items-center gap-4">
                            <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] backdrop-blur-md">
                                {featuredArticle.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                                <Clock className="h-3.5 w-3.5" />
                                {featuredArticle.readTime}
                            </span>
                        </div>

                        <h1 className="mb-6 font-serif text-4xl font-light tracking-tight text-white md:text-6xl lg:text-7xl">
                            {featuredArticle.title}
                        </h1>

                        <p className="mb-10 max-w-2xl font-serif text-lg font-light leading-relaxed text-slate-300 md:text-xl">
                            {featuredArticle.subtitle}
                        </p>

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                                    <User className="h-4 w-4 text-slate-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{featuredArticle.author}</p>
                                    <p className="text-xs text-muted-foreground">{featuredArticle.date}</p>
                                </div>
                            </div>

                            <Link
                                href="/journal" // Mock
                                className="group flex max-w-fit items-center gap-3 border border-[#D4AF37]/40 px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37]/10"
                            >
                                Read Article
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Editorials Grid */}
            <section className="relative px-6 py-24 lg:py-32">
                <div className="mx-auto max-w-[1440px]">
                    <div className="mb-12 border-b border-white/[0.04] pb-6">
                        <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
                            The Latest
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">Expert analysis, historical deep-dives, and market commentary.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {recentArticles.map((article, index) => (
                            <Link
                                key={article.id}
                                href="/journal" // Mock route
                                className="group flex flex-col gap-6"
                            >
                                {/* Article Image Image */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/[0.04]">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={index < 2}
                                    />
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="rounded-sm bg-black/60 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] backdrop-blur-md">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Article Info */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                                        <span>{article.date}</span>
                                        <span className="h-1 w-1 rounded-full bg-white/20" />
                                        <span>By {article.author}</span>
                                    </div>

                                    <h3 className="font-serif text-xl tracking-wide text-foreground transition-colors group-hover:text-[#D4AF37]">
                                        {article.title}
                                    </h3>

                                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                        {article.subtitle}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
