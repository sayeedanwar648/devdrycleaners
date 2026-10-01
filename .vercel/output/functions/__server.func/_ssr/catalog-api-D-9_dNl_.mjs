import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { i as SEED_VERSION, n as SEED_ITEMS, r as SEED_SUBCATEGORIES, s as isIconId, t as SEED_CATEGORIES } from "./catalog-DJVdnh9b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-api-D-9_dNl_.js
var _0002_catalog_default = "create table if not exists catalog_categories (\n  id text primary key,\n  name_hi text not null,\n  name_en text not null,\n  sort_order integer not null default 0\n);\n\ncreate table if not exists catalog_items (\n  id text primary key,\n  name_hi text not null,\n  name_en text not null,\n  category_id text not null references catalog_categories(id),\n  price integer not null check (price > 0),\n  days integer not null check (days >= 1 and days <= 30),\n  icon text not null,\n  featured boolean not null default false,\n  active boolean not null default true,\n  sort_order integer not null default 0,\n  updated_at timestamptz not null default now()\n);\n\ncreate index if not exists catalog_items_category_idx on catalog_items (category_id);\ncreate index if not exists catalog_items_sort_idx on catalog_items (sort_order, id);\n";
var _0003_catalog_photos_default = "alter table catalog_items add column if not exists image text not null default '';\nalter table catalog_items add column if not exists pieces integer not null default 1;\n\ncreate table if not exists catalog_meta (\n  key text primary key,\n  value text not null\n);\n";
var _0004_catalog_subcategories_default = "create table if not exists catalog_subcategories (\n  id text primary key,\n  category_id text not null references catalog_categories(id),\n  name_hi text not null,\n  name_en text not null,\n  sort_order integer not null default 0\n);\n\nalter table catalog_items add column if not exists subcategory_id text;\n\ncreate index if not exists catalog_subcategories_cat_idx\n  on catalog_subcategories (category_id, sort_order);\n\ncreate index if not exists catalog_items_sub_idx\n  on catalog_items (subcategory_id);\n";
var _0005_catalog_reg_no_default = "alter table catalog_items add column if not exists reg_no integer not null default 0;\ncreate index if not exists catalog_items_reg_idx on catalog_items (category_id, reg_no, id);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_catalog.sql": _0002_catalog_default,
			"/migrations/0003_catalog_photos.sql": _0003_catalog_photos_default,
			"/migrations/0004_catalog_subcategories.sql": _0004_catalog_subcategories_default,
			"/migrations/0005_catalog_reg_no.sql": _0005_catalog_reg_no_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
function mapCategory(row) {
	return {
		id: row.id,
		nameHi: row.name_hi,
		nameEn: row.name_en,
		sortOrder: Number(row.sort_order)
	};
}
function mapSubcategory(row) {
	return {
		id: row.id,
		categoryId: row.category_id,
		nameHi: row.name_hi,
		nameEn: row.name_en,
		sortOrder: Number(row.sort_order)
	};
}
function mapItem(row) {
	return {
		id: row.id,
		nameHi: row.name_hi,
		nameEn: row.name_en,
		category: row.category_id,
		subcategory: row.subcategory_id ?? "",
		price: Number(row.price),
		days: Number(row.days),
		icon: isIconId(row.icon) ? row.icon : "shirt",
		image: row.image ?? "",
		pieces: Number(row.pieces) || 1,
		featured: Boolean(row.featured),
		active: Boolean(row.active),
		sortOrder: Number(row.sort_order),
		regNo: Number(row.reg_no) || 0
	};
}
async function ensureSeed() {
	const sql = await getSql();
	await sql`
    create table if not exists catalog_subcategories (
      id text primary key,
      category_id text not null references catalog_categories(id),
      name_hi text not null,
      name_en text not null,
      sort_order integer not null default 0
    )
  `;
	await sql`alter table catalog_items add column if not exists subcategory_id text not null default ''`;
	await sql`alter table catalog_items add column if not exists reg_no integer not null default 0`;
	if ((await sql`
    select value from catalog_meta where key = 'seed_version'
  `)[0]?.value === "register-v12") return;
	await sql`delete from catalog_items`;
	await sql`delete from catalog_subcategories`;
	await sql`delete from catalog_categories`;
	for (const cat of SEED_CATEGORIES) await sql`
      insert into catalog_categories (id, name_hi, name_en, sort_order)
      values (${cat.id}, ${cat.nameHi}, ${cat.nameEn}, ${cat.sortOrder})
    `;
	for (const sub of SEED_SUBCATEGORIES) await sql`
      insert into catalog_subcategories (id, category_id, name_hi, name_en, sort_order)
      values (${sub.id}, ${sub.categoryId}, ${sub.nameHi}, ${sub.nameEn}, ${sub.sortOrder})
    `;
	for (const item of SEED_ITEMS) await sql`
      insert into catalog_items (
        id, name_hi, name_en, category_id, subcategory_id, price, days, icon, image, pieces, featured, active, sort_order, reg_no
      )
      values (
        ${item.id}, ${item.nameHi}, ${item.nameEn}, ${item.category}, ${item.subcategory},
        ${item.price}, ${item.days}, ${item.icon}, ${item.image}, ${item.pieces},
        ${item.featured}, ${item.active}, ${item.sortOrder}, ${item.regNo}
      )
    `;
	await sql`
    insert into catalog_meta (key, value)
    values ('seed_version', ${SEED_VERSION})
    on conflict (key) do update set value = excluded.value
  `;
}
async function fetchListings(activeOnly) {
	await ensureSeed();
	const sql = await getSql();
	const categories = await sql`
    select id, name_hi, name_en, sort_order
    from catalog_categories
    order by sort_order, id
  `;
	const subcategories = await sql`
    select id, category_id, name_hi, name_en, sort_order
    from catalog_subcategories
    order by sort_order, id
  `;
	const items = activeOnly ? await sql`
        select id, name_hi, name_en, category_id, subcategory_id, price, days, icon, image, pieces, featured, active, sort_order, reg_no
        from catalog_items
        where active = true
        order by sort_order, reg_no, id
      ` : await sql`
        select id, name_hi, name_en, category_id, subcategory_id, price, days, icon, image, pieces, featured, active, sort_order, reg_no
        from catalog_items
        order by sort_order, reg_no, id
      `;
	return {
		categories: categories.map(mapCategory),
		subcategories: subcategories.map(mapSubcategory),
		items: items.map(mapItem)
	};
}
var listPublicCatalog_createServerFn_handler = createServerRpc({
	id: "ee5158395d03a124e119bc832d063abdbbcdf6f96edab0d3175b1e35087cb623",
	name: "listPublicCatalog",
	filename: "src/lib/catalog-api.ts"
}, (opts) => listPublicCatalog.__executeServer(opts));
var listPublicCatalog = createServerFn({ method: "GET" }).handler(listPublicCatalog_createServerFn_handler, async () => fetchListings(true));
//#endregion
export { listPublicCatalog_createServerFn_handler };
