import React, { useState } from 'react';
import CloudinaryUpload from '../components/CloudinaryUpload';

const MediaUploadGuide = () => {
  const [singleImageUrl, setSingleImageUrl] = useState('');
  const [multipleImageUrls, setMultipleImageUrls] = useState([]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Media Upload Guide</h1>
      
      <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">About Cloudinary Integration</h2>
        <p className="text-gray-300 mb-4">
          This portfolio uses Cloudinary for media storage and optimization. Cloudinary provides automatic responsive image delivery, 
          format optimization, and a global CDN.
        </p>
        
        <div className="bg-emerald-900/20 border-l-4 border-emerald-500 p-4 rounded">
          <h3 className="font-semibold text-emerald-400 mb-1">Benefits</h3>
          <ul className="list-disc ml-5 space-y-1 text-gray-300">
            <li>Images are automatically optimized for web display</li>
            <li>Content is delivered via global CDN for fast loading</li>
            <li>Multiple file formats supported (images, videos, PDFs)</li>
            <li>No storage limitations in your database (only URLs are stored)</li>
            <li>Built-in image transformations and responsive sizing</li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Single Image Upload */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Single Image Upload</h2>
          <p className="text-gray-300 mb-4">
            Use this for uploading thumbnail images or single media files.
          </p>
          
          <CloudinaryUpload 
            onUpload={(url) => setSingleImageUrl(url)} 
            value={singleImageUrl} 
          />
          
          {singleImageUrl && (
            <div className="mt-4">
              <h3 className="font-medium text-sm mb-2">URL for database:</h3>
              <div className="bg-gray-900 p-2 rounded text-xs break-all font-mono">
                {singleImageUrl}
              </div>
            </div>
          )}
        </div>
        
        {/* Multiple Images Upload */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Multiple Images Upload</h2>
          <p className="text-gray-300 mb-4">
            Use this for uploading galleries or multiple media files.
          </p>
          
          <CloudinaryUpload 
            onUpload={(urls) => setMultipleImageUrls(urls)} 
            value={multipleImageUrls} 
            multiple={true} 
          />
          
          {multipleImageUrls.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-sm mb-2">URLs for database (array):</h3>
              <div className="bg-gray-900 p-2 rounded text-xs break-all font-mono">
                {JSON.stringify(multipleImageUrls, null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Advanced Usage */}
      <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Advanced Usage</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Image Transformations</h3>
          <p className="text-gray-300 mb-2">
            You can modify Cloudinary URLs to apply transformations:
          </p>
          <div className="bg-gray-900 p-3 rounded text-sm font-mono">
            {singleImageUrl && singleImageUrl.replace('upload/', 'upload/w_800,c_fill,g_auto/')}
          </div>
          <p className="text-gray-400 text-xs mt-1">
            This URL adds: w_800 (width 800px), c_fill (crop mode), g_auto (intelligent gravity)
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">Common Transformations</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3">Parameter</th>
                <th className="text-left py-2 px-3">Description</th>
                <th className="text-left py-2 px-3">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono">w_600</td>
                <td className="py-2 px-3">Width of 600px</td>
                <td className="py-2 px-3 font-mono">w_600</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono">h_400</td>
                <td className="py-2 px-3">Height of 400px</td>
                <td className="py-2 px-3 font-mono">h_400</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono">c_fill</td>
                <td className="py-2 px-3">Crop to fill dimensions</td>
                <td className="py-2 px-3 font-mono">c_fill</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono">g_auto</td>
                <td className="py-2 px-3">Automatic content-aware gravity</td>
                <td className="py-2 px-3 font-mono">g_auto</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-2 px-3 font-mono">f_auto</td>
                <td className="py-2 px-3">Automatic format selection</td>
                <td className="py-2 px-3 font-mono">f_auto</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono">q_auto</td>
                <td className="py-2 px-3">Automatic quality optimization</td>
                <td className="py-2 px-3 font-mono">q_auto:good</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Setup Guide */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Setup Information</h2>
        <p className="text-gray-300 mb-4">
          The Cloudinary integration is already configured with your account details.
        </p>
        
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Configuration</h3>
          <ul className="list-disc ml-5 space-y-1 text-gray-300">
            <li>Cloud Name: <code className="px-1 bg-gray-700 rounded">manikandan-showcase</code></li>
            <li>Upload Preset: <code className="px-1 bg-gray-700 rounded">portfolio-upload</code> (unsigned)</li>
          </ul>
        </div>
        
        <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-semibold text-blue-400 mb-1">Important Notes</h3>
          <ul className="list-disc ml-5 space-y-1 text-gray-300">
            <li>Always use the provided components for uploads</li>
            <li>Cloudinary dashboard: <a href="https://cloudinary.com/console" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">cloudinary.com/console</a></li>
            <li>For more transformations: <a href="https://cloudinary.com/documentation/transformation_reference" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Documentation</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadGuide; 