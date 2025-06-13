import { useState, useRef } from 'react';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../../utils/uploadToCloudinary';
import { FiUpload, FiX, FiImage, FiFile, FiLoader } from 'react-icons/fi';

/**
 * CloudinaryUploader component for direct file uploads to Cloudinary
 * 
 * @param {Object} props
 * @param {Function} props.onUpload - Callback function with the uploaded file URL(s)
 * @param {boolean} props.multiple - Allow multiple file uploads
 * @param {string|string[]} props.value - Initial value (URL or array of URLs)
 * @param {string} props.accept - File types to accept
 */
const CloudinaryUploader = ({ 
  onUpload, 
  multiple = false, 
  value = multiple ? [] : '',
  accept = "image/*"
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState(multiple ? (Array.isArray(value) ? value : []) : value || '');
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError('');
    
    try {
      if (multiple) {
        // Handle multiple files
        const urls = await uploadMultipleToCloudinary(files);
        setUploadedUrls(prevUrls => [...prevUrls, ...urls]);
        onUpload([...uploadedUrls, ...urls]);
      } else {
        // Handle single file
        const url = await uploadToCloudinary(files[0]);
        setUploadedUrls(url);
        onUpload(url);
      }
    } catch (err) {
      setError('Upload failed: ' + (err.message || 'Unknown error'));
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle file removal
  const handleRemove = (urlToRemove) => {
    if (multiple) {
      const newUrls = uploadedUrls.filter(url => url !== urlToRemove);
      setUploadedUrls(newUrls);
      onUpload(newUrls);
    } else {
      setUploadedUrls('');
      onUpload('');
    }
  };
  
  // Determine file type for preview
  const getFileType = (url) => {
    if (!url) return 'unknown';
    
    const extension = url.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'mov'].includes(extension)) {
      return 'video';
    } else {
      return 'file';
    }
  };
  
  // Render file previews
  const renderPreviews = () => {
    if (multiple && uploadedUrls.length > 0) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {uploadedUrls.map((url, index) => {
            const fileType = getFileType(url);
            
            return (
              <div key={index} className="relative group bg-gray-800 rounded-md overflow-hidden border border-gray-700">
                <div className="aspect-square relative">
                  {fileType === 'image' ? (
                    <img 
                      src={url} 
                      alt={`Upload ${index+1}`} 
                      className="h-full w-full object-cover"
                    />
                  ) : fileType === 'video' ? (
                    <video 
                      src={url}
                      className="h-full w-full object-cover"
                      controls
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <FiFile size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <FiX size={16} />
                </button>
              </div>
            );
          })}
        </div>
      );
    } else if (!multiple && uploadedUrls) {
      const fileType = getFileType(uploadedUrls);
      
      return (
        <div className="relative group inline-block mt-3 bg-gray-800 rounded-md overflow-hidden border border-gray-700">
          {fileType === 'image' ? (
            <img 
              src={uploadedUrls} 
              alt="Upload preview" 
              className="h-32 object-contain"
            />
          ) : fileType === 'video' ? (
            <video 
              src={uploadedUrls}
              className="h-32 object-contain"
              controls
            />
          ) : (
            <div className="h-32 w-32 flex items-center justify-center">
              <FiFile size={32} className="text-gray-400" />
            </div>
          )}
          
          <button
            type="button"
            onClick={() => handleRemove(uploadedUrls)}
            className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove"
          >
            <FiX size={16} />
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      
      {/* Upload button */}
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
        className={`px-4 py-2 rounded-lg flex items-center justify-center ${
          uploading 
            ? 'bg-emerald-700/50 cursor-wait' 
            : 'bg-emerald-600 hover:bg-emerald-700 transition-colors'
        } text-white`}
      >
        {uploading ? (
          <>
            <FiLoader className="animate-spin mr-2" size={16} />
            Uploading...
          </>
        ) : (
          <>
            <FiUpload className="mr-2" size={16} />
            {multiple ? 'Upload Files' : 'Upload File'}
          </>
        )}
      </button>
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
      
      {/* Upload preview */}
      {renderPreviews()}
      
      {/* Empty state */}
      {!uploading && !uploadedUrls && !multiple && (
        <div className="mt-2 p-4 border border-dashed border-gray-600 rounded-md bg-black/20 text-gray-400 text-center">
          <FiImage className="mx-auto mb-2" size={24} />
          <p className="text-sm">No file selected</p>
          <p className="text-xs">Click the button above to upload</p>
        </div>
      )}
      
      {!uploading && multiple && uploadedUrls.length === 0 && (
        <div className="mt-2 p-4 border border-dashed border-gray-600 rounded-md bg-black/20 text-gray-400 text-center">
          <FiImage className="mx-auto mb-2" size={24} />
          <p className="text-sm">No files selected</p>
          <p className="text-xs">Click the button above to upload</p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploader; 