# Portfolio CMS Database

This directory contains the database schema and seed data for Manikandan's portfolio CMS, built with Supabase.

## Files

- `schema.sql` - Contains all table definitions and security policies
- `seed_data.sql` - Contains initial seed data for the portfolio CMS
- `database of portfolio.txt` - Original database schema reference

## Database Structure

The database consists of four main tables:

1. **page_sections** - Homepage content sections (hero, about, skills, etc.)
2. **projects** - Portfolio projects information
3. **project_sections** - Content sections for individual project pages
4. **global_settings** - Site-wide settings and configurations

## Setup Instructions

1. Create a new Supabase project
2. Run the schema.sql in the SQL Editor
3. Run the seed_data.sql to populate initial data
4. Ensure your frontend is configured with the correct Supabase URL and anon key

## Row Level Security

All tables are protected with Row Level Security (RLS):

- Anonymous users have no access by default
- Authenticated users (you/admin) have full CRUD access to projects, project_sections, and global_settings
- For page_sections, authenticated users can only select and update (no insert or delete)

## Content Structure

All content is stored in JSONB format in the `content` or `value` fields, allowing for flexible content modeling without schema changes.

## Relationship between Tables

- Projects can have multiple project_sections
- All content is manageable through the Supabase dashboard or a custom CMS interface 