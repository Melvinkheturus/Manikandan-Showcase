import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        // Default styles for all toasts
        className: '',
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#10b981',
          },
        },
        error: {
          style: {
            background: '#ef4444',
          },
        },
        loading: {
          style: {
            background: '#4b5563',
          },
        },
      }}
    />
  );
} 