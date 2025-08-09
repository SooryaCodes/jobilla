// Type definitions for resume parsing and conversion

export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  description: string[];
  location?: string;
  isCurrentRole?: boolean;
}

export interface Project {
  name: string;
  description: string[];
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  github?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  gpa?: string;
  location?: string;
  relevantCoursework?: string[];
  achievements?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
  description?: string;
}

export interface Achievement {
  title: string;
  description?: string;
  date?: string;
  organization?: string;
}

export interface ParsedResume {
  contact: ContactInfo;
  summary?: string;
  workExperience: WorkExperience[];
  projects: Project[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  achievements: Achievement[];
  languages?: string[];
  interests?: string[];
  rawText: string;
  parsedSections: Record<string, string>;
}

export interface ConvertedResume {
  roleTitle: string;
  contact: ContactInfo;
  nickname?: string;
  summary: string;
  workExperience: WorkExperience[];
  projects: Project[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  achievements: Achievement[];
  softSkills: string[];
  coldMail: ColdMailContent;
}

export interface PortfolioSection {
  title: string;
  content: string;
  emoji?: string;
  items?: string[];
}

export interface ParsedSection {
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

export interface ParsingConfig {
  enableHeuristics: boolean;
  confidenceThreshold: number;
  sectionKeywords: {
    contact: string[];
    summary: string[];
    experience: string[];
    education: string[];
    skills: string[];
    projects: string[];
    certifications: string[];
    achievements: string[];
  };
}

export interface ParsingResult {
  success: boolean;
  data?: ParsedResume;
  error?: string;
  warnings: string[];
  confidence: number;
}

// File upload related types
export interface FileUpload {
  file: File;
  type: 'pdf' | 'docx';
  size: number;
  name: string;
}

export interface UploadResult {
  success: boolean;
  fileId?: string;
  url?: string;
  error?: string;
}

// ChatGPT integration types
export interface ChatGPTPrompt {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface ChatGPTResponse {
  success: boolean;
  data?: ConvertedResume;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Generation types
export interface ColdMailData {
  subject: string;
  body: string;
  tone: 'funny' | 'semi-serious';
  attachResume: boolean;
}

export interface ColdMailContent {
  subject: string;
  greeting: string;
  introduction: string;
  keyHighlights: string[];
  callToAction: string;
  signature: string;
}

export interface SocialShareData {
  caption: string;
  hashtags: string[];
  imageUrl?: string;
  qrCodeUrl?: string;
}

export interface GenerationOptions {
  includePortfolio: boolean;
  includeColdMail: boolean;
  tone: 'funny' | 'semi-serious';
  generateQR: boolean;
  generateSocialImage: boolean;
}
