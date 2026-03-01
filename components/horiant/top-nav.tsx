"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  User,
  X,
  Menu,
  ChevronDown,
  Database,
  MessageSquare,
  Users,
  Anchor,
  Watch,
  Globe,
  Timer,
  Compass,
  Plane,
  Gauge,
  Zap,
  Waves,
  Circle,
  Hexagon,
  Gem,
  LogIn,
  LogOut,
} from "lucide-react"
import {
  watchStyles,
  movementTypes,
  materials,
  brandGroups,
} from "@/lib/mock-watches"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const styleIcons: Record<string, React.ReactNode> = {
  Diver: <Anchor className="h-3.5 w-3.5" />,
  Dress: <Watch className="h-3.5 w-3.5" />,
  GMT: <Globe className="h-3.5 w-3.5" />,
  Chronograph: <Timer className="h-3.5 w-3.5" />,
  Pilot: <Plane className="h-3.5 w-3.5" />,
}

const movementIcons: Record<string, React.ReactNode> = {
  Manual: <Compass className="h-3.5 w-3.5" />,
  Automatic: <Gauge className="h-3.5 w-3.5" />,
  "Spring Drive": <Zap className="h-3.5 w-3.5" />,
  "Hi-Beat": <Waves className="h-3.5 w-3.5" />,
}

const materialIcons: Record<string, React.ReactNode> = {
  Steel: <Hexagon className="h-3.5 w-3.5" />,
  Gold: <Circle className="h-3.5 w-3.5" />,
  Titanium: <Hexagon className="h-3.5 w-3.5" />,
  Ceramic: <Gem className="h-3.5 w-3.5" />,
}

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const } },
}

function getUserInitials(user: SupabaseUser): string {
  const meta = user.user_metadata
  if (meta?.username) return meta.username.slice(0, 2).toUpperCase()
  if (meta?.full_name) {
    const parts = meta.full_name.split(" ")
    return parts.map((p: string) => p[0]).join("").slice(0, 2).toUpperCase()
  }
  return (user.email ?? "U").slice(0, 2).toUpperCase()
}

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Determine active state from pathname
  const isDiscover = pathname === "/"
  const isCollection = pathname === "/collection"

  // Subscribe to Supabase auth state
  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u)
      setAuthLoading(false)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Debounced Search Effect
  useEffect(() => {
    if (!searchOpen || !searchQuery) return
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/watches?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchOpen, router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[#0A0F16]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* 1. Left Links (Desktop) & Hamburger (Mobile) */}
          <div className="flex items-center justify-start flex-1 transition-all duration-300">
            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/"
                className={`text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${isDiscover
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Discover
              </Link>
              <button
                onMouseEnter={() => setMegaMenuOpen(true)}
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                All Watches
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              <Link
                href="/community"
                className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Community
              </Link>
              <Link
                href="/journal"
                className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Journal
              </Link>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen)
                setMegaMenuOpen(false)
              }}
              className="flex min-h-10 min-w-10 items-center text-muted-foreground transition-colors hover:text-foreground md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* 2. Center Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-auto">
            <Link
              href="/"
              onClick={() => { setMegaMenuOpen(false); setMobileMenuOpen(false) }}
            >
              <span className="font-serif text-lg tracking-[0.3em] text-[#D4AF37]">
                HORIANT
              </span>
            </Link>
          </div>

          {/* 3. Right: Search + Auth */}
          <div className="flex items-center justify-end gap-4 shrink-0 min-w-max transition-all duration-300 flex-1 z-10">

            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/watches?q=${encodeURIComponent(searchQuery.trim())}`)
                      setSearchOpen(false)
                      setMegaMenuOpen(false)
                    }
                  }}
                  placeholder="Search brands, references, calibers..."
                  className="w-[100px] sm:w-[160px] md:w-[200px] lg:w-[260px] max-w-[260px] border-b border-[#D4AF37]/30 bg-transparent pb-1 text-xs text-foreground placeholder-muted-foreground/60 outline-none transition-all duration-300 focus:border-[#D4AF37]/60"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="flex min-h-10 min-w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground shrink-0"
                  aria-label="Close search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex min-h-10 min-w-10 items-center justify-center text-muted-foreground transition-colors duration-300 hover:text-foreground"
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
              </button>
            )}

            {/* Auth-aware navigation */}
            {authLoading ? (
              <div className="flex min-h-10 items-center">
                <div className="h-4 w-4 animate-pulse rounded-full bg-white/[0.06]" />
              </div>
            ) : user ? (
              /* ── Authenticated ── */
              <div className="flex items-center gap-3">
                <Link
                  href="/collection"
                  onClick={() => { setMegaMenuOpen(false); setMobileMenuOpen(false) }}
                  className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${isCollection ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                    <span className="text-[9px] font-medium tracking-wider text-[#D4AF37]">
                      {getUserInitials(user)}
                    </span>
                  </div>
                  <span className="hidden lg:inline whitespace-nowrap">My Collection</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex min-h-10 min-w-6 items-center justify-center text-muted-foreground/50 transition-colors duration-300 hover:text-foreground shrink-0"
                  aria-label="Sign out"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              /* ── Not authenticated ── */
              <Link
                href="/login"
                onClick={() => { setMegaMenuOpen(false); setMobileMenuOpen(false) }}
                className="flex min-h-10 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mega Menu */}
      {megaMenuOpen && (
        <div
          className="fixed inset-x-0 top-14 z-40 border-b border-white/[0.04] bg-[#0C1018]/97 backdrop-blur-2xl"
          onMouseLeave={() => setMegaMenuOpen(false)}
        >
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-0 px-6 py-10 md:grid-cols-4 lg:px-10">
            {/* Column 1: By Style */}
            <div className="border-r border-white/[0.04] pr-8">
              <p className="mb-5 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]">
                By Style
              </p>
              <div className="flex flex-col gap-3">
                {watchStyles.map((style) => (
                  <Link
                    key={style}
                    href={`/watches?category=${style}`}
                    onClick={() => setMegaMenuOpen(false)}
                    className="group flex min-h-10 items-center gap-3 text-left text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.04] bg-white/[0.02] text-muted-foreground/50 transition-all duration-300 group-hover:border-[#D4AF37]/20 group-hover:text-[#D4AF37]/70">
                      {styleIcons[style]}
                    </span>
                    {style}
                  </Link>
                ))}
              </div>

              <div className="mt-8 border-t border-white/[0.04] pt-6">
                <Link
                  href="/watches"
                  onClick={() => setMegaMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-colors hover:text-[#D4AF37]/70"
                >
                  View All Watches &rarr;
                </Link>
              </div>
            </div>

            {/* Column 2: By Movement */}
            <div className="border-r border-white/[0.04] px-8">
              <p className="mb-5 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]">
                By Movement
              </p>
              <div className="flex flex-col gap-3">
                {movementTypes.map((type) => (
                  <Link
                    key={type}
                    href={`/watches?movement=${type}`}
                    onClick={() => setMegaMenuOpen(false)}
                    className="group flex min-h-10 items-center gap-3 text-left text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.04] bg-white/[0.02] text-muted-foreground/50 transition-all duration-300 group-hover:border-[#D4AF37]/20 group-hover:text-[#D4AF37]/70">
                      {movementIcons[type]}
                    </span>
                    {type}
                  </Link>
                ))}

                <div className="mt-5 border-t border-white/[0.04] pt-5">
                  <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]">
                    By Material
                  </p>
                  <div className="flex flex-col gap-3">
                    {materials.map((mat) => (
                      <Link
                        key={mat}
                        href={`/watches?material=${mat}`}
                        onClick={() => setMegaMenuOpen(false)}
                        className="group flex min-h-10 items-center gap-3 text-left text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.04] bg-white/[0.02] text-muted-foreground/50 transition-all duration-300 group-hover:border-[#D4AF37]/20 group-hover:text-[#D4AF37]/70">
                          {materialIcons[mat]}
                        </span>
                        {mat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3+4: Top Brands */}
            <div className="col-span-2 pl-8">
              <p className="mb-5 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]">
                Top Brands
              </p>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {Object.entries(brandGroups).map(([group, brands]) => (
                  <div key={group}>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.12em] text-foreground/50">
                      {group}
                    </p>
                    <div className="flex flex-col gap-2.5">
                      {brands.map((brand) => (
                        <Link
                          key={brand}
                          href={`/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setMegaMenuOpen(false)}
                          className="min-h-10 text-left text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-white/[0.04] pt-6">
                <Link
                  href="/brands"
                  onClick={() => setMegaMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] transition-colors hover:text-[#D4AF37]/70"
                >
                  View All Brands &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu — Framer Motion animated */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 top-14 bottom-0 z-40 border-b border-border bg-[#0A0F16]/98 px-6 py-8 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex min-h-12 items-center rounded-lg px-4 text-left text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${isDiscover ? "bg-white/[0.03] text-foreground" : "text-muted-foreground"
                  }`}
              >
                Discover
              </Link>
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="flex min-h-12 items-center gap-2 rounded-lg px-4 text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-all duration-300"
              >
                All Watches
                <ChevronDown className={`h-3 w-3 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
              </button>
              <button className="flex min-h-12 items-center rounded-lg px-4 text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Community
              </button>
              <Link
                href="/collection"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex min-h-12 items-center rounded-lg px-4 text-left text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${isCollection ? "bg-white/[0.03] text-foreground" : "text-muted-foreground"
                  }`}
              >
                My Collection
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
