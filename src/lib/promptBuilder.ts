import { OpenAI } from 'openai';
import { 
  ParsedResume, 
  ConvertedResume, 
  ChatGPTPrompt, 
  ChatGPTResponse 
} from './types';
import { 
  RoleKey, 
  getMappingForRole, 
  getContextualMappings,
  COMMON_TECH_TERMS 
} from './mappingDictionary';

// Initialize OpenAI client
let openaiClient: OpenAI | null = null;

export function initializeOpenAI(apiKey: string) {
  openaiClient = new OpenAI({
    apiKey: apiKey,
  });
}

/**
 * Convert parsed resume to themed resume using ChatGPT
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
    const contextualMappings = getContextualMappings(roleKey);
    
    // Build the prompt
    const prompt = buildConversionPrompt(parsedResume, roleKey, username, options.includePortfolio || false);
    
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
      max_tokens: options.maxTokens || 2000,
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
 * Build comprehensive conversion prompt
 */
function buildConversionPrompt(
  parsedResume: ParsedResume, 
  roleKey: RoleKey,
  username: string,
  includePortfolio: boolean
): ChatGPTPrompt {
  const roleMapping = getMappingForRole(roleKey);

  const systemPrompt = `You are a comedy resume converter specializing in absurd Kerala-themed career transformations. Your task is to convert a technical resume into a wildly funny "${roleMapping.roleTitle}" themed version while preserving all factual data.

🚨 CRITICAL TRANSFORMATION RULES - NO EXCEPTIONS:
1. COMPLETE TECHNICAL ELIMINATION: ZERO mention of programming, coding, development, software, applications, databases, APIs, frameworks, or ANY tech terms
2. TOTAL ROLE IMMERSION: This person has NEVER been a developer - they have ALWAYS been a ${roleMapping.roleTitle} their entire career
3. SKILL TRANSFORMATION: Every single skill must be transformed into ${roleMapping.roleTitle} equivalents (React.js → Traffic Navigation, MongoDB → Route Database, etc.)
4. EXPERIENCE REWRITE: ALL job descriptions must be 100% ${roleMapping.roleTitle} activities - no hybrid or transitional language
5. PROJECT CONVERSION: Every project becomes a ${roleMapping.roleTitle}-related achievement (web apps → route optimization systems, mobile apps → passenger convenience tools)
6. PRESERVE FACTS ONLY: Keep company names, dates, locations, numbers - TRANSFORM EVERYTHING ELSE

MANDATORY TRANSFORMATION EXAMPLES FOR ${roleMapping.roleTitle}:

TECHNICAL SKILLS → ${roleMapping.roleTitle.toUpperCase()} SKILLS:
- "React.js/Angular/Vue" → "Route Navigation & Traffic Management"
- "Node.js/Express" → "Passenger Service Coordination"
- "MongoDB/MySQL" → "Route Memory & Fare Calculation"
- "JavaScript/Python" → "Street Knowledge & Local Language"
- "REST APIs" → "Radio Communication & GPS Systems"
- "Git/GitHub" → "Route Sharing & Driver Networks"
- "Docker/AWS" → "Vehicle Maintenance & Safety Checks"
- "Testing/Debugging" → "Route Testing & Problem Solving"

JOB DESCRIPTIONS → ${roleMapping.roleTitle.toUpperCase()} ACTIVITIES:
- "Developed web applications" → "Perfected passenger pickup and drop-off routes across Kerala"
- "Built responsive interfaces" → "Created smooth passenger experiences during peak traffic hours"  
- "Managed databases" → "Maintained detailed knowledge of all local routes and shortcuts"
- "Implemented APIs" → "Coordinated with taxi stands and passenger booking systems"
- "Code reviews" → "Route optimization meetings with fellow drivers"
- "Performance optimization" → "Improved fuel efficiency and reduced travel time"
- "Team collaboration" → "Coordinated with traffic police and other transport operators"

PROJECT TRANSFORMATIONS:
- "E-commerce website" → "Passenger booking and fare calculation system"
- "Mobile app" → "Route tracking and passenger communication tool"  
- "Dashboard" → "Daily earnings and route performance tracker"
- "API service" → "Inter-driver communication and route sharing network"

ROLE CONTEXT:
- Target Role: ${roleMapping.roleTitle}
- Theme: ${roleMapping.description}
- Tone Instructions: ${roleMapping.toneInstructions.join(', ')}

🔥 ENFORCEMENT RULES:
- If you use ANY technical terms (code, software, app, database, API, framework), YOU HAVE FAILED
- If the summary mentions "development" or "programming", YOU HAVE FAILED  
- If skills include any programming languages or tech tools, YOU HAVE FAILED
- The person should sound like they've driven routes/served customers their whole life, NEVER touched a computer
- Make it HILARIOUSLY authentic to the role while showing real professional competence

YOU MUST MAKE EVERYTHING SOUND LIKE THE PERSON HAS BEEN A ${roleMapping.roleTitle.toUpperCase()} THEIR ENTIRE CAREER - NO EXCEPTIONS!

MAPPING DICTIONARY:
Use these mappings to transform technical terms:
${JSON.stringify(getContextualMappings(roleKey), null, 2)}

RESPONSE FORMAT:
Return a JSON object with this exact structure:
{
  "roleTitle": "${roleMapping.roleTitle}",
  "contact": {
    "name": "string (KEEP ORIGINAL)",
    "email": "string (KEEP ORIGINAL)",
    "phone": "string (KEEP ORIGINAL)", 
    "location": "string (KEEP ORIGINAL)",
    "linkedin": "string (KEEP ORIGINAL)",
    "github": "string (KEEP ORIGINAL)"
  },
  "nickname": "string (creative ${roleMapping.roleTitle} nickname like 'Road King Soorya' or 'Traffic Navigator Extraordinaire')",
  "summary": "string (COMPLETELY REWRITE as a ${roleMapping.roleTitle} - remove ALL tech jargon)",
  "workExperience": [
    {
      "company": "string (KEEP ORIGINAL)",
      "position": "string (${roleMapping.roleTitle} themed position - Senior Route Specialist, Professional Navigator, etc)",
      "startDate": "string (KEEP ORIGINAL)", 
      "endDate": "string (KEEP ORIGINAL)",
      "duration": "string (KEEP ORIGINAL)",
      "description": ["array of ${roleMapping.roleTitle} bullet points - focused on driving, passengers, routes, traffic, etc"],
      "location": "string (KEEP ORIGINAL)",
      "isCurrentRole": boolean
    }
  ],
  "projects": [
    {
      "name": "string (themed as transport/route projects but keep original in parentheses)",
      "description": ["themed as route optimization, passenger experience, traffic solutions"],
      "technologies": ["${roleMapping.roleTitle} tools and methods - Traffic Management Systems, Route Planning Apps, GPS Navigation, etc"],
      "url": "string (KEEP ORIGINAL)",
      "github": "string (KEEP ORIGINAL)"
    }
  ],
  "education": [
    {
      "institution": "string (KEEP ORIGINAL)",
      "degree": "string (KEEP ORIGINAL degree but add ${roleMapping.roleTitle}-relevant interpretation in parentheses)",
      "field": "string (KEEP ORIGINAL field but add contextual relevance)",
      "startDate": "string (KEEP ORIGINAL)",
      "endDate": "string (KEEP ORIGINAL)",
      "duration": "string (calculate or keep original)",
      "gpa": "string (KEEP ORIGINAL)",
      "location": "string (KEEP ORIGINAL)",
      "relevantCoursework": "array (courses that relate to ${roleMapping.roleTitle} work)",
      "achievements": "array (academic achievements, honors, etc)"
    }
  ],
  "skills": ["array of ${roleMapping.roleTitle} skills - Route Navigation, Traffic Management, Passenger Service, Vehicle Maintenance, GPS Systems, etc"],
  "certifications": [
    {
      "name": "string (REQUIRED - theme as ${roleMapping.roleTitle} certifications, e.g., 'Professional Route Navigation Certificate', 'Advanced Customer Service Certification')",
      "issuer": "string (KEEP ORIGINAL if exists, otherwise generate relevant authority like 'Kerala Transport Authority', 'Professional Services Board')",
      "date": "string (KEEP ORIGINAL if exists, otherwise generate recent date)",
      "credentialId": "string (KEEP ORIGINAL if exists, otherwise generate like 'KTA-2024-001')",
      "description": "string (brief description of what this certification covers)"
    }
  ],
  "achievements": [
    {
      "title": "string (${roleMapping.roleTitle} themed achievements)",
      "description": "string (themed as transport/driving accomplishments)",
      "date": "string (KEEP ORIGINAL)",
      "organization": "string (KEEP ORIGINAL)"
    }
  ],
  "softSkills": ["${roleMapping.roleTitle} soft skills - Customer Communication, Traffic Awareness, Route Planning, Time Management, etc"],
  "coldMail": {
    "subject": "string (compelling subject line for job applications)",
    "greeting": "string (role-specific greeting)",
    "introduction": "string (brief intro about the candidate)",
    "keyHighlights": ["array of 3-4 main selling points"],
    "callToAction": "string (professional request for interview/meeting)",
    "signature": "string (professional closing signature)"
  }
}`;

  const userPrompt = `USERNAME: ${username}
TARGET ROLE: ${roleMapping.roleTitle}

Transform this resume into a ${roleMapping.roleTitle} themed version. Make it hilariously authentic to someone who has worked in this Kerala profession their entire career.

ORIGINAL RESUME DATA:
${JSON.stringify({
    contact: parsedResume.contact,
    summary: parsedResume.summary,
    workExperience: parsedResume.workExperience.slice(0, 5),
    projects: parsedResume.projects.slice(0, 3),
    education: parsedResume.education.slice(0, 2),
    skills: parsedResume.skills.slice(0, 15),
    certifications: parsedResume.certifications.slice(0, 3),
    achievements: parsedResume.achievements.slice(0, 3)
  }, null, 2)}

TRANSFORMATION REQUIREMENTS:
1. SUMMARY: Write as a passionate ${roleMapping.roleTitle} with relevant experience
2. EXPERIENCE: Convert ALL job descriptions into ${roleMapping.roleTitle} activities only
3. PROJECTS: Convert ALL projects into ${roleMapping.roleTitle}-related achievements  
4. SKILLS: List only ${roleMapping.roleTitle}-relevant skills (max 8-10 skills)
5. EDUCATION: Make education more prominent with relevant coursework and achievements
6. COLD MAIL: Create compelling cold mail content integrated within the resume

CRITICAL REQUIREMENTS:
- EDUCATION must be detailed with relevant coursework and academic achievements
- COLD MAIL must be professional yet themed to the role
- Keep technical skills to a MINIMUM (max 8-10 total)
- Focus on PRACTICAL skills relevant to the ${roleMapping.roleTitle} role
- CERTIFICATIONS are MANDATORY - generate at least 2-3 ${roleMapping.roleTitle} relevant certifications
- If original resume has no certifications, CREATE professional ${roleMapping.roleTitle} certifications from relevant authorities

Make it funny but coherent - stick to ONE profession theme only!`;

  return {
    systemPrompt,
    userPrompt,
    temperature: 0.7,
    maxTokens: 2000
  };
}

/**
 * Parse AI response and validate structure
 */
function parseAIResponse(
  response: string, 
  originalResume: ParsedResume, 
  roleKey: RoleKey
): ConvertedResume {
  try {
    const parsed = JSON.parse(response);
    
    // Validate required fields
    if (!parsed.roleTitle || !parsed.contact || !parsed.summary) {
      throw new Error('Missing required fields in AI response');
    }
    
    // Ensure we preserve original contact info where not themed
    const contact = {
      ...originalResume.contact,
      ...parsed.contact,
      // Always preserve original contact details
      email: originalResume.contact.email || parsed.contact.email,
      phone: originalResume.contact.phone || parsed.contact.phone,
      linkedin: originalResume.contact.linkedin || parsed.contact.linkedin,
      github: originalResume.contact.github || parsed.contact.github
    };

    // Validate and clean work experience
    const workExperience = (parsed.workExperience || []).map((exp: any, index: number) => {
      const original = originalResume.workExperience[index];
      return {
        ...exp,
        // Preserve original factual data
        company: original?.company || exp.company,
        startDate: original?.startDate || exp.startDate,
        endDate: original?.endDate || exp.endDate,
        duration: original?.duration || exp.duration,
        location: original?.location || exp.location,
        isCurrentRole: original?.isCurrentRole || exp.isCurrentRole
      };
    });

    // Validate projects
    const projects = (parsed.projects || []).map((proj: any, index: number) => {
      const original = originalResume.projects[index];
      return {
        ...proj,
        // Preserve original URLs
        url: original?.url || proj.url,
        github: original?.github || proj.github
      };
    });

    // Validate education
    const education = (parsed.education || []).map((edu: any, index: number) => {
      const original = originalResume.education[index];
      return {
        ...edu,
        // Preserve original data
        institution: original?.institution || edu.institution,
        startDate: original?.startDate || edu.startDate,
        endDate: original?.endDate || edu.endDate,
        gpa: original?.gpa || edu.gpa,
        location: original?.location || edu.location
      };
    });

    // Validate certifications - ensure we always have at least 2-3 certifications
    let certifications = (parsed.certifications || []).map((cert: any, index: number) => {
      const original = originalResume.certifications[index];
      return {
        ...cert,
        // Preserve original issuer and dates
        issuer: original?.issuer || cert.issuer,
        date: original?.date || cert.date,
        credentialId: original?.credentialId || cert.credentialId,
        url: original?.url || cert.url,
        description: cert.description || `Professional certification in ${cert.name}`
      };
    });

    // If we don't have enough certifications, generate default ones for the role
    if (certifications.length < 2) {
      const roleMapping = getMappingForRole(roleKey);
      const defaultCertifications = generateDefaultCertifications(roleKey, roleMapping.roleTitle);
      certifications = [...certifications, ...defaultCertifications.slice(0, 3 - certifications.length)];
    }

    // Validate achievements
    const achievements = (parsed.achievements || []).map((ach: any, index: number) => {
      const original = originalResume.achievements[index];
      return {
        ...ach,
        // Preserve original dates and organizations
        date: original?.date || ach.date,
        organization: original?.organization || ach.organization
      };
    });

    const convertedResume: ConvertedResume = {
      roleTitle: parsed.roleTitle,
      contact,
      nickname: parsed.nickname,
      summary: parsed.summary,
      workExperience,
      projects,
      education,
      skills: parsed.skills || [],
      certifications,
      achievements,
      softSkills: parsed.softSkills || [],
      coldMail: parsed.coldMail || {
        subject: `${parsed.nickname || 'Professional'} - ${getMappingForRole(roleKey).roleTitle} Opportunity`,
        greeting: `Dear Hiring Team,`,
        introduction: `I am ${parsed.nickname || parsed.contact.name}, an experienced ${getMappingForRole(roleKey).roleTitle}.`,
        keyHighlights: ['Professional experience', 'Strong work ethic', 'Excellent customer service'],
        callToAction: 'I would love to discuss how I can contribute to your team.',
        signature: `Best regards,\n${parsed.contact.name}`
      }
    };

    return convertedResume;

  } catch (error) {
    console.error('Error parsing AI response:', error);
    
    // Instead of mindmapping fallback, retry with simpler AI approach
    return retryWithSimpleAIGeneration(originalResume, roleKey);
  }
}

/**
 * Retry with simple AI generation when complex prompt fails
 */
function retryWithSimpleAIGeneration(
  originalResume: ParsedResume,
  roleKey: RoleKey
): ConvertedResume {
  console.log('Complex AI generation failed, using basic fallback for reliability');
  return createBasicFallback(originalResume, roleKey);
}

/**
 * Create absolute minimal fallback when all AI attempts fail
 */
function createBasicFallback(originalResume: ParsedResume, roleKey: RoleKey): ConvertedResume {
  const roleMapping = getMappingForRole(roleKey);
  
  return {
    roleTitle: roleMapping.roleTitle,
    contact: originalResume.contact,
    nickname: generateNickname(originalResume.contact.name, roleKey),
    summary: `Experienced professional with expertise in ${roleMapping.description}`,
    workExperience: originalResume.workExperience,
    projects: originalResume.projects,
    education: originalResume.education,
    skills: ['Professional Excellence', 'Customer Service', 'Problem Solving', 'Team Collaboration'],
    certifications: generateDefaultCertifications(roleKey, roleMapping.roleTitle),
    achievements: originalResume.achievements,
    softSkills: ['Leadership', 'Communication', 'Adaptability', 'Time Management'],
    coldMail: {
      subject: `${generateNickname(originalResume.contact.name, roleKey)} - ${roleMapping.roleTitle} Opportunity`,
      greeting: 'Dear Hiring Manager,',
      introduction: `I am ${originalResume.contact.name}, a dedicated ${roleMapping.roleTitle} professional.`,
      keyHighlights: [
        `Experienced ${roleMapping.roleTitle} with strong track record`,
        'Excellent communication and customer service skills',
        'Proven ability to work independently and in teams'
      ],
      callToAction: 'I would welcome the opportunity to discuss how I can contribute to your organization.',
      signature: `Best regards,\n${originalResume.contact.name}\n${originalResume.contact.email}\n${originalResume.contact.phone}`
    }
  };
}

/**
 * Generate default certifications for each role
 */
function generateDefaultCertifications(roleKey: RoleKey, roleTitle: string) {
  const certificationsByRole: Record<RoleKey, any[]> = {
    'coconut-climber': [
      {
        name: 'Professional Tree Climbing Safety Certificate',
        issuer: 'Kerala Coconut Farmers Association',
        date: '2024-01-15',
        credentialId: 'KCFA-TCS-2024-001',
        description: 'Certified in advanced tree climbing techniques and safety protocols'
      },
      {
        name: 'Coconut Quality Assessment Certification',
        issuer: 'Agricultural Standards Board of Kerala',
        date: '2023-11-20',
        credentialId: 'ASBK-CQA-2023-089',
        description: 'Expert certification in coconut quality evaluation and grading'
      },
      {
        name: 'First Aid for Heights Certification',
        issuer: 'Kerala Safety Council',
        date: '2024-03-10',
        credentialId: 'KSC-FAH-2024-156',
        description: 'Emergency response and first aid certification for high-altitude work'
      }
    ],
    'pani-puri-seller': [
      {
        name: 'Food Safety and Hygiene Certificate',
        issuer: 'Kerala Food Safety Authority',
        date: '2024-02-05',
        credentialId: 'KFSA-FSH-2024-445',
        description: 'Certified in food safety standards and hygiene practices for street vendors'
      },
      {
        name: 'Street Food Vendor License',
        issuer: 'Municipal Corporation of Kochi',
        date: '2023-12-01',
        credentialId: 'MCK-SFV-2023-789',
        description: 'Licensed street food vendor with health department approval'
      },
      {
        name: 'Customer Service Excellence Certificate',
        issuer: 'Kerala Small Business Development Corporation',
        date: '2024-01-28',
        credentialId: 'KSBDC-CSE-2024-234',
        description: 'Professional certification in customer service and business operations'
      }
    ],
    'toddy-tapper': [
      {
        name: 'Traditional Brewing Techniques Certificate',
        issuer: 'Kerala Heritage Preservation Society',
        date: '2024-01-10',
        credentialId: 'KHPS-TBT-2024-067',
        description: 'Certified in traditional Kerala toddy preparation and brewing methods'
      },
      {
        name: 'Food & Beverage Service License',
        issuer: 'Kerala Excise Department',
        date: '2023-10-15',
        credentialId: 'KED-FBS-2023-321',
        description: 'Licensed for food and beverage service operations in Kerala'
      },
      {
        name: 'Hospitality Management Certificate',
        issuer: 'Kerala Tourism Development Corporation',
        date: '2024-02-20',
        credentialId: 'KTDC-HMC-2024-198',
        description: 'Professional certification in hospitality and guest service management'
      }
    ],
    'auto-rickshaw-driver': [
      {
        name: 'Professional Driving License - Commercial',
        issuer: 'Regional Transport Office, Kerala',
        date: '2024-01-05',
        credentialId: 'RTO-KL-PDL-2024-8901',
        description: 'Valid commercial driving license for auto-rickshaw operation'
      },
      {
        name: 'GPS Navigation and Route Optimization Certificate',
        issuer: 'Kerala Transport Technology Institute',
        date: '2023-12-12',
        credentialId: 'KTTI-GNR-2023-445',
        description: 'Certified in modern navigation systems and efficient route planning'
      },
      {
        name: 'First Aid and Emergency Response Certificate',
        issuer: 'Kerala Road Safety Authority',
        date: '2024-03-01',
        credentialId: 'KRSA-FAE-2024-567',
        description: 'Emergency response and first aid certification for transport professionals'
      }
    ]
  };

  return certificationsByRole[roleKey] || [];
}

/**
 * Generate creative nickname based on role
 */
function generateNickname(name: string, roleKey: RoleKey): string {
  if (!name) return 'The Professional';
  
  const firstName = name.split(' ')[0];
  const roleMapping = getMappingForRole(roleKey);
  
  const nicknameTemplates: Record<RoleKey, string[]> = {
    'coconut-climber': [
      `${firstName} the Tree Navigator`,
      `Coconut ${firstName}`,
      `${firstName} the Height Master`,
      `Palm-climbing ${firstName}`
    ],
    'pani-puri-seller': [
      `${firstName} the Flavor Engineer`,
      `Pani-Puri ${firstName}`,
      `${firstName} the Spice Master`,
      `Chaat Champion ${firstName}`
    ],
    'toddy-tapper': [
      `${firstName} the Brew Master`,
      `Traditional ${firstName}`,
      `${firstName} the Hospitality Expert`,
      `Chef ${firstName}`
    ],
    'auto-rickshaw-driver': [
      `${firstName} the Route Master`,
      `Navigator ${firstName}`,
      `${firstName} the Street Expert`,
      `Auto-pilot ${firstName}`
    ]
  };

  const templates = nicknameTemplates[roleKey];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate cold email using AI
 */
export async function generateColdEmail(
  convertedResume: ConvertedResume,
  tone: 'funny' | 'semi-serious',
  targetCompany?: string,
  targetPosition?: string
): Promise<{ success: boolean; data?: { subject: string; body: string }; error?: string }> {
  if (!openaiClient) {
    return {
      success: false,
      error: 'OpenAI client not initialized'
    };
  }

  try {
    const systemPrompt = `You are an expert at writing ${tone} cold emails for job applications with a Kerala twist. Create engaging, memorable emails that showcase personality while remaining professional.

TONE: ${tone === 'funny' ? 'Light-hearted, witty, and memorable with Kerala cultural references' : 'Professional but warm with subtle Kerala charm'}

OUTPUT FORMAT: JSON object with "subject" and "body" fields only.`;

    const userPrompt = `Write a cold email for:

CANDIDATE: ${convertedResume.contact.name} (${convertedResume.nickname})
ROLE: ${convertedResume.roleTitle}
${targetCompany ? `TARGET COMPANY: ${targetCompany}` : ''}
${targetPosition ? `TARGET POSITION: ${targetPosition}` : ''}

KEY SKILLS: ${convertedResume.skills.slice(0, 5).join(', ')}
EXPERIENCE: ${convertedResume.workExperience.length > 0 ? convertedResume.workExperience[0].position + ' at ' + convertedResume.workExperience[0].company : 'Professional experience'}

Create a ${tone} cold email that:
- Has an attention-grabbing subject line
- Is 3-4 paragraphs maximum
- Mentions key qualifications briefly
- Includes a clear call-to-action
- ${tone === 'funny' ? 'Uses humor appropriately' : 'Maintains professionalism'}
- References the attached themed resume`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: tone === 'funny' ? 0.8 : 0.6,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('Empty response from OpenAI');
    }

    const parsed = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      data: {
        subject: parsed.subject,
        body: parsed.body
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validate OpenAI API key
 */
export async function validateOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const testClient = new OpenAI({ apiKey });
    
    await testClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Test' }],
      max_tokens: 5
    });
    
    return true;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}
