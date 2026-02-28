import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"

export default function Loading() {
    return (
        <div className="relative min-h-screen bg-background">
            <TopNav />
            <section className="relative min-h-screen px-4 pt-24 pb-20 sm:px-6 lg:pt-32 lg:pb-24">
                <div className="mx-auto max-w-6xl animate-pulse">
                    {/* Header Skeleton */}
                    <div className="mb-16 sm:mb-20">
                        <div className="mb-4 h-3 w-32 rounded bg-white/5" />
                        <div className="mb-4 h-12 w-96 rounded bg-white/5" />
                        <div className="h-4 w-48 rounded bg-white/5" />
                    </div>

                    {/* Stats Row Skeleton */}
                    <div className="mb-16 grid grid-cols-1 gap-3 sm:mb-20 sm:grid-cols-3 sm:gap-4">
                        <div className="h-32 rounded-lg border border-white/5 bg-white/5 p-6" />
                        <div className="h-32 rounded-lg border border-white/5 bg-white/5 p-6" />
                        <div className="h-32 rounded-lg border border-white/5 bg-white/5 p-6" />
                    </div>

                    {/* Tabs Skeleton */}
                    <div className="mb-12 flex h-12 items-center gap-8 border-b border-white/5 sm:mb-16">
                        <div className="h-4 w-24 rounded bg-white/5" />
                        <div className="h-4 w-24 rounded bg-white/5" />
                    </div>

                    {/* Grid Details Skeleton */}
                    <div className="mb-12 sm:mb-16">
                        <div className="mb-4 h-3 w-24 rounded bg-white/5" />
                        <div className="h-10 w-64 rounded bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-4">
                                <div className="aspect-[4/5] w-full rounded-lg bg-white/5" />
                                <div className="h-5 w-3/4 rounded bg-white/5" />
                                <div className="h-4 w-1/2 rounded bg-white/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
