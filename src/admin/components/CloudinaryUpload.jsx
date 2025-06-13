import { useState, useEffect } from 'react';

const CloudinaryUpload = ({ onUpload, multiple = false, value = multiple ? [] : '', preview = true }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState(multiple ? [] : '');
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  
  // Set initial values if provided
  useEffect(() => {
    if (value) {
      setUploadedUrls(value);
    }
  }, [value]);

  // Load Cloudinary upload widget script
  useEffect(() => {
    if (!document.getElementById('cloudinary-upload-widget-script')) {
      const script = document.createElement('script');
      script.id = 'cloudinary-upload-widget-script';
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => setWidgetLoaded(true);
      document.body.appendChild(script);
    } else {
      setWidgetLoaded(true);
    }
    
    return () => {
      // Clean up preview URLs when component unmounts
      if (!multiple && typeof uploadedUrls === 'string' && uploadedUrls.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedUrls);
      } else if (multiple) {
        uploadedUrls.forEach(url => {
          if (url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
      }
    };
  }, []);

  const handleUpload = () => {
    if (!widgetLoaded) {
      console.error("Cloudinary widget hasn't loaded yet");
      return;
    }
    
    setUploading(true);
    
    const uploadOptions = {
      cloudName: 'manikandan-showcase',
      uploadPreset: 'portfolio-upload', // Make sure to create this preset in Cloudinary dashboard
      sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
      multiple: multiple,
      folder: 'portfolio',
      resourceType: 'auto', // auto-detect file type
      clientAllowedFormats: ['image', 'video'], // Limit to images and videos
      maxImageFileSize: 10000000, // 10MB limit
      maxVideoFileSize: 100000000, // 100MB limit
      styles: {
        palette: {
          window: "#0b0f19",
          windowBorder: "#2e3440",
          tabIcon: "#81a1c1",
          menuIcons: "#88c0d0",
          textDark: "#ffffff",
          textLight: "#1e2430",
          link: "#5e81ac",
          action: "#8fbcbb",
          inactiveTabIcon: "#596682",
          error: "#bf616a",
          inProgress: "#a3be8c",
          complete: "#88c0d0",
          sourceBg: "#1e2430"
        },
        fonts: {
          default: null,
          "'Poppins', sans-serif": {
            url: "https://fonts.googleapis.com/css?family=Poppins",
            active: true
          }
        }
      },
    };

    const widget = window.cloudinary.createUploadWidget(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          setUploading(false);
          return;
        }
        
        if (result.event === 'success') {
          const imageUrl = result.info.secure_url;
          
          if (multiple) {
            // For multiple files, add to array
            const newUrls = [...uploadedUrls, imageUrl];
            setUploadedUrls(newUrls);
            onUpload(newUrls);
          } else {
            // For single file, replace existing
            setUploadedUrls(imageUrl);
            onUpload(imageUrl);
          }
        }
        
        if (result.event === 'close') {
          setUploading(false);
        }
      }
    );

    widget.open();
  };

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
  
  // Function to render previews
  const renderPreviews = () => {
    if (!preview) return null;
    
    if (multiple && uploadedUrls.length > 0) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
          {uploadedUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img 
                src={url} 
                alt={`Upload ${index+1}`} 
                className="h-24 w-full object-cover rounded shadow-md border border-gray-700"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      );
    } else if (!multiple && uploadedUrls) {
      return (
        <div className="relative group inline-block mt-3">
          <img 
            src={uploadedUrls} 
            alt="Upload preview" 
            className="h-32 object-contain rounded shadow-md border border-gray-700"
          />
          <button
            type="button"
            onClick={() => handleRemove(uploadedUrls)}
            className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleUpload}
        disabled={!widgetLoaded || uploading}
        className={`px-4 py-2 rounded-lg flex items-center justify-center ${
          uploading 
            ? 'bg-emerald-700/50 cursor-wait' 
            : 'bg-emerald-600 hover:bg-emerald-700 transition-colors'
        } text-white`}
      >
        {uploading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {multiple ? 'Upload Files' : 'Upload File'} to Cloudinary
          </>
        )}
      </button>
      
      {renderPreviews()}
    </div>
  );
};

export default CloudinaryUpload; 