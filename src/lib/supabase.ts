import { createClient } from '@supabase/supabase-js';
import { ConvertedResume } from './types';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface PortfolioProfile {
  id?: number;
  username: string;
  converted_resume: ConvertedResume;
  portfolio_data?: any;
  role_key: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseKey && supabase);
}

// Save or update portfolio profile
export async function savePortfolioProfile(profile: Omit<PortfolioProfile, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseResponse<PortfolioProfile>> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase not configured'
    };
  }

  try {
    // Check if user already exists
    const { data: existing, error: checkError } = await supabase
      .from('portfolio_profiles')
      .select('id')
      .eq('username', profile.username)
      .single();

    let result;
    
    if (existing) {
      // Update existing profile
      result = await supabase
        .from('portfolio_profiles')
        .update({
          converted_resume: profile.converted_resume,
          portfolio_data: profile.portfolio_data,
          role_key: profile.role_key,
          updated_at: new Date().toISOString()
        })
        .eq('username', profile.username)
        .select()
        .single();
    } else {
      // Insert new profile
      result = await supabase
        .from('portfolio_profiles')
        .insert({
          username: profile.username,
          converted_resume: profile.converted_resume,
          portfolio_data: profile.portfolio_data,
          role_key: profile.role_key
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Supabase save error:', result.error);
      return {
        success: false,
        error: result.error.message
      };
    }

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    console.error('Portfolio save error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get portfolio profile by username
export async function getPortfolioProfile(username: string): Promise<SupabaseResponse<PortfolioProfile>> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase not configured'
    };
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return {
          success: false,
          error: 'Portfolio not found'
        };
      }
      
      console.error('Supabase get error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get all portfolio profiles (for admin/analytics)
export async function getAllPortfolioProfiles(): Promise<SupabaseResponse<PortfolioProfile[]>> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase not configured'
    };
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get all error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: data || []
    };

  } catch (error) {
    console.error('Portfolio fetch all error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Delete portfolio profile
export async function deletePortfolioProfile(username: string): Promise<SupabaseResponse> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase not configured'
    };
  }

  try {
    const { error } = await supabase
      .from('portfolio_profiles')
      .delete()
      .eq('username', username.toLowerCase());

    if (error) {
      console.error('Supabase delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Portfolio delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Initialize database (create tables if they don't exist)
export async function initializeDatabase(): Promise<SupabaseResponse> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase not configured'
    };
  }

  try {
    // Check if table exists by trying to select from it
    const { error } = await supabase
      .from('portfolio_profiles')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      // Table doesn't exist - this should be handled by Supabase migrations
      return {
        success: false,
        error: 'Database table not found. Please run database migrations.'
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Database initialization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Health check for Supabase connection
export async function healthCheck(): Promise<SupabaseResponse> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase not configured'
    };
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_profiles')
      .select('count', { count: 'exact' });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: { count: data }
    };

  } catch (error) {
    console.error('Supabase health check error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}