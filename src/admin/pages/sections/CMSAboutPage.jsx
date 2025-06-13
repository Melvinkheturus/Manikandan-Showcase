import React, { useState, useEffect } from 'react';
import { FiUser, FiTool, FiLink, FiSave } from 'react-icons/fi';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import ContentPageLayout, { ContentSection } from '../../CMSHelper/ContentPageLayout';
import { supabase } from '../../../database/supabaseClient';

// Tab Components
import CreatorTab from './about/CreatorTab';
import ToolkitTab from './about/ToolkitTab';
import ConnectTab from './about/ConnectTab';

const CMSAboutPage = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState({
    bio: '',
    roles: [],
    toolkit: [],
    socialLinks: [],
    resumeUrl: ''
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  // Initial data loading from Supabase
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        setLoading(true);
        
        // Fetch bio and roles
        const { data: bioData, error: bioError } = await supabase
          .from('about_me')
          .select('*')
          .single();
          
        if (bioError) throw bioError;
        
        // Fetch toolkit items
        const { data: toolkitData, error: toolkitError } = await supabase
          .from('toolkit')
          .select('*')
          .order('display_order', { ascending: true });
          
        if (toolkitError) throw toolkitError;
        
        // Fetch social links
        const { data: socialData, error: socialError } = await supabase
          .from('social_links')
          .select('*')
          .order('id', { ascending: true });
          
        if (socialError) throw socialError;
        
        // Fetch resume
        const { data: resumeData, error: resumeError } = await supabase
          .from('resume')
          .select('url')
          .single();
          
        if (resumeError && resumeError.code !== 'PGRST116') throw resumeError; // Ignore not found error
        
          setAboutData({
          bio: bioData?.bio || '',
          roles: bioData?.roles || [],
          toolkit: toolkitData || [],
          socialLinks: socialData || [],
          resumeUrl: resumeData?.url || ''
        });
      } catch (error) {
        console.error('Error fetching about data:', error);
        // For demo purposes, set some default data
        setAboutData({
          bio: 'I am a UI/UX designer and creative technologist with a passion for creating user-friendly interfaces.',
          roles: ['UI/UX Designer', 'Frontend Developer', 'Creative Technologist'],
          toolkit: [
            {
              id: 1,
              name: 'Figma',
              icon_url: '/assets/tools/figma.svg',
              capabilities: ['UI Design', 'Prototyping', 'Design Systems']
            },
            {
              id: 2,
              name: 'React',
              icon_url: '/assets/tools/react.svg',
              capabilities: ['Component Development', 'State Management', 'Hooks']
            }
          ],
          socialLinks: [
            { id: 1, platform: 'linkedin', url: 'https://linkedin.com/in/username' },
            { id: 2, platform: 'github', url: 'https://github.com/username' }
          ],
          resumeUrl: 'https://example.com/resume.pdf'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAboutData();
  }, []);

  // Handle updates from any tab
  const handleDataUpdate = (section, data) => {
    setAboutData(prev => ({
      ...prev,
      [section]: data
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      handleSave(section, data);
    }
  };
  
  // Save data based on active tab/section
  const handleSave = async (section, sectionData) => {
    try {
      setLoading(true);
      
      switch(section) {
        case 'bio':
        case 'roles':
          await supabase
            .from('about_me')
            .upsert({ 
              id: 1, // Assuming a single row
              bio: section === 'bio' ? sectionData : aboutData.bio,
              roles: section === 'roles' ? sectionData : aboutData.roles
            });
          break;
          
        case 'toolkit':
          // Handle toolkit items (create, update, delete)
          // This would need more complex logic to compare existing vs new items
          for (const item of sectionData) {
            if (item.id) {
              // Update existing
              await supabase.from('toolkit').update({
                name: item.name,
                icon_url: item.icon_url,
                capabilities: item.capabilities,
                display_order: item.display_order
              }).eq('id', item.id);
            } else {
              // Create new
              await supabase.from('toolkit').insert({
                name: item.name,
                icon_url: item.icon_url,
                capabilities: item.capabilities,
                display_order: item.display_order || sectionData.length
              });
            }
          }
          
          // Handle deletions (items in current state but not in updated data)
          const currentIds = aboutData.toolkit.map(item => item.id).filter(Boolean);
          const updatedIds = sectionData.map(item => item.id).filter(Boolean);
          const deletedIds = currentIds.filter(id => !updatedIds.includes(id));
          
          if (deletedIds.length > 0) {
            await supabase.from('toolkit').delete().in('id', deletedIds);
          }
          break;
          
        case 'socialLinks':
          // Similar pattern as toolkit
          for (const link of sectionData) {
            if (link.id) {
              await supabase.from('social_links').update({
                platform: link.platform,
                url: link.url
              }).eq('id', link.id);
            } else {
              await supabase.from('social_links').insert({
                platform: link.platform,
                url: link.url
              });
            }
          }
          
          // Handle deletions
          const currentLinkIds = aboutData.socialLinks.map(link => link.id).filter(Boolean);
          const updatedLinkIds = sectionData.map(link => link.id).filter(Boolean);
          const deletedLinkIds = currentLinkIds.filter(id => !updatedLinkIds.includes(id));
          
          if (deletedLinkIds.length > 0) {
            await supabase.from('social_links').delete().in('id', deletedLinkIds);
          }
          break;
          
        case 'resumeUrl':
          await supabase.from('resume').upsert({ 
            id: 1, // Assuming a single row
            url: sectionData
          });
          break;
          
        default:
          console.warn('Unknown section to save:', section);
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving about data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Save all data (for manual save button)
  const handleSaveAll = async () => {
    try {
      // Bio and roles
      await handleSave('bio', aboutData.bio);
      await handleSave('roles', aboutData.roles);
      
      // Toolkit
      await handleSave('toolkit', aboutData.toolkit);
      
      // Social links
      await handleSave('socialLinks', aboutData.socialLinks);
      
      // Resume
      await handleSave('resumeUrl', aboutData.resumeUrl);
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving all about data:', error);
    }
  };
  
  const tabItems = [
    { name: 'Meet the Creator', icon: <FiUser size={16} /> },
    { name: 'My Toolkit', icon: <FiTool size={16} /> },
    { name: 'Let\'s Connect', icon: <FiLink size={16} /> }
  ];

  return (
    <ContentPageLayout
      title="About Me Section"
      icon={<FiUser size={24} />}
      breadcrumbs={[
        { label: "Dashboard", path: "/admin" },
        { label: "Main Page", path: "/admin/sections" },
        { label: "About Me" }
      ]}
      onSave={handleSaveAll}
      hasUnsavedChanges={hasUnsavedChanges}
      autoSaveEnabled={autoSaveEnabled}
      onToggleAutoSave={() => setAutoSaveEnabled(!autoSaveEnabled)}
      previewUrl="/about"
    >
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {!loading && (
        <div className="space-y-8">
          <div className="bg-black/40 backdrop-blur-md border border-emerald-900/20 rounded-xl p-5 shadow-lg">
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-2 p-1 bg-gray-900/50 rounded-lg mb-6">
                {tabItems.map((tab, index) => (
                  <Tab
                    key={index}
                    className={({ selected }) => 
                      `w-full py-3 px-4 text-sm font-medium leading-5 rounded-lg transition-colors ${
                        selected
                          ? 'bg-emerald-900/40 text-emerald-400 shadow'
                          : 'text-gray-400 hover:bg-black/40 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </div>
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CreatorTab 
                      bio={aboutData.bio}
                      roles={aboutData.roles}
                      onBioChange={(bio) => handleDataUpdate('bio', bio)}
                      onRolesChange={(roles) => handleDataUpdate('roles', roles)}
                    />
                  </motion.div>
                </Tab.Panel>
                <Tab.Panel>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ToolkitTab 
                      toolkit={aboutData.toolkit}
                      onToolkitChange={(toolkit) => handleDataUpdate('toolkit', toolkit)}
                    />
                  </motion.div>
                </Tab.Panel>
                <Tab.Panel>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ConnectTab 
                      socialLinks={aboutData.socialLinks}
                      resumeUrl={aboutData.resumeUrl}
                      onSocialLinksChange={(links) => handleDataUpdate('socialLinks', links)}
                      onResumeUrlChange={(url) => handleDataUpdate('resumeUrl', url)}
                    />
                  </motion.div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            </div>
        </div>
      )}
    </ContentPageLayout>
  );
};

export default CMSAboutPage; 