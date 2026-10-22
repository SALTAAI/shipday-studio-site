import { TextHero } from "@/components/HomeSections";

/** Legal pages: the homepage hero typography, container and spacing, then a text-focused column. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <TextHero pill="Legal" title={title} body={<>Last updated: {updated}</>} />
      <section className="border-t border-line bg-white py-16 sm:py-20">
        <div className="container-x">
          <div className="prose-legal max-w-3xl [&>*:first-child]:mt-0">{children}</div>
        </div>
      </section>
    </>
  );
}
