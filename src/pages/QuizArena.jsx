import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'; 
import { Heart, Timer, Trophy, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

// =====================================================================
// THE LOGIC ENGINE
// =====================================================================
const checkEquivalence = (expr1, expr2) => {
  if (expr1 == null || expr2 == null) return false;
  const clean1 = String(expr1).trim().toLowerCase().replace(/\s+/g, '');
  const clean2 = String(expr2).trim().toLowerCase().replace(/\s+/g, '');
  if (clean1 === clean2) return true; 

  const isValidBoolean = (str) => /^[a-z0-1+*'^\(\)]+$/.test(str) && !/[0-1]{2,}/.test(str);
  if (!isValidBoolean(clean1) || !isValidBoolean(clean2)) return false;

  try {
    const convertToJS = (expr) => {
      let s = expr;
      s = s.replace(/([a-z0-1\)])([a-z0-1\(])/g, '$1&$2');
      s = s.replace(/([a-z0-1\)])([a-z0-1\(])/g, '$1&$2'); 
      s = s.replace(/\+/g, '|').replace(/\*/g, '&').replace(/\^/g, '!==');
      while (s.includes("'")) {
        let idx = s.indexOf("'");
        if (s[idx - 1] === ')') {
          let parenCount = 1;
          let j = idx - 2;
          while (j >= 0 && parenCount > 0) {
            if (s[j] === ')') parenCount++;
            if (s[j] === '(') parenCount--;
            j--;
          }
          if (j < -1) throw new Error("Mismatched parentheses");
          s = s.substring(0, j + 1) + '!' + s.substring(j + 1, idx) + s.substring(idx + 1);
        } else {
          let varChar = s[idx - 1];
          s = s.substring(0, idx - 1) + '!' + varChar + s.substring(idx + 1);
        }
      }
      return s.replace(/\|/g, '||').replace(/&/g, '&&');
    };

    const js1 = convertToJS(clean1);
    const js2 = convertToJS(clean2);
    const vars = Array.from(new Set((clean1 + clean2).match(/[a-z]/g) || [])).sort();

    if (vars.length > 10) return false; 
    const combinations = 1 << vars.length; 
    for (let i = 0; i < combinations; i++) {
      const values = vars.map((_, index) => (i >> index) & 1);
      const func1 = new Function(...vars, `return !!(${js1});`);
      const func2 = new Function(...vars, `return !!(${js2});`);
      if (func1(...values) !== func2(...values)) return false;
    }
    return true;
  } catch (err) {
    return false; 
  }
};
// =====================================================================

const QuizArena = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const targetLevel = location.state?.targetLevel || 1;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(targetLevel === 2 ? 60 : 45);
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [textInput, setTextInput] = useState("");

  // INITIALIZATION & SESSION RESTORE
  useEffect(() => {
    const fetchQuestions = async () => {
      // 1. Check if the user has an active quiz session saved in the browser
      const savedSession = sessionStorage.getItem('flip_quiz_progress');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        // Only restore if they are resuming the EXACT same level
        if (parsed.targetLevel === targetLevel) {
          setQuestions(parsed.questions);
          setCurrentIndex(parsed.currentIndex);
          setScore(parsed.score);
          setLives(parsed.lives);
          setTimeLeft(parsed.timeLeft);
          setSelectedAnswer(parsed.selectedAnswer);
          setIsAnswered(parsed.isAnswered);
          setIsCorrect(parsed.isCorrect);
          setTextInput(parsed.textInput || "");
          setLoading(false);
          return;
        }
      }

      // 2. If no valid session exists, fetch fresh questions from Firebase
      try {
        const q = query(collection(db, "questions"), where("level", "==", targetLevel));
        const querySnapshot = await getDocs(q);
        let fetchedQuestions = [];
        querySnapshot.forEach((doc) => {
          fetchedQuestions.push({ id: doc.id, ...doc.data() });
        });
        fetchedQuestions = fetchedQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
        setQuestions(fetchedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [targetLevel]); 

  // PROGRESS AUTO-SAVER
  useEffect(() => {
    // Whenever any of these variables change, save the exact state to the browser's session storage
    if (!loading && questions.length > 0) {
      sessionStorage.setItem('flip_quiz_progress', JSON.stringify({
        targetLevel,
        questions,
        currentIndex,
        score,
        lives,
        timeLeft,
        selectedAnswer,
        isAnswered,
        isCorrect,
        textInput
      }));
    }
  }, [currentIndex, score, lives, timeLeft, questions, targetLevel, loading, selectedAnswer, isAnswered, isCorrect, textInput]);

  // TIMER LOGIC
  useEffect(() => {
    if (targetLevel === 1 || targetLevel === 2) {
      if (timeLeft > 0 && !isAnswered && !loading && questions.length > 0) {
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timerId);
      } else if (timeLeft === 0 && !isAnswered) {
        handleAnswerSubmission("TIME_OUT"); 
      }
    }
  }, [timeLeft, isAnswered, loading, questions, targetLevel]);

  const handleAnswerSubmission = (userAnswer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(userAnswer);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isRight = checkEquivalence(userAnswer, currentQ.correctAnswer);

    if (isRight) {
      let pointsEarned = 0;
      if (targetLevel === 1 || targetLevel === 2) {
        pointsEarned = 50 + (timeLeft * 2);
      } else if (targetLevel === 3) {
        pointsEarned = 100;
      }
      setScore(score + pointsEarned); 
      setIsCorrect(true);
    } else {
      setLives(prev => Math.max(0, prev - 1));
      setIsCorrect(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!auth.currentUser) {
      navigate('/');
      return;
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);

    // ESCALATING PENALTY LOGIC: Failed by running out of lives
    if (lives === 0) {
      try {
        const userSnap = await getDoc(userRef);
        let failCount = userSnap.exists() ? (userSnap.data().failCount || 0) : 0;
        failCount += 1;
        
        let cooldownDuration = 60 * 1000; // 1 minute default
        if (failCount === 2) cooldownDuration = 5 * 60 * 1000; // 5 minutes
        if (failCount >= 3) cooldownDuration = 15 * 60 * 1000; // 15 minutes max

        const cooldownTime = Date.now() + cooldownDuration; 
        await updateDoc(userRef, { cooldownUntil: cooldownTime, failCount: failCount });
      } catch (err) {}
      
      // Wipe the saved session so they can't resume a dead run
      sessionStorage.removeItem('flip_quiz_progress');
      navigate('/results', { state: { finalScore: score, passed: false, levelPlayed: targetLevel } });
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setTextInput("");
      
      if (targetLevel === 1) setTimeLeft(45);
      else if (targetLevel === 2) setTimeLeft(60);
    } else {
      const passed = score >= (questions.length * 50 * 0.7); 
      let isAlreadyUnlocked = false;
      
      try {
        const userSnap = await getDoc(userRef);
        let failCount = userSnap.exists() ? (userSnap.data().failCount || 0) : 0;

        if (passed) {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const currentLevelStr = targetLevel.toString(); 
            const previousHighScore = userData.levelScores?.[currentLevelStr] || 0;
            
            let newTotalScore = userData.totalScore || 0;
            let newHighScore = previousHighScore;

            if (score > previousHighScore) {
              newTotalScore = (newTotalScore - previousHighScore) + score;
              newHighScore = score;
            }

            const nextLevelToUnlock = Math.min(3, targetLevel + 1);
            const currentUnlocked = userData.unlockedLevels || 1;
            isAlreadyUnlocked = currentUnlocked >= nextLevelToUnlock;
            const newUnlockedLevels = Math.min(3, Math.max(currentUnlocked, nextLevelToUnlock));

            // SUCCESS: Save scores and reset failCount to 0
            await updateDoc(userRef, {
              totalScore: newTotalScore,
              [`levelScores.${currentLevelStr}`]: newHighScore,
              unlockedLevels: newUnlockedLevels,
              failCount: 0 // Reset penalty on victory
            });
          }
        } else {
          // ESCALATING PENALTY LOGIC: Finished quiz but failed score threshold
          failCount += 1;
          let cooldownDuration = 60 * 1000; // 1 min
          if (failCount === 2) cooldownDuration = 5 * 60 * 1000; // 5 mins
          if (failCount >= 3) cooldownDuration = 15 * 60 * 1000; // 15 mins

          const cooldownTime = Date.now() + cooldownDuration; 
          await updateDoc(userRef, { cooldownUntil: cooldownTime, failCount: failCount });
        }
      } catch (err) {}
      
      // Wipe the saved session since the quiz is over
      sessionStorage.removeItem('flip_quiz_progress');
      navigate('/results', { state: { finalScore: score, passed: passed, levelPlayed: targetLevel, isAlreadyUnlocked } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans px-4">
        <div className="w-12 h-12 md:w-16 md:h-16 border-8 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg md:text-xl font-black text-slate-400">Loading Module...</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans p-4 sm:p-6">
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl text-center border-4 border-slate-100 max-w-md w-full">
          <h2 className="text-2xl sm:text-3xl font-black text-rose-500 mb-2">No Data!</h2>
          <p className="text-sm sm:text-base text-slate-500 mb-8 font-bold">The database has no questions for Level {targetLevel} yet.</p>
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-base sm:text-lg border-b-8 border-indigo-700 active:border-b-0 active:translate-y-2 rounded-2xl transition-all">Return to Hub</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const renderInputArea = () => {
    const qType = (currentQuestion.type || '').toString().trim().toUpperCase();

    if (qType === 'MCQ') {
      const options = [currentQuestion.optionA, currentQuestion.optionB, currentQuestion.optionC, currentQuestion.optionD].filter(Boolean);
      return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 mt-4 md:mt-6">
          {options.map((option, index) => {
            let btnStyle = "bg-white border-slate-200 border-b-8 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50";
            if (isAnswered) {
              if (checkEquivalence(option, currentQuestion.correctAnswer)) {
                btnStyle = "bg-emerald-400 border-emerald-600 border-b-4 text-white transform translate-y-1 shadow-[0_0_20px_rgba(52,211,153,0.4)]";
              } else if (checkEquivalence(option, selectedAnswer)) {
                btnStyle = "bg-rose-400 border-rose-600 border-b-4 text-white transform translate-y-1";
              } else {
                btnStyle = "bg-slate-50 border-slate-200 border-b-4 text-slate-400 opacity-50 transform translate-y-1";
              }
            }
            return (
              <button 
                key={index} 
                onClick={() => handleAnswerSubmission(option)} 
                disabled={isAnswered} 
                className={`p-4 md:p-6 rounded-2xl md:rounded-3xl text-lg md:text-2xl font-black text-left transition-all border-4 flex items-center ${btnStyle} ${!isAnswered && 'active:border-b-0 active:translate-y-2'}`}
              >
                <span className="mr-3 md:mr-4 text-xs md:text-sm font-black opacity-40 bg-slate-200/50 px-2 md:px-3 py-1 rounded-lg shrink-0">
                  {['A', 'B', 'C', 'D'][index]}
                </span>
                <span className="break-words">{option}</span>
              </button>
            );
          })}
        </div>
      );
    }
    
    if (qType === 'TF') {
      return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          {['True', 'False'].map((option) => {
            let btnStyle = "bg-white border-slate-200 border-b-8 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50";
            if (isAnswered) {
              if (checkEquivalence(option, currentQuestion.correctAnswer)) btnStyle = "bg-emerald-400 border-emerald-600 border-b-4 text-white transform translate-y-1";
              else if (checkEquivalence(option, selectedAnswer)) btnStyle = "bg-rose-400 border-rose-600 border-b-4 text-white transform translate-y-1";
              else btnStyle = "bg-slate-50 border-slate-200 border-b-4 text-slate-400 opacity-50 transform translate-y-1";
            }
            return (
              <button 
                key={option} 
                onClick={() => handleAnswerSubmission(option)} 
                disabled={isAnswered} 
                className={`p-6 md:p-8 rounded-2xl md:rounded-3xl text-2xl md:text-3xl font-black text-center transition-all border-4 ${btnStyle} ${!isAnswered && 'active:border-b-0 active:translate-y-2'}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
    }

    if (qType === 'INPUT' || qType === 'IDENT') {
      let inputStyle = "border-slate-200 focus:border-teal-400 focus:bg-teal-50 bg-white text-slate-700";
      if (isAnswered) {
        inputStyle = isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-rose-400 bg-rose-50 text-rose-700";
      }

      return (
        <div className="w-full flex flex-col items-center gap-4 md:gap-6 mt-4 md:mt-6">
          <input 
            type="text" 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isAnswered}
            placeholder={qType === 'INPUT' ? "Type formula (e.g. A * B')" : "Type your answer..."}
            className={`w-full max-w-2xl px-6 md:px-8 py-5 md:py-6 rounded-2xl md:rounded-3xl border-4 outline-none transition-all font-mono text-xl sm:text-2xl md:text-3xl font-black text-center shadow-inner ${inputStyle}`}
            onKeyDown={(e) => { if (e.key === 'Enter' && textInput.trim() !== '') handleAnswerSubmission(textInput); }}
          />
          {!isAnswered && (
            <button 
              onClick={() => { if (textInput.trim() !== '') handleAnswerSubmission(textInput); }}
              className="w-full sm:w-auto bg-teal-400 hover:bg-teal-500 text-white font-black text-xl md:text-2xl px-10 md:px-12 py-4 md:py-5 rounded-2xl border-b-8 border-teal-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              LOCK IN
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="text-rose-600 font-bold p-4 md:p-6 bg-rose-50 border-4 border-rose-200 rounded-2xl md:rounded-3xl w-full text-center flex items-center justify-center gap-2 md:gap-3 mt-4 md:mt-6 text-sm md:text-base">
        <XCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0" /> System Error: Unrecognized question type.
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans flex flex-col relative overflow-hidden bg-slate-50 px-3 sm:px-4">
      
      {/* Decorative SVG Circuit nodes */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 text-indigo-900 hidden sm:block">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-arena" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20 20 L50 20 L60 30 L60 60" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="20" cy="20" r="4" fill="currentColor"/>
              <circle cx="60" cy="60" r="4" fill="currentColor"/>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-arena)" />
        </svg>
      </div>

      {/* Floating Gamified HUD */}
      <div className="w-full max-w-5xl mx-auto mt-4 md:mt-6 relative z-20">
        <div className="bg-white/95 backdrop-blur-md border-4 border-slate-100 rounded-2xl md:rounded-[2rem] px-3 sm:px-6 py-3 md:py-4 shadow-sm flex flex-wrap justify-between items-center gap-3">
          
          <div className="flex gap-1 sm:gap-2 bg-rose-50 border-4 border-rose-100 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-all duration-300 ${i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-200 fill-slate-200 scale-90'}`} />
            ))}
          </div>
          
          {(targetLevel === 1 || targetLevel === 2) && (
            <div className={`px-4 sm:px-6 py-1.5 md:py-2 rounded-xl md:rounded-2xl border-4 flex items-center gap-1.5 sm:gap-2 font-mono font-black text-lg sm:text-xl md:text-2xl transition-colors shadow-inner ${timeLeft <= 10 ? 'bg-rose-100 border-rose-300 text-rose-600 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> 
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          <div className="px-4 sm:px-6 py-1.5 md:py-2 rounded-xl md:rounded-2xl bg-amber-100 border-4 border-amber-200 text-amber-600 font-black text-lg sm:text-xl md:text-2xl flex items-center gap-2 shadow-inner">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500" /> {score}
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center py-4 w-full max-w-5xl mx-auto relative z-10 mb-6 md:mb-8">
        
        {/* The Question Card */}
        <div className="w-full bg-white rounded-3xl md:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-xl border-4 border-slate-100 relative mt-8 md:mt-10">
          
          {/* Centered on mobile, left-aligned on desktop */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 bg-indigo-500 border-4 border-white text-white px-4 md:px-6 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-xs md:text-sm font-black shadow-md flex items-center justify-center gap-2 w-max max-w-[90%]">
            <span className="shrink-0">STAGE {targetLevel}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 shrink-0"></div> 
            <span className="truncate">{currentQuestion.topic}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 shrink-0"></div> 
            <span className="shrink-0">Q{currentIndex + 1}/{questions.length}</span>
          </div>
          
          <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-slate-800 text-center leading-tight mt-4 md:mt-2 break-words">
            {currentQuestion.text}
          </h2>
        </div>

        {renderInputArea()}

        {/* Feedback Popup */}
        {isAnswered && (
          <div className={`w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 bg-white border-4 rounded-2xl md:rounded-[2rem] p-5 md:p-6 mt-6 md:mt-8 shadow-xl animate-bounce-short ${isCorrect ? 'border-emerald-200' : 'border-rose-200'}`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left w-full gap-3 md:gap-4">
              <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'}`}>
                {isCorrect ? <CheckCircle className="w-8 h-8 md:w-10 md:h-10" /> : <XCircle className="w-8 h-8 md:w-10 md:h-10" />}
              </div>
              <div className="w-full">
                <h3 className={`font-black text-xl md:text-2xl mb-1 ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isCorrect ? 'Perfect Output!' : 'Logic Error.'}
                </h3>
                
                {/* Explicit Correct Answer displayed if wrong */}
                {!isCorrect && (
                  <div className="mb-2 md:mb-3 inline-flex items-center flex-wrap justify-center sm:justify-start gap-1.5 md:gap-2 text-rose-600 font-black text-xs sm:text-sm md:text-base bg-rose-50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border-2 border-rose-100">
                    Correct Answer: <span className="font-mono bg-white px-2 py-0.5 md:px-3 md:py-1 rounded-md shadow-sm text-rose-700 break-all">{currentQuestion.correctAnswer}</span>
                  </div>
                )}

                <p className="text-slate-500 font-bold text-sm sm:text-base md:text-lg">{currentQuestion.explanation}</p>
              </div>
            </div>
            
            <button 
              onClick={handleNextQuestion}
              className={`w-full md:w-auto px-6 sm:px-8 md:px-10 py-4 md:py-5 text-white font-black text-lg md:text-xl rounded-xl md:rounded-2xl border-b-8 active:border-b-0 active:translate-y-2 transition-all shrink-0 flex items-center justify-center gap-2 md:gap-3 ${isCorrect ? 'bg-emerald-400 hover:bg-emerald-500 border-emerald-600' : 'bg-indigo-500 hover:bg-indigo-600 border-indigo-700'}`}
            >
              <span className="whitespace-nowrap">{(lives === 0 || currentIndex === questions.length - 1) ? 'View Results' : 'Next Question'}</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizArena;