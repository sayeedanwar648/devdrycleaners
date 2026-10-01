import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import {
  SEED_CATEGORIES,
  SEED_ITEMS,
  SEED_SUBCATEGORIES,
  SEED_VERSION,
  isIconId,
  type CatalogCategory,
  type CatalogItem,
  type CatalogSubcategory,
} from "@/lib/catalog";

type CategoryRow = {
  id: string;
  name_hi: string;
  name_en: string;
  sort_order: number;
};

type SubcategoryRow = {
  id: string;
  category_id: string;
  name_hi: string;
  name_en: string;
  sort_order: number;
};

type ItemRow = {
  id: string;
  name_hi: string;
  name_en: string;
  category_id: string;
  subcategory_id: string | null;
  price: number;
  days: number;
  icon: string;
  image: string;
  pieces: number;
  featured: boolean;
  active: boolean;
  sort_order: number;
  reg_no: number;
};

function mapCategory(row: CategoryRow): CatalogCategory {
  return {
    id: row.id,
    nameHi: row.name_hi,
    nameEn: row.name_en,
    sortOrder: Number(row.sort_order),
  };
}

function mapSubcategory(row: SubcategoryRow): CatalogSubcategory {
  return {
    id: row.id,
    categoryId: row.category_id,
    nameHi: row.name_hi,
    nameEn: row.name_en,
    sortOrder: Number(row.sort_order),
  };
}

function mapItem(row: ItemRow): CatalogItem {
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
    regNo: Number(row.reg_no) || 0,
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

  const ver = await sql<{ value: string }>`
    select value from catalog_meta where key = 'seed_version'
  `;
  if (ver[0]?.value === SEED_VERSION) return;

  await sql`delete from catalog_items`;
  await sql`delete from catalog_subcategories`;
  await sql`delete from catalog_categories`;

  for (const cat of SEED_CATEGORIES) {
    await sql`
      insert into catalog_categories (id, name_hi, name_en, sort_order)
      values (${cat.id}, ${cat.nameHi}, ${cat.nameEn}, ${cat.sortOrder})
    `;
  }
  for (const sub of SEED_SUBCATEGORIES) {
    await sql`
      insert into catalog_subcategories (id, category_id, name_hi, name_en, sort_order)
      values (${sub.id}, ${sub.categoryId}, ${sub.nameHi}, ${sub.nameEn}, ${sub.sortOrder})
    `;
  }
  for (const item of SEED_ITEMS) {
    await sql`
      insert into catalog_items (
        id, name_hi, name_en, category_id, subcategory_id, price, days, icon, image, pieces, featured, active, sort_order, reg_no
      )
      values (
        ${item.id}, ${item.nameHi}, ${item.nameEn}, ${item.category}, ${item.subcategory},
        ${item.price}, ${item.days}, ${item.icon}, ${item.image}, ${item.pieces},
        ${item.featured}, ${item.active}, ${item.sortOrder}, ${item.regNo}
      )
    `;
  }
  await sql`
    insert into catalog_meta (key, value)
    values ('seed_version', ${SEED_VERSION})
    on conflict (key) do update set value = excluded.value
  `;
}

async function fetchListings(activeOnly: boolean) {
  await ensureSeed();
  const sql = await getSql();
  const categories = await sql<CategoryRow>`
    select id, name_hi, name_en, sort_order
    from catalog_categories
    order by sort_order, id
  `;
  const subcategories = await sql<SubcategoryRow>`
    select id, category_id, name_hi, name_en, sort_order
    from catalog_subcategories
    order by sort_order, id
  `;
  const items = activeOnly
    ? await sql<ItemRow>`
        select id, name_hi, name_en, category_id, subcategory_id, price, days, icon, image, pieces, featured, active, sort_order, reg_no
        from catalog_items
        where active = true
        order by sort_order, reg_no, id
      `
    : await sql<ItemRow>`
        select id, name_hi, name_en, category_id, subcategory_id, price, days, icon, image, pieces, featured, active, sort_order, reg_no
        from catalog_items
        order by sort_order, reg_no, id
      `;
  return {
    categories: categories.map(mapCategory),
    subcategories: subcategories.map(mapSubcategory),
    items: items.map(mapItem),
  };
}

export const listPublicCatalog = createServerFn({ method: "GET" }).handler(
  async () => fetchListings(true),
);
