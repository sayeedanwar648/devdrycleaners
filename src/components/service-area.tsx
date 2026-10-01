import { copy } from "@/lib/i18n";
import { SHOP } from "@/lib/catalog";
import { useAppStore } from "@/store/app-store";

export function ServiceArea() {
  const lang = useAppStore((s) => s.lang);
  const t = copy[lang];

  return (
    <section id="area" className="sr-only" aria-hidden="true">
      <div className="rounded-3xl border border-border bg-ivory px-6 py-8 sm:px-10 sm:py-12">
        <h2 className="font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl">
          {t.areaTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-muted">{t.areaLead}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {t.areaPlaces.map((place) => (
            <li
              key={place}
              className="rounded-full border border-border bg-linen px-3 py-1.5 text-sm text-ink"
            >
              {place}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          {t.brand} · {lang === "hi" ? SHOP.areaHi : SHOP.areaEn},{" "}
          {lang === "hi" ? SHOP.cityHi : SHOP.cityEn} · 848101 · +91 {SHOP.phoneDisplay}
        </p>
      </div>
    </section>
  );
}
