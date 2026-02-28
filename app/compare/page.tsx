import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getWatchDetail } from "@/lib/actions/watches"
import { WatchData } from "@/lib/mock-watches"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
    title: "Compare Specifications — HORIANT",
    description: "Compare side-by-side technical specifications of luxury timepieces.",
}

interface ComparePageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
    const params = await searchParams
    const idsParam = params.ids

    if (!idsParam || typeof idsParam !== 'string') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
                <h1 className="mb-4 font-serif text-3xl font-light text-foreground">No Watches Selected</h1>
                <p className="text-muted-foreground mb-8">Select up to 3 watches to compare their technical specifications.</p>
                <Link href="/watches" className="rounded-full bg-[#D4AF37] px-6 py-2.5 text-[11px] uppercase tracking-[0.15em] text-black transition-transform hover:scale-105">
                    Browse Watches
                </Link>
            </div>
        )
    }

    const slugs = idsParam.split(",").slice(0, 3)

    // Parallel fetch using getWatchDetail
    const rawWatches = await Promise.all(slugs.map((slug) => getWatchDetail(slug)))
    const watches = rawWatches.filter((w): w is WatchData => w !== null)

    if (watches.length === 0) {
        notFound()
    }

    // Helper to extract numbers for comparison
    const extractNumber = (val: string | number | undefined | null): number | null => {
        if (typeof val === 'number') return val
        if (!val || val === "---" || val === "N/A") return null
        const parsed = parseFloat(val.replace(/[^0-9.]/g, ''))
        return isNaN(parsed) ? null : parsed
    }

    // Win Logic
    const getWinnerIndices = (
        accessor: (w: WatchData) => string | number | undefined | null,
        mode: 'high' | 'low'
    ) => {
        const values = watches.map(w => extractNumber(accessor(w)))
        const validValues = values.filter((v): v is number => v !== null)
        if (validValues.length <= 1) return [] // No clear winner if 1 or 0 numeric values

        const bestValue = mode === 'high' ? Math.max(...validValues) : Math.min(...validValues)

        return values.map((val, idx) => val === bestValue ? idx : -1).filter(idx => idx !== -1)
    }

    const specRows = [
        { label: "Brand", accessor: (w: WatchData) => w.brand },
        { label: "Movement Type", accessor: (w: WatchData) => w.movement },
        { label: "Caliber", accessor: (w: WatchData) => w.reference },
        {
            label: "Power Reserve",
            accessor: (w: WatchData) => w.powerReserve,
            winners: getWinnerIndices(w => w.powerReserve, 'high')
        },
        {
            label: "Frequency",
            accessor: (w: WatchData) => w.frequency,
            winners: getWinnerIndices(w => w.frequency, 'high')
        },
        {
            label: "Jewels",
            accessor: (w: WatchData) => w.jewels,
            winners: getWinnerIndices(w => w.jewels, 'high')
        },
        {
            label: "Case Size",
            accessor: (w: WatchData) => w.caseDiameter,
        },
        {
            label: "Lug-to-Lug",
            accessor: (w: WatchData) => w.lugToLug,
        },
        {
            label: "Thickness",
            accessor: (w: WatchData) => w.thickness,
            winners: getWinnerIndices(w => w.thickness, 'low')
        },
        {
            label: "Material",
            accessor: (w: WatchData) => w.material,
        },
        {
            label: "Bracelet / Strap",
            accessor: (w: WatchData) => w.bracelet,
        },
        {
            label: "Crystal",
            accessor: (w: WatchData) => w.crystal,
        },
        {
            label: "Water Resistance",
            accessor: (w: WatchData) => w.waterResistance,
            winners: getWinnerIndices(w => w.waterResistance, 'high')
        },
    ]

    return (
        <div className="min-h-screen bg-[#0A0F16] pb-24 pt-32 selection:bg-[#D4AF37]/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link href="/watches" className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors">
                            <ArrowLeft className="h-3 w-3" /> Back to All Watches
                        </Link>
                        <h1 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-5xl">
                            Technical <span className="text-[#D4AF37]">Comparison</span>
                        </h1>
                    </div>
                </div>

                <div className="overflow-x-auto pb-8">
                    <div className="min-w-[800px] border border-white/[0.04] bg-[#131920]/50 rounded-2xl overflow-hidden backdrop-blur-sm">

                        {/* Header: Images & Models */}
                        <div className="grid grid-cols-[200px_1fr] divide-x divide-white/[0.04] border-b border-white/[0.04] bg-[#0d1117]/80">
                            <div className="p-6 flex items-end">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Models</span>
                            </div>
                            <div className={`grid divide-x divide-white/[0.04] ${watches.length === 1 ? 'grid-cols-1' : watches.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                {watches.map((watch) => (
                                    <div key={watch.id} className="flex flex-col items-center justify-between p-6 text-center">
                                        <div className="relative mb-4 aspect-square w-32 overflow-hidden rounded-lg">
                                            <Image
                                                src={watch.image}
                                                alt={watch.model}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">{watch.brand}</p>
                                            <h2 className="font-serif text-sm text-foreground">{watch.model}</h2>
                                        </div>
                                        <Link href={`/watch/${watch.id}`} className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
                                            View Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Specs Rows */}
                        <div className="divide-y divide-white/[0.04]">
                            {specRows.map((row) => (
                                <div key={row.label} className="grid grid-cols-[200px_1fr] divide-x divide-white/[0.04] transition-colors hover:bg-white/[0.01]">
                                    <div className="p-5 flex items-center">
                                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                                            {row.label}
                                        </span>
                                    </div>
                                    <div className={`grid divide-x divide-white/[0.04] ${watches.length === 1 ? 'grid-cols-1' : watches.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                        {watches.map((watch, idx) => {
                                            const isWinner = row.winners?.includes(idx)
                                            let val = row.accessor(watch)
                                            if (row.label === "Caliber") val = watch.movement || "---" // mapping adjustment
                                            if (row.label === "Movement Type") val = watch.complications.join(", ") || "Mechanical" // Adjusting based on mock db lack of strict movement type field

                                            return (
                                                <div
                                                    key={`${watch.id}-${row.label}`}
                                                    className={`relative flex flex-col justify-center p-5 text-center transition-colors duration-500 ${isWinner ? "bg-[#D4AF37]/10" : ""}`}
                                                >
                                                    <span className={`text-sm ${isWinner ? "font-medium text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" : "text-foreground"}`}>
                                                        {val}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
