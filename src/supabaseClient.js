import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if credentials are valid
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-supabase-anon-key'
)

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase credentials not found or incomplete. Admin and customer authentication are disabled until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.'
  );
}

// Instantiate client (using placeholder values if empty to avoid crash)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)
