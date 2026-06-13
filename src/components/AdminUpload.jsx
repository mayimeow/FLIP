import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { Upload, CheckCircle, AlertCircle, FileText, Database, ArrowLeft, Users, PlusCircle, Trash2, Send } from 'lucide-react';

const AdminUpload = () => {
  const navigate = useNavigate();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  
  const [batch, setBatch] = useState([]);

  const [level, setLevel] = useState(1);
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('MCQ');
  const [text, setText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
        return;
      }
      
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        const data = userSnap.exists() ? userSnap.data() : {};
        const adminEmails = ['maryanngumafelix08@gmail.com']; 
        
        if (data.role === 'admin' || data.role === 'super_admin' || adminEmails.includes(user.email)) {
          setIsAdmin(true);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setCorrectAnswer(''); 
  };

  const handleAddToBatch = (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!text || !topic || !explanation || !correctAnswer) {
      setStatusMsg({ type: 'error', text: 'Please fill out all required fields.' });
      return;
    }

    if (type === 'MCQ' && (!options.A || !options.B || !options.C || !options.D)) {
      setStatusMsg({ type: 'error', text: 'MCQ requires all 4 options to be filled.' });
      return;
    }

    const payload = {
      level: parseInt(level),
      topic: topic,
      type: type,
      text: text,
      correctAnswer: correctAnswer,
      explanation: explanation,
      createdAt: new Date()
    };

    if (type === 'MCQ') {
      payload.optionA = options.A;
      payload.optionB = options.B;
      payload.optionC = options.C;
      payload.optionD = options.D;
    }

    setBatch([...batch, payload]);
    
    setText('');
    setExplanation('');
    setCorrectAnswer('');
    setOptions({ A: '', B: '', C: '', D: '' });
    
    setStatusMsg({ type: 'success', text: 'Question added to batch queue!' });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 2000);
  };

  const removeFromBatch = (indexToRemove) => {
    setBatch(batch.filter((_, index) => index !== indexToRemove));
  };

  const handleUploadBatch = async () => {
    if (batch.length === 0) return;
    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const promises = batch.map((questionData) => addDoc(collection(db, "questions"), questionData));
      await Promise.all(promises);
      
      setBatch([]); 
      setStatusMsg({ type: 'success', text: `Successfully uploaded ${batch.length} questions!` });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Failed to upload batch. Check console.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
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
          <defs>
            <pattern id="circuit-admin" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10 L30 10 L40 20 L40 40" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="currentColor"/>
              <circle cx="40" cy="40" r="3" fill="currentColor"/>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-admin)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 relative z-10 pt-8">
        
        {/* Floating Gamified Header */}
        <div className="bg-white/95 backdrop-blur-xl border-4 border-slate-100 px-6 py-4 rounded-[2rem] flex flex-col md:flex-row justify-between items-center shadow-md mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border-b-4 border-indigo-700 transform -rotate-6">
              <Database className="text-white font-black" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Uploader</h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Question Database</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => navigate('/admin-users')}
              className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-600 border-4 border-teal-200 font-black py-2 px-4 rounded-2xl transition-all border-b-4 active:border-b-0 active:translate-y-1"
            >
              <Users size={18} /> Manage Users
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-500 border-4 border-slate-200 font-black py-2 px-4 rounded-2xl transition-all border-b-4 active:border-b-0 active:translate-y-1"
            >
              <ArrowLeft size={18} /> Dashboard
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {statusMsg.text && (
          <div className={`p-4 rounded-2xl font-black mb-6 flex items-center justify-center gap-3 border-4 ${statusMsg.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
            {statusMsg.type === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
            {statusMsg.text}
          </div>
        )}

        {/* The Giant Bento Form */}
        <div className="bg-white rounded-[3rem] shadow-xl border-4 border-slate-100 overflow-hidden mb-10">
          <div className="bg-slate-800 px-8 py-5 flex items-center justify-between border-b-4 border-slate-900">
            <div className="flex items-center gap-3">
               <FileText className="text-indigo-400" size={24} />
               <h2 className="text-white font-black text-xl tracking-wide uppercase">Question Draft</h2>
            </div>
            <span className="bg-indigo-500 border-2 border-indigo-400 px-4 py-1.5 rounded-xl text-white text-sm font-black shadow-inner">
              Queue: {batch.length}
            </span>
          </div>

          <form onSubmit={handleAddToBatch} className="p-8 md:p-10 space-y-8">
            
            {/* ROW 1: Level & Topic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Target Level</label>
                <select 
                  value={level} 
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 focus:border-indigo-400 focus:bg-indigo-50 outline-none font-bold text-lg text-slate-700 transition-all appearance-none cursor-pointer"
                >
                  <option value={1}>Level 1: Apprentice (Timer Active)</option>
                  <option value={2}>Level 2: Intermediate</option>
                  <option value={3}>Level 3: Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Topic / Category</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Logic Gates"
                  className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 focus:border-indigo-400 focus:bg-indigo-50 outline-none font-bold text-lg text-slate-700 transition-all"
                />
              </div>
            </div>

            {/* ROW 2: Question Type & Question Text */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Question Type</label>
                <select 
                  value={type} 
                  onChange={handleTypeChange}
                  className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 focus:border-indigo-400 focus:bg-indigo-50 outline-none font-bold text-lg text-slate-700 transition-all appearance-none cursor-pointer"
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="TF">True / False</option>
                  <option value="INPUT">Logic Input</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Question Text</label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What is the result of A AND B?"
                  rows="2"
                  className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 focus:border-indigo-400 focus:bg-indigo-50 outline-none font-bold text-lg text-slate-700 transition-all resize-none"
                />
              </div>
            </div>

            {/* DYNAMIC INPUTS */}
            <div className="p-8 bg-slate-50 border-4 border-slate-100 rounded-[2rem]">
              
              {/* --- MCQ UI --- */}
              {type === 'MCQ' && (
                <div className="space-y-6">
                  <h3 className="font-black text-slate-400 uppercase tracking-widest text-sm text-center">Define the 4 Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <div key={opt} className="flex items-center gap-3">
                        <span className="font-black text-slate-400 w-6 text-xl">{opt}</span>
                        <input 
                          type="text" 
                          value={options[opt]}
                          onChange={(e) => setOptions({ ...options, [opt]: e.target.value })}
                          placeholder={`Option ${opt}`}
                          className="w-full px-4 py-3 rounded-xl border-4 border-white focus:border-indigo-400 focus:bg-indigo-50 outline-none font-bold text-slate-700 shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t-4 border-slate-200/50 flex flex-col items-center">
                    <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Select the Correct Answer</label>
                    <select 
                      value={correctAnswer} 
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className="w-full md:w-1/2 px-6 py-4 rounded-2xl border-4 border-indigo-200 focus:border-indigo-500 outline-none font-black text-xl text-indigo-600 bg-indigo-50 appearance-none text-center cursor-pointer shadow-inner"
                    >
                      <option value="" disabled>-- Select Option --</option>
                      {options.A && <option value={options.A}>A: {options.A}</option>}
                      {options.B && <option value={options.B}>B: {options.B}</option>}
                      {options.C && <option value={options.C}>C: {options.C}</option>}
                      {options.D && <option value={options.D}>D: {options.D}</option>}
                    </select>
                  </div>
                </div>
              )}

              {/* --- TRUE / FALSE UI --- */}
              {type === 'TF' && (
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-3">What is the correct answer?</label>
                  <select 
                    value={correctAnswer} 
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full md:w-1/2 px-6 py-4 rounded-2xl border-4 border-indigo-200 focus:border-indigo-500 outline-none font-black text-xl text-indigo-600 bg-indigo-50 appearance-none text-center cursor-pointer shadow-inner"
                  >
                    <option value="" disabled>-- True or False? --</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                </div>
              )}

              {/* --- INPUT UI --- */}
              {type === 'INPUT' && (
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Exact Answer / Formula</label>
                  <p className="text-xs text-slate-400 mb-4 font-bold text-center">Format strictly (e.g., A*B', (A+B)' ).</p>
                  <input 
                    type="text" 
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="e.g., A'B + AB'"
                    className="w-full md:w-3/4 px-6 py-5 rounded-2xl border-4 border-indigo-200 focus:border-indigo-500 outline-none font-mono font-black text-indigo-600 bg-indigo-50 text-2xl text-center shadow-inner"
                  />
                </div>
              )}
            </div>

            {/* ROW 4: Explanation */}
            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Explanation (Shown after answering)</label>
              <textarea 
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why this answer is correct..."
                rows="3"
                className="w-full px-6 py-4 rounded-2xl border-4 border-emerald-100 focus:border-emerald-400 focus:bg-emerald-50 outline-none font-bold text-lg text-emerald-800 resize-none"
              />
            </div>

            <div className="pt-6 flex justify-end">
              <button 
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xl py-4 px-8 rounded-2xl transition-all border-b-8 border-indigo-700 active:border-b-0 active:translate-y-2 flex items-center gap-3"
              >
                <PlusCircle size={24} /> Queue Question
              </button>
            </div>
          </form>
        </div>

        {/* THE BATCH QUEUE */}
        {batch.length > 0 && (
          <div className="bg-white rounded-[3rem] shadow-xl border-4 border-emerald-200 overflow-hidden animate-fade-in-up">
            <div className="bg-emerald-100 px-8 py-5 flex items-center justify-between border-b-4 border-emerald-200">
              <div className="flex items-center gap-3">
                 <Upload className="text-emerald-500" size={24} />
                 <h2 className="text-emerald-700 font-black text-xl tracking-wide uppercase">Batch Ready</h2>
              </div>
              <span className="bg-emerald-500 border-2 border-emerald-600 px-4 py-1.5 rounded-xl text-white text-sm font-black shadow-inner">
                {batch.length} Items
              </span>
            </div>
            
            <div className="p-6 md:p-8 max-h-96 overflow-y-auto bg-slate-50">
              <ul className="space-y-4">
                {batch.map((q, index) => (
                  <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border-4 border-slate-100 p-5 rounded-2xl shadow-sm gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-slate-100 text-slate-500 text-xs font-black px-3 py-1 rounded-lg border-2 border-slate-200">Lvl {q.level}</span>
                        <span className="bg-indigo-50 text-indigo-500 text-xs font-black px-3 py-1 rounded-lg border-2 border-indigo-200">{q.type}</span>
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{q.topic}</span>
                      </div>
                      <p className="font-bold text-lg text-slate-700 line-clamp-1">{q.text}</p>
                    </div>
                    <button 
                      onClick={() => removeFromBatch(index)}
                      className="bg-rose-100 text-rose-500 border-b-4 border-rose-300 active:border-b-0 active:translate-y-1 p-3 rounded-xl transition-all self-end sm:self-auto"
                      title="Remove"
                    >
                      <Trash2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-white border-t-4 border-emerald-100 flex justify-end">
              <button 
                onClick={handleUploadBatch}
                disabled={isSubmitting}
                className="w-full md:w-auto bg-emerald-400 hover:bg-emerald-500 disabled:bg-emerald-200 text-white font-black text-xl py-5 px-10 rounded-2xl transition-all border-b-8 border-emerald-600 disabled:border-emerald-300 active:border-b-0 active:translate-y-2 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(52,211,153,0.3)]"
              >
                <Send size={24} />
                {isSubmitting ? 'Uploading...' : `Publish to Database`}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminUpload;