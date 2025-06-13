import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiUpload, FiGrid, FiList, FiTrash2, 
  FiDownload, FiEdit2, FiEye, FiX, FiCheck 
} from 'react-icons/fi';
import CloudinaryUpload from '../components/CloudinaryUpload';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [assetToRename, setAssetToRename] = useState(null);
  const [newAssetName, setNewAssetName] = useState('');

  // Sample data - replace with your actual data fetching logic
  useEffect(() => {
    // Simulated fetch - replace with your actual data source
    const fetchAssets = async () => {
      setLoading(true);
      try {
        // This is sample data - replace with your actual API call
        const sampleAssets = [
          {
            id: '1',
            name: 'hero-image.jpg',
            url: 'https://res.cloudinary.com/manikandan-showcase/image/upload/v1625123456/portfolio/hero-image.jpg',
            type: 'image',
            size: '1.2MB',
            dimensions: '1920×1080px',
            uploadedAt: '2023-06-01T12:00:00Z',
            tags: ['hero', 'banner']
          },
          {
            id: '2',
            name: 'project-logo.svg',
            url: 'https://res.cloudinary.com/manikandan-showcase/image/upload/v1625123457/portfolio/project-logo.svg',
            type: 'svg',
            size: '45KB',
            dimensions: '256×256px',
            uploadedAt: '2023-05-28T10:30:00Z',
            tags: ['logo', 'vector']
          },
          {
            id: '3',
            name: 'demo-video.mp4',
            url: 'https://res.cloudinary.com/manikandan-showcase/video/upload/v1625123458/portfolio/demo-video.mp4',
            type: 'video',
            size: '8.5MB',
            duration: '0:45',
            uploadedAt: '2023-05-25T14:20:00Z',
            tags: ['demo', 'product']
          },
          {
            id: '4',
            name: 'presentation.pdf',
            url: 'https://res.cloudinary.com/manikandan-showcase/raw/upload/v1625123459/portfolio/presentation.pdf',
            type: 'pdf',
            size: '2.8MB',
            pages: 15,
            uploadedAt: '2023-05-20T09:15:00Z',
            tags: ['presentation', 'document']
          },
          {
            id: '5',
            name: 'banner-animation.gif',
            url: 'https://res.cloudinary.com/manikandan-showcase/image/upload/v1625123460/portfolio/banner-animation.gif',
            type: 'gif',
            size: '3.4MB',
            dimensions: '800×600px',
            uploadedAt: '2023-05-15T11:10:00Z',
            tags: ['animation', 'banner']
          }
        ];
        
        // Simulate network delay
        setTimeout(() => {
          setAssets(sampleAssets);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setLoading(false);
      }
    };
    
    fetchAssets();
  }, []);

  // Filter assets based on active filter and search query
  const filteredAssets = assets.filter(asset => {
    // Filter by type
    const typeMatches = activeFilter === 'all' || asset.type === activeFilter;
    
    // Filter by search term
    const searchTermMatches = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return typeMatches && searchTermMatches;
  });

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Handle asset selection
  const toggleAssetSelection = (assetId) => {
    if (selectedAssets.includes(assetId)) {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    } else {
      setSelectedAssets([...selectedAssets, assetId]);
    }
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    }
  };

  // Handle asset preview
  const openPreview = (asset) => {
    setPreviewAsset(asset);
    setIsPreviewModalOpen(true);
  };

  // Handle asset rename
  const openRenameModal = (asset) => {
    setAssetToRename(asset);
    setNewAssetName(asset.name);
    setIsRenameModalOpen(true);
  };

  // Perform rename
  const handleRename = () => {
    // Here you would update the asset name in your database
    setAssets(assets.map(asset => 
      asset.id === assetToRename.id ? { ...asset, name: newAssetName } : asset
    ));
    setIsRenameModalOpen(false);
    setAssetToRename(null);
  };

  // Handle asset delete
  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedAssets.length} selected item(s)?`)) {
      // Here you would delete the selected assets from your database
      setAssets(assets.filter(asset => !selectedAssets.includes(asset.id)));
      setSelectedAssets([]);
    }
  };

  // Handle file upload completion
  const handleUploadComplete = (urls) => {
    // Here you would normally parse the uploaded files and add to your database
    // This is just a placeholder example:
    const newAssets = Array.isArray(urls) ? urls : [urls];
    
    const newAssetsFormatted = newAssets.map((url, index) => {
      // Extract file name from URL
      const fileName = url.substring(url.lastIndexOf('/') + 1);
      const fileType = fileName.split('.').pop().toLowerCase();
      
      // Determine type based on extension
      let type = 'other';
      if (['jpg', 'jpeg', 'png', 'webp'].includes(fileType)) type = 'image';
      else if (fileType === 'svg') type = 'svg';
      else if (fileType === 'gif') type = 'gif';
      else if (fileType === 'pdf') type = 'pdf';
      else if (['mp4', 'webm', 'mov'].includes(fileType)) type = 'video';
      
      return {
        id: `new-${Date.now()}-${index}`,
        name: fileName,
        url: url,
        type: type,
        size: 'Unknown',
        uploadedAt: new Date().toISOString(),
        tags: []
      };
    });
    
    setAssets([...newAssetsFormatted, ...assets]);
    setIsUploadModalOpen(false);
  };

  // Get icon for asset type
  const getAssetIcon = (type) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'svg': return '🎨';
      case 'video': return '🎬';
      case 'pdf': return '📄';
      case 'gif': return '🎭';
      default: return '📁';
    }
  };

  return (
    <div className="min-h-full">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Assets</h1>
            <p className="text-gray-400 text-sm">Manage all your media files in one place</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <button
              className="flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <FiUpload size={18} className="mr-2" />
              Upload New
            </button>
          </div>
        </div>
        
        {/* Filter and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          {/* Filter tabs */}
          <div className="flex items-center overflow-x-auto hide-scrollbar pb-1">
            <button
              className={`px-4 py-1.5 whitespace-nowrap text-sm font-medium rounded-lg mr-2 ${
                activeFilter === 'all' 
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-600/40' 
                  : 'text-gray-300 hover:text-emerald-300 border border-transparent'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Files
            </button>
            <button
              className={`px-4 py-1.5 whitespace-nowrap text-sm font-medium rounded-lg mr-2 ${
                activeFilter === 'image' 
                  ? 'bg-blue-600/30 text-blue-400 border border-blue-600/40' 
                  : 'text-gray-300 hover:text-blue-300 border border-transparent'
              }`}
              onClick={() => setActiveFilter('image')}
            >
              Images
            </button>
            <button
              className={`px-4 py-1.5 whitespace-nowrap text-sm font-medium rounded-lg mr-2 ${
                activeFilter === 'video' 
                  ? 'bg-purple-600/30 text-purple-400 border border-purple-600/40' 
                  : 'text-gray-300 hover:text-purple-300 border border-transparent'
              }`}
              onClick={() => setActiveFilter('video')}
            >
              Videos
            </button>
            <button
              className={`px-4 py-1.5 whitespace-nowrap text-sm font-medium rounded-lg mr-2 ${
                activeFilter === 'gif' 
                  ? 'bg-pink-600/30 text-pink-400 border border-pink-600/40' 
                  : 'text-gray-300 hover:text-pink-300 border border-transparent'
              }`}
              onClick={() => setActiveFilter('gif')}
            >
              GIFs
            </button>
            <button
              className={`px-4 py-1.5 whitespace-nowrap text-sm font-medium rounded-lg mr-2 ${
                activeFilter === 'pdf' 
                  ? 'bg-red-600/30 text-red-400 border border-red-600/40' 
                  : 'text-gray-300 hover:text-red-300 border border-transparent'
              }`}
              onClick={() => setActiveFilter('pdf')}
            >
              PDFs
            </button>
            <button
              className={`px-4 py-1.5 whitespace-nowrap text-sm font-medium rounded-lg ${
                activeFilter === 'other' 
                  ? 'bg-amber-600/30 text-amber-400 border border-amber-600/40' 
                  : 'text-gray-300 hover:text-amber-300 border border-transparent'
              }`}
              onClick={() => setActiveFilter('other')}
            >
              Other
            </button>
          </div>
          
          {/* View mode and actions */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
              <button 
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
              >
                <FiGrid size={18} />
              </button>
              <button 
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                onClick={() => setViewMode('list')}
                aria-label="List View"
              >
                <FiList size={18} />
              </button>
            </div>
            
            {selectedAssets.length > 0 && (
              <button
                className="flex items-center justify-center px-3 py-1.5 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-colors"
                onClick={handleDeleteSelected}
              >
                <FiTrash2 size={16} className="mr-1" />
                Delete Selected
              </button>
            )}
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-gray-700 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-gray-300">Loading assets...</p>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && filteredAssets.length === 0 && (
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📂</div>
            <h3 className="text-lg font-medium mb-2">No assets found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery ? 
                `No results found for "${searchQuery}"` : 
                'Upload your first media file to get started'}
            </p>
            <button
              className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <FiUpload size={18} className="mr-2" />
              Upload New File
            </button>
          </div>
        )}
        
        {/* Grid view */}
        {!loading && viewMode === 'grid' && filteredAssets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                className={`bg-gray-800/40 border ${selectedAssets.includes(asset.id) ? 'border-emerald-500' : 'border-gray-700'} rounded-lg overflow-hidden group transition-all`}
              >
                {/* Thumbnail */}
                <div className="aspect-square relative">
                  {/* Checkbox overlay for selection */}
                  <div className="absolute top-2 left-2 z-10">
                    <div 
                      className={`w-5 h-5 rounded border ${
                        selectedAssets.includes(asset.id) 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-500 bg-gray-800/70'
                      } flex items-center justify-center cursor-pointer`}
                      onClick={() => toggleAssetSelection(asset.id)}
                    >
                      {selectedAssets.includes(asset.id) && <FiCheck size={14} className="text-white" />}
                    </div>
                  </div>
                  
                  {/* Type indicator */}
                  <div className="absolute top-2 right-2 bg-gray-900/80 text-xs px-2 py-0.5 rounded">
                    {asset.type}
                  </div>
                  
                  {/* Preview */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
                    {asset.type === 'image' || asset.type === 'svg' ? (
                      <img 
                        src={asset.url} 
                        alt={asset.name} 
                        className="w-full h-full object-cover"
                        onClick={() => openPreview(asset)}
                      />
                    ) : asset.type === 'video' ? (
                      <div 
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => openPreview(asset)}
                      >
                        <span className="text-4xl mb-2">🎬</span>
                        <span className="text-xs text-gray-300">{asset.duration}</span>
                      </div>
                    ) : asset.type === 'gif' ? (
                      <img 
                        src={asset.url} 
                        alt={asset.name} 
                        className="w-full h-full object-cover"
                        onClick={() => openPreview(asset)}
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => openPreview(asset)}
                      >
                        <span className="text-4xl mb-2">{getAssetIcon(asset.type)}</span>
                        <span className="text-xs text-gray-300">{asset.type.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2 transition-opacity">
                    <button
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 hover:text-white transition-colors"
                      onClick={() => openPreview(asset)}
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 hover:text-white transition-colors"
                      onClick={() => { /* Handle download */ }}
                    >
                      <FiDownload size={18} />
                    </button>
                    <button
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 hover:text-white transition-colors"
                      onClick={() => openRenameModal(asset)}
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      className="p-2 bg-gray-800 hover:bg-red-900 rounded-full text-gray-300 hover:text-red-300 transition-colors"
                      onClick={() => { /* Handle delete */ }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Meta info */}
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 truncate" title={asset.name}>
                    {asset.name}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{asset.size}</span>
                    <span>{formatDate(asset.uploadedAt)}</span>
                  </div>
                  
                  {/* Tags */}
                  {asset.tags && asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-700/50 px-1.5 py-0.5 rounded text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* List view */}
        {!loading && viewMode === 'list' && filteredAssets.length > 0 && (
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-gray-800/80 text-sm font-medium">
              <div className="col-span-1 flex items-center">
                <div 
                  className={`w-5 h-5 rounded border ${
                    selectedAssets.length === filteredAssets.length 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : 'border-gray-500'
                  } flex items-center justify-center cursor-pointer`}
                  onClick={toggleSelectAll}
                >
                  {selectedAssets.length === filteredAssets.length && <FiCheck size={14} className="text-white" />}
                </div>
              </div>
              <div className="col-span-5 sm:col-span-4">File</div>
              <div className="hidden sm:block col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
            </div>
            
            {/* Table rows */}
            {filteredAssets.map(asset => (
              <div 
                key={asset.id}
                className={`grid grid-cols-12 gap-3 px-4 py-3 border-t border-gray-700/50 hover:bg-gray-800/30 ${
                  selectedAssets.includes(asset.id) ? 'bg-emerald-900/10' : ''
                }`}
              >
                <div className="col-span-1 flex items-center">
                  <div 
                    className={`w-5 h-5 rounded border ${
                      selectedAssets.includes(asset.id) 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-gray-500'
                    } flex items-center justify-center cursor-pointer`}
                    onClick={() => toggleAssetSelection(asset.id)}
                  >
                    {selectedAssets.includes(asset.id) && <FiCheck size={14} className="text-white" />}
                  </div>
                </div>
                <div className="col-span-5 sm:col-span-4 flex items-center">
                  <span className="mr-3 text-lg">{getAssetIcon(asset.type)}</span>
                  <div className="truncate">
                    <div className="font-medium text-sm truncate">{asset.name}</div>
                    <div className="text-xs text-gray-400">{formatDate(asset.uploadedAt)}</div>
                  </div>
                </div>
                <div className="hidden sm:flex col-span-2 items-center">
                  <span className="px-2 py-0.5 bg-gray-700/50 text-xs rounded">
                    {asset.type}
                  </span>
                </div>
                <div className="col-span-3 flex items-center text-sm text-gray-300">
                  {asset.size}
                  {asset.dimensions && <span className="text-gray-500 ml-2">{asset.dimensions}</span>}
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center justify-end space-x-1">
                  <button
                    className="p-1.5 text-gray-400 hover:text-white"
                    onClick={() => openPreview(asset)}
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-white"
                    onClick={() => { /* Handle download */ }}
                  >
                    <FiDownload size={16} />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-white"
                    onClick={() => openRenameModal(asset)}
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-red-400"
                    onClick={() => { /* Handle delete */ }}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold">Upload New Files</h2>
              <button
                className="text-gray-400 hover:text-white p-1"
                onClick={() => setIsUploadModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
              <CloudinaryUpload
                onUpload={handleUploadComplete}
                multiple={true}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Preview Modal */}
      {isPreviewModalOpen && previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-800">
              <h2 className="text-lg font-medium truncate">{previewAsset.name}</h2>
              <button
                className="text-gray-400 hover:text-white p-1"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-gray-950/50">
              {previewAsset.type === 'image' || previewAsset.type === 'svg' || previewAsset.type === 'gif' ? (
                <img 
                  src={previewAsset.url}
                  alt={previewAsset.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : previewAsset.type === 'video' ? (
                <video 
                  src={previewAsset.url}
                  controls
                  className="max-w-full max-h-[70vh]"
                />
              ) : previewAsset.type === 'pdf' ? (
                <div className="text-center">
                  <div className="text-5xl mb-4">📄</div>
                  <h3 className="mb-2">{previewAsset.name}</h3>
                  <a 
                    href={previewAsset.url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                  >
                    <FiEye size={16} className="mr-2" />
                    View PDF
                  </a>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-5xl mb-4">{getAssetIcon(previewAsset.type)}</div>
                  <h3 className="mb-2">{previewAsset.name}</h3>
                  <a 
                    href={previewAsset.url}
                    download
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                  >
                    <FiDownload size={16} className="mr-2" />
                    Download File
                  </a>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-800 flex items-center justify-between">
              <div className="text-sm">
                {previewAsset.dimensions && <span className="mr-3">{previewAsset.dimensions}</span>}
                <span className="mr-3">{previewAsset.size}</span>
                <span className="text-gray-400">{formatDate(previewAsset.uploadedAt)}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors flex items-center"
                  onClick={() => { /* Handle copy URL */ }}
                >
                  Copy URL
                </button>
                <button
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors flex items-center"
                  onClick={() => { /* Handle download */ }}
                >
                  <FiDownload size={15} className="mr-1" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rename Modal */}
      {isRenameModalOpen && assetToRename && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Rename Asset</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">New file name:</label>
              <input
                type="text"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex space-x-3 justify-end">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                onClick={() => setIsRenameModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                onClick={handleRename}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets; 