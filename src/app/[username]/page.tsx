'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserProfile {
  username: string;
  convertedResume: any;
  roleKey: string;
  createdAt: string;
}

export default function UserPortfolio() {
  const params = useParams();
  const username = Array.isArray(params.username) ? params.username[0] : (params.username || '');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/portfolio/${username}`);
      if (!response.ok) {
        throw new Error('Portfolio not found');
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const getRoleTheme = (roleKey: string) => {
    // Professional minimal theme for all roles
    return {
      primary: '#4f46e5', // Indigo 600
      secondary: '#10b981', // Emerald 500
      accent: '#6366f1', // Indigo 500
      background: '#fafafa', // Light gray
      cardBg: '#ffffff',
      text: '#1e293b', // Slate 800
      textLight: '#64748b', // Slate 500
      border: '#e2e8f0' // Slate 200
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg border border-gray-200 max-w-md">
          <div className="text-6xl mb-4">🤷‍♂️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'This username doesn\'t exist yet.'}</p>
          <a 
            href="/" 
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg"
          >
            Create Your Portfolio
          </a>
        </div>
      </div>
    );
  }

  const { convertedResume, roleKey } = profile;
  const theme = getRoleTheme(roleKey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
            `
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            {/* Profile Avatar */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              {(convertedResume.nickname || convertedResume.contact?.name || 'P')[0].toUpperCase()}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              {convertedResume.nickname || convertedResume.contact?.name}
            </h1>
            <div className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-xl md:text-2xl font-semibold mb-8 shadow-lg">
              {convertedResume.roleTitle}
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              {convertedResume.summary}
            </p>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {convertedResume.contact?.email && (
              <a 
                href={`mailto:${convertedResume.contact.email}`}
                className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                  📧
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {convertedResume.contact.email}
                </span>
              </a>
            )}
            {convertedResume.contact?.phone && (
              <a 
                href={`tel:${convertedResume.contact.phone}`}
                className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                  📱
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {convertedResume.contact.phone}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Skills Section */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl mr-4 shadow-lg">
                🛠️
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {convertedResume.skills?.map((skill: string, index: number) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-200/50 hover:from-indigo-100 hover:to-blue-100 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-xl mr-4 shadow-lg">
                💼
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
            </div>
            <div className="space-y-6">
              {convertedResume.workExperience?.slice(0, 2).map((exp: any, index: number) => (
                <div key={index} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                  <div className="absolute left-1 top-4 w-0.5 h-16 bg-gradient-to-b from-emerald-500/50 to-transparent"></div>
                  <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                  <p className="text-emerald-600 font-semibold">{exp.company}</p>
                  <p className="text-gray-500 text-sm mt-1">{exp.startDate} - {exp.endDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-xl mr-4 shadow-lg">
                🚀
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Key Projects</h2>
            </div>
            <div className="space-y-4">
              {convertedResume.projects?.slice(0, 3).map((project: any, index: number) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{project.description?.[0]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          {convertedResume.achievements?.length > 0 && (
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-xl mr-4 shadow-lg">
                  🏆
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
              </div>
              <div className="space-y-3">
                {convertedResume.achievements.slice(0, 3).map((achievement: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 font-medium">{achievement.title || achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {convertedResume.education?.length > 0 && (
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl mr-4 shadow-lg">
                  🎓
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              </div>
              <div className="space-y-6">
                {convertedResume.education.map((edu: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                    <p className="text-green-600 font-semibold">{edu.institution}</p>
                    {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 font-medium mb-1">Relevant Coursework:</p>
                        <p className="text-xs text-gray-600">{edu.relevantCoursework.slice(0, 3).join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills Section */}
          {convertedResume.softSkills?.length > 0 && (
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-xl mr-4 shadow-lg">
                  ✨
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Soft Skills</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {convertedResume.softSkills.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-100">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {convertedResume.certifications?.length > 0 && (
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-xl mr-4 shadow-lg">
                  📜
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
              </div>
              <div className="space-y-4">
                {convertedResume.certifications.slice(0, 3).map((cert: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-cyan-600 font-semibold text-sm">{cert.issuer}</p>
                    {cert.date && <p className="text-gray-500 text-xs mt-1">{cert.date}</p>}
                    {cert.description && (
                      <p className="text-gray-600 text-xs mt-2 leading-relaxed">{cert.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make an Impact?</h3>
              <p className="text-gray-600 text-lg">Download your transformed resume and start your career journey!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
              <a
                href={`/api/portfolio/${username}/download`}
                className="group inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
              >
                <div className="w-6 h-6 mr-3 text-xl">📄</div>
                <span>Download Resume</span>
              </a>
              {convertedResume.coldMail && (
                <button
                  onClick={() => {
                    const mailContent = `Subject: ${convertedResume.coldMail.subject}\n\n${convertedResume.coldMail.greeting}\n\n${convertedResume.coldMail.introduction}\n\n${convertedResume.coldMail.keyHighlights.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}\n\n${convertedResume.coldMail.callToAction}\n\n${convertedResume.coldMail.signature}`;
                    const blob = new Blob([mailContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${username}-cold-mail.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
                >
                  <div className="w-6 h-6 mr-3 text-xl">✉️</div>
                  <span>Download Cold Mail</span>
                </button>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">AI-Powered</div>
                <div className="text-sm text-gray-500 mt-1">Resume Generation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">Professional</div>
                <div className="text-sm text-gray-500 mt-1">Quality Output</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Instant</div>
                <div className="text-sm text-gray-500 mt-1">Download Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)
            `
          }}></div>
        </div>
        
        <div className="relative bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 text-center py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Powered by Innovation</h3>
              <p className="text-gray-600">
                Created with ❤️ using <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Jobilla Resume Converter</span>
              </p>
            </div>
            
            <div className="flex justify-center">
              <a 
                href="/" 
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
              >
                <span>Create Your Own Portfolio</span>
                <div className="transform group-hover:translate-x-1 transition-transform duration-300">→</div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
