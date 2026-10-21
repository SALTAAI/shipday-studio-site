import { site } from "@/lib/site";

/** Operator and data controller contact for the legal pages: name, country, email. */
export function LegalContact() {
  const l = site.legal;
  return (
    <address className="not-italic">
      <p>
        <strong>{l.operator}</strong>
        <br />
        {l.country}
        <br />
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </address>
  );
}
