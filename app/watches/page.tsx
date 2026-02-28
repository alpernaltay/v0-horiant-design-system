import { getWatches } from "@/lib/actions/watches"
import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import { CatalogClient } from "./catalog-client"

export const dynamic = "force-dynamic"

export default async function WatchesPage({
    searchParams,
}: {
    searchParams?: any
}) {
    const resolvedParams = await searchParams
    const category = typeof resolvedParams?.category === "string" ? resolvedParams.category : undefined
    const brand = typeof resolvedParams?.brand === "string" ? resolvedParams.brand : undefined
    const movement = typeof resolvedParams?.movement === "string" ? resolvedParams.movement : undefined
    const material = typeof resolvedParams?.material === "string" ? resolvedParams.material : undefined
    const q = typeof resolvedParams?.q === "string" ? resolvedParams.q : undefined
    const sort = typeof resolvedParams?.sort === "string" ? resolvedParams.sort : undefined

    // Fetch based on URL params
    const watches = await getWatches({ category, brand, movement, material, query: q, sort: sort })

    return (
        <main className="relative min-h-screen bg-background">
            <TopNav />

            {/* 
        We pass the watches and the current params down to a Client Component
        so it can handle the sidebar interactivity (mobile slide-out, active states) 
      */}
            <CatalogClient
                watches={watches}
                activeFilters={{ category, brand, movement, material, q, sort }}
            />

            <Footer />
        </main>
    )
}
