"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { AuthGateModal } from "@/components/horiant/auth-gate-modal"

interface AuthGateContextValue {
    /** Returns `true` if user IS authenticated and action can proceed.
     *  Returns `false` if user is NOT authenticated (modal will open). */
    checkAuth: () => boolean
    currentUserId: string | undefined
}

const AuthGateContext = createContext<AuthGateContextValue>({
    checkAuth: () => false,
    currentUserId: undefined,
})

export const useAuthGate = () => useContext(AuthGateContext)

interface AuthGateProviderProps {
    currentUserId: string | undefined
    children: ReactNode
}

export function AuthGateProvider({ currentUserId, children }: AuthGateProviderProps) {
    const [showModal, setShowModal] = useState(false)

    const checkAuth = useCallback(() => {
        if (currentUserId) return true
        setShowModal(true)
        return false
    }, [currentUserId])

    return (
        <AuthGateContext.Provider value={{ checkAuth, currentUserId }}>
            {children}
            <AuthGateModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </AuthGateContext.Provider>
    )
}
