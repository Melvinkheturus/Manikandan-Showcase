-- -------------
-- Supabase Storage: My Toolkit Icons Setup
-- -------------

-- Create a storage bucket for toolkit icons
-- Note: This must be run in the Supabase SQL Editor
insert into storage.buckets (id, name, public)
values ('toolkit-icons', 'toolkit-icons', true)
on conflict do nothing;

-- Allow authenticated users to upload/modify/delete their own files in the bucket
create policy "Allow authenticated users to upload toolkit icons"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'toolkit-icons' AND auth.uid() = owner);

create policy "Allow authenticated users to update their toolkit icons"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'toolkit-icons' AND auth.uid() = owner);

create policy "Allow authenticated users to delete their toolkit icons"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'toolkit-icons' AND auth.uid() = owner);

-- Make all files in the bucket publicly readable
create policy "Allow public to read toolkit icons"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'toolkit-icons');

-- Grant necessary permissions to the authenticated and anon roles
grant all on storage.buckets to authenticated;
grant select on storage.buckets to anon;
grant all on storage.objects to authenticated;
grant select on storage.objects to anon; 