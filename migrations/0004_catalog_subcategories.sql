create table if not exists catalog_subcategories (
  id text primary key,
  category_id text not null references catalog_categories(id),
  name_hi text not null,
  name_en text not null,
  sort_order integer not null default 0
);

alter table catalog_items add column if not exists subcategory_id text;

create index if not exists catalog_subcategories_cat_idx
  on catalog_subcategories (category_id, sort_order);

create index if not exists catalog_items_sub_idx
  on catalog_items (subcategory_id);
