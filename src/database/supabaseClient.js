// Note: This is a placeholder Supabase client setup
// In a real app, you would use your actual Supabase credentials

// Import the Supabase client constructor
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key would typically come from environment variables
// For demo purposes, we'll use placeholder values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export utility functions for common operations
export const getHeroSection = async () => {
  const { data, error } = await supabase
    .from('hero_section')
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
};

export const updateHeroSection = async (id, updates) => {
  const { data, error } = await supabase
    .from('hero_section')
    .update(updates)
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};

export default supabase; 