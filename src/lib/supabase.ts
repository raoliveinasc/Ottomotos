import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  'https://mnennrjxbgumiyarnxjc.supabase.co';

const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZW5ucmp4Ymd1bWl5YXJueGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMzE5NDAsImV4cCI6MjA5NjkwNzk0MH0.cmUcrzufzxEE6IJPVPDhVb2woBejArU2Rgu-5naeesQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
