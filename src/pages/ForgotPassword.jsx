import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; 
import { ArrowLeft, KeyRound, Mail, CheckCircle, AlertTriangle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus({ 
        type: 'success', 
        message: 'Reset link sent! Check your inbox (and spam folder) to reset your password.' 
      });
      setEmail(''); // Clear the input after success
    } catch (error) {
      console.error("Password reset error:", error);
      // Handle common Firebase errors
      if (error.code === 'auth/invalid-email') {
        setStatus({ type: 'error', message: 'Invalid email format.' });
      } else if (error.code === 'auth/user-not-found') {
        setStatus({ type: 'error', message: 'No account found with this email.' });
      } else {
        setStatus({ type: 'error', message: 'Failed to send reset link. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 text-indigo-900">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-bg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10 L30 10 L40 20 L40 40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="10" cy="10" r="3" fill="currentColor"/>
            <circle cx="40" cy="40" r="3" fill="currentColor"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-bg)" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-xl border-4 border-slate-100 relative z-10 flex flex-col items-center">
        
        {/* Header Icon */}
        <div className="w-20 h-20 bg-indigo-100 text-indigo-500 rounded-[1.5rem] flex items-center justify-center border-b-4 border-indigo-200 mb-6 transform -rotate-3">
          <KeyRound size={40} />
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-2">Forgot Password?</h2>
        <p className="text-slate-500 font-bold text-center mb-8">
          Enter your email address and we'll send you a link to get back into the arena.
        </p>

        {/* Status Messages */}
        {status.message && (
          <div className={`w-full p-4 rounded-2xl font-black text-sm text-center border-4 mb-6 flex items-center justify-center gap-3 ${
            status.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
          }`}>
            {status.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
            {status.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
              <Mail size={20} />
            </div>
            <input 
              type="email" 
              placeholder="player@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-4 border-slate-200 focus:border-indigo-400 focus:bg-indigo-50 outline-none font-bold text-lg text-slate-700 transition-all placeholder-slate-300 disabled:opacity-50"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full font-black text-lg py-5 rounded-2xl transition-all flex items-center justify-center gap-2 border-b-8 active:border-b-0 active:translate-y-2 ${
              isLoading 
                ? 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed' 
                : 'bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <button 
          onClick={() => navigate('/auth')} 
          className="mt-8 text-slate-400 hover:text-indigo-500 font-bold transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Login
        </button>

      </div>
    </div>
  );
};

export default ForgotPassword;