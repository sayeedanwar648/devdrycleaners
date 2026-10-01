import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { copy } from "@/lib/i18n";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export function Faq() {
  const lang = useAppStore((s) => s.lang);
  const t = copy[lang];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
      <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        {t.faqTitle}
      </h2>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {t.faqs.map((faq, index) => {
          const isOpen = open === index;
          return (
            <li key={faq.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="font-medium text-ink">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-muted transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="pb-4 text-sm leading-relaxed text-muted">{faq.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
