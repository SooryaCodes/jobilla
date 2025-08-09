import { NextRequest, NextResponse } from 'next/server';
import { convertResumeWithAI, initializeOpenAI } from '@/lib/promptBuilder-simple';
import { RoleKey } from '@/lib/mappingDictionary';
import { ParsedResume } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { 
      parsedResume, 
      roleKey,
      username,
      apiKey,
      options = {} 
    }: {
      parsedResume: ParsedResume;
      roleKey: RoleKey;
      username: string;
      apiKey?: string;
      options?: {
        temperature?: number;
        maxTokens?: number;
        includePortfolio?: boolean;
      };
    } = await request.json();

    // Validate required inputs
    if (!parsedResume) {
      return NextResponse.json(
        { success: false, error: 'Parsed resume data required' },
        { status: 400 }
      );
    }

    if (!roleKey) {
      return NextResponse.json(
        { success: false, error: 'Role selection required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI with provided API key or environment variable
    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: '🚨 OpenAI API Key Missing! Please add OPENAI_API_KEY to your .env file. Get your key from: https://platform.openai.com/api-keys' 
        },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    initializeOpenAI(openaiApiKey);

    // Convert resume using AI
    const conversionResult = await convertResumeWithAI(
      parsedResume,
      roleKey,
      username || 'professional',
      {
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 3000,
        includePortfolio: options.includePortfolio || false
      }
    );

    if (!conversionResult.success) {
      return NextResponse.json({
        success: false,
        error: conversionResult.error,
        details: 'AI conversion failed. Please try again with a different role or check your API key.'
      }, { status: 500 });
    }

    // Return converted resume
    return NextResponse.json({
      success: true,
      data: conversionResult.data,
      usage: conversionResult.usage,
      roleKey,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Conversion error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, error: 'Invalid OpenAI API key' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { success: false, error: 'API quota exceeded. Please check your OpenAI billing.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Resume conversion failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Optional: GET route for conversion status or available roles
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'roles') {
    // Return available roles
    const { getAllRoles } = await import('@/lib/mappingDictionary');
    const roles = getAllRoles();
    
    return NextResponse.json({
      success: true,
      roles
    });
  }

  if (action === 'status') {
    // Check API status
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    
    return NextResponse.json({
      success: true,
      status: {
        apiKeyConfigured: hasApiKey,
        availableModels: ['gpt-4o', 'gpt-3.5-turbo'],
        maxTokens: 4000
      }
    });
  }

  return NextResponse.json(
    { success: false, error: 'Invalid action parameter' },
    { status: 400 }
  );
}
