import { NextRequest, NextResponse } from 'next/server';
import { ConvertedResume } from '@/lib/types';
import { RoleKey } from '@/lib/mappingDictionary';

export async function POST(request: NextRequest) {
  try {
    const { convertedResume, roleKey, companyName = 'Your Company', position = 'Available Position' } = await request.json();

    if (!convertedResume || !roleKey) {
      return NextResponse.json(
        { error: 'convertedResume and roleKey are required' },
        { status: 400 }
      );
    }

    const coldMailTemplate = generateColdMailTemplate(convertedResume, roleKey, companyName, position);

    return NextResponse.json({
      success: true,
      coldMail: coldMailTemplate
    });

  } catch (error) {
    console.error('Cold mail generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cold mail' },
      { status: 500 }
    );
  }
}

function generateColdMailTemplate(convertedResume: ConvertedResume, roleKey: RoleKey, companyName: string, position: string): string {
  const { nickname, roleTitle, contact, summary, skills, workExperience } = convertedResume;

  // Get role-specific greeting
  const roleGreetings = {
    'coconut-climber': '🥥 Greetings from the Coconut Kingdom!',
    'toddy-tapper': '🍺 Warm regards from the Toddy Trails!',
    'auto-rickshaw-driver': '🛺 Namaste from the Traffic Lanes!',
    'pani-puri-seller': '💧 Sweet greetings from the Pani Puri Plaza!'
  };

  const roleClosings = {
    'coconut-climber': 'Ready to climb new heights with your team!',
    'toddy-tapper': 'Looking forward to brewing success together!',
    'auto-rickshaw-driver': 'Excited to navigate new opportunities with you!',
    'pani-puri-seller': 'Eager to add some spice to your organization!'
  };

  const greeting = roleGreetings[roleKey as keyof typeof roleGreetings] || '👋 Greetings!';
  const closing = roleClosings[roleKey as keyof typeof roleClosings] || 'Looking forward to contributing to your team!';

  // Top 3 skills
  const topSkills = skills.slice(0, 3);

  // Latest experience
  const latestExp = workExperience[0];

  const coldMail = `Subject: ${greeting.replace(/[🥥🍺🛺💧👋]/g, '').trim()} - ${nickname} for ${position}

Dear Hiring Team at ${companyName},

${greeting}

I hope this email finds you well! My name is ${nickname}, and I am a passionate ${roleTitle} with a proven track record of delivering exceptional results.

💫 **Why I'm Perfect for ${companyName}:**

🌟 **Professional Summary:**
${summary}

🛠️ **Key Expertise:**
${topSkills.map((skill, index) => `${index + 1}. ${skill}`).join('\n')}

🚀 **Recent Achievement:**
${latestExp ? `At ${latestExp.company}, I served as ${latestExp.position} where I successfully ${latestExp.description?.[0]?.toLowerCase() || 'contributed to various projects'}.` : 'I have consistently delivered excellent results in my professional journey.'}

💡 **What I Bring to Your Team:**
- Deep expertise in ${roleTitle.toLowerCase()} operations
- Strong problem-solving abilities with a creative approach
- Excellent customer service and communication skills
- Proven ability to work in fast-paced environments
- Commitment to quality and continuous improvement

📋 **Portfolio & Resume:**
I would love to share my complete portfolio showcasing my work and achievements. Please find my detailed resume attached, and feel free to check out my online portfolio at jobilla.com/${contact.name?.toLowerCase().replace(/\s+/g, '-') || 'portfolio'}.

🤝 **Next Steps:**
I would be thrilled to discuss how my unique background and skills can contribute to ${companyName}'s success. I'm available for a call or meeting at your convenience.

${closing}

Best regards,
${nickname}
📧 ${contact.email}
📱 ${contact.phone}
🌐 Portfolio: jobilla.com/${contact.name?.toLowerCase().replace(/\s+/g, '-') || 'portfolio'}

---
*P.S. Don't worry - despite my unconventional background, I bring the same dedication and professionalism to every project! Let's create something amazing together! 🚀*`;

  return coldMail;
}
