import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiEye, FiSmartphone, FiTablet, FiMonitor } from 'react-icons/fi';
import ContentPageLayout, { ContentSection } from '../../CMSHelper/ContentPageLayout';
import { TextInput, TextArea, Button } from '../../CMSHelper/FormComponents';
import { supabase } from '../../../database/supabaseClient';

const CMSHeroPage = () => {
  // State for hero section data, preview, and loading
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [heroData, setHeroData] = useState({
    id: 1,
    job_title: '',
    quote: '',
    email: ''
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  // React Hook Form setup with validation
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm({
    defaultValues: heroData
  });
  
  // Watch form values for real-time preview and character count
  const watchedValues = watch();
  
  // Load hero data from Supabase
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, we would fetch from Supabase
        // For demo purposes, we'll use a timeout to simulate fetch
        setTimeout(() => {
          const demoData = {
            id: 1,
            job_title: 'UI/UX DESIGNER & CREATIVE TECHNOLOGIST',
            quote: 'Creating clarity in a chaotic digital world',
            email: 'smk.manikandan.dev@gmail.com'
          };
          
          setHeroData(demoData);
          
          // Set form values
          setValue('job_title', demoData.job_title);
          setValue('quote', demoData.quote);
          setValue('email', demoData.email);
          
          setLoading(false);
        }, 800);
        
        // Supabase implementation would be:
        /*
        const { data, error } = await supabase
          .from('hero_section')
          .select('*')
          .single();
          
        if (error) throw error;
        
        if (data) {
          setHeroData(data);
          setValue('job_title', data.job_title);
          setValue('quote', data.quote);
          setValue('email', data.email);
        }
        */
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, [setValue]);
  
  // Handle form changes and trigger auto-save
  useEffect(() => {
    if (loading) return;
    
    // Check if values have changed from original data
    const hasChanges = 
      watchedValues.job_title !== heroData.job_title ||
      watchedValues.quote !== heroData.quote ||
      watchedValues.email !== heroData.email;
    
    setHasUnsavedChanges(hasChanges);
    
    if (hasChanges && autoSaveEnabled) {
      const timer = setTimeout(() => {
        handleSave(watchedValues);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [watchedValues, heroData, autoSaveEnabled, loading]);

  // Save hero section data
  const handleSave = async (data) => {
    try {
      setSaving(true);
      
      // In a real implementation, we would save to Supabase
      console.log('Saving hero data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Supabase implementation would be:
      /*
      const { error } = await supabase
        .from('hero_section')
        .update({
          job_title: data.job_title,
          quote: data.quote,
          email: data.email
        })
        .eq('id', heroData.id);
        
      if (error) throw error;
      */
      
      // Update local state to reflect saved data
      setHeroData({
        ...heroData,
        job_title: data.job_title,
        quote: data.quote,
        email: data.email
      });
      
      setHasUnsavedChanges(false);
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving hero data:', error);
      return Promise.reject(error);
    } finally {
      setSaving(false);
    }
  };
  
  // Character counters
  const jobTitleLength = watchedValues.job_title?.length || 0;
  const quoteLength = watchedValues.quote?.length || 0;
  const JOB_TITLE_MAX = 80;
  const QUOTE_MAX = 100;

  return (
    <ContentPageLayout
      title="Hero Section"
      icon={<FiEye size={24} />}
      breadcrumbs={[
        { label: "Dashboard", path: "/admin" },
        { label: "Main Page", path: "/admin/sections" },
        { label: "Hero Section" }
      ]}
      onSave={() => handleSubmit(handleSave)()}
      hasUnsavedChanges={hasUnsavedChanges}
      autoSaveEnabled={autoSaveEnabled}
      onToggleAutoSave={() => setAutoSaveEnabled(!autoSaveEnabled)}
      previewUrl="/"
      previewOptions={{
        device: previewDevice,
        onDeviceChange: setPreviewDevice,
        devices: [
          { id: 'mobile', icon: <FiSmartphone size={16} />, label: 'Mobile' },
          { id: 'tablet', icon: <FiTablet size={16} />, label: 'Tablet' },
          { id: 'desktop', icon: <FiMonitor size={16} />, label: 'Desktop' }
        ]
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
          <ContentSection 
            title="Basic Information" 
            icon={<FiEye size={20} />}
            collapsible={true}
            defaultCollapsed={false}
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="job_title" className="block text-sm font-medium text-gray-300">
                    Job Title / Designation <span className="text-emerald-500">*</span>
                </label>
                  <span className={`text-xs ${jobTitleLength > JOB_TITLE_MAX ? 'text-red-400' : 'text-gray-400'}`}>
                    {jobTitleLength}/{JOB_TITLE_MAX}
                  </span>
                </div>
                <input
                  id="job_title"
                  {...register("job_title", { 
                    required: "Job title is required", 
                    maxLength: {
                      value: JOB_TITLE_MAX,
                      message: `Job title cannot exceed ${JOB_TITLE_MAX} characters`
                    }
                  })}
                  className={`w-full px-4 py-2.5 bg-black/30 border rounded-lg text-white placeholder-gray-500 
                    transition-colors ${errors.job_title ? 'border-red-500' : 'border-gray-700 focus:border-emerald-500'}`}
                  placeholder="e.g. UI/UX DESIGNER & CREATIVE TECHNOLOGIST"
                />
                {errors.job_title && (
                  <p className="mt-1 text-xs text-red-500">{errors.job_title.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  This appears as your professional title on the hero section
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="quote" className="block text-sm font-medium text-gray-300">
                    Quote / Tagline
                </label>
                  <span className={`text-xs ${quoteLength > QUOTE_MAX ? 'text-red-400' : 'text-gray-400'}`}>
                    {quoteLength}/{QUOTE_MAX}
                  </span>
                </div>
                <textarea
                  id="quote"
                  rows={2}
                  {...register("quote", { 
                    maxLength: {
                      value: QUOTE_MAX,
                      message: `Quote cannot exceed ${QUOTE_MAX} characters`
                    }
                  })}
                  className={`w-full px-4 py-2.5 bg-black/30 border rounded-lg text-white placeholder-gray-500 
                    transition-colors ${errors.quote ? 'border-red-500' : 'border-gray-700 focus:border-emerald-500'}`}
                  placeholder="e.g. Creating clarity in a chaotic digital world"
                />
                {errors.quote && (
                  <p className="mt-1 text-xs text-red-500">{errors.quote.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  A short, catchy phrase that describes your work or philosophy
                </p>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Contact Email <span className="text-emerald-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address format"
                    }
                  })}
                  className={`w-full px-4 py-2.5 bg-black/30 border rounded-lg text-white placeholder-gray-500 
                    transition-colors ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-emerald-500'}`}
                  placeholder="e.g. your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Contact email displayed on your portfolio
                </p>
              </div>
            </div>
          </ContentSection>
          
          <ContentSection 
            title="Live Preview" 
            icon={<FiEye size={20} />}
            collapsible={true}
            defaultCollapsed={false}
          >
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg border border-gray-800">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                    MANIKANDAN S
                  </h1>
                  <h2 className="text-xl md:text-2xl font-medium text-emerald-500 mb-2">
                    {watchedValues.job_title || "UI/UX DESIGNER & CREATIVE TECHNOLOGIST"}
                  </h2>
                  <p className="text-gray-300 italic">
                    {watchedValues.quote || "Creating clarity in a chaotic digital world"}
                  </p>
            </div>
            
                <div className="mt-8 flex">
                  <div className="bg-emerald-900/20 px-4 py-2 rounded-md inline-flex items-center">
                    <span className="text-sm text-emerald-400">
                      {watchedValues.email || "smk.manikandan.dev@gmail.com"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ContentSection>
          
          {/* Manual save button (when auto-save is disabled) */}
          {!autoSaveEnabled && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving || !hasUnsavedChanges}
                loading={saving}
                icon={<FiSave size={16} />}
              >
                Save Changes
              </Button>
            </div>
          )}
        </form>
      )}
    </ContentPageLayout>
  );
};

export default CMSHeroPage; 
