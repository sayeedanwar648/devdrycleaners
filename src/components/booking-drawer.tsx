import { useEffect, useMemo, useState } from "react";
import { Drawer } from "vaul";
import { Check, LocateFixed, MapPin } from "lucide-react";
import { copy } from "@/lib/i18n";
import { itemName } from "@/lib/catalog";
import { todayISO, formatInr } from "@/lib/utils";
import {
  buildBookingMessage,
  cartTotals,
  customerMapsHref,
  deliveryCharge,
  whatsappHref,
} from "@/lib/whatsapp";
import { useAppStore, type SlotId } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QtyStepper } from "@/components/qty-stepper";

const SLOTS: SlotId[] = ["morning", "afternoon", "evening"];

function isValidPhone(value: string) {
  return /^[6-9]\d{9}$/.test(value.trim());
}

type GeoStatus = "idle" | "loading" | "ok" | "denied" | "error" | "unsupported";

export function BookingDrawer() {
  const lang = useAppStore((s) => s.lang);
  const cart = useAppStore((s) => s.cart);
  const catalog = useAppStore((s) => s.catalog);
  const sheet = useAppStore((s) => s.sheet);
  const draft = useAppStore((s) => s.draft);
  const closeSheet = useAppStore((s) => s.closeSheet);
  const patchDraft = useAppStore((s) => s.patchDraft);
  const add = useAppStore((s) => s.add);
  const sub = useAppStore((s) => s.sub);
  const t = copy[lang];
  const [tried, setTried] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>(
    draft.geoLat != null ? "ok" : "idle",
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const { lines, amount, count } = cartTotals(cart, catalog);
  const fee = deliveryCharge(amount, draft.delivery);
  const payable = amount + fee;
  const errors = useMemo(() => {
    const next: string[] = [];
    if (draft.name.trim().length < 2) next.push(t.needName);
    if (!isValidPhone(draft.phone)) next.push(t.needPhone);
    if (draft.address.trim().length < 6) next.push(t.needAddress);
    return next;
  }, [draft, t]);

  function captureLocation() {
    if (!navigator.geolocation) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        patchDraft({
          geoLat: pos.coords.latitude,
          geoLng: pos.coords.longitude,
        });
        setGeoStatus("ok");
      },
      (err) => {
        setGeoStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 18000, maximumAge: 0 },
    );
  }

  function submit() {
    setTried(true);
    if (errors.length) return;
    const message = buildBookingMessage(lang, cart, draft, catalog);
    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
  }

  if (!mounted) return null;

  const hasPin = draft.geoLat != null && draft.geoLng != null;

  return (
    <Drawer.Root
      shouldScaleBackground={false}
      open={sheet === "book"}
      onOpenChange={(open) => {
        if (!open) {
          setTried(false);
          closeSheet();
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/50" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-50 mt-6 flex max-h-[96dvh] flex-col overflow-hidden rounded-t-3xl bg-ivory outline-none"
          style={{ backgroundColor: "var(--color-ivory)" }}
        >
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-border" />
          <Drawer.Title className="px-5 pt-4 font-display text-2xl font-medium tracking-tight text-ink">
            {t.bookingTitle}
          </Drawer.Title>
          <p className="px-5 pt-1 text-sm text-muted">{t.bookingLead}</p>

          <div className="mt-4 flex-1 overflow-y-auto px-5 pb-6">
            <div className="rounded-2xl border border-border bg-linen p-4">
              <p className="text-sm font-medium text-ink">{t.cartTitle}</p>
              {lines.length === 0 ? (
                <p className="mt-2 text-sm text-muted">{t.cartEmpty}</p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {lines.map((line) => {
                    const name = itemName(line, lang);
                    return (
                      <li
                        key={line.id}
                        className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-ink">{name}</p>
                          <p className="text-xs tabular-nums text-muted">
                            {formatInr(line.price)} × {line.qty}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <p className="text-sm tabular-nums text-ink">
                            {formatInr(line.line)}
                          </p>
                          <QtyStepper
                            value={line.qty}
                            onAdd={() => add(line.id)}
                            onSub={() => sub(line.id)}
                            label={name}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted">
                    {t.cartClothes}
                    {count ? ` · ${count} ${t.cartPieces}` : ""}
                  </span>
                  <span className="tabular-nums text-ink">{formatInr(amount)}</span>
                </div>
                {draft.delivery ? (
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-muted">{t.whatsapp.deliveryCharge}</span>
                    <span className="tabular-nums text-ink">
                      {fee ? formatInr(fee) : t.whatsapp.deliveryFree}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm text-muted">{t.cartTotal}</span>
                  <span className="font-display text-2xl tabular-nums text-ink">
                    {formatInr(payable)}
                  </span>
                </div>
              </div>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="name">{t.fieldName}</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  value={draft.name}
                  onChange={(e) => patchDraft({ name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">{t.fieldPhone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={draft.phone}
                  onChange={(e) =>
                    patchDraft({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">{t.fieldAddress}</Label>
                <p className="text-xs text-muted">{t.fieldAddressHint}</p>
                <Textarea
                  id="address"
                  rows={3}
                  placeholder={t.fieldAddressPh}
                  value={draft.address}
                  onChange={(e) => patchDraft({ address: e.target.value })}
                />
              </div>

              <div className="rounded-2xl border border-rose/25 bg-soft p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-ink">
                  <MapPin className="size-4 text-rose" />
                  {t.geoTitle}
                </p>
                <p className="mt-1.5 text-sm text-muted">{t.geoLead}</p>
                {geoStatus === "ok" && hasPin ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-ivory px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-sm text-ink">
                      <Check className="size-4 text-whatsapp" />
                      {t.geoOk}
                    </p>
                    <a
                      href={customerMapsHref(draft.geoLat!, draft.geoLng!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-rose underline-offset-2 hover:underline"
                    >
                      {t.geoOpen}
                    </a>
                  </div>
                ) : null}
                {geoStatus === "denied" ? (
                  <p className="mt-2 text-sm text-rose">{t.geoDenied}</p>
                ) : null}
                {geoStatus === "error" ? (
                  <p className="mt-2 text-sm text-rose">{t.geoError}</p>
                ) : null}
                {geoStatus === "unsupported" ? (
                  <p className="mt-2 text-sm text-rose">{t.geoUnsupported}</p>
                ) : null}
                <Button
                  type="button"
                  variant={hasPin ? "secondary" : "primary"}
                  className="mt-3 w-full"
                  onClick={captureLocation}
                  disabled={geoStatus === "loading"}
                >
                  <LocateFixed className="size-4" />
                  {geoStatus === "loading"
                    ? t.geoLoading
                    : hasPin
                      ? t.geoRetry
                      : t.geoBtn}
                </Button>
                <p className="mt-2 text-xs text-muted">{t.geoWaHint}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="date">{t.fieldDate}</Label>
                  <Input
                    id="date"
                    type="date"
                    min={todayISO()}
                    value={draft.date}
                    onChange={(e) => patchDraft({ date: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slot">{t.fieldSlot}</Label>
                  <select
                    id="slot"
                    className="h-11 w-full rounded-lg border border-border bg-ivory px-3.5 text-base text-ink"
                    value={draft.slot}
                    onChange={(e) => patchDraft({ slot: e.target.value as SlotId })}
                  >
                    {SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {t.slots[slot]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-4 accent-rose"
                    checked={draft.pickup}
                    onChange={(e) => patchDraft({ pickup: e.target.checked })}
                  />
                  {t.pickupToggle}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-4 accent-rose"
                    checked={draft.delivery}
                    onChange={(e) => patchDraft({ delivery: e.target.checked })}
                  />
                  {t.deliveryToggle}
                </label>
              </div>
              <p className="text-xs text-muted">{t.deliveryHint}</p>
              <div className="space-y-1.5">
                <Label htmlFor="notes">{t.fieldNotes}</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder={t.fieldNotesPh}
                  value={draft.notes}
                  onChange={(e) => patchDraft({ notes: e.target.value })}
                />
              </div>
              {tried && errors.length > 0 ? (
                <ul className="text-sm text-rose">
                  {errors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              ) : null}
              <Button type="submit" size="lg" className="w-full" variant="whatsapp">
                {t.sendWhatsapp}
              </Button>
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
