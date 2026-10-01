import { copy } from "@/lib/i18n";
import { whatsappChatHref } from "@/lib/whatsapp";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

export function Hero() {
  const lang = useAppStore((s) => s.lang);
  const t = copy[lang];

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:py-16">
      <div className="lg:col-span-6">
        <p className="text-sm font-medium tracking-wide text-rose">{t.heroKicker}</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.15] font-medium tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.35rem]">
          {t.heroTitle}
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-pretty text-muted sm:text-lg">
          {t.heroLead}
        </p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-pretty text-ink/80">
          {t.heroArea}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="#services">{t.heroCta}</a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href={whatsappChatHref()} target="_blank" rel="noopener noreferrer">
              {t.heroSecondary}
            </a>
          </Button>
        </div>
      </div>

      <div className="lg:col-span-6">
        <figure className="overflow-hidden rounded-2xl border border-border bg-soft">
          <img
            src="/hero-atelier.jpg"
            alt={
              lang === "hi"
                ? "धूप में लटकती साड़ियाँ, देव ड्राई क्लीनर्स की दुकान जैसा दृश्य"
                : "Silk sarees hanging in warm morning light at the dryclean atelier"
            }
            className="aspect-[4/5] w-full object-cover object-center sm:aspect-[4/5] lg:aspect-[5/6]"
            width={900}
            height={1200}
          />
        </figure>
      </div>
    </section>
  );
}
