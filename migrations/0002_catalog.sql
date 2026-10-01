create table if not exists catalog_categories (
  id text primary key,
  name_hi text not null,
  name_en text not null,
  sort_order integer not null default 0
);

create table if not exists catalog_items (
  id text primary key,
  name_hi text not null,
  name_en text not null,
  category_id text not null references catalog_categories(id),
  price integer not null check (price > 0),
  days integer not null check (days >= 1 and days <= 30),
  icon text not null,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists catalog_items_category_idx on catalog_items (category_id);
create index if not exists catalog_items_sort_idx on catalog_items (sort_order, id);
