"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, Loader2, Eye, EyeOff, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type AuthMode = "sign-in" | "sign-up" | "magic-link"

export default function LoginPage() {
    const router = useRouter()
    const [mode, setMode] = useState<AuthMode>("sign-in")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const supabase = createClient()

        if (mode === "magic-link") {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
            })
            if (error) {
                setMessage({ type: "error", text: error.message })
            } else {
                setMessage({ type: "success", text: "Check your email — a magic link is on its way." })
            }
            setLoading(false)
            return
        }

        if (mode === "sign-up") {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
            })
            if (error) {
                setMessage({ type: "error", text: error.message })
            } else {
                setMessage({ type: "success", text: "Account created! Check your email to confirm." })
            }
            setLoading(false)
            return
        }

        // sign-in
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setMessage({ type: "error", text: error.message })
            setLoading(false)
        } else {
            router.push("/")
            router.refresh()
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-[#0A0F16] px-4">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_40%,rgba(212,175,55,0.04),transparent)]" />
            <div className="noise-overlay pointer-events-none absolute inset-0" />

            <div className="relative z-10 w-full max-w-md">
                {/* Back link */}
                <Link
                    href="/"
                    className="group mb-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                    Back to All Watches
                </Link>

                {/* Logo */}
                <div className="mb-2 text-center">
                    <span className="font-serif text-2xl tracking-[0.3em] text-[#D4AF37]">HORIANT</span>
                </div>
                <p className="mb-10 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {mode === "sign-up" ? "Create Your Account" : mode === "magic-link" ? "Passwordless Entry" : "Welcome Back"}
                </p>

                {/* Auth Card */}
                <div className="card-glow rounded-lg border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="collector@horiant.com"
                                    required
                                    className="w-full rounded-md border border-white/[0.06] bg-white/[0.02] py-3 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground/40 outline-none transition-colors duration-300 focus:border-[#D4AF37]/30"
                                />
                            </div>
                        </div>

                        {/* Password (hidden for magic link) */}
                        {mode !== "magic-link" && (
                            <div>
                                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full rounded-md border border-white/[0.06] bg-white/[0.02] py-3 pr-10 pl-10 text-sm text-foreground placeholder-muted-foreground/40 outline-none transition-colors duration-300 focus:border-[#D4AF37]/30"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[#D4AF37]/40 bg-[#D4AF37]/5 py-3 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-500 hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/10 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {mode === "sign-up" ? "Create Account" : mode === "magic-link" ? "Send Magic Link" : "Sign In"}
                                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                                        {"->"}
                                    </span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Messages */}
                    {message && (
                        <div
                            className={`mt-5 rounded-md border px-4 py-3 text-xs ${message.type === "success"
                                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                                : "border-red-500/20 bg-red-500/5 text-red-400"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/[0.04]" />
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">or</span>
                        <div className="h-px flex-1 bg-white/[0.04]" />
                    </div>

                    {/* Mode toggles */}
                    <div className="flex flex-col gap-2">
                        {mode !== "magic-link" && (
                            <button
                                type="button"
                                onClick={() => setMode("magic-link")}
                                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-white/[0.06] py-2.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-all duration-300 hover:border-white/[0.12] hover:text-foreground"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                Sign in with Magic Link
                            </button>
                        )}
                        {mode === "magic-link" && (
                            <button
                                type="button"
                                onClick={() => setMode("sign-in")}
                                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-white/[0.06] py-2.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-all duration-300 hover:border-white/[0.12] hover:text-foreground"
                            >
                                <Lock className="h-3.5 w-3.5" />
                                Sign in with Password
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer toggle */}
                <p className="mt-8 text-center text-xs text-muted-foreground/60">
                    {mode === "sign-up" ? (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => { setMode("sign-in"); setMessage(null) }}
                                className="text-[#D4AF37]/70 underline underline-offset-2 transition-colors hover:text-[#D4AF37]"
                            >
                                Sign In
                            </button>
                        </>
                    ) : (
                        <>
                            New to Horiant?{" "}
                            <button
                                onClick={() => { setMode("sign-up"); setMessage(null) }}
                                className="text-[#D4AF37]/70 underline underline-offset-2 transition-colors hover:text-[#D4AF37]"
                            >
                                Create Account
                            </button>
                        </>
                    )}
                </p>
            </div>
        </main>
    )
}
