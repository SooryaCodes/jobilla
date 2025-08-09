import { NextResponse } from 'next/server';
import { isSupabaseConfigured, healthCheck } from '@/lib/supabase';

export async function GET() {
  try {
    const checks = {
      supabase: {
        configured: isSupabaseConfigured(),
        connection: null as any,
        error: null as string | null
      },
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        key_format: process.env.OPENAI_API_KEY ? 
          `${process.env.OPENAI_API_KEY.substring(0, 7)}...` : null
      },
      environment: {
        node_env: process.env.NODE_ENV,
        next_version: process.env.npm_package_version || 'unknown'
      }
    };

    // Test Supabase connection if configured
    if (checks.supabase.configured) {
      try {
        const result = await healthCheck();
        checks.supabase.connection = result.success;
        if (!result.success) {
          checks.supabase.error = result.error || 'Unknown error';
        }
      } catch (error) {
        checks.supabase.connection = false;
        checks.supabase.error = error instanceof Error ? error.message : 'Connection failed';
      }
    }

    const overall_status = 
      checks.openai.configured && 
      (checks.supabase.configured ? checks.supabase.connection : true);

    return NextResponse.json({
      status: overall_status ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
      recommendations: getRecommendations(checks)
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed'
      },
      { status: 500 }
    );
  }
}

function getRecommendations(checks: any): string[] {
  const recommendations: string[] = [];

  if (!checks.openai.configured) {
    recommendations.push('Add OPENAI_API_KEY to your environment variables for AI resume conversion');
  }

  if (!checks.supabase.configured) {
    recommendations.push('Add Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) for portfolio persistence');
  }

  if (checks.supabase.configured && !checks.supabase.connection) {
    recommendations.push('Check Supabase connection - verify your credentials and database setup');
  }

  if (recommendations.length === 0) {
    recommendations.push('All systems operational! 🚀');
  }

  return recommendations;
}
