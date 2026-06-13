import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth, db } from '../firebase';
import { 
  BookOpen, Trophy, Medal, Lock, Unlock, Timer, Globe, Database, Play, 
  Crown, Flame, Target, Star, ChevronRight,
  Bot, Ghost, Gamepad2, Smile, UserRound, UserSquare, Skull, Meh 
} from 'lucide-react';

// --- Character-Themed Avatars ---
const AVATARS = [
  { id: 'bot', icon: Bot, bg: 'bg-indigo-100', text: 'text-indigo-500', border: 'border-indigo-300' },
  { id: 'ghost', icon: Ghost, bg: 'bg-amber-100', text: 'text-amber-500', border: 'border-amber-300' },
  { id: 'gamer', icon: Gamepad2, bg: 'bg-emerald-100', text: 'text-emerald-500', border: 'border-emerald-300' },
  { id: 'smile', icon: Smile, bg: 'bg-rose-100', text: 'text-rose-500', border: 'border-rose-300' },
  { id: 'human', icon: UserRound, bg: 'bg-teal-100', text: 'text-teal-500', border: 'border-teal-300' },
  { id: 'pixel', icon: UserSquare, bg: 'bg-purple-100', text: 'text-purple-500', border: 'border-purple-300' },
  { id: 'skull', icon: Skull, bg: 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-300' },
  { id: 'meh', icon: Meh, bg: 'bg-orange-100', text: 'text-orange-500', border: 'border-orange-300' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/'); 
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          
          const adminEmails = ['maryanngumafelix08@gmail.com']; 
          if (data.role === 'admin' || data.role === 'super_admin' || adminEmails.includes(user.email)) {
             setIsAdmin(true);
          }

          if (data.cooldownUntil && data.cooldownUntil > Date.now()) {
            setCooldownRemaining(Math.floor((data.cooldownUntil - Date.now()) / 1000));
          }
        } else {
          setUserData({ name: "New Player", totalScore: 0, unlockedLevels: 1, levelScores: {} });
        }

        const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const topPlayers = [];
        querySnapshot.forEach((docSnap) => {
          topPlayers.push({ id: docSnap.id, ...docSnap.data() });
        });
        setLeaderboard(topPlayers);
        
      } catch (error) {
        setUserData({ name: "Error", totalScore: 0, unlockedLevels: 1, levelScores: {} });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => setCooldownRemaining(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getStars = (score, maxScorePossible = 500) => {
    if (!score || score === 0) return 0;
    const percentage = score / maxScorePossible;
    if (percentage >= 0.9) return 3;
    if (percentage >= 0.7) return 2;
    return 1;
  };

  const renderAvatar = (avatarId, initials, sizeClass = "w-10 h-10") => {
    const avatar = AVATARS.find(a => a.id === avatarId);
    if (avatar) {
      const Icon = avatar.icon;
      return (
        <div className={`${sizeClass} rounded-2xl flex items-center justify-center border-b-4 border-2 ${avatar.bg} ${avatar.text} ${avatar.border}`}>
          <Icon size={sizeClass.includes('w-10') ? 20 : 32} />
        </div>
      );
    }
    return (
      <div className={`${sizeClass} rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black border-b-4 border-2 border-slate-200`}>
        {initials}
      </div>
    );
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-8 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isLockedOut = cooldownRemaining > 0;
  const userInitials = userData.name ? userData.name.substring(0, 2).toUpperCase() : "U";
  
  const topThree = leaderboard.slice(0, 3);
  const runnersUp = leaderboard.slice(3, 10);

  const handleEnterLevel = (levelNumber) => {
    if (isLockedOut) return;
    navigate('/arena', { state: { targetLevel: levelNumber } });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 text-indigo-900">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-dash" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10 L30 10 L40 20 L40 40" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="10" cy="10" r="3" fill="currentColor"/>
            <circle cx="40" cy="40" r="3" fill="currentColor"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-dash)" />
        </svg>
      </div>

      {/* Floating Gamified Navigation Bar */}
      <nav className="fixed top-4 left-4 right-4 max-w-7xl mx-auto z-50 bg-white/95 backdrop-blur-xl border-4 border-slate-100 px-6 py-4 rounded-[2rem] flex justify-between items-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border-b-4 border-indigo-700 transform -rotate-[5deg]">
            <span className="text-white font-black text-2xl">F</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter hidden lg:block">F.L.I.P.</h1>
          <button 
            onClick={() => navigate('/learning-hub')}
            className="ml-2 sm:ml-6 bg-teal-50 hover:bg-teal-100 text-teal-600 border-2 border-teal-200 font-black py-2.5 px-5 rounded-2xl transition-all flex items-center gap-2 active:scale-95"
          >
            <BookOpen size={18} />
            <span className="hidden sm:inline">Study Hub</span>
          </button>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-2xl border-b-4 border-amber-300">
              <Trophy size={18} className="text-amber-500" />
              <span className="text-amber-700 font-black">{userData.totalScore} XP</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 border-l-4 pl-4 sm:pl-6 border-slate-100">
            {isAdmin && (
              <button 
                onClick={() => navigate('/admin-upload')}
                className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center border-b-4 border-rose-300 hover:bg-rose-500 hover:text-white transition-all active:scale-95 active:border-b-0"
              >
                <Database size={20} />
              </button>
            )}
            <button 
              onClick={() => navigate('/profile')}
              className="transition-transform active:scale-95 hover:-translate-y-1"
            >
              {renderAvatar(userData.avatarId, userInitials, "w-12 h-12")}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <div className="w-full max-w-7xl flex flex-col xl:flex-row gap-8 mt-4 relative z-10">
        
        {/* LEFT COLUMN: Mission Stages */}
        <div className="w-full xl:w-7/12 flex flex-col gap-6">
          
          <div className="bg-white border-4 border-slate-100 rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome, {userData.name.split(' ')[0]}!</h2>
              <p className="text-slate-500 font-bold mt-1 flex items-center gap-2">
                <Target size={18} className="text-indigo-400" /> Current Title: 
                <span className="text-indigo-500 font-black uppercase tracking-widest">
                  {userData.unlockedLevels >= 3 ? 'Master Architect' : userData.unlockedLevels === 2 ? 'Journeyman' : 'Apprentice'}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4 bg-orange-50 px-6 py-4 rounded-2xl border-4 border-orange-100 transform rotate-2">
              <Flame size={32} className="text-orange-500 fill-orange-500" />
              <div>
                <span className="block text-xs font-black uppercase tracking-widest text-orange-400">Total Logic XP</span>
                <span className="text-2xl font-black text-orange-600">{userData.totalScore}</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 mt-4">
            <Play size={28} className="text-teal-400 fill-teal-400" /> Mission Stages
          </h2>
          
          {/* Level 1 - Emerald */}
          <div className={`rounded-[2.5rem] p-6 sm:p-8 border-4 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 ${
            isLockedOut ? 'bg-rose-50/50 border-rose-100 opacity-80' : 'bg-white border-emerald-100 hover:border-emerald-400 shadow-sm hover:shadow-xl hover:-translate-y-1'
          }`}>
            <div className={`w-28 h-28 rounded-3xl flex items-center justify-center flex-shrink-0 border-b-8 ${isLockedOut ? 'bg-rose-100 border-rose-200 text-rose-400' : 'bg-emerald-100 border-emerald-300 text-emerald-500'}`}>
              {isLockedOut ? <Timer size={48} /> : <Unlock size={48} />}
            </div>
            <div className="flex-grow text-center sm:text-left w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">Level 1</span>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={16} className={i < getStars(userData.levelScores?.[1]) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800">Apprentice Gates</h3>
              <p className="text-slate-500 font-bold mt-1">Master basic AND, OR, NOT logic gates.</p>
              {userData.levelScores?.[1] > 0 && (
                <p className="text-amber-500 font-black text-sm mt-3 flex items-center justify-center sm:justify-start gap-1">
                  <Trophy size={16} /> High Score: {userData.levelScores[1]}
                </p>
              )}
            </div>
            <button
              onClick={() => handleEnterLevel(1)}
              disabled={isLockedOut}
              className={`w-full sm:w-auto font-black text-lg py-5 px-10 rounded-2xl transition-all flex-shrink-0 border-b-8 active:border-b-0 active:translate-y-2 ${
                isLockedOut ? 'bg-rose-400 text-white border-rose-600 cursor-not-allowed' : 'bg-emerald-400 hover:bg-emerald-500 text-white border-emerald-600'
              }`}>
              {isLockedOut ? `Wait ${formatTime(cooldownRemaining)}` : (userData.levelScores?.[1] > 0 ? 'Retry' : 'Play Now')}
            </button>
          </div>

          {/* Level 2 - Indigo */}
          <div className={`rounded-[2.5rem] p-6 sm:p-8 border-4 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 ${
            userData.unlockedLevels >= 2 ? 'bg-white border-indigo-100 hover:border-indigo-400 shadow-sm hover:shadow-xl hover:-translate-y-1' : 'bg-slate-100 border-slate-200 opacity-75 grayscale-[0.5]'
          }`}>
            <div className={`w-28 h-28 rounded-3xl flex items-center justify-center flex-shrink-0 border-b-8 ${userData.unlockedLevels >= 2 ? 'bg-indigo-100 border-indigo-300 text-indigo-500' : 'bg-slate-200 border-slate-300 text-slate-400'}`}>
              {userData.unlockedLevels >= 2 ? <Unlock size={48} /> : <Lock size={48} />}
            </div>
            <div className="flex-grow text-center sm:text-left w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">Level 2</span>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={16} className={i < getStars(userData.levelScores?.[2]) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800">Circuit Maker</h3>
              <p className="text-slate-500 font-bold mt-1">Combine gates into larger combinational circuits.</p>
              {userData.levelScores?.[2] > 0 && (
                <p className="text-amber-500 font-black text-sm mt-3 flex items-center justify-center sm:justify-start gap-1">
                  <Trophy size={16} /> High Score: {userData.levelScores[2]}
                </p>
              )}
            </div>
            {userData.unlockedLevels >= 2 ? (
              <button 
                onClick={() => handleEnterLevel(2)}
                disabled={isLockedOut}
                className={`w-full sm:w-auto font-black text-lg py-5 px-10 rounded-2xl transition-all flex-shrink-0 border-b-8 active:border-b-0 active:translate-y-2 ${
                  isLockedOut ? 'bg-rose-400 text-white border-rose-600 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-700'
                }`}>
                {isLockedOut ? `Wait ${formatTime(cooldownRemaining)}` : (userData.levelScores?.[2] > 0 ? 'Retry' : 'Play Now')}
              </button>
            ) : (
              <div className="w-full sm:w-auto text-center font-black text-slate-400 bg-slate-200 py-5 px-10 rounded-2xl border-b-8 border-slate-300">
                Locked
              </div>
            )}
          </div>

          {/* Level 3 - Purple */}
          <div className={`rounded-[2.5rem] p-6 sm:p-8 border-4 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 ${
            userData.unlockedLevels >= 3 ? 'bg-white border-purple-100 hover:border-purple-400 shadow-sm hover:shadow-xl hover:-translate-y-1' : 'bg-slate-100 border-slate-200 opacity-75 grayscale-[0.5]'
          }`}>
            <div className={`w-28 h-28 rounded-3xl flex items-center justify-center flex-shrink-0 border-b-8 ${userData.unlockedLevels >= 3 ? 'bg-purple-100 border-purple-300 text-purple-500' : 'bg-slate-200 border-slate-300 text-slate-400'}`}>
              {userData.unlockedLevels >= 3 ? <Unlock size={48} /> : <Lock size={48} />}
            </div>
            <div className="flex-grow text-center sm:text-left w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">Level 3</span>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={16} className={i < getStars(userData.levelScores?.[3], 1000) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800">Logic Master</h3>
              <p className="text-slate-500 font-bold mt-1">Simplify logic with De Morgan's laws and algebra.</p>
              {userData.levelScores?.[3] > 0 && (
                <p className="text-amber-500 font-black text-sm mt-3 flex items-center justify-center sm:justify-start gap-1">
                  <Trophy size={16} /> High Score: {userData.levelScores[3]}
                </p>
              )}
            </div>
            {userData.unlockedLevels >= 3 ? (
              <button 
                onClick={() => handleEnterLevel(3)}
                disabled={isLockedOut}
                className={`w-full sm:w-auto font-black text-lg py-5 px-10 rounded-2xl transition-all flex-shrink-0 border-b-8 active:border-b-0 active:translate-y-2 ${
                  isLockedOut ? 'bg-rose-400 text-white border-rose-600 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 text-white border-purple-700'
                }`}>
                {isLockedOut ? `Wait ${formatTime(cooldownRemaining)}` : (userData.levelScores?.[3] > 0 ? 'Retry' : 'Play Now')}
              </button>
            ) : (
              <div className="w-full sm:w-auto text-center font-black text-slate-400 bg-slate-200 py-5 px-10 rounded-2xl border-b-8 border-slate-300">
                Locked
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: The Podium Leaderboard */}
        <div className="w-full xl:w-5/12 flex flex-col">
          <div className="bg-white rounded-[3rem] shadow-xl border-4 border-slate-100 overflow-hidden flex flex-col flex-grow h-full">
            
            <div className="bg-slate-800 p-6 text-center flex flex-col items-center justify-center gap-2 border-b-4 border-slate-900">
              <Globe size={28} className="text-teal-400" />
              <h3 className="text-white font-black text-xl tracking-wide uppercase">Top 10 Global</h3>
            </div>
            
            <div className="p-6 bg-slate-50 flex flex-col flex-grow">
              {leaderboard.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 flex-grow">
                  <Trophy size={48} className="mb-4 opacity-20" />
                  <p className="font-bold text-center">No scores on the grid yet.</p>
                </div>
              ) : (
                <div className="flex flex-col flex-grow">
                  
                  {/* The Podium Top 3 */}
                  {topThree.length > 0 && (
                    <div className="flex items-end justify-center gap-2 sm:gap-4 h-56 mb-6">
                      {/* 2nd Place (Silver) */}
                      {topThree[1] && (
                        <div className="w-1/3 flex flex-col items-center group cursor-default">
                          <div className="mb-2 transition-transform group-hover:-translate-y-1">
                            {renderAvatar(topThree[1].avatarId, topThree[1].name.substring(0,2).toUpperCase(), "w-12 h-12")}
                          </div>
                          <div className="text-center mb-2 px-1">
                            <span className="block font-black text-sm text-slate-700 truncate w-full max-w-[80px]">{topThree[1].name.split(' ')[0]}</span>
                            <span className="block font-black text-xs text-slate-500">{topThree[1].totalScore} XP</span>
                          </div>
                          <div className="w-full h-20 bg-slate-300 border-4 border-b-8 border-slate-400 rounded-t-2xl flex flex-col items-center justify-center relative shadow-inner">
                             <span className="font-black text-xl text-slate-600">2</span>
                          </div>
                        </div>
                      )}

                      {/* 1st Place (Gold) */}
                      {topThree[0] && (
                        <div className="w-1/3 flex flex-col items-center group cursor-default relative z-10">
                          <Crown size={28} className="text-amber-400 fill-amber-400 mb-1 animate-bounce-short" />
                          <div className="mb-2 transition-transform group-hover:-translate-y-1">
                            {renderAvatar(topThree[0].avatarId, topThree[0].name.substring(0,2).toUpperCase(), "w-16 h-16")}
                          </div>
                          <div className="text-center mb-2 px-1">
                            <span className="block font-black text-base text-amber-700 truncate w-full max-w-[90px]">{topThree[0].name.split(' ')[0]}</span>
                            <span className="block font-black text-sm text-amber-600">{topThree[0].totalScore} XP</span>
                          </div>
                          <div className="w-full h-28 bg-amber-400 border-4 border-b-8 border-amber-600 rounded-t-2xl flex flex-col items-center justify-center relative shadow-inner">
                             <span className="font-black text-3xl text-amber-800">1</span>
                          </div>
                        </div>
                      )}

                      {/* 3rd Place (Bronze) */}
                      {topThree[2] && (
                        <div className="w-1/3 flex flex-col items-center group cursor-default">
                          <div className="mb-2 transition-transform group-hover:-translate-y-1">
                            {renderAvatar(topThree[2].avatarId, topThree[2].name.substring(0,2).toUpperCase(), "w-12 h-12")}
                          </div>
                          <div className="text-center mb-2 px-1">
                            <span className="block font-black text-sm text-orange-800 truncate w-full max-w-[80px]">{topThree[2].name.split(' ')[0]}</span>
                            <span className="block font-black text-xs text-orange-600">{topThree[2].totalScore} XP</span>
                          </div>
                          <div className="w-full h-16 bg-orange-300 border-4 border-b-8 border-orange-500 rounded-t-2xl flex flex-col items-center justify-center relative shadow-inner">
                            <span className="font-black text-lg text-orange-800">3</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* The Rest of the Top 10 */}
                  {runnersUp.length > 0 && (
                    <div className="bg-white border-4 border-slate-100 rounded-3xl p-3 flex flex-col gap-2 shadow-sm mb-4">
                      {runnersUp.map((user, index) => {
                        const rank = index + 4; 
                        const isCurrentUser = user.id === auth.currentUser?.uid;
                        
                        return (
                          <div key={user.id} className={`flex items-center justify-between p-2 rounded-2xl border-2 transition-colors ${isCurrentUser ? 'bg-indigo-50 border-indigo-200' : 'bg-transparent border-transparent hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-slate-400 w-5 text-center">{rank}</span>
                              {renderAvatar(user.avatarId, user.name.substring(0,2).toUpperCase(), "w-8 h-8")}
                              <span className={`font-black truncate w-24 sm:w-32 ${isCurrentUser ? 'text-indigo-700' : 'text-slate-700'}`}>
                                {user.name.split(' ')[0]}
                              </span>
                            </div>
                            <span className={`font-black text-sm ${isCurrentUser ? 'text-indigo-500' : 'text-slate-500'}`}>
                              {user.totalScore} XP
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Full Rankings Button */}
                  <button 
                    onClick={() => navigate('/leaderboard')}
                    className="w-full mt-auto bg-indigo-100 hover:bg-indigo-200 text-indigo-600 font-black text-lg py-4 rounded-2xl transition-all border-b-4 border-indigo-300 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
                  >
                    View Full Rankings <ChevronRight size={20} />
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;