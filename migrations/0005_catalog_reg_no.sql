alter table catalog_items add column if not exists reg_no integer not null default 0;
create index if not exists catalog_items_reg_idx on catalog_items (category_id, reg_no, id);
