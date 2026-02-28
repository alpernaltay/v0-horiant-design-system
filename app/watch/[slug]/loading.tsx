import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"

export default function Loading() {
    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <TopNav />
            <main className="mx-auto max-w-[1440px] px-4 pt-24 pb-20 sm:px-6 lg:px-10 lg:pt-32">
                <div className="flex animate-pulse flex-col lg:flex-row lg:gap-12 xl:gap-20">
                    {/* Main Visual Col (Left) */}
                    <div className="w-full lg:w-[60%] flex flex-col gap-6">
                        <div className="h-4 w-32 rounded bg-white/5" />
                        <div className="h-10 w-96 rounded bg-white/5" />
                        <div className="h-6 w-48 rounded bg-white/5" />

                        {/* Main Hero Image Skeleton */}
                        <div className="mt-8 aspect-[4/5] w-full rounded-lg bg-white/5 sm:aspect-[16/9] lg:aspect-auto lg:h-[700px] xl:h-[800px]" />
                    </div>

                    {/* Bento Grid Col (Right) */}
                    <div className="mt-12 w-full lg:mt-0 lg:w-[40%] flex flex-col gap-4 sm:gap-5">
                        {/* Price/Market Skeleton */}
                        <div className="h-24 w-full rounded-lg border border-white/5 bg-white/5" />

                        {/* General Specs Skeleton */}
                        <div className="h-64 w-full rounded-lg border border-white/5 bg-white/5" />

                        {/* Material Skeleton */}
                        <div className="h-48 w-full rounded-lg border border-white/5 bg-white/5" />

                        {/* Movement Skeleton */}
                        <div className="h-48 w-full rounded-lg border border-white/5 bg-white/5" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
