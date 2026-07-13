import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

// Define Interface for Projects
interface Project {
  id: string;
  title: string;
  category: string;
  overview: string;
  tech: string[];
  features: string[];
  icon: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'certificates' | 'pet-control'>('profile');
  const [githubTheme, setGithubTheme] = useState<'dark' | 'light'>('dark');
  const [readmeHtml, setReadmeHtml] = useState<string>('');
  const [bannerStatus, setBannerStatus] = useState<'loaded' | 'missing' | 'loading'>('loading');
  const [petEnabled] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Listen for Luffy shake disturbances
  useEffect(() => {
    const handleShake = () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    };
    window.addEventListener('luffy-shake', handleShake);
    return () => window.removeEventListener('luffy-shake', handleShake);
  }, []);
  
  // Fetch README once on mount
  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/';
    fetch(base + 'README.md')
      .then(res => {
        if (!res.ok) throw new Error('README not found');
        return res.text();
      })
      .then(text => {
        // Fix local banner path to point to public root
        const cleanedText = text.replace('./github_banner.png', base + 'github_banner.png')
                                .replace('github_banner.png', base + 'github_banner.png');
        setReadmeHtml(marked.parse(cleanedText) as string);
      })
      .catch(() => {
        setReadmeHtml('<p style="color: var(--accent-red)">Could not load README.md. Please run the setup scripts to copy resources to the public folder.</p>');
      });

    // Check banner
    const img = new Image();
    img.src = base + 'github_banner.png';
    img.onload = () => setBannerStatus('loaded');
    img.onerror = () => setBannerStatus('missing');
  }, []);

  // Projects Data
  const projects: Project[] = [
    {
      id: 'p1',
      title: 'AWS Dockerized Node.js Services',
      category: 'Cloud & DevOps',
      overview: 'Automated cloud deployment pipeline hosting containerized Node.js applications with secure multi-subnet VPC segregation and production AWS RDS engines.',
      tech: ['AWS EC2', 'AWS RDS', 'Docker', 'VPC', 'IAM Roles', 'Git'],
      features: [
        'Designed dedicated private/public subnets for database and app isolation.',
        'Eliminated local database dependency using persistent cloud RDS services.',
        'Configured strict security groups and IAM profiles for minimal privilege access.'
      ],
      icon: '☁️'
    },
    {
      id: 'p2',
      title: 'CareerWith: AI Resume Builder',
      category: 'AI & Full-Stack',
      overview: 'An auto-scaling single-page resume engine featuring Gemini AI suggestion tools, parser-friendly ATS-optimized resume exports, and a document synchronization pipeline.',
      tech: ['React 19', 'TypeScript', 'Express', 'Tailwind CSS v4', 'Gemini AI API'],
      features: [
        'Structured prompt templates utilizing Gemini AI models for customized suggestion outputs.',
        'Engineered standard-compliant PDF generators ensuring top scores in ATS parses.',
        'Built automated local asset syncing mechanisms for documents.'
      ],
      icon: '🤖'
    },
    {
      id: 'p3',
      title: 'Gear 5 Luffy: Desktop Pet Widget',
      category: 'Systems & UI',
      overview: 'An interactive, transparent desktop pet featuring customizable animations, physics boundaries, collision detection, and running on background threads.',
      tech: ['Python', 'PySide6 (Qt)', 'Windows API', 'Pillow'],
      features: [
        'Coded boundary checking algorithms utilizing native Windows API screen metrics.',
        'Rendered frameless overlay canvas layers executing light physics threads.',
        'Optimized graphics loop refresh cycles maintaining CPU load under 2%.'
      ],
      icon: '👾'
    },
    {
      id: 'p4',
      title: 'OCR Automated Document Conversion System',
      category: 'Automation & Scripts',
      overview: 'AI-driven OCR scanner and parser utility that extracts structured JSON data from unstructured images and PDF documents.',
      tech: ['Python', 'Tesseract OCR', 'Pillow', 'Regex Engine'],
      features: [
        'Reduced manual indexing workloads by 70% via pipeline automation.',
        'Integrated custom image filters (thresholding, resizing) to boost OCR read precision.',
        'Designed custom JSON structures matching enterprise file targets.'
      ],
      icon: '📄'
    }
  ];

  return (
    <div className={`flex flex-col min-h-screen ${isShaking ? 'shake-effect' : ''}`}>
      {/* Top Banner and Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 font-bold bg-gradient-to-r from-indigo-400 to-rose-400 text-slate-950 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            PD
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Pavan Datta Gedila</h1>
            <span className="text-xs text-slate-400">Cloud & Full-Stack Engineer</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all nav-tab-glass ${activeTab === 'profile' ? 'active' : ''}`}
          >
            🔮 GitHub Profile
          </button>
          <button 
            onClick={() => setActiveTab('projects')} 
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all nav-tab-glass ${activeTab === 'projects' ? 'active' : ''}`}
          >
            🌐 Projects
          </button>
          <button 
            onClick={() => setActiveTab('skills')} 
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all nav-tab-glass ${activeTab === 'skills' ? 'active' : ''}`}
          >
            ⚡ Skills
          </button>
          <button 
            onClick={() => setActiveTab('certificates')} 
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all nav-tab-glass ${activeTab === 'certificates' ? 'active' : ''}`}
          >
            🏆 Certifications
          </button>
        </nav>

        {/* Global Options */}
        <div className="flex items-center gap-3">
          {activeTab === 'profile' && (
            <button 
              onClick={() => setGithubTheme(githubTheme === 'dark' ? 'light' : 'dark')}
              className="px-2.5 py-1 text-xs border rounded-md border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Toggle GitHub Theme ({githubTheme})
            </button>
          )}
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative px-8 py-10 overflow-hidden bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Hey, I'm <span className="bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">Pavan Datta Gedila</span>
            </h2>
            <TypingEffect />
            <p className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
              Centurion University computer science student specializing in building high-performance cloud architectures, orchestrating DevOps pipelines, and deploying robust server-side widgets.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <a href="https://linkedin.com/in/pavan-datta-gedila-7a1089369" target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                💼 LinkedIn
              </a>
              <a href="https://www.instagram.com/she__call_me_single?igsh=mwl4mddpbwnqmxzlyg==" target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                📸 Instagram
              </a>
              <a href="https://www.topcoder.com/members/761211" target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                🏆 Topcoder
              </a>
              <a href="https://github.com/Pavangitu" target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                💻 GitHub
              </a>
              <a href="https://leetcode.com/pavangitu" target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                🧠 LeetCode
              </a>
              <a href="mailto:pavandattagedila@gmail.com" className="btn btn-sm">
                ✉️ Email
              </a>
            </div>
          </div>

          {/* Banner Status Display */}
          <div className="w-full md:w-80 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              📂 Assets Status
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Profile Banner:</span>
                <span className={`px-2 py-0.5 rounded font-medium ${bannerStatus === 'loaded' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {bannerStatus === 'loaded' ? 'Active' : 'Missing (Run run.bat)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Profile README:</span>
                <span className="px-2 py-0.5 rounded font-medium bg-green-500/10 text-green-400">Loaded</span>
              </div>
              <div className="border-t border-slate-800/80 my-2 pt-2">
                <span className="text-slate-500 text-[11px] block mb-1.5">Download Local PDF Resumes:</span>
                <div className="grid grid-cols-1 gap-1">
                  <a href="/Pavan-Datta-Gedila1.pdf" download className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                    📄 Pavan Datta Gedila CV
                  </a>
                  <a href="/pavan Profile.pdf" download className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                    📄 Pavan Profile Summary
                  </a>
                  <a href="/pavan datta.pdf" download className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                    📄 Pavan Datta Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-[slideIn_0.3s_ease]">
            {bannerStatus === 'missing' && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl text-sm leading-relaxed">
                <strong>⚠️ Banner Image Missing:</strong> The Tokyo Night profile banner could not be found locally. 
                Please make sure to double-click the <strong>run.bat</strong> or execute <strong>copy_banner.py</strong> to copy the profile assets into the public directory!
              </div>
            )}
            
            {/* Simulated GitHub Card Wrap */}
            <div className={`rounded-xl border ${githubTheme === 'dark' ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'} p-6 transition-all duration-300`}>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-500 font-mono ml-2">github.com/pavangitu/README.md</span>
              </div>
              
              <div 
                className={`markdown-body ${githubTheme === 'dark' ? 'github-dark-theme' : 'github-light-theme'}`} 
                dangerouslySetInnerHTML={{ __html: readmeHtml }} 
              />
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[slideIn_0.3s_ease]">
            {projects.map(proj => (
              <div key={proj.id} className="p-6 rounded-2xl glass-card-3d card-3d-effect flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl glass-icon-container float-3d">{proj.icon}</span>
                    <span className="px-2.5 py-1 text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">{proj.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{proj.title}</h3>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{proj.overview}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-300 mb-1.5">Key Implementation Details:</h4>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                      {proj.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                  {proj.tech.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] font-mono bg-slate-850 text-slate-300 rounded border border-slate-800">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-[slideIn_0.3s_ease]">
            {/* Cloud & Systems */}
            <div className="p-6 rounded-2xl glass-card-3d card-3d-effect">
              <h3 className="text-lg font-bold text-cyan-400 mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="text-xl glass-icon-container float-3d">☁️</span> Cloud & Infrastructure
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Amazon Web Services (AWS)</span>
                    <span className="text-cyan-400 font-mono">90%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-cyan" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">EC2, S3, RDS, VPC, IAM</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Azure Fundamentals</span>
                    <span className="text-cyan-400 font-mono">75%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-cyan" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Resource Groups, VM</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Google Cloud (GCP)</span>
                    <span className="text-cyan-400 font-mono">65%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-cyan" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">App Engine, Cloud SQL</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Container Workloads</span>
                    <span className="text-cyan-400 font-mono">85%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-cyan" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Docker, Kubernetes</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">DevOps Automation</span>
                    <span className="text-cyan-400 font-mono">80%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-cyan" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">GitHub Actions, AWS CLI, Gulp</span>
                </div>
              </div>
            </div>

            {/* Programming & Frameworks */}
            <div className="p-6 rounded-2xl glass-card-3d card-3d-effect">
              <h3 className="text-lg font-bold text-purple-400 mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="text-xl glass-icon-container float-3d">💻</span> Systems & Development
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Languages</span>
                    <span className="text-purple-400 font-mono">90%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-purple" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">TS, JS, Python, C++, C#, Java, Matlab</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Backend Runtimes</span>
                    <span className="text-purple-400 font-mono">85%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-purple" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Node.js, Express, Electron</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Frontend Web & Mobile</span>
                    <span className="text-purple-400 font-mono">90%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-purple" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">React, HTML5, CSS3, React Native, Android</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Desktop & Embedded</span>
                    <span className="text-purple-400 font-mono">80%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-purple" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">PySide6, Windows API, Arduino</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Creative & UI Design</span>
                    <span className="text-purple-400 font-mono">75%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-purple" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Figma, Photoshop, Illustrator</span>
                </div>
              </div>
            </div>

            {/* Databases */}
            <div className="p-6 rounded-2xl glass-card-3d card-3d-effect">
              <h3 className="text-lg font-bold text-green-400 mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="text-xl glass-icon-container float-3d">🗄️</span> Database & Storage
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Relational (SQL)</span>
                    <span className="text-green-400 font-mono">85%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-green" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">MySQL, PostgreSQL, Oracle</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">NoSQL Platforms</span>
                    <span className="text-green-400 font-mono">80%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-green" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">MongoDB</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Realtime Databases</span>
                    <span className="text-green-400 font-mono">85%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-green" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Firebase Firestore</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Cloud Storage</span>
                    <span className="text-green-400 font-mono">90%</span>
                  </div>
                  <div className="neumorphic-track">
                    <div className="neumorphic-fill-green" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Amazon S3, Firebase Blob</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certificates' && (
          <div className="max-w-3xl mx-auto space-y-4 animate-[slideIn_0.3s_ease]">
            <div className="p-4 rounded-xl glass-card-3d card-3d-effect flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl glass-icon-container float-3d">🤖</span>
                <div>
                  <h4 className="font-bold text-white">Introduction to Responsible AI</h4>
                  <span className="text-xs text-slate-500">Google Cloud</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-green-500/10 text-green-400 rounded border border-green-500/20">Verified</span>
            </div>

            <div className="p-4 rounded-xl glass-card-3d card-3d-effect flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl glass-icon-container float-3d">⚡</span>
                <div>
                  <h4 className="font-bold text-white">Introduction to Generative AI Studio</h4>
                  <span className="text-xs text-slate-500">Google Cloud</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-green-500/10 text-green-400 rounded border border-green-500/20">Verified</span>
            </div>

            <div className="p-4 rounded-xl glass-card-3d card-3d-effect flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl glass-icon-container float-3d">☁️</span>
                <div>
                  <h4 className="font-bold text-white">Machine Learning Basics on AWS</h4>
                  <span className="text-xs text-slate-500">Amazon Web Services</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-green-500/10 text-green-400 rounded border border-green-500/20">Verified</span>
            </div>

            <div className="p-4 rounded-xl glass-card-3d card-3d-effect flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl glass-icon-container float-3d">🏛️</span>
                <div>
                  <h4 className="font-bold text-white">EY Technology Risk Job Simulation</h4>
                  <span className="text-xs text-slate-500">Forage / EY</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-green-500/10 text-green-400 rounded border border-green-500/20">Verified</span>
            </div>

            <div className="p-4 rounded-xl glass-card-3d card-3d-effect flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl glass-icon-container float-3d">🏢</span>
                <div>
                  <h4 className="font-bold text-white">Master Data Management for Beginners</h4>
                  <span className="text-xs text-slate-500">TCS iON</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-green-500/10 text-green-400 rounded border border-green-500/20">Verified</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500 bg-slate-950/60 mt-auto">
        <p>© 2026 Pavan Datta Gedila. Generated for modern local React previews.</p>
      </footer>

      {/* Luffy Interactive Widget Overlay */}
      <LuffyPet petEnabled={petEnabled} />
    </div>
  );
}

// ============================================================================
// SELF-CONTAINED SUBCOMPONENTS TO PREVENT GLOBAL APP RE-RENDERS & SHAKING
// ============================================================================

const phrases = [
  'Cloud & Full-Stack Developer',
  'DevOps & Infrastructure Engineer',
  'AI & Automation Enthusiast'
];

function TypingEffect() {
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    
    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at the end of the phrase
      const timer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timer);
    }
    
    if (isDeleting && charIndex === 0) {
      // Transition to next phrase
      setIsDeleting(false);
      setPhraseIndex(prev => (prev + 1) % phrases.length);
      return;
    }

    const timer = setTimeout(() => {
      setTypedText(currentPhrase.substring(0, isDeleting ? charIndex - 1 : charIndex + 1));
      setCharIndex(prev => isDeleting ? prev - 1 : prev + 1);
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <div className="h-8 font-mono text-rose-400 text-lg md:text-xl font-medium">
      {typedText}<span className="animate-pulse">|</span>
    </div>
  );
}

function processLuffyImage(src: string, cropTop: boolean): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        // Crop top if it contains text
        const cropTopPercent = cropTop ? 0.15 : 0.0;
        const cropTopPixels = Math.floor(img.height * cropTopPercent);
        const newHeight = img.height - cropTopPixels;

        canvas.width = img.width;
        canvas.height = newHeight;

        // Draw cropped image
        ctx.drawImage(img, 0, cropTopPixels, img.width, newHeight, 0, 0, img.width, newHeight);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Helper to check if a pixel is white/light-gray background
        const isWhite = (x: number, y: number) => {
          const idx = (y * width + x) * 4;
          return data[idx] > 240 && data[idx + 1] > 240 && data[idx + 2] > 240 && data[idx + 3] > 0;
        };

        // Flood fill queue
        const queue: [number, number][] = [];
        const visited = new Uint8Array(width * height);

        // Add all boundary pixels as seeds to start the flood fill
        for (let x = 0; x < width; x++) {
          if (isWhite(x, 0)) { queue.push([x, 0]); visited[x] = 1; }
          if (isWhite(x, height - 1)) { queue.push([x, height - 1]); visited[(height - 1) * width + x] = 1; }
        }
        for (let y = 0; y < height; y++) {
          if (isWhite(0, y)) { queue.push([0, y]); visited[y * width] = 1; }
          if (isWhite(width - 1, y)) { queue.push([width - 1, y]); visited[y * width + (width - 1)] = 1; }
        }

        // Breadth-First Search (BFS) Flood Fill
        let head = 0;
        while (head < queue.length) {
          const [cx, cy] = queue[head++];
          
          // Mark pixel as transparent
          const idx = (cy * width + cx) * 4;
          data[idx + 3] = 0; // Alpha = 0

          // Check 4 neighbors
          const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1]
          ];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (!visited[nIdx] && isWhite(nx, ny)) {
                visited[nIdx] = 1;
                queue.push([nx, ny]);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL());
      } catch (err) {
        console.error("Error processing image background:", err);
        resolve(src);
      }
    };
    img.onerror = () => {
      resolve(src);
    };
  });
}

// Custom disturbance events for Luffy
const disturbEvents = [
  {
    type: 'shake',
    phrases: [
      'Gomu Gomu no... ELEPHANT GUN! 👊 *BOOM*',
      'BOING! Bouncing earthquake! Hahaha! 🌍',
      'Drums of Liberation! Dance with me! 🥁',
      'Gomu Gomu no... GATLING GUN! 🥊💥'
    ],
    action: () => {
      window.dispatchEvent(new CustomEvent('luffy-shake'));
    }
  },
  {
    type: 'meat',
    phrases: [
      '🍖 I demand MEAT! Feed me or I will block your view!',
      'Gomu Gomu no... hungry! Where is Sanji? 👨‍🍳',
      'I want food! 🍖🍖🍖',
      'Coding is cool, but meat is better! 🍖'
    ],
    action: (setPos: any) => {
      // Jump to center of screen
      setPos({ x: window.innerWidth / 2 - 40, y: window.innerHeight / 2 - 80 });
    }
  },
  {
    type: 'idea',
    phrases: [
      '💡 Let\'s rename all your functions to Zoro, Sanji, and Nami!',
      '💡 Delete the node_modules folder. It looks heavy! 😜',
      '💡 Let\'s code a system that automatically orders pizza!',
      '💡 Replace all console errors with: "Shishishi! Fixed!"',
      '💡 Write code in pirate slang! "Ahoy, const ship = true!"'
    ],
    action: () => {}
  },
  {
    type: 'zoro',
    phrases: [
      '⚔️ Zoro got lost again! Check your DevTools console!',
      'Wait, is Zoro lost in your codebase? 🧭',
      'I think Zoro is wandering around the Console Tab...'
    ],
    action: () => {
      console.log("%c⚔️ Zoro: 'Where the hell am I? Is this the console? I was looking for the sword shop...'", "color: #10b981; font-weight: bold; font-size: 14px;");
    }
  }
];

function LuffyPet({ petEnabled }: LuffyPetProps) {
  const [petPos, setPetPos] = useState({ x: window.innerWidth - 180, y: window.innerHeight - 180 });
  const [petState, setPetState] = useState<'idle' | 'walking' | 'running' | 'jumping' | 'sleeping'>('idle');
  const [petDirection, setPetDirection] = useState<'left' | 'right'>('left');
  const [petSpeech, setPetSpeech] = useState<string>('Gear 5 Luffy Pet is ready! 🏴‍☠️');
  const [showBubble, setShowBubble] = useState(true);
  const petRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [isGrabbed, setIsGrabbed] = useState(false);

  // States for transparent processed image sources
  const [walkSrc, setWalkSrc] = useState<string>('/luffy_walk.png');
  const [waveSrc, setWaveSrc] = useState<string>('/luffy_wave.png');
  const [laughSrc, setLaughSrc] = useState<string>('/luffy_laugh.png');

  // Process images on mount to remove white background and crop text
  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/';
    processLuffyImage(base + 'luffy_walk.png', true).then(url => setWalkSrc(url));
    processLuffyImage(base + 'luffy_wave.png', true).then(url => setWaveSrc(url));
    processLuffyImage(base + 'luffy_laugh.png', false).then(url => setLaughSrc(url));
  }, []);

  // Helper to trigger speech and show bubble
  const speak = (msg: string) => {
    setPetSpeech(msg);
    setShowBubble(true);
  };

  // Hide bubble after 3.5 seconds
  useEffect(() => {
    if (!showBubble) return;
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [petSpeech, showBubble]);

  // Luffy Pet Behavior (State Transitions & Random Disturbances)
  useEffect(() => {
    if (!petEnabled || isGrabbed) return;

    const behaviorInterval = setInterval(() => {
      if (isDragging.current) return;

      // 25% chance of a funny disturbance or giving an idea
      const isDisturbed = Math.random() < 0.25;
      if (isDisturbed) {
        const event = disturbEvents[Math.floor(Math.random() * disturbEvents.length)];
        const phrase = event.phrases[Math.floor(Math.random() * event.phrases.length)];
        setPetState('jumping');
        speak(phrase);
        
        if (event.type === 'meat') {
          // Luffy jumps to center and demands meat
          event.action(setPetPos);
          // Return to bottom after 4.5 seconds
          setTimeout(() => {
            setPetPos({ x: window.innerWidth - 180, y: window.innerHeight - 180 });
            setPetState('idle');
            speak('Okay, back to work! But I still want meat... 🍖');
          }, 4500);
        } else {
          event.action();
        }
        return;
      }

      // Normal state transitions
      const states: Array<'idle' | 'walking' | 'running' | 'jumping' | 'sleeping'> = ['idle', 'walking', 'running', 'jumping', 'sleeping'];
      const weights = [0.35, 0.35, 0.15, 0.05, 0.1];
      let rand = Math.random();
      let chosenIndex = 0;
      for (let i = 0; i < weights.length; i++) {
        rand -= weights[i];
        if (rand <= 0) {
          chosenIndex = i;
          break;
        }
      }
      const newState = states[chosenIndex];
      setPetState(newState);

      if (newState === 'sleeping') {
        speak('ZZZ... Nika... ZZZ... 💤');
      } else if (newState === 'jumping') {
        speak('Gomu Gomu no... Rocket! 🚀');
      } else if (newState === 'running') {
        speak('Hahaha! The drums of liberation! 🥁');
      } else if (newState === 'walking') {
        speak('Exploring your desktop... Shishishi! 🧭');
      } else {
        speak('Gear 5 Luffy is ready! 🏴‍☠️');
      }
    }, 4500);

    return () => clearInterval(behaviorInterval);
  }, [petEnabled, isGrabbed]);

  // Luffy Pet Physics & Roaming (Smooth movement loop)
  useEffect(() => {
    if (!petEnabled) return;

    const movementInterval = setInterval(() => {
      if (isDragging.current || isGrabbed) return;

      setPetPos(prev => {
        let { x, y } = prev;
        const speed = petState === 'running' ? 7 : petState === 'walking' ? 2.5 : 0;
        
        if (petState === 'jumping') {
          y -= 8;
          const fallTimeout = setTimeout(() => {
            setPetPos(p => ({ ...p, y: Math.min(window.innerHeight - 150, p.y + 8) }));
          }, 300);
          return { x, y: Math.max(20, y) };
        }

        if (speed > 0) {
          if (petDirection === 'left') {
            x -= speed;
            if (x < 20) {
              x = 20;
              setPetDirection('right');
              speak('Oops! Bounce! 💫');
            }
          } else {
            x += speed;
            if (x > window.innerWidth - 180) {
              x = window.innerWidth - 180;
              setPetDirection('left');
              speak('Turning back! 🔄');
            }
          }
        }

        y = Math.max(20, Math.min(window.innerHeight - 150, y));
        return { x, y };
      });
    }, 100);

    return () => clearInterval(movementInterval);
  }, [petState, petDirection, petEnabled, isGrabbed]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setIsGrabbed(true);
    dragStart.current = {
      x: e.clientX - petPos.x,
      y: e.clientY - petPos.y
    };
    setPetState('jumping');
    speak('You grabbed me! Shishishi! 🤪');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const x = Math.max(0, Math.min(window.innerWidth - 120, e.clientX - dragStart.current.x));
      const y = Math.max(0, Math.min(window.innerHeight - 120, e.clientY - dragStart.current.y));
      setPetPos({ x, y });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      setIsGrabbed(false);
      setPetState('idle');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [petPos]);

  // Play tag on mouse hover (15% chance to run away when user hovers mouse)
  const handleMouseEnter = () => {
    if (isDragging.current || isGrabbed) return;
    if (Math.random() < 0.15) {
      setPetState('running');
      speak('Tag! You can\'t catch me! 🏃‍♂️💨');
      setPetPos({
        x: Math.max(50, Math.min(window.innerWidth - 200, Math.random() * window.innerWidth)),
        y: Math.max(50, Math.min(window.innerHeight - 200, Math.random() * window.innerHeight))
      });
    }
  };

  if (!petEnabled) return null;

  return (
    <div 
      ref={petRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      style={{ 
        position: 'fixed',
        left: `${petPos.x}px`,
        top: `${petPos.y}px`,
        zIndex: 9999,
        cursor: isDragging.current ? 'grabbing' : 'grab',
        transition: isDragging.current ? 'none' : 'left 0.1s linear, top 0.1s linear'
      }}
      className="select-none"
    >
      {/* Dynamic Speech Bubble */}
      {showBubble && (
        <div 
          className="speech-bubble-glass absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 rounded-lg text-xs font-semibold text-white text-center whitespace-normal pointer-events-none select-none w-[180px] z-[10000]"
          style={{
            animation: 'slideIn 0.2s ease-out'
          }}
        >
          {petSpeech}
          {/* Triangular Tail */}
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" 
            style={{ borderTopColor: 'rgba(18, 12, 28, 0.8)' }}
          ></div>
        </div>
      )}

      <div className={`luffy-sprite-container ${petState} ${petDirection}`}>
        {isGrabbed || petState === 'jumping' ? (
          <img src={laughSrc} alt="Gear 5 Luffy Laughing" className="w-[80px] h-[80px] object-contain pointer-events-none select-none" />
        ) : petState === 'walking' || petState === 'running' || petState === 'sleeping' ? (
          <img src={walkSrc} alt="Gear 5 Luffy Walking" className="w-[80px] h-[80px] object-contain pointer-events-none select-none" />
        ) : (
          <img src={waveSrc} alt="Gear 5 Luffy Waving" className="w-[80px] h-[80px] object-contain pointer-events-none select-none" />
        )}
      </div>
    </div>
  );
}
