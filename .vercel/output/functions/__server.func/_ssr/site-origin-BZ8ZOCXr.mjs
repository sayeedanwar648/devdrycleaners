import { i as getRequestUrl, t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-origin-BZ8ZOCXr.js
/** Absolute origin of the current request, so canonical and sitemap match the live host. */
var getSiteOrigin_createServerFn_handler = createServerRpc({
	id: "028c3fe95bd4b9466ff5e84b5b81f137bf7e65bcdf949d9ed1114a9dc0097499",
	name: "getSiteOrigin",
	filename: "src/lib/site-origin.ts"
}, (opts) => getSiteOrigin.__executeServer(opts));
var getSiteOrigin = createServerFn({ method: "GET" }).handler(getSiteOrigin_createServerFn_handler, () => {
	try {
		return getRequestUrl().origin;
	} catch {
		return "";
	}
});
//#endregion
export { getSiteOrigin_createServerFn_handler };
