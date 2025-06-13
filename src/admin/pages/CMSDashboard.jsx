import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiTrendingUp, FiBarChart2, FiUser, FiUsers, FiEye, 
  FiMessageCircle, FiCalendar, FiExternalLink, FiEdit, FiBox,
  FiImage, FiGrid, FiRefreshCw, FiActivity, FiInfo, FiCheckCircle,
  FiLayers, FiUpload, FiCpu, FiFileText, FiPaperclip, FiSettings,
  FiDownload, FiTag, FiBriefcase, FiLink, FiPlus, FiCheck, FiXCircle,
  FiAlertCircle, FiCode
} from 'react-icons/fi';
import supabase from '../../utils/supabaseClient';
import ContentPageLayout, { ContentSection } from '../CMSHelper/ContentPageLayout';
import { Button, TextInput } from '../CMSHelper/FormComponents';

const CMSDashboard = () => {
  // State
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeCategories: 0,
    mediaAssets: 0,
    totalSkills: 0,
    resumeUploaded: false,
    lastEdited: '',
    publishedProjects: 0,
    recentUpdates: [],
    latestProjects: [],
    todoItems: []
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Get current date/time
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Load stats and user data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData.user);
        
        // Fetch projects stats
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id, title, slug, published, created_at, hero_asset, project_categories(key, label)')
          .order('created_at', { ascending: false });
          
        if (projectsError) throw projectsError;
        
        const publishedProjects = projects.filter(p => p.published);
        
        // Get categories
        const { data: categories } = await supabase
          .from('project_categories')
          .select('id')
          .eq('is_visible', true);
        
        // Get assets
        const { data: assets } = await supabase
          .from('assets')
          .select('id');
        
        // Get skills
        const { data: skills } = await supabase
          .from('skills')
          .select('id');

        // Get last edited date
        const { data: lastEdit } = await supabase
          .from('edit_history')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        // Fetch latest projects with images
        const latestProjects = await Promise.all(
          projects.slice(0, 3).map(async (project) => {
            if (project.hero_asset) {
              const { data: assetData } = await supabase
                .from('assets')
                .select('url')
                .eq('id', project.hero_asset)
                .single();
              
              return {
                ...project,
                image_url: assetData?.url || null
              };
            }
            return {
              ...project,
              image_url: null
            };
          })
        );
        
        // Generate recent updates for demo
        const recentUpdates = [
          { id: 1, type: 'project', message: 'Project "Responsive Dashboard" was published.', time: '2 hours ago' },
          { id: 2, type: 'visitor', message: 'New visitor peak - 120 unique visitors today!', time: '5 hours ago' },
          { id: 3, type: 'message', message: 'New contact message received from John Doe.', time: '1 day ago' },
          { id: 4, type: 'update', message: 'Portfolio content was updated successfully.', time: '2 days ago' },
          { id: 5, type: 'project', message: 'Project "Mobile App" was created as draft.', time: '3 days ago' }
        ];

        // Todo items for demo
        const todoItems = [
          { id: 1, task: 'Add resume to "Let\'s Connect"', status: true },
          { id: 2, task: 'Upload hero image for project', status: false },
          { id: 3, task: 'Add tags to AI Projects', status: true },
          { id: 4, task: 'Update contact information', status: false }
        ];
        
        // Get some recent media assets
        const { data: recentAssets } = await supabase
          .from('assets')
          .select('id, url, filename, type')
          .order('created_at', { ascending: false })
          .limit(6);
        
        // Update stats
        setStats({
          totalProjects: projects.length,
          publishedProjects: publishedProjects.length,
          activeCategories: categories ? categories.length : 0,
          mediaAssets: assets ? assets.length : 0,
          totalSkills: skills ? skills.length : 0,
          resumeUploaded: true, // Demo data
          lastEdited: lastEdit ? new Date(lastEdit.created_at).toLocaleDateString() : 'Never',
          recentUpdates,
          latestProjects,
          todoItems,
          recentAssets: recentAssets || []
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Quick access cards
  const quickAccessLinks = [
    { 
      name: "Edit Hero Section", 
      icon: <FiHome size={24} />,
      path: "/admin/sections/hero", 
      color: "bg-gradient-to-br from-emerald-900/30 to-emerald-700/10",
      description: "Update your portfolio's first impression"
    },
    { 
      name: "Edit About Page", 
      icon: <FiUser size={24} />, 
      path: "/admin/sections/about",
      color: "bg-gradient-to-br from-blue-900/30 to-blue-700/10",
      description: "Share your story and experience"
    },
    { 
      name: "Edit Skill Console", 
      icon: <FiCpu size={24} />, 
      path: "/admin/sections/skills",
      color: "bg-gradient-to-br from-purple-900/30 to-purple-700/10",
      description: "Showcase your technologies and talents"
    },
    { 
      name: "Manage Projects", 
      icon: <FiGrid size={24} />, 
      path: "/admin/sections/project-gallery",
      color: "bg-gradient-to-br from-amber-900/30 to-amber-700/10",
      description: "Add and update your portfolio projects"
    },
    { 
      name: "Media Library", 
      icon: <FiImage size={24} />, 
      path: "/admin/assets",
      color: "bg-gradient-to-br from-red-900/30 to-red-700/10",
      description: "Upload and manage your media assets"
    },
    { 
      name: "Customize Theme", 
      icon: <FiSettings size={24} />, 
      path: "/admin/settings",
      color: "bg-gradient-to-br from-indigo-900/30 to-indigo-700/10",
      description: "Adjust your portfolio appearance"
    }
  ];
  
  // Stat cards data
  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      description: `${stats.publishedProjects} published`,
      icon: <FiBox size={22} />,
      color: "from-emerald-600/20 to-emerald-700/10",
      iconBg: "bg-emerald-500/30",
      link: "/admin/sections/project-gallery"
    },
    {
      title: "Active Categories",
      value: stats.activeCategories,
      description: "Project categories",
      icon: <FiTag size={22} />,
      color: "from-blue-600/20 to-blue-700/10",
      iconBg: "bg-blue-500/30",
      link: "/admin/sections/project-gallery"
    },
    {
      title: "Media Assets",
      value: stats.mediaAssets,
      description: "Uploaded files",
      icon: <FiImage size={22} />,
      color: "from-purple-600/20 to-purple-700/10",
      iconBg: "bg-purple-500/30",
      link: "/admin/assets"
    },
    {
      title: "Skills",
      value: stats.totalSkills,
      description: "By proficiency level",
      icon: <FiCode size={22} />,
      color: "from-amber-600/20 to-amber-700/10",
      iconBg: "bg-amber-500/30",
      link: "/admin/sections/skills"
    },
    {
      title: "Resume",
      value: stats.resumeUploaded ? "Uploaded" : "Missing",
      description: "Last updated: Yesterday",
      icon: <FiFileText size={22} />,
      color: "from-red-600/20 to-red-700/10",
      iconBg: "bg-red-500/30",
      link: "/admin/sections/contacts"
    },
    {
      title: "Last Edited",
      value: stats.lastEdited,
      description: "Portfolio updates",
      icon: <FiEdit size={22} />,
      color: "from-indigo-600/20 to-indigo-700/10",
      iconBg: "bg-indigo-500/30"
    }
  ];

  // Render loading state
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <ContentPageLayout
      title="Dashboard"
      icon={<FiHome size={24} />}
      breadcrumbs={[
        { label: "Dashboard" }
      ]}
      hasUnsavedChanges={false}
    >
      {/* Quick Stats Section */}
      <ContentSection 
        title="Quick Stats" 
        icon={<FiBarChart2 size={20} />}
        className="mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
              className={`bg-gradient-to-br ${card.color} border border-gray-800/30 rounded-xl p-4 flex flex-col relative overflow-hidden`}
            >
              <div className="absolute right-0 top-0 w-16 h-16 bg-white/5 rounded-bl-full" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{card.title}</p>
                  <h4 className="text-xl font-semibold text-white">{card.value}</h4>
                </div>
                <div className={`${card.iconBg} p-2 rounded-lg`}>
                  {card.icon}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-400">{card.description}</p>
              </div>
              {card.link && (
                <Link to={card.link} className="absolute inset-0" aria-label={`View ${card.title}`}></Link>
              )}
            </motion.div>
          ))}
        </div>
      </ContentSection>
      
      {/* Quick Access Section */}
      <ContentSection 
        title="Quick Access" 
        icon={<FiRefreshCw size={20} />}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccessLinks.map((link, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
              className={`${link.color} border border-gray-800/30 rounded-xl p-5 relative overflow-hidden`}
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-bl-full" />
              <div className={`bg-black/20 p-3 rounded-xl w-fit mb-3`}>
                {link.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{link.name}</h3>
              <p className="text-sm text-gray-400">{link.description}</p>
              <Link to={link.path} className="absolute inset-0" aria-label={link.name}></Link>
            </motion.div>
          ))}
        </div>
      </ContentSection>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2">
          <ContentSection 
            title="Recent Activity" 
            icon={<FiActivity size={20} />}
            className="mb-6 h-full"
          >
            <div className="bg-black/30 border border-gray-800/30 rounded-xl overflow-hidden">
              <div className="border-b border-gray-800/30 px-5 py-3 bg-black/30">
                <h3 className="font-medium text-white">Recent Updates</h3>
              </div>
              
              <div className="divide-y divide-gray-800/30 max-h-[320px] overflow-y-auto">
                {stats.recentUpdates.map((update) => (
                  <div key={update.id} className="p-4 flex">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4
                      ${update.type === 'project' ? 'bg-emerald-900/30 text-emerald-400' :
                        update.type === 'visitor' ? 'bg-blue-900/30 text-blue-400' :
                        update.type === 'message' ? 'bg-indigo-900/30 text-indigo-400' : 
                        'bg-amber-900/30 text-amber-400'}
                    `}>
                      {update.type === 'project' && <FiBox size={18} />}
                      {update.type === 'visitor' && <FiUsers size={18} />}
                      {update.type === 'message' && <FiMessageCircle size={18} />}
                      {update.type === 'update' && <FiCheckCircle size={18} />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-200">{update.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ContentSection>
        </div>

        {/* To-Do Panel */}
        <div>
          <ContentSection 
            title="To-Do List" 
            icon={<FiCheckCircle size={20} />}
            className="mb-6 h-full"
          >
            <div className="bg-black/30 border border-gray-800/30 rounded-xl overflow-hidden">
              <div className="border-b border-gray-800/30 px-5 py-3 bg-black/30 flex justify-between items-center">
                <h3 className="font-medium text-white">Tasks</h3>
                <button className="text-xs text-emerald-400 hover:underline flex items-center">
                  <FiPlus size={14} className="mr-1" />
                  Add Task
                </button>
              </div>
              
              <div className="divide-y divide-gray-800/30 max-h-[320px] overflow-y-auto">
                {stats.todoItems.map((item) => (
                  <div key={item.id} className="p-4 flex items-center">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3
                      ${item.status ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/50' : 
                      'bg-gray-900/30 text-gray-500 border border-gray-700/50'}
                    `}>
                      {item.status ? <FiCheck size={12} /> : null}
                    </div>
                    <p className={`text-sm flex-1 ${item.status ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                      {item.task}
                    </p>
                    <button className="ml-2 text-gray-500 hover:text-gray-400">
                      <FiXCircle size={16} />
                    </button>
                  </div>
                ))}

                {stats.todoItems.length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-gray-400">No tasks yet</p>
                    <button className="inline-block mt-2 text-sm text-emerald-400 hover:underline">
                      Create your first task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </ContentSection>
        </div>
      </div>

      {/* Media Summary */}
      <ContentSection 
        title="Media Summary" 
        icon={<FiImage size={20} />}
        className="mb-6"
      >
        <div className="bg-black/30 border border-gray-800/30 rounded-xl overflow-hidden">
          <div className="border-b border-gray-800/30 px-5 py-3 bg-black/30 flex justify-between items-center">
            <h3 className="font-medium text-white">Recent Uploads</h3>
            <div className="flex space-x-3">
              <Link
                to="/admin/assets" 
                className="text-xs text-emerald-400 hover:underline flex items-center"
              >
                View All
                <FiExternalLink size={12} className="ml-1" />
              </Link>
              <Link
                to="/admin/assets" 
                className="text-xs text-emerald-400 hover:underline flex items-center"
              >
                <FiUpload size={12} className="mr-1" />
                Upload New
              </Link>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {stats.recentAssets && stats.recentAssets.length > 0 ? (
                stats.recentAssets.map((asset, index) => (
                  <div key={index} className="aspect-square bg-gray-800/50 rounded-lg overflow-hidden relative group">
                    {asset.url ? (
                      asset.type?.startsWith('image') ? (
                        <img 
                          src={asset.url} 
                          alt={asset.filename || `Asset ${index}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800/80">
                          {asset.type?.startsWith('video') && <FiImage size={24} className="text-gray-400" />}
                          {asset.type?.includes('pdf') && <FiFileText size={24} className="text-gray-400" />}
                          {!asset.type?.startsWith('video') && !asset.type?.includes('pdf') && 
                            <FiPaperclip size={24} className="text-gray-400" />}
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800/80">
                        <FiAlertCircle size={24} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                      <Link 
                        to={`/admin/assets?id=${asset.id}`}
                        className="p-2 rounded-full bg-black/60 text-white hover:bg-emerald-800/70"
                      >
                        <FiEye size={16} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-6 text-center">
                  <p className="text-gray-400">No media assets uploaded yet</p>
                  <Link 
                    to="/admin/assets" 
                    className="inline-block mt-2 text-sm text-emerald-400 hover:underline"
                  >
                    Upload your first media asset
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </ContentSection>
    </ContentPageLayout>
  );
};

export default CMSDashboard; 