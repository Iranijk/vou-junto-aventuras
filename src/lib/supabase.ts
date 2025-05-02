
import { createClient } from '@supabase/supabase-js';

// Use the provided API ID to construct the Supabase URL
const apiId = 'bcutnqyipkilxfltzvbt';
const supabaseUrl = `https://${apiId}.supabase.co`;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only log an error if we're in development and the anon key is missing
if (import.meta.env.DEV && !supabaseAnonKey) {
  console.error('Supabase Anon Key must be set in environment variables');
}

// Create the Supabase client with the API ID URL
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
