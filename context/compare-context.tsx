"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CompareWatch {
    id: string;
    slug?: string;
    brand: string;
    model: string;
    image: string | null;
}

interface CompareContextType {
    compareList: CompareWatch[];
    addToCompare: (watch: CompareWatch) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    isHydrated: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: ReactNode }) {
    const [compareList, setCompareList] = useState<CompareWatch[]>([])
    const [isHydrated, setIsHydrated] = useState(false)

    // Hydrate from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem("horiant_compare_list")
            if (stored) {
                setCompareList(JSON.parse(stored))
            }
        } catch (e) {
            console.error("Failed to parse compare list", e)
        }
        setIsHydrated(true)
    }, [])

    // Sync to localStorage
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem("horiant_compare_list", JSON.stringify(compareList))
        }
    }, [compareList, isHydrated])

    const addToCompare = (watch: CompareWatch) => {
        setCompareList((prev) => {
            // Avoid duplicates
            if (prev.some((w) => w.id === watch.id)) return prev;

            // Enforce Max 3 limit by pushing out the oldest entry
            if (prev.length >= 3) {
                return [...prev.slice(1), watch];
            }
            return [...prev, watch];
        })
    }

    const removeFromCompare = (id: string) => {
        setCompareList((prev) => prev.filter((w) => w.id !== id))
    }

    const clearCompare = () => {
        setCompareList([])
    }

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isHydrated }}>
            {children}
        </CompareContext.Provider>
    )
}

export function useCompare() {
    const context = useContext(CompareContext)
    if (context === undefined) {
        throw new Error("useCompare must be used within a CompareProvider")
    }
    return context
}
