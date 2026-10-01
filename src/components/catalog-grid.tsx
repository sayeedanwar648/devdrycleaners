import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { GarmentIcon } from "@/components/garment-icon";
import { QtyStepper } from "@/components/qty-stepper";
import {
  categoryName,
  itemName,
  subcategoryName,
  type CatalogCategory,
  type CatalogItem,
  type CatalogSubcategory,
} from "@/lib/catalog";
import { copy } from "@/lib/i18n";
import { cn, formatInr } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

function ItemThumb({ item, alt }: { item: CatalogItem; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-soft sm:size-[4.5rem]">
      {item.image && !failed ? (
        <img
          src={item.image}
          alt={alt}
          className="size-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="grid size-full place-items-center">
          <GarmentIcon icon={item.icon} className="size-8" />
        </span>
      )}
      {item.regNo > 0 ? (
        <span className="absolute top-1 left-1 grid min-w-5 place-items-center rounded-full bg-ivory/95 px-1 text-[10px] font-medium tabular-nums text-ink">
          {item.regNo}
        </span>
      ) : null}
    </div>
  );
}

type CatalogGridProps = {
  items: CatalogItem[];
  categories: CatalogCategory[];
  subcategories: CatalogSubcategory[];
};

export function CatalogGrid({ items, categories, subcategories }: CatalogGridProps) {
  const lang = useAppStore((s) => s.lang);
  const cart = useAppStore((s) => s.cart);
  const add = useAppStore((s) => s.add);
  const sub = useAppStore((s) => s.sub);
  const t = copy[lang];

  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [subId, setSubId] = useState("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const subs = useMemo(
    () => subcategories.filter((s) => s.categoryId === categoryId),
    [subcategories, categoryId],
  );

  const visible = useMemo(() => {
    return items.filter((item) => {
      if (searching) {
        const hay = `${item.nameHi} ${item.nameEn}`.toLowerCase();
        return hay.includes(q);
      }
      if (item.category !== categoryId) return false;
      if (subId !== "all" && item.subcategory !== subId) return false;
      return true;
    });
  }, [items, searching, q, categoryId, subId]);

  function pickCategory(id: string) {
    setCategoryId(id);
    setSubId("all");
  }

  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          {t.catalogTitle}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted">{t.catalogLead}</p>
      </div>

      <label className="mt-8 flex items-center gap-2 rounded-2xl border border-border bg-ivory px-3">
        <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.catalogSearch}
          className="h-12 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-subtle"
          type="search"
          enterKeyHint="search"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-soft hover:text-ink"
            aria-label={t.catalogSearchClear}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </label>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const on = !searching && cat.id === categoryId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setQuery("");
                pickCategory(cat.id);
              }}
              className={cn(
                "h-11 shrink-0 rounded-full px-4 text-sm font-medium",
                on ? "bg-ink text-ivory" : "border border-border bg-ivory text-ink hover:bg-soft",
              )}
            >
              {categoryName(cat, lang)}
            </button>
          );
        })}
      </div>

      {!searching && subs.length > 0 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setSubId("all")}
            className={cn(
              "h-9 shrink-0 rounded-full px-3 text-xs font-medium",
              subId === "all" ? "bg-rose text-rose-fg" : "bg-soft text-ink",
            )}
          >
            {t.all}
          </button>
          {subs.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSubId(s.id)}
              className={cn(
                "h-9 shrink-0 rounded-full px-3 text-xs font-medium",
                subId === s.id ? "bg-rose text-rose-fg" : "bg-soft text-ink",
              )}
            >
              {subcategoryName(s, lang)}
            </button>
          ))}
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-muted">{t.catalogSearchEmpty}</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {visible.map((item) => {
            const name = itemName(item, lang);
            const qty = cart[item.id] ?? 0;
            const cat = categories.find((c) => c.id === item.category);
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-ivory p-3"
              >
                <ItemThumb item={item} alt={name} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] leading-snug font-medium text-ink">{name}</p>
                  {searching && cat ? (
                    <p className="mt-0.5 text-xs text-subtle">{categoryName(cat, lang)}</p>
                  ) : null}
                  <p className="mt-1 text-sm font-medium tabular-nums text-rose">
                    {formatInr(item.price)}
                  </p>
                  <p className="text-xs text-muted">
                    {item.pieces > 1 ? `${item.pieces} ${t.pieceSet}` : t.each}
                    {" · "}
                    {item.days} {t.days}
                  </p>
                </div>
                <QtyStepper value={qty} onAdd={() => add(item.id)} onSub={() => sub(item.id)} label={name} />
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-xs text-subtle">{t.catalogNote}</p>
    </section>
  );
}
