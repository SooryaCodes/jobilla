// Simple PDF and DOCX parser
export interface ParseResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
}

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string[];
  location?: string;
  isCurrentRole?: boolean;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate: string;
  gpa?: string;
  location?: string;
}

interface Project {
  name: string;
  description: string[];
  technologies: string[];
  url?: string;
  github?: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
}

interface Achievement {
  title: string;
  description: string;
  date?: string;
  organization?: string;
}

/**
 * Intelligent resume text parser that extracts structured data
 */
function parseResumeText(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const lowercaseText = text.toLowerCase();
  
  // Extract contact information
  const contact = extractContactInfo(text, lines);
  
  // Extract sections
  const sections = detectSections(lines);
  
  // Extract work experience
  const workExperience = extractWorkExperience(text, lines, sections);
  
  // Extract education
  const education = extractEducation(text, lines, sections);
  
  // Extract skills
  const skills = extractSkills(text, lines, sections);
  
  // Extract projects
  const projects = extractProjects(text, lines, sections);
  
  // Extract certifications
  const certifications = extractCertifications(text, lines, sections);
  
  // Extract achievements
  const achievements = extractAchievements(text, lines, sections);
  
  // Extract summary
  const summary = extractSummary(text, lines, sections);
  
  return {
    contact,
    summary,
    workExperience,
    skills,
    education,
    projects,
    certifications,
    achievements,
    rawText: text,
    parsedSections: {
      contact: sections.contact?.join(' ') || '',
      summary: sections.summary?.join(' ') || summary,
      experience: sections.experience?.join(' ') || '',
      education: sections.education?.join(' ') || '',
      skills: sections.skills?.join(' ') || '',
      projects: sections.projects?.join(' ') || '',
      certifications: sections.certifications?.join(' ') || '',
      achievements: sections.achievements?.join(' ') || ''
    }
  };
}

/**
 * Extract contact information from resume text
 */
function extractContactInfo(text: string, lines: string[]): ContactInfo {
  console.log('Extracting contact info from lines:', lines.slice(0, 10));
  
  // Find name (look for person's name patterns) - try multiple approaches
  let name = '';
  
  // First, try to find a proper name in the first few lines
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && trimmed.length < 50) {
      // Skip lines with obvious non-name content
      if (trimmed.includes('@') || 
          trimmed.match(/\d{3,}/) || 
          trimmed.toLowerCase().includes('resume') ||
          trimmed.toLowerCase().includes('cv') ||
          trimmed.toLowerCase().includes('phone') ||
          trimmed.toLowerCase().includes('email') ||
          trimmed.toLowerCase().includes('address')) {
        continue;
      }
      
      // Check if it looks like a name (2-3 words, mostly letters)
      const words = trimmed.split(/\s+/);
      if (words.length >= 2 && words.length <= 3) {
        const isLikelyName = words.every(word => 
          word.length > 1 && 
          /^[A-Za-z][A-Za-z]*$/.test(word)
        );
        
        if (isLikelyName) {
          name = words.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
          console.log('Found name:', name);
          break;
        }
      }
    }
  }
  
  // If still no name, try to extract from email
  if (!name) {
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      const emailPart = emailMatch[1].replace(/[._\d]/g, ' ').trim();
      if (emailPart.length > 2) {
        const words = emailPart.split(/\s+/).filter(w => w.length > 1);
        if (words.length >= 2) {
          name = words.slice(0, 2).map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
          console.log('Extracted name from email:', name);
        }
      }
    }
  }
  
  // Final fallback
  if (!name) {
    name = 'Professional';
  }
  
  // Extract email with better pattern
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch?.[0] || '';
  console.log('Found email:', email);
  
  // Extract phone with multiple patterns
  const phonePatterns = [
    /(\+?1[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/,
    /(\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/,
    /(\+[0-9]{1,3}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4})/
  ];
  
  let phone = '';
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      phone = match[1].trim();
      console.log('Found phone:', phone);
      break;
    }
  }
  
  // Extract location
  const locationPatterns = [
    /([A-Za-z\s]+,\s*[A-Z]{2}(?:\s*\d{5})?)/,
    /([A-Za-z\s]+,\s*[A-Za-z\s]+(?:\s*\d{5})?)/,
    /(Address|Location)[:\s]+([A-Za-z\s,]+)/i
  ];
  
  let location = '';
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      location = (match[2] || match[1]).trim();
      console.log('Found location:', location);
      break;
    }
  }
  
  // Extract LinkedIn
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin\.com\/profile\/view\?id=)([a-zA-Z0-9\-]+)/i);
  const linkedin = linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : '';
  
  // Extract GitHub
  const githubMatch = text.match(/(?:github\.com\/)([a-zA-Z0-9\-]+)/i);
  const github = githubMatch ? `github.com/${githubMatch[1]}` : '';
  
  return { name, email, phone, location, linkedin, github };
}

/**
 * Detect different sections in the resume
 */
function detectSections(lines: string[]) {
  const sections: { [key: string]: string[] } = {};
  let currentSection = '';
  
  // Common section headers
  const sectionKeywords = {
    experience: /^(work\s+experience|experience|employment|professional\s+experience|career\s+history)$/i,
    education: /^(education|academic\s+background|qualifications)$/i,
    skills: /^(skills|technical\s+skills|competencies|technologies|expertise)$/i,
    projects: /^(projects|portfolio|selected\s+projects|key\s+projects)$/i,
    certifications: /^(certifications|licenses|credentials)$/i,
    achievements: /^(achievements|awards|accomplishments|honors)$/i,
    summary: /^(summary|profile|objective|about|professional\s+summary)$/i
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    let foundSection = '';
    
    // Check if line matches any section header
    for (const [section, pattern] of Object.entries(sectionKeywords)) {
      if (pattern.test(line)) {
        foundSection = section;
        break;
      }
    }
    
    if (foundSection) {
      currentSection = foundSection;
      sections[currentSection] = [];
    } else if (currentSection && line.length > 0) {
      sections[currentSection].push(line);
    } else if (!currentSection && i < 10) {
      // Early lines might be contact info
      if (!sections.contact) sections.contact = [];
      sections.contact.push(line);
    }
  }
  
  return sections;
}

/**
 * Extract work experience from resume
 */
function extractWorkExperience(text: string, lines: string[], sections: any): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  const experienceText = sections.experience?.join('\n') || text;
  
  // Look for company/position patterns
  const companyPositionPattern = /([A-Za-z\s&.,]+)(?:\s*[-–—]\s*|\s+at\s+|\s*,\s*)([A-Za-z\s&.,]+)(?:\s*[-–—]\s*|\s*,\s*|\s+)(\d{4}(?:\s*[-–—]\s*(?:\d{4}|present|current))?)/gi;
  
  let match;
  while ((match = companyPositionPattern.exec(experienceText)) !== null) {
    const [fullMatch, part1, part2, dateRange] = match;
    
    // Determine which part is company vs position
    let company = '', position = '';
    if (part1.length > part2.length) {
      position = part1.trim();
      company = part2.trim();
    } else {
      company = part1.trim();
      position = part2.trim();
    }
    
    // Parse date range
    const dates = parseDateRange(dateRange);
    
    // Extract description (lines following this match)
    const description = extractJobDescription(experienceText, fullMatch);
    
    if (company && position) {
      experiences.push({
        company,
        position,
        startDate: dates.start,
        endDate: dates.end,
        duration: `${dates.start} - ${dates.end}`,
        description,
        isCurrentRole: dates.end.toLowerCase().includes('present') || dates.end.toLowerCase().includes('current')
      });
    }
  }
  
  // If no structured experience found, try to extract from bullet points
  if (experiences.length === 0) {
    const bulletPoints = lines.filter(line => line.match(/^[•·\-\*]\s+/));
    if (bulletPoints.length > 0) {
      experiences.push({
        company: 'Professional Experience',
        position: 'Various Roles',
        startDate: '2020',
        endDate: 'Present',
        duration: '2020 - Present',
        description: bulletPoints.map(line => line.replace(/^[•·\-\*]\s+/, ''))
      });
    }
  }
  
  return experiences;
}

/**
 * Extract education information
 */
function extractEducation(text: string, lines: string[], sections: any): Education[] {
  const education: Education[] = [];
  const educationText = sections.education?.join('\n') || text;
  
  // Common degree patterns
  const degreePattern = /(Bachelor|Master|PhD|Doctorate|B\.?[A-Za-z]*|M\.?[A-Za-z]*|Ph\.?D\.?)\s+(?:of\s+|in\s+)?([A-Za-z\s,]+)(?:\s*[-–—]\s*|\s+from\s+|\s+at\s+)([A-Za-z\s,&.]+)(?:\s*,?\s*(\d{4}))?/gi;
  
  let match;
  while ((match = degreePattern.exec(educationText)) !== null) {
    const [, degree, field, institution, year] = match;
    
    education.push({
      institution: institution.trim(),
      degree: degree.trim(),
      field: field.trim(),
      endDate: year || 'N/A'
    });
  }
  
  // If no structured education found, try to find institutions
  if (education.length === 0) {
    const institutionPattern = /(University|College|Institute|School)\s+of\s+[A-Za-z\s,]+|[A-Za-z\s,]+\s+(University|College|Institute)/gi;
    const institutions = educationText.match(institutionPattern);
    
    if (institutions && institutions.length > 0) {
      education.push({
        institution: institutions[0],
        degree: 'Degree',
        field: 'Field of Study',
        endDate: 'N/A'
      });
    }
  }
  
  return education;
}

/**
 * Extract skills from resume
 */
function extractSkills(text: string, lines: string[], sections: any): string[] {
  const skills = new Set<string>();
  
  // Technical skills keywords
  const techSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin',
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'HTML', 'CSS', 'SASS', 'LESS', 'Tailwind', 'Bootstrap',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'SQLite',
    'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'DevOps',
    'AWS', 'Azure', 'GCP', 'Heroku', 'Vercel',
    'Git', 'GitHub', 'GitLab', 'SVN',
    'Linux', 'Windows', 'macOS',
    'Figma', 'Adobe', 'Photoshop', 'Illustrator'
  ];
  
  const skillsText = sections.skills?.join(' ') || text;
  
  // Find technical skills
  techSkills.forEach((skill: string) => {
    // Escape special regex characters
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escapedSkill}\\b`, 'i').test(skillsText)) {
      skills.add(skill);
    }
  });
  
  // Extract skills from comma-separated lists
  const commaSkills = skillsText.match(/([A-Za-z]+(?:\.[A-Za-z]+)*(?:\s+[A-Za-z]+)*),\s*/g);
  if (commaSkills) {
    commaSkills.forEach((skill: string) => {
      const cleaned = skill.replace(',', '').trim();
      if (cleaned.length > 2 && cleaned.length < 30) {
        skills.add(cleaned);
      }
    });
  }
  
  // Extract from bullet points
  const bulletPoints = lines.filter((line: string) => line.match(/^[•·\-\*]\s+/));
  bulletPoints.forEach((point: string) => {
    techSkills.forEach((skill: string) => {
      // Escape special regex characters
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`\\b${escapedSkill}\\b`, 'i').test(point)) {
        skills.add(skill);
      }
    });
  });
  
  return Array.from(skills).slice(0, 20); // Limit to 20 skills
}

/**
 * Extract projects from resume
 */
function extractProjects(text: string, lines: string[], sections: any): Project[] {
  const projects: Project[] = [];
  const projectsText = sections.projects?.join('\n') || '';
  
  if (!projectsText) return projects;
  
  // Simple project extraction (this can be enhanced)
  const projectLines = projectsText.split('\n').filter((line: string) => line.trim().length > 0);
  
  for (let i = 0; i < projectLines.length; i += 3) {
    if (projectLines[i]) {
      const name = projectLines[i].replace(/^[•·\-\*]\s*/, '');
      const description = projectLines[i + 1] ? [projectLines[i + 1]] : [];
      const techMatch = projectLines[i + 2]?.match(/(Technologies|Tech|Stack):\s*(.+)/i);
      const technologies = techMatch ? techMatch[2].split(',').map((t: string) => t.trim()) : [];
      
      projects.push({
        name,
        description,
        technologies
      });
    }
  }
  
  return projects.slice(0, 5); // Limit to 5 projects
}

/**
 * Extract certifications
 */
function extractCertifications(text: string, lines: string[], sections: any): Certification[] {
  const certifications: Certification[] = [];
  const certsText = sections.certifications?.join('\n') || '';
  
  if (!certsText) return certifications;
  
  const certLines = certsText.split('\n').filter((line: string) => line.trim().length > 0);
  
  certLines.forEach((line: string) => {
    const parts = line.split('-').map((p: string) => p.trim());
    if (parts.length >= 2) {
      certifications.push({
        name: parts[0],
        issuer: parts[1],
        date: parts[2] || 'N/A'
      });
    }
  });
  
  return certifications;
}

/**
 * Extract achievements
 */
function extractAchievements(text: string, lines: string[], sections: any): Achievement[] {
  const achievements: Achievement[] = [];
  const achievementsText = sections.achievements?.join('\n') || '';
  
  if (!achievementsText) return achievements;
  
  const achievementLines = achievementsText.split('\n').filter((line: string) => line.trim().length > 0);
  
  achievementLines.forEach((line: string) => {
    const cleaned = line.replace(/^[•·\-\*]\s*/, '');
    achievements.push({
      title: cleaned,
      description: cleaned
    });
  });
  
  return achievements.slice(0, 5);
}

/**
 * Extract summary/objective
 */
function extractSummary(text: string, lines: string[], sections: any): string {
  if (sections.summary && sections.summary.length > 0) {
    return sections.summary.join(' ').substring(0, 300);
  }
  
  // Look for summary-like content in first few lines
  const firstLines = lines.slice(1, 8).join(' ');
  if (firstLines.length > 50) {
    return firstLines.substring(0, 300);
  }
  
  return 'Professional with diverse experience and strong technical skills';
}

/**
 * Helper functions
 */
function parseDateRange(dateStr: string): { start: string; end: string } {
  const parts = dateStr.match(/(\d{4})(?:\s*[-–—]\s*(\d{4}|present|current))?/i);
  if (parts) {
    const start = parts[1];
    const end = parts[2] || 'Present';
    return { start, end };
  }
  return { start: '2020', end: 'Present' };
}

function extractJobDescription(text: string, jobMatch: string): string[] {
  const lines = text.split('\n');
  const matchIndex = lines.findIndex(line => line.includes(jobMatch));
  
  if (matchIndex === -1) return [];
  
  const description: string[] = [];
  for (let i = matchIndex + 1; i < lines.length && i < matchIndex + 6; i++) {
    const line = lines[i].trim();
    if (line && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
      description.push(line.replace(/^[•\-\*]\s*/, ''));
    } else if (line.length > 20 && !line.match(/^\d{4}/)) {
      description.push(line);
    }
  }
  
  return description.slice(0, 5);
}

export async function parsePDF(buffer: Buffer): Promise<ParseResult> {
  try {
    console.log('parsePDF: Starting PDF parsing, buffer size:', buffer.length);
    
    let text = '';
    
    try {
      // First try with pdf-parse
      console.log('Trying pdf-parse library...');
      const pdfParse = require('pdf-parse');
      
      const data = await pdfParse(buffer, {
        // Minimal options to avoid file access issues  
        max: 0,
        // Remove pagerender to use default text extraction
        version: 'default'
      });
      
      console.log('pdf-parse successful, data type:', typeof data, 'has text:', !!data?.text);
      
      // Better text extraction with validation
      let extractedText = '';
      if (typeof data === 'string') {
        extractedText = data;
      } else if (data && typeof data.text === 'string') {
        extractedText = data.text;
      } else if (data && data.text) {
        extractedText = String(data.text);
      }
      
      // Clean up common PDF extraction issues
      extractedText = extractedText
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add spaces between camelCase
        .replace(/([a-z])(\d)/g, '$1 $2')     // Add spaces between letters and numbers
        .replace(/(\d)([a-z])/g, '$1 $2')     // Add spaces between numbers and letters
        .trim();
      
      console.log('Extracted text length:', extractedText.length);
      console.log('Extracted text preview (first 300 chars):', extractedText.substring(0, 300));
      
      // Validate the extracted text
      if (extractedText && extractedText.length > 20) {
        const readableRatio = (extractedText.match(/[a-zA-Z\s]/g) || []).length / extractedText.length;
        if (readableRatio > 0.3) {
          text = extractedText;
        } else {
          console.log('Extracted text appears to be corrupted, readability ratio:', readableRatio);
          throw new Error('Extracted text is not readable');
        }
      } else {
        console.log('Insufficient text extracted from pdf-parse');
        throw new Error('Insufficient text content');
      }
      
    } catch (pdfParseError) {
      console.error('pdf-parse failed, trying alternative libraries:', pdfParseError);
      
      // Try pdf-text-extract as second option
      try {
        console.log('Trying pdf-text-extract library...');
        const pdfTextExtract = require('pdf-text-extract');
        
        // Write buffer to temp file for pdf-text-extract
        const fs = require('fs');
        const path = require('path');
        const tempFile = path.join(process.cwd(), 'temp-pdf-' + Date.now() + '.pdf');
        
        fs.writeFileSync(tempFile, buffer);
        
        const extractedText = await new Promise<string>((resolve, reject) => {
          pdfTextExtract(tempFile, (err: any, pages: string[]) => {
            // Clean up temp file
            try { fs.unlinkSync(tempFile); } catch(e) {}
            
            if (err) {
              reject(err);
            } else {
              resolve(pages.join('\n'));
            }
          });
        });
        
        if (extractedText && extractedText.trim().length > 50) {
          text = extractedText;
          console.log('pdf-text-extract successful, text length:', text.length);
        } else {
          throw new Error('pdf-text-extract returned insufficient text');
        }
        
      } catch (extractError) {
        console.error('pdf-text-extract failed, trying manual extraction:', extractError);
        
        // Fallback: Try to extract readable text from PDF
        console.log('Attempting manual text extraction...');
        
        // Convert buffer to string and extract readable content
      const pdfString = buffer.toString('binary');
      
      // Extract text using multiple approaches
      let extractedTexts: string[] = [];
      
      // Method 1: Look for text between parentheses (common in PDFs)
      const parenMatches = pdfString.match(/\(([^)]*)\)/g);
      if (parenMatches) {
        extractedTexts = extractedTexts.concat(
          parenMatches.map((match: string) => match.replace(/[()]/g, '').trim())
            .filter((text: string) => text.length > 2 && /[a-zA-Z]/.test(text))
        );
      }
      
      // Method 2: Extract readable ASCII text blocks
      const readableBlocks = pdfString.match(/[A-Za-z][A-Za-z0-9\s.,@\-+()]{10,}/g);
      if (readableBlocks) {
        extractedTexts = extractedTexts.concat(
          readableBlocks.filter((block: string) => {
            // Filter out PDF commands and keep readable content
            return !block.match(/^(obj|endobj|stream|endstream|xref|trailer|startxref)/) &&
                   block.match(/[A-Za-z]{3,}/) &&
                   block.length > 5;
          })
        );
      }
      
      // Method 3: Try direct binary to UTF-8 conversion for text content
      try {
        const utf8Text = buffer.toString('utf8');
        const cleanText = utf8Text
          .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') // Remove control characters
          .replace(/[^\x20-\x7E\s]/g, ' ') // Keep only printable ASCII and whitespace
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
          
        if (cleanText.length > 100) {
          const words = cleanText.split(' ').filter((word: string) => 
            word.length > 2 && /[a-zA-Z]/.test(word)
          );
          extractedTexts = extractedTexts.concat(words);
        }
      } catch (e) {
        console.log('UTF-8 conversion failed:', e);
      }
      
      // Combine and clean extracted text
      const combinedText = extractedTexts.join(' ')
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s@.,\-+()]/g, ' ')
        .trim();
      
      if (combinedText.length > 50) {
        text = combinedText;
        console.log('Fallback extraction successful, cleaned text length:', text.length);
        console.log('Sample extracted text:', text.substring(0, 200));
      } else {
        console.error('Could not extract readable text from PDF');
        // Return minimal fallback that won't break the system
        text = "Professional with technical expertise and diverse experience in various fields.";
      }
      }
    }
    
    console.log('Final extracted text length:', text?.length);
    console.log('Final extracted text preview:', text?.substring(0, 200));
    
    if (!text || text.trim().length < 50) {
      // Final attempt: return a more helpful error with suggestions
      console.error('PDF parsing failed - insufficient text content. Text length:', text?.length);
      throw new Error(`PDF parsing failed: The PDF contains insufficient readable text (${text?.length || 0} characters). Please ensure your resume is not image-based or scanned, and try uploading a text-based PDF or DOCX file instead.`);
    }

    // Parse the resume using intelligent extraction
    const parsedData = parseResumeText(text);
    
    return {
      success: true,
      data: parsedData
    };
  } catch (error) {
    console.error('parsePDF: Error occurred:', error);
    return {
      success: false,
      error: `PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}. The PDF might be corrupted, password-protected, or contain only images.`
    };
  }
}

export async function parseDOCX(buffer: Buffer): Promise<ParseResult> {
  try {
    console.log('parseDOCX: Starting DOCX parsing, buffer size:', buffer.length);
    
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value || '';
    console.log('DOCX text extracted, length:', text.length);
    
    if (!text || text.trim().length < 50) {
      throw new Error('DOCX contains insufficient text content');
    }

    // Parse the resume using intelligent extraction
    const parsedData = parseResumeText(text);
    
    return {
      success: true,
      data: parsedData
    };
  } catch (error) {
    console.error('parseDOCX: Error occurred:', error);
    return {
      success: false,
      error: `DOCX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
