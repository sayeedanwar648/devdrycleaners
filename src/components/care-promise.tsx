import { Check } from "lucide-react";
import { copy } from "@/lib/i18n";
import { useAppStore } from "@/store/app-store";

export function CarePromise() {
  const lang = useAppStore((s) => s.lang);
  const t = copy[lang];
  const points = [t.care1, t.care2, t.care3, t.care4];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-border bg-ivory lg:grid-cols-2 lg:gap-0">
        <figure className="order-2 lg:order-1">
          <img
            src="/care-linen.jpg"
            alt={
              lang === "hi"
                ? "तह किए हुए कपड़े और गुलाब — नर्म देखभाल"
                : "Folded garments and dried roses, a still life of gentle care"
            }
            className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full"
            width={1200}
            height={900}
          />
        </figure>
        <div className="order-1 px-6 py-8 sm:px-10 sm:py-12 lg:order-2">
          <h2 className="font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl">
            {t.careTitle}
          </h2>
          <p className="mt-3 text-muted text-pretty">{t.careLead}</p>
          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-soft text-rose">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
