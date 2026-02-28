"use client"

import { useState } from "react"
import NextImage, { ImageProps } from "next/image"

interface SafeImageProps extends ImageProps {
    brandName?: string
}

export function SafeImage({ brandName, src, alt, className, ...props }: SafeImageProps) {
    const [error, setError] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    if (error || !src) {
        return (
            <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1c222b] to-[#0a0f16] ${className || ""}`}>
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
                <span className="relative z-10 px-4 text-center font-serif text-sm font-light tracking-widest text-muted-foreground/50">
                    {brandName || "IMAGE UNAVAILABLE"}
                </span>
            </div>
        )
    }

    return (
        <NextImage
            src={src}
            alt={alt}
            className={`transition-opacity duration-500 ease-in ${isLoaded ? "opacity-100" : "opacity-0"} ${className || ""}`}
            onError={() => setError(true)}
            onLoad={() => setIsLoaded(true)}
            {...props}
        />
    )
}
