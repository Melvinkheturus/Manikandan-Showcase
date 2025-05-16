import React, { useState, useEffect } from 'react';
import { SOUND_CATEGORIES } from '../hooks/useSoundEffects';

/**
 * Admin panel for managing audio settings in the CMS
 * This would be integrated with your backend/Supabase
 */
const AudioManager = () => {
  const [audioSettings, setAudioSettings] = useState({});
  const [masterVolume, setMasterVolume] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Groups for organizing audio settings
  const audioGroups = [
    {
      id: 'ambient',
      title: 'Ambient Sound',
      items: [
        { id: SOUND_CATEGORIES.AMBIENT, label: 'Background Ambient' }
      ]
    },
    {
      id: 'ui',
      title: 'UI Sounds',
      items: [
        { id: `${SOUND_CATEGORIES.UI}_click`, label: 'Button Click' },
        { id: `${SOUND_CATEGORIES.UI}_hover`, label: 'Hover Effect' },
        { id: `${SOUND_CATEGORIES.UI}_success`, label: 'Success Notification' }
      ]
    },
    {
      id: 'transition',
      title: 'Transition Sounds',
      items: [
        { id: `${SOUND_CATEGORIES.TRANSITION}_default`, label: 'Default Transition' },
        { id: `${SOUND_CATEGORIES.WELCOME}_hero`, label: 'Welcome to Hero' }
      ]
    },
    {
      id: 'section',
      title: 'Section Transitions',
      items: [
        { id: `${SOUND_CATEGORIES.SECTION}_about`, label: 'About Section' },
        { id: `${SOUND_CATEGORIES.SECTION}_skills`, label: 'Skills Section' },
        { id: `${SOUND_CATEGORIES.SECTION}_projects`, label: 'Projects Section' },
        { id: `${SOUND_CATEGORIES.SECTION}_contact`, label: 'Contact Section' }
      ]
    },
    {
      id: 'project',
      title: 'Project Sounds',
      items: [
        { id: `${SOUND_CATEGORIES.PROJECT}_reveal`, label: 'Project Reveal' }
      ]
    }
  ];

  // Fetch current audio settings on component mount
  useEffect(() => {
    fetchAudioSettings();
  }, []);

  // Fetch audio settings from API/Supabase
  const fetchAudioSettings = async () => {
    try {
      // This would be an API call in a real implementation
      // For now, just mock some default data
      const mockSettings = {
        // These would come from your database
        [SOUND_CATEGORIES.AMBIENT]: {
          src: '/sounds/ambient.mp3',
          volume: 0.3,
          loop: true,
          enabled: true
        },
        [`${SOUND_CATEGORIES.UI}_click`]: {
          src: '/sounds/click.mp3',
          volume: 0.5,
          loop: false,
          enabled: true
        }
        // Other sounds would be here...
      };
      
      setAudioSettings(mockSettings);
      // You'd also fetch master volume here
      setMasterVolume(0.8);
    } catch (error) {
      console.error('Failed to fetch audio settings:', error);
      setMessage({ type: 'error', text: 'Failed to load audio settings' });
    }
  };

  // Save all audio settings
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // This would be an API call to save settings
      // For example, using Supabase:
      // await supabase.from('audio_settings').upsert(transformedSettings);
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessage({ type: 'success', text: 'Audio settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save audio settings:', error);
      setMessage({ type: 'error', text: 'Failed to save audio settings' });
    } finally {
      setIsSaving(false);
    }
  };

  // Update a single audio setting
  const updateAudioSetting = (id, field, value) => {
    setAudioSettings(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  // Test playing a sound
  const testSound = (id) => {
    const setting = audioSettings[id];
    if (!setting || !setting.src) return;
    
    const audio = new Audio(setting.src);
    audio.volume = setting.volume || 0.5;
    audio.play();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Audio Management</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Master Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="ml-2 text-gray-700 w-12">{Math.round(masterVolume * 100)}%</span>
          </div>
          
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>
      
      {/* Status message */}
      {message && (
        <div className={`p-3 mb-6 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      
      {/* Audio settings by group */}
      <div className="space-y-6">
        {audioGroups.map(group => (
          <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
              {group.title}
            </div>
            
            <div className="divide-y divide-gray-200">
              {group.items.map(item => {
                const setting = audioSettings[item.id] || {};
                
                return (
                  <div key={item.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 font-medium text-gray-700">{item.label}</div>
                    
                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder="Sound file path"
                        value={setting.src || ''}
                        onChange={(e) => updateAudioSetting(item.id, 'src', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      <span className="mr-2 text-gray-600 text-sm">Volume:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={setting.volume || 0.5}
                        onChange={(e) => updateAudioSetting(item.id, 'volume', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="ml-2 text-gray-600 text-sm w-8">{Math.round((setting.volume || 0.5) * 100)}%</span>
                    </div>
                    
                    <div className="col-span-1 flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.loop || false}
                          onChange={(e) => updateAudioSetting(item.id, 'loop', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-emerald-600"
                        />
                        <span className="ml-2 text-gray-600 text-sm">Loop</span>
                      </label>
                    </div>
                    
                    <div className="col-span-1 flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.enabled !== false}
                          onChange={(e) => updateAudioSetting(item.id, 'enabled', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-emerald-600"
                        />
                        <span className="ml-2 text-gray-600 text-sm">Enabled</span>
                      </label>
                    </div>
                    
                    <div className="col-span-1 text-right">
                      <button
                        className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        onClick={() => testSound(item.id)}
                        disabled={!setting.src}
                        title="Test Sound"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Add new sound button */}
      <div className="mt-6">
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          // This would open a modal to add a new custom sound
          onClick={() => alert('Add new sound functionality would go here')}
        >
          Add Custom Sound
        </button>
      </div>
    </div>
  );
};

export default AudioManager; 