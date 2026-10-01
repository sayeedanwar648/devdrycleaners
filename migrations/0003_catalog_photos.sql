alter table catalog_items add column if not exists image text not null default '';
alter table catalog_items add column if not exists pieces integer not null default 1;

create table if not exists catalog_meta (
  key text primary key,
  value text not null
);
