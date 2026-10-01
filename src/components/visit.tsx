import { Clock, MapPin, Phone, UserRound, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { copy } from "@/lib/i18n";
import { mapsHref, shopEmbedSrc, telHref } from "@/lib/whatsapp";
import { SHOP } from "@/lib/catalog";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

export function Visit() {
  const lang = useAppStore((s) => s.lang);
  const t = copy[lang];
  const mapSlot = useRef<HTMLElement>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const el = mapSlot.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const facts = [
    {
      icon: UserRound,
      label: t.founderLabel,
      value: t.founder,
    },
    {
      icon: MapPin,
      label: t.addressLabel,
      value: lang === "hi" ? `${SHOP.areaHi}, ${SHOP.cityHi} ८४८१०१` : `${SHOP.areaEn}, ${SHOP.cityEn} 848101`,
    },
    {
      icon: Clock,
      label: t.hoursLabel,
      value: lang === "hi" ? SHOP.hoursHi : SHOP.hoursEn,
    },
    {
      icon: Phone,
      label: t.phoneLabel,
      value: SHOP.phoneDisplay,
    },
    {
      icon: Wallet,
      label: t.payLabel,
      value: t.payValue,
    },
  ];

  return (
    <section id="visit" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl">
            {t.visitTitle}
          </h2>
          <p className="mt-3 text-muted">{t.visitLead}</p>
          <ul className="mt-8 space-y-5">
            {facts.map((fact) => (
              <li key={fact.label} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-soft text-rose">
                  <fact.icon className="size-4" />
                </span>
                <span>
                  <span className="block text-xs font-medium tracking-wide text-muted uppercase">
                    {fact.label}
                  </span>
                  <span className="mt-0.5 block text-ink">{fact.value}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href={mapsHref()} target="_blank" rel="noopener noreferrer">
                {t.visitMap}
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={telHref()}>{t.visitCall}</a>
            </Button>
          </div>
        </div>
        <figure ref={mapSlot} className="overflow-hidden rounded-2xl border border-border bg-soft">
          {showMap ? (
            <iframe
              title={lang === "hi" ? "देव ड्राई क्लीनर्स का नक्शा" : "Map of Dev Dry Cleaners"}
              src={shopEmbedSrc()}
              className="h-full min-h-80 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="grid min-h-80 place-items-center px-6 text-center text-sm text-muted">
              {t.visitMap}
            </div>
          )}
        </figure>
      </div>
    </section>
  );
}
