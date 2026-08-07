-- Trenqura editorial CMS: one public cover image per post.
-- Run once in Supabase Dashboard → SQL Editor.

alter table public.posts
  add column if not exists cover_image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Objects are publicly readable because published articles must render images
-- without a signed-in visitor. Only authenticated administrators can mutate files.
drop policy if exists "post_images_authenticated_insert" on storage.objects;
create policy "post_images_authenticated_insert"
on storage.objects for insert to authenticated
with check (bucket_id = 'post-images');

drop policy if exists "post_images_authenticated_update" on storage.objects;
create policy "post_images_authenticated_update"
on storage.objects for update to authenticated
using (bucket_id = 'post-images')
with check (bucket_id = 'post-images');

drop policy if exists "post_images_authenticated_delete" on storage.objects;
create policy "post_images_authenticated_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'post-images');
