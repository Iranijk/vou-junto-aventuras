
import { createClient } from '@supabase/supabase-js';

// Get the environment variables or use default values for testing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only log an error if we're in development and the variables are actually missing
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Supabase URL and Anon Key must be set in environment variables');
}

// Create the Supabase client with proper fallback handling
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey, 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
