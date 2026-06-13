import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  ArrowLeft, Trophy, Search, Filter, User, Hash, Activity,
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

const Leaderboard = () => {
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); 

  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("totalScore", "desc"));
        const querySnapshot = await getDocs(q);
        const playerList = [];
        querySnapshot.forEach((docSnap) => {
          playerList.push({ id: docSnap.id, ...docSnap.data() });
        });
        setPlayers(playerList);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
        setLoading(false);
      }
    };
    fetchAllPlayers();
  }, []);

  const renderAvatar = (avatarId, initials) => {
    const avatar = AVATARS.find(a => a.id === avatarId);
    if (avatar) {
      const Icon = avatar.icon;
      return (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-b-4 border-2 ${avatar.bg} ${avatar.text} ${avatar.border}`}>
          <Icon size={24} />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black border-b-4 border-2 border-slate-200">
        {initials}
      </div>
    );
  };

  // Filter & Sort Logic
  const getFilteredPlayers = () => {
    let filtered = [...players];

    if (searchTerm) {
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (activeFilter === 'Lvl 1') {
      filtered = filtered.sort((a, b) => (b.levelScores?.[1] || 0) - (a.levelScores?.[1] || 0));
    } else if (activeFilter === 'Lvl 2') {
      filtered = filtered.sort((a, b) => (b.levelScores?.[2] || 0) - (a.levelScores?.[2] || 0));
    } else if (activeFilter === 'Lvl 3') {
      filtered = filtered.sort((a, b) => (b.levelScores?.[3] || 0) - (a.levelScores?.[3] || 0));
    } else {
      filtered = filtered.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    }

    if (activeFilter !== 'All') {
      const level = activeFilter.split(' ')[1];
      filtered = filtered.filter(p => (p.levelScores?.[level] || 0) > 0);
    }

    return filtered;
  };

  const displayedPlayers = getFilteredPlayers();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-8 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative overflow-hidden pb-12">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 text-indigo-900">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-leader" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10 L30 10 L40 20 L40 40" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="10" cy="10" r="3" fill="currentColor"/>
            <circle cx="40" cy="40" r="3" fill="currentColor"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-leader)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 pt-12 relative z-10 flex-grow flex flex-col">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-slate-500 font-black hover:text-indigo-600 flex items-center gap-2 group bg-white px-5 py-3 rounded-2xl border-4 border-slate-100 shadow-sm transition-all active:translate-y-1 active:border-b-0 border-b-8"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
          </button>
          <div className="bg-indigo-500 px-6 py-3 rounded-2xl flex items-center justify-center shadow-inner border-b-4 border-indigo-700 transform rotate-2">
            <span className="text-white font-black text-xl flex items-center gap-2"><Trophy size={20}/> Global Ranks</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-[2.5rem] shadow-lg border-4 border-slate-100 p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search players by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-4 border-slate-100 focus:border-indigo-400 focus:bg-indigo-50 outline-none font-bold text-lg text-slate-700 transition-all placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl border-2 border-slate-200">
              <Filter size={18} className="text-slate-400 ml-2" />
              {['All', 'Lvl 1', 'Lvl 2', 'Lvl 3'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl font-black text-sm whitespace-nowrap transition-all ${
                    activeFilter === filter 
                      ? 'bg-white text-indigo-600 shadow-sm border-2 border-indigo-200' 
                      : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700 border-2 border-transparent'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Data Table */}
        <div className="bg-white rounded-[3rem] shadow-xl border-4 border-slate-100 overflow-hidden">
          
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-800 p-6 border-b-4 border-slate-900 text-white font-black text-sm uppercase tracking-widest">
            <div className="col-span-1 flex justify-center"><Hash size={18} /></div>
            <div className="col-span-5 flex items-center gap-2"><User size={18} /> Player Profile</div>
            <div className="col-span-3 flex items-center justify-center gap-2"><Activity size={18} /> Mastery</div>
            <div className="col-span-3 flex items-center justify-end pr-4"><Trophy size={18} className="text-amber-400"/> {activeFilter === 'All' ? 'Total XP' : `${activeFilter} Score`}</div>
          </div>

          {/* Player Rows */}
          <div className="flex flex-col p-4 bg-slate-50">
            {displayedPlayers.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-xl text-slate-500">No players found matching your criteria.</p>
              </div>
            ) : (
              displayedPlayers.map((player, index) => {
                const rank = index + 1;
                const isCurrentUser = player.id === auth.currentUser?.uid;
                const initials = player.name ? player.name.substring(0,2).toUpperCase() : "U";
                
                let displayScore = player.totalScore || 0;
                if (activeFilter === 'Lvl 1') displayScore = player.levelScores?.[1] || 0;
                if (activeFilter === 'Lvl 2') displayScore = player.levelScores?.[2] || 0;
                if (activeFilter === 'Lvl 3') displayScore = player.levelScores?.[3] || 0;

                return (
                  <div 
                    key={player.id} 
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 mb-3 rounded-2xl border-4 transition-transform hover:-translate-y-1 ${
                      isCurrentUser 
                        ? 'bg-amber-50 border-amber-200 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex md:justify-center items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-b-4 ${
                        rank === 1 ? 'bg-amber-400 text-white border-amber-600 shadow-md' : 
                        rank === 2 ? 'bg-slate-300 text-white border-slate-500 shadow-md' : 
                        rank === 3 ? 'bg-orange-400 text-white border-orange-600 shadow-md' : 
                        'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {rank}
                      </div>
                    </div>

                    {/* Profile */}
                    <div className="col-span-5 flex items-center gap-4">
                      {renderAvatar(player.avatarId, initials)}
                      <div>
                        <h4 className={`font-black text-xl truncate w-48 sm:w-64 ${isCurrentUser ? 'text-amber-800' : 'text-slate-800'}`}>
                          {player.name}
                        </h4>
                        <p className={`text-xs font-bold tracking-widest uppercase mt-0.5 ${isCurrentUser ? 'text-amber-600' : 'text-slate-400'}`}>
                          {player.unlockedLevels >= 3 ? 'Master' : player.unlockedLevels === 2 ? 'Journeyman' : 'Apprentice'}
                        </p>
                      </div>
                    </div>

                    {/* Level Badges */}
                    <div className="col-span-3 flex items-center md:justify-center gap-2">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-2 ${player.levelScores?.[1] > 0 ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-300 border-slate-200'}`}>L1: {player.levelScores?.[1] || 0}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-2 ${player.levelScores?.[2] > 0 ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-slate-100 text-slate-300 border-slate-200'}`}>L2: {player.levelScores?.[2] || 0}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-2 ${player.levelScores?.[3] > 0 ? 'bg-purple-100 text-purple-600 border-purple-200' : 'bg-slate-100 text-slate-300 border-slate-200'}`}>L3: {player.levelScores?.[3] || 0}</span>
                      </div>
                    </div>

                    {/* Total Score */}
                    <div className="col-span-3 flex items-center md:justify-end md:pr-4">
                      <span className={`text-3xl font-black ${isCurrentUser ? 'text-amber-600' : 'text-slate-700'}`}>
                        {displayScore} <span className="text-lg opacity-50">XP</span>
                      </span>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;