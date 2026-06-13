import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, HeartCrack, Unlock, RotateCcw, Home, Play } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const finalScore = location.state?.finalScore || 0;
  const passed = location.state?.passed || false;
  const levelPlayed = location.state?.levelPlayed || 1; 
  const isAlreadyUnlocked = location.state?.isAlreadyUnlocked || false;
  
  const nextLevel = Math.min(3, levelPlayed + 1);

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Background Glow based on Pass/Fail */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] rounded-full opacity-30 pointer-events-none ${passed ? 'bg-emerald-400' : 'bg-rose-500'}`}></div>

      {/* The Main Bento Result Card */}
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col items-center p-10 md:p-14 relative z-10 text-center border-8 border-slate-100">
        
        {/* Dynamic Graphic */}
        <div className="mb-6 relative">
          {passed ? (
            <div className="animate-bounce bg-emerald-100 border-8 border-white shadow-[0_10px_20px_rgba(52,211,153,0.3)] p-8 rounded-[2.5rem] text-emerald-400 rotate-6">
              <Trophy size={80} />
            </div>
          ) : (
            <div className="bg-rose-100 border-8 border-white shadow-[0_10px_20px_rgba(244,63,94,0.3)] p-8 rounded-[2.5rem] text-rose-500 -rotate-6">
              <HeartCrack size={80} className="animate-pulse" />
            </div>
          )}
        </div>

        {/* Status Text */}
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight mb-3 ${passed ? 'text-emerald-500' : 'text-rose-500'}`}>
          {passed ? 'LEVEL CLEARED!' : 'FAILED TO PASS'}
        </h1>
        <p className="text-slate-400 font-bold text-lg mb-8 px-4">
          {passed 
            ? (levelPlayed < 3 
                ? (isAlreadyUnlocked ? `Great practice round!` : `Outstanding logic skills. You unlocked Level ${nextLevel}!`) 
                : 'Incredible! You have completed the highest level.') 
            : 'Not quite enough points to pass. Dust yourself off and try again.'}
        </p>

        {/* Thick Score Box */}
        <div className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 shadow-inner">
          <div className="text-center sm:text-left">
            <span className="block text-slate-400 font-black uppercase tracking-widest text-xs mb-1">Final Score</span>
            <span className="text-4xl font-black text-indigo-500 flex items-center justify-center sm:justify-start gap-2">
               <Trophy size={28} className="text-amber-400" /> {finalScore}
            </span>
          </div>
          <div className="h-12 w-1 bg-slate-200 hidden sm:block rounded-full"></div>
          <div className="text-center sm:text-right">
            <span className="block text-slate-400 font-black uppercase tracking-widest text-xs mb-1">Status</span>
            <span className={`text-2xl font-black px-4 py-1 rounded-xl ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              {passed ? 'QUALIFIED' : 'FAILED'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          {passed ? (
            levelPlayed < 3 ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-black text-xl py-5 rounded-2xl border-b-8 border-emerald-600 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
              >
                {isAlreadyUnlocked ? `Continue to Level ${nextLevel}` : `Unlock Level ${nextLevel}`} 
                {isAlreadyUnlocked ? <Play size={24} className="fill-white" /> : <Unlock size={24} />}
              </button>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-amber-400 hover:bg-amber-500 text-white font-black text-xl py-5 rounded-2xl border-b-8 border-amber-600 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
              >
                Game Completed! <Trophy size={24} className="fill-white" />
              </button>
            )
          ) : (
            <button 
              onClick={() => navigate('/arena', { state: { targetLevel: levelPlayed } })}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xl py-5 rounded-2xl border-b-8 border-indigo-700 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
            >
              Retry Level {levelPlayed} <RotateCcw size={24} />
            </button>
          )}
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-white border-4 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-500 font-black text-lg py-4 rounded-2xl border-b-8 active:border-b-4 active:translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <Home size={20} /> Return to Hub
          </button>
        </div>

      </div>
    </div>
  );
};

export default Results;