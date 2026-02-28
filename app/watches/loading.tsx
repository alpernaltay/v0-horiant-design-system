import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"

export default function Loading() {
    return (
        <div className="relative min-h-screen bg-background">
            <TopNav />
            {/* Search Header Skeleton */}
            <div className="border-b border-border bg-[#0A0F16]">
                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <div className="flex animate-pulse flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="flex flex-col gap-4">
                            <div className="h-4 w-32 rounded bg-white/5" />
                            <div className="h-10 w-64 rounded bg-white/5" />
                        </div>
                        <div className="h-12 w-full md:w-64 rounded bg-white/5" />
                    </div>
                </div>
            </div>

            {/* Grid Skeleton */}
            <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_1fr] lg:gap-16 lg:px-10 lg:py-20">
                <aside className="hidden animate-pulse lg:block">
                    <div className="h-[600px] w-full rounded bg-white/5" />
                </aside>

                <div className="animate-pulse">
                    <div className="mb-8 h-6 w-48 rounded bg-white/5" />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-4">
                                <div className="aspect-[4/5] w-full rounded-lg bg-white/5" />
                                <div className="h-5 w-3/4 rounded bg-white/5" />
                                <div className="h-4 w-1/2 rounded bg-white/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
