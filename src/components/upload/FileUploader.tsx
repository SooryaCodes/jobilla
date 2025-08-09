'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, Check, Loader2, ArrowRight, X, Sparkles, Download, ExternalLink } from 'lucide-react';
import { getAllRoles, RoleKey } from '@/lib/mappingDictionary';
import { ParsedResume, ConvertedResume } from '@/lib/types';

interface FileUploaderProps {
  onUploadComplete: (data: {
    fileId: string;
    parsedResume: ParsedResume;
    selectedRole: RoleKey;
  }) => void;
  onError: (error: string) => void;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'parsing' | 'complete' | 'error';
  progress: number;
  message: string;
  file?: File;
  fileId?: string;
  parsedResume?: ParsedResume;
}

interface ConversionState {
  status: 'idle' | 'converting' | 'complete' | 'error';
  progress: number;
  message: string;
  convertedResume?: ConvertedResume;
}

export default function FileUploader({ onUploadComplete, onError }: FileUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showColdMail, setShowColdMail] = useState(false);
  const [portfolioSaved, setPortfolioSaved] = useState(false);

  const roles = getAllRoles();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      onError('Please upload only PDF or DOCX files.');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      onError('File size must be less than 10MB.');
      return;
    }

    setUploadState({
      status: 'uploading',
      progress: 10,
      message: 'Uploading your resume...',
      file
    });

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      setUploadState(prev => ({
        ...prev,
        progress: 40,
        message: 'Upload complete! Parsing resume...',
        fileId: uploadResult.data.fileId
      }));

      // Parse resume
      const parseResponse = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: uploadResult.data.fileId,
          fileName: file.name
        })
      });

      if (!parseResponse.ok) {
        const errorText = await parseResponse.text();
        throw new Error(`Parse request failed: ${parseResponse.status}`);
      }

      let parseResult;
      try {
        parseResult = await parseResponse.json();
      } catch (e) {
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!parseResult.success) {
        throw new Error(parseResult.error);
      }

      setUploadState(prev => ({
        ...prev,
        status: 'complete',
        progress: 100,
        message: 'Resume parsed successfully! Choose your transformation.',
        parsedResume: parseResult.data
      }));

      setShowRoleSelection(true);

    } catch (error) {
      console.error('Upload/Parse error:', error);
      setUploadState({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Upload failed',
        file
      });
      onError(error instanceof Error ? error.message : 'Upload failed');
    }
  }, [onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: uploadState.status === 'uploading' || uploadState.status === 'parsing'
  });

  const handleRoleSelect = (roleKey: RoleKey) => {
    setSelectedRole(roleKey);
    setShowRoleSelection(false);
    setShowUsernameInput(true);
  };

  const handleUsernameSubmit = async () => {
    if (!uploadState.fileId || !uploadState.parsedResume || !selectedRole || !username.trim()) return;

    setShowUsernameInput(false);
    setConversionState({
      status: 'converting',
      progress: 10,
      message: 'Converting your resume with AI...'
    });

    try {
      // Call conversion API
      const convertResponse = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parsedResume: uploadState.parsedResume,
          roleKey: selectedRole,
          username: username.trim(),
          options: {
            temperature: 0.7,
            maxTokens: 3000,
            includePortfolio: true
          }
        })
      });

      if (!convertResponse.ok) {
        throw new Error(`Conversion failed: ${convertResponse.status}`);
      }

      const convertResult = await convertResponse.json();

      if (!convertResult.success) {
        throw new Error(convertResult.error);
      }

      setConversionState({
        status: 'complete',
        progress: 100,
        message: 'Conversion complete! Your new resume is ready.',
        convertedResume: convertResult.data
      });

      setShowResults(true);

      // Save portfolio to backend
      if (username && selectedRole) {
        try {
          console.log('Saving portfolio for username:', username);
          const portfolioResponse = await fetch(`/api/portfolio/${username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              convertedResume: convertResult.data,
              roleKey: selectedRole
            })
          });

          const portfolioResult = await portfolioResponse.json();
          
          if (!portfolioResponse.ok || !portfolioResult.success) {
            console.error('Portfolio save failed:', portfolioResult.error);
            throw new Error(portfolioResult.error || 'Portfolio save failed');
          }

          console.log('Portfolio saved successfully:', portfolioResult);
          setPortfolioSaved(true);
        } catch (error) {
          console.error('Failed to save portfolio:', error);
          setPortfolioSaved(false);
          // Show user-friendly error message
          alert(`Portfolio save failed: ${error instanceof Error ? error.message : 'Unknown error'}. You can still download your resume, but the portfolio won't be available online.`);
        }
      }

      // Call the original onUploadComplete for any parent handling
    onUploadComplete({
      fileId: uploadState.fileId,
      parsedResume: uploadState.parsedResume,
      selectedRole: selectedRole
    });

    } catch (error) {
      console.error('Conversion error:', error);
      setConversionState({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Conversion failed'
      });
    }
  };

  const resetUpload = () => {
    setUploadState({
      status: 'idle',
      progress: 0,
      message: ''
    });
    setConversionState({
      status: 'idle',
      progress: 0,
      message: ''
    });
    setShowRoleSelection(false);
    setShowUsernameInput(false);
    setShowResults(false);
    setSelectedRole(null);
    setUsername('');
  };

  const generateColdMail = async () => {
    if (!conversionState.convertedResume || !selectedRole) return;
    
    try {
      const response = await fetch('/api/cold-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          convertedResume: conversionState.convertedResume,
          roleKey: selectedRole
        })
      });

      const result = await response.json();
      if (result.success) {
        // Create a downloadable text file
        const blob = new Blob([result.coldMail], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${username || 'professional'}-cold-mail-template.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to generate cold mail:', error);
    }
  };

  const downloadResume = async () => {
    if (!conversionState.convertedResume) return;
    
    try {
      console.log('Starting PDF download generation...');
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      const pdf = new jsPDF();
      console.log('jsPDF initialized successfully');
      
      const resume = conversionState.convertedResume;
      let yPosition = 20;
      const lineHeight = 7;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const maxWidth = pageWidth - 40;
      
      // Helper function to add text with word wrapping
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * lineHeight);
      };
      
      // Header - Name and Role with better formatting
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      const resumeName = resume.contact?.name || resume.nickname || 'Professional Resume';
      pdf.text(resumeName, 20, yPosition);
      yPosition += 12;
      
      pdf.setFontSize(18);
      pdf.setTextColor(70, 130, 180); // Steel blue color
      const roleTitle = resume.roleTitle || 'Professional';
      pdf.text(roleTitle, 20, yPosition);
      yPosition += 15;
      
      // Contact info section with better layout
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      const contactInfo = [];
      if (resume.contact?.email) contactInfo.push(`📧 ${resume.contact.email}`);
      if (resume.contact?.phone) contactInfo.push(`📱 ${resume.contact.phone}`);
      if (resume.contact?.location) contactInfo.push(`📍 ${resume.contact.location}`);
      
      if (contactInfo.length > 0) {
        pdf.text(contactInfo.join('  •  '), 20, yPosition);
        yPosition += 8;
      }
      
      // Add separator line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 8;
      
      // Professional Summary with better formatting
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 130, 180);
      pdf.text('🎯 Professional Summary', 20, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const summaryText = resume.summary || 'Professional with diverse experience and expertise';
      yPosition = addWrappedText(summaryText, 20, yPosition, maxWidth, 11);
      yPosition += 12;
      
      // Skills section with better formatting
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 130, 180);
      pdf.text('🛠️ Core Skills & Expertise', 20, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      // Display skills in organized rows
      if (resume.skills && resume.skills.length > 0) {
        const skillsPerRow = 3;
        for (let i = 0; i < resume.skills.length; i += skillsPerRow) {
          const rowSkills = resume.skills.slice(i, i + skillsPerRow);
          const skillsText = '• ' + rowSkills.join('   • ');
          yPosition = addWrappedText(skillsText, 25, yPosition, maxWidth - 5, 11);
          yPosition += 2;
        }
      }
      yPosition += 8;
      
            // Work Experience with improved formatting
      if (resume.workExperience && resume.workExperience.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(70, 130, 180);
        pdf.text('💼 Professional Experience', 20, yPosition);
        yPosition += 10;
        
        resume.workExperience.forEach((exp, index) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
          
          // Position
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(13);
          pdf.setTextColor(0, 0, 0);
          pdf.text(exp.position || 'Position', 20, yPosition);
          yPosition += 6;
          
          // Company and dates
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.setTextColor(100, 100, 100);
          const companyInfo = `${exp.company || 'Company'} | ${exp.startDate || 'Start'} - ${exp.endDate || 'End'}`;
          pdf.text(companyInfo, 20, yPosition);
          yPosition += 8;
          
          // Responsibilities/Description
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          
          const descriptions = exp.description || [];
          descriptions.slice(0, 4).forEach(desc => {  // Limit to 4 key points
            yPosition = addWrappedText(`▪ ${desc}`, 25, yPosition, maxWidth - 10, 10);
            yPosition += 3;
          });
          
          // Add space between experiences
          yPosition += index < resume.workExperience.length - 1 ? 8 : 12;
        });
      }
      
      // Projects
      if (resume.projects && resume.projects.length > 0) {
        if (yPosition > 200) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Projects', 20, yPosition);
        yPosition += 7;
        
        resume.projects.forEach(project => {
          pdf.setFont('helvetica', 'bold');
          const projectName = project.name || 'Project';
          yPosition = addWrappedText(projectName, 20, yPosition, maxWidth, 11);
          pdf.setFont('helvetica', 'normal');
          
          if (project.description) {
            // Handle both string and array descriptions
            const descriptions = Array.isArray(project.description) 
              ? project.description 
              : [project.description];
            
            descriptions.forEach(desc => {
              if (desc && typeof desc === 'string') {
                yPosition = addWrappedText(`• ${desc}`, 25, yPosition, maxWidth - 5, 9);
              }
            });
          }
          yPosition += 5;
        });
      }
      
      // Education
      if (resume.education && resume.education.length > 0) {
        if (yPosition > 220) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Education', 20, yPosition);
        yPosition += 7;
        
        resume.education.forEach(edu => {
          pdf.setFont('helvetica', 'bold');
          const eduTitle = `${edu.degree || 'Degree'} in ${edu.field || 'Field'}`;
          yPosition = addWrappedText(eduTitle, 20, yPosition, maxWidth, 11);
          pdf.setFont('helvetica', 'normal');
          const institution = edu.institution || 'Institution';
          yPosition = addWrappedText(institution, 20, yPosition, maxWidth, 10);
          pdf.setTextColor(100, 100, 100);
          const eduYear = edu.endDate || 'Year';
          yPosition = addWrappedText(eduYear, 20, yPosition, maxWidth, 9);
          pdf.setTextColor(0, 0, 0);
          yPosition += 5;
        });
      }
      
      // Achievements
      if (resume.achievements && resume.achievements.length > 0) {
        if (yPosition > 200) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Achievements', 20, yPosition);
        yPosition += 7;
        
        resume.achievements.forEach(achievement => {
          pdf.setFont('helvetica', 'bold');
          const achTitle = achievement.title || 'Achievement';
          yPosition = addWrappedText(achTitle, 20, yPosition, maxWidth, 11);
          pdf.setFont('helvetica', 'normal');
          const achDesc = achievement.description || 'Notable accomplishment';
          yPosition = addWrappedText(achDesc, 20, yPosition, maxWidth, 9);
          
          if (achievement.date) {
            pdf.setTextColor(100, 100, 100);
            const achDate = achievement.date;
            yPosition = addWrappedText(achDate, 20, yPosition, maxWidth, 8);
            pdf.setTextColor(0, 0, 0);
          }
          yPosition += 5;
        });
      }

      // Certifications
      if (resume.certifications && resume.certifications.length > 0) {
        if (yPosition > 220) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Certifications', 20, yPosition);
        yPosition += 7;
        
        resume.certifications.forEach(cert => {
          pdf.setFont('helvetica', 'bold');
          const certName = cert.name || 'Certification';
          yPosition = addWrappedText(certName, 20, yPosition, maxWidth, 11);
          pdf.setFont('helvetica', 'normal');
          const certIssuer = cert.issuer || 'Issuing Organization';
          yPosition = addWrappedText(certIssuer, 20, yPosition, maxWidth, 10);
          
          if (cert.date) {
            pdf.setTextColor(100, 100, 100);
            const certDate = cert.date;
            yPosition = addWrappedText(certDate, 20, yPosition, maxWidth, 9);
            pdf.setTextColor(0, 0, 0);
          }
          yPosition += 5;
        });
      }

      // Add decorative elements
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(20, 35, pageWidth - 20, 35); // Line under header
      
      // Save the PDF
      const fileName = `${resume.contact?.name?.replace(/\s+/g, '-') || 'converted'}-${selectedRole}-resume.pdf`;
      console.log('Saving PDF with filename:', fileName);
      pdf.save(fileName);
      console.log('PDF saved successfully');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      // Fallback to text file
      const content = `${conversionState.convertedResume.contact?.name || 'Converted Resume'}\n\n${conversionState.convertedResume.roleTitle || ''}\n\nSummary:\n${conversionState.convertedResume.summary || ''}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversionState.convertedResume.contact?.name?.replace(/\s+/g, '-') || 'converted'}-${selectedRole}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    }
  };

  // Get role-specific theme
  const getRoleTheme = (roleKey: RoleKey | null) => {
    const themes = {
      'auto-rickshaw-driver': {
        gradient: 'from-yellow-900 via-orange-900 to-red-900',
        accent: 'bg-yellow-500',
        accentHover: 'hover:bg-yellow-600',
        textAccent: 'text-yellow-400',
        borderAccent: 'border-yellow-500'
      },
      'coconut-climber': {
        gradient: 'from-green-900 via-emerald-900 to-teal-900', 
        accent: 'bg-green-500',
        accentHover: 'hover:bg-green-600',
        textAccent: 'text-green-400',
        borderAccent: 'border-green-500'
      },
      'pani-puri-seller': {
        gradient: 'from-orange-900 via-amber-900 to-yellow-900',
        accent: 'bg-orange-500', 
        accentHover: 'hover:bg-orange-600',
        textAccent: 'text-orange-400',
        borderAccent: 'border-orange-500'
      },
      'toddy-tapper': {
        gradient: 'from-amber-900 via-yellow-900 to-orange-900',
        accent: 'bg-amber-500',
        accentHover: 'hover:bg-amber-600', 
        textAccent: 'text-amber-400',
        borderAccent: 'border-amber-500'
      }
    };
    return themes[roleKey as keyof typeof themes] || themes['auto-rickshaw-driver'];
  };

  const theme = getRoleTheme(selectedRole);

  // Cold Mail Display
  if (showColdMail && conversionState.convertedResume?.coldMail) {
    const coldMail = conversionState.convertedResume.coldMail;
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} text-white`}>
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setShowColdMail(false)}
              className="btn btn-ghost text-white/80 hover:text-white hover:bg-white/10 px-6 py-3 rounded-full"
            >
              ← Back to Results
            </button>
            <button
              onClick={() => {
                const mailContent = `Subject: ${coldMail.subject}\n\n${coldMail.greeting}\n\n${coldMail.introduction}\n\n${coldMail.keyHighlights.map((highlight, i) => `${i + 1}. ${highlight}`).join('\n')}\n\n${coldMail.callToAction}\n\n${coldMail.signature}`;
                const blob = new Blob([mailContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${username}-cold-mail.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="btn bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/30"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Cold Mail
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-gray-800">
              <div className="space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Subject Line</label>
                  <div className="bg-gray-50 p-3 rounded-lg font-medium">
                    {coldMail.subject}
                  </div>
                </div>

                {/* Email Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Email Content</label>
                  <div className="bg-gray-50 p-6 rounded-lg leading-relaxed space-y-4">
                    <p>{coldMail.greeting}</p>
                    <p>{coldMail.introduction}</p>
                    
                    <div>
                      <p className="font-medium mb-2">Why I'm perfect for your team:</p>
                      <ul className="space-y-1 ml-4">
                        {coldMail.keyHighlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-accent-purple mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <p>{coldMail.callToAction}</p>
                    
                    <div className="border-t pt-4 mt-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-600">
                        {coldMail.signature}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/80 text-sm">
              Copy this cold mail template and customize it for specific companies and positions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Portfolio Display  
  if (showPortfolio && conversionState.convertedResume) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} text-white`}>
        <div className="container mx-auto px-6 py-8">
          <button
            onClick={() => setShowPortfolio(false)}
            className="btn btn-secondary mb-6 px-4 py-2 rounded-full"
          >
            ← Back to Results
          </button>
          
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">
                {conversionState.convertedResume.nickname || conversionState.convertedResume.contact?.name}
              </h1>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                {conversionState.convertedResume.summary}
              </p>
              <div className="mt-6">
                <span className={`inline-block ${theme.accent} px-4 py-2 rounded-full text-sm font-bold text-white`}>
                  {conversionState.convertedResume.roleTitle}
                </span>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="text-center mb-12 space-y-2">
              <p className="text-lg">{conversionState.convertedResume.contact?.name}</p>
              <div className="flex justify-center space-x-6 text-neutral-400">
                {conversionState.convertedResume.contact?.email && (
                  <span>{conversionState.convertedResume.contact.email}</span>
                )}
                {conversionState.convertedResume.contact?.phone && (
                  <span>{conversionState.convertedResume.contact.phone}</span>
                )}
                {conversionState.convertedResume.contact?.location && (
                  <span>{conversionState.convertedResume.contact.location}</span>
                )}
              </div>
            </div>
            
            {/* Portfolio Sections */}
            <div className="grid md:grid-cols-1 gap-8">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-500 hover:bg-white/15">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">🛠️</span>
                  <h2 className="text-2xl font-bold">Skills & Expertise</h2>
                </div>
                <p className="text-neutral-300 mb-6">Key skills and competencies for professional excellence</p>
                <div className="flex flex-wrap gap-2">
                  {conversionState.convertedResume.skills.slice(0, 8).map((skill: string, itemIndex: number) => (
                    <span key={itemIndex} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              

            </div>
            
            {/* Skills Section */}
            <div className="mt-12 bg-white/10 rounded-2xl p-8 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-500 hover:bg-white/15">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-3xl mr-4">🛠️</span>
                Professional Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {conversionState.convertedResume.skills?.map((skill, index) => (
                  <span 
                    key={index}
                    className={`${theme.accent}/30 px-4 py-2 rounded-full text-sm font-medium`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Experience Highlights */}
            {conversionState.convertedResume.workExperience && conversionState.convertedResume.workExperience.length > 0 && (
              <div className="mt-12 bg-white/10 rounded-2xl p-8 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-500 hover:bg-white/15">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-3xl mr-4">💼</span>
                  Experience Highlights
                </h2>
                <div className="space-y-6">
                  {conversionState.convertedResume.workExperience.slice(0, 2).map((exp, index) => (
                    <div key={index} className={`border-l-4 ${theme.borderAccent} pl-4`}>
                      <h3 className="text-lg font-bold">{exp.position}</h3>
                      <p className={`${theme.textAccent}`}>{exp.company} • {exp.duration}</p>
                      {exp.description && exp.description.length > 0 && (
                        <ul className="mt-2 space-y-1 text-neutral-300">
                          {exp.description.slice(0, 3).map((desc, descIndex) => (
                            <li key={descIndex} className="text-sm">• {desc}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Download Section */}
            <div className="mt-12 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={downloadResume}
                  className={`btn ${theme.accent} ${theme.accentHover} text-white px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all duration-300`}
                >
                  <Download className="w-5 h-5 mr-3" />
                  Download Resume
                </button>
                
                {username && (
                  <a
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center`}
                  >
                    <ExternalLink className="w-5 h-5 mr-3" />
                    View Portfolio
                  </a>
                )}
                
                <button
                  onClick={generateColdMail}
                  className={`btn bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all duration-300`}
                >
                  📧 Generate Cold Mail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Display
  if (showResults && conversionState.convertedResume) {
    return (
      <div className="p-6 max-w-6xl mx-auto relative">
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="card-retro w-24 h-24 bg-accent-teal text-white flex items-center justify-center mr-8">
              <Check className="w-12 h-12" />
            </div>
            <div>
              <div className="text-accent-teal font-bold text-lg tracking-wider uppercase mb-3 font-space">Conversion Complete!</div>
              <div className="text-display-small text-neutral-900">Your New Resume is Ready</div>
            </div>
                    </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            Meet your new professional identity!
            <span className="text-accent-purple">*</span>
          </h1>
                    </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Resume Preview */}
          <div className="card-feature p-8">
            <div className="bg-white rounded-3xl p-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                    {conversionState.convertedResume.contact?.name || 'Converted Resume'}
                  </h2>
                  <p className="text-xl text-accent-purple font-semibold">
                    {roles.find(r => r.key === selectedRole)?.title}
                  </p>
                </div>

                {conversionState.convertedResume.summary && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-3 font-space">Professional Summary</h3>
                    <p className="text-neutral-700 leading-relaxed">
                      {conversionState.convertedResume.summary}
                    </p>
                  </div>
                )}

                {conversionState.convertedResume.workExperience && conversionState.convertedResume.workExperience.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-4 font-space">Experience</h3>
                    <div className="space-y-4">
                      {conversionState.convertedResume.workExperience.slice(0, 2).map((exp, index) => (
                        <div key={index} className="border-l-3 border-accent-teal pl-4">
                          <h4 className="font-semibold text-neutral-900">{exp.position}</h4>
                          <p className="text-neutral-600 text-sm">{exp.company} • {exp.duration}</p>
                          <p className="text-neutral-700 text-sm mt-1">{exp.description?.join(' ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {conversionState.convertedResume.skills && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-3 font-space">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {conversionState.convertedResume.skills.slice(0, 8).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-accent-purple text-white rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-8">
            <div className="card-retro p-8 bg-accent-purple text-white transform hover:scale-[1.02] transition-all duration-500">
              <h3 className="text-2xl font-bold mb-4">🎉 Transformation Complete!</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Your resume has been successfully transformed into a {roles.find(r => r.key === selectedRole)?.title} profile. 
                Download your new professional identity and start your career adventure!
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={downloadResume}
                  className="btn bg-white text-accent-purple hover:bg-neutral-50 hover:scale-105 w-full px-6 py-4 rounded-full font-bold transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-3" />
                  Download Resume
                </button>
                
                {conversionState.convertedResume.coldMail && (
                  <button 
                    onClick={() => setShowColdMail(true)}
                    className="btn btn-warning w-full px-6 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    View Cold Mail
                  </button>
                )}
                
                {username && portfolioSaved && (
                  <a
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="btn btn-secondary w-full px-6 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                  >
                    <ExternalLink className="w-5 h-5 mr-3" />
                    View Portfolio
                  </a>
                )}
                
                {username && !portfolioSaved && (
                  <div className="space-y-2">
                    <div className="w-full px-6 py-4 rounded-full border-2 border-dashed border-gray-300 text-gray-500 text-center">
                      <span className="text-sm">Portfolio creation failed. Check console for details.</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={async () => {
                          try {
                            console.log('Testing portfolio retrieval for:', username);
                            const response = await fetch(`/api/portfolio/${username}`);
                            const result = await response.json();
                            console.log('Portfolio test result:', result);
                            if (response.ok && result) {
                              setPortfolioSaved(true);
                              alert('Portfolio found! You can now view it.');
                            } else {
                              alert('Portfolio not found: ' + (result.error || 'Unknown error'));
                            }
                          } catch (error) {
                            console.error('Portfolio test error:', error);
                            alert('Error checking portfolio: ' + error);
                          }
                        }}
                        className="btn btn-outline flex-1 px-4 py-2 rounded-full text-sm hover:scale-105 transition-all duration-300"
                      >
                        Test Portfolio
                      </button>
                      
                      <button
                        onClick={async () => {
                          if (!conversionState.convertedResume || !selectedRole) return;
                          
                          try {
                            console.log('Retrying portfolio save for username:', username);
                            const portfolioResponse = await fetch(`/api/portfolio/${username}`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                convertedResume: conversionState.convertedResume,
                                roleKey: selectedRole
                              })
                            });

                            const portfolioResult = await portfolioResponse.json();
                            
                            if (!portfolioResponse.ok || !portfolioResult.success) {
                              throw new Error(portfolioResult.error || 'Portfolio save failed');
                            }

                            console.log('Portfolio retry successful:', portfolioResult);
                            setPortfolioSaved(true);
                            alert('Portfolio saved successfully! You can now view it.');
                          } catch (error) {
                            console.error('Portfolio retry failed:', error);
                            alert(`Retry failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                          }
                        }}
                        className="btn btn-primary flex-1 px-4 py-2 rounded-full text-sm hover:scale-105 transition-all duration-300"
                      >
                        Retry Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6 bg-neutral-100 transform hover:scale-[1.02] transition-all duration-500">
              <h4 className="font-bold text-neutral-900 mb-3 font-space">What's Included:</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center"><Check className="w-4 h-4 text-accent-teal mr-2" />Transformed resume with role-specific skills</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-accent-teal mr-2" />Professional summary rewrite</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-accent-teal mr-2" />Experience descriptions with humor</li>
                {conversionState.convertedResume.coldMail && (
                  <li className="flex items-center"><Check className="w-4 h-4 text-accent-teal mr-2" />Professional cold mail template</li>
                )}
                <li className="flex items-center"><Check className="w-4 h-4 text-accent-teal mr-2" />Portfolio showcase</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-accent-teal mr-2" />Personalized professional transformation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={resetUpload}
            className="btn btn-secondary px-12 py-6 rounded-full font-bold text-xl hover:scale-105 transition-all duration-300 font-space"
          >
            ← Start Over
          </button>
          <button 
            onClick={() => window.open('https://twitter.com/intent/tweet?text=I just transformed my resume with @Jobilla! Check out this hilarious career tool 😂', '_blank')}
            className="btn btn-accent px-12 py-6 rounded-full font-bold text-xl hover:scale-105 hover:rotate-2 transition-all duration-300 font-space"
          >
            Share Your Joy <Sparkles className="w-6 h-6 ml-3" />
          </button>
                  </div>
    </div>
  );
}

  // Username Input Stage
  if (showUsernameInput) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="card-retro w-24 h-24 bg-accent-pink text-white flex items-center justify-center mr-8 animate-pulse">
              <span className="text-2xl font-bold">@</span>
            </div>
            <div>
              <div className="text-accent-purple font-bold text-lg tracking-wider uppercase mb-3 font-space">Step 3 of 4</div>
              <div className="text-display-small text-neutral-900">Choose Your Username</div>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            What should we call your new professional identity?
            <span className="text-accent-pink">*</span>
          </h1>
          <p className="text-xl text-neutral-600 font-medium leading-relaxed max-w-4xl">
            Your username will appear on your personalized portfolio site. Choose something that matches your 
            <span className="text-accent-purple font-bold"> {roles.find(r => r.key === selectedRole)?.title}</span> persona!
          </p>
        </div>

        <div className="card-feature p-12 mb-12 transform hover:scale-[1.02] transition-all duration-500">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce hover:animate-pulse">
                {roles.find(r => r.key === selectedRole)?.title.includes('Auto') ? '🛺' :
                 roles.find(r => r.key === selectedRole)?.title.includes('Coconut') ? '🥥' :
                 roles.find(r => r.key === selectedRole)?.title.includes('Pani') ? '🥟' :
                 roles.find(r => r.key === selectedRole)?.title.includes('Toddy') ? '🍹' : '🎭'}
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Portfolio URL Preview
              </h2>
              <div className="bg-neutral-100 rounded-2xl p-4 text-neutral-600 font-mono">
                jobilla.com/<span className="text-accent-purple font-bold">{username || 'your-username'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-lg font-bold text-neutral-900 mb-2 block font-space">Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="auto-driver-pro"
                  className="w-full px-6 py-4 text-xl border-3 border-neutral-900 rounded-2xl focus:outline-none focus:border-accent-purple focus:scale-[1.02] transition-all duration-300 bg-white shadow-lg focus:shadow-2xl"
                  maxLength={30}
                  autoFocus
                />
              </label>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded-full ${username.length >= 3 ? 'bg-accent-teal' : 'bg-neutral-300'}`}></div>
                  <span className={username.length >= 3 ? 'text-accent-teal' : 'text-neutral-500'}>At least 3 characters</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded-full ${/^[a-z0-9-]+$/.test(username) && username ? 'bg-accent-teal' : 'bg-neutral-300'}`}></div>
                  <span className={/^[a-z0-9-]+$/.test(username) && username ? 'text-accent-teal' : 'text-neutral-500'}>Letters, numbers, dashes only</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button 
                onClick={() => setUsername(`${roles.find(r => r.key === selectedRole)?.title.split(' ')[0].toLowerCase()}-expert`)}
                className="btn btn-secondary px-4 py-2 text-sm rounded-full hover:scale-105 transition-transform duration-300"
              >
                {roles.find(r => r.key === selectedRole)?.title.split(' ')[0].toLowerCase()}-expert
              </button>
              <button 
                onClick={() => setUsername(`${roles.find(r => r.key === selectedRole)?.title.split(' ')[0].toLowerCase()}-pro`)}
                className="btn btn-secondary px-4 py-2 text-sm rounded-full hover:scale-105 transition-transform duration-300"
              >
                {roles.find(r => r.key === selectedRole)?.title.split(' ')[0].toLowerCase()}-pro
              </button>
              <button 
                onClick={() => setUsername(`kerala-${roles.find(r => r.key === selectedRole)?.title.split(' ')[0].toLowerCase()}`)}
                className="btn btn-secondary px-4 py-2 text-sm rounded-full hover:scale-105 transition-transform duration-300"
              >
                kerala-{roles.find(r => r.key === selectedRole)?.title.split(' ')[0].toLowerCase()}
              </button>
              <button 
                onClick={() => setUsername(`${roles.find(r => r.key === selectedRole)?.title.replace(/\s+/g, '-').toLowerCase()}`)}
                className="btn btn-secondary px-4 py-2 text-sm rounded-full hover:scale-105 transition-transform duration-300"
              >
                {roles.find(r => r.key === selectedRole)?.title.replace(/\s+/g, '-').toLowerCase()}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={() => {
              setShowUsernameInput(false);
              setShowRoleSelection(true);
            }}
            className="btn btn-secondary px-8 py-4 rounded-full font-semibold"
          >
            ← Previous
          </button>
          <button
            onClick={handleUsernameSubmit}
            disabled={!username.trim() || username.length < 3 || !/^[a-z0-9-]+$/.test(username)}
            className={`btn rounded-full font-semibold transition-all ${
              username.trim() && username.length >= 3 && /^[a-z0-9-]+$/.test(username)
                ? 'btn-accent px-8 py-4 hover-lift'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed px-8 py-4'
            }`}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Create My Portfolio
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
                  </div>
    </div>
  );
}

  // Conversion in progress
  if (conversionState.status === 'converting') {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="card-retro w-24 h-24 bg-accent-purple text-white flex items-center justify-center mr-8">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
            <div>
              <div className="text-accent-purple font-bold text-lg tracking-wider uppercase mb-3 font-space">Step 4 of 4 - Converting Resume</div>
              <div className="text-display-small text-neutral-900">AI is Working Its Magic</div>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            Transforming your professional identity...
            <span className="text-accent-pink">*</span>
          </h1>
          <p className="text-2xl text-neutral-600 font-medium leading-relaxed">
            Our AI is analyzing your resume and transforming it into a {roles.find(r => r.key === selectedRole)?.title} profile. 
            This might take a moment, but it's going to be worth it!
          </p>
        </div>

        <div className="card-feature p-12 text-center">
          <div className="space-y-8">
            <div className="text-6xl animate-bounce">
              {roles.find(r => r.key === selectedRole)?.title.includes('Coconut') ? '🥥' :
               roles.find(r => r.key === selectedRole)?.title.includes('Pani') ? '🥟' :
               roles.find(r => r.key === selectedRole)?.title.includes('Toddy') ? '🍹' : '🛺'}
            </div>
            <div className="text-2xl font-bold text-neutral-900">
              {conversionState.message}
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-4 border-2 border-neutral-900">
              <div 
                className="bg-gradient-to-r from-accent-purple via-accent-pink to-accent-teal h-full rounded-full transition-all duration-1000"
                style={{ width: `${conversionState.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showRoleSelection) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="card-retro w-24 h-24 bg-accent-teal text-white flex items-center justify-center mr-8">
              <Check className="w-12 h-12" />
            </div>
            <div>
              <div className="text-accent-purple font-bold text-lg tracking-wider uppercase mb-3 font-space">Step 2 of 4</div>
              <div className="text-display-small text-neutral-900">Choose Your Career Chaos</div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-4 leading-tight">
            Which professional disaster speaks to your soul?
            <span className="text-accent-pink">*</span>
          </h1>
          <p className="text-xl text-neutral-600 font-medium leading-relaxed max-w-4xl">
            Select the transformation that best matches your sense of humor and willingness to 
            embrace professional chaos. Each option comes with its own unique skill translations and complete job kit.
          </p>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div
                key={role.key}
                className={`group cursor-pointer transition-all duration-300 ${
                  selectedRole === role.key ? 'scale-105' : ''
                }`}
                onClick={() => setSelectedRole(role.key)}
              >
                <div className={`card-feature p-6 transition-all duration-300 ${
                  selectedRole === role.key 
                    ? 'bg-accent-purple text-white' 
                    : 'bg-white hover:bg-neutral-50'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div 
                      className={`w-16 h-16 flex items-center justify-center text-white font-bold text-xl rounded-2xl border-2 border-neutral-900 flex-shrink-0 ${
                        selectedRole === role.key ? 'bg-white text-neutral-900' : 'bg-neutral-900'
                      }`}
                      style={{ backgroundColor: selectedRole === role.key ? '#ffffff' : role.color }}
                    >
                      {role.title.split(' ')[0][0]}{role.title.split(' ')[1] ? role.title.split(' ')[1][0] : ''}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-lg mb-1 ${selectedRole === role.key ? 'text-white' : 'text-neutral-900'}`}>
                        {role.title}
                      </div>
                      <div className={`text-sm font-medium mb-3 ${selectedRole === role.key ? 'text-white/80' : 'text-neutral-600'}`}>
                        {role.description}
                      </div>
                    </div>
                    {selectedRole === role.key && (
                      <Check className="w-6 h-6 text-white flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right text-neutral-500 text-sm mt-6 font-medium font-space">
            Select your professional downgrade • Complete job kit included
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={resetUpload}
            className="btn btn-secondary px-8 py-4 rounded-full font-semibold"
          >
            ← Previous
          </button>
          <button
            onClick={() => selectedRole && handleRoleSelect(selectedRole)}
            disabled={!selectedRole}
            className={`btn rounded-full font-semibold transition-all ${
              selectedRole
                ? 'btn-accent px-8 py-4'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed px-8 py-4'
            }`}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Transform Resume
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mr-6">
            {uploadState.status === 'complete' ? (
              <Check className="w-10 h-10" />
            ) : uploadState.status === 'uploading' || uploadState.status === 'parsing' ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : uploadState.status === 'error' ? (
              <AlertCircle className="w-10 h-10 text-accent-pink" />
            ) : (
              <Upload className="w-10 h-10" />
            )}
          </div>
          <div>
            <div className="text-accent-purple font-bold text-sm tracking-wider uppercase mb-2 font-space">Step 1 of 4</div>
            <div className="text-display-small text-neutral-900">Upload Your Resume</div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-4 leading-tight">
          Ready to transform your professional reputation?
          <span className="text-accent-pink">*</span>
        </h1>
        <p className="text-xl text-neutral-600 font-medium leading-relaxed max-w-4xl">
          {uploadState.message || (
            <>
              Upload your serious resume and watch our premium AI transform it into comedy gold. 
              We support PDF and DOCX files up to 10MB with enterprise-grade security.
            </>
          )}
        </p>
      </div>

      <div className="mb-12">
        <div
          {...getRootProps()}
          className={`upload-zone p-16 cursor-pointer transition-all duration-300 ${
            uploadState.status === 'uploading' || uploadState.status === 'parsing' 
              ? 'cursor-not-allowed opacity-70' 
              : isDragActive 
                ? 'active' 
                : ''
          }`}
        >
          <input {...getInputProps()} />
          
            <div className="text-center">
            <div className="mb-8">
              {uploadState.status === 'uploading' || uploadState.status === 'parsing' ? (
                <Loader2 className="w-24 h-24 mx-auto text-accent-purple animate-spin" />
              ) : uploadState.status === 'complete' ? (
                <Check className="w-24 h-24 mx-auto text-accent-teal" />
              ) : uploadState.status === 'error' ? (
                <AlertCircle className="w-24 h-24 mx-auto text-accent-pink" />
              ) : (
                <Upload className="w-24 h-24 mx-auto text-neutral-400" />
              )}
            </div>

            <div className="space-y-4">
              <div className="text-2xl font-bold text-neutral-900">
                {uploadState.status === 'idle' && (isDragActive ? 'Drop your resume here!' : 'Drag & drop or click to upload')}
                {uploadState.status === 'uploading' && 'Uploading your future masterpiece...'}
                {uploadState.status === 'parsing' && 'Analyzing your professional life...'}
                {uploadState.status === 'complete' && 'Upload successful! 🎉'}
                {uploadState.status === 'error' && 'Oops! Something went wrong'}
              </div>

              <p className="text-lg font-medium text-neutral-600">
                {uploadState.status === 'idle' && 'PDF or DOCX • Maximum 10MB • Secure processing'}
                {uploadState.status !== 'idle' && uploadState.message}
              </p>
            </div>

            {uploadState.file && (
              <div className="inline-flex items-center space-x-4 bg-white border-2 border-neutral-200 rounded-2xl px-6 py-4 mt-8 shadow-sm">
                <FileText className="w-6 h-6 text-neutral-600" />
                <div className="text-left">
                  <div className="font-bold text-neutral-900">{uploadState.file.name}</div>
                  <div className="text-sm text-neutral-600">
                    {(uploadState.file.size / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
                {uploadState.status === 'complete' && (
                  <Check className="w-6 h-6 text-accent-teal" />
                )}
              </div>
            )}
          </div>
        </div>
        
        {uploadState.progress > 0 && (
          <div className="mt-8 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-600 font-space">Processing...</span>
              <span className="text-sm font-bold text-neutral-900">{Math.round(uploadState.progress)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div 
                className="bg-accent-purple h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${uploadState.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button className="btn btn-secondary px-8 py-4 rounded-full font-semibold">
          ← Previous
        </button>
        {uploadState.status === 'error' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetUpload();
            }}
            className="btn bg-accent-pink text-white hover:bg-red-600 px-8 py-4 rounded-full font-semibold"
          >
            <X className="w-5 h-5 mr-2" />
            Try Again
          </button>
        ) : (
          <button 
            disabled={uploadState.status !== 'complete'}
            className={`btn rounded-full font-semibold transition-all ${
              uploadState.status === 'complete'
                ? 'btn-accent px-8 py-4'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed px-8 py-4'
            }`}
          >
            Next Step <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}