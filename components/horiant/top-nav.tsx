"use client"

import { useState } from "react"
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
} from "lucide-react"
import {
  watchStyles,
  movementTypes,
  materials,
  brandGroups,
  databaseStats,
} from "@/lib/mock-watches"

type View = "discover" | "watchDetail" | "sotcProfile"

interface TopNavProps {
  activeView: View
  onNavigate: (view: View) => void
}

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

export function TopNav({ activeView, onNavigate }: TopNavProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[#0A0F16]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 lg:px-10">
          {/* Left Links */}
          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => onNavigate("discover")}
              className={`text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                activeView === "discover"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Discover
            </button>
            <button
              onMouseEnter={() => setMegaMenuOpen(true)}
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Watches
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            <button className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground">
              Community
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
              setMegaMenuOpen(false)
            }}
            className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Center Logo */}
          <button
            onClick={() => {
              onNavigate("discover")
              setMegaMenuOpen(false)
            }}
            className="absolute left-1/2 -translate-x-1/2"
          >
            <span className="font-serif text-lg tracking-[0.3em] text-[#D4AF37]">
              HORIANT
            </span>
          </button>

          {/* Right: Stats + Search + SOTC */}
          <div className="flex items-center gap-5">
            {/* Live Stats Widget (desktop) */}
            <div className="hidden items-center gap-4 border-r border-white/[0.06] pr-5 xl:flex">
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Database className="h-3 w-3 text-[#D4AF37]/60" />
                {databaseStats.watches}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <MessageSquare className="h-3 w-3 text-[#D4AF37]/60" />
                {databaseStats.reviews}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Users className="h-3 w-3 text-emerald-400/60" />
                <span className="text-emerald-400/80">{databaseStats.online}</span>
              </span>
            </div>

            {searchOpen ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search references, calibers..."
                  className="w-40 border-b border-[#D4AF37]/30 bg-transparent pb-1 text-xs text-foreground placeholder-muted-foreground/60 outline-none transition-all duration-300 focus:border-[#D4AF37]/60 lg:w-56"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Close search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => {
                onNavigate("sotcProfile")
                setMegaMenuOpen(false)
              }}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                activeView === "sotcProfile"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">My SOTC</span>
            </button>
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
                  <button
                    key={style}
                    className="group flex items-center gap-3 text-left text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.04] bg-white/[0.02] text-muted-foreground/50 transition-all duration-300 group-hover:border-[#D4AF37]/20 group-hover:text-[#D4AF37]/70">
                      {styleIcons[style]}
                    </span>
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: By Movement */}
            <div className="border-r border-white/[0.04] px-8">
              <p className="mb-5 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]">
                By Movement
              </p>
              <div className="flex flex-col gap-3">
                {movementTypes.map((type) => (
                  <button
                    key={type}
                    className="group flex items-center gap-3 text-left text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.04] bg-white/[0.02] text-muted-foreground/50 transition-all duration-300 group-hover:border-[#D4AF37]/20 group-hover:text-[#D4AF37]/70">
                      {movementIcons[type]}
                    </span>
                    {type}
                  </button>
                ))}

              <div className="mt-5 border-t border-white/[0.04] pt-5">
                <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]">
                  By Material
                </p>
                <div className="flex flex-col gap-3">
                  {materials.map((mat) => (
                    <button
                      key={mat}
                      className="group flex items-center gap-3 text-left text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.04] bg-white/[0.02] text-muted-foreground/50 transition-all duration-300 group-hover:border-[#D4AF37]/20 group-hover:text-[#D4AF37]/70">
                        {materialIcons[mat]}
                      </span>
                      {mat}
                    </button>
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
                        <button
                          key={brand}
                          className="text-left text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats bar in mega-menu (mobile only) */}
              <div className="mt-8 flex items-center gap-6 border-t border-white/[0.04] pt-6 xl:hidden">
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Database className="h-3 w-3 text-[#D4AF37]/60" />
                  {databaseStats.watches} Watches
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <MessageSquare className="h-3 w-3 text-[#D4AF37]/60" />
                  {databaseStats.reviews} Reviews
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3 text-emerald-400/60" />
                  <span className="text-emerald-400/80">{databaseStats.online} Online</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-40 border-b border-border bg-[#0A0F16]/98 px-6 py-6 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { onNavigate("discover"); setMobileMenuOpen(false) }}
              className={`text-left text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                activeView === "discover" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className="flex items-center gap-2 text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300"
            >
              Watches
              <ChevronDown className={`h-3 w-3 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
            </button>
            <button className="text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              Community
            </button>
            <button
              onClick={() => { onNavigate("sotcProfile"); setMobileMenuOpen(false) }}
              className={`text-left text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                activeView === "sotcProfile" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              My SOTC
            </button>
          </div>
        </div>
      )}
    </>
  )
}
