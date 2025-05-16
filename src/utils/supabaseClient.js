import { createClient } from '@supabase/supabase-js';

// Supabase URL and key
const supabaseUrl = 'https://oudwcxvsraqhpflglnbb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91ZHdjeHZzcmFxaHBmbGdsbmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MDgyMTAsImV4cCI6MjA2MjI4NDIxMH0.9-acHMTNEErYJhOp37dAV4s82b4rxBtEKQpoRFjQqAQ';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For backward compatibility with any code using default export
export default supabase; 