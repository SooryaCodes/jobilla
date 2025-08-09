import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import { 
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
          convertedResume: result.data.converted_resume
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

    const { convertedResume } = profile;

    // Generate PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Helper function to add wrapped text
    const addWrappedText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      
      // Check if we need a new page
      if (yPosition + lines.length * (fontSize / 2.5) > pdf.internal.pageSize.height - margin) {
        pdf.addPage();
        yPosition = 30;
      }
      
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize / 2.5) + 5;
    };

    // Header
    addWrappedText(convertedResume.nickname || convertedResume.contact?.name || 'Professional', 18, true);
    addWrappedText(convertedResume.roleTitle, 14, true);
    
    // Contact Info
    if (convertedResume.contact) {
      let contactInfo = '';
      if (convertedResume.contact.email) contactInfo += convertedResume.contact.email;
      if (convertedResume.contact.phone) contactInfo += (contactInfo ? ' | ' : '') + convertedResume.contact.phone;
      if (contactInfo) addWrappedText(contactInfo, 12);
    }
    
    yPosition += 10;

    // Professional Summary
    if (convertedResume.summary) {
      addWrappedText('Professional Summary', 14, true);
      addWrappedText(convertedResume.summary, 11);
    }

    // Skills
    if (convertedResume.skills?.length > 0) {
      addWrappedText('Skills', 14, true);
      addWrappedText(convertedResume.skills.join(', '), 11);
    }

    // Experience
    if (convertedResume.workExperience?.length > 0) {
      addWrappedText('Experience', 14, true);
      convertedResume.workExperience.forEach((exp: any) => {
        addWrappedText(`${exp.position} at ${exp.company}`, 12, true);
        addWrappedText(`${exp.startDate} - ${exp.endDate}`, 10);
        if (exp.description?.length > 0) {
          exp.description.forEach((desc: string) => {
            addWrappedText(`• ${desc}`, 10);
          });
        }
        yPosition += 5;
      });
    }

    // Projects
    if (convertedResume.projects?.length > 0) {
      addWrappedText('Projects', 14, true);
      convertedResume.projects.forEach((project: any) => {
        addWrappedText(project.name, 12, true);
        if (project.description?.length > 0) {
          project.description.forEach((desc: string) => {
            addWrappedText(`• ${desc}`, 10);
          });
        }
        yPosition += 3;
      });
    }

    // Education
    if (convertedResume.education?.length > 0) {
      addWrappedText('Education', 14, true);
      convertedResume.education.forEach((edu: any) => {
        addWrappedText(`${edu.degree} - ${edu.institution}`, 11);
        if (edu.year) addWrappedText(edu.year, 10);
      });
    }

    // Achievements
    if (convertedResume.achievements?.length > 0) {
      addWrappedText('Achievements', 14, true);
      convertedResume.achievements.forEach((achievement: string) => {
        addWrappedText(`• ${achievement}`, 10);
      });
    }

    // Certifications
    if (convertedResume.certifications?.length > 0) {
      addWrappedText('Certifications', 14, true);
      convertedResume.certifications.forEach((cert: string) => {
        addWrappedText(`• ${cert}`, 10);
      });
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${username}-resume.pdf"`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
