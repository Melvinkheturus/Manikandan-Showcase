# Cloudinary Integration for Resume Uploads

This document explains how to set up and use Cloudinary for resume uploads in the portfolio CMS.

## Setting Up Cloudinary

1. Create a Cloudinary account at https://cloudinary.com/
2. From your Cloudinary dashboard, get your Cloud Name
3. Create an upload preset:
   - Go to Settings > Upload
   - Scroll to "Upload presets" section
   - Click "Add upload preset"
   - Set the mode to "Unsigned" for client-side uploads
   - Name it something like "portfolio_resumes"
   - Under "Folder", enter "resumes"
   - Under "Allowed formats", specify "pdf"
   - Save the preset

## Configuration

Update the `CLOUDINARY_CONFIG` object in `src/admin/pages/sections/about/ConnectTab.jsx` with your Cloudinary credentials:

```javascript
const CLOUDINARY_CONFIG = {
  cloudName: 'your-cloud-name-here', // Replace with your cloud name
  uploadPreset: 'portfolio_resumes', // Replace with your upload preset
  folder: 'resumes'
};
```

## How It Works

The resume upload flow works as follows:

1. User selects a PDF file through the CloudinaryUploader component
2. The component validates the file type and size (max 5MB)
3. If valid, the file is uploaded directly to Cloudinary (client-side)
4. Cloudinary returns a URL for the uploaded file
5. The URL is stored in the Supabase `resume` table
6. The resume URL is displayed with a preview link

## Security Considerations

- Uploads are limited to PDFs only
- File size is limited to 5MB
- Since we're using unsigned uploads, make sure to:
  - Set allowed formats in your upload preset
  - Enable moderation if needed
  - Consider setting up a delivery profile with transformations to enforce security

## Supabase Storage vs. Cloudinary

We use Cloudinary for resume uploads because:

1. Cloudinary provides better PDF handling and previewing
2. Cloudinary offers automatic backup and optimization
3. Cloudinary supports easy PDF transformations if needed

We use Supabase Storage for toolkit icons because:
1. Icons are simpler file types (PNG, SVG)
2. Icons are directly related to database records
3. Storage is included with your Supabase plan

## CloudinaryUploader Component

The `CloudinaryUploader` component in `src/admin/components/CloudinaryUploader.jsx` is a reusable component for uploading files to Cloudinary. It accepts the following props:

```javascript
{
  onUploadSuccess, // Callback function with uploaded file URL
  onUploadError, // Callback function with error message
  uploadPreset, // Cloudinary upload preset name
  cloudName, // Cloudinary cloud name
  resourceType = 'raw', // Cloudinary resource type (default: 'raw' for PDFs)
  folder = 'resumes', // Cloudinary folder name
  buttonText = 'Upload PDF', // Upload button text
  acceptTypes = '.pdf', // File input accept attribute
  maxSize = 5 * 1024 * 1024 // Maximum file size in bytes (default: 5MB)
}
```

You can use this component for other file uploads by adjusting the props accordingly. 