import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Calculator, Binary, Cpu, Grid3X3, PlusSquare, GitBranch, Scale, Menu, X, Layers, Clock, ToggleLeft, BookOpen, ArrowRightLeft } from 'lucide-react';

import { 
  BitBoard, LogicGates, KarnaughMap, HalfAdder, FullAdder, 
  Multiplexer, Comparator, Decoder, SRLatch, DFlipFlop, 
  DeMorgan, Encoder, JKFlipFlop, HalfSubtractor, 
  Demultiplexer, TFlipFlop 
} from '../components/LearningModules';

const LearningHub = () => {
  const navigate = useNavigate();

  const [activeModule, setActiveModule] = useState('numberSystems'); 
  const [hardwareMode, setHardwareMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleModuleChange = (module) => {
    setActiveModule(module);
    setMobileMenuOpen(false);
  };

  const renderModule = () => {
    switch(activeModule) {
      case 'numberSystems':   return <BitBoard hardwareMode={hardwareMode} />;
      case 'demorgan':        return <DeMorgan hardwareMode={hardwareMode} />;
      case 'logicGates':      return <LogicGates hardwareMode={hardwareMode} />;
      case 'kmap':            return <KarnaughMap hardwareMode={hardwareMode} />;
      case 'halfAdder':       return <HalfAdder hardwareMode={hardwareMode} />;
      case 'halfSubtractor':  return <HalfSubtractor hardwareMode={hardwareMode} />;
      case 'fullAdder':       return <FullAdder hardwareMode={hardwareMode} />;
      case 'multiplexer':     return <Multiplexer hardwareMode={hardwareMode} />;
      case 'demultiplexer':   return <Demultiplexer hardwareMode={hardwareMode} />;
      case 'decoder':         return <Decoder hardwareMode={hardwareMode} />;
      case 'encoder':         return <Encoder hardwareMode={hardwareMode} />;
      case 'comparator':      return <Comparator hardwareMode={hardwareMode} />;
      case 'srLatch':         return <SRLatch hardwareMode={hardwareMode} />;
      case 'dFlipFlop':       return <DFlipFlop hardwareMode={hardwareMode} />;
      case 'jkFlipFlop':      return <JKFlipFlop hardwareMode={hardwareMode} />;
      case 'tFlipFlop':       return <TFlipFlop hardwareMode={hardwareMode} />;
      default:                return <BitBoard hardwareMode={hardwareMode} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-500 relative overflow-hidden ${hardwareMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* Decorative Circuit Background */}
      <div className={`absolute inset-0 pointer-events-none z-0 opacity-[0.05] ${hardwareMode ? 'text-amber-500' : 'text-indigo-900'}`}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern-learn" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10 L30 10 L40 20 L40 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="10" r="4" fill="currentColor"/>
              <circle cx="40" cy="40" r="4" fill="currentColor"/>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern-learn)" />
        </svg>
      </div>

      {/* Floating Gamified Navigation Bar */}
      <nav className={`fixed top-4 left-4 right-4 z-50 transition-colors duration-500 backdrop-blur-xl border-4 px-6 py-4 rounded-[2rem] flex justify-between items-center shadow-md ${hardwareMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-100'}`}>
        <div className="flex items-center gap-4">
          <button 
            className={`md:hidden p-2 rounded-xl border-4 active:translate-y-1 transition-all ${hardwareMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} className="font-black" /> : <Menu size={24} className="font-black" />}
          </button>
          <div className="bg-indigo-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border-b-4 border-indigo-700 transform -rotate-[5deg]">
            <span className="text-white font-black text-2xl">F</span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight hidden sm:block ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>Study Hub</h1>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className={`flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 rounded-[1.5rem] border-4 transition-colors duration-500 ${hardwareMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
            <span className={`hidden sm:flex items-center gap-2 text-sm font-black uppercase tracking-wider ${!hardwareMode ? 'text-indigo-500' : 'text-slate-600'}`}>
              <Calculator size={18} /> Math
            </span>
            <button 
              onClick={() => setHardwareMode(!hardwareMode)}
              className={`w-14 sm:w-16 h-8 sm:h-10 rounded-full p-1.5 transition-colors duration-300 relative focus:outline-none shadow-inner border-2 ${hardwareMode ? 'bg-amber-500 border-amber-600' : 'bg-indigo-500 border-indigo-600'}`}
            >
              <div className={`w-5 sm:w-7 h-5 sm:h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${hardwareMode ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`hidden sm:flex items-center gap-2 text-sm font-black uppercase tracking-wider ${hardwareMode ? 'text-amber-500' : 'text-slate-400'}`}>
              <Settings size={18} /> Hardware
            </span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className={`font-black py-3 px-4 sm:px-6 rounded-2xl transition-all flex items-center gap-3 border-4 border-b-8 active:border-b-4 active:translate-y-1 ${hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-300 hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'}`}
          >
            <LogOut size={20} /> <span className="hidden sm:inline text-lg">Exit</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed inset-0 top-[100px] z-40 overflow-y-auto p-6 transition-colors duration-500 flex flex-col gap-2 ${hardwareMode ? 'bg-slate-900/95 backdrop-blur-md' : 'bg-slate-50/95 backdrop-blur-md'}`}>
          <div className="pb-20 space-y-4">
             <button onClick={() => handleModuleChange('numberSystems')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Bit Board</button>
             <button onClick={() => handleModuleChange('demorgan')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">De Morgan's Theorem</button>
             <button onClick={() => handleModuleChange('logicGates')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Logic Gates</button>
             <button onClick={() => handleModuleChange('kmap')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Karnaugh Maps</button>
             <button onClick={() => handleModuleChange('halfAdder')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Half Adder</button>
             <button onClick={() => handleModuleChange('halfSubtractor')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Half Subtractor</button>
             <button onClick={() => handleModuleChange('fullAdder')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Full Adder</button>
             <button onClick={() => handleModuleChange('multiplexer')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Multiplexer</button>
             <button onClick={() => handleModuleChange('demultiplexer')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Demultiplexer</button>
             <button onClick={() => handleModuleChange('decoder')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Decoder</button>
             <button onClick={() => handleModuleChange('encoder')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Encoder</button>
             <button onClick={() => handleModuleChange('comparator')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">Comparator</button>
             <button onClick={() => handleModuleChange('srLatch')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">SR Latch</button>
             <button onClick={() => handleModuleChange('dFlipFlop')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">D Flip-Flop</button>
             <button onClick={() => handleModuleChange('jkFlipFlop')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">JK Flip-Flop</button>
             <button onClick={() => handleModuleChange('tFlipFlop')} className="w-full p-4 rounded-2xl border-4 font-black bg-white">T Flip-Flop</button>
          </div>
        </div>
      )}

      <div className="flex flex-grow pt-28 overflow-hidden relative z-10 w-full max-w-[1400px] mx-auto">
        
        {/* Desktop Sidebar Menu */}
        <div className="w-1/4 p-6 hidden md:flex flex-col gap-8 overflow-y-auto pb-20 scrollbar-hide">
          
          <div>
            <h3 className={`text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${hardwareMode ? 'text-slate-600' : 'text-slate-400'}`}><Binary size={18}/> Fundamentals</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => setActiveModule('numberSystems')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'numberSystems' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                The Bit Board
              </button>
              <button onClick={() => setActiveModule('demorgan')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'demorgan' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><BookOpen size={20}/> De Morgan's</div>
              </button>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${hardwareMode ? 'text-slate-600' : 'text-slate-400'}`}><Cpu size={18}/> Logic Gates</h3>
            <button onClick={() => setActiveModule('logicGates')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'logicGates' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
              Gate Explorer
            </button>
          </div>

          <div>
            <h3 className={`text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${hardwareMode ? 'text-slate-600' : 'text-slate-400'}`}><Grid3X3 size={18}/> Simplification</h3>
            <button onClick={() => setActiveModule('kmap')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'kmap' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
              Karnaugh Maps
            </button>
          </div>

          <div>
            <h3 className={`text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${hardwareMode ? 'text-slate-600' : 'text-slate-400'}`}><GitBranch size={18}/> Combinational</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => setActiveModule('halfAdder')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'halfAdder' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><PlusSquare size={20}/> Half Adder</div>
              </button>
              <button onClick={() => setActiveModule('halfSubtractor')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'halfSubtractor' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><PlusSquare size={20}/> Half Subtractor</div>
              </button>
              <button onClick={() => setActiveModule('fullAdder')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'fullAdder' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><PlusSquare size={20}/> Full Adder</div>
              </button>
              <button onClick={() => setActiveModule('multiplexer')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'multiplexer' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><GitBranch size={20}/> Multiplexer</div>
              </button>
              <button onClick={() => setActiveModule('demultiplexer')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'demultiplexer' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><ArrowRightLeft size={20}/> Demultiplexer</div>
              </button>
              <button onClick={() => setActiveModule('decoder')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'decoder' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><Layers size={20}/> Decoder</div>
              </button>
              <button onClick={() => setActiveModule('encoder')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'encoder' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><Layers size={20}/> Encoder</div>
              </button>
              <button onClick={() => setActiveModule('comparator')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'comparator' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><Scale size={20}/> Comparator</div>
              </button>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${hardwareMode ? 'text-slate-600' : 'text-slate-400'}`}><Clock size={18}/> Sequential Logic</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => setActiveModule('srLatch')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'srLatch' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><ToggleLeft size={20}/> SR Latch</div>
              </button>
              <button onClick={() => setActiveModule('dFlipFlop')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'dFlipFlop' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><Clock size={20}/> D Flip-Flop</div>
              </button>
              <button onClick={() => setActiveModule('jkFlipFlop')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'jkFlipFlop' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><Clock size={20}/> JK Flip-Flop</div>
              </button>
              <button onClick={() => setActiveModule('tFlipFlop')} className={`w-full p-4 rounded-2xl text-left font-black text-lg transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${activeModule === 'tFlipFlop' ? (hardwareMode ? 'bg-slate-800 border-amber-500 text-amber-400' : 'bg-indigo-50 border-indigo-400 text-indigo-600') : (hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                <div className="flex items-center gap-3"><Clock size={20}/> T Flip-Flop</div>
              </button>
            </div>
          </div>
          
        </div>

        {/* Dynamic Rendering Area */}
        <div className="flex-grow p-4 sm:p-8 flex flex-col items-center overflow-y-auto scrollbar-hide">
          {renderModule()}
        </div>

      </div>
    </div>
  );
};

export default LearningHub;