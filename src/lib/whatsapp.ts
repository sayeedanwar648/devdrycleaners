import { SHOP, itemName, type CatalogItem } from "@/lib/catalog";
import type { Lang } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { formatDisplayDate } from "@/lib/utils";
import type { BookingDraft, CartMap } from "@/store/app-store";

export const FREE_DELIVERY_MIN = 600;
export const DELIVERY_FEE = 40;

export function cartLines(cart: CartMap, catalog: CatalogItem[]) {
  return Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = catalog.find((row) => row.id === id);
      if (!item) return null;
      return { ...item, qty, line: item.price * qty };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
}

export function cartTotals(cart: CartMap, catalog: CatalogItem[]) {
  const lines = cartLines(cart, catalog);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const amount = lines.reduce((sum, line) => sum + line.line, 0);
  const days = lines.reduce((max, line) => Math.max(max, line.days), 0);
  return { lines, count, amount, days };
}

export function deliveryCharge(subtotal: number, wantDelivery: boolean) {
  if (!wantDelivery || subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
}

export function buildBookingMessage(
  lang: Lang,
  cart: CartMap,
  draft: BookingDraft,
  catalog: CatalogItem[],
) {
  const t = copy[lang];
  const { lines, amount, count, days } = cartTotals(cart, catalog);
  const fee = deliveryCharge(amount, draft.delivery);
  const payable = amount + fee;
  const itemBlock =
    lines.length === 0
      ? t.whatsapp.noItems
      : lines
          .map((line) => {
            const set = line.pieces > 1 ? ` (${line.pieces} ${t.pieceSet})` : "";
            return `• ${itemName(line, lang)}${set} × ${line.qty} = ₹${line.line}`;
          })
          .join("\n");

  const slot = t.slots[draft.slot];
  const date = formatDisplayDate(draft.date, lang) || t.whatsapp.dateOpen;

  const geo =
    draft.geoLat != null && draft.geoLng != null
      ? `${t.whatsapp.geo}: ${customerMapsHref(draft.geoLat, draft.geoLng)}`
      : "";

  return [
    t.whatsapp.greeting,
    "",
    `${t.whatsapp.name}: ${draft.name.trim()}`,
    `${t.whatsapp.phone}: ${draft.phone.trim()}`,
    `${t.whatsapp.address}: ${draft.address.trim()}`,
    geo,
    `${t.whatsapp.pickup}: ${date}, ${slot}`,
    `${t.whatsapp.homePickup}: ${draft.pickup ? t.whatsapp.yes : t.whatsapp.no}`,
    `${t.whatsapp.homeDelivery}: ${draft.delivery ? t.whatsapp.yes : t.whatsapp.no}`,
    "",
    t.whatsapp.itemsHeading,
    itemBlock,
    "",
    `${t.whatsapp.clothes}: ₹${amount}  (${count} ${t.whatsapp.pieces})`,
    draft.delivery
      ? `${t.whatsapp.deliveryCharge}: ${fee ? `₹${fee}` : t.whatsapp.deliveryFree}`
      : "",
    `${t.whatsapp.total}: ₹${payable}`,
    days ? `${t.whatsapp.readyIn}: ${days} ${t.whatsapp.days}` : "",
    draft.notes.trim() ? `${t.whatsapp.notes}: ${draft.notes.trim()}` : "",
    "",
    t.whatsapp.payOnPickup,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function whatsappHref(text: string) {
  return `https://wa.me/${SHOP.whatsappE164}?text=${encodeURIComponent(text)}`;
}

export function whatsappChatHref() {
  return `https://wa.me/${SHOP.whatsappE164}`;
}

export function telHref() {
  return `tel:+91${SHOP.phoneRaw}`;
}

export function mapsHref() {
  return SHOP.mapsUrl;
}

export function shopEmbedSrc() {
  const q = encodeURIComponent(SHOP.mapsQuery);
  return `https://www.google.com/maps?q=${q}&z=17&hl=hi&output=embed`;
}

export function customerMapsHref(lat: number, lng: number) {
  return `https://maps.google.com/?q=${lat},${lng}`;
}

export function customerEmbedSrc(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=18&output=embed`;
}
