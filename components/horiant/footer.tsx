export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        {/* Logo */}
        <span className="font-serif text-lg tracking-[0.3em] text-[#D4AF37]/60">
          HORIANT
        </span>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8">
          {["About", "Database", "Collections", "Journal", "Contact"].map(
            (link) => (
              <a
                key={link}
                href="#"
                className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {link}
              </a>
            )
          )}
        </div>

        {/* Divider */}
        <div className="gold-line w-12" />

        {/* Copyright */}
        <p className="text-[11px] tracking-wider text-muted-foreground/50">
          {"MMXXVI \u00B7 The Art of Time"}
        </p>
      </div>
    </footer>
  )
}
