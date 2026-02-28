"use server"

import { createClient } from "@/lib/supabase/server"

export async function checkAdminStatus(): Promise<boolean> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return false
        }

        const { data: profileRaw } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .maybeSingle()

        const profile = profileRaw as any

        return !!profile?.is_admin
    } catch (err) {
        return false
    }
}
