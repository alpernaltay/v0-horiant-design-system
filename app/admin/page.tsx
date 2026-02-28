import { checkAdminStatus } from "@/lib/actions/admin"
import { redirect } from "next/navigation"
import { AdminClient } from "./admin-client"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPage() {
    const isAdmin = await checkAdminStatus()

    if (!isAdmin) {
        redirect("/")
    }

    const supabase = await createClient()
    const { data: recentWatchesRaw } = await supabase
        .from('watches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    const recentWatches = (recentWatchesRaw as any) || []

    return <AdminClient recentWatches={recentWatches} />
}
