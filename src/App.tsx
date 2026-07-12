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
  const [petEnabled, setPetEnabled] = useState<boolean>(true);
  
  // Typing Effect
  const [typedText, setTypedText] = useState('');
  const phrases = [
    'Cloud & Full-Stack Developer',
    'DevOps & Infrastructure Engineer',
    'AI & Automation Enthusiast'
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Luffy Pet State
  const [petPos, setPetPos] = useState({ x: window.innerWidth - 180, y: window.innerHeight - 180 });
  const [petState, setPetState] = useState<'idle' | 'walking' | 'running' | 'jumping' | 'sleeping'>('idle');
  const [petDirection, setPetDirection] = useState<'left' | 'right'>('left');
  const [petSpeech, setPetSpeech] = useState<string>('Gear 5 Luffy Pet is ready!');
  const petRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [isGrabbed, setIsGrabbed] = useState(false);

  // Fetch README
  useEffect(() => {
    fetch('/README.md')
      .then(res => {
        if (!res.ok) throw new Error('README not found');
        return res.text();
      })
      .then(text => {
        // Fix local banner path to point to public root
        const cleanedText = text.replace('./github_banner.png', '/github_banner.png')
                                .replace('github_banner.png', '/github_banner.png');
        setReadmeHtml(marked.parse(cleanedText) as string);
      })
      .catch(() => {
        setReadmeHtml('<p style="color: var(--accent-red)">Could not load README.md. Please run the setup scripts to copy resources to the public folder.</p>');
      });

    // Check banner
    const img = new Image();
    img.src = '/github_banner.png';
    img.onload = () => setBannerStatus('loaded');
    img.onerror = () => setBannerStatus('missing');
  }, []);

  // Typing Effect Loop
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000); // Wait before delete
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex(prev => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  // Luffy Pet Physics & Roaming
  useEffect(() => {
    if (!petEnabled) return;

    const interval = setInterval(() => {
      if (isDragging.current) return;

      // Random state changes
      if (Math.random() < 0.15) {
        const states: Array<'idle' | 'walking' | 'running' | 'jumping' | 'sleeping'> = ['idle', 'walking', 'running', 'jumping', 'sleeping'];
        const newState = states[Math.floor(Math.random() * states.length)];
        setPetState(newState);

        // Speeches based on state
        if (newState === 'sleeping') {
          setPetSpeech('ZZZ... Nika... ZZZ...');
        } else if (newState === 'jumping') {
          setPetSpeech('Gomu Gomu no... Rocket!');
        } else if (newState === 'running') {
          setPetSpeech('Hahaha! The drums of liberation!');
        } else {
          setPetSpeech('Gear 5 Luffy active!');
        }
      }

      // Movement logic
      setPetPos(prev => {
        let { x, y } = prev;
        const speed = petState === 'running' ? 8 : petState === 'walking' ? 3 : 0;
        
        if (petState === 'jumping') {
          y -= 15; // Jumps up
          setTimeout(() => {
            setPetPos(p => ({ ...p, y: Math.min(window.innerHeight - 150, p.y + 15) }));
          }, 300);
        }

        if (speed > 0) {
          if (petDirection === 'left') {
            x -= speed;
            if (x < 20) {
              x = 20;
              setPetDirection('right');
              setPetSpeech('Oops! Bounce!');
            }
          } else {
            x += speed;
            if (x > window.innerWidth - 180) {
              x = window.innerWidth - 180;
              setPetDirection('left');
              setPetSpeech('Turning back!');
            }
          }
        }

        // Keep inside bounds vertically
        y = Math.max(20, Math.min(window.innerHeight - 150, y));

        return { x, y };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [petState, petDirection, petEnabled]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setIsGrabbed(true);
    dragStart.current = {
      x: e.clientX - petPos.x,
      y: e.clientY - petPos.y
    };
    setPetState('jumping');
    setPetSpeech('You grabbed me! Shishishi!');
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
    <div className="flex flex-col min-h-screen">
      {/* Top Banner and Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-900 rounded-lg shadow-[0_0_15px_rgba(56,178,172,0.4)]">
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
          <button 
            onClick={() => setPetEnabled(!petEnabled)} 
            className={`px-2.5 py-1 text-xs rounded-md border transition-all ${petEnabled ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
          >
            Luffy Pet: {petEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative px-8 py-10 overflow-hidden bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Hey, I'm <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Pavan Datta Gedila</span>
            </h2>
            <div className="h-8 font-mono text-cyan-400 text-lg md:text-xl font-medium">
              {typedText}<span className="animate-pulse">|</span>
            </div>
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
      {petEnabled && (
        <div 
          ref={petRef}
          onMouseDown={handleMouseDown}
          style={{ 
            position: 'fixed',
            left: `${petPos.x}px`,
            top: `${petPos.y}px`,
            zIndex: 9999,
            cursor: isDragging.current ? 'grabbing' : 'grab',
            transition: isDragging.current ? 'none' : 'left 0.1s linear, top 0.1s linear'
          }}
          className="flex flex-col items-center select-none"
        >
          {/* Speech bubble */}
          <div className="text-[11px] text-cyan-300 px-3 py-1.5 rounded-xl mb-2.5 max-w-[160px] text-center font-mono animate-bounce speech-bubble-glass">
            {petSpeech}
          </div>

          {/* Luffy Character graphic (3D container) */}
          <div className={`luffy-sprite-container ${petState} ${petDirection}`}>
            {isGrabbed || petState === 'jumping' ? (
              <img src="/luffy_laugh.png" alt="Gear 5 Luffy Laughing" className="w-[80px] h-[80px] object-contain pointer-events-none select-none" />
            ) : petState === 'walking' || petState === 'running' || petState === 'sleeping' ? (
              <img src="/luffy_walk.png" alt="Gear 5 Luffy Walking" className="w-[80px] h-[80px] object-contain pointer-events-none select-none" />
            ) : (
              <img src="/luffy_wave.png" alt="Gear 5 Luffy Waving" className="w-[80px] h-[80px] object-contain pointer-events-none select-none" />
            )}
          </div>

          {/* Label */}
          <span className="text-[9px] font-mono text-slate-400 mt-2 bg-slate-950/90 px-2 py-0.5 rounded-full border border-slate-800 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            Luffy ({petState})
          </span>
        </div>
      )}
    </div>
  );
}
