
import { createClient } from '@supabase/supabase-js';

// Use the provided API ID to construct the Supabase URL
const apiId = 'bcutnqyipkilxfltzvbt';
const supabaseUrl = `https://${apiId}.supabase.co`;

// We need to provide a default anon key when the environment variable is not set
// This is a temporary solution - in production, always use environment variables
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdXRucXlpcGtpbHhmbHR6dmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwNTIyMDIsImV4cCI6MjA0MjYyODIwMn0.o_Q9PLKgUWGW-XA-pbRgixPvpW_rKiP0TFwYzCCkm8Y';

// Log a warning if we're in development to remind setting up the environment variable
if (import.meta.env.DEV) {
  if (!supabaseAnonKey) {
    console.error('Supabase Anon Key must be set in environment variables');
  } else if (supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdXRucXlpcGtpbHhmbHR6dmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwNTIyMDIsImV4cCI6MjA0MjYyODIwMn0.o_Q9PLKgUWGW-XA-pbRgixPvpW_rKiP0TFwYzCCkm8Y') {
    console.warn('Using default Supabase Anon Key. For production, set your own key in environment variables.');
  }
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
