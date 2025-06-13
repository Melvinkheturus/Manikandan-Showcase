import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiFile, FiUpload, FiTrash2, FiCheck, FiX, FiChevronDown, FiEye, FiEyeOff
} from 'react-icons/fi';

/**
 * TextInput - Styled text input component
 */
export const TextInput = ({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder = '', 
  type = 'text', 
  error, 
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block mb-1.5 text-sm font-medium text-gray-200"
        >
          {label} {required && <span className="text-emerald-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2.5 bg-black/30 border rounded-lg text-white placeholder-gray-500 
            transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 
            ${error ? 'border-red-500' : isFocused ? 'border-emerald-500' : 'border-gray-700 hover:border-gray-600'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          `}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400"
            onClick={() => {
              // Toggle password visibility logic would go here
            }}
          >
            <FiEye size={16} />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

/**
 * TextArea - Styled textarea component
 */
export const TextArea = ({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder = '', 
  rows = 4, 
  error, 
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block mb-1.5 text-sm font-medium text-gray-200"
        >
          {label} {required && <span className="text-emerald-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5 bg-black/30 border rounded-lg text-white placeholder-gray-500 
          transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 
          ${error ? 'border-red-500' : isFocused ? 'border-emerald-500' : 'border-gray-700 hover:border-gray-600'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

/**
 * Select - Styled select component
 */
export const Select = ({ 
  label, 
  id, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select an option', 
  error, 
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle manual select and close dropdown
  const handleSelect = (value) => {
    onChange({ target: { name: id, value } });
    setIsOpen(false);
    setSearchQuery('');
  };

  // Filter options based on search query
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the label of the selected option
  const selectedLabel = options.find(option => option.value === value)?.label || placeholder;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block mb-1.5 text-sm font-medium text-gray-200"
        >
          {label} {required && <span className="text-emerald-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onFocus={() => setIsFocused(true)}
          className={`
            w-full px-4 py-2.5 bg-black/30 border rounded-lg text-left flex items-center justify-between
            transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30
            ${error ? 'border-red-500' : isFocused ? 'border-emerald-500' : 'border-gray-700 hover:border-gray-600'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${value ? 'text-white' : 'text-gray-500'}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          {...props}
        >
          <span className="block truncate">{selectedLabel}</span>
          <FiChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </button>
        
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 w-full mt-1 bg-black border border-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {options.length > 8 && (
              <div className="p-2 sticky top-0 bg-black border-b border-gray-800">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-9 pr-4 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-white placeholder-gray-500"
                    autoFocus
                  />
                </div>
              </div>
            )}
            <ul className="py-1" role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li 
                    key={option.value} 
                    onClick={() => handleSelect(option.value)}
                    className={`
                      px-4 py-2 cursor-pointer flex items-center
                      ${value === option.value 
                        ? 'bg-emerald-900/30 text-emerald-400' 
                        : 'text-gray-300 hover:bg-black/40 hover:text-white'}
                    `}
                    role="option"
                    aria-selected={value === option.value}
                  >
                    <span className="block truncate">{option.label}</span>
                    {value === option.value && (
                      <FiCheck className="ml-auto" size={16} />
                    )}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 text-sm">No options found</li>
              )}
            </ul>
          </motion.div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

/**
 * Checkbox - Styled checkbox component
 */
export const Checkbox = ({ 
  label, 
  id, 
  checked, 
  onChange, 
  error, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            w-5 h-5 mr-2 flex items-center justify-center rounded border 
            transition-colors duration-200
            ${checked ? 'bg-emerald-600 border-emerald-600' : 'bg-black/30 border-gray-700'} 
            ${disabled ? 'opacity-60' : checked ? 'hover:bg-emerald-700' : 'hover:border-gray-600'}
            ${error ? 'border-red-500' : ''}
          `}
        >
          {checked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <FiCheck size={14} className="text-white" />
            </motion.span>
          )}
        </div>
        {label && (
          <label 
            htmlFor={id} 
            className={`text-sm select-none ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 cursor-pointer'}`}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="ml-7 mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

/**
 * RadioGroup - Styled radio button group
 */
export const RadioGroup = ({ 
  label, 
  name, 
  options = [], 
  value, 
  onChange, 
  error, 
  disabled = false,
  orientation = 'vertical',
  className = '',
  ...props 
}) => {
  const handleChange = (selectedValue) => {
    onChange({ target: { name, value: selectedValue } });
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      <div className={`space-y-2 ${orientation === 'horizontal' ? 'sm:space-y-0 sm:space-x-6 sm:flex sm:items-center' : ''}`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <div className="relative flex items-center">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                disabled={disabled}
                className="sr-only"
                checked={value === option.value}
                onChange={() => handleChange(option.value)}
                {...props}
              />
              <div
                className={`
                  w-5 h-5 mr-2 rounded-full border-2 flex items-center justify-center
                  ${value === option.value ? 'border-emerald-500' : 'border-gray-700'} 
                  ${disabled ? 'opacity-60' : 'hover:border-gray-600'}
                  ${error ? 'border-red-500' : ''}
                `}
              >
                {value === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 rounded-full bg-emerald-500"
                  />
                )}
              </div>
              <label 
                htmlFor={`${name}-${option.value}`} 
                className={`text-sm select-none ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 cursor-pointer'}`}
              >
                {option.label}
              </label>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

/**
 * Toggle - Styled toggle switch component
 */
export const Toggle = ({ 
  label, 
  id, 
  checked, 
  onChange, 
  error, 
  disabled = false,
  size = 'default',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    small: {
      wrapper: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    default: {
      wrapper: 'w-11 h-6',
      circle: 'w-4 h-4',
      translate: 'translate-x-6',
    },
    large: {
      wrapper: 'w-14 h-7',
      circle: 'w-5 h-5',
      translate: 'translate-x-8',
    },
  };

  const { wrapper, circle, translate } = sizeClasses[size] || sizeClasses.default;

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <button 
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => !disabled && onChange({ target: { name: id, checked: !checked } })}
          className={`
            relative inline-flex ${wrapper} items-center rounded-full 
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30
            ${checked ? 'bg-emerald-500' : 'bg-gray-700'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            ${error ? 'ring-2 ring-red-500' : ''}
          `}
        >
          <motion.span
            layout
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30 
            }}
            className={`
              inline-block ${circle} transform rounded-full bg-white
              ${checked ? translate : 'translate-x-1'}
            `}
          />
        </button>
        {label && (
          <label 
            htmlFor={id} 
            className={`ml-2 text-sm select-none ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300'}`}
            onClick={() => !disabled && onChange({ target: { name: id, checked: !checked } })}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="ml-7 mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

/**
 * FileUpload - Styled file upload component
 */
export const FileUpload = ({
  label,
  id,
  accept = '',
  onChange,
  onRemove,
  error,
  value, // Current file or preview url
  disabled = false,
  className = '',
  maxSize = 5, // In MB
  preview = true, // Show preview or not
  ...props
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const hasFile = !!value;
  
  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      if (files[0].size > maxSize * 1024 * 1024) {
        alert(`File size exceeds ${maxSize}MB limit.`);
        return;
      }
      onChange({ target: { name: id, files } });
    }
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center
          ${disabled ? 'opacity-60 cursor-not-allowed border-gray-800 bg-black/20' : 
            isDragOver ? 'border-emerald-500 bg-emerald-900/10' : 
            hasFile ? 'border-emerald-700 bg-emerald-900/5' : 'border-gray-700 bg-black/20 hover:border-gray-600'}
          ${error ? 'border-red-500' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {hasFile && preview ? (
          <div className="space-y-3">
            {typeof value === 'string' && value.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
              <div className="relative w-full aspect-video bg-black/40 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={value} 
                  alt="Preview" 
                  className="max-h-full max-w-full object-contain" 
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg">
                <div className="flex items-center">
                  <FiFile size={24} className="text-emerald-400 mr-2" />
                  <span className="text-sm text-gray-300 truncate max-w-[200px]">
                    {typeof value === 'string' ? value.split('/').pop() : value.name}
                  </span>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-red-400 rounded transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <FiUpload size={36} className="text-emerald-500 opacity-70" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {isDragOver ? 'Drop to upload' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Max size: {maxSize}MB
                {accept && ` • Formats: ${accept.replace(/\./g, '').replace(/,/g, ', ')}`}
              </p>
            </div>
            {!disabled && (
              <div>
                <label 
                  htmlFor={id}
                  className="inline-flex px-4 py-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 text-sm rounded-lg cursor-pointer transition-colors"
                >
                  Browse Files
                </label>
                <input
                  type="file"
                  id={id}
                  name={id}
                  accept={accept}
                  onChange={onChange}
                  disabled={disabled}
                  className="sr-only"
                  {...props}
                />
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

/**
 * Button - Styled button component
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  icon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  // Define variants
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/30',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200 shadow-md shadow-black/30',
    outline: 'bg-transparent border border-emerald-600 text-emerald-500 hover:bg-emerald-900/10',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-800/70 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/30',
  };
  
  // Define sizes
  const sizes = {
    small: 'px-3 py-1.5 text-xs',
    default: 'px-4 py-2 text-sm',
    large: 'px-6 py-2.5 text-base',
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.default}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'transform hover:-translate-y-0.5'}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </motion.button>
  );
};

export default {
  TextInput,
  TextArea,
  Select,
  Checkbox,
  RadioGroup,
  Toggle,
  FileUpload,
  Button
}; 