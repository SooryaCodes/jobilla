'use client';

import React, { useState } from 'react';
import { Upload, ArrowRight, FileText, Sparkles, Star, Zap, Coffee, Users, Download, CheckCircle, Play } from 'lucide-react';
import FileUploader from '@/components/upload/FileUploader';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

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
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <motion.div 
                  className="text-2xl font-bold tracking-tight text-neutral-900 font-space"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Jobilla
                </motion.div>
                <motion.div 
                  className="hidden md:flex items-center space-x-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <a href="#features" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors font-space">Features</a>
                  <a href="#jobs" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors font-space">Jobs</a>
                  <a href="#examples" className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors font-space">Examples</a>
                </motion.div>
              </div>
              <motion.button 
                onClick={() => {
                  console.log('Get Started clicked - setting showUploader to true');
                  setShowUploader(true);
                }}
                className="btn btn-primary px-6 py-3 rounded-full font-semibold"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="section pt-32 pb-20 relative overflow-hidden" id="container">
          {/* Subtle Pattern Background */}
          <div className="absolute inset-0 bg-pattern opacity-40"></div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-20 left-20 w-32 h-32 bg-accent-purple rounded-full opacity-10 blur-2xl"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-40 right-32 w-40 h-40 bg-accent-teal rounded-full opacity-10 blur-3xl"
              animate={{
                y: [0, 30, 0],
                x: [0, -15, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 w-24 h-24 bg-accent-pink rounded-full opacity-10 blur-xl"
              animate={{
                y: [0, -15, 0],
                x: [0, -8, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
              
              {/* Left - Hero Content */}
              <motion.div 
                className="space-y-12"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="space-y-8">
                  <motion.div 
                    className="inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <div className="px-6 py-3 bg-white border-2 border-neutral-900 rounded-full shadow-lg">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5 text-accent-purple" />
                        </motion.div>
                        <span className="font-semibold text-neutral-900 font-space">AI-Powered Career Transformation</span>
                      </div>
                    </div>
                  </motion.div>

                  <div className="space-y-8">
                    <motion.h1 
                      className="text-display-medium text-neutral-900 leading-tight"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      Your Resume.
                      <motion.span 
                        className="block text-accent-purple"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        Wrong Job.
                      </motion.span>
                      <motion.span 
                        className="block text-accent-teal"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                      >
                        Perfect Match.
                      </motion.span>
                    </motion.h1>
                    
                    <motion.p 
                      className="text-2xl text-neutral-600 font-medium leading-relaxed max-w-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      Transform your serious CV into ridiculously themed job applications — complete with resume, 
                      portfolio, and cold email that nobody asked for.
                    </motion.p>
                  </div>
                </div>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <motion.button 
                    onClick={() => {
                      console.log('Upload Resume clicked - setting showUploader to true');
                      setShowUploader(true);
                    }}
                    className="btn btn-accent px-12 py-6 text-xl font-semibold rounded-full group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Upload className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    Upload Resume
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button 
                    className="btn btn-secondary px-12 py-6 text-xl font-semibold rounded-full"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Play className="w-6 h-6 mr-3" />
                    See Examples
                  </motion.button>
                </motion.div>

               
              </motion.div>

              {/* Right - Visual Demo */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Before */}
                <motion.div 
                  className="card p-8 hover:scale-105 transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-4 py-2 bg-neutral-100 rounded-full">
                      <span className="font-bold text-neutral-600 text-sm font-space">BEFORE</span>
                    </div>
                    <div className="text-sm text-neutral-500">senior-developer.pdf</div>
                  </div>
                  <div className="space-y-4">
                    <motion.div 
                      className="h-4 bg-neutral-200 rounded-full w-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.9 }}
                    />
                    <motion.div 
                      className="h-4 bg-neutral-200 rounded-full w-3/4"
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 0.8, delay: 1.1 }}
                    />
                    <motion.div 
                      className="h-4 bg-neutral-200 rounded-full w-5/6"
                      initial={{ width: 0 }}
                      animate={{ width: "83.33%" }}
                      transition={{ duration: 0.8, delay: 1.3 }}
                    />
                  </div>
                  <motion.div 
                    className="text-center text-neutral-700 text-lg font-semibold mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    "Senior Full Stack Developer"
                  </motion.div>
                </motion.div>

                {/* Arrow */}
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.7 }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-accent-purple border-4 border-neutral-900 rounded-full flex items-center justify-center"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                    }}
                  >
                    <ArrowRight className="w-8 h-8 text-white rotate-90" />
                  </motion.div>
                </motion.div>

                {/* After */}
                <motion.div 
                  className="card-feature p-8 bg-accent-teal text-white hover-float"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.9 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-4 py-2 bg-white/20 rounded-full">
                      <span className="font-bold text-white text-sm font-space">AFTER 🥥</span>
                    </div>
                    <div className="text-sm text-white/80">coconut-specialist.pdf</div>
                  </div>
                  <div className="space-y-4">
                    <motion.div 
                      className="h-4 bg-white/30 rounded-full w-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 2.1 }}
                    />
                    <motion.div 
                      className="h-4 bg-white/30 rounded-full w-4/5"
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 0.8, delay: 2.3 }}
                    />
                    <motion.div 
                      className="h-4 bg-white/30 rounded-full w-11/12"
                      initial={{ width: 0 }}
                      animate={{ width: "91.67%" }}
                      transition={{ duration: 0.8, delay: 2.5 }}
                    />
                  </div>
                  <motion.div 
                    className="text-center text-white text-lg font-bold mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.7 }}
                  >
                    "Senior Coconut Acquisition Specialist"
                  </motion.div>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section bg-white relative" id="features">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-8 py-4 bg-accent-amber text-white rounded-2xl font-semibold mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Coffee className="w-6 h-6 mr-3 inline" />
                </motion.div>
                Lightning Fast Process
              </motion.div>
              <motion.h2 
                className="text-display-medium text-neutral-900 mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                From PDF to Pani Puri Seller
                <motion.span 
                  className="block text-3xl font-semibold text-accent-purple mt-4 font-space"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  in Under 30 Seconds
                </motion.span>
              </motion.h2>
              <motion.p 
                className="text-xl text-neutral-600 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Our premium AI transformation process turns your corporate credentials into comedy gold
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <motion.div 
                  key={index} 
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <motion.div 
                    className="card-feature p-8 mb-8 hover-lift"
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div 
                      className="w-24 h-24 mx-auto mb-8 bg-neutral-900 text-white rounded-2xl flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.icon}
                    </motion.div>
                    
                    <div className="space-y-6">
                      <motion.div 
                        className="text-sm font-black text-accent-purple tracking-wider font-space"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                      >
                        STEP {step.number}
                      </motion.div>
                      <motion.h3 
                        className="text-2xl font-bold text-neutral-900"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                      >
                        {step.title}
                      </motion.h3>
                      <motion.p 
                        className="text-neutral-600 font-medium leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.2 + 0.5 }}
                      >
                        {step.description}
                      </motion.p>
                      <motion.div 
                        className="px-6 py-3 bg-neutral-100 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.2 + 0.6 }}
                      >
                        <p className="text-sm font-semibold text-neutral-700 italic">
                          "{step.caption}"
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Showcase - Only 4 Jobs */}
        <section className="section bg-neutral-900 text-white relative" id="jobs">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-8 py-4 bg-accent-pink text-white rounded-2xl font-semibold mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Users className="w-6 h-6 mr-3 inline" />
                </motion.div>
                Premium Career Destruction
              </motion.div>
              <motion.h2 
                className="text-display-medium text-white mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Jobs Nobody Asked For
              </motion.h2>
              <motion.p 
                className="text-xl text-neutral-300 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Choose from our expertly curated collection of professionally questionable transformations
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {jobs.map((job, index) => (
                <motion.div 
                  key={index} 
                  className="group cursor-pointer"
                  onClick={() => setShowUploader(true)}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className={`card-feature p-8 bg-white text-neutral-900 hover-float transition-all duration-500`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center space-y-6">
                      <motion.div 
                        className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -10, 10, -10, 0],
                        }}
                        transition={{ 
                          rotate: { duration: 0.5 }
                        }}
                      >
                        {job.emoji}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                      >
                        <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                          {job.title}
                        </h3>
                        <p className={`text-lg font-semibold text-${job.color} mb-4`}>
                          {job.subtitle}
                        </p>
                        <p className="text-neutral-600 mb-6 leading-relaxed">
                          {job.description}
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                      >
                        <div className="text-sm font-semibold text-neutral-900 font-space">Key Skills:</div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {job.skills.map((skill, skillIndex) => (
                            <motion.span 
                              key={skillIndex} 
                              className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium"
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: index * 0.1 + skillIndex * 0.1 + 0.6 }}
                              whileHover={{ scale: 1.1, y: -2 }}
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div 
                        className="pt-6 border-t border-neutral-200"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
                      >
                        <div className="flex items-center justify-center space-x-2 text-neutral-900 font-semibold group-hover:text-accent-purple transition-colors">
                          <span>Try this transformation</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                          >
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Example Section */}
        <section className="section bg-white" id="examples">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-8 py-4 bg-accent-teal text-white rounded-2xl font-semibold mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                >
                  <Zap className="w-6 h-6 mr-3 inline" />
                </motion.div>
                Real Transformations
              </motion.div>
              <motion.h2 
                className="text-display-medium text-neutral-900 mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                See the Magic Happen
              </motion.h2>
              <motion.p 
                className="text-xl text-neutral-600 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Watch how we transform corporate resumes into entertainment masterpieces
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
              {/* Before */}
              <motion.div 
                className="card p-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="flex items-center justify-between mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="px-6 py-3 bg-neutral-100 rounded-full">
                    <span className="font-bold text-neutral-700 font-space">ORIGINAL RESUME</span>
                  </div>
                  <div className="text-sm text-neutral-500">john-smith-cv.pdf</div>
                </motion.div>

                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <h3 className="text-3xl font-bold text-neutral-900 mb-2">John Smith</h3>
                    <p className="text-xl text-neutral-600 font-semibold">Senior Full Stack Developer</p>
                  </motion.div>
                  
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <h4 className="font-bold text-neutral-900 mb-3 text-lg font-space">Experience</h4>
                      <div className="space-y-3 text-neutral-700">
                        {[
                          "5+ years building scalable web applications",
                          "Led team of 8 developers on React projects", 
                          "Optimized database performance by 40%"
                        ].map((text, index) => (
                          <motion.p 
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                          >
                            <CheckCircle className="w-5 h-5 text-accent-teal mr-3 mt-0.5" />{text}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <h4 className="font-bold text-neutral-900 mb-3 text-lg font-space">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {["React", "Node.js", "MongoDB"].map((skill, index) => (
                          <motion.span 
                            key={index}
                            className="px-4 py-2 bg-neutral-100 border border-neutral-300 rounded-lg text-sm font-semibold"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* After */}
              <motion.div 
                className="card-feature p-8 bg-accent-teal text-white"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div 
                  className="flex items-center justify-between mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <div className="px-6 py-3 bg-white/20 rounded-full">
                    <span className="font-bold text-white font-space">COCONUT VERSION 🥥</span>
                  </div>
                  <div className="text-sm text-white/80">john-coconut-master.pdf</div>
                </motion.div>

                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <h3 className="text-3xl font-bold text-white mb-2">John "Coconut" Smith</h3>
                    <p className="text-xl text-white/90 font-semibold">Senior Coconut Acquisition Specialist</p>
                  </motion.div>
                  
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <h4 className="font-bold text-white mb-3 text-lg font-space">Professional Experience</h4>
                      <div className="space-y-3 text-white/90">
                        {[
                          "5+ years scaling coconut trees with React-ive precision",
                          "Led grove of 8 coconut trees in optimal harvesting",
                          "Optimized climbing routes reducing fall time by 40%"
                        ].map((text, index) => (
                          <motion.p 
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                          >
                            <CheckCircle className="w-5 h-5 text-white mr-3 mt-0.5" />{text}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 1.0 }}
                    >
                      <h4 className="font-bold text-white mb-3 text-lg font-space">Specialized Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Tree Climbing", "Coconut.js", "MongooseDB"].map((skill, index) => (
                          <motion.span 
                            key={index}
                            className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-sm font-semibold"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button 
                onClick={() => setShowUploader(true)}
                className="btn btn-accent px-12 py-6 text-xl font-semibold rounded-full"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Transform Your Resume <ArrowRight className="w-6 h-6 ml-3 inline" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section bg-accent-purple text-white relative">
          <div className="absolute inset-0 bg-pattern opacity-20"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div 
              className="max-w-5xl mx-auto space-y-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.h2 
                  className="text-display-medium text-white leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Your serious career
                  <motion.span 
                    className="block text-white/90"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    needs a holiday.
                  </motion.span>
                </motion.h2>
                <motion.p 
                  className="text-2xl text-white/90 font-medium leading-relaxed max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Join Jobilla — the only career tool designed to make you completely unemployable… and absolutely unforgettable.
                </motion.p>
              </motion.div>

              <motion.button 
                onClick={() => setShowUploader(true)}
                className="btn bg-white text-accent-purple hover:bg-neutral-50 border-4 border-neutral-900 px-16 py-8 text-2xl font-bold rounded-full group shadow-2xl font-space"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 mr-4" />
                </motion.div>
                Try Jobilla Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                >
                  <ArrowRight className="w-8 h-8 ml-4" />
                </motion.div>
              </motion.button>

              <motion.div 
                className="pt-12 space-y-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <motion.p 
                  className="text-lg font-semibold text-white/90 font-space"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.1 }}
                >
                  Built in 24 hours by sleep-deprived developers armed with coconuts and caffeine.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap justify-center gap-8 text-sm font-medium text-white/80"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                >
                  {["No signup required", "Results in 30 seconds", "100% ridiculous", "Built for entertainment"].map((text, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
                    >
                      {text}
                      {index < 3 && <span className="ml-8">•</span>}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer 
          className="bg-neutral-900 text-white py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-6 text-center">
            <motion.p 
              className="text-neutral-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              &copy; 2024 Jobilla. Made with 🥥 and questionable career advice.
            </motion.p>
          </div>
        </motion.footer>

      </div>
    </div>
  );
}