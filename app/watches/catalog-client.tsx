"use client"

import Link from "next/link"
import { SafeImage } from "@/components/horiant/safe-image"
import { CompareButton } from "@/components/horiant/compare-button"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Filter, X, Check, ChevronDown } from "lucide-react"
import { useState } from "react"
import type { WatchData } from "@/lib/mock-watches"
import { watchStyles, movementTypes, materials, brandGroups } from "@/lib/mock-watches"

interface CatalogClientProps {
    watches: WatchData[]
    activeFilters: {
        category?: string
        brand?: string
        movement?: string
        material?: string
        q?: string
        sort?: string
    }
}

export function CatalogClient({ watches, activeFilters }: CatalogClientProps) {
    const router = useRouter()
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    // Local state for the custom sort dropdown
    const [isSortOpen, setIsSortOpen] = useState(false)

    // Determine if ANY filter is active
    const hasActiveFilters = Object.values(activeFilters).some(v => v !== undefined)

    // Construct the Page Title
    let title = "The Encyclopedia"
    if (activeFilters.q) title = `Search: "${activeFilters.q}"`
    else if (activeFilters.category) title = `${activeFilters.category} Timepieces`
    else if (activeFilters.brand) title = `${activeFilters.brand} Timepieces`
    else if (activeFilters.movement) title = `${activeFilters.movement} Watches`

    // Helper to build a new URL query string toggling a specific filter
    const getFilterUrl = (key: string, value: string) => {
        const params = new URLSearchParams()

        // Copy existing params except the one we are toggling
        Object.entries(activeFilters).forEach(([k, v]) => {
            if (v && k !== key) {
                params.set(k, v)
            }
        })

        // If it's the sort key, always set it (don't toggle off). Otherwise, toggle.
        if (key === 'sort') {
            params.set(key, value)
        } else if (activeFilters[key as keyof typeof activeFilters] !== value) {
            params.set(key, value)
        }

        const queryStr = params.toString()
        return queryStr ? `/watches?${queryStr}` : '/watches'
    }

    const FilterSection = () => (
        <div className="flex flex-col gap-10">
            {/* Categories */}
            <div>
                <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Categories</p>
                <div className="flex flex-col gap-2.5">
                    {watchStyles.map(style => {
                        const isActive = activeFilters.category === style
                        return (
                            <Link
                                key={style}
                                href={getFilterUrl('category', style)}
                                onClick={() => setMobileFiltersOpen(false)}
                                className={`flex items-center justify-between text-sm transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {style}
                                {isActive && <Check className="h-3 w-3 text-[#D4AF37]" />}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Movements */}
            <div>
                <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Movements</p>
                <div className="flex flex-col gap-2.5">
                    {movementTypes.map(mov => {
                        const isActive = activeFilters.movement === mov
                        return (
                            <Link
                                key={mov}
                                href={getFilterUrl('movement', mov)}
                                onClick={() => setMobileFiltersOpen(false)}
                                className={`flex items-center justify-between text-sm transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {mov}
                                {isActive && <Check className="h-3 w-3 text-[#D4AF37]" />}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Materials */}
            <div>
                <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Materials</p>
                <div className="flex flex-col gap-2.5">
                    {materials.map(mat => {
                        const isActive = activeFilters.material === mat
                        return (
                            <Link
                                key={mat}
                                href={getFilterUrl('material', mat)}
                                onClick={() => setMobileFiltersOpen(false)}
                                className={`flex items-center justify-between text-sm transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {mat}
                                {isActive && <Check className="h-3 w-3 text-[#D4AF37]" />}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )

    return (
        <div className="relative min-h-screen px-4 pt-24 pb-20 sm:px-6 lg:pt-32 lg:pb-24">
            <div className="mx-auto max-w-[1440px]">
                {/* Header Area */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-white/[0.04] pb-8 md:flex-row md:items-end">
                    <div>
                        <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                            Verified Timepieces
                        </p>
                        <h1 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
                            {title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 hidden sm:inline-block">
                            {watches.length} {watches.length === 1 ? 'Result' : 'Results'}
                        </span>

                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0A0F16] px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:bg-white/[0.04] focus:border-[#D4AF37]/50"
                            >
                                Sort: {
                                    activeFilters.sort === 'price_asc' ? 'Low to High' :
                                        activeFilters.sort === 'price_desc' ? 'High to Low' :
                                            activeFilters.sort === 'year_newest' ? 'Year: Newest' :
                                                activeFilters.sort === 'rating' ? 'Highest Rated' : 'Newest'
                                }
                                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isSortOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                                    <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-white/[0.06] bg-[#0A0F16]/95 pt-2 pb-2 backdrop-blur-xl shadow-2xl">
                                        {[
                                            { value: 'newest', label: 'Newest Arrivals' },
                                            { value: 'price_asc', label: 'Price: Low to High' },
                                            { value: 'price_desc', label: 'Price: High to Low' },
                                            { value: 'year_newest', label: 'Year: Newest' },
                                            { value: 'rating', label: 'Highest Rated' }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    router.push(getFilterUrl('sort', option.value))
                                                    setIsSortOpen(false)
                                                }}
                                                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[11px] uppercase tracking-[0.15em] transition-colors ${(activeFilters.sort || 'newest') === option.value
                                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                                    : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground'
                                                    }`}
                                            >
                                                {option.label}
                                                {(activeFilters.sort || 'newest') === option.value && (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {hasActiveFilters && (
                            <Link
                                href="/watches"
                                className="hidden sm:inline-block rounded-full border border-white/[0.08] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
                            >
                                Clear All
                            </Link>
                        )}
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground transition-all hover:bg-white/[0.04] lg:hidden"
                        >
                            <Filter className="h-3 w-3" /> Filters
                        </button>
                    </div>
                </div>

                {/* Layout Grid: Sidebar + Main Content */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-16 xl:grid-cols-5">

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:col-span-1 lg:block xl:col-span-1">
                        <div className="sticky top-24">
                            <FilterSection />
                        </div>
                    </div>

                    {/* Main Grid Content */}
                    <div className="lg:col-span-3 xl:col-span-4">
                        {watches.length === 0 ? (
                            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-white/[0.04] bg-white/[0.01] p-8 text-center">
                                <p className="mb-2 font-serif text-xl tracking-wide text-foreground">No matches found.</p>
                                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
                                <Link href="/watches" className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] hover:underline">
                                    Clear Filters
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {watches.map((watch) => (
                                    <Link
                                        key={watch.id}
                                        href={`/watch/${watch.id}`}
                                        onClick={() => console.log("NAV_DEBUG: Clicking watch", watch)}
                                        className="cursor-pointer card-glow group relative flex flex-col overflow-hidden rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920]/80 to-[#0d1117]/80 text-left backdrop-blur-sm"
                                    >
                                        <CompareButton watch={{
                                            id: watch.id,
                                            slug: (watch as any).slug || watch.id,
                                            brand: watch.brand,
                                            model: watch.model,
                                            image: watch.image || null
                                        }} />

                                        <div className="absolute top-3 left-3 z-10">
                                            <span className="rounded-sm border border-white/[0.06] bg-[#0A0F16]/70 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70 backdrop-blur-sm">
                                                {watch.style}
                                            </span>
                                        </div>

                                        <div className="relative aspect-square w-full overflow-hidden">
                                            <SafeImage
                                                brandName={watch.brand}
                                                src={watch.image || "/images/placeholder-watch.png"}
                                                alt={`${watch.brand} ${watch.model}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/30 to-transparent" />
                                        </div>

                                        <div className="relative flex flex-1 flex-col p-4 pt-4">
                                            <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                                                {watch.brand}
                                            </p>
                                            <h3 className="mb-2 font-serif text-base font-light tracking-tight text-foreground truncate">
                                                {watch.model}
                                            </h3>
                                            <div className="mt-auto flex items-end justify-between border-t border-white/[0.04] pt-3">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">
                                                        Reference
                                                    </span>
                                                    <span className="font-mono text-xs text-foreground/80 truncate max-w-[120px]">
                                                        {watch.reference}
                                                    </span>
                                                </div>
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:text-[#D4AF37]">
                                                    <ArrowUpRight className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Slide-out */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
                    <div className="absolute top-0 bottom-0 right-0 w-4/5 max-w-sm border-l border-white/[0.04] bg-[#0A0F16] p-6 shadow-2xl overflow-y-auto">
                        <div className="mb-8 flex items-center justify-between">
                            <span className="font-serif text-lg text-foreground">Filters</span>
                            <button onClick={() => setMobileFiltersOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <FilterSection />
                    </div>
                </div>
            )}
        </div>
    )
}
