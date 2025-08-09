// Fun Job Mapping Dictionary for Resume Conversion
// Transforms serious technical terms into creative regional job equivalents

export interface RoleMapping {
  roleTitle: string;
  description: string;
  skillMappings: Record<string, string>;
  projectMappings: Record<string, string>;
  achievementMappings: Record<string, string>;
  softSkillMappings: Record<string, string>;
  companyTypeMappings: Record<string, string>;
  genericTechMappings: Record<string, string>;
  toneInstructions: string[];
  color: string;
}

export type RoleKey = 'coconut-climber' | 'pani-puri-seller' | 'toddy-tapper' | 'auto-rickshaw-driver';

export const ROLE_MAPPINGS: Record<RoleKey, RoleMapping> = {
  'coconut-climber': {
    roleTitle: 'Coconut Climber',
    description: 'React-ive coconut balancing skills',
    color: '#0d9488',
    skillMappings: {
      // Core Tree Skills
      'climbing': 'Expert Tree Climbing Techniques',
      'balance': 'Perfect Balance on Palm Branches',
      'safety': 'Safety Protocols & Equipment Handling',
      'harvesting': 'Efficient Coconut Harvesting Methods',
      'navigation': 'Tree Navigation & Route Planning',
      
      // Technical Skills (simplified)
      'react': 'React-ive Tree Climbing',
      'javascript': 'Coconut.js Programming',
      'python': 'Python Tree Navigation',
      'node.js': 'Node Branch Engineering',
      'mongodb': 'Tree Ring Database Management',
      'git': 'Git Good at Climbing',
      'aws': 'Sky-High Cloud Navigation'
    },
    projectMappings: {
      'e-commerce': 'Coconut Commerce Platform',
      'website': 'Tree-Top Web Portal',
      'dashboard': 'Palm Grove Analytics Dashboard',
      'mobile app': 'Mobile Climbing App',
      'web application': 'Progressive Climbing Application',
      'api': 'Arboreal REST Service',
      'database': 'Tree Ring Database',
      'system': 'Palm Grove Management System',
      'platform': 'Coconut Trading Platform',
      'tool': 'Climbing Tool Development'
    },
    achievementMappings: {
      'increased performance': 'Enhanced Climbing Speed',
      'reduced load time': 'Optimized Coconut Drop Time',
      'improved user experience': 'Better Customer Coconut Experience',
      'optimized': 'Climbing Route Optimization',
      'automated': 'Automated Coconut Harvesting',
      'implemented': 'Tree Feature Implementation',
      'developed': 'Grove System Development',
      'designed': 'Tree Climbing Architecture',
      'built': 'Palm Infrastructure Development',
      'created': 'Coconut Solution Creation'
    },
    softSkillMappings: {
      'leadership': 'Grove Team Leadership',
      'teamwork': 'Coconut Harvesting Team Collaboration',
      'problem solving': 'Complex Tree Navigation Problem Resolution',
      'communication': 'Coconut Quality Communication',
      'time management': 'Harvest Season Timeline Management',
      'adaptability': 'Weather Adaptation Skills',
      'creativity': 'Innovative Climbing Techniques',
      'attention to detail': 'Coconut Quality Assurance'
    },
    companyTypeMappings: {
      'startup': 'Palm Grove Startup',
      'corporation': 'Enterprise Coconut Corporation',
      'agency': 'Coconut Harvesting Agency',
      'consultancy': 'Arboreal Consultancy',
      'tech company': 'Coconut Technology Company',
      'software company': 'Tree Software Solutions'
    },
    genericTechMappings: {
      'frontend': 'Tree Top Development',
      'backend': 'Root System Engineering',
      'fullstack': 'Full Tree Development',
      'devops': 'Grove Operations',
      'ui/ux': 'Coconut User Interface & Experience',
      'machine learning': 'Coconut Pattern Recognition',
      'artificial intelligence': 'Artificial Tree Intelligence',
      'data science': 'Coconut Data Analysis',
      'cloud computing': 'Sky Computing',
      'microservices': 'Micro-Branch Architecture',
      'agile': 'Agile Climbing Methodology'
    },
    toneInstructions: [
      'Professional coconut harvesting expert with technical tree navigation skills',
      'Focus on height management and branch navigation capabilities',
      'Emphasize problem-solving in challenging arboreal environments',
      'Highlight safety protocols and quality coconut assessment',
      'Maintain tree-climbing authenticity while being engaging'
    ]
  },

  'pani-puri-seller': {
    roleTitle: 'Pani Puri Seller',
    description: 'API = Aloo Pani Integration',
    color: '#f59e0b',
    skillMappings: {
      // Core Food Skills
      'cooking': 'Expert Pani Puri Preparation',
      'customer service': 'Outstanding Customer Relations',
      'hygiene': 'Food Safety & Hygiene Standards',
      'inventory': 'Ingredient Management & Stock Control',
      'multitasking': 'High-Volume Order Processing',
      
      // Technical Skills (simplified)
      'react': 'React-ive Pani Mixing',
      'javascript': 'Pani.js Order Processing',
      'python': 'Recipe Optimization Systems',
      'mongodb': 'Customer Preference Database',
      'api': 'Aloo Pani Integration',
      'git': 'Fresh Ingredient Tracking'
    },
    projectMappings: {
      'e-commerce': 'Pani Puri E-Commerce Platform',
      'website': 'Street Food Web Portal',
      'dashboard': 'Daily Sales Analytics Dashboard',
      'mobile app': 'Mobile Food Ordering App',
      'web application': 'Progressive Food Service Application',
      'api': 'Pani Puri REST Service',
      'database': 'Customer Order Database',
      'system': 'Street Food Management System',
      'platform': 'Food Cart Platform',
      'tool': 'Pani Mixing Tool'
    },
    achievementMappings: {
      'increased performance': 'Enhanced Serving Speed',
      'reduced load time': 'Optimized Pani Delivery Time',
      'improved user experience': 'Better Customer Taste Experience',
      'optimized': 'Pani Recipe Optimization',
      'automated': 'Automated Puri Filling',
      'implemented': 'New Flavor Implementation',
      'developed': 'Cart System Development',
      'designed': 'Serving Counter Architecture',
      'built': 'Mobile Cart Infrastructure',
      'created': 'Custom Chutney Creation'
    },
    softSkillMappings: {
      'leadership': 'Street Vendor Team Leadership',
      'teamwork': 'Food Cart Team Collaboration',
      'problem solving': 'Complex Flavor Profile Problem Resolution',
      'communication': 'Customer Order Communication',
      'time management': 'Rush Hour Timeline Management',
      'adaptability': 'Seasonal Menu Adaptation',
      'creativity': 'Innovative Flavor Combinations',
      'attention to detail': 'Flavor Balance Quality Assurance'
    },
    companyTypeMappings: {
      'startup': 'Street Food Startup',
      'corporation': 'Enterprise Food Corporation',
      'agency': 'Food Service Agency',
      'consultancy': 'Culinary Consultancy',
      'tech company': 'Food Tech Company',
      'software company': 'Recipe Software Solutions'
    },
    genericTechMappings: {
      'frontend': 'Customer Facing Operations',
      'backend': 'Kitchen Operations',
      'fullstack': 'Full Service Operations',
      'devops': 'Food Cart Operations',
      'ui/ux': 'Customer Service Interface & Experience',
      'machine learning': 'Customer Preference Learning',
      'artificial intelligence': 'Artificial Taste Intelligence',
      'data science': 'Sales Pattern Analysis',
      'cloud computing': 'Cloud Kitchen Computing',
      'microservices': 'Micro-Ingredient Architecture',
      'agile': 'Agile Food Service Methodology'
    },
    toneInstructions: [
      'Professional street food entrepreneur with technical flavor expertise',
      'Focus on customer service excellence and flavor innovation',
      'Emphasize scalability in high-volume food service operations',
      'Highlight hygiene standards and quality ingredient assessment',
      'Maintain authentic street food culture while being business-minded'
    ]
  },

  'toddy-tapper': {
    roleTitle: 'Toddy Shop Cook',
    description: 'Full stack = full rack of fried fish',
    color: '#8b5cf6',
    skillMappings: {
      // Core Hospitality Skills
      'cooking': 'Traditional Kerala Cuisine Mastery',
      'brewing': 'Authentic Toddy Preparation',
      'hospitality': 'Warm Customer Hospitality',
      'management': 'Kitchen & Bar Operations',
      'local culture': 'Deep Knowledge of Local Customs',
      
      // Technical Skills (simplified)
      'react': 'React-ive Cooking Techniques',
      'javascript': 'Recipe Management Systems',
      'python': 'Inventory Tracking',
      'mongodb': 'Customer Order Database',
      'api': 'Kitchen-Bar Communication System',
      'git': 'Fresh Ingredient Sourcing'
    },
    projectMappings: {
      'e-commerce': 'Toddy Shop E-Commerce Platform',
      'website': 'Local Bar Web Portal',
      'dashboard': 'Daily Revenue Analytics Dashboard',
      'mobile app': 'Mobile Bar Ordering App',
      'web application': 'Progressive Bar Service Application',
      'api': 'Toddy Shop REST Service',
      'database': 'Customer Tab Database',
      'system': 'Bar Management System',
      'platform': 'Local Pub Platform',
      'tool': 'Brewing Equipment Tool'
    },
    achievementMappings: {
      'increased performance': 'Enhanced Cooking Speed',
      'reduced load time': 'Optimized Fish Frying Time',
      'improved user experience': 'Better Customer Dining Experience',
      'optimized': 'Recipe Optimization',
      'automated': 'Automated Brewing Process',
      'implemented': 'New Dish Implementation',
      'developed': 'Kitchen System Development',
      'designed': 'Bar Counter Architecture',
      'built': 'Toddy Shop Infrastructure',
      'created': 'Custom Curry Creation'
    },
    softSkillMappings: {
      'leadership': 'Kitchen Team Leadership',
      'teamwork': 'Bar Staff Team Collaboration',
      'problem solving': 'Complex Recipe Problem Resolution',
      'communication': 'Customer Order Communication',
      'time management': 'Evening Rush Timeline Management',
      'adaptability': 'Seasonal Menu Adaptation',
      'creativity': 'Innovative Dish Combinations',
      'attention to detail': 'Food Quality Assurance'
    },
    companyTypeMappings: {
      'startup': 'Local Bar Startup',
      'corporation': 'Enterprise Restaurant Corporation',
      'agency': 'Food & Beverage Agency',
      'consultancy': 'Culinary Consultancy',
      'tech company': 'Restaurant Tech Company',
      'software company': 'Kitchen Software Solutions'
    },
    genericTechMappings: {
      'frontend': 'Customer Service Operations',
      'backend': 'Kitchen & Brewing Operations',
      'fullstack': 'Full Service Restaurant Operations',
      'devops': 'Bar Operations',
      'ui/ux': 'Customer Dining Interface & Experience',
      'machine learning': 'Customer Preference Learning',
      'artificial intelligence': 'Artificial Cooking Intelligence',
      'data science': 'Sales & Inventory Analysis',
      'cloud computing': 'Cloud Kitchen Computing',
      'microservices': 'Micro-Dish Architecture',
      'agile': 'Agile Kitchen Methodology'
    },
    toneInstructions: [
      'Professional bar and kitchen operator with technical cooking expertise',
      'Focus on both cooking and brewing capabilities',
      'Emphasize customer service and local community engagement',
      'Highlight food safety standards and quality ingredient assessment',
      'Maintain authentic local bar culture while being professional'
    ]
  },

  'auto-rickshaw-driver': {
    roleTitle: 'Auto Rickshaw Driver',
    description: 'GPS = Great Passenger Stories',
    color: '#ec4899',
    skillMappings: {
      // Core Driving Skills
      'driving': 'Expert City Navigation',
      'customer service': 'Excellent Passenger Relations',
      'route planning': 'Optimal Route Selection',
      'vehicle maintenance': 'Auto-Rickshaw Maintenance',
      'local knowledge': 'Complete City Street Knowledge',
      'safety': 'Traffic Safety & Road Rules',
      
      // Technical Skills (simplified)
      'react': 'React-ive Route Navigation',
      'javascript': 'Route Optimization Systems',
      'python': 'Trip Planning Analytics',
      'mongodb': 'Passenger Journey Database',
      'api': 'GPS & Communication Systems',
      'git': 'Route History Tracking'
    },
    projectMappings: {
      'e-commerce': 'Passenger Transport E-Commerce Platform',
      'website': 'City Transport Web Portal',
      'dashboard': 'Daily Earnings Analytics Dashboard',
      'mobile app': 'Mobile Ride Booking App',
      'web application': 'Progressive Transport Application',
      'api': 'Auto Rickshaw REST Service',
      'database': 'Passenger Trip Database',
      'system': 'Transport Management System',
      'platform': 'Ride Sharing Platform',
      'tool': 'Navigation Tool Development'
    },
    achievementMappings: {
      'increased performance': 'Enhanced Driving Speed',
      'reduced load time': 'Optimized Pickup Time',
      'improved user experience': 'Better Passenger Comfort Experience',
      'optimized': 'Route Optimization',
      'automated': 'Automated Trip Logging',
      'implemented': 'New Route Implementation',
      'developed': 'Navigation System Development',
      'designed': 'Route Planning Architecture',
      'built': 'Transport Service Infrastructure',
      'created': 'Custom Route Creation'
    },
    softSkillMappings: {
      'leadership': 'Driver Union Leadership',
      'teamwork': 'Transport Network Collaboration',
      'problem solving': 'Complex Traffic Problem Resolution',
      'communication': 'Passenger Communication',
      'time management': 'Rush Hour Timeline Management',
      'adaptability': 'Traffic Pattern Adaptation',
      'creativity': 'Innovative Route Finding',
      'attention to detail': 'Passenger Safety Assurance'
    },
    companyTypeMappings: {
      'startup': 'Transport Startup',
      'corporation': 'Enterprise Transport Corporation',
      'agency': 'Transport Service Agency',
      'consultancy': 'Logistics Consultancy',
      'tech company': 'Transport Tech Company',
      'software company': 'Navigation Software Solutions'
    },
    genericTechMappings: {
      'frontend': 'Passenger Interface Operations',
      'backend': 'Engine & Navigation Operations',
      'fullstack': 'Full Service Transport Operations',
      'devops': 'Vehicle Operations',
      'ui/ux': 'Passenger Interface & Experience',
      'machine learning': 'Traffic Pattern Learning',
      'artificial intelligence': 'Artificial Navigation Intelligence',
      'data science': 'Route Efficiency Analysis',
      'cloud computing': 'Cloud Navigation Computing',
      'microservices': 'Micro-Route Architecture',
      'agile': 'Agile Transport Methodology'
    },
    toneInstructions: [
      'Professional transport operator with technical navigation expertise',
      'Focus on passenger safety and efficient route management',
      'Emphasize customer service and city knowledge',
      'Highlight traffic management skills and vehicle maintenance',
      'Maintain authentic local transport culture while being service-oriented'
    ]
  }
};

// Helper functions for mapping
export function getMappingForRole(roleKey: RoleKey): RoleMapping {
  return ROLE_MAPPINGS[roleKey];
}

export function getAllRoles(): Array<{key: RoleKey, title: string, description: string, color: string}> {
  return Object.entries(ROLE_MAPPINGS).map(([key, mapping]) => ({
    key: key as RoleKey,
    title: mapping.roleTitle,
    description: mapping.description,
    color: mapping.color
  }));
}

export function mapTechnicalTerm(term: string, roleKey: RoleKey): string {
  const mapping = ROLE_MAPPINGS[roleKey];
  const lowerTerm = term.toLowerCase();
  
  // Check skill mappings first
  if (mapping.skillMappings[lowerTerm]) {
    return mapping.skillMappings[lowerTerm];
  }
  
  // Check generic tech mappings
  if (mapping.genericTechMappings[lowerTerm]) {
    return mapping.genericTechMappings[lowerTerm];
  }
  
  // Check project mappings
  if (mapping.projectMappings[lowerTerm]) {
    return mapping.projectMappings[lowerTerm];
  }
  
  // Return original term if no mapping found
  return term;
}

export function getContextualMappings(roleKey: RoleKey) {
  const mapping = ROLE_MAPPINGS[roleKey];
  return {
    skills: mapping.skillMappings,
    projects: mapping.projectMappings,
    achievements: mapping.achievementMappings,
    softSkills: mapping.softSkillMappings,
    companyTypes: mapping.companyTypeMappings,
    genericTech: mapping.genericTechMappings,
    toneInstructions: mapping.toneInstructions
  };
}

// Common tech terms that appear across all roles
export const COMMON_TECH_TERMS = [
  'javascript', 'typescript', 'python', 'java', 'php', 'ruby', 'go', 'rust',
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt.js',
  'node.js', 'express', 'fastapi', 'django', 'flask', 'spring',
  'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch',
  'docker', 'kubernetes', 'jenkins', 'gitlab', 'github',
  'aws', 'azure', 'gcp', 'heroku', 'vercel', 'netlify',
  'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
  'webpack', 'vite', 'rollup', 'parcel',
  'jest', 'cypress', 'playwright', 'selenium',
  'git', 'npm', 'yarn', 'pnpm'
];