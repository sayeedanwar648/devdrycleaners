import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useRouter, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as SHOP } from "./catalog-DJVdnh9b.mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-j1D68KYl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-Dm9Pz_4A.css";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "देव ड्राई क्लीनर्स समस्तीपुर | ड्राई क्लीन, लॉन्ड्री और कपड़े धुलाई" },
			{
				name: "description",
				content: "समस्तीपुर, बंगाली टोला में देव ड्राई क्लीनर्स — ड्राई क्लीनिंग, कपड़े धुलाई, लॉन्ड्री और स्टीम प्रेस। करीब 10 किमी तक होम पिकअप। कॉल 8298874800।"
			},
			{
				name: "theme-color",
				content: "#F4EDE4"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Hind:wght@400;500;600&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "hi",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listPublicCatalog = createServerFn({ method: "GET" }).handler(createSsrRpc("ee5158395d03a124e119bc832d063abdbbcdf6f96edab0d3175b1e35087cb623"));
var copy = {
	hi: {
		brand: "देव ड्राई क्लीनर्स",
		brandShort: "देव",
		area: "बंगाली टोला, समस्तीपुर",
		navBook: "बुक करें",
		navServices: "सेवाएँ",
		navHow: "कैसे काम करता है",
		langEn: "EN",
		langHi: "हिं",
		call: "कॉल",
		chat: "व्हाट्सएप",
		heroKicker: "राम कुमार बैठा जी · बंगाली टोला, समस्तीपुर",
		heroTitle: "आपकी साड़ियाँ, हमारे हाथों में सुरक्षित।",
		heroLead: "देव ड्राई क्लीनर्स राम कुमार बैठा जी की दुकान है। पूरा इलाका इन्हें बीस साल से ज़्यादा जानता है। हम कपड़े घर से उठाएँगे, सँभालकर साफ़ करेंगे, और साफ़-सुथरे आपके द्वार तक पहुँचा देंगे।",
		heroArea: "समस्तीपुर में ड्राई क्लीन, कपड़े धुलाई और लॉन्ड्री — बंगाली टोला, समस्तीपुर से करीब दस किलोमीटर तक घर से पिकअप।",
		heroCta: "सामान चुनें",
		heroSecondary: "व्हाट्सएप पर बात करें",
		trustYears: "२०+ साल",
		trustYearsSub: "इसी मोहल्ले में",
		trustPickup: "होम पिकअप",
		trustPickupSub: "₹600+ फ्री डिलीवरी",
		trustSilk: "सिल्क की देखभाल",
		trustSilkSub: "साड़ी और लहंगा",
		trustPay: "पिकअप पर भुगतान",
		trustPaySub: "नकद या UPI",
		howTitle: "चार आसान कदम",
		howLead: "फ़ोन पर लाइन लगाने की ज़रूरत नहीं। चुनिए, भेजिए — बाकी हम संभालेंगे।",
		how1Title: "कपड़े चुनें",
		how1Body: "साड़ी, कुर्ती, सूट या घर का लिनेन — एक-एक करके जोड़ें।",
		how2Title: "व्हाट्सएप भेजें",
		how2Body: "नाम, पता लिखें और अपना Google लोकेशन लगा दें। मैसेज सीधे दुकान पर जाएगा।",
		how3Title: "हम घर आएँगे",
		how3Body: "सामान उठाएँगे, पैसे ले लेंगे, और रसीद देकर चलेंगे।",
		how4Title: "साफ़ कपड़े लौटेंगे",
		how4Body: "ड्राईक्लीन करके घर पहुँचा देंगे — स्टीम प्रेस करके, पैक करके।",
		catalogTitle: "क्या भेजना है?",
		catalogLead: "दुकान के रजिस्टर की दरें। तस्वीर देखकर चुनें, संख्या बढ़ाएँ, व्हाट्सएप भेज दें।",
		catalogNote: "कीमत कपड़े की हालत पर थोड़ी बदल सकती है।",
		catalogSearch: "कपड़ा खोजें — साड़ी, कुर्ता, जैकेट…",
		catalogSearchEmpty: "यह नाम नहीं मिला। दूसरा लिखें या श्रेणी बदलें।",
		catalogSearchClear: "खोज मिटाएँ",
		pieceSet: "पीस सेट",
		all: "सभी",
		categories: {
			daily: "रोज़मर्रा",
			ethnic: "पारंपरिक",
			wedding: "शादी",
			home: "घर"
		},
		items: {
			shirt: "कमीज़",
			pant: "पैंट",
			tshirt: "टी-शर्ट",
			jeans: "जींस",
			kurti: "कुर्ती",
			dupatta: "दुपट्टा",
			sweater: "स्वेटर",
			"cotton-saree": "सूती साड़ी",
			"silk-saree": "सिल्क साड़ी",
			"designer-saree": "डिज़ाइनर साड़ी",
			"salwar-suit": "सलवार सूट",
			kurta: "कुर्ता",
			sherwani: "शेरवानी",
			lehenga: "लहंगा",
			"bridal-lehenga": "ब्राइडल लहंगा",
			gown: "गाउन",
			blazer: "ब्लेज़र / सूट",
			coat: "कोट",
			bedsheet: "बेडशीट",
			blanket: "कंबल",
			quilt: "रजाई",
			curtain: "पर्दा",
			"sofa-cover": "सोफा कवर",
			"iron-only": "केवल स्टीम प्रेस"
		},
		featured: "पसंदीदा",
		each: "प्रति पीस",
		days: "दिन",
		ready: "तैयार",
		careTitle: "रेशम और शादी के कपड़े, धीरे से।",
		careLead: "साड़ी का पल्लू, लहंगे का ज़री, बच्चों की रजाई — हर कपड़े को उसी इज़्ज़त से साफ़ करते हैं जितनी आप रखती हैं।",
		care1: "सिल्क और बनारसी के लिए अलग देखभाल",
		care2: "दाग पहले देखकर बताते हैं",
		care3: "स्टीम प्रेस करके पैक करके लौटाते हैं",
		care4: "शादी से पहले जल्दी सेवा — नोट में लिख दें",
		areaTitle: "दस किलोमीटर के अंदर, घर से।",
		areaLead: "बंगाली टोला, समस्तीपुर की दुकान से लगभग 10 किलोमीटर के घेरे में ड्राई क्लीनिंग, कपड़े धुलाई और लॉन्ड्री की पिकअप-डिलीवरी। पता व्हाट्सएप पर भेज दीजिए — आदर्श नगर हो या स्टेशन रोड, हम आ जाएँगे।",
		areaPlaces: [
			"बंगाली टोला, समस्तीपुर",
			"आदर्श नगर",
			"स्टेशन रोड",
			"कस्बा",
			"मुक्तापुर",
			"हरपुर",
			"ताजपुर रोड",
			"काशीपुर",
			"जीतवारपुर",
			"रेलवे कॉलोनी",
			"मगढ़ाही",
			"चंदौली",
			"शंभूपट्टी",
			"कर्पूरीग्राम",
			"कोर्ट एरिया"
		],
		storiesTitle: "मोहल्ले की बात",
		stories: [
			{
				name: "अंजलि शर्मा",
				place: "बंगाली टोला, समस्तीपुर",
				quote: "पिछले दीवाली पर कांचीपुरम साड़ी दी थी। डर था ज़री खराब हो जाएगा। बैठा जी ने हाथ से देखा, फिर साफ़ किया। चमक वैसी ही रही। अब त्योहार का कपड़ा पहले यहीं आता है।"
			},
			{
				name: "पूजा कुमारी",
				place: "आदर्श नगर",
				quote: "बेटी की शादी का लहंगा घर से उठाया और मुहूर्त से दो दिन पहले लौटा दिया। रंग नहीं उड़ा, काम भी नहीं टूटा। बीच में एक बार भी फ़ोन नहीं करना पड़ा।"
			},
			{
				name: "रीना देवी",
				place: "मोहद्दीनगर रोड",
				quote: "स्कूल से लौटकर दुकान जाने का समय नहीं मिलता। व्हाट्सएप पर कपड़े लिख देती हूँ, शाम को उठा ले जाते हैं। अगले दिन स्टीम प्रेस होकर आ जाता है।"
			},
			{
				name: "संजय प्रसाद",
				place: "स्टेशन रोड",
				quote: "ऑफिस के तीन शर्ट और पैंट नियमित भेजता हूँ। कॉलर की क्रीज टिकती है, और रेट कपड़ा लेने से पहले बता देते हैं। बाद में कोई अलग चार्ज नहीं जुड़ता।"
			},
			{
				name: "मीना देवी",
				place: "मुक्तापुर",
				quote: "जनवरी में डबल बेड का कम्बल दिया था। भारी था, खुद लेकर जाना मुश्किल। धोकर घर पहुँचा दिया। सीलन की गंध निकल गई, रूई भी एक तरफ नहीं सिकुड़ी।"
			},
			{
				name: "सुनीता कुमारी",
				place: "ताजपुर रोड",
				quote: "साड़ी के आँचल पर हल्दी लग गई थी। साफ़ करने से पहले कह दिया कि हल्का निशान रह सकता है। जितना कहा, उतना ही रहा। सच बता देते हैं, इसीलिए भरोसा है।"
			}
		],
		visitTitle: "दुकान पर भी आ सकती हैं",
		visitLead: "देव ड्राई क्लीनर्स · बंगाली टोला, समस्तीपुर · पिन ८४८१०१",
		visitMap: "नक्शा खोलें",
		visitCall: "अभी कॉल करें",
		hoursLabel: "समय",
		phoneLabel: "फ़ोन",
		addressLabel: "पता",
		founderLabel: "संस्थापक",
		founder: "राम कुमार बैठा जी",
		payLabel: "भुगतान",
		payValue: "पिकअप पर नकद या UPI",
		footerNote: "संस्थापक राम कुमार बैठा जी · २००४ से समस्तीपुर की सेवा में।",
		cartTitle: "आपका बैग",
		cartEmpty: "अभी कुछ नहीं चुना। ऊपर से कपड़े जोड़ें।",
		cartEmptyBar: "कपड़े चुनें, या सीधे बुक करें",
		cartTotal: "कुल",
		cartPieces: "पीस",
		bookCta: "व्हाट्सएप पर भेजें",
		reviewCta: "बुकिंग पूरी करें",
		add: "जोड़ें",
		bookingTitle: "पिकअप की बात",
		bookingLead: "इतना भर दें — बाकी मैसेज व्हाट्सएप पर बन जाएगा।",
		fieldName: "आपका नाम",
		fieldPhone: "मोबाइल नंबर",
		fieldAddress: "पूरा पता",
		fieldAddressPh: "घर नंबर, गली, मोहल्ला, पास का मंदिर / दुकान",
		fieldAddressHint: "हाथ से लिखें — घर नंबर और गली ज़रूरी है।",
		geoTitle: "Google लाइव लोकेशन",
		geoLead: "पता लिखना ज़रूरी है। साथ में अपना लाइव लोकेशन लगा दें तो दुकान वाले को आपका घर एकदम सही मिल जाएगा — गली-गली ढूँढने की ज़रूरत नहीं।",
		geoBtn: "मेरा Google लोकेशन लगाएँ",
		geoRetry: "फिर से लगाएँ",
		geoOk: "लोकेशन लग गई",
		geoDenied: "लोकेशन की अनुमति नहीं मिली। ऊपर पता साफ़ लिख दें।",
		geoError: "लोकेशन नहीं मिली। पता लिख दें, या थोड़ी देर बाद फिर कोशिश करें।",
		geoUnsupported: "यह फ़ोन लोकेशन नहीं खोल पा रहा। पता साफ़ लिख दें।",
		geoOpen: "मेरा पिन देखें",
		geoLoading: "लोकेशन लग रही है…",
		geoWaHint: "व्हाट्सएप खुलने के बाद आप वहाँ से लाइव लोकेशन भी शेयर कर सकती हैं।",
		fieldDate: "पिकअप की तारीख",
		fieldSlot: "समय",
		fieldNotes: "नोट (दाग, जल्दी, शादी…)",
		fieldNotesPh: "जैसे: साड़ी पर हल्दी का दाग, शादी शनिवार को है",
		pickupToggle: "होम पिकअप चाहिए",
		deliveryToggle: "होम डिलीवरी चाहिए",
		deliveryHint: "₹600 से कम पर डिलीवरी ₹40। ₹600 या ज़्यादा पर फ्री। छोटे ऑर्डर भी चलेंगे।",
		deliveryFeeLine: "डिलीवरी ₹40",
		deliveryFreeLine: "फ्री डिलीवरी",
		cartClothes: "कपड़े",
		sendWhatsapp: "व्हाट्सएप खोलें",
		needName: "नाम लिखें",
		needPhone: "१० अंकों का मोबाइल लिखें",
		needAddress: "पिकअप का पता लिखें",
		slots: {
			morning: "सुबह 9–12",
			afternoon: "दोपहर 12–4",
			evening: "शाम 4–8"
		},
		whatsapp: {
			greeting: "नमस्ते देव ड्राई क्लीनर्स,",
			name: "नाम",
			phone: "मोबाइल",
			address: "पता",
			geo: "Google लोकेशन",
			pickup: "पिकअप",
			homePickup: "होम पिकअप",
			homeDelivery: "होम डिलीवरी",
			itemsHeading: "सामान:",
			noItems: "• सामान सूची नोट में है / बाद में बताएँगे",
			clothes: "कपड़े",
			deliveryCharge: "डिलीवरी",
			deliveryFree: "फ्री",
			total: "कुल",
			pieces: "पीस",
			readyIn: "लगभग तैयार",
			days: "दिन में",
			notes: "नोट",
			payOnPickup: "भुगतान पिकअप पर (नकद / UPI)।",
			yes: "हाँ",
			no: "नहीं",
			dateOpen: "जैसा तय हो"
		},
		faqTitle: "अक्सर पूछा जाता है",
		faqs: [
			{
				q: "पैसे कब देने हैं?",
				a: "पिकअप के समय। नकद या UPI — जो आपको सहज लगे। डिलीवरी पर भी बात हो सकती है, बस नोट में लिख दें।"
			},
			{
				q: "कपड़े कितने दिन में मिलेंगे?",
				a: "रोज़मर्रा 2 दिन, साड़ी 3 दिन, शादी का लहंगा 4–5 दिन। जल्दी चाहिए तो नोट में लिखें।"
			},
			{
				q: "सिल्क साड़ी सुरक्षित रहेगी?",
				a: "हाँ। रेशम, ज़री और एम्ब्रॉयडरी के लिए अलग देखभाल है — बीस साल से बंगाली टोला, समस्तीपुर की साड़ियाँ बैठा जी के पास आती हैं।"
			},
			{
				q: "डिलीवरी का चार्ज कितना है?",
				a: "ऑर्डर ₹600 से कम हो तो होम डिलीवरी ₹40। ₹600 या ज़्यादा पर डिलीवरी फ्री। छोटे ऑर्डर भी लेते हैं — मना नहीं करते।"
			},
			{
				q: "कहाँ-कहाँ पिकअप करते हैं?",
				a: "बंगाली टोला, समस्तीपुर से करीब 10 किलोमीटर के अंदर — आदर्श नगर, स्टेशन रोड, कस्बा, मुक्तापुर, हरपुर, ताजपुर रोड और समस्तीपुर शहर। पता व्हाट्सएप पर भेज दें।"
			},
			{
				q: "समस्तीपुर में ड्राई क्लीन या लॉन्ड्री कहाँ मिलेगी?",
				a: "देव ड्राई क्लीनर्स, बंगाली टोला, समस्तीपुर, पिन 848101। ड्राई क्लीनिंग, कपड़े धुलाई, लॉन्ड्री और स्टीम प्रेस। फ़ोन या व्हाट्सएप 8298874800।"
			},
			{
				q: "सिर्फ़ कपड़े धुलवाने हैं, ड्राई क्लीन नहीं?",
				a: "हो जाएगा। रोज़मर्रा के कपड़ों की धुलाई और अकेला स्टीम प्रेस, दोनों की दर सूची में है। छोटा ऑर्डर भी मना नहीं करते।"
			}
		]
	},
	en: {
		brand: "Dev Dry Cleaners",
		brandShort: "Dev",
		area: "Bengali Tola, Samastipur",
		navBook: "Book",
		navServices: "Services",
		navHow: "How it works",
		langEn: "EN",
		langHi: "HI",
		call: "Call",
		chat: "WhatsApp",
		heroKicker: "Ram Kumar Baitha Ji · Bengali Tola, Samastipur",
		heroTitle: "Your sarees, held with care.",
		heroLead: "Dev Dry Cleaners — the shop of Ram Kumar Baitha Ji, known across the neighbourhood. Home pickup, gentle cleaning, clothes back at your door. More than twenty years.",
		heroArea: "Dry cleaning, laundry and steam press in Samastipur — home pickup about ten kilometres around Bengali Tola, Samastipur.",
		heroCta: "Choose clothes",
		heroSecondary: "Chat on WhatsApp",
		trustYears: "20+ years",
		trustYearsSub: "in this neighbourhood",
		trustPickup: "Home pickup",
		trustPickupSub: "free delivery over ₹600",
		trustSilk: "Silk care",
		trustSilkSub: "sarees & lehengas",
		trustPay: "Pay on pickup",
		trustPaySub: "cash or UPI",
		howTitle: "Four quiet steps",
		howLead: "No queue at the counter. Select, send — we handle the rest.",
		how1Title: "Pick each piece",
		how1Body: "Saree, kurti, suit or home linen — add them one by one.",
		how2Title: "Send on WhatsApp",
		how2Body: "Name, address, and your Google pin. The message goes straight to the shop.",
		how3Title: "We come home",
		how3Body: "We collect the clothes, take payment, and leave you a note.",
		how4Title: "Fresh clothes return",
		how4Body: "Dry cleaned, pressed, packed — delivered to your door.",
		catalogTitle: "What shall we collect?",
		catalogLead: "Rates from the shop register. Tap a piece, set the count, send it on WhatsApp.",
		catalogNote: "Price may change a little with the condition of the cloth.",
		catalogSearch: "Search clothes — saree, kurta, jacket…",
		catalogSearchEmpty: "Nothing matched. Try another name or change the category.",
		catalogSearchClear: "Clear search",
		pieceSet: "piece set",
		all: "All",
		categories: {
			daily: "Everyday",
			ethnic: "Ethnic",
			wedding: "Wedding",
			home: "Home"
		},
		items: {
			shirt: "Shirt",
			pant: "Trousers",
			tshirt: "T-shirt",
			jeans: "Jeans",
			kurti: "Kurti",
			dupatta: "Dupatta",
			sweater: "Sweater",
			"cotton-saree": "Cotton saree",
			"silk-saree": "Silk saree",
			"designer-saree": "Designer saree",
			"salwar-suit": "Salwar suit",
			kurta: "Kurta",
			sherwani: "Sherwani",
			lehenga: "Lehenga",
			"bridal-lehenga": "Bridal lehenga",
			gown: "Gown",
			blazer: "Blazer / suit",
			coat: "Coat",
			bedsheet: "Bedsheet",
			blanket: "Blanket",
			quilt: "Quilt",
			curtain: "Curtain",
			"sofa-cover": "Sofa cover",
			"iron-only": "Steam press only"
		},
		featured: "Loved",
		each: "each",
		days: "days",
		ready: "ready in",
		careTitle: "Silk and wedding wear, handled gently.",
		careLead: "A pallu, a zari border, a child’s quilt — every piece is cleaned with the same respect you keep it with.",
		care1: "Separate care for silk and Banarasi",
		care2: "We look at stains with you first",
		care3: "Pressed and packed before return",
		care4: "Rush service before a wedding — just note it",
		areaTitle: "Home pickup, within about 10 km.",
		areaLead: "Dry cleaning, clothes washing and laundry, picked up from about 10 kilometres around the Bengali Tola, Samastipur shop. Send the address on WhatsApp — Adarsh Nagar or Station Road, we come.",
		areaPlaces: [
			"Bengali Tola, Samastipur",
			"Adarsh Nagar",
			"Station Road",
			"Kasba",
			"Muktapur",
			"Harpur",
			"Tajpur Road",
			"Kashipur",
			"Jitwarpur",
			"Railway Colony",
			"Magardahi",
			"Chandauli",
			"Shambhupatti",
			"Karpurigram",
			"Court area"
		],
		storiesTitle: "From the neighbourhood",
		stories: [
			{
				name: "Anjali Sharma",
				place: "Bengali Tola, Samastipur",
				quote: "I gave them my Kanchipuram before Diwali. I was afraid the zari would spoil. Baitha Ji checked it by hand, then cleaned it. The sheen stayed. Festival clothes come here first now."
			},
			{
				name: "Pooja Kumari",
				place: "Adarsh Nagar",
				quote: "They picked up my daughter’s wedding lehenga from home and brought it back two days before the muhurat. The colour didn’t run, and the work didn’t break. I didn’t have to call once."
			},
			{
				name: "Reena Devi",
				place: "Mohiuddinagar Road",
				quote: "After school I never have time to go to the shop. I list the clothes on WhatsApp, and they collect them in the evening. Next day they come back steam-pressed."
			},
			{
				name: "Sanjay Prasad",
				place: "Station Road",
				quote: "I regularly send three office shirts and a pair of trousers. The collar crease holds, and they tell me the rate before taking the clothes. Nothing extra is added later."
			},
			{
				name: "Meena Devi",
				place: "Muktapur",
				quote: "In January I gave them a double-bed blanket. It was too heavy to carry myself. They washed it and brought it home. The damp smell was gone, and the filling hadn’t bunched to one side."
			},
			{
				name: "Sunita Kumari",
				place: "Tajpur Road",
				quote: "Haldi had stained the pallu of a saree. Before cleaning, they said a faint mark might remain. It was exactly what they had said. They tell you the truth — that’s why I trust them."
			}
		],
		visitTitle: "Visit the shop, if you like",
		visitLead: "Dev Dry Cleaners · Bengali Tola, Samastipur · PIN 848101",
		visitMap: "Open map",
		visitCall: "Call now",
		hoursLabel: "Hours",
		phoneLabel: "Phone",
		addressLabel: "Address",
		founderLabel: "Founder",
		founder: "Ram Kumar Baitha Ji",
		payLabel: "Payment",
		payValue: "Cash or UPI on pickup",
		footerNote: "Founded by Ram Kumar Baitha Ji · serving Samastipur since 2004.",
		cartTitle: "Your bag",
		cartEmpty: "Nothing chosen yet. Add pieces above.",
		cartEmptyBar: "Choose clothes, or book directly",
		cartTotal: "Total",
		cartPieces: "pieces",
		bookCta: "Send on WhatsApp",
		reviewCta: "Finish booking",
		add: "Add",
		bookingTitle: "Pickup details",
		bookingLead: "A few lines — we turn them into a WhatsApp message for the shop.",
		fieldName: "Your name",
		fieldPhone: "Mobile number",
		fieldAddress: "Full address",
		fieldAddressPh: "House no., lane, neighbourhood, nearby temple / shop",
		fieldAddressHint: "Type it yourself — house number and lane are needed.",
		geoTitle: "Google live location",
		geoLead: "Please write your address. Sharing your live Google pin as well helps us find the exact house — no searching lane by lane.",
		geoBtn: "Share my Google location",
		geoRetry: "Share again",
		geoOk: "Location saved",
		geoDenied: "Location permission was declined. Write the address clearly above.",
		geoError: "Could not get location. Write the address, or try again in a moment.",
		geoUnsupported: "This phone cannot share location. Please write the address clearly.",
		geoOpen: "See my pin",
		geoLoading: "Finding your location…",
		geoWaHint: "Once WhatsApp opens, you can also share a live location from there.",
		fieldDate: "Pickup date",
		fieldSlot: "Time",
		fieldNotes: "Note (stain, rush, wedding…)",
		fieldNotesPh: "e.g. turmeric on the saree, wedding is Saturday",
		pickupToggle: "Home pickup",
		deliveryToggle: "Home delivery",
		deliveryHint: "Under ₹600, home delivery is ₹40. ₹600 or more is free. Small orders are welcome.",
		deliveryFeeLine: "Delivery ₹40",
		deliveryFreeLine: "Free delivery",
		cartClothes: "Clothes",
		sendWhatsapp: "Open WhatsApp",
		needName: "Please add your name",
		needPhone: "Enter a 10-digit mobile number",
		needAddress: "Add the pickup address",
		slots: {
			morning: "Morning 9–12",
			afternoon: "Afternoon 12–4",
			evening: "Evening 4–8"
		},
		whatsapp: {
			greeting: "Hello Dev Dry Cleaners,",
			name: "Name",
			phone: "Mobile",
			address: "Address",
			geo: "Google location",
			pickup: "Pickup",
			homePickup: "Home pickup",
			homeDelivery: "Home delivery",
			itemsHeading: "Items:",
			noItems: "• Item list in notes / will confirm later",
			clothes: "Clothes",
			deliveryCharge: "Delivery",
			deliveryFree: "Free",
			total: "Total",
			pieces: "pcs",
			readyIn: "Ready in about",
			days: "days",
			notes: "Note",
			payOnPickup: "Pay on pickup (cash / UPI).",
			yes: "Yes",
			no: "No",
			dateOpen: "as convenient"
		},
		faqTitle: "Questions, answered",
		faqs: [
			{
				q: "When do I pay?",
				a: "At pickup. Cash or UPI — whichever is easy. Pay on delivery is fine too; mention it in the note."
			},
			{
				q: "How long does it take?",
				a: "Everyday wear in 2 days, sarees in 3, wedding lehengas in 4–5. Need it sooner? Write it in the note."
			},
			{
				q: "Is silk safe?",
				a: "Yes. Silk, zari and embroidery get separate care — Bengali Tola, Samastipur sarees have come to Baitha Ji for twenty years."
			},
			{
				q: "How much is delivery?",
				a: "Home delivery is ₹40 if the order is under ₹600. ₹600 or more is free. We still take small orders — nothing is turned away."
			},
			{
				q: "Where do you pick up?",
				a: "About 10 kilometres around Bengali Tola, Samastipur — Adarsh Nagar, Station Road, Kasba, Muktapur, Harpur, Tajpur Road and Samastipur city. Send the address on WhatsApp."
			},
			{
				q: "Where do I find dry cleaning or laundry in Samastipur?",
				a: "Dev Dry Cleaners, Bengali Tola, Samastipur, PIN 848101. Dry cleaning, clothes washing, laundry and steam press. Call or WhatsApp 8298874800."
			},
			{
				q: "I only want clothes washed, not dry cleaned?",
				a: "That’s fine. Everyday washing and steam press on its own are both on the rate list. Small orders are not turned away."
			}
		]
	}
};
var SEO_TITLE = "देव ड्राई क्लीनर्स समस्तीपुर | ड्राई क्लीन, लॉन्ड्री और कपड़े धुलाई";
var SEO_DESCRIPTION = "समस्तीपुर, बंगाली टोला में देव ड्राई क्लीनर्स — ड्राई क्लीनिंग, कपड़े धुलाई, लॉन्ड्री और स्टीम प्रेस। करीब 10 किमी तक होम पिकअप। कॉल 8298874800।";
var KEYWORDS = [
	"देव ड्राई क्लीनर्स",
	"ड्राई क्लीन समस्तीपुर",
	"ड्राई क्लीनिंग समस्तीपुर",
	"लॉन्ड्री समस्तीपुर",
	"कपड़े धुलाई समस्तीपुर",
	"कपड़ा धुलवाना समस्तीपुर",
	"स्टीम प्रेस समस्तीपुर",
	"होम पिकअप ड्राई क्लीन",
	"dry cleaners in Samastipur",
	"laundry service Samastipur",
	"Bengali Tola dry cleaners",
	"Dev Dry Cleaners"
].join(", ");
function seoHead(origin) {
	const base = origin.replace(/\/$/, "");
	const pageUrl = base ? `${base}/` : void 0;
	const image = base ? `${base}/og.jpg` : "/og.jpg";
	const graph = localBusinessGraph(base);
	return {
		meta: [
			{ title: SEO_TITLE },
			{
				name: "description",
				content: SEO_DESCRIPTION
			},
			{
				name: "keywords",
				content: KEYWORDS
			},
			{
				name: "robots",
				content: "index, follow, max-image-preview:large"
			},
			{
				name: "author",
				content: "राम कुमार बैठा"
			},
			{
				name: "geo.region",
				content: "IN-BR"
			},
			{
				name: "geo.placename",
				content: "Samastipur, Bihar"
			},
			{
				name: "geo.position",
				content: `${SHOP.lat};${SHOP.lng}`
			},
			{
				name: "ICBM",
				content: `${SHOP.lat}, ${SHOP.lng}`
			},
			{
				property: "og:type",
				content: "business.business"
			},
			{
				property: "og:site_name",
				content: "देव ड्राई क्लीनर्स"
			},
			{
				property: "og:locale",
				content: "hi_IN"
			},
			{
				property: "og:locale:alternate",
				content: "en_IN"
			},
			{
				property: "og:title",
				content: SEO_TITLE
			},
			{
				property: "og:description",
				content: SEO_DESCRIPTION
			},
			{
				property: "og:image",
				content: image
			},
			...pageUrl ? [{
				property: "og:url",
				content: pageUrl
			}] : [],
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: SEO_TITLE
			},
			{
				name: "twitter:description",
				content: SEO_DESCRIPTION
			},
			{
				name: "twitter:image",
				content: image
			}
		],
		links: pageUrl ? [{
			rel: "canonical",
			href: pageUrl
		}] : [],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify(graph)
		}]
	};
}
function localBusinessGraph(origin) {
	const pageUrl = origin ? `${origin}/` : void 0;
	const places = copy.hi.areaPlaces.map((name) => ({
		"@type": "Place",
		name: `${name}, समस्तीपुर`,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Samastipur",
			addressRegion: "Bihar",
			addressCountry: "IN"
		}
	}));
	const business = {
		"@type": ["DryCleaningOrLaundry", "LocalBusiness"],
		"@id": pageUrl ? `${pageUrl}#shop` : "#shop",
		name: "देव ड्राई क्लीनर्स",
		alternateName: ["Dev Dry Cleaners", "Dev Drycleaners"],
		description: SEO_DESCRIPTION,
		telephone: `+91${SHOP.phoneRaw}`,
		image: origin ? `${origin}/og.jpg` : "/og.jpg",
		priceRange: "₹₹",
		currenciesAccepted: "INR",
		paymentAccepted: "Cash, UPI",
		address: {
			"@type": "PostalAddress",
			streetAddress: "Bengali Tola",
			addressLocality: "Samastipur",
			addressRegion: "Bihar",
			postalCode: "848101",
			addressCountry: "IN"
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: SHOP.lat,
			longitude: SHOP.lng
		},
		hasMap: SHOP.mapsUrl,
		areaServed: [
			{
				"@type": "GeoCircle",
				name: "About 10 km around Bengali Tola, Samastipur",
				geoMidpoint: {
					"@type": "GeoCoordinates",
					latitude: SHOP.lat,
					longitude: SHOP.lng
				},
				geoRadius: 1e4
			},
			{
				"@type": "City",
				name: "Samastipur"
			},
			...places
		],
		openingHoursSpecification: [{
			"@type": "OpeningHoursSpecification",
			dayOfWeek: [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday"
			],
			opens: "09:00",
			closes: "20:00"
		}],
		founder: {
			"@type": "Person",
			name: "राम कुमार बैठा"
		},
		knowsLanguage: ["hi", "en"],
		makesOffer: [
			"ड्राई क्लीनिंग",
			"कपड़े धुलाई",
			"लॉन्ड्री सर्विस",
			"स्टीम प्रेस",
			"होम पिकअप और डिलीवरी",
			"साड़ी और शादी के कपड़े"
		].map((name) => ({
			"@type": "Offer",
			itemOffered: {
				"@type": "Service",
				name,
				areaServed: "Samastipur"
			}
		})),
		potentialAction: {
			"@type": "ReserveAction",
			name: "WhatsApp पर बुकिंग",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `https://wa.me/${SHOP.whatsappE164}`
			}
		}
	};
	if (pageUrl) business.url = pageUrl;
	return {
		"@context": "https://schema.org",
		"@graph": [business, {
			"@type": "FAQPage",
			...pageUrl ? { url: pageUrl } : {},
			mainEntity: copy.hi.faqs.map((faq) => ({
				"@type": "Question",
				name: faq.q,
				acceptedAnswer: {
					"@type": "Answer",
					text: faq.a
				}
			}))
		}]
	};
}
/** Absolute origin of the current request, so canonical and sitemap match the live host. */
var getSiteOrigin = createServerFn({ method: "GET" }).handler(createSsrRpc("028c3fe95bd4b9466ff5e84b5b81f137bf7e65bcdf949d9ed1114a9dc0097499"));
var $$splitComponentImporter = () => import("./routes-BqFBlLXQ.mjs");
var Route$2 = createFileRoute("/")({
	loader: async () => {
		const [catalog, origin] = await Promise.all([listPublicCatalog(), getSiteOrigin()]);
		return {
			...catalog,
			origin
		};
	},
	head: ({ loaderData }) => seoHead(loaderData?.origin ?? ""),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$1 = createFileRoute("/robots.txt")({ server: { handlers: { GET: async ({ request }) => {
	const body = `User-agent: *\nAllow: /\n\nSitemap: ${new URL(request.url).origin}/sitemap.xml\n`;
	return new Response(body, { headers: {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "public, max-age=86400"
	} });
} } } });
var Route = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async ({ request }) => {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${new URL(request.url).origin}/</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
	return new Response(body, { headers: {
		"Content-Type": "application/xml; charset=utf-8",
		"Cache-Control": "public, max-age=86400"
	} });
} } } });
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	RobotsDottxtRoute: Route$1.update({
		id: "/robots.txt",
		path: "/robots.txt",
		getParentRoute: () => Route$3
	}),
	SitemapDotxmlRoute: Route.update({
		id: "/sitemap.xml",
		path: "/sitemap.xml",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$2 as n, copy as r, router_exports as t };
