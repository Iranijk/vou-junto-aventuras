
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

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The bucket to upload to
 * @param path The path within the bucket
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    if (!file) return null;
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600'
      });
      
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return null;
  }
};
