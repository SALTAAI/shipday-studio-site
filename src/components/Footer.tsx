import Link from "next/link";
import { site } from "@/lib/site";
import { LogoMark } from "./Logo";
import { services } from "@/lib/services";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-extrabold"><LogoMark className="h-7 w-7" /> {site.name}</div>
          <p className="mt-3 max-w-xs text-sm text-muted">Fixed-price design for businesses, creators and brands. Remote, working with clients worldwide.</p>
        </div>
        <div className="text-sm">
          <h2 className="font-semibold">Contact</h2>
          <ul className="mt-2 space-y-1">
            <li><a href={`mailto:${site.email}`} className="text-muted hover:text-accent">{site.email}</a></li>
            <li>
              <a href={site.x.url} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-1.5 text-muted hover:text-accent">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                {site.x.handle}<span className="sr-only"> on X</span>
              </a>
            </li>
            <li><Link href="/order/" className="text-muted hover:text-accent">Order</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <h2 className="font-semibold">Services</h2>
          <ul className="mt-2 space-y-1">
            {services.map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}/`} className="text-muted hover:text-accent">{s.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <h2 className="font-semibold">Legal</h2>
          <ul className="mt-2 space-y-1">
            <li><Link href="/terms/" className="text-muted hover:text-accent">Terms of Service</Link></li>
            <li><Link href="/privacy/" className="text-muted hover:text-accent">Privacy Policy</Link></li>
            <li><Link href="/imprint/" className="text-muted hover:text-accent">Imprint</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-x border-t border-line py-6 text-xs text-muted">
        © {new Date().getFullYear()} {site.name} · Remote, working with clients worldwide · Prices in USD · Sample work shows fictional brands · <Link href="/imprint/" className="underline hover:text-accent">Legal details</Link>
      </div>
    </footer>
  );
}
