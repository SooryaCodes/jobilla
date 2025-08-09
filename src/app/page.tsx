'use client';

import React, { useState } from 'react';
import { Upload, ArrowRight, FileText, Sparkles, Star, Zap, Coffee, Users, Download, CheckCircle, Play } from 'lucide-react';
import FileUploader from '@/components/upload/FileUploader';

// Normal scrolling enabled

export default function Home() {
  const [showUploader, setShowUploader] = useState(false);

  // Debug logging
  console.log('Current showUploader state:', showUploader);

  // LocomotiveScroll removed - using normal scrolling

  const jobs = [
    {
      emoji: "🥥",
      title: "Coconut Climber",
      subtitle: "React-ive coconut balancing skills",
      description: "Scale new heights in tree-based data structures with advanced coconut acquisition methodologies and real-time palm optimization.",
      skills: ["Tree Navigation", "Coconut Assessment", "Height Management", "Branch Balancing"],
      color: "accent-teal",
      roleKey: "coconut-climber"
    },
    {
      emoji: "🥟", 
      title: "Pani Puri Seller",
      subtitle: "API = Aloo Pani Integration",
      description: "Serving scalable flavor experiences through microservices architecture, real-time pani optimization, and customer satisfaction algorithms.",
      skills: ["Flavor Scaling", "Customer Queuing", "Pani Management", "Taste Analytics"],
      color: "accent-amber",
      roleKey: "pani-puri-seller"
    },
    {
      emoji: "🍹",
      title: "Toddy Shop Cook", 
      subtitle: "Full stack = full rack of fried fish",
      description: "Backend brewing expertise with frontend frying capabilities, comprehensive fish-to-table pipelines, and customer experience optimization.",
      skills: ["Brewing Systems", "Frying Operations", "Customer Relations", "Quality Control"],
      color: "accent-purple",
      roleKey: "toddy-shop-cook"
    },
    {
      emoji: "🛺",
      title: "Auto Rickshaw Driver",
      subtitle: "GPS = Great Passenger Stories", 
      description: "Route optimization through life stories with emotional intelligence algorithms, traffic prediction models, and storytelling frameworks.",
      skills: ["Navigation Logic", "Story Collection", "Traffic Analysis", "Passenger Psychology"],
      color: "accent-pink",
      roleKey: "auto-rickshaw-driver"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      description: "We parse your PDF/DOCX with advanced AI that actually understands your career trajectory",
      caption: "We won't judge your real CV. Much.",
      icon: <Upload className="w-10 h-10" />
    },
    {
      number: "02",
      title: "Pick Your Wrong Job", 
      description: "Choose from our carefully curated collection of professionally questionable career paths",
      caption: "Choose your destiny… poorly.",
      icon: <Star className="w-10 h-10" />
    },
    {
      number: "03",
      title: "Download Job Kit",
      description: "Receive a complete professional package including resume, portfolio, and personalized cold email",
      caption: "Instant career downgrade — now in PDF.",
      icon: <Download className="w-10 h-10" />
    }
  ];

  const stats = [
    { value: "10,000+", label: "Careers Successfully Ruined", icon: "💼" },
    { value: "99.9%", label: "Uncontrollable Laughter Rate", icon: "😂" },
    { value: "∞", label: "Useless Factor Achieved", icon: "🎯" },
    { value: "< 30s", label: "Time to Professional Chaos", icon: "⚡" }
  ];

  if (showUploader) {
    console.log('Rendering FileUploader component...');
    return (
      <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#FFFCF8' }}>
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <button
            onClick={() => {
              console.log('Back to Landing clicked');
              setShowUploader(false);
            }}
            className="btn btn-secondary px-6 py-3 rounded-full mb-6 hover:scale-105 transition-transform"
          >
            ← Back to Landing
          </button>
          
          <div className="card-feature p-2 max-h-[85vh] overflow-y-auto">
            <div className="bg-white rounded-2xl">
              <FileUploader
                onUploadComplete={(data) => {
                  console.log('Upload complete:', data);
                  // Here we can handle the completion - maybe show results or redirect
                }}
                onError={(error) => {
                  console.error('Upload error:', error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-scroll-container>
      <div style={{ backgroundColor: '#FFFCF8' }} className="relative">
        
        {/* Premium Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="text-2xl font-bold tracking-tight text-neutral-900 font-space">
                  Jobilla
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#features" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors font-space">Features</a>
                  <a href="#jobs" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors font-space">Jobs</a>
                  <a href="#examples" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors font-space">Examples</a>
                </div>
              </div>
              <button 
                onClick={() => {
                  console.log('Get Started clicked - setting showUploader to true');
                  setShowUploader(true);
                }}
                className="btn btn-primary px-6 py-3 rounded-full font-semibold"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="section pt-32 pb-20 relative overflow-hidden" id="container">
          {/* Subtle Pattern Background */}
          <div className="absolute inset-0 bg-pattern opacity-40"></div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-accent-purple rounded-full opacity-10 blur-2xl" data-scroll data-scroll-speed="0.5"></div>
            <div className="absolute bottom-40 right-32 w-40 h-40 bg-accent-teal rounded-full opacity-10 blur-3xl" data-scroll data-scroll-speed="-0.3"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-accent-pink rounded-full opacity-10 blur-xl" data-scroll data-scroll-speed="0.8"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
              
              {/* Left - Hero Content */}
              <div className="space-y-12">
                <div className="space-y-8">
                  <div className="inline-block">
                    <div className="px-6 py-3 bg-white border-2 border-neutral-900 rounded-full shadow-lg">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="w-5 h-5 text-accent-purple" />
                        <span className="font-semibold text-neutral-900 font-space">AI-Powered Career Transformation</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h1 className="text-display-large text-neutral-900 leading-tight">
                      Your Resume.
                      <span className="block text-accent-purple">Wrong Job.</span>
                      <span className="block text-accent-teal">Perfect Match.</span>
                    </h1>
                    
                    <p className="text-2xl text-neutral-600 font-medium leading-relaxed max-w-2xl">
                      Transform your serious CV into ridiculously themed job applications — complete with resume, 
                      portfolio, and cold email that nobody asked for.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <button 
                    onClick={() => {
                      console.log('Upload Resume clicked - setting showUploader to true');
                      setShowUploader(true);
                    }}
                    className="btn btn-accent px-12 py-6 text-xl font-semibold rounded-full group"
                  >
                    <Upload className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    Upload Resume
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="btn btn-secondary px-12 py-6 text-xl font-semibold rounded-full">
                    <Play className="w-6 h-6 mr-3" />
                    See Examples
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-neutral-600 font-medium leading-tight">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Visual Demo */}
              <div className="space-y-8">
                {/* Before */}
                <div className="card p-8 hover:scale-105 transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-4 py-2 bg-neutral-100 rounded-full">
                      <span className="font-bold text-neutral-600 text-sm font-space">BEFORE</span>
                    </div>
                    <div className="text-sm text-neutral-500">senior-developer.pdf</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-neutral-200 rounded-full w-full"></div>
                    <div className="h-4 bg-neutral-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded-full w-5/6"></div>
                  </div>
                  <div className="text-center text-neutral-700 text-lg font-semibold mt-6">
                    "Senior Full Stack Developer"
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-accent-purple border-4 border-neutral-900 rounded-full flex items-center justify-center animate-bounce">
                    <ArrowRight className="w-8 h-8 text-white rotate-90" />
                  </div>
                </div>

                {/* After */}
                <div className="card-feature p-8 bg-accent-teal text-white hover-float">
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-4 py-2 bg-white/20 rounded-full">
                      <span className="font-bold text-white text-sm font-space">AFTER 🥥</span>
                    </div>
                    <div className="text-sm text-white/80">coconut-specialist.pdf</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-white/30 rounded-full w-full"></div>
                    <div className="h-4 bg-white/30 rounded-full w-4/5"></div>
                    <div className="h-4 bg-white/30 rounded-full w-11/12"></div>
                  </div>
                  <div className="text-center text-white text-lg font-bold mt-6">
                    "Senior Coconut Acquisition Specialist"
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section bg-white relative" id="features">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-block px-8 py-4 bg-accent-amber text-white rounded-2xl font-semibold mb-8">
                <Coffee className="w-6 h-6 mr-3 inline" />
                Lightning Fast Process
              </div>
              <h2 className="text-display-medium text-neutral-900 mb-8">
                From PDF to Pani Puri Seller
                <span className="block text-3xl font-semibold text-accent-purple mt-4 font-space">in Under 30 Seconds</span>
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Our premium AI transformation process turns your corporate credentials into comedy gold
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="card-feature p-8 mb-8 hover-lift">
                    <div className="w-24 h-24 mx-auto mb-8 bg-neutral-900 text-white rounded-2xl flex items-center justify-center">
                      {step.icon}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="text-sm font-black text-accent-purple tracking-wider font-space">
                        STEP {step.number}
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900">
                        {step.title}
                      </h3>
                      <p className="text-neutral-600 font-medium leading-relaxed">
                        {step.description}
                      </p>
                      <div className="px-6 py-3 bg-neutral-100 rounded-full">
                        <p className="text-sm font-semibold text-neutral-700 italic">
                          "{step.caption}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Showcase - Only 4 Jobs */}
        <section className="section bg-neutral-900 text-white relative" id="jobs">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-block px-8 py-4 bg-accent-pink text-white rounded-2xl font-semibold mb-8">
                <Users className="w-6 h-6 mr-3 inline" />
                Premium Career Destruction
              </div>
              <h2 className="text-display-medium text-white mb-8">
                Jobs Nobody Asked For
              </h2>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                Choose from our expertly curated collection of professionally questionable transformations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {jobs.map((job, index) => (
                <div 
                  key={index} 
                  className="group cursor-pointer" 

                  onClick={() => setShowUploader(true)}
                >
                  <div className={`card-feature p-8 bg-white text-neutral-900 hover-float transition-all duration-500`}>
                    <div className="text-center space-y-6">
                      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {job.emoji}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                          {job.title}
                        </h3>
                        <p className={`text-lg font-semibold text-${job.color} mb-4`}>
                          {job.subtitle}
                        </p>
                        <p className="text-neutral-600 mb-6 leading-relaxed">
                          {job.description}
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="text-sm font-semibold text-neutral-900 font-space">Key Skills:</div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {job.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-neutral-200">
                        <div className="flex items-center justify-center space-x-2 text-neutral-900 font-semibold group-hover:text-accent-purple transition-colors">
                          <span>Try this transformation</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example Section */}
        <section className="section bg-white" id="examples">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-block px-8 py-4 bg-accent-teal text-white rounded-2xl font-semibold mb-8">
                <Zap className="w-6 h-6 mr-3 inline" />
                Real Transformations
              </div>
              <h2 className="text-display-medium text-neutral-900 mb-8">
                See the Magic Happen
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Watch how we transform corporate resumes into entertainment masterpieces
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
              {/* Before */}
              <div className="card p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="px-6 py-3 bg-neutral-100 rounded-full">
                    <span className="font-bold text-neutral-700 font-space">ORIGINAL RESUME</span>
                  </div>
                  <div className="text-sm text-neutral-500">john-smith-cv.pdf</div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-bold text-neutral-900 mb-2">John Smith</h3>
                    <p className="text-xl text-neutral-600 font-semibold">Senior Full Stack Developer</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-3 text-lg font-space">Experience</h4>
                      <div className="space-y-3 text-neutral-700">
                        <p className="flex items-start"><CheckCircle className="w-5 h-5 text-accent-teal mr-3 mt-0.5" />5+ years building scalable web applications</p>
                        <p className="flex items-start"><CheckCircle className="w-5 h-5 text-accent-teal mr-3 mt-0.5" />Led team of 8 developers on React projects</p>
                        <p className="flex items-start"><CheckCircle className="w-5 h-5 text-accent-teal mr-3 mt-0.5" />Optimized database performance by 40%</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-3 text-lg font-space">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 bg-neutral-100 border border-neutral-300 rounded-lg text-sm font-semibold">React</span>
                        <span className="px-4 py-2 bg-neutral-100 border border-neutral-300 rounded-lg text-sm font-semibold">Node.js</span>
                        <span className="px-4 py-2 bg-neutral-100 border border-neutral-300 rounded-lg text-sm font-semibold">MongoDB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="card-feature p-8 bg-accent-teal text-white">
                <div className="flex items-center justify-between mb-8">
                  <div className="px-6 py-3 bg-white/20 rounded-full">
                    <span className="font-bold text-white font-space">COCONUT VERSION 🥥</span>
                  </div>
                  <div className="text-sm text-white/80">john-coconut-master.pdf</div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">John "Coconut" Smith</h3>
                    <p className="text-xl text-white/90 font-semibold">Senior Coconut Acquisition Specialist</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-white mb-3 text-lg font-space">Professional Experience</h4>
                      <div className="space-y-3 text-white/90">
                        <p className="flex items-start"><CheckCircle className="w-5 h-5 text-white mr-3 mt-0.5" />5+ years scaling coconut trees with React-ive precision</p>
                        <p className="flex items-start"><CheckCircle className="w-5 h-5 text-white mr-3 mt-0.5" />Led grove of 8 coconut trees in optimal harvesting</p>
                        <p className="flex items-start"><CheckCircle className="w-5 h-5 text-white mr-3 mt-0.5" />Optimized climbing routes reducing fall time by 40%</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-white mb-3 text-lg font-space">Specialized Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-sm font-semibold">Tree Climbing</span>
                        <span className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-sm font-semibold">Coconut.js</span>
                        <span className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-sm font-semibold">MongooseDB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <button 
                onClick={() => setShowUploader(true)}
                className="btn btn-accent px-12 py-6 text-xl font-semibold rounded-full"
              >
                Transform Your Resume <ArrowRight className="w-6 h-6 ml-3 inline" />
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section bg-accent-purple text-white relative">
          <div className="absolute inset-0 bg-pattern opacity-20"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="space-y-8">
                <h2 className="text-display-medium text-white leading-tight">
                  Your serious career
                  <span className="block text-white/90">needs a holiday.</span>
                </h2>
                <p className="text-2xl text-white/90 font-medium leading-relaxed max-w-4xl mx-auto">
                  Join Jobilla — the only career tool designed to make you completely unemployable… and absolutely unforgettable.
                </p>
              </div>

              <button 
                onClick={() => setShowUploader(true)}
                className="btn bg-white text-accent-purple hover:bg-neutral-50 border-4 border-neutral-900 px-16 py-8 text-2xl font-bold rounded-full group shadow-2xl font-space"
              >
                <Sparkles className="w-8 h-8 mr-4 group-hover:animate-spin" />
                Try Jobilla Now
                <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="pt-12 space-y-6">
                <p className="text-lg font-semibold text-white/90 font-space">
                  Built in 24 hours by sleep-deprived developers armed with coconuts and caffeine.
                </p>
                <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-white/80">
                  <span>No signup required</span>
                  <span>•</span>
                  <span>Results in 30 seconds</span>
                  <span>•</span>
                  <span>100% ridiculous</span>
                  <span>•</span>
                  <span>Built for entertainment</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-900 text-white py-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-neutral-400">&copy; 2024 Jobilla. Made with 🥥 and questionable career advice.</p>
          </div>
        </footer>

      </div>
    </div>
  );
}