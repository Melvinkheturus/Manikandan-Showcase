import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const AdminLayout = () => {
  // User data (in a real app, this would be fetched from an auth context or API)
  const userData = {
    name: 'Mani',
    role: 'Admin'
  };
  
  return (
    <div className="h-screen overflow-hidden bg-black no-horizontal-scroll">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="ml-0 md:ml-64 h-full flex flex-col">
        {/* Top Bar */}
        <AdminTopbar userName={userData.name} />
        
        {/* Main Content - Only one scrollable area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-0 bg-black">
          <div className="pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 