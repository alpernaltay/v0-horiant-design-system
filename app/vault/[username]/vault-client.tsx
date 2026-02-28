"use client"

import { SOTCProfile } from "@/components/horiant/sotc-profile"
import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import { AuthGateProvider } from "@/context/auth-gate-context"

export function VaultClient(props: any) {
    return (
        <AuthGateProvider currentUserId={props.currentUserId}>
            <main className="relative min-h-screen bg-background">
                <TopNav />
                <SOTCProfile {...props} />
                <Footer />
            </main>
        </AuthGateProvider>
    )
}
