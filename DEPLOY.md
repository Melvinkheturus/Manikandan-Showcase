# Deployment Guide for Manikandan Portfolio CMS

This guide covers deploying your portfolio with the custom CMS to Vercel and configuring Supabase.

## Supabase Setup

1. **Create a Supabase Project**
   - Go to https://app.supabase.io/ and create a new project
   - Note your Supabase URL and anon key (you'll need these later)

2. **Disable Public Signups**
   - Go to Authentication → Settings
   - Disable "Enable new user signups"
   - This ensures only your pre-created admin user can access the CMS

3. **Create Admin User**
   - Go to Authentication → Users
   - Click "Add User"
   - Enter your email and a secure password
   - This will be your single admin account

4. **Run Schema Migration Script**
   - Go to SQL Editor
   - Copy and paste the content from `supabase-schema.sql` 
   - Run the script to create all necessary tables and RLS policies

5. **Configure Storage**
   - Go to Storage and create a bucket named "media"
   - Add a public policy for this bucket
   - Set CORS policy to allow requests from your Vercel domain

## Vercel Deployment

1. **Connect to GitHub**
   - Connect your GitHub repository to Vercel
   - Set deploy branch to `main`

2. **Environment Variables**
   - Add these environment variables in your Vercel project settings:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Custom Domain (Optional)**
   - Configure your custom domain in Vercel settings
   - Update CORS policies in Supabase to match

## Accessing the Admin Panel

1. Visit `/admin/login` on your deployed site
2. Log in with the email and password you created earlier
3. You now have full control over your portfolio content

## Important Notes

- The CMS uses a single-user model for simplicity and security
- All changes are immediately live - no need to redeploy
- To rotate your admin password, use the Settings page in the CMS
- Regularly back up your Supabase database as needed 