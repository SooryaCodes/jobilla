import { NextRequest, NextResponse } from 'next/server';
import { ConvertedResume } from '@/lib/types';
import { RoleKey, getMappingForRole } from '@/lib/mappingDictionary';
import { initializeOpenAI } from '@/lib/promptBuilder-simple';
import { OpenAI } from 'openai';
import { 
  savePortfolioProfile, 
  getPortfolioProfile, 
  isSupabaseConfigured 
} from '@/lib/supabase';

// Fallback in-memory storage for development/fallback
const portfolioStore = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    let profile;

    // Try Supabase first, fallback to in-memory store
    if (isSupabaseConfigured()) {
      const result = await getPortfolioProfile(username);
      if (result.success) {
        profile = {
          username: result.data.username,
          convertedResume: result.data.converted_resume,
          portfolioData: result.data.portfolio_data,
          roleKey: result.data.role_key,
          createdAt: result.data.created_at,
          updatedAt: result.data.updated_at
        };
      } else if (result.error !== 'Portfolio not found') {
        console.error('Supabase error, falling back to memory store:', result.error);
        profile = portfolioStore.get(username);
      }
    } else {
      profile = portfolioStore.get(username);
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const body = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const { convertedResume, roleKey, apiKey } = body;

    if (!convertedResume || !roleKey) {
      return NextResponse.json(
        { error: 'convertedResume and roleKey are required' },
        { status: 400 }
      );
    }

    // Generate portfolio content
    const portfolioData = await generatePortfolioContent(convertedResume, roleKey, username, apiKey);

    const profile = {
      username: username.toLowerCase(),
      convertedResume,
      portfolioData,
      roleKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Try Supabase first, fallback to in-memory store
    if (isSupabaseConfigured()) {
      const result = await savePortfolioProfile({
        username: username.toLowerCase(),
        converted_resume: convertedResume,
        portfolio_data: portfolioData,
        role_key: roleKey
      });

      if (!result.success) {
        console.error('Supabase save failed, using memory store:', result.error);
        portfolioStore.set(username, profile);
      }
    } else {
      portfolioStore.set(username, profile);
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio created successfully',
      portfolioUrl: `/${username}`,
      portfolioData
    });

  } catch (error) {
    console.error('Portfolio creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}

async function generatePortfolioContent(
  convertedResume: ConvertedResume,
  roleKey: RoleKey,
  username: string,
  apiKey?: string
): Promise<any> {
  try {
    // Initialize OpenAI if API key is provided
    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Return basic portfolio without AI enhancement
      return generateBasicPortfolio(convertedResume, roleKey, username);
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });
    const roleMapping = getMappingForRole(roleKey);

    const systemPrompt = `You are a portfolio website generator. Create engaging portfolio content for a ${roleMapping.roleTitle} based on their resume.

Return JSON with this exact structure:
{
  "headline": "catchy headline",
  "heroText": "2-3 sentences about being the best ${roleMapping.roleTitle}",
  "sections": [
    {
      "title": "Experience",
      "content": "description of work experience",
      "emoji": "💼",
      "items": ["specific experience highlights"]
    },
    {
      "title": "Skills",
      "content": "description of skills",
      "emoji": "🛠️",
      "items": ["specific skills"]
    },
    {
      "title": "Projects",
      "content": "description of projects",
      "emoji": "🚀",
      "items": ["specific projects"]
    }
  ],
  "testimonials": [
    {
      "text": "testimonial text",
      "author": "Client/Colleague Name",
      "role": "their role"
    }
  ]
}`;

    const userPrompt = `Create portfolio content for:
Username: ${username}
Role: ${convertedResume.roleTitle}
Summary: ${convertedResume.summary}
Skills: ${convertedResume.skills.join(', ')}
Experience: ${convertedResume.workExperience.map(exp => `${exp.position} at ${exp.company}`).join(', ')}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('Empty response from OpenAI');
    }

    return JSON.parse(response.choices[0].message.content);

  } catch (error) {
    console.error('Portfolio generation error:', error);
    return generateBasicPortfolio(convertedResume, roleKey, username);
  }
}

function generateBasicPortfolio(convertedResume: ConvertedResume, roleKey: RoleKey, username: string): any {
  const roleMapping = getMappingForRole(roleKey);
  
  return {
    headline: `${convertedResume.nickname || convertedResume.contact.name} - Professional ${roleMapping.roleTitle}`,
    heroText: `Experienced ${roleMapping.roleTitle} with a passion for excellence and customer satisfaction. ${roleMapping.description}`,
    sections: [
      {
        title: 'Experience',
        content: 'Professional background with proven track record',
        emoji: '💼',
        items: convertedResume.workExperience.map(exp => `${exp.position} at ${exp.company}`)
      },
      {
        title: 'Skills',
        content: 'Comprehensive skill set for professional excellence',
        emoji: '🛠️',
        items: convertedResume.skills.slice(0, 6)
      },
      {
        title: 'Projects',
        content: 'Notable projects and achievements',
        emoji: '🚀',
        items: convertedResume.projects.map(proj => proj.name)
      }
    ],
    testimonials: [
      {
        text: `${convertedResume.nickname || convertedResume.contact.name} is a dedicated professional who consistently delivers excellent results.`,
        author: 'Satisfied Customer',
        role: 'Regular Client'
      }
    ]
  };
}
