
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://hfjkmuonmttsjogmsxak.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmamttdW9ubXR0c2pvZ21zeGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMjI5OTgsImV4cCI6MjA2Mzc5ODk5OH0.thgO0hwb2XTupV67mwgQmxokH4ziUK2XQTeU1X38VvI";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
