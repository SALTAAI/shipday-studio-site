import Link from "next/link";
import { LogoMark } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight" aria-label="Shipday Studio home">
          <LogoMark />
          <span className="text-lg">Shipday Studio</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-medium sm:gap-6">
          <Link href="/#how" className="hidden px-2 py-1 hover:text-accent md:inline">How it works</Link>
          <Link href="/#offers" className="hidden px-2 py-1 hover:text-accent sm:inline">Pricing</Link>
          <Link href="/#work" className="hidden px-2 py-1 hover:text-accent sm:inline">Work</Link>
          <Link href="/#faq" className="hidden px-2 py-1 hover:text-accent sm:inline">FAQ</Link>
          <Link href="/order/" className="btn-primary whitespace-nowrap px-5 py-2 text-sm">Order now</Link>
        </nav>
      </div>
    </header>
  );
}
