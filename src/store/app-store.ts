import { create } from "zustand";
import type { Lang } from "@/lib/i18n";
import type { CatalogCategory, CatalogItem, CatalogSubcategory } from "@/lib/catalog";
import { todayISO } from "@/lib/utils";

export type SlotId = "morning" | "afternoon" | "evening";
export type CartMap = Record<string, number>;
export type SheetId = "none" | "cart" | "book";

export type BookingDraft = {
  name: string;
  phone: string;
  address: string;
  geoLat: number | null;
  geoLng: number | null;
  date: string;
  slot: SlotId;
  notes: string;
  pickup: boolean;
  delivery: boolean;
};

type AppState = {
  lang: Lang;
  cart: CartMap;
  sheet: SheetId;
  draft: BookingDraft;
  catalog: CatalogItem[];
  categories: CatalogCategory[];
  subcategories: CatalogSubcategory[];
  setLang: (lang: Lang) => void;
  setListings: (
    catalog: CatalogItem[],
    categories: CatalogCategory[],
    subcategories?: CatalogSubcategory[],
  ) => void;
  add: (id: string) => void;
  sub: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openSheet: (sheet: SheetId) => void;
  closeSheet: () => void;
  patchDraft: (patch: Partial<BookingDraft>) => void;
};

const emptyDraft = (): BookingDraft => ({
  name: "",
  phone: "",
  address: "",
  geoLat: null,
  geoLng: null,
  date: todayISO(),
  slot: "morning",
  notes: "",
  pickup: true,
  delivery: true,
});

export const useAppStore = create<AppState>((set) => ({
  lang: "hi",
  cart: {},
  sheet: "none",
  draft: emptyDraft(),
  catalog: [],
  categories: [],
  subcategories: [],
  setLang: (lang) => set({ lang }),
  setListings: (catalog, categories, subcategories = []) =>
    set({ catalog, categories, subcategories }),
  add: (id) =>
    set((state) => ({
      cart: { ...state.cart, [id]: (state.cart[id] ?? 0) + 1 },
    })),
  sub: (id) =>
    set((state) => {
      const next = (state.cart[id] ?? 0) - 1;
      const cart = { ...state.cart };
      if (next <= 0) delete cart[id];
      else cart[id] = next;
      return { cart };
    }),
  setQty: (id, qty) =>
    set((state) => {
      const cart = { ...state.cart };
      if (qty <= 0) delete cart[id];
      else cart[id] = qty;
      return { cart };
    }),
  clearCart: () => set({ cart: {} }),
  openSheet: (sheet) => set({ sheet }),
  closeSheet: () => set({ sheet: "none" }),
  patchDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),
}));
