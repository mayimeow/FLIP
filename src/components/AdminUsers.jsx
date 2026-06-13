import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { Users, Shield, Download, ArrowLeft, ShieldAlert, CheckSquare, Square, UserCog } from 'lucide-react';

const AdminUsers = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // 1. Check Login
      if (!user) {
        navigate('/');
        return;
      }

      // 2. STRICT SECURITY GUARD: Only the Super Admin email can access this page
      const SUPER_ADMIN_EMAIL = "maryanngumafelix08@gmail.com"; 
      if (user.email !== SUPER_ADMIN_EMAIL) {
        navigate('/dashboard');
        return;
      }
      
      fetchUsers();
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() });
      });
      userList.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      setUsers(userList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const exportToCSV = (exportList) => {
    if (exportList.length === 0) return;
    const headers = ['Name', 'Email', 'Total Score', 'Highest Level', 'Role'];
    const rows = exportList.map(u => [`"${u.name || 'Unknown'}"`, u.email, u.totalScore || 0, u.unlockedLevels || 1, u.role || 'player']);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `FLIP_Scores_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="w-16 h-16 border-8 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative overflow-hidden pb-20">
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 text-indigo-900">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-admin-users" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10 L30 10 L40 20 L40 40" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="10" cy="10" r="3" fill="currentColor"/>
            <circle cx="40" cy="40" r="3" fill="currentColor"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-admin-users)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 relative z-10 pt-8">
        
        {/* Floating Header */}
        <div className="bg-white/95 backdrop-blur-xl border-4 border-slate-100 px-8 py-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center shadow-md mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-teal-400 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border-b-4 border-teal-600 transform rotate-3">
              <UserCog className="text-teal-950 font-black" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Super Admin Roster</h1>
              <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Global Control Panel</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => exportToCSV(selectedUsers.length > 0 ? users.filter(u => selectedUsers.includes(u.id)) : users)}
              className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-500 text-white border-b-8 border-emerald-600 font-black py-3 px-6 rounded-2xl transition-all active:border-b-0 active:translate-y-2 shadow-sm"
            >
              <Download size={20} /> Export {selectedUsers.length > 0 ? `(${selectedUsers.length})` : 'All'}
            </button>
            <button 
              onClick={() => navigate('/admin-upload')}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-500 border-4 border-slate-200 font-black py-3 px-6 rounded-2xl transition-all border-b-8 active:border-b-0 active:translate-y-2"
            >
              <ArrowLeft size={18} /> Back to Uploader
            </button>
          </div>
        </div>

        {/* Gamified Table */}
        <div className="bg-white rounded-[3rem] shadow-xl border-4 border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white text-sm uppercase tracking-widest font-black border-b-8 border-slate-950">
                  <th className="p-6 w-16 text-center">
                    <button onClick={() => setSelectedUsers(selectedUsers.length === users.length ? [] : users.map(u => u.id))} className="text-slate-400 hover:text-white transition-colors">
                      {selectedUsers.length === users.length && users.length > 0 ? <CheckSquare size={24} className="text-teal-400" /> : <Square size={24} />}
                    </button>
                  </th>
                  <th className="p-6">Player Profile</th>
                  <th className="p-6 text-center">Rank / XP</th>
                  <th className="p-6">Permissions</th>
                  <th className="p-6 text-center">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-slate-50">
                {users.map((user) => {
                  const role = user.role || 'player';
                  const isSelected = selectedUsers.includes(user.id);
                  
                  return (
                    <tr key={user.id} className={`transition-colors hover:bg-slate-50/50 ${isSelected ? 'bg-teal-50/50' : ''}`}>
                      <td className="p-6 text-center cursor-pointer" onClick={() => setSelectedUsers(prev => prev.includes(user.id) ? prev.filter(i => i !== user.id) : [...prev, user.id])}>
                        {isSelected ? <CheckSquare size={24} className="text-teal-500 mx-auto" /> : <Square size={24} className="text-slate-300 mx-auto" />}
                      </td>
                      <td className="p-6">
                        <div className="font-black text-lg text-slate-800">{user.name}</div>
                        <div className="text-sm font-black text-slate-400">{user.email}</div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="font-black text-lg text-indigo-500">Lvl {user.unlockedLevels || 1}</div>
                        <div className="font-black text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg inline-block">{user.totalScore || 0} XP</div>
                      </td>
                      <td className="p-6">
                        <span className={`flex items-center gap-2 w-max px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-4 ${
                          role === 'super_admin' ? 'bg-purple-100 text-purple-600 border-purple-200' :
                          role === 'admin' ? 'bg-rose-100 text-rose-600 border-rose-200' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {role === 'super_admin' ? <ShieldAlert size={16} /> : role === 'admin' ? <Shield size={16} /> : null}
                          {role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-6 flex items-center justify-center">
                          {role === 'player' && (
                            <button onClick={() => handleRoleChange(user.id, 'admin')} className="text-xs font-black text-rose-600 bg-white border-4 border-rose-200 hover:bg-rose-50 px-5 py-3 rounded-2xl transition-all border-b-4 active:border-b-0 active:translate-y-1">
                              Promote
                            </button>
                          )}
                          {role === 'admin' && (
                            <button onClick={() => handleRoleChange(user.id, 'player')} className="text-xs font-black text-slate-500 bg-white border-4 border-slate-200 hover:bg-slate-50 px-5 py-3 rounded-2xl transition-all border-b-4 active:border-b-0 active:translate-y-1">
                              Revoke
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;