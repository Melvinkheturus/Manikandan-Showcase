import { useState, useEffect } from "react";
import supabase from "../../utils/supabaseClient";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    welcome_message: "",
    about_content: "",
    contact_email: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    show_particle_effect: true,
    portfolio_theme: "dark"
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();
        
      if (error && error.code !== "PGRST116") {
        // PGRST116 is the error code for "no rows returned" in PostgREST
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings");
        return;
      }
      
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const saveToast = toast.loading("Saving settings...");
    
    try {
      const { data, error } = await supabase
        .from("settings")
        .upsert(settings, { onConflict: "id" });
        
      if (error) throw error;
      
      toast.success("Settings saved successfully!", { id: saveToast });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings", { id: saveToast });
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component remains the same
}