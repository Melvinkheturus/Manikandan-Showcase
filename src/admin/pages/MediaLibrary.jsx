import React, { useState, useEffect } from 'react';
import { FiUpload, FiSearch, FiTrash2, FiCopy, FiDownload, FiFilter } from 'react-icons/fi';
import CloudinaryUpload from '../components/CloudinaryUpload';
import Toaster from '../components/Toaster';

const MediaLibrary = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  
  // Fetch media items
  useEffect(() => {
    const fetchMediaItems = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          const mockData = [
            {
              id: '1',
              title: 'Hero Image',
              url: 'https://source.unsplash.com/random/800x600?webdesign',
              type: 'image',
              size: '2.4 MB',
              dimensions: '1920x1080',
              uploadedAt: '2023-05-15T10:30:00Z',
              tags: ['hero', 'banner']
            },
            {
              id: '2',
              title: 'Project Thumbnail',
              url: 'https://source.unsplash.com/random/800x600?portfolio',
              type: 'image',
              size: '1.2 MB',
              dimensions: '800x600',
              uploadedAt: '2023-05-14T09:15:00Z',
              tags: ['thumbnail', 'project']
            },
            {
              id: '3',
              title: 'About Section Background',
              url: 'https://source.unsplash.com/random/800x600?abstract',
              type: 'image',
              size: '1.8 MB',
              dimensions: '1600x900',
              uploadedAt: '2023-05-13T14:45:00Z',
              tags: ['background', 'about']
            },
            {
              id: '4',
              title: 'Profile Picture',
              url: 'https://source.unsplash.com/random/800x600?profile',
              type: 'image',
              size: '0.9 MB',
              dimensions: '512x512',
              uploadedAt: '2023-05-12T11:20:00Z',
              tags: ['avatar', 'profile']
            },
            {
              id: '5',
              title: 'Project Document',
              url: 'https://example.com/document.pdf',
              type: 'document',
              size: '3.2 MB',
              uploadedAt: '2023-05-11T16:10:00Z',
              tags: ['document', 'pdf']
            },
            {
              id: '6',
              title: 'Project Video',
              url: 'https://example.com/video.mp4',
              type: 'video',
              size: '15.7 MB',
              duration: '2:15',
              uploadedAt: '2023-05-10T13:25:00Z',
              tags: ['video', 'project']
            }
          ];
          
          setMediaItems(mockData);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching media items:', error);
        setToast({
          show: true,
          message: 'Failed to load media library',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    fetchMediaItems();
  }, []);

  // Handle media upload
  const handleMediaUpload = (url) => {
    const newItem = {
      id: `new-${Date.now()}`,
      title: 'New Upload',
      url: url,
      type: 'image',
      size: 'Unknown',
      dimensions: 'Unknown',
      uploadedAt: new Date().toISOString(),
      tags: ['upload']
    };
    
    setMediaItems(prev => [newItem, ...prev]);
    
    setToast({
      show: true,
      message: 'Media uploaded successfully',
      type: 'success'
    });
  };

  // Handle item selection
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Handle select all items
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  // Handle item deletion
  const handleDeleteItems = () => {
    if (selectedItems.length === 0) return;
    
    setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    
    setToast({
      show: true,
      message: `${selectedItems.length} item(s) deleted successfully`,
      type: 'success'
    });
  };

  // Handle item copy URL
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    
    setToast({
      show: true,
      message: 'URL copied to clipboard',
      type: 'success'
    });
  };

  // Filter items based on search term and filter selection
  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || item.type === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Media Library</h1>
          <CloudinaryUpload
            onUploadSuccess={handleMediaUpload}
            resourceType="auto"
            uploadPreset="media_library"
            buttonText="Upload Media"
            buttonClassName="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            buttonIcon={<FiUpload className="mr-2" />}
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search files..."
              />
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white appearance-none"
                >
                  <option value="all">All Files</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between lg:justify-end">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredItems.length} items
                </span>
                
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden ml-4">
                  <button
                    onClick={() => setView('grid')}
                    className={`px-3 py-1 text-sm ${
                      view === 'grid' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-3 py-1 text-sm ${
                      view === 'list' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Items Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedItems.length} selected
              </span>
              <button
                onClick={() => setSelectedItems([])}
                className="ml-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Deselect All
              </button>
            </div>
            <div>
              <button
                onClick={handleDeleteItems}
                className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
              >
                <FiTrash2 className="mr-1" /> Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Media Items Grid/List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filter !== 'all' ? 'No media items match your search criteria.' : 'No media items found. Upload some!'}
            </p>
          </div>
        ) : (
          <>
            {view === 'grid' ? (
              // Grid View
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item.id)}
                    className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${
                      selectedItems.includes(item.id) ? 'ring-2 ring-emerald-500' : ''
                    }`}
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-40 object-cover"
                        />
                      ) : item.type === 'video' ? (
                        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400">Video</span>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400">Document</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.size} • {new Date(item.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div 
                      className={`absolute top-2 right-2 h-5 w-5 rounded-full border-2 ${
                        selectedItems.includes(item.id) 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex justify-end space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(item.url);
                          }}
                          className="p-1 bg-gray-800/80 text-white rounded hover:bg-gray-700"
                        >
                          <FiCopy size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.url, '_blank');
                          }}
                          className="p-1 bg-gray-800/80 text-white rounded hover:bg-gray-700"
                        >
                          <FiDownload size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                        />
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        File
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredItems.map(item => (
                      <tr 
                        key={item.id} 
                        onClick={() => handleSelectItem(item.id)}
                        className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
                          selectedItems.includes(item.id) ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => {}}
                            className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {item.type === 'image' ? (
                                <img
                                  src={item.url}
                                  alt={item.title}
                                  className="h-10 w-10 object-cover rounded"
                                />
                              ) : (
                                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.type.substring(0, 3)}</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {item.tags.map(tag => (
                                  <span key={tag} className="mr-1">#{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(item.url);
                              }}
                              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            >
                              <FiCopy />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.url, '_blank');
                              }}
                              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            >
                              <FiDownload />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItems([item.id]);
                              }}
                              className="text-red-400 hover:text-red-500"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Toast Notification */}
      <Toaster 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({...toast, show: false})} 
      />
    </div>
  );
};

export default MediaLibrary; 