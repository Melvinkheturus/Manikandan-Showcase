/**
 * Uploads a file directly to Cloudinary and returns the secure URL
 * 
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "CMS_Assets"); // Unsigned upload preset name
  formData.append("folder", "portfolio"); // Optional folder name

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/manikandan-showcase/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await res.json();
    return data.secure_url; // Return the Cloudinary secure URL to save in Supabase
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

/**
 * Uploads multiple files to Cloudinary and returns array of secure URLs
 * 
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<string[]>} - Array of secure URLs
 */
export async function uploadMultipleToCloudinary(files) {
  const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
} 