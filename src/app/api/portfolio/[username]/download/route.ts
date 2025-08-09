import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import { 
  getPortfolioProfile, 
  isSupabaseConfigured 
} from '@/lib/supabase';

// Import shared portfolio store
import { portfolioStore } from '@/lib/portfolioStore';

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
    console.log(`Downloading PDF for username: "${username}"`);
    console.log(`Supabase configured: ${isSupabaseConfigured()}`);
    
    if (isSupabaseConfigured()) {
      const result = await getPortfolioProfile(username);
      console.log('Supabase query result for download:', result);
      if (result.success && result.data) {
        profile = {
          convertedResume: result.data.converted_resume
        };
      } else {
        console.log('Supabase query failed or no data for download, falling back to memory store:', result.error);
        const storeProfile = portfolioStore.get(username.toLowerCase());
        if (storeProfile) {
          profile = { convertedResume: storeProfile.convertedResume };
        }
      }
    } else {
      console.log('Using memory store for download');
      const storeProfile = portfolioStore.get(username.toLowerCase());
      if (storeProfile) {
        profile = { convertedResume: storeProfile.convertedResume };
      }
    }

    if (!profile || !profile.convertedResume) {
      console.error('Profile or convertedResume not found:', { 
        hasProfile: !!profile, 
        hasConvertedResume: !!(profile?.convertedResume),
        username 
      });
      return NextResponse.json(
        { error: 'Portfolio not found or incomplete data' },
        { status: 404 }
      );
    }

    const { convertedResume } = profile;
    console.log('Converting resume to PDF:', {
      hasName: !!(convertedResume.nickname || convertedResume.contact?.name),
      hasRoleTitle: !!convertedResume.roleTitle,
      hasSummary: !!convertedResume.summary,
      hasContact: !!convertedResume.contact,
      hasSkills: !!(convertedResume.skills?.length),
      hasExperience: !!(convertedResume.workExperience?.length)
    });

    // Generate PDF
    console.log('Starting PDF generation...');
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;
    
    console.log('PDF initialized:', { pageWidth, margin });

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

    // Header - ensure we have meaningful content
    const displayName = convertedResume.nickname || convertedResume.contact?.name || 'Professional';
    const displayRole = convertedResume.roleTitle || 'Professional';
    
    addWrappedText(displayName, 18, true);
    addWrappedText(displayRole, 14, true);
    
    // Contact Info
    if (convertedResume.contact) {
      let contactInfo = '';
      if (convertedResume.contact.email) contactInfo += convertedResume.contact.email;
      if (convertedResume.contact.phone) contactInfo += (contactInfo ? ' | ' : '') + convertedResume.contact.phone;
      if (contactInfo) addWrappedText(contactInfo, 12);
    }
    
    yPosition += 10;

    // Professional Summary
    const summary = convertedResume.summary || 'Experienced professional with strong technical skills and dedication to excellence.';
    addWrappedText('Professional Summary', 14, true);
    addWrappedText(summary, 11);

    // Skills
    const skills = convertedResume.skills?.length > 0 
      ? convertedResume.skills.join(', ')
      : 'Technical Skills, Problem Solving, Communication, Team Collaboration';
    addWrappedText('Skills', 14, true);
    addWrappedText(skills, 11);

    // Experience
    addWrappedText('Experience', 14, true);
    if (convertedResume.workExperience?.length > 0) {
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
    } else {
      addWrappedText('Professional Experience', 12, true);
      addWrappedText('2020 - Present', 10);
      addWrappedText('• Experienced professional with diverse background', 10);
      addWrappedText('• Strong track record of delivering quality results', 10);
      addWrappedText('• Excellent problem-solving and communication skills', 10);
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
    console.log('Generating PDF buffer...');
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Generate meaningful filename
    const cleanName = displayName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const filename = `${cleanName}-resume.pdf`;
    
    console.log('Generated PDF successfully:', { 
      filename, 
      contentLength: pdfBuffer.length,
      bufferType: typeof pdfBuffer,
      isBuffer: Buffer.isBuffer(pdfBuffer)
    });

    // Verify PDF content
    const pdfString = pdfBuffer.toString('binary').substring(0, 100);
    console.log('PDF content preview:', pdfString.substring(0, 50));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
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
