import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as SHOP, c as itemName, l as subcategoryName, o as categoryName } from "./catalog-DJVdnh9b.mjs";
import { a as Search, c as Minus, d as LocateFixed, f as Clock, l as MessageCircle, m as Check, n as Wallet, o as Plus, p as ChevronDown, r as UserRound, s as Phone, t as X, u as MapPin } from "../_libs/lucide-react.mjs";
import { n as Route$2, r as copy } from "./router-j1D68KYl.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BqFBlLXQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatInr(amount) {
	return `₹${amount}`;
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatDisplayDate(iso, lang) {
	if (!iso) return "";
	const d = /* @__PURE__ */ new Date(`${iso}T00:00:00`);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
		day: "numeric",
		month: "long",
		year: "numeric",
		numberingSystem: "latn"
	});
}
function cartLines(cart, catalog) {
	return Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => {
		const item = catalog.find((row) => row.id === id);
		if (!item) return null;
		return {
			...item,
			qty,
			line: item.price * qty
		};
	}).filter((row) => row !== null);
}
function cartTotals(cart, catalog) {
	const lines = cartLines(cart, catalog);
	return {
		lines,
		count: lines.reduce((sum, line) => sum + line.qty, 0),
		amount: lines.reduce((sum, line) => sum + line.line, 0),
		days: lines.reduce((max, line) => Math.max(max, line.days), 0)
	};
}
function deliveryCharge(subtotal, wantDelivery) {
	if (!wantDelivery || subtotal <= 0) return 0;
	return subtotal >= 600 ? 0 : 40;
}
function buildBookingMessage(lang, cart, draft, catalog) {
	const t = copy[lang];
	const { lines, amount, count, days } = cartTotals(cart, catalog);
	const fee = deliveryCharge(amount, draft.delivery);
	const payable = amount + fee;
	const itemBlock = lines.length === 0 ? t.whatsapp.noItems : lines.map((line) => {
		const set = line.pieces > 1 ? ` (${line.pieces} ${t.pieceSet})` : "";
		return `• ${itemName(line, lang)}${set} × ${line.qty} = ₹${line.line}`;
	}).join("\n");
	const slot = t.slots[draft.slot];
	const date = formatDisplayDate(draft.date, lang) || t.whatsapp.dateOpen;
	const geo = draft.geoLat != null && draft.geoLng != null ? `${t.whatsapp.geo}: ${customerMapsHref(draft.geoLat, draft.geoLng)}` : "";
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
		draft.delivery ? `${t.whatsapp.deliveryCharge}: ${fee ? `₹${fee}` : t.whatsapp.deliveryFree}` : "",
		`${t.whatsapp.total}: ₹${payable}`,
		days ? `${t.whatsapp.readyIn}: ${days} ${t.whatsapp.days}` : "",
		draft.notes.trim() ? `${t.whatsapp.notes}: ${draft.notes.trim()}` : "",
		"",
		t.whatsapp.payOnPickup
	].filter((line) => line !== "").join("\n");
}
function whatsappHref(text) {
	return `https://wa.me/${SHOP.whatsappE164}?text=${encodeURIComponent(text)}`;
}
function whatsappChatHref() {
	return `https://wa.me/${SHOP.whatsappE164}`;
}
function telHref() {
	return `tel:+91${SHOP.phoneRaw}`;
}
function mapsHref() {
	return SHOP.mapsUrl;
}
function shopEmbedSrc() {
	return `https://www.google.com/maps?q=${encodeURIComponent(SHOP.mapsQuery)}&z=17&hl=hi&output=embed`;
}
function customerMapsHref(lat, lng) {
	return `https://maps.google.com/?q=${lat},${lng}`;
}
var emptyDraft = () => ({
	name: "",
	phone: "",
	address: "",
	geoLat: null,
	geoLng: null,
	date: todayISO(),
	slot: "morning",
	notes: "",
	pickup: true,
	delivery: true
});
var useAppStore = create((set) => ({
	lang: "hi",
	cart: {},
	sheet: "none",
	draft: emptyDraft(),
	catalog: [],
	categories: [],
	subcategories: [],
	setLang: (lang) => set({ lang }),
	setListings: (catalog, categories, subcategories = []) => set({
		catalog,
		categories,
		subcategories
	}),
	add: (id) => set((state) => ({ cart: {
		...state.cart,
		[id]: (state.cart[id] ?? 0) + 1
	} })),
	sub: (id) => set((state) => {
		const next = (state.cart[id] ?? 0) - 1;
		const cart = { ...state.cart };
		if (next <= 0) delete cart[id];
		else cart[id] = next;
		return { cart };
	}),
	setQty: (id, qty) => set((state) => {
		const cart = { ...state.cart };
		if (qty <= 0) delete cart[id];
		else cart[id] = qty;
		return { cart };
	}),
	clearCart: () => set({ cart: {} }),
	openSheet: (sheet) => set({ sheet }),
	closeSheet: () => set({ sheet: "none" }),
	patchDraft: (patch) => set((state) => ({ draft: {
		...state.draft,
		...patch
	} }))
}));
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[transform,background-color,color,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-linen disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-rose text-rose-fg hover:bg-rose/90",
			secondary: "bg-ivory text-ink border border-border hover:bg-soft",
			ghost: "bg-transparent text-ink hover:bg-soft",
			whatsapp: "bg-whatsapp text-whatsapp-fg hover:bg-whatsapp/90"
		},
		size: {
			sm: "h-10 px-4 text-sm rounded-md",
			md: "h-11 px-5 text-sm rounded-lg",
			lg: "h-12 px-6 text-base rounded-xl",
			icon: "size-11 rounded-lg"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-lg border border-border bg-ivory px-3.5 text-base text-ink placeholder:text-subtle", "transition-[box-shadow,border-color] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-rose", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium text-ink", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-lg border border-border bg-ivory px-3.5 py-2.5 text-base text-ink placeholder:text-subtle", "transition-[box-shadow,border-color] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-rose", className),
		...props
	});
}
function QtyStepper({ value, onAdd, onSub, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [value > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onSub,
			"aria-label": `${label} −`,
			className: cn("grid size-11 place-items-center rounded-md border border-border bg-ivory text-ink", "transition-[transform,background-color] duration-150 ease-out", "hover:bg-soft active:scale-[0.96]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
				className: "size-4",
				strokeWidth: 2
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-8 text-center text-sm font-medium tabular-nums text-ink",
			children: value
		})] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onAdd,
			"aria-label": `${label} +`,
			className: cn("grid size-11 place-items-center rounded-md text-ink", value > 0 ? "border border-border bg-ivory hover:bg-soft" : "bg-rose text-rose-fg hover:bg-rose/90", "transition-[transform,background-color] duration-150 ease-out", "active:scale-[0.96]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "size-4",
				strokeWidth: 2
			})
		})]
	});
}
var SLOTS = [
	"morning",
	"afternoon",
	"evening"
];
function isValidPhone(value) {
	return /^[6-9]\d{9}$/.test(value.trim());
}
function BookingDrawer() {
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
	const [tried, setTried] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [geoStatus, setGeoStatus] = (0, import_react.useState)(draft.geoLat != null ? "ok" : "idle");
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	const { lines, amount, count } = cartTotals(cart, catalog);
	const fee = deliveryCharge(amount, draft.delivery);
	const payable = amount + fee;
	const errors = (0, import_react.useMemo)(() => {
		const next = [];
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
		navigator.geolocation.getCurrentPosition((pos) => {
			patchDraft({
				geoLat: pos.coords.latitude,
				geoLng: pos.coords.longitude
			});
			setGeoStatus("ok");
		}, (err) => {
			setGeoStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
		}, {
			enableHighAccuracy: true,
			timeout: 18e3,
			maximumAge: 0
		});
	}
	function submit() {
		setTried(true);
		if (errors.length) return;
		const message = buildBookingMessage(lang, cart, draft, catalog);
		window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
	}
	if (!mounted) return null;
	const hasPin = draft.geoLat != null && draft.geoLng != null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		shouldScaleBackground: false,
		open: sheet === "book",
		onOpenChange: (open) => {
			if (!open) {
				setTried(false);
				closeSheet();
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Portal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, { className: "fixed inset-0 z-50 bg-ink/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
			"aria-describedby": void 0,
			className: "fixed inset-x-0 bottom-0 z-50 mt-6 flex max-h-[96dvh] flex-col overflow-hidden rounded-t-3xl bg-ivory outline-none",
			style: { backgroundColor: "var(--color-ivory)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
					className: "px-5 pt-4 font-display text-2xl font-medium tracking-tight text-ink",
					children: t.bookingTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 pt-1 text-sm text-muted",
					children: t.bookingLead
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex-1 overflow-y-auto px-5 pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-linen p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-ink",
								children: t.cartTitle
							}),
							lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: t.cartEmpty
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-border",
								children: lines.map((line) => {
									const name = itemName(line, lang);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-sm text-ink",
												children: name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs tabular-nums text-muted",
												children: [
													formatInr(line.price),
													" × ",
													line.qty
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex shrink-0 items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm tabular-nums text-ink",
												children: formatInr(line.line)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyStepper, {
												value: line.qty,
												onAdd: () => add(line.id),
												onSub: () => sub(line.id),
												label: name
											})]
										})]
									}, line.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-1.5 border-t border-border pt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted",
											children: [t.cartClothes, count ? ` · ${count} ${t.cartPieces}` : ""]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums text-ink",
											children: formatInr(amount)
										})]
									}),
									draft.delivery ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: t.whatsapp.deliveryCharge
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums text-ink",
											children: fee ? formatInr(fee) : t.whatsapp.deliveryFree
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted",
											children: t.cartTotal
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-2xl tabular-nums text-ink",
											children: formatInr(payable)
										})]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-5 space-y-4",
						onSubmit: (event) => {
							event.preventDefault();
							submit();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: t.fieldName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									autoComplete: "name",
									value: draft.name,
									onChange: (e) => patchDraft({ name: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "phone",
									children: t.fieldPhone
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									type: "tel",
									inputMode: "numeric",
									autoComplete: "tel",
									maxLength: 10,
									value: draft.phone,
									onChange: (e) => patchDraft({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "address",
										children: t.fieldAddress
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: t.fieldAddressHint
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "address",
										rows: 3,
										placeholder: t.fieldAddressPh,
										value: draft.address,
										onChange: (e) => patchDraft({ address: e.target.value })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-rose/25 bg-soft p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 text-sm font-medium text-ink",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-rose" }), t.geoTitle]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-sm text-muted",
										children: t.geoLead
									}),
									geoStatus === "ok" && hasPin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-ivory px-3 py-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1.5 text-sm text-ink",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-whatsapp" }), t.geoOk]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: customerMapsHref(draft.geoLat, draft.geoLng),
											target: "_blank",
											rel: "noopener noreferrer",
											className: "text-sm text-rose underline-offset-2 hover:underline",
											children: t.geoOpen
										})]
									}) : null,
									geoStatus === "denied" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-rose",
										children: t.geoDenied
									}) : null,
									geoStatus === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-rose",
										children: t.geoError
									}) : null,
									geoStatus === "unsupported" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-rose",
										children: t.geoUnsupported
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: hasPin ? "secondary" : "primary",
										className: "mt-3 w-full",
										onClick: captureLocation,
										disabled: geoStatus === "loading",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "size-4" }), geoStatus === "loading" ? t.geoLoading : hasPin ? t.geoRetry : t.geoBtn]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted",
										children: t.geoWaHint
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "date",
										children: t.fieldDate
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "date",
										type: "date",
										min: todayISO(),
										value: draft.date,
										onChange: (e) => patchDraft({ date: e.target.value })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "slot",
										children: t.fieldSlot
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "slot",
										className: "h-11 w-full rounded-lg border border-border bg-ivory px-3.5 text-base text-ink",
										value: draft.slot,
										onChange: (e) => patchDraft({ slot: e.target.value }),
										children: SLOTS.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: slot,
											children: t.slots[slot]
										}, slot))
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "size-4 accent-rose",
										checked: draft.pickup,
										onChange: (e) => patchDraft({ pickup: e.target.checked })
									}), t.pickupToggle]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "size-4 accent-rose",
										checked: draft.delivery,
										onChange: (e) => patchDraft({ delivery: e.target.checked })
									}), t.deliveryToggle]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: t.deliveryHint
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "notes",
									children: t.fieldNotes
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "notes",
									rows: 3,
									placeholder: t.fieldNotesPh,
									value: draft.notes,
									onChange: (e) => patchDraft({ notes: e.target.value })
								})]
							}),
							tried && errors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "text-sm text-rose",
								children: errors.map((err) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: err }, err))
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "lg",
								className: "w-full",
								variant: "whatsapp",
								children: t.sendWhatsapp
							})
						]
					})]
				})
			]
		})] })
	});
}
function CarePromise() {
	const lang = useAppStore((s) => s.lang);
	const t = copy[lang];
	const points = [
		t.care1,
		t.care2,
		t.care3,
		t.care4
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-center gap-8 overflow-hidden rounded-3xl border border-border bg-ivory lg:grid-cols-2 lg:gap-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "order-2 lg:order-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/care-linen.jpg",
					alt: lang === "hi" ? "तह किए हुए कपड़े और गुलाब — नर्म देखभाल" : "Folded garments and dried roses, a still life of gentle care",
					className: "aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full",
					width: 1200,
					height: 900
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "order-1 px-6 py-8 sm:px-10 sm:py-12 lg:order-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl",
						children: t.careTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted text-pretty",
						children: t.careLead
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-3",
						children: points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3 text-sm text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-soft text-rose",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "size-3",
									strokeWidth: 2.5
								})
							}), point]
						}, point))
					})
				]
			})]
		})
	});
}
function CartBar() {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivory pb-[max(0.75rem,env(safe-area-inset-bottom))]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0 flex-1",
				children: count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-sm text-muted",
					children: [
						count,
						" ",
						t.cartPieces,
						delivery ? ` · ${fee ? t.deliveryFeeLine : t.deliveryFreeLine}` : ""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl font-medium tabular-nums tracking-tight text-ink",
					children: formatInr(payable)
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl font-medium tracking-tight text-ink",
					children: t.navBook
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm text-muted",
					children: t.cartEmptyBar
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				onClick: () => openSheet("book"),
				className: "shrink-0",
				children: count > 0 ? t.reviewCta : t.bookCta
			})]
		})
	});
}
function Svg({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 32 32",
		fill: "none",
		className: cn("size-7 text-rose", className),
		"aria-hidden": "true",
		children
	});
}
function GarmentIcon({ icon, className }) {
	const stroke = {
		stroke: "currentColor",
		strokeWidth: 1.6,
		strokeLinecap: "round",
		strokeLinejoin: "round"
	};
	switch (icon) {
		case "saree": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M10 6c4 3 4 8 0 12 5-1 10 2 12 8",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M10 6c2 1 5 1 8-1",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M8 26h14",
					...stroke
				})
			]
		});
		case "lehenga": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M16 5v6",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 11h8l4 14H8l4-14Z",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 11c1.4-3 6.6-3 8 0",
					...stroke
				})
			]
		});
		case "dupatta": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M6 10c6-6 14-6 20 0",
				...stroke
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 12c5 8 11 8 16 0",
				...stroke
			})]
		});
		case "suit": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 8 16 12l6-4 3 5v13H7V13l3-5Z",
				...stroke
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 12v14",
				...stroke
			})]
		});
		case "pant": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M11 6h10l-1 4-3 16h-2L13 10 11 6Z",
				...stroke
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M15 10h2",
				...stroke
			})]
		});
		case "blanket": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "6",
					y: "8",
					width: "20",
					height: "16",
					rx: "2",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M6 14h20",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 8v16",
					...stroke
				})
			]
		});
		case "curtain": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M6 6h20",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M8 6c0 6 4 6 4 20",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M20 6c0 6 4 6 4 20",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M14 6c0 8 4 8 4 20",
					...stroke
				})
			]
		});
		case "sofa": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M6 18v-4a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v4",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M4 18h24v5H4z",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M8 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2",
					...stroke
				})
			]
		});
		case "iron": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M7 20h16a4 4 0 0 0 0-8H14c-4 0-7 3-7 8Z",
				...stroke
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 12V8h8",
				...stroke
			})]
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, {
			className,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M10 10h12v14H10z",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M10 10c0-3 12-3 12 0",
					...stroke
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M16 7v3",
					...stroke
				})
			]
		});
	}
}
function ItemThumb({ item, alt }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative size-16 shrink-0 overflow-hidden rounded-xl bg-soft sm:size-[4.5rem]",
		children: [item.image && !failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: item.image,
			alt,
			className: "size-full object-cover",
			loading: "lazy",
			decoding: "async",
			onError: () => setFailed(true)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-full place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarmentIcon, {
				icon: item.icon,
				className: "size-8"
			})
		}), item.regNo > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-1 left-1 grid min-w-5 place-items-center rounded-full bg-ivory/95 px-1 text-[10px] font-medium tabular-nums text-ink",
			children: item.regNo
		}) : null]
	});
}
function CatalogGrid({ items, categories, subcategories }) {
	const lang = useAppStore((s) => s.lang);
	const cart = useAppStore((s) => s.cart);
	const add = useAppStore((s) => s.add);
	const sub = useAppStore((s) => s.sub);
	const t = copy[lang];
	const [categoryId, setCategoryId] = (0, import_react.useState)(categories[0]?.id ?? "");
	const [subId, setSubId] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const q = query.trim().toLowerCase();
	const searching = q.length > 0;
	const subs = (0, import_react.useMemo)(() => subcategories.filter((s) => s.categoryId === categoryId), [subcategories, categoryId]);
	const visible = (0, import_react.useMemo)(() => {
		return items.filter((item) => {
			if (searching) return `${item.nameHi} ${item.nameEn}`.toLowerCase().includes(q);
			if (item.category !== categoryId) return false;
			if (subId !== "all" && item.subcategory !== subId) return false;
			return true;
		});
	}, [
		items,
		searching,
		q,
		categoryId,
		subId
	]);
	function pickCategory(id) {
		setCategoryId(id);
		setSubId("all");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "services",
		className: "mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl",
					children: t.catalogTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base leading-relaxed text-muted",
					children: t.catalogLead
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-8 flex items-center gap-2 rounded-2xl border border-border bg-ivory px-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "size-4 shrink-0 text-muted",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: t.catalogSearch,
						className: "h-12 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-subtle",
						type: "search",
						enterKeyHint: "search"
					}),
					query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setQuery(""),
						className: "grid size-9 place-items-center rounded-full text-muted hover:bg-soft hover:text-ink",
						"aria-label": t.catalogSearchClear,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: categories.map((cat) => {
					const on = !searching && cat.id === categoryId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setQuery("");
							pickCategory(cat.id);
						},
						className: cn("h-11 shrink-0 rounded-full px-4 text-sm font-medium", on ? "bg-ink text-ivory" : "border border-border bg-ivory text-ink hover:bg-soft"),
						children: categoryName(cat, lang)
					}, cat.id);
				})
			}),
			!searching && subs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSubId("all"),
					className: cn("h-9 shrink-0 rounded-full px-3 text-xs font-medium", subId === "all" ? "bg-rose text-rose-fg" : "bg-soft text-ink"),
					children: t.all
				}), subs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSubId(s.id),
					className: cn("h-9 shrink-0 rounded-full px-3 text-xs font-medium", subId === s.id ? "bg-rose text-rose-fg" : "bg-soft text-ink"),
					children: subcategoryName(s, lang)
				}, s.id))]
			}) : null,
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: t.catalogSearchEmpty
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: visible.map((item) => {
					const name = itemName(item, lang);
					const qty = cart[item.id] ?? 0;
					const cat = categories.find((c) => c.id === item.category);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-2xl border border-border bg-ivory p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemThumb, {
								item,
								alt: name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[15px] leading-snug font-medium text-ink",
										children: name
									}),
									searching && cat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs text-subtle",
										children: categoryName(cat, lang)
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium tabular-nums text-rose",
										children: formatInr(item.price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [
											item.pieces > 1 ? `${item.pieces} ${t.pieceSet}` : t.each,
											" · ",
											item.days,
											" ",
											t.days
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyStepper, {
								value: qty,
								onAdd: () => add(item.id),
								onSub: () => sub(item.id),
								label: name
							})
						]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-subtle",
				children: t.catalogNote
			})
		]
	});
}
function Faq() {
	const lang = useAppStore((s) => s.lang);
	const t = copy[lang];
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl",
			children: t.faqTitle
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-8 divide-y divide-border border-y border-border",
			children: t.faqs.map((faq, index) => {
				const isOpen = open === index;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center justify-between gap-4 py-4 text-left",
					onClick: () => setOpen(isOpen ? null : index),
					"aria-expanded": isOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-ink",
						children: faq.q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-5 shrink-0 text-muted transition-transform duration-200", isOpen && "rotate-180") })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("grid transition-[grid-template-rows,opacity] duration-200", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pb-4 text-sm leading-relaxed text-muted",
							children: faq.a
						})
					})
				})] }, faq.q);
			})
		})]
	});
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-9 shrink-0 text-rose", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M9 13.2c0-2.4 1.8-4.4 7-4.4s7 2 7 4.4",
				fill: "none",
				stroke: "var(--color-ivory)",
				strokeWidth: "1.8",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 8.8V11",
				fill: "none",
				stroke: "var(--color-ivory)",
				strokeWidth: "1.8",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10.2 14.2 16 22.6l5.8-8.4",
				fill: "none",
				stroke: "var(--color-ivory)",
				strokeWidth: "1.8",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		]
	});
}
function Footer() {
	const lang = useAppStore((s) => s.lang);
	const t = copy[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-ivory pb-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-medium text-ink",
						children: t.brand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: t.footerNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: lang === "hi" ? `${SHOP.areaHi}, ${SHOP.cityHi}` : `${SHOP.areaEn}, ${SHOP.cityEn}`
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1 text-sm text-muted sm:text-right",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: telHref(),
						className: "hover:text-ink",
						children: ["+91 ", SHOP.phoneDisplay]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: whatsappChatHref(),
						target: "_blank",
						rel: "noopener noreferrer",
						className: "hover:text-ink",
						children: "WhatsApp"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: mapsHref(),
						target: "_blank",
						rel: "noopener noreferrer",
						className: "hover:text-ink",
						children: t.visitMap
					})
				]
			})]
		})
	});
}
function Header() {
	const lang = useAppStore((s) => s.lang);
	const setLang = useAppStore((s) => s.setLang);
	const openSheet = useAppStore((s) => s.openSheet);
	const t = copy[lang];
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = lang;
	}, [lang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-ivory",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#top",
					className: "flex min-w-0 items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-display text-lg leading-tight font-medium tracking-tight text-ink sm:text-xl",
							children: t.brandShort
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden truncate text-xs text-muted sm:block",
							children: t.area
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-6 text-sm text-muted md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#services",
							className: "hover:text-ink",
							children: t.navServices
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#how",
							className: "hover:text-ink",
							children: t.navHow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#visit",
							className: "hover:text-ink",
							children: t.area
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 sm:gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-full border border-border bg-linen p-0.5",
							role: "group",
							"aria-label": "Language",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLang("hi"),
								className: cn("h-8 min-w-9 rounded-full px-2 text-xs font-medium", lang === "hi" ? "bg-ivory text-ink shadow-sm" : "text-muted"),
								children: t.langHi
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLang("en"),
								className: cn("h-8 min-w-9 rounded-full px-2 text-xs font-medium", lang === "en" ? "bg-ivory text-ink shadow-sm" : "text-muted"),
								children: t.langEn
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "icon",
							className: "hidden sm:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: telHref(),
								"aria-label": t.call,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "icon",
							className: "hidden sm:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: whatsappChatHref(),
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": t.chat,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => openSheet("book"),
							className: "hidden sm:inline-flex",
							children: t.navBook
						})
					]
				})
			]
		})
	});
}
function Hero() {
	const lang = useAppStore((s) => s.lang);
	const t = copy[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium tracking-wide text-rose",
					children: t.heroKicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl leading-[1.15] font-medium tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.35rem]",
					children: t.heroTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-lg text-base leading-relaxed text-pretty text-muted sm:text-lg",
					children: t.heroLead
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-lg text-sm leading-relaxed text-pretty text-ink/80",
					children: t.heroArea
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#services",
							children: t.heroCta
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: whatsappChatHref(),
							target: "_blank",
							rel: "noopener noreferrer",
							children: t.heroSecondary
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "overflow-hidden rounded-2xl border border-border bg-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/hero-atelier.jpg",
					alt: lang === "hi" ? "धूप में लटकती साड़ियाँ, देव ड्राई क्लीनर्स की दुकान जैसा दृश्य" : "Silk sarees hanging in warm morning light at the dryclean atelier",
					className: "aspect-[4/5] w-full object-cover object-center sm:aspect-[4/5] lg:aspect-[5/6]",
					width: 900,
					height: 1200
				})
			})
		})]
	});
}
function HowItWorks() {
	const lang = useAppStore((s) => s.lang);
	const t = copy[lang];
	const steps = [
		{
			n: "01",
			title: t.how1Title,
			body: t.how1Body
		},
		{
			n: "02",
			title: t.how2Title,
			body: t.how2Body
		},
		{
			n: "03",
			title: t.how3Title,
			body: t.how3Body
		},
		{
			n: "04",
			title: t.how4Title,
			body: t.how4Body
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "how",
		className: "mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-12 lg:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl",
					children: t.howTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-md text-muted text-pretty",
					children: t.howLead
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "overflow-hidden rounded-2xl border border-border lg:col-span-7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/pickup-door.jpg",
					alt: lang === "hi" ? "घर के द्वार पर कपड़ों की टोकरी — होम पिकअप" : "A basket of clothes at the doorway, ready for home pickup",
					className: "aspect-[16/10] w-full object-cover",
					width: 1200,
					height: 750
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-2xl border border-border bg-ivory p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm tracking-wide text-rose",
						children: step.n
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-display text-xl font-medium tracking-tight text-ink",
						children: step.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: step.body
					})
				]
			}, step.n))
		})]
	});
}
function ServiceArea() {
	const lang = useAppStore((s) => s.lang);
	const t = copy[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "area",
		className: "sr-only",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-border bg-ivory px-6 py-8 sm:px-10 sm:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl",
					children: t.areaTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-pretty text-muted",
					children: t.areaLead
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 flex flex-wrap gap-2",
					children: t.areaPlaces.map((place) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-full border border-border bg-linen px-3 py-1.5 text-sm text-ink",
						children: place
					}, place))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted",
					children: [
						t.brand,
						" · ",
						lang === "hi" ? SHOP.areaHi : SHOP.areaEn,
						",",
						" ",
						lang === "hi" ? SHOP.cityHi : SHOP.cityEn,
						" · 848101 · +91 ",
						SHOP.phoneDisplay
					]
				})
			]
		})
	});
}
function Testimonials() {
	const lang = useAppStore((s) => s.lang);
	const t = copy[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-6 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl",
			children: t.storiesTitle
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-8 grid gap-4 md:grid-cols-3",
			children: t.stories.map((story) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-col rounded-2xl border border-border bg-ivory p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "flex-1 font-display text-xl leading-snug text-ink",
						children: story.quote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm font-medium text-ink",
						children: story.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: story.place
					})
				]
			}, story.name))
		})]
	});
}
function TrustBar() {
	const lang = useAppStore((s) => s.lang);
	const t = copy[lang];
	const items = [
		{
			title: t.trustYears,
			sub: t.trustYearsSub
		},
		{
			title: t.trustPickup,
			sub: t.trustPickupSub
		},
		{
			title: t.trustSilk,
			sub: t.trustSilkSub
		},
		{
			title: t.trustPay,
			sub: t.trustPaySub
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-ivory",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border sm:grid-cols-4",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-ivory px-4 py-5 sm:px-6 sm:py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl font-medium tracking-tight text-ink sm:text-2xl",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: item.sub
				})]
			}, item.title))
		})
	});
}
function Visit() {
	const lang = useAppStore((s) => s.lang);
	const t = copy[lang];
	const mapSlot = (0, import_react.useRef)(null);
	const [showMap, setShowMap] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = mapSlot.current;
		if (!el) return;
		const io = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				setShowMap(true);
				io.disconnect();
			}
		}, { rootMargin: "240px" });
		io.observe(el);
		return () => io.disconnect();
	}, []);
	const facts = [
		{
			icon: UserRound,
			label: t.founderLabel,
			value: t.founder
		},
		{
			icon: MapPin,
			label: t.addressLabel,
			value: lang === "hi" ? `${SHOP.areaHi}, ${SHOP.cityHi} ८४८१०१` : `${SHOP.areaEn}, ${SHOP.cityEn} 848101`
		},
		{
			icon: Clock,
			label: t.hoursLabel,
			value: lang === "hi" ? SHOP.hoursHi : SHOP.hoursEn
		},
		{
			icon: Phone,
			label: t.phoneLabel,
			value: SHOP.phoneDisplay
		},
		{
			icon: Wallet,
			label: t.payLabel,
			value: t.payValue
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "visit",
		className: "mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl",
					children: t.visitTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted",
					children: t.visitLead
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 space-y-5",
					children: facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 shrink-0 place-items-center rounded-lg bg-soft text-rose",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(fact.icon, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-medium tracking-wide text-muted uppercase",
							children: fact.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-ink",
							children: fact.value
						})] })]
					}, fact.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: mapsHref(),
							target: "_blank",
							rel: "noopener noreferrer",
							children: t.visitMap
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: telHref(),
							children: t.visitCall
						})
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				ref: mapSlot,
				className: "overflow-hidden rounded-2xl border border-border bg-soft",
				children: showMap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: lang === "hi" ? "देव ड्राई क्लीनर्स का नक्शा" : "Map of Dev Dry Cleaners",
					src: shopEmbedSrc(),
					className: "h-full min-h-80 w-full border-0",
					loading: "lazy",
					referrerPolicy: "no-referrer-when-downgrade",
					allowFullScreen: true
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid min-h-80 place-items-center px-6 text-center text-sm text-muted",
					children: t.visitMap
				})
			})]
		})
	});
}
function Home() {
	const data = Route$2.useLoaderData();
	const setListings = useAppStore((s) => s.setListings);
	(0, import_react.useLayoutEffect)(() => {
		setListings(data.items, data.categories, data.subcategories);
	}, [
		data.items,
		data.categories,
		data.subcategories,
		setListings
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "top",
		className: "min-h-dvh bg-linen text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustBar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogGrid, {
					items: data.items,
					categories: data.categories,
					subcategories: data.subcategories
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarePromise, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceArea, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Visit, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Faq, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingDrawer, {})
		]
	});
}
//#endregion
export { Home as component };
