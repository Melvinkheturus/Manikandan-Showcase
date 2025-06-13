import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiEye, FiEyeOff, FiSave, FiCheck, FiAlertTriangle, FiExternalLink, 
  FiGrid, FiLayers, FiToggleRight, FiToggleLeft, FiRefreshCw,
  FiSmartphone, FiTablet, FiMonitor, FiColumns
} from "react-icons/fi";

/**
 * ContentPageLayout - A reusable layout component for CMS content pages
 * 
 * @param {Object} props
 * @param {string} props.title - Page title (e.g. "Project Gallery")
 * @param {string} props.icon - Icon name or component for the page header
 * @param {Array} props.breadcrumbs - Array of breadcrumb objects { label, path }
 * @param {React.ReactNode} props.children - Child components to render in the layout
 * @param {Function} props.onSave - Save handler function
 * @param {boolean} props.hasUnsavedChanges - Whether there are unsaved changes
 * @param {boolean} props.autoSaveEnabled - Whether autosave is enabled
 * @param {Function} props.onToggleAutoSave - Handler for toggling autosave
 * @param {string} props.previewUrl - URL for preview functionality (optional)
 * @param {Object} props.previewOptions - Options for preview display (optional)
 * @param {string} props.previewOptions.device - Current device for preview (mobile, tablet, desktop)
 * @param {Function} props.previewOptions.onDeviceChange - Handler for changing preview device
 * @param {Array} props.previewOptions.devices - Array of device options { id, icon, label }
 * @param {boolean} props.showSectionVisibility - Whether to show section visibility toggle
 * @param {boolean} props.sectionVisible - Whether the section is visible
 * @param {Function} props.onToggleSectionVisibility - Handler for toggling section visibility
 * @param {string} props.pagePath - Path of the current page
 * @param {Array} props.customTabs - Array of custom tab objects { label, isActive }
 */
const ContentPageLayout = ({
  title,
  icon,
  breadcrumbs = [],
  children,
  onSave,
  hasUnsavedChanges = false,
  autoSaveEnabled = true,
  onToggleAutoSave,
  previewUrl,
  previewOptions,
  showSectionVisibility = false,
  sectionVisible = true,
  onToggleSectionVisibility,
  pagePath,
  customTabs
}) => {
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, success, error
  const [activeTab, setActiveTab] = useState("form"); // "form" or "preview"
  const [previewDevice, setPreviewDevice] = useState(previewOptions?.device || "desktop");

  // Check if this page should show visibility toggle based on path
  const shouldShowVisibilityToggle = () => {
    if (pagePath) {
      return [
        '/admin/sections/experience',
        '/admin/sections/testimonials',
        '/admin/sections/social'
      ].some(path => pagePath.startsWith(path));
    }
    return showSectionVisibility;
  };

  // Handle save status animation timing
  useEffect(() => {
    let timer;
    if (saveStatus === "success" || saveStatus === "error") {
      timer = setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [saveStatus]);

  // Handle save action
  const handleSave = async () => {
    if (!onSave || saveStatus === "saving") return;
    
    setSaveStatus("saving");
    try {
      await onSave();
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving content:", error);
      setSaveStatus("error");
    }
  };

  // Update internal state when external prop changes
  useEffect(() => {
    if (previewOptions?.device) {
      setPreviewDevice(previewOptions.device);
    }
  }, [previewOptions?.device]);

  // Handle device change
  const handleDeviceChange = (device) => {
    setPreviewDevice(device);
    if (previewOptions?.onDeviceChange) {
      previewOptions.onDeviceChange(device);
    }
  };

  // Get preview container class based on device
  const getPreviewContainerClass = () => {
    switch (previewDevice) {
      case "mobile":
        return "w-[375px] h-[667px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      case "desktop":
      default:
        return "w-full h-[800px]"; // Increased height for desktop preview
    }
  };

  // Save status indicators
  const renderSaveStatus = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-xs text-emerald-400"
          >
            <svg className="animate-spin mr-1 h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving changes...
          </motion.span>
        );
      case "success":
        return (
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-xs text-emerald-400"
          >
            <FiCheck className="mr-1" />
            All changes saved
          </motion.span>
        );
      case "error":
        return (
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-xs text-red-500"
          >
            <FiAlertTriangle className="mr-1" />
            Error saving changes
          </motion.span>
        );
      default:
        if (hasUnsavedChanges) {
          return (
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-xs text-amber-400"
            >
              <FiAlertTriangle className="mr-1" />
              Unsaved changes
            </motion.span>
          );
        }
        return (
          <span className="text-xs text-gray-400">
            No changes
          </span>
        );
    }
  };

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-black border border-gray-800 rounded-xl mb-6 shadow-lg"
      >
        {/* Title and breadcrumbs */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {icon && 
                <span className="bg-black text-emerald-400 p-2 rounded-lg mr-3">
                  {icon}
                </span>
              }
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {breadcrumbs.length > 0 && (
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    {breadcrumbs.map((crumb, idx) => (
                      <div key={idx} className="flex items-center">
                        {idx > 0 && <span className="mx-2">/</span>}
                        {crumb.path ? (
                          <Link to={crumb.path} className="hover:text-emerald-400 transition-colors">
                            {crumb.label}
                          </Link>
                        ) : (
                          <span>{crumb.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Section visibility toggle - Only for certain pages */}
              {shouldShowVisibilityToggle() && (
                <div className="flex items-center">
                  <button
                    onClick={onToggleSectionVisibility}
                    className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-gray-900 text-gray-300 hover:text-white"
                    title={sectionVisible ? "Hide from public site" : "Show on public site"}
                  >
                    {sectionVisible ? <FiEye className="mr-2" /> : <FiEyeOff className="mr-2" />}
                    {sectionVisible ? "Visible" : "Hidden"}
                  </button>
                </div>
              )}

              {/* Auto-save toggle */}
              {onToggleAutoSave && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-2">Auto</span>
                  <button 
                    onClick={onToggleAutoSave}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                      autoSaveEnabled ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoSaveEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></span>
                  </button>
                </div>
              )}

              {/* Tab switcher - Moved to the right side */}
              <div className="flex bg-gray-900 rounded-lg p-1">
                {customTabs ? (
                  // Use custom tabs if provided
                  customTabs.map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(tab.label.toLowerCase())}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        tab.isActive
                          ? "bg-black text-emerald-400" 
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))
                ) : (
                  // Use default Form/Preview tabs
                  <>
                    <button
                      onClick={() => setActiveTab("form")}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "form" 
                          ? "bg-black text-emerald-400" 
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      Form
                    </button>
                    {previewUrl && (
                      <button
                        onClick={() => setActiveTab("preview")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          activeTab === "preview" 
                            ? "bg-black text-emerald-400" 
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        Preview
                      </button>
                    )}
                  </>
                )}
              </div>
              
              {/* Save status display */}
              <div className="text-right">
                {renderSaveStatus()}
              </div>
                
              {/* Manual save button (when auto-save is disabled) */}
              {onSave && !autoSaveEnabled && (
                <button
                  onClick={handleSave}
                  disabled={saveStatus === "saving"}
                  className={`
                    flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                    ${!hasUnsavedChanges 
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }
                    transition-colors
                  `}
                >
                  {saveStatus === "saving" ? (
                    <>
                      <svg className="animate-spin mr-1 h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-1.5" /> 
                      Save
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview Content - Conditionally shown */}
        {activeTab === "preview" && previewUrl && (
          <div className="p-6 border-b border-gray-800">
            {/* Device selector */}
            <div className="flex justify-center mb-4 space-x-4">
              <button
                onClick={() => handleDeviceChange("mobile")}
                className={`p-2 rounded-md ${previewDevice === "mobile" ? "bg-black text-emerald-400" : "text-gray-400 hover:text-white"}`}
                title="Mobile View"
              >
                <FiSmartphone size={20} />
              </button>
              <button
                onClick={() => handleDeviceChange("tablet")}
                className={`p-2 rounded-md ${previewDevice === "tablet" ? "bg-black text-emerald-400" : "text-gray-400 hover:text-white"}`}
                title="Tablet View"
              >
                <FiTablet size={20} />
              </button>
              <button
                onClick={() => handleDeviceChange("desktop")}
                className={`p-2 rounded-md ${previewDevice === "desktop" ? "bg-black text-emerald-400" : "text-gray-400 hover:text-white"}`}
                title="Desktop View"
              >
                <FiMonitor size={20} />
              </button>
            </div>
            
            {/* Preview iframe */}
            <div className="flex justify-center overflow-hidden">
              <div className={`bg-white rounded-lg overflow-hidden shadow-xl ${getPreviewContainerClass()}`}>
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="Page Preview"
                ></iframe>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <a 
                href={previewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-emerald-400 hover:text-emerald-300"
              >
                <FiExternalLink className="mr-1" />
                Open in new tab
              </a>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Main Content Area - Only shown on Form tab or if custom tabs are used */}
      {(activeTab === "form" || customTabs) && (
        <div className="space-y-6 pb-8">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * ContentSection - A reusable component for individual content sections
 * 
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.icon - Icon component for the section
 * @param {React.ReactNode} props.children - Child components to render in the section
 * @param {boolean} props.visible - Whether the section is visible on the site
 * @param {Function} props.onToggleVisibility - Handler for toggling visibility
 * @param {boolean} props.collapsible - Whether the section can be collapsed
 * @param {boolean} props.defaultCollapsed - Whether the section should be collapsed by default
 * @param {string} props.className - Additional CSS classes to apply
 */
export const ContentSection = ({ 
  title,
  icon,
  children,
  visible = true,
  onToggleVisibility,
  collapsible = true,
  defaultCollapsed = false,
  className = ""
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
        <div className="flex items-center">
          <span className="text-lg text-emerald-400 mr-3">{icon}</span>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <div className="flex items-center space-x-3">
          {onToggleVisibility && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleVisibility}
              className={`p-1.5 rounded-md ${visible ? 'text-emerald-400 hover:bg-gray-900' : 'text-gray-500 hover:bg-gray-900'}`}
              title={visible ? "Click to hide section" : "Click to show section"}
            >
              {visible ? <FiEye size={18} /> : <FiEyeOff size={18} />}
            </motion.button>
          )}
          
          {collapsible && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md text-gray-400 hover:bg-gray-900"
              title={isCollapsed ? "Expand section" : "Collapse section"}
            >
              {isCollapsed ? <FiLayers size={18} /> : <FiGrid size={18} />}
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Section Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`p-5 ${!visible ? 'opacity-60' : ''}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * FormRow - A reusable component for form rows
 */
export const FormRow = ({ 
  label, 
  htmlFor, 
  error,
  className = "",
  children 
}) => {
  return (
    <div className={`mb-4 last:mb-0 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block mb-1.5 text-sm font-medium text-gray-200"
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default ContentPageLayout; 