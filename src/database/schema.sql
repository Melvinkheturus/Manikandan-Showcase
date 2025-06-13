-- Database Schema for Portfolio CMS

-- Page Sections Table (for home page sections)
create table if not exists page_sections (
  id         serial primary key,
  slug       text unique not null,     -- e.g., 'hero', 'about', etc.
  enabled    boolean not null default true,
  position   integer not null default 0,
  content    jsonb not null,
  updated_at timestamptz not null default now()
);

-- Projects Table
create table if not exists projects (
  id          serial primary key,
  slug        text unique not null,       -- e.g., 'examinerpro', 'rapido'
  title       text not null,
  description text not null,
  thumbnail   text,                       -- URL to image
  tags        text[],                     -- Array of tags like ['React', 'Supabase']
  featured    boolean default false,      -- Show on homepage
  live_url    text,                       -- Live site link
  source_url  text,                       -- GitHub/source code link
  content     jsonb not null,             -- Rich structured content (for project detail page)
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Project Sections Table (for project detail pages)
create table if not exists project_sections (
  id          serial primary key,
  slug        text not null,              -- e.g., 'intro', 'meta', 'problem-solution'
  enabled     boolean not null default true,
  position    integer not null default 0, -- determines section order
  content     jsonb not null,             -- flexible content block
  updated_at  timestamptz not null default now()
);

-- Global Settings Table
create table if not exists global_settings (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,       -- e.g., 'site_info', 'audio_settings', 'appearance'
  value       jsonb not null,             -- stores structured settings data
  updated_at  timestamptz not null default now()
);

-- About Me Section Schema with RLS (Row Level Security)

-- About me table - stores "Who am I" text and creator roles
CREATE TABLE about_me (
  id SERIAL PRIMARY KEY,
  bio TEXT NOT NULL DEFAULT '',
  roles JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- Toolkit table - stores toolkit entries (icon URL, name, capabilities)
CREATE TABLE toolkit (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon_url TEXT,
  capabilities JSONB NOT NULL DEFAULT '[]',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- Social links table - stores social platform links
CREATE TABLE social_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(30) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- Resume table - stores resume file URL
CREATE TABLE resume (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- Enable Row Level Security
ALTER TABLE about_me ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolkit ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

-- Create policies for each table

-- About Me Policies
CREATE POLICY "Allow authenticated users to view about_me"
  ON about_me
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to insert their own about_me"
  ON about_me
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to update their own about_me"
  ON about_me
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to delete their own about_me"
  ON about_me
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Toolkit Policies
CREATE POLICY "Allow authenticated users to view toolkit"
  ON toolkit
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to insert their own toolkit"
  ON toolkit
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to update their own toolkit"
  ON toolkit
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to delete their own toolkit"
  ON toolkit
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Social Links Policies
CREATE POLICY "Allow authenticated users to view social_links"
  ON social_links
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to insert their own social_links"
  ON social_links
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to update their own social_links"
  ON social_links
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to delete their own social_links"
  ON social_links
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Resume Policies
CREATE POLICY "Allow authenticated users to view resume"
  ON resume
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to insert their own resume"
  ON resume
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to update their own resume"
  ON resume
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to delete their own resume"
  ON resume
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Functions

-- Function to automatically set updated_at to NOW() on update
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamp
CREATE TRIGGER update_about_me_updated_at
BEFORE UPDATE ON about_me
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_toolkit_updated_at
BEFORE UPDATE ON toolkit
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_social_links_updated_at
BEFORE UPDATE ON social_links
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_resume_updated_at
BEFORE UPDATE ON resume
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Public access policy (optional - if you want to allow public view access to some data)
CREATE POLICY "Allow public to view about_me"
  ON about_me
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public to view toolkit"
  ON toolkit
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public to view social_links"
  ON social_links
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public to view resume"
  ON resume
  FOR SELECT
  TO anon
  USING (true);

-- Storage bucket for toolkit icons
-- Note: Run this in Supabase SQL Editor manually, as it uses special Supabase extensions
-- This is just for reference:

/*
-- Create a storage bucket for toolkit icons
INSERT INTO storage.buckets (id, name, public) VALUES ('toolkit-icons', 'toolkit-icons', true);

-- Allow authenticated users to upload/modify/delete their own files in the bucket
CREATE POLICY "Allow authenticated users to manage toolkit icons"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'toolkit-icons' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'toolkit-icons' AND auth.uid() = owner);
  
-- Make all files in the bucket publicly readable
CREATE POLICY "Allow public to read toolkit icons"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'toolkit-icons');
*/

-- Row Level Security Policies

-- Enable RLS on all tables
alter table page_sections enable row level security;
alter table projects enable row level security;
alter table project_sections enable row level security;
alter table global_settings enable row level security;

-- Page Sections Policies
create policy "Select page_sections for authenticated"
  on page_sections for select using (auth.role() = 'authenticated');

create policy "Update page_sections for authenticated"
  on page_sections for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Prevent page_sections inserts"
  on page_sections for insert with check (false);

create policy "Prevent page_sections deletes"
  on page_sections for delete using (false);

-- Projects Policies
create policy "Select projects for authenticated"
  on projects for select using (auth.role() = 'authenticated');

create policy "Insert projects for authenticated"
  on projects for insert with check (auth.role() = 'authenticated');

create policy "Update projects for authenticated"
  on projects for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Delete projects for authenticated"
  on projects for delete using (auth.role() = 'authenticated');

-- Project Sections Policies
create policy "Select project_sections for authenticated"
  on project_sections for select using (auth.role() = 'authenticated');

create policy "Insert project_sections for authenticated"
  on project_sections for insert with check (auth.role() = 'authenticated');

create policy "Update project_sections for authenticated"
  on project_sections for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Delete project_sections for authenticated"
  on project_sections for delete using (auth.role() = 'authenticated');

-- Global Settings Policies
create policy "Select global_settings for authenticated"
  on global_settings for select using (auth.role() = 'authenticated');

create policy "Insert global_settings for authenticated"
  on global_settings for insert with check (auth.role() = 'authenticated');

create policy "Update global_settings for authenticated"
  on global_settings for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Delete global_settings for authenticated"
  on global_settings for delete using (auth.role() = 'authenticated'); 