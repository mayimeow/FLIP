import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, deleteField } from 'firebase/firestore';
import { onAuthStateChanged, updateProfile, deleteUser, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { 
  ArrowLeft, Edit3, CheckCircle, AlertCircle, Info, Trophy, Medal, 
  AlertTriangle, RotateCcw, LogOut, User, Sparkles,
  Bot, Ghost, Gamepad2, Smile, UserRound, UserSquare, Skull, Meh 
} from 'lucide-react';

// --- Character-Themed Avatars ---
const AVATARS = [
  { id: 'bot', icon: Bot, name: 'The Mecha', bg: 'bg-indigo-100', text: 'text-indigo-500', border: 'border-indigo-300' },
  { id: 'ghost', icon: Ghost, name: 'Phantom', bg: 'bg-amber-100', text: 'text-amber-500', border: 'border-amber-300' },
  { id: 'gamer', icon: Gamepad2, name: 'Arcade', bg: 'bg-emerald-100', text: 'text-emerald-500', border: 'border-emerald-300' },
  { id: 'smile', icon: Smile, name: 'Optimist', bg: 'bg-rose-100', text: 'text-rose-500', border: 'border-rose-300' },
  { id: 'human', icon: UserRound, name: 'Classic', bg: 'bg-teal-100', text: 'text-teal-500', border: 'border-teal-300' },
  { id: 'pixel', icon: UserSquare, name: '8-Bit', bg: 'bg-purple-100', text: 'text-purple-500', border: 'border-purple-300' },
  { id: 'skull', icon: Skull, name: 'Hardcore', bg: 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-300' },
  { id: 'meh', icon: Meh, name: 'The Stoic', bg: 'bg-orange-100', text: 'text-orange-500', border: 'border-orange-300' },
];

const Profile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null });
  
  // Avatar States
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

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
          setNewName(data.name);
          setSelectedAvatarId(data.avatarId || null);
        }
      } catch (error) {}
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleUpdateProfile = async (newAvatarId = null) => {
    if (isEditing && newName.trim() === "") {
      setStatusMsg({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }
    
    setStatusMsg({ type: 'info', text: 'Updating...' });
    try {
      const updates = {};
      if (isEditing) {
        await updateProfile(auth.currentUser, { displayName: newName });
        updates.name = newName;
      }
      if (newAvatarId) {
        updates.avatarId = newAvatarId;
      }

      if (Object.keys(updates).length > 0) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, updates);
        
        setUserData(prev => ({ ...prev, ...updates }));
      }
      
      setIsEditing(false);
      setIsAvatarModalOpen(false);
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleAvatarSelect = (id) => {
    setSelectedAvatarId(id);
    handleUpdateProfile(id);
  };

  const handleLogout = async () => {
    setConfirmModal({ isOpen: false, type: null });
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Failed to log out.' });
    }
  };

  const executeScheduleDeletion = async () => {
    setConfirmModal({ isOpen: false, type: null }); 
    try {
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const deletionTime = Date.now() + thirtyDaysInMs;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { deletionDate: deletionTime });
      
      setUserData(prev => ({ ...prev, deletionDate: deletionTime }));
      setStatusMsg({ type: 'info', text: 'Account scheduled for deletion.' });
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Failed to schedule deletion.' });
    }
  };

  const handleRestoreAccount = async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { deletionDate: deleteField() }); 
      
      const updatedData = { ...userData };
      delete updatedData.deletionDate;
      setUserData(updatedData);
      
      setStatusMsg({ type: 'success', text: 'Welcome back! Deletion cancelled.' });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Failed to restore account.' });
    }
  };

  const executePermanentDelete = async () => {
    setConfirmModal({ isOpen: false, type: null }); 
    try {
      const user = auth.currentUser;
      await deleteDoc(doc(db, 'users', user.uid)); 
      await deleteUser(user); 
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setStatusMsg({ type: 'error', text: 'Security Alert: Log out and back in before permanently deleting.' });
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to delete account permanently.' });
      }
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-slate-50">
        <div className="w-16 h-16 border-8 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const userInitials = userData.name ? userData.name.substring(0, 2).toUpperCase() : "U";
  const isScheduledForDeletion = userData.deletionDate && userData.deletionDate > Date.now();
  const deletionDateString = isScheduledForDeletion 
    ? new Date(userData.deletionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) 
    : '';
  const displayUnlockedLevels = Math.min(3, userData.unlockedLevels || 1);

  // Determine Current Avatar UI
  const currentAvatarObj = AVATARS.find(a => a.id === selectedAvatarId);
  const AvatarIcon = currentAvatarObj ? currentAvatarObj.icon : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative overflow-hidden pb-12">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 text-indigo-900">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-profile" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10 L30 10 L40 20 L40 40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="10" r="3" fill="currentColor"/>
            <circle cx="40" cy="40" r="3" fill="currentColor"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-profile)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 pt-12 relative z-10 flex-grow flex flex-col">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-slate-500 font-black hover:text-indigo-600 flex items-center gap-2 group bg-white px-5 py-3 rounded-2xl border-4 border-slate-100 shadow-sm transition-all active:translate-y-1 active:border-b-0 border-b-8"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Arena
          </button>
          <div className="bg-indigo-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border-b-4 border-indigo-700 transform rotate-3">
            <span className="text-white font-black text-2xl">F</span>
          </div>
        </div>

        {statusMsg.text && (
          <div className={`w-full p-4 rounded-2xl font-black text-lg text-center border-4 mb-8 flex items-center justify-center gap-3 shadow-sm ${
            statusMsg.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
            'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            {statusMsg.type === 'error' && <AlertCircle size={24} />}
            {statusMsg.type === 'success' && <CheckCircle size={24} />}
            {statusMsg.type === 'info' && <Info size={24} />}
            {statusMsg.text}
          </div>
        )}

        {/* FULL PAGE BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
          
          {/* LEFT COLUMN: Identity Block */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white rounded-[3rem] shadow-xl border-4 border-slate-100 p-8 flex flex-col items-center relative overflow-hidden h-full">
              
              {/* Top Banner Graphic */}
              <div className={`absolute top-0 left-0 w-full h-32 ${isScheduledForDeletion ? 'bg-rose-400' : 'bg-indigo-500'}`}></div>

              {/* Avatar Section */}
              <div className="relative mt-8 mb-6 z-10 group cursor-pointer" onClick={() => !isScheduledForDeletion && setIsAvatarModalOpen(true)}>
                {currentAvatarObj ? (
                  <div className={`w-40 h-40 rounded-[2.5rem] flex items-center justify-center border-8 border-white shadow-lg transform group-hover:rotate-6 transition-all ${currentAvatarObj.bg} ${currentAvatarObj.text}`}>
                    <AvatarIcon size={80} />
                  </div>
                ) : (
                  <div className={`w-40 h-40 bg-white rounded-[2.5rem] flex items-center justify-center border-8 border-slate-100 shadow-lg text-6xl font-black transform group-hover:rotate-6 transition-all ${isScheduledForDeletion ? 'text-rose-500' : 'text-indigo-500'}`}>
                    {userInitials}
                  </div>
                )}
                {!isScheduledForDeletion && (
                  <div className="absolute -bottom-4 -right-4 bg-amber-400 text-amber-950 font-black px-4 py-2 rounded-xl border-4 border-white shadow-md flex items-center gap-2 group-hover:scale-110 transition-transform">
                    <Edit3 size={16} /> Edit
                  </div>
                )}
              </div>

              {/* Identity Details */}
              <div className="text-center w-full flex-grow flex flex-col justify-center items-center">
                {isEditing && !isScheduledForDeletion ? (
                  <div className="flex flex-col items-center w-full gap-4 mb-4">
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full text-center px-6 py-4 rounded-2xl border-4 border-slate-200 focus:border-indigo-400 focus:bg-indigo-50 outline-none font-black text-2xl text-slate-700 transition-all"
                      placeholder="Enter Player Name"
                    />
                    <div className="flex gap-3 w-full">
                      <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black rounded-xl border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 transition-all">Cancel</button>
                      <button onClick={() => handleUpdateProfile()} className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-xl border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8">
                    <h1 className="text-4xl font-black text-slate-800 flex justify-center items-center gap-3 mb-2">
                      {userData.name}
                      {!isScheduledForDeletion && (
                        <button onClick={() => setIsEditing(true)} className="text-slate-300 hover:text-indigo-500 transition-colors bg-slate-50 p-2 rounded-xl" title="Edit Name">
                          <Edit3 size={20} />
                        </button>
                      )}
                    </h1>
                    <p className="text-slate-400 font-bold tracking-wide flex items-center justify-center gap-2">
                      <User size={16}/> {userData.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Logout Button Pinned to Bottom */}
              <button 
                onClick={() => setConfirmModal({ isOpen: true, type: 'logout' })}
                className="w-full bg-slate-100 border-4 border-slate-200 hover:bg-slate-200 text-slate-600 font-black text-lg py-4 rounded-2xl transition-all border-b-8 active:border-b-4 active:translate-y-1 flex items-center justify-center gap-3 mt-auto"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Stats & Danger Zone */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Stats Bento Box */}
            <div className="bg-white rounded-[3rem] shadow-xl border-4 border-slate-100 p-8">
              <h3 className="font-black text-slate-400 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <Trophy size={18} /> Player Stats
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-amber-50 border-4 border-amber-100 p-8 rounded-[2rem] flex flex-col items-center justify-center shadow-inner hover:-translate-y-1 transition-transform">
                  <Trophy size={40} className="text-amber-400 mb-4" />
                  <span className="block text-amber-600/70 text-sm font-black uppercase tracking-widest mb-1">Total XP</span>
                  <span className="text-5xl font-black text-amber-500">{userData.totalScore}</span>
                </div>
                <div className="bg-emerald-50 border-4 border-emerald-100 p-8 rounded-[2rem] flex flex-col items-center justify-center shadow-inner hover:-translate-y-1 transition-transform">
                  <Medal size={40} className="text-emerald-400 mb-4" />
                  <span className="block text-emerald-600/70 text-sm font-black uppercase tracking-widest mb-1">Top Level</span>
                  <span className="text-5xl font-black text-emerald-500">Lvl {displayUnlockedLevels}</span>
                </div>
              </div>
            </div>

            {/* Danger Zone Bento Box */}
            <div className="bg-white rounded-[3rem] shadow-xl border-4 border-slate-100 p-8 flex-grow flex flex-col justify-center">
              {isScheduledForDeletion ? (
                <div className="w-full flex flex-col items-center bg-rose-50 p-8 rounded-[2rem] border-4 border-rose-200 shadow-inner">
                  <h3 className="text-rose-500 font-black tracking-widest uppercase text-xl mb-3 flex items-center gap-2">
                    <AlertTriangle size={28} /> Account Deactivated
                  </h3>
                  <p className="text-rose-600 text-lg text-center font-bold mb-8">
                    Your account is scheduled for deletion on <br/>
                    <span className="font-black text-2xl">{deletionDateString}</span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <button 
                      onClick={handleRestoreAccount}
                      className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-white font-black py-4 px-6 rounded-2xl border-b-8 border-emerald-600 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      <RotateCcw size={20} /> Restore Account
                    </button>
                    <button 
                      onClick={() => setConfirmModal({ isOpen: true, type: 'permanent' })}
                      className="flex-1 border-4 border-rose-400 text-rose-500 hover:bg-rose-500 hover:text-white font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center text-lg active:scale-95"
                    >
                      Delete Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="text-rose-400 font-black tracking-widest uppercase text-lg mb-2 flex items-center gap-2">
                      <AlertTriangle size={20} /> Danger Zone
                    </h3>
                    <p className="text-slate-400 font-bold max-w-sm">
                      Deactivating schedules your account for deletion in 30 days. You won't lose progress unless you permanently delete it.
                    </p>
                  </div>
                  <button 
                    onClick={() => setConfirmModal({ isOpen: true, type: 'schedule' })}
                    className="w-full sm:w-auto bg-white border-4 border-rose-200 text-rose-400 hover:border-rose-400 hover:bg-rose-50 font-black py-4 px-8 rounded-2xl border-b-8 active:border-b-4 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg whitespace-nowrap"
                  >
                    Deactivate
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- AVATAR SELECTION MODAL --- */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden border-4 border-slate-100 flex flex-col max-h-[90vh]">
            <div className="bg-indigo-500 p-8 text-center border-b-4 border-indigo-600 text-white flex justify-between items-center shrink-0">
              <h2 className="text-3xl font-black flex items-center gap-3">
                <Sparkles size={32} /> Select Your Logic Avatar
              </h2>
              <button onClick={() => setIsAvatarModalOpen(false)} className="text-indigo-200 hover:text-white transition-colors bg-indigo-600 p-2 rounded-xl border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1">
                Close
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {AVATARS.map((avatar) => {
                  const Icon = avatar.icon;
                  const isSelected = selectedAvatarId === avatar.id;
                  return (
                    <button 
                      key={avatar.id}
                      onClick={() => handleAvatarSelect(avatar.id)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${isSelected ? `bg-white ${avatar.border} shadow-lg scale-105` : `bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300`}`}
                    >
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${avatar.bg} ${avatar.text}`}>
                        <Icon size={40} />
                      </div>
                      <span className={`font-black text-sm text-center ${isSelected ? avatar.text : 'text-slate-500'}`}>{avatar.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION MODAL --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border-4 border-slate-100">
            <div className={`p-8 text-center border-b-4 ${
              confirmModal.type === 'permanent' ? 'bg-rose-500 border-rose-600 text-white' : 
              confirmModal.type === 'logout' ? 'bg-indigo-500 border-indigo-600 text-white' : 
              'bg-amber-400 border-amber-500 text-amber-950'
            }`}>
              <h2 className="text-3xl font-black flex items-center justify-center gap-3">
                {confirmModal.type === 'logout' ? <LogOut size={32} /> : <AlertTriangle size={32} />}
                {
                  confirmModal.type === 'permanent' ? 'Delete forever?' : 
                  confirmModal.type === 'logout' ? 'Leaving so soon?' : 
                  'Deactivate?'
                }
              </h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-slate-500 font-bold text-lg mb-8">
                {
                  confirmModal.type === 'permanent' ? "WARNING: This permanently deletes your account and scores RIGHT NOW. Cannot be undone." : 
                  confirmModal.type === 'logout' ? "You'll need to sign back in to continue your progress in the logic arena." : 
                  "Scheduled for deletion in 30 days. Cancel by logging back in anytime."
                }
              </p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setConfirmModal({ isOpen: false, type: null })}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black rounded-2xl border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 transition-colors text-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={
                    confirmModal.type === 'permanent' ? executePermanentDelete : 
                    confirmModal.type === 'schedule' ? executeScheduleDeletion : 
                    handleLogout
                  }
                  className={`flex-1 py-4 font-black rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-colors text-white text-lg ${
                    confirmModal.type === 'logout' ? 'bg-indigo-500 hover:bg-indigo-600 border-indigo-700' : 'bg-rose-500 hover:bg-rose-600 border-rose-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;