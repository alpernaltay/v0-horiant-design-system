"use client"

import { useState } from "react"
import { Search, User, X, Menu } from "lucide-react"

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[#0A0F16]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Left Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#discover"
            className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Discover
          </a>
          <a
            href="#sotc"
            className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            SOTC
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Center Logo */}
        <a href="#" className="absolute left-1/2 -translate-x-1/2">
          <span className="font-serif text-xl tracking-[0.25em] text-[#D4AF37]">
            HORIANT
          </span>
        </a>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {searchOpen ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search timepieces..."
                className="w-40 border-b border-[#D4AF37]/30 bg-transparent pb-1 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-300 focus:border-[#D4AF37]/60 lg:w-64"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
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
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
            aria-label="Profile"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-[#0A0F16]/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#discover"
              className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Discover
            </a>
            <a
              href="#sotc"
              className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              SOTC
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
