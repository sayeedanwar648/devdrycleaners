import { copy } from "@/lib/i18n";
import { useAppStore } from "@/store/app-store";

export function TrustBar() {
  const lang = useAppStore((s) => s.lang);
  const t = copy[lang];
  const items = [
    { title: t.trustYears, sub: t.trustYearsSub },
    { title: t.trustPickup, sub: t.trustPickupSub },
    { title: t.trustSilk, sub: t.trustSilkSub },
    { title: t.trustPay, sub: t.trustPaySub },
  ];

  return (
    <section className="border-y border-border bg-ivory">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="bg-ivory px-4 py-5 sm:px-6 sm:py-6">
            <p className="font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
              {item.title}
            </p>
            <p className="mt-1 text-sm text-muted">{item.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
