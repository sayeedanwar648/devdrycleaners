import { copy } from "@/lib/i18n";
import { SHOP } from "@/lib/catalog";
import { telHref, whatsappChatHref, mapsHref } from "@/lib/whatsapp";
import { useAppStore } from "@/store/app-store";
import { LogoMark } from "@/components/logo";

export function Footer() {
  const lang = useAppStore((s) => s.lang);
  const t = copy[lang];

  return (
    <footer className="border-t border-border bg-ivory pb-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <LogoMark />
          <div>
            <p className="font-display text-xl font-medium text-ink">{t.brand}</p>
            <p className="mt-1 text-sm text-muted">{t.footerNote}</p>
            <p className="mt-1 text-sm text-muted">
              {lang === "hi" ? `${SHOP.areaHi}, ${SHOP.cityHi}` : `${SHOP.areaEn}, ${SHOP.cityEn}`}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm text-muted sm:text-right">
          <a href={telHref()} className="hover:text-ink">
            +91 {SHOP.phoneDisplay}
          </a>
          <a
            href={whatsappChatHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            WhatsApp
          </a>
          <a
            href={mapsHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            {t.visitMap}
          </a>
        </div>
      </div>
    </footer>
  );
}
