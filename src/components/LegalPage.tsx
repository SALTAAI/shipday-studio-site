export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="container-x py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
        <div className="prose-legal mt-8">{children}</div>
      </div>
    </div>
  );
}
