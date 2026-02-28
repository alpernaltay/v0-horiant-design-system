"use client"

import React from "react"
import { Ruler } from "lucide-react"
import { cn } from "@/lib/utils"

interface WristFitVisualizerProps {
    lugToLugMs: number // mm
    wristCircumference: number // cm
    className?: string
}

export function WristFitVisualizer({ lugToLugMs, wristCircumference, className }: WristFitVisualizerProps) {
    // Formula: FitRatio = WatchLugToLug / (UserWristCircumference / 3)
    // Assuming WatchLugToLug is in mm and WristCircumference is in cm.
    // Wait, wrist circumference in cm. E.g., 17cm = 170mm.
    // Formula given: FitRatio = WatchLugToLug / (UserWristCircumference * 10 / 3)
    // Re-evaluating formula exactly as requested: UserWristCircumference / 3.
    const wristInMm = wristCircumference * 10
    const flatWristWidth = wristInMm / 3
    const ratio = lugToLugMs / flatWristWidth

    // If Ratio < 0.85 (Perfect), < 0.95 (Good), > 1.0 (Too Big)
    let fitStatus = "Too Big"
    let colorClass = "from-red-500/40 to-red-500/10 text-red-400 border-red-500/20"
    let iconColor = "text-red-400"

    if (ratio < 0.85) {
        fitStatus = "Perfect fit"
        colorClass = "from-emerald-500/40 to-emerald-500/10 text-emerald-400 border-emerald-500/20"
        iconColor = "text-emerald-400"
    } else if (ratio < 0.95) {
        fitStatus = "Good fit"
        colorClass = "from-amber-500/40 to-amber-500/10 text-amber-400 border-amber-500/20"
        iconColor = "text-amber-400"
    } else if (ratio <= 1.0) {
        fitStatus = "Borderline"
        colorClass = "from-red-500/40 to-red-500/10 text-red-400 border-red-500/20"
        iconColor = "text-red-400"
    }

    // Calculate percentage for the bar indicator (clamp between 0-100)
    // Let 0.6 be 0%, 0.85 be 50%, 1.1 be 100%
    const minRatio = 0.6
    const maxRatio = 1.1
    const percentage = Math.max(0, Math.min(100, ((ratio - minRatio) / (maxRatio - minRatio)) * 100))

    return (
        <div className={cn("flex flex-col gap-3 rounded-md border border-white/[0.04] bg-[#0A0F16]/50 p-4", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Ruler className={cn("h-4 w-4 shrink-0", iconColor)} />
                    <span className="text-sm font-medium text-foreground">Wrist Match</span>
                </div>
                <span className={cn("text-xs tracking-wide rounded px-2 py-0.5 border bg-gradient-to-r", colorClass)}>
                    {fitStatus}
                </span>
            </div>

            <div className="text-[10px] text-muted-foreground uppercase tracking-widest flex justify-between mb-1">
                <span>Ideal</span>
                <span>Too Big</span>
            </div>

            <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 opacity-60">
                <div
                    className="absolute top-1/2 h-4 w-1 -translate-y-1/2 -mt-[0.5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{ left: `${percentage}%` }}
                />
            </div>
            <div className="mt-1 flex justify-between text-[9px] text-muted-foreground/60 w-full relative">
                <span className="absolute left-1/2 -translate-x-1/2 top-0 mt-0.5 tabular-nums">{lugToLugMs}mm / {wristCircumference}cm wrist</span>
            </div>
        </div>
    )
}
