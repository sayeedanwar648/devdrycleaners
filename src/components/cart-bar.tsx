import { copy } from "@/lib/i18n";
import { cartTotals, deliveryCharge } from "@/lib/whatsapp";
import { formatInr } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

export function CartBar() {
  const lang = useAppStore((s) => s.lang);
  const cart = useAppStore((s) => s.cart);
  const catalog = useAppStore((s) => s.catalog);
  const sheet = useAppStore((s) => s.sheet);
  const delivery = useAppStore((s) => s.draft.delivery);
  const openSheet = useAppStore((s) => s.openSheet);
  const t = copy[lang];
  const { count, amount } = cartTotals(cart, catalog);
  const fee = deliveryCharge(amount, delivery);
  const payable = amount + fee;

  if (sheet !== "none") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivory pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          {count > 0 ? (
            <>
              <p className="truncate text-sm text-muted">
                {count} {t.cartPieces}
                {delivery
                  ? ` · ${fee ? t.deliveryFeeLine : t.deliveryFreeLine}`
                  : ""}
              </p>
              <p className="font-display text-2xl font-medium tabular-nums tracking-tight text-ink">
                {formatInr(payable)}
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-xl font-medium tracking-tight text-ink">
                {t.navBook}
              </p>
              <p className="truncate text-sm text-muted">{t.cartEmptyBar}</p>
            </>
          )}
        </div>
        <Button size="lg" onClick={() => openSheet("book")} className="shrink-0">
          {count > 0 ? t.reviewCta : t.bookCta}
        </Button>
      </div>
    </div>
  );
}
