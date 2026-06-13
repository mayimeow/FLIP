import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { auth, googleProvider, db } from '../firebase'; 
import { AlertCircle, Mail, Lock, Cpu, Sparkles } from 'lucide-react'; 

const Home = () => {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const createUserProfile = async (user, fallbackName) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || fallbackName,
        email: user.email,
        totalScore: 0,
        unlockedLevels: 1,
        cooldownUntil: null,
        levelScores: { 1: 0, 2: 0, 3: 0 } 
      });
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(''); 
    
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError("Please use a valid @gmail.com address.");
      return; 
    }
    
    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please try again.");
        return; 
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, 'users', userCredential.user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await signOut(auth); 
          setError("No account data found. Please Sign Up to register.");
          return; 
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user, email.split('@')[0]); 
      }
      navigate('/dashboard');
    } catch (err) {
      let cleanError = err.message.replace('Firebase: ', '');
      if (cleanError.includes('auth/invalid-email')) cleanError = "Please enter a valid email address.";
      if (cleanError.includes('auth/email-already-in-use')) cleanError = "Account already exists.";
      if (cleanError.includes('auth/invalid-credential')) cleanError = "Incorrect email or password.";
      setError(cleanError);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);

      if (isLogin) {
        if (!userSnap.exists()) {
          await signOut(auth); 
          setError("No account found. Please Sign Up to register.");
          return; 
        }
      } else {
        if (!userSnap.exists()) {
          await createUserProfile(result.user, result.user.displayName || result.user.email.split('@')[0]);
        }
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-12 font-sans relative overflow-hidden">
      
      {/* Cute Floating Background Elements */}
      <Cpu size={120} className="absolute top-10 left-10 text-indigo-200/50 -rotate-12 animate-float" />
      <Sparkles size={80} className="absolute bottom-20 right-10 text-teal-200/50 rotate-12 animate-float" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* LEFT SIDE: Brand & Copy */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="bg-white border-4 border-indigo-100 shadow-[0_8px_0_rgba(224,231,255,1)] w-32 h-32 md:w-40 md:h-40 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 hover:rotate-6 transition-transform">
            <span className="text-7xl md:text-8xl text-indigo-500 font-black tracking-tighter">F</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight mb-4 drop-shadow-sm">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-400">F.L.I.P.</span>?
          </h1>
          <div className="inline-block bg-teal-100 border-2 border-teal-200 text-teal-700 font-bold px-4 py-2 rounded-xl uppercase tracking-widest text-sm mb-6 shadow-sm">
            Fun Logic Interactive Platform
          </div>
          
          <p className="text-slate-500 font-bold text-lg md:text-xl max-w-md leading-relaxed">
            Master digital logic the fun way. Test your skills on basic gates, truth tables, and Boolean algebra!
          </p>
        </div>

        {/* RIGHT SIDE: Auth "Game Console" Form */}
        <div className="w-full max-w-md bg-white border-4 border-slate-100 rounded-[2.5rem] shadow-2xl p-8 md:p-10 flex flex-col items-center">
          
          <h2 className="text-3xl font-black text-slate-800 mb-2">
            {isLogin ? 'Player Login' : 'New Player'}
          </h2>
          <p className="text-sm font-bold text-slate-400 mb-8">
            {isLogin ? 'Welcome back to the arena!' : 'Create your character to start playing!'}
          </p>
          
          {/* Google Button */}
          <button 
            onClick={handleGoogleAuth}
            className="w-full bg-white border-4 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 font-black text-base py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 mb-6 active:translate-y-1 active:border-b-0 border-b-8"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="w-full flex items-center justify-between mb-6">
            <span className="border-b-4 border-slate-100 w-1/3 rounded-full"></span>
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Or</span>
            <span className="border-b-4 border-slate-100 w-1/3 rounded-full"></span>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4 w-full">
            
            {error && (
              <div className="bg-rose-100 text-rose-600 text-sm font-bold p-4 rounded-2xl border-2 border-rose-200 flex items-center gap-3">
                <AlertCircle size={20} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email (@gmail.com)" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-4 border-slate-100 focus:border-teal-400 focus:bg-teal-50 outline-none transition-all font-bold text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-4 border-slate-100 focus:border-teal-400 focus:bg-teal-50 outline-none transition-all font-bold text-slate-700 placeholder-slate-400"
                />
              </div>
              
              {/* Forgot Password Link - Only visible during Login */}
              {isLogin && (
                <div className="w-full flex justify-end">
                  <button 
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-4 border-slate-100 focus:border-teal-400 focus:bg-teal-50 outline-none transition-all font-bold text-slate-700 placeholder-slate-400"
                />
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black text-lg py-4 rounded-2xl transition-all border-b-8 border-indigo-700 active:border-b-0 active:translate-y-2 flex items-center justify-center gap-2 mt-2"
            >
              {isLogin ? 'Start Game' : 'Create Character'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-bold text-slate-400">
            {isLogin ? "Don't have a profile? " : "Already registered? "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(''); 
                setConfirmPassword(''); 
              }}
              className="text-teal-500 hover:text-teal-600 underline decoration-4 underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;