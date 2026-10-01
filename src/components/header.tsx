import { useEffect } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { copy } from "@/lib/i18n";
import { telHref, whatsappChatHref } from "@/lib/whatsapp";
import { useAppStore } from "@/store/app-store";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const openSheet = useAppStore((s) => s.openSheet);
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ivory">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <LogoMark />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-tight font-medium tracking-tight text-ink sm:text-xl">
              {t.brandShort}
            </span>
            <span className="hidden truncate text-xs text-muted sm:block">
              {t.area}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#services" className="hover:text-ink">
            {t.navServices}
          </a>
          <a href="#how" className="hover:text-ink">
            {t.navHow}
          </a>
          <a href="#visit" className="hover:text-ink">
            {t.area}
          </a>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className="flex rounded-full border border-border bg-linen p-0.5"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={cn(
                "h-8 min-w-9 rounded-full px-2 text-xs font-medium",
                lang === "hi" ? "bg-ivory text-ink shadow-sm" : "text-muted",
              )}
            >
              {t.langHi}
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={cn(
                "h-8 min-w-9 rounded-full px-2 text-xs font-medium",
                lang === "en" ? "bg-ivory text-ink shadow-sm" : "text-muted",
              )}
            >
              {t.langEn}
            </button>
          </div>

          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <a href={telHref()} aria-label={t.call}>
              <Phone className="size-4" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <a
              href={whatsappChatHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.chat}
            >
              <MessageCircle className="size-4" />
            </a>
          </Button>
          <Button size="sm" onClick={() => openSheet("book")} className="hidden sm:inline-flex">
            {t.navBook}
          </Button>
        </div>
      </div>
    </header>
  );
}
