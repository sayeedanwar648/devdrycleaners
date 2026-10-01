import { copy } from "@/lib/i18n";
import { useAppStore } from "@/store/app-store";

export function HowItWorks() {
  const lang = useAppStore((s) => s.lang);
  const t = copy[lang];
  const steps = [
    { n: "01", title: t.how1Title, body: t.how1Body },
    { n: "02", title: t.how2Title, body: t.how2Body },
    { n: "03", title: t.how3Title, body: t.how3Body },
    { n: "04", title: t.how4Title, body: t.how4Body },
  ];

  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <h2 className="font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl">
            {t.howTitle}
          </h2>
          <p className="mt-3 max-w-md text-muted text-pretty">{t.howLead}</p>
        </div>
        <figure className="overflow-hidden rounded-2xl border border-border lg:col-span-7">
          <img
            src="/pickup-door.jpg"
            alt={
              lang === "hi"
                ? "घर के द्वार पर कपड़ों की टोकरी — होम पिकअप"
                : "A basket of clothes at the doorway, ready for home pickup"
            }
            className="aspect-[16/10] w-full object-cover"
            width={1200}
            height={750}
          />
        </figure>
      </div>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-border bg-ivory p-5 sm:p-6"
          >
            <p className="font-display text-sm tracking-wide text-rose">{step.n}</p>
            <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
