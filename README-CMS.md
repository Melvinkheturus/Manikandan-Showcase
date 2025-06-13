# Portfolio CMS Setup Guide

This guide will help you set up the Content Management System (CMS) for your portfolio using Supabase.

## Supabase Setup

Your Supabase project is already configured with the following details:

- **Project URL**: https://oudwcxvsraqhpflglnbb.supabase.co
- **Anon Public Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91ZHdjeHZzcmFxaHBmbGdsbmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MDgyMTAsImV4cCI6MjA2MjI4NDIxMH0.9-acHMTNEErYJhOp37dAV4s82b4rxBtEKQpoRFjQqAQ

### Database Schema Setup

1. Log in to your Supabase dashboard: https://app.supabase.com
2. Navigate to your project
3. Go to the SQL Editor
4. Create the required tables by running the SQL commands in the `supabase-schema.sql` file

### Storage Bucket Setup

1. In your Supabase dashboard, go to Storage
2. Create a new bucket called `project-images`
3. Set the following permissions:
   - Turn on RLS (Row Level Security)
   - Create policies to allow:
     - Anyone to download/view images
     - Authenticated users to upload images

### Authentication Setup

1. In your Supabase dashboard, go to Authentication > Providers
2. Make sure Email provider is enabled
3. Under Authentication > Settings:
   - Set Site URL to your deployed website URL
   - Enable "Confirm email" option

## Accessing the CMS

1. Deploy your website to Vercel
2. Access the CMS at `/admin`
3. You'll need to create your first admin user:
   - Go to Authentication > Users in your Supabase dashboard
   - Click "Add User" and fill in the details
   - Set a secure password

### Testing Login Functionality

To test the login page and authentication:

1. Navigate to `/admin` in your browser
2. You will be automatically redirected to `/admin/login`
3. Enter the email and password for the user you created in Supabase
4. Upon successful login, you will be redirected to the admin dashboard
5. If you prefer not to use passwords, you can use the "Sign in with magic link" option
   - This will send a login link to your email
   - Click the link to authenticate

If you encounter login issues:
- Check that the email/password combination is correct
- Verify that your Supabase authentication settings are properly configured
- Ensure the user has been created in the Supabase Authentication dashboard
- Check browser console for any authentication errors

## CMS Features

The CMS allows you to:

1. Manage projects (add, edit, delete)
2. View and respond to contact messages
3. Adjust site-wide settings

## Troubleshooting

If you encounter issues with the CMS:

1. Check the browser console for errors
2. Verify your Supabase API credentials in `src/utils/supabaseClient.js`
3. Make sure the SQL schema has been applied correctly
4. Confirm that storage buckets are properly configured

## Security Considerations

- The CMS uses Supabase's built-in authentication
- Row-level security policies control access to your data
- Only authenticated users can modify content
- Public users can only read projects and submit contact forms 