import { OpenAI } from 'openai';
import { 
  ParsedResume, 
  ConvertedResume, 
  ChatGPTPrompt, 
  ChatGPTResponse 
} from './types';
import { 
  RoleKey, 
  getMappingForRole
} from './mappingDictionary';

// Initialize OpenAI client
let openaiClient: OpenAI | null = null;

export function initializeOpenAI(apiKey: string) {
  openaiClient = new OpenAI({
    apiKey: apiKey,
  });
}

/**
 * Convert parsed resume to themed resume using ChatGPT - SIMPLIFIED VERSION
 */
export async function convertResumeWithAI(
  parsedResume: ParsedResume,
  roleKey: RoleKey,
  username: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    includePortfolio?: boolean;
  } = {}
): Promise<ChatGPTResponse> {
  if (!openaiClient) {
    return {
      success: false,
      error: 'OpenAI client not initialized. Please provide API key.'
    };
  }

  try {
    const roleMapping = getMappingForRole(roleKey);
    
    // Build the simplified prompt
    const prompt = buildSimpleConversionPrompt(parsedResume, roleKey, username, options.includePortfolio || false);
    
    // Call OpenAI API
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: prompt.systemPrompt
        },
        {
          role: 'user', 
          content: prompt.userPrompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 3000,
      response_format: { type: 'json_object' }
    });

    if (!response.choices[0]?.message?.content) {
      return {
        success: false,
        error: 'Empty response from OpenAI'
      };
    }

    // Parse and validate response
    const convertedResume = parseAIResponse(response.choices[0].message.content, parsedResume, roleKey);
    
    return {
      success: true,
      data: convertedResume,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0
      }
    };

  } catch (error) {
    console.error('ChatGPT conversion error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Build simple, role-specific conversion prompt
 */
function buildSimpleConversionPrompt(
  parsedResume: ParsedResume, 
  roleKey: RoleKey,
  username: string,
  includePortfolio: boolean
): ChatGPTPrompt {
  const roleMapping = getMappingForRole(roleKey);

  // Creative role transformations with proper tech-to-role mappings
  const roleTransformations = {
    'auto-rickshaw-driver': {
      roleTitle: 'Full-Stack Auto Navigator & Passenger Experience Engineer',
      nickname: 'TrafficStack',
      summary: 'A results-driven Full-Stack Auto Driver with 3+ years of hands-on experience in route optimization, passenger satisfaction, and real-time traffic navigation. Adept at leveraging MERN stack routes (Malappuram-Ernakulam-Route-Navigation) to create dynamic, responsive, and passenger-centric journeys.',
      techMappings: {
        'JavaScript': 'Route-Planning Script',
        'React.js': 'React-ive Traffic Response System',
        'Node.js': 'Route Junction Management',
        'MongoDB': 'Passenger Route Database',
        'Express.js': 'Express Route Streaming Protocol',
        'TypeScript': 'TrafficScript v2',
        'Git': 'GPS Integration Tracker',
        'Tailwind CSS': 'Traffic Light Layout System',
        'Firebase': 'FuelBase - Real-time consumption logs',
        'Postman': 'PassengerPost - Route testing & navigation',
        'HTML': 'Highway Traffic Markup Language',
        'CSS': 'Complete Street Styling',
        'Python': 'Passenger-oriented Navigation'
      }
    },
    'coconut-climber': {
      roleTitle: 'Full-Stack Tree Navigator & Coconut Deployment Engineer',
      nickname: 'CoconutStack',
      summary: 'A results-driven Full-Stack Coconut Climber with 3+ years of hands-on experience in tree scaling, coconut harvesting, and palm maintenance. Adept at leveraging MERN stack heights (Malayan-Elevated-Retrieval-Navigation) to create scalable, efficient, and harvest-centric operations.',
      techMappings: {
        'JavaScript': 'Tree-Climbing Script',
        'React.js': 'React-ive Palm Response System',
        'Node.js': 'Coconut Node Management',
        'MongoDB': 'Palm Tree Growth Database',
        'Express.js': 'Express Coconut Streaming Protocol',
        'TypeScript': 'TreeScript v2',
        'Git': 'Grove Integration Tracker',
        'Tailwind CSS': 'Palm Leaf Layout System',
        'Firebase': 'FarmBase - Real-time harvest logs',
        'Postman': 'PalmPost - Tree testing & climbing',
        'HTML': 'Height Tree Markup Language',
        'CSS': 'Coconut Styling System',
        'Python': 'Palm-oriented Navigation'
      }
    },
    'pani-puri-seller': {
      roleTitle: 'Full-Stack Street Food Engineer & Pani Puri Deployment Specialist',
      nickname: 'PuriStack',
      summary: 'A results-driven Full-Stack Pani Puri Vendor with 3+ years of hands-on experience in street food preparation, customer satisfaction, and real-time puri deployment. Adept at leveraging MERN stack flavors (Masala-Enhanced-Recipe-Navigation) to create crispy, flavorful, and customer-centric food experiences.',
      techMappings: {
        'JavaScript': 'Pani-Puri Script',
        'React.js': 'React-ive Flavor Response System',
        'Node.js': 'Puri Node Management',
        'MongoDB': 'Customer Taste Database',
        'Express.js': 'Express Puri Streaming Protocol',
        'TypeScript': 'TasteScript v2',
        'Git': 'Garam Integration Tracker',
        'Tailwind CSS': 'Street Cart Layout System',
        'Firebase': 'FlavorBase - Real-time taste logs',
        'Postman': 'PuriPost - Recipe testing & delivery',
        'HTML': 'Hunger Traffic Markup Language',
        'CSS': 'Customer Satisfaction Styling',
        'Python': 'Puri-oriented Navigation'
      }
    },
    'toddy-tapper': {
      roleTitle: 'Full-Stack Palm Wine Engineer & Toddy Deployment Specialist',
      nickname: 'ToddyStack',
      summary: 'A results-driven Full-Stack Toddy Tapper with 3+ years of hands-on experience in palm wine extraction, fermentation management, and real-time toddy deployment. Adept at leveraging MERN stack brewing (Malayan-Enhanced-Recipe-Navigation) to create smooth, potent, and customer-centric toddy experiences.',
      techMappings: {
        'JavaScript': 'Toddy-Tapping Script',
        'React.js': 'React-ive Fermentation Response System',
        'Node.js': 'Palm Node Management',
        'MongoDB': 'Toddy Quality Database',
        'Express.js': 'Express Toddy Streaming Protocol',
        'TypeScript': 'ToddyScript v2',
        'Git': 'Grove Integration Tracker',
        'Tailwind CSS': 'Palm Wine Layout System',
        'Firebase': 'FermentBase - Real-time brewing logs',
        'Postman': 'ToddyPost - Quality testing & delivery',
        'HTML': 'Height Tree Markup Language',
        'CSS': 'Customer Satisfaction Styling',
        'Python': 'Palm-oriented Navigation'
      }
    }
  };

  const transformation = roleTransformations[roleKey as keyof typeof roleTransformations] || roleTransformations['auto-rickshaw-driver'];

  const systemPrompt = `You are a creative resume converter that transforms tech resumes into hilarious Kerala profession parodies.

TARGET ROLE: ${transformation.roleTitle}
NICKNAME STYLE: ${transformation.nickname}

TRANSFORMATION STYLE (follow this example format):
- Role Title: "${transformation.roleTitle}"
- Nickname: "Soorya '${transformation.nickname}' Krishna"
- Summary: "${transformation.summary}"

TECH-TO-ROLE MAPPINGS (use these for skills transformation):
${Object.entries(transformation.techMappings).map(([tech, role]) => `- ${tech} → ${role}`).join('\n')}

CRITICAL RULES:
1. Keep ALL company names, dates, locations, numbers EXACTLY as provided
2. Transform job titles to match the role theme creatively
3. Convert project names to role-themed versions but keep original logic
4. Make it hilariously creative like the examples above
5. NO mention of "converted from X to Y" in the output
6. Use the person's actual experience timeline and companies
7. ALWAYS include ALL required JSON fields: roleTitle, nickname, contact, summary, workExperience, projects, education, skills, certifications, achievements, softSkills, coldMail

REQUIRED JSON STRUCTURE:
{
  "roleTitle": "${transformation.roleTitle}",
  "nickname": "Name '${transformation.nickname}' LastName",
  "contact": { "name": "...", "email": "...", "phone": "..." },
  "summary": "...",
  "workExperience": [...],
  "projects": [...],
  "education": [...],
  "skills": [...],
  "certifications": [...],
  "achievements": [...],
  "softSkills": [...],
  "coldMail": {
    "subject": "Professional job application subject",
    "greeting": "Dear Hiring Manager,",
    "introduction": "Brief introduction about the candidate",
    "keyHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
    "callToAction": "Request for interview or meeting",
    "signature": "Professional signature with contact details"
  }
}

Create a coherent, funny, professional resume that sounds authentic to someone who's always worked in this Kerala profession.`;

  const userPrompt = `USERNAME: ${username}

Transform this resume using the creative style shown above. Make it hilariously authentic!

ORIGINAL RESUME:
${JSON.stringify(parsedResume, null, 2)}

SPECIFIC REQUIREMENTS:
1. MANDATORY: Include ALL JSON fields - roleTitle, nickname, contact, summary, workExperience, projects, education, skills, certifications, achievements, softSkills, coldMail
2. Use the exact role title: "${transformation.roleTitle}"
3. Create nickname: "${parsedResume.contact.name?.split(' ')[0] || 'Professional'} '${transformation.nickname}' ${parsedResume.contact.name?.split(' ').slice(1).join(' ') || 'Expert'}"
4. Transform summary to match the provided style but use person's actual experience duration
5. Keep ALL company names, dates, locations EXACTLY as written - don't mix them up
6. Transform technical skills using ONLY the provided mappings
7. Convert projects to role-themed versions (e.g., "MovieCafe → ChayaCafe: Toddy Stall Booking") 
8. Make experience descriptions match the role theme but reflect actual work timeline
9. Generate certifications, achievements, and softSkills related to the role
10. Create coldMail with professional job application content
11. NO technical terms in final output - everything should sound like traditional Kerala profession
12. Ensure job positions and company names are coherent and properly formatted

Return ONLY valid JSON in the exact format specified above. NO additional text.`;

  return {
    systemPrompt,
    userPrompt,
    temperature: 0.7,
    maxTokens: 3000
  };
}

/**
 * Parse and validate AI response
 */
function parseAIResponse(content: string, originalResume: ParsedResume, roleKey: RoleKey): ConvertedResume {
  try {
    // Debug log the AI response
    console.log('🤖 AI Raw Response:', content);
    const response = JSON.parse(content);
    
    // Ensure required fields exist
    const roleMapping = getMappingForRole(roleKey);
    console.log('🎯 Role mapping:', roleMapping);
    console.log('📋 Parsed AI response keys:', Object.keys(response));
    
    return {
      roleTitle: response.roleTitle || roleMapping?.roleTitle || 'Professional',
      contact: response.contact || originalResume.contact,
      nickname: response.nickname || `Professional ${roleMapping?.roleTitle || 'Expert'}`,
      summary: response.summary || `Experienced ${roleMapping?.roleTitle || 'Professional'} from Kerala`,
      workExperience: response.workExperience || [],
      projects: response.projects || [],
      education: response.education || [],
      skills: response.skills || [],
      certifications: response.certifications || [],
      achievements: response.achievements || [],
      softSkills: response.softSkills || [],
      coldMail: response.coldMail || {
        subject: 'Professional Opportunity',
        greeting: 'Dear Hiring Manager,',
        introduction: `I am ${response.contact?.name || 'a professional'}, interested in opportunities.`,
        keyHighlights: ['Strong professional background', 'Excellent communication skills'],
        callToAction: 'I would welcome the opportunity to discuss how I can contribute.',
        signature: `Best regards,\n${response.contact?.name || 'Professional'}`
      }
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('Raw AI content causing error:', content);
    
    // Return fallback response
    const roleMapping = getMappingForRole(roleKey);
    return {
      roleTitle: roleMapping.roleTitle,
      contact: originalResume.contact,
      nickname: `Professional ${roleMapping.roleTitle}`,
      summary: `Experienced ${roleMapping.roleTitle} with years of expertise in Kerala`,
      workExperience: originalResume.workExperience?.slice(0, 3).map(exp => ({
        company: exp.company,
        position: `${roleMapping.roleTitle} at ${exp.company}`,
        startDate: exp.startDate,
        endDate: exp.endDate,
        duration: exp.duration,
        description: [`Worked as professional ${roleMapping.roleTitle.toLowerCase()}`],
        location: exp.location,
        isCurrentRole: exp.isCurrentRole
      })) || [],
      projects: [],
      education: originalResume.education || [],
      skills: ['Professional Skills', 'Customer Service', 'Local Expertise'],
      certifications: [],
      achievements: [],
      softSkills: ['Customer Communication', 'Problem Solving', 'Local Knowledge'],
      coldMail: {
        subject: `${roleMapping.roleTitle} Professional - Job Opportunity`,
        greeting: 'Dear Hiring Manager,',
        introduction: `I am a dedicated ${roleMapping.roleTitle} with extensive experience in Kerala.`,
        keyHighlights: [
          `Expert ${roleMapping.roleTitle} with local knowledge`,
          'Strong customer service and communication skills',
          'Proven track record of professional excellence'
        ],
        callToAction: 'I would welcome the opportunity to discuss how I can contribute to your team.',
        signature: `Best regards,\n${originalResume.contact?.name || 'Professional'}\n${originalResume.contact?.email || ''}\n${originalResume.contact?.phone || ''}`
      }
    };
  }
}
