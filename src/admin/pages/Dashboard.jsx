import { useEffect, useState } from "react";
import supabase from "../../utils/supabaseClient";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch project count
      const { count: projectCount, error: projectError } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });
        
      if (projectError) throw projectError;
      
      // Fetch messages count (if you have a messages/contact table)
      const { count: messageCount, error: messageError } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true });
        
      if (messageError) throw messageError;
      
      setStats({
        projects: projectCount || 0,
        messages: messageCount || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Projects",
      count: stats.projects,
      icon: "📁",
      color: "bg-blue-500"
    },
    {
      title: "Messages",
      count: stats.messages,
      icon: "📨",
      color: "bg-green-500"
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl shadow-lg bg-gray-800"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${card.color}`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-300">{card.title}</h2>
                  <p className="text-3xl font-bold">{card.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/projects"
            className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
          >
            Manage Projects
          </a>
          <a
            href="/admin/settings"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Edit Settings
          </a>
        </div>
      </div>
    </div>
  );
} 