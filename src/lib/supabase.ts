import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Portfolio storage will use fallback mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface PortfolioProfile {
  id?: string;
  username: string;
  converted_resume: any;
  portfolio_data: any;
  role_key: string;
  created_at?: string;
  updated_at?: string;
}

// Database operations
export async function savePortfolioProfile(profile: Omit<PortfolioProfile, 'id' | 'created_at' | 'updated_at'>) {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_profiles')
      .upsert({
        ...profile,
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'username',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving portfolio profile:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPortfolioProfile(username: string) {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Portfolio not found' };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching portfolio profile:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deletePortfolioProfile(username: string) {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('portfolio_profiles')
      .delete()
      .eq('username', username.toLowerCase());

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting portfolio profile:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
}
