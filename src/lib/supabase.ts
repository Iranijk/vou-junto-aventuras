
import { createClient } from '@supabase/supabase-js';

// Use the provided API ID to construct the Supabase URL
const supabaseUrl = 'https://bcutnqyipkilxfltzvbt.supabase.co';

// Use the provided API key
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdXRucXlpcGtpbHhmbHR6dmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYzNjQsImV4cCI6MjA2MTc4MjM2NH0.0TTL0Bktq4i0OEnw2-CDO896wM-5NJH2tWOFiUMfo84';

// Create the Supabase client with the API URL and key
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
