import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Cpu, Zap, Trophy, BrainCircuit, Sparkles, BookOpen, ChevronRight, User, Terminal } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative overflow-hidden">
      
      {/* Decorative Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <Cpu size={100} className="absolute top-20 left-[10%] text-indigo-200/40 -rotate-12 animate-float" style={{ animationDuration: '6s' }} />
        <Sparkles size={80} className="absolute top-40 right-[15%] text-teal-200/40 rotate-12 animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <BrainCircuit size={120} className="absolute bottom-20 left-[15%] text-rose-200/40 rotate-6 animate-float" style={{ animationDuration: '7s', animationDelay: '2s' }} />
        <Zap size={90} className="absolute bottom-32 right-[10%] text-amber-200/40 -rotate-12 animate-float" style={{ animationDuration: '5.5s', animationDelay: '0.5s' }} />
        
        {/* Subtle Circuit Grid */}
        <div className="absolute inset-0 opacity-[0.03] text-indigo-900">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-landing" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10 L30 10 L40 20 L40 40" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="10" cy="10" r="3" fill="currentColor"/>
                <circle cx="40" cy="40" r="3" fill="currentColor"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-landing)" />
          </svg>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center flex-grow">
        
        {/* Navbar */}
        <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-indigo-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border-b-4 border-indigo-700 transform -rotate-[5deg] group-hover:rotate-0 transition-transform duration-300">
              <span className="text-white font-black text-2xl">F</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter">F.L.I.P.</h1>
          </div>
          <button 
            onClick={() => navigate('/auth')}
            className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black px-6 py-3 rounded-2xl border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 transition-all"
          >
            Log In <ChevronRight size={18} />
          </button>
        </nav>

        {/* Hero Section */}
        <div className="w-full max-w-5xl mx-auto px-6 mt-12 md:mt-20 flex flex-col items-center text-center">
          <div className="inline-block bg-teal-100 border-4 border-teal-200 text-teal-700 font-black px-6 py-2 rounded-2xl uppercase tracking-widest text-sm mb-8 shadow-sm transform -rotate-2 hover:rotate-2 transition-transform cursor-default">
            Fun Logic Interactive Platform
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-800 tracking-tight leading-tight mb-6 drop-shadow-sm">
            Master Digital Logic.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-400">Level Up Your Brain.</span>
          </h2>
          
          <p className="text-lg md:text-2xl text-slate-500 font-bold max-w-2xl mb-12 leading-relaxed">
            Dive into the ultimate interactive study hub and competitive arena. Learn logic gates, conquer Karnaugh maps, and climb the global leaderboard.
          </p>

          {/* Primary CTA (Bouncy Game Console Style) */}
          <div className="flex flex-col items-center gap-4 animate-bounce-short">
            <button 
              onClick={() => navigate('/auth')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-black text-2xl md:text-3xl py-6 px-12 rounded-[2rem] border-b-[10px] border-indigo-700 active:border-b-0 active:translate-y-[10px] transition-all flex items-center justify-center gap-4 shadow-[0_15px_30px_rgba(99,102,241,0.3)] group"
            >
              <Play size={32} className="fill-white group-hover:scale-110 transition-transform" />
              PRESS START
            </button>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              Log in or Sign up to play
            </p>
          </div>
        </div>

        {/* Gamified Feature Cards */}
        <div className="w-full max-w-6xl mx-auto px-6 mt-24 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-white border-4 border-emerald-100 rounded-[3rem] p-8 shadow-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center border-b-8 border-emerald-200 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">Interactive Study Hub</h3>
            <p className="text-slate-500 font-bold">
              Toggle physical switches, interact with live circuits, and visualize Boolean algebra through dynamic, animated modules.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border-4 border-rose-100 rounded-[3rem] p-8 shadow-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-3xl flex items-center justify-center border-b-8 border-rose-200 mb-6 group-hover:scale-110 transition-transform">
              <Zap size={40} className="fill-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">Timed Quiz Arena</h3>
            <p className="text-slate-500 font-bold">
              Put your knowledge to the test. Survive the timer, answer correctly to maintain your lives, and unlock harder stages.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border-4 border-amber-100 rounded-[3rem] p-8 shadow-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-3xl flex items-center justify-center border-b-8 border-amber-200 mb-6 group-hover:scale-110 transition-transform">
              <Trophy size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">Global Leaderboard</h3>
            <p className="text-slate-500 font-bold">
              Earn XP for every perfect logic loop. Compare your rank against other players and reach the prestigious "Master" rank.
            </p>
          </div>
        </div>

        {/* NEW ABOUT SECTION */}
        <div className="w-full max-w-6xl mx-auto px-6 mb-24">
          <div className="bg-slate-800 rounded-[3.5rem] p-10 md:p-16 border-8 border-slate-900 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group">

            {/* Subtle Background Icon */}
            <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none transform group-hover:rotate-12 transition-transform duration-700">
              <Terminal size={400} className="text-white" />
            </div>

            {/* Left: Avatar/Icon */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-indigo-500 rounded-[2.5rem] border-8 border-indigo-400 flex items-center justify-center transform -rotate-6 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:rotate-0 transition-transform duration-300">
                 <User size={80} className="text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-amber-400 text-amber-950 font-black px-4 py-2 rounded-xl border-4 border-amber-500 shadow-md rotate-3">
                CREATOR
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="relative z-10 text-center md:text-left flex-grow">
              <h3 className="text-amber-400 font-black tracking-widest uppercase text-sm mb-2">About The Project</h3>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Built by a Student, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">For the Students.</span>
              </h2>
              <p className="text-slate-300 font-bold text-lg mb-8 leading-relaxed max-w-2xl">
                F.L.I.P. was engineered by Mary Ann, Samantha Heart, Ashanti Louise, and Ann Margarette, a 4th-year Computer Engineering students at the Polytechnic University of the Philippines. 
                Born out of complex circuit designs and late-night study sessions, this platform was created to transform intimidating digital logic concepts into an interactive, gamified experience.
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="bg-slate-700 text-slate-300 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl border-2 border-slate-600">Computer Engineering</span>
                <span className="bg-slate-700 text-slate-300 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl border-2 border-slate-600">PUP</span>
                <span className="bg-slate-700 text-slate-300 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl border-2 border-slate-600">Logic Design</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;