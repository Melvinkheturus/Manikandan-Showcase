// This file serves as a compatibility layer for code that expects a default export
// from @supabase/postgrest-js but the module doesn't provide one
import { PostgrestClient } from '@supabase/postgrest-js';

// Re-export the class
export default PostgrestClient; 