import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!data.session) {
          navigate("/admin/login");
          return;
        }
        
        setUser(data.session.user);
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary"></div>
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="flex flex-col space-y-4">
          <Link to="/admin" className="py-2 px-4 hover:bg-gray-800 rounded-lg transition-colors">
            Dashboard
          </Link>
          <Link to="/admin/projects" className="py-2 px-4 hover:bg-gray-800 rounded-lg transition-colors">
            Projects
          </Link>
          <Link to="/admin/settings" className="py-2 px-4 hover:bg-gray-800 rounded-lg transition-colors">
            Settings
          </Link>
        </nav>
        
        <div className="pt-6 mt-6 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full py-2 px-4 text-left text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
} 