import React, { useState } from 'react';

// ==========================================
// Helper: Custom SVG Logic Gate Symbols
// ==========================================
const GateSymbol = ({ type, className }) => {
  const svgProps = {
    viewBox: "0 0 120 80",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (type) {
    case 'AND':
      return (
        <svg {...svgProps}>
          <path d="M 30,20 L 60,20 A 20,20 0 0,1 60,60 L 30,60 Z" />
          <path d="M 10,30 L 30,30 M 10,50 L 30,50 M 80,40 L 110,40" />
        </svg>
      );
    case 'OR':
      return (
        <svg {...svgProps}>
          <path d="M 30,20 C 50,20 70,25 90,40 C 70,55 50,60 30,60 C 45,50 45,30 30,20 Z" />
          <path d="M 10,30 L 38,30 M 10,50 L 38,50 M 90,40 L 110,40" />
        </svg>
      );
    case 'NOT':
      return (
        <svg {...svgProps}>
          <path d="M 40,20 L 70,40 L 40,60 Z" />
          <circle cx="80" cy="40" r="8" />
          <path d="M 10,40 L 40,40 M 88,40 L 110,40" />
        </svg>
      );
    case 'NAND':
      return (
        <svg {...svgProps}>
          <path d="M 25,20 L 55,20 A 20,20 0 0,1 55,60 L 25,60 Z" />
          <circle cx="85" cy="40" r="8" />
          <path d="M 10,30 L 25,30 M 10,50 L 25,50 M 93,40 L 110,40" />
        </svg>
      );
    case 'NOR':
      return (
        <svg {...svgProps}>
          <path d="M 20,20 C 40,20 60,25 75,40 C 60,55 40,60 20,60 C 35,50 35,30 20,20 Z" />
          <circle cx="85" cy="40" r="8" />
          <path d="M 10,30 L 28,30 M 10,50 L 28,50 M 93,40 L 110,40" />
        </svg>
      );
    case 'XOR':
      return (
        <svg {...svgProps}>
          <path d="M 35,20 C 55,20 75,25 90,40 C 75,55 55,60 35,60 C 50,50 50,30 35,20 Z" />
          <path d="M 22,20 C 37,30 37,50 22,60" />
          <path d="M 10,30 L 42,30 M 10,50 L 42,50 M 90,40 L 110,40" />
        </svg>
      );
    case 'XNOR':
      return (
        <svg {...svgProps}>
          <path d="M 25,20 C 45,20 65,25 75,40 C 65,55 45,60 25,60 C 40,50 40,30 25,20 Z" />
          <circle cx="85" cy="40" r="8" />
          <path d="M 12,20 C 27,30 27,50 12,60" />
          <path d="M 0,30 L 32,30 M 0,50 L 32,50 M 93,40 L 110,40" />
        </svg>
      );
    default:
      return null;
  }
};


// ==========================================
// 1. UNIFIED LOGIC GATES MODULE
// ==========================================
export const LogicGates = ({ hardwareMode }) => {
  const [activeGate, setActiveGate] = useState('AND');
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);

  const gates = {
    AND: { name: 'AND Gate', mathDesc: 'Outputs 1 ONLY if BOTH inputs are 1. Strict condition.', hardwareDesc: 'SAFETY INTERLOCK: Machine runs if door is closed (A) AND start is pressed (B).', calculate: (a, b) => (a === 1 && b === 1 ? 1 : 0), singleInput: false, labels: { math: { inA: "A", inB: "B", out: "OUT" }, hardware: { inA: "Door", inB: "Start", out: "Motor" } } },
    OR: { name: 'OR Gate', mathDesc: 'Outputs 1 if AT LEAST ONE input is 1. Very forgiving.', hardwareDesc: 'SECURITY ALARM: Sounds if front door opens (A) OR window breaks (B).', calculate: (a, b) => (a === 1 || b === 1 ? 1 : 0), singleInput: false, labels: { math: { inA: "A", inB: "B", out: "OUT" }, hardware: { inA: "Door", inB: "Window", out: "Siren" } } },
    NOT: { name: 'NOT Gate', mathDesc: 'The Inverter. It flips the input. 1 becomes 0, 0 becomes 1.', hardwareDesc: 'NIGHT LIGHT: Streetlamp turns ON (1) when sunlight detects darkness (0).', calculate: (a) => (a === 1 ? 0 : 1), singleInput: true, labels: { math: { inA: "A", inB: null, out: "OUT" }, hardware: { inA: "Sun", inB: null, out: "Light" } } },
    XOR: { name: 'XOR Gate', mathDesc: 'Exclusive OR. Outputs 1 ONLY if inputs are DIFFERENT.', hardwareDesc: 'HALLWAY SWITCH: A light controlled by two separate switches.', calculate: (a, b) => (a !== b ? 1 : 0), singleInput: false, labels: { math: { inA: "A", inB: "B", out: "OUT" }, hardware: { inA: "Sw 1", inB: "Sw 2", out: "Bulb" } } },
    NAND: { name: 'NAND Gate', mathDesc: 'Universal Gate. Outputs 0 ONLY if BOTH inputs are 1.', hardwareDesc: 'FAIL-SAFE: Brake applies (0) only if both primary (A) and secondary (B) fault (1).', calculate: (a, b) => (!(a === 1 && b === 1) ? 1 : 0), singleInput: false, labels: { math: { inA: "A", inB: "B", out: "OUT" }, hardware: { inA: "Sens 1", inB: "Sens 2", out: "Brake" } } },
    NOR: { name: 'NOR Gate', mathDesc: 'Universal Gate. Outputs 1 ONLY if BOTH inputs are 0.', hardwareDesc: 'AC SYSTEM: Stays ON (1) only if both window (A) and door (B) are closed (0).', calculate: (a, b) => (a === 0 && b === 0 ? 1 : 0), singleInput: false, labels: { math: { inA: "A", inB: "B", out: "OUT" }, hardware: { inA: "Window", inB: "Door", out: "AC" } } },
    XNOR: { name: 'XNOR Gate', mathDesc: 'Equivalence Gate. Outputs 1 ONLY if inputs are the SAME.', hardwareDesc: 'PIN MATCHER: Unlocks (1) only if entered bit (A) exactly matches stored bit (B).', calculate: (a, b) => (a === b ? 1 : 0), singleInput: false, labels: { math: { inA: "A", inB: "B", out: "OUT" }, hardware: { inA: "Key", inB: "Lock", out: "Vault" } } }
  };

  const currentGate = gates[activeGate];
  const gateOutput = currentGate.calculate(inputA, inputB);
  const labels = hardwareMode ? currentGate.labels.hardware : currentGate.labels.math;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mt-4 mb-20 animate-fade-in flex-grow">
      <div className="text-center mb-8 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>Gate Explorer</h2>
        
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {Object.keys(gates).map((key) => (
            <button
              key={key}
              onClick={() => { setActiveGate(key); if (gates[key].singleInput) setInputB(0); }}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${
                activeGate === key
                  ? (hardwareMode ? 'bg-amber-400 border-amber-600 text-amber-950' : 'bg-indigo-500 border-indigo-700 text-white')
                  : (hardwareMode ? 'bg-slate-800 border-slate-900 text-slate-500' : 'bg-white border-slate-200 text-slate-400')
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>{currentGate.name}</span>
          {hardwareMode ? currentGate.hardwareDesc : currentGate.mathDesc}
        </div>
      </div>

      <div className={`p-8 sm:p-12 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-center w-full border-4 transition-colors duration-500 gap-10 lg:gap-16 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        <div className="flex flex-row lg:flex-col gap-6 sm:gap-10 z-10 flex-1 justify-center items-center">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <span className={`font-black text-center lg:text-right lg:w-20 text-sm sm:text-lg uppercase ${hardwareMode ? (inputA ? 'text-amber-400' : 'text-slate-500') : 'text-slate-400'}`}>{labels.inA}</span>
            <button onClick={() => setInputA(inputA === 0 ? 1 : 0)} className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${inputA === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'bg-indigo-500 text-white border-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>
              {hardwareMode ? (inputA ? 'ON' : 'OFF') : inputA}
            </button>
            <div className={`w-2 h-10 lg:h-4 lg:w-20 rounded-full transition-colors duration-300 ${inputA === 1 ? (hardwareMode ? 'bg-amber-400' : 'bg-indigo-500') : (hardwareMode ? 'bg-slate-700' : 'bg-slate-200')}`}></div>
          </div>

          {!currentGate.singleInput && (
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <span className={`font-black text-center lg:text-right lg:w-20 text-sm sm:text-lg uppercase ${hardwareMode ? (inputB ? 'text-amber-400' : 'text-slate-500') : 'text-slate-400'}`}>{labels.inB}</span>
              <button onClick={() => setInputB(inputB === 0 ? 1 : 0)} className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${inputB === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'bg-indigo-500 text-white border-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>
                {hardwareMode ? (inputB ? 'ON' : 'OFF') : inputB}
              </button>
              <div className={`w-2 h-10 lg:h-4 lg:w-20 rounded-full transition-colors duration-300 ${inputB === 1 ? (hardwareMode ? 'bg-amber-400' : 'bg-indigo-500') : (hardwareMode ? 'bg-slate-700' : 'bg-slate-200')}`}></div>
            </div>
          )}
        </div>

        <div className={`w-48 sm:w-56 h-40 sm:h-64 flex-none rounded-[3rem] flex flex-col items-center justify-center font-black shadow-xl z-10 transition-colors duration-500 border-8 relative ${hardwareMode ? 'bg-slate-900 border-slate-950 text-white' : 'bg-slate-800 border-slate-700 text-white'}`}>
          {/* Custom SVG Logic Gate Component */}
          <GateSymbol type={activeGate} className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-md" />
          <span className="absolute bottom-4 text-xs font-bold tracking-widest text-slate-400">{activeGate}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-3 z-10 flex-1 justify-center">
          <div className={`w-2 h-10 lg:h-4 lg:w-20 rounded-full transition-colors duration-300 ${gateOutput === 1 ? (hardwareMode ? 'bg-emerald-400' : 'bg-emerald-500') : (hardwareMode ? 'bg-slate-700' : 'bg-slate-200')}`}></div>
          <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-300 border-8 ${gateOutput === 1 ? (hardwareMode ? 'bg-emerald-400 border-white scale-110 shadow-[0_0_40px_rgba(52,211,153,0.5)] text-emerald-950' : 'bg-emerald-500 border-emerald-200 scale-110 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]') : hardwareMode ? 'bg-slate-700 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
            <span className={`text-4xl sm:text-5xl font-black`}>
              {hardwareMode ? (gateOutput ? 'ACT' : 'IDLE') : gateOutput}
            </span>
          </div>
          <span className={`font-black uppercase mt-3 lg:mt-0 lg:ml-4 lg:w-20 text-center lg:text-left text-sm sm:text-lg transition-colors ${gateOutput === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>{labels.out}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. THE BIT BOARD
// ==========================================
export const BitBoard = ({ hardwareMode }) => {
  const [byte, setByte] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const bitValues = [128, 64, 32, 16, 8, 4, 2, 1];

  const toggleBit = (index) => {
    const newByte = [...byte];
    newByte[index] = newByte[index] === 0 ? 1 : 0;
    setByte(newByte);
  };
  
  const decimalValue = parseInt(byte.join(''), 2);
  const hexValue = decimalValue.toString(16).toUpperCase().padStart(2, '0');
  const octalValue = decimalValue.toString(8).padStart(3, '0');

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>The Bit Board</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Base 2 to Base 10</span>
          {hardwareMode ? "Toggle physical switches to build an 8-bit byte." : "Each position represents a power of 2. Click to toggle."}
        </div>
      </div>

      <div className={`p-6 sm:p-10 rounded-[3rem] shadow-xl flex flex-wrap sm:flex-nowrap justify-center gap-3 sm:gap-4 relative overflow-hidden mb-10 w-full border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        {byte.map((bit, index) => (
          <div key={index} className="flex flex-col items-center z-10 gap-3 w-[22%] sm:w-auto">
            <button onClick={() => toggleBit(index)} className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${bit === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>
              {bit}
            </button>
            <span className={`text-xs sm:text-sm font-black tracking-widest ${bit === 1 ? (hardwareMode ? 'text-amber-400' : 'text-indigo-500') : 'text-slate-400'}`}>{bitValues[index]}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        <div className={`p-8 rounded-[2rem] border-4 flex flex-col items-center shadow-sm ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <span className="text-slate-400 font-black tracking-widest text-xs sm:text-sm mb-2">DECIMAL</span>
          <span className={`text-5xl font-black ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>{decimalValue}</span>
        </div>
        <div className={`p-8 rounded-[2rem] border-4 flex flex-col items-center shadow-sm ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <span className="text-slate-400 font-black tracking-widest text-xs sm:text-sm mb-2">HEXADECIMAL</span>
          <span className={`text-5xl font-black ${hardwareMode ? 'text-teal-400' : 'text-teal-500'}`}>0x{hexValue}</span>
        </div>
        <div className={`p-8 rounded-[2rem] border-4 flex flex-col items-center shadow-sm ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <span className="text-slate-400 font-black tracking-widest text-xs sm:text-sm mb-2">OCTAL</span>
          <span className={`text-5xl font-black ${hardwareMode ? 'text-rose-400' : 'text-rose-500'}`}>0o{octalValue}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. KARNAUGH MAPS
// ==========================================
export const KarnaughMap = ({ hardwareMode }) => {
  const [kmap, setKmap] = useState([0, 0, 0, 0]);
  const [kmapMode, setKmapMode] = useState('SOP');

  const toggleKMap = (index) => {
    const newMap = [...kmap];
    newMap[index] = newMap[index] === 0 ? 1 : 0;
    setKmap(newMap);
  };

  const solveKMap = () => {
    if (kmapMode === 'SOP') {
      if (kmap.every(val => val === 1)) return "1 (Always ON)";
      if (kmap.every(val => val === 0)) return "0 (Always OFF)";
      let terms = [];
      let covered = [false, false, false, false];
      if (kmap[0]===1 && kmap[1]===1) { terms.push("A'"); covered[0]=covered[1]=true; }
      if (kmap[2]===1 && kmap[3]===1) { terms.push("A"); covered[2]=covered[3]=true; }
      if (kmap[0]===1 && kmap[2]===1) { terms.push("B'"); covered[0]=covered[2]=true; }
      if (kmap[1]===1 && kmap[3]===1) { terms.push("B"); covered[1]=covered[3]=true; }
      if (kmap[0]===1 && !covered[0]) terms.push("A'B'");
      if (kmap[1]===1 && !covered[1]) terms.push("A'B");
      if (kmap[2]===1 && !covered[2]) terms.push("AB'");
      if (kmap[3]===1 && !covered[3]) terms.push("AB");
      return terms.join(" + ");
    } else {
      if (kmap.every(val => val === 0)) return "0 (Always OFF)";
      if (kmap.every(val => val === 1)) return "1 (Always ON)";
      let terms = [];
      let covered = [false, false, false, false];
      if (kmap[0]===0 && kmap[1]===0) { terms.push("A"); covered[0]=covered[1]=true; }
      if (kmap[2]===0 && kmap[3]===0) { terms.push("A'"); covered[2]=covered[3]=true; }
      if (kmap[0]===0 && kmap[2]===0) { terms.push("B"); covered[0]=covered[2]=true; }
      if (kmap[1]===0 && kmap[3]===0) { terms.push("B'"); covered[1]=covered[3]=true; }
      if (kmap[0]===0 && !covered[0]) terms.push("(A+B)");
      if (kmap[1]===0 && !covered[1]) terms.push("(A+B')");
      if (kmap[2]===0 && !covered[2]) terms.push("(A'+B)");
      if (kmap[3]===0 && !covered[3]) terms.push("(A'+B')");
      return terms.join(" · ");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>2-Variable K-Map</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Simplification</span>
          {hardwareMode ? "Click physical zones to optimize logic wiring." : "Click cells to toggle. SOP groups 1s, POS groups 0s."}
        </div>
      </div>

      <div className={`flex flex-col sm:flex-row p-2 rounded-3xl mb-10 border-4 w-full sm:w-auto ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
        <button onClick={() => setKmapMode('SOP')} className={`px-6 sm:px-10 py-4 rounded-2xl font-black tracking-widest transition-all text-sm sm:text-base border-4 ${kmapMode === 'SOP' ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-500'}`}>SOP (Sum of Products)</button>
        <button onClick={() => setKmapMode('POS')} className={`px-6 sm:px-10 py-4 rounded-2xl font-black tracking-widest transition-all text-sm sm:text-base border-4 ${kmapMode === 'POS' ? 'bg-white border-rose-200 text-rose-600 shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-500'}`}>POS (Product of Sums)</button>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col items-center w-full border-4 transition-all duration-500 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-12 sm:gap-16">
          
          <div className="flex flex-col items-center w-full lg:w-1/2">
            <span className={`font-black tracking-widest mb-6 text-sm sm:text-base uppercase ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>The Grid</span>
            <div className={`grid grid-cols-3 gap-3 sm:gap-4 items-center justify-center p-6 rounded-[2.5rem] border-4 ${hardwareMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <div className={`flex items-end justify-end p-2 font-black text-xl sm:text-2xl ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>A \ B</div>
              <div className={`flex items-center justify-center font-black text-2xl sm:text-4xl ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>0</div>
              <div className={`flex items-center justify-center font-black text-2xl sm:text-4xl ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>1</div>
              
              <div className={`flex items-center justify-end p-2 font-black text-2xl sm:text-4xl pr-4 ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>0</div>
              <button onClick={() => toggleKMap(0)} className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${kmap[0] === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-white text-slate-300 border-slate-200'}`}>{kmap[0]}</button>
              <button onClick={() => toggleKMap(1)} className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${kmap[1] === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-white text-slate-300 border-slate-200'}`}>{kmap[1]}</button>
              
              <div className={`flex items-center justify-end p-2 font-black text-2xl sm:text-4xl pr-4 ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>1</div>
              <button onClick={() => toggleKMap(2)} className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${kmap[2] === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-white text-slate-300 border-slate-200'}`}>{kmap[2]}</button>
              <button onClick={() => toggleKMap(3)} className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${kmap[3] === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-white text-slate-300 border-slate-200'}`}>{kmap[3]}</button>
            </div>
          </div>

          <div className="flex flex-col justify-center flex-grow w-full lg:w-1/2">
            <span className={`font-black tracking-widest mb-6 text-center text-sm sm:text-base uppercase ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Simplified Expression
            </span>
            <div className={`w-full p-8 sm:p-10 rounded-[3rem] flex items-center justify-center text-center min-h-[160px] sm:min-h-[200px] border-4 transition-all duration-300 ${
              (solveKMap() === "0 (Always OFF)" || solveKMap() === "1 (Always ON)")
              ? hardwareMode ? 'bg-slate-900 border-slate-800 text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'
              : kmapMode === 'SOP'
                ? (hardwareMode ? 'bg-slate-900 border-emerald-500 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-600')
                : (hardwareMode ? 'bg-slate-900 border-rose-500 text-rose-400' : 'bg-rose-50 border-rose-300 text-rose-600')
            }`}>
              <span className="text-4xl sm:text-6xl font-black tracking-wide font-mono">{solveKMap()}</span>
            </div>
            <button onClick={() => setKmap([0,0,0,0])} className={`mt-6 py-4 px-8 rounded-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-400 hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              Clear Map
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. HALF ADDER
// ==========================================
export const HalfAdder = ({ hardwareMode }) => {
  const [haInputA, setHaInputA] = useState(0);
  const [haInputB, setHaInputB] = useState(0);
  const haSumOut = haInputA !== haInputB ? 1 : 0;
  const haCarryOut = (haInputA === 1 && haInputB === 1) ? 1 : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>The Half Adder</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Combinational Circuit</span>
          {hardwareMode ? "Combines two inputs to generate a physical Sum and a Carry bit." : "Adds two binary bits. XOR computes SUM, AND computes CARRY."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-row lg:flex-col gap-6 sm:gap-12 z-10 w-full lg:w-1/4 justify-center">
          <div className="flex flex-col gap-3 w-1/2 lg:w-auto">
            <span className={`font-black uppercase tracking-widest text-center text-sm sm:text-base ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Input A</span>
            <button onClick={() => setHaInputA(haInputA === 0 ? 1 : 0)} className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${haInputA === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{haInputA}</button>
          </div>
          <div className="flex flex-col gap-3 w-1/2 lg:w-auto">
            <span className={`font-black uppercase tracking-widest text-center text-sm sm:text-base ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Input B</span>
            <button onClick={() => setHaInputB(haInputB === 0 ? 1 : 0)} className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${haInputB === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{haInputB}</button>
          </div>
        </div>

        <div className={`flex flex-col gap-6 sm:gap-10 z-10 w-full lg:w-2/4 items-center py-10 px-6 rounded-[3rem] border-4 ${hardwareMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          <div className={`w-full max-w-[250px] h-24 sm:h-32 rounded-[2rem] flex flex-col items-center justify-center text-white font-black text-2xl sm:text-3xl border-8 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-700 border-slate-600'}`}>
            <span className="tracking-widest">XOR</span>
            <span className="text-slate-400 text-xs sm:text-sm mt-1 uppercase tracking-widest">Calculates Sum</span>
          </div>
          <div className={`w-full max-w-[250px] h-24 sm:h-32 rounded-[2rem] flex flex-col items-center justify-center text-white font-black text-2xl sm:text-3xl border-8 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-700 border-slate-600'}`}>
            <span className="tracking-widest">AND</span>
            <span className="text-slate-400 text-xs sm:text-sm mt-1 uppercase tracking-widest">Calculates Carry</span>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-6 sm:gap-12 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-5 w-1/2 lg:w-auto">
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 border-8 ${haSumOut === 1 ? 'bg-emerald-400 border-white text-emerald-950 scale-110 shadow-[0_0_30px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
              <span className={`text-4xl sm:text-5xl font-black`}>{haSumOut}</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm sm:text-xl ${haSumOut === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>SUM</span>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-5 w-1/2 lg:w-auto">
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 border-8 ${haCarryOut === 1 ? 'bg-rose-400 border-white text-rose-950 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
              <span className={`text-4xl sm:text-5xl font-black`}>{haCarryOut}</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm sm:text-xl ${haCarryOut === 1 ? 'text-rose-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>CARRY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. FULL ADDER
// ==========================================
export const FullAdder = ({ hardwareMode }) => {
  const [faInputA, setFaInputA] = useState(0);
  const [faInputB, setFaInputB] = useState(0);
  const [faCarryIn, setFaCarryIn] = useState(0);
  
  const faSumOut = (faInputA ^ faInputB) ^ faCarryIn;
  const faCarryOut = (faInputA & faInputB) | ((faInputA ^ faInputB) & faCarryIn);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>The Full Adder</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Combinational Circuit</span>
          {hardwareMode ? "Adds three binary bits! Allows multiple adders to be chained." : "Combines two Half Adders and an OR gate to process A, B, AND Carry-In."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-row lg:flex-col gap-4 sm:gap-8 z-10 w-full lg:w-1/4 justify-center">
          <div className="flex flex-col gap-2 items-center w-1/3 lg:w-auto">
            <span className={`font-black uppercase tracking-widest text-xs sm:text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Input A</span>
            <button onClick={() => setFaInputA(faInputA === 0 ? 1 : 0)} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${faInputA === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{faInputA}</button>
          </div>
          <div className="flex flex-col gap-2 items-center w-1/3 lg:w-auto">
            <span className={`font-black uppercase tracking-widest text-xs sm:text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Input B</span>
            <button onClick={() => setFaInputB(faInputB === 0 ? 1 : 0)} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${faInputB === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{faInputB}</button>
          </div>
          <div className="flex flex-col gap-2 items-center w-1/3 lg:w-auto">
            <span className={`font-black uppercase tracking-widest text-xs sm:text-sm text-rose-500 text-center`}>Carry-In</span>
            <button onClick={() => setFaCarryIn(faCarryIn === 0 ? 1 : 0)} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${faCarryIn === 1 ? 'bg-rose-500 text-white border-rose-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{faCarryIn}</button>
          </div>
        </div>

        <div className={`flex flex-col gap-6 z-10 w-full lg:w-2/4 items-center py-10 px-6 rounded-[3rem] border-4 ${hardwareMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          <div className={`w-full sm:w-64 h-40 sm:h-48 rounded-[2rem] flex flex-col items-center justify-center text-white border-8 transition-colors duration-500 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-700 border-slate-600'}`}>
            <span className="tracking-widest font-black text-2xl sm:text-3xl text-center">FULL ADDER</span>
            <span className="text-slate-400 text-xs sm:text-sm mt-3 font-black tracking-widest uppercase bg-slate-900/50 px-4 py-2 rounded-xl">2x Half + OR</span>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-6 sm:gap-12 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col items-center gap-3 w-1/2 lg:w-auto">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 border-8 ${faSumOut === 1 ? 'bg-emerald-400 border-white text-emerald-950 scale-110 shadow-[0_0_30px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
              <span className={`text-4xl sm:text-5xl font-black`}>{faSumOut}</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm sm:text-xl ${faSumOut === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>SUM</span>
          </div>
          <div className="flex flex-col items-center gap-3 w-1/2 lg:w-auto">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 border-8 ${faCarryOut === 1 ? 'bg-rose-400 border-white text-rose-950 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
              <span className={`text-4xl sm:text-5xl font-black`}>{faCarryOut}</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm sm:text-xl text-center ${faCarryOut === 1 ? 'text-rose-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>CARRY OUT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. MULTIPLEXER
// ==========================================
export const Multiplexer = ({ hardwareMode }) => {
  const [muxD0, setMuxD0] = useState(0);
  const [muxD1, setMuxD1] = useState(0);
  const [muxSelect, setMuxSelect] = useState(0);
  const muxOut = muxSelect === 0 ? muxD0 : muxD1;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>2-to-1 Multiplexer</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Combinational Circuit</span>
          {hardwareMode ? "The Digital Switchboard. SELECT connects an input to the output." : "Uses a selection line to route one of multiple inputs to a single output."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-14 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-row lg:flex-col gap-10 sm:gap-16 z-10 w-full lg:w-1/4 justify-center">
          <div className="flex flex-col lg:flex-row items-center gap-4 relative w-1/2 lg:w-auto">
            <span className={`font-black uppercase tracking-widest lg:absolute lg:-top-8 text-sm text-center w-full lg:text-left ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Data 0</span>
            <button onClick={() => setMuxD0(muxD0 === 0 ? 1 : 0)} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 z-10 mx-auto lg:mx-0 ${muxD0 === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{muxD0}</button>
            <div className={`hidden lg:block h-4 w-full transition-colors duration-300 rounded-r-none ${muxSelect === 0 ? (muxD0 === 1 ? 'bg-amber-400' : 'bg-slate-400') : (hardwareMode ? 'bg-slate-700' : 'bg-slate-200')}`}></div>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-4 relative w-1/2 lg:w-auto">
            <span className={`font-black uppercase tracking-widest lg:absolute lg:-top-8 text-sm text-center w-full lg:text-left ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Data 1</span>
            <button onClick={() => setMuxD1(muxD1 === 0 ? 1 : 0)} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 z-10 mx-auto lg:mx-0 ${muxD1 === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{muxD1}</button>
            <div className={`hidden lg:block h-4 w-full transition-colors duration-300 rounded-r-none ${muxSelect === 1 ? (muxD1 === 1 ? 'bg-amber-400' : 'bg-slate-400') : (hardwareMode ? 'bg-slate-700' : 'bg-slate-200')}`}></div>
          </div>
        </div>

        <div className="flex flex-col items-center z-10 w-full lg:w-2/4 relative mt-6 lg:mt-0">
          <div className={`w-48 sm:w-56 h-56 sm:h-72 flex flex-col items-center justify-center text-white border-x-8 border-y-0 shadow-xl transition-colors duration-500 clip-path-trapezoid ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-700 border-slate-600'}`} style={{ clipPath: 'polygon(0 0, 100% 20%, 100% 80%, 0 100%)' }}>
            <span className="tracking-widest font-black text-3xl">MUX</span>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2 sm:gap-3">
            <span className="font-black text-rose-500 text-xs sm:text-sm tracking-widest uppercase text-center bg-rose-100/50 px-3 py-1 rounded-lg">SELECT</span>
            <button onClick={() => setMuxSelect(muxSelect === 0 ? 1 : 0)} className={`w-16 h-12 sm:w-20 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 bg-rose-500 text-white border-rose-700`}>{muxSelect}</button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4 z-10 w-full lg:w-1/4 justify-center mt-12 lg:mt-0">
          <div className={`hidden lg:block h-4 w-16 transition-colors duration-300 ${muxOut === 1 ? 'bg-amber-400' : 'bg-slate-400'}`}></div>
          <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-300 border-8 ${muxOut === 1 ? 'bg-emerald-400 border-white scale-110 text-emerald-950 shadow-[0_0_30px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
            <span className={`text-5xl sm:text-6xl font-black`}>{muxOut}</span>
          </div>
          <span className={`font-black uppercase tracking-widest text-xl sm:text-2xl text-center lg:text-left ${muxOut === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>OUT</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. COMPARATOR
// ==========================================
export const Comparator = ({ hardwareMode }) => {
  const [compA1, setCompA1] = useState(0);
  const [compA0, setCompA0] = useState(0);
  const [compB1, setCompB1] = useState(0);
  const [compB0, setCompB0] = useState(0);

  const valA = (compA1 << 1) | compA0;
  const valB = (compB1 << 1) | compB0;
  const compGT = valA > valB ? 1 : 0;
  const compEQ = valA === valB ? 1 : 0;
  const compLT = valA < valB ? 1 : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>2-Bit Comparator</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Combinational Circuit</span>
          {hardwareMode ? "Thermostat Logic. Does Sensor A exceed Sensor B?" : "Compares the magnitude of two 2-bit numbers."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        <div className="flex flex-row lg:flex-col gap-6 sm:gap-10 z-10 w-full lg:w-1/4 justify-center">
          <div className={`p-4 sm:p-6 rounded-[2rem] border-4 flex flex-col items-center gap-3 w-1/2 lg:w-auto ${hardwareMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`font-black text-base sm:text-xl uppercase tracking-widest ${hardwareMode ? 'text-amber-400' : 'text-indigo-600'}`}>Num A: {valA}</span>
            <div className="flex gap-3">
              <button onClick={() => setCompA1(compA1 === 0 ? 1 : 0)} className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${compA1 === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-white text-slate-400 border-slate-300'}`}>{compA1}</button>
              <button onClick={() => setCompA0(compA0 === 0 ? 1 : 0)} className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${compA0 === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-white text-slate-400 border-slate-300'}`}>{compA0}</button>
            </div>
          </div>

          <div className={`p-4 sm:p-6 rounded-[2rem] border-4 flex flex-col items-center gap-3 w-1/2 lg:w-auto ${hardwareMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`font-black text-base sm:text-xl uppercase tracking-widest ${hardwareMode ? 'text-amber-400' : 'text-indigo-600'}`}>Num B: {valB}</span>
            <div className="flex gap-3">
              <button onClick={() => setCompB1(compB1 === 0 ? 1 : 0)} className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${compB1 === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-white text-slate-400 border-slate-300'}`}>{compB1}</button>
              <button onClick={() => setCompB0(compB0 === 0 ? 1 : 0)} className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 ${compB0 === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-white text-slate-400 border-slate-300'}`}>{compB0}</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center z-10 w-full lg:w-2/4 relative lg:px-10">
          <div className={`w-full h-40 sm:h-72 rounded-[3rem] flex flex-col items-center justify-center text-white border-8 transition-colors duration-500 ${hardwareMode ? 'bg-slate-900 border-amber-500' : 'bg-slate-800 border-indigo-500'}`}>
            <span className="tracking-widest font-black text-2xl sm:text-4xl">COMPARATOR</span>
            <span className="text-slate-400 text-xs sm:text-sm mt-3 font-black tracking-widest uppercase bg-slate-950/50 px-4 py-2 rounded-xl">XNOR & AND Logic</span>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-8 z-10 w-full lg:w-1/4 items-center lg:items-start p-8 rounded-[2rem] border-4 justify-center ${hardwareMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          <div className="flex items-center gap-4 sm:gap-6 w-full">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 border-4 flex-shrink-0 ${compGT ? 'bg-emerald-400 border-white scale-125 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-800' : 'bg-slate-200 border-slate-300'}`}></div>
            <span className={`font-black text-xl sm:text-3xl tracking-widest transition-colors ${compGT ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>A {'>'} B</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 w-full">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 border-4 flex-shrink-0 ${compEQ ? 'bg-amber-400 border-white scale-125 shadow-[0_0_20px_rgba(251,191,36,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-800' : 'bg-slate-200 border-slate-300'}`}></div>
            <span className={`font-black text-xl sm:text-3xl tracking-widest transition-colors ${compEQ ? 'text-amber-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>A == B</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 w-full">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 border-4 flex-shrink-0 ${compLT ? 'bg-rose-400 border-white scale-125 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-800' : 'bg-slate-200 border-slate-300'}`}></div>
            <span className={`font-black text-xl sm:text-3xl tracking-widest transition-colors ${compLT ? 'text-rose-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>A {'<'} B</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 8. DECODER (2-to-4)
// ==========================================
export const Decoder = ({ hardwareMode }) => {
  const [decA1, setDecA1] = useState(0);
  const [decA0, setDecA0] = useState(0);
  const [enable, setEnable] = useState(1);

  const val = (decA1 << 1) | decA0;
  const y0 = enable && val === 0 ? 1 : 0;
  const y1 = enable && val === 1 ? 1 : 0;
  const y2 = enable && val === 2 ? 1 : 0;
  const y3 = enable && val === 3 ? 1 : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>2-to-4 Decoder</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Combinational Circuit</span>
          {hardwareMode ? "Address Decoder. Activates one specific memory row based on the binary input." : "Translates an n-bit binary input into 2^n unique output lines."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        <div className="flex flex-col gap-6 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex items-center gap-4">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>A1</span>
            <button onClick={() => setDecA1(decA1 === 0 ? 1 : 0)} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${decA1 === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{decA1}</button>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>A0</span>
            <button onClick={() => setDecA0(decA0 === 0 ? 1 : 0)} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${decA0 === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{decA0}</button>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t-4 border-slate-200/20">
            <span className={`font-black uppercase tracking-widest text-sm text-rose-500`}>EN</span>
            <button onClick={() => setEnable(enable === 0 ? 1 : 0)} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${enable === 1 ? 'bg-rose-500 text-white border-rose-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{enable}</button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center z-10 w-full lg:w-2/4 relative lg:px-10 min-h-[320px]">
          <div className={`w-full max-w-[280px] sm:max-w-[320px] h-64 flex-shrink-0 rounded-[2rem] flex flex-col items-center justify-center text-white border-8 transition-colors duration-500 ${hardwareMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-700 border-slate-800'}`}>
            <span className="tracking-widest font-black text-3xl">DECODER</span>
            <span className="text-slate-400 text-xs mt-3 font-black tracking-widest uppercase bg-slate-950/50 px-4 py-2 rounded-xl">2x4 Line</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 z-10 w-full lg:w-1/4 justify-center items-center">
          {[
            { label: 'Y3', val: y3 },
            { label: 'Y2', val: y2 },
            { label: 'Y1', val: y1 },
            { label: 'Y0', val: y0 }
          ].map((out, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 flex-shrink-0 ${out.val === 1 ? 'bg-emerald-400 border-white scale-110 shadow-[0_0_20px_rgba(52,211,153,0.5)] text-emerald-950' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
                <span className={`font-black`}>{out.val}</span>
              </div>
              <span className={`font-black uppercase tracking-widest text-sm ${out.val === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>{out.label}</span>
            </div>
          ))}
        </div>

      </div>

      <div className={`mt-6 w-full max-w-2xl p-6 rounded-3xl border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Concept Check</h4>
        <p className="font-bold">
          A Decoder takes an n-bit binary input and turns exactly one of its 2ⁿ output lines HIGH. If the input is A1=1 and A0=0 (binary 10, or decimal 2), then output Y2 goes HIGH. Notice how turning off the Enable (EN) pin disables all outputs!
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 9. SR LATCH
// ==========================================
export const SRLatch = ({ hardwareMode }) => {
  const [S, setS] = useState(0);
  const [R, setR] = useState(0);
  const [Q, setQ] = useState(0);
  const [Qnot, setQnot] = useState(1);

  const handleS = () => {
    const newS = S === 0 ? 1 : 0;
    setS(newS);
    evaluateLatch(newS, R);
  };

  const handleR = () => {
    const newR = R === 0 ? 1 : 0;
    setR(newR);
    evaluateLatch(S, newR);
  };

  const evaluateLatch = (currS, currR) => {
    if (currS === 1 && currR === 0) {
      setQ(1); setQnot(0); 
    } else if (currS === 0 && currR === 1) {
      setQ(0); setQnot(1); 
    } else if (currS === 1 && currR === 1) {
      setQ(0); setQnot(0); 
    }
  };

  const isInvalid = S === 1 && R === 1;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>SR Latch</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Sequential Memory</span>
          {hardwareMode ? "Cross-coupled gates form simple 1-bit memory. Don't hit Set and Reset at the same time!" : "Set-Reset Latch. Stores a state using feedback. S=1 sets Q=1, R=1 resets Q=0."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        <div className="flex flex-col gap-10 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>SET (S)</span>
            <button onClick={handleS} className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${S === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{S}</button>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>RESET (R)</span>
            <button onClick={handleR} className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${R === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{R}</button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center z-10 w-full lg:w-2/4 relative lg:px-10 min-h-[320px]">
          <div className={`w-full max-w-[280px] sm:max-w-[320px] h-64 flex-shrink-0 rounded-[3rem] flex flex-col items-center justify-center text-white border-8 transition-colors duration-500 ${isInvalid ? 'bg-rose-500 border-rose-600 animate-pulse' : hardwareMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-700 border-slate-800'}`}>
            <span className="tracking-widest font-black text-4xl">NOR LATCH</span>
            <span className="text-slate-100 text-sm mt-4 font-black tracking-widest uppercase bg-black/30 px-6 py-3 rounded-2xl">
              {S === 0 && R === 0 ? "HOLDING STATE" : isInvalid ? "INVALID STATE!" : S === 1 ? "SETTING Q" : "RESETTING Q"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-10 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${Q === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>Q (Out)</span>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${isInvalid ? 'bg-rose-500 border-rose-200 text-white' : Q === 1 ? 'bg-emerald-400 border-white shadow-[0_0_20px_rgba(52,211,153,0.5)] text-emerald-950' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
              <span className={`text-4xl font-black`}>{Q}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${Qnot === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>Q' (Inverted)</span>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${isInvalid ? 'bg-rose-500 border-rose-200 text-white' : Qnot === 1 ? 'bg-emerald-400 border-white shadow-[0_0_20px_rgba(52,211,153,0.5)] text-emerald-950' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
              <span className={`text-4xl font-black`}>{Qnot}</span>
            </div>
          </div>
        </div>

      </div>

      <div className={`mt-6 w-full max-w-2xl p-6 rounded-3xl border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Concept Check</h4>
        <p className="font-bold">
          The SR Latch is the foundation of digital memory. By cross-coupling two NOR gates, it "remembers" its last state even when inputs return to 0 (the HOLD state). However, setting both S and R to 1 creates an Invalid State, forcing both Q and Q' to 0, breaking the rule that they must be opposites.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 10. D FLIP-FLOP (Edge Triggered)
// ==========================================
export const DFlipFlop = ({ hardwareMode }) => {
  const [D, setD] = useState(0);
  const [CLK, setCLK] = useState(0);
  const [Q, setQ] = useState(0);

  const toggleD = () => setD(D === 0 ? 1 : 0);

  const triggerClock = () => {
    setCLK(1);
    setQ(D);
    setTimeout(() => {
      setCLK(0);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>D Flip-Flop</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Edge-Triggered Memory</span>
          {hardwareMode ? "Data is only saved when the clock pulse hits. Notice how Q ignores D until you hit CLK!" : "Delay Flip-Flop. Output Q captures the value of Data (D) only on the rising edge of the Clock."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        <div className="flex flex-col gap-10 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Data (D)</span>
            <button onClick={toggleD} className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${D === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{D}</button>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm text-rose-500`}>Clock Edge ⚡</span>
            <button 
              onClick={triggerClock} 
              disabled={CLK === 1}
              className={`w-24 h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${CLK === 1 ? 'bg-rose-500 text-white border-rose-700 scale-95' : 'bg-white text-rose-500 border-rose-200 hover:bg-rose-50'}`}
            >
              PULSE
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center z-10 w-full lg:w-2/4 relative lg:px-10 min-h-[320px]">
          <div className={`w-full max-w-[280px] sm:max-w-[320px] h-64 flex-shrink-0 rounded-[3rem] flex flex-col items-center justify-center text-white border-8 transition-colors duration-500 ${CLK === 1 ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.5)]' : hardwareMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-700 border-slate-800'}`}>
            <span className="tracking-widest font-black text-4xl">D FLIP-FLOP</span>
            <div className="flex items-center gap-2 mt-4 text-slate-300">
               {CLK === 1 ? (
                 <span className="font-black bg-white/20 px-4 py-2 rounded-xl">SAVING DATA: {D} ➜ Q</span>
               ) : (
                 <span className="font-black bg-black/30 px-4 py-2 rounded-xl">WAITING FOR CLOCK</span>
               )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${Q === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>Q (Saved State)</span>
            <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${Q === 1 ? 'bg-emerald-400 border-white shadow-[0_0_30px_rgba(52,211,153,0.5)] text-emerald-950 scale-110' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
              <span className={`text-5xl font-black`}>{Q}</span>
            </div>
          </div>
        </div>

      </div>

      <div className={`mt-6 w-full max-w-2xl p-6 rounded-3xl border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Concept Check</h4>
        <p className="font-bold">
          Unlike latches which are level-sensitive, a Flip-Flop is edge-triggered. The D Flip-Flop ensures that whatever value is at the Data (D) input is only transferred to the Output (Q) at the exact moment the Clock signal transitions from 0 to 1 (the rising edge).
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 11. DE MORGAN'S THEOREMS
// ==========================================
export const DeMorgan = ({ hardwareMode }) => {
  const [A, setA] = useState(0);
  const [B, setB] = useState(0);
  const [activeTheorem, setActiveTheorem] = useState(1); 

  const notA = A === 1 ? 0 : 1;
  const notB = B === 1 ? 0 : 1;

  const leftSide = activeTheorem === 1 
    ? (!(A === 1 && B === 1) ? 1 : 0) 
    : (!(A === 1 || B === 1) ? 1 : 0); 

  const rightSide = activeTheorem === 1 
    ? ((notA === 1 || notB === 1) ? 1 : 0) 
    : ((notA === 1 && notB === 1) ? 1 : 0); 

  const leftLabel = activeTheorem === 1 ? "!(A · B)" : "!(A + B)";
  const rightLabel = activeTheorem === 1 ? "!A + !B" : "!A · !B";
  const leftGateName = activeTheorem === 1 ? "NAND Gate" : "NOR Gate";
  const rightGateName = activeTheorem === 1 ? "Bubbled OR Gate" : "Bubbled AND Gate";

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-6 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>De Morgan's Theorems</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Boolean Algebra Laws</span>
          {hardwareMode 
            ? "Breaking a bar changes the sign! Toggle below to see how ANDs become ORs and vice versa." 
            : "The complement of the product is the sum of the complements, and the complement of the sum is the product of the complements."}
        </div>
      </div>

      <div className={`flex flex-col sm:flex-row p-2 rounded-3xl mb-10 border-4 w-full sm:w-auto ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
        <button 
          onClick={() => setActiveTheorem(1)} 
          className={`px-6 sm:px-10 py-4 rounded-2xl font-black tracking-widest transition-all text-sm sm:text-base border-4 ${activeTheorem === 1 ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-500'}`}
        >
          Theorem 1 (NAND)
        </button>
        <button 
          onClick={() => setActiveTheorem(2)} 
          className={`px-6 sm:px-10 py-4 rounded-2xl font-black tracking-widest transition-all text-sm sm:text-base border-4 ${activeTheorem === 2 ? 'bg-white border-rose-200 text-rose-600 shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-500'}`}
        >
          Theorem 2 (NOR)
        </button>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col items-center justify-between w-full border-4 transition-colors duration-500 gap-10 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        <div className="flex gap-8 mb-4">
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Input A</span>
            <button onClick={() => setA(A === 0 ? 1 : 0)} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${A === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{A}</button>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Input B</span>
            <button onClick={() => setB(B === 0 ? 1 : 0)} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${B === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{B}</button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-8">
          <div className={`flex-1 p-8 rounded-[2.5rem] border-4 flex flex-col items-center justify-center transition-all ${hardwareMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-50 border-slate-200'}`}>
            <span className="font-black text-xl mb-4 text-slate-400 font-mono">{leftLabel}</span>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${leftSide === 1 ? 'bg-emerald-400 border-white text-emerald-950 scale-110 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-800' : 'bg-slate-200 border-slate-300'}`}>
              <span className={`text-4xl font-black`}>{leftSide}</span>
            </div>
            <span className="mt-4 font-bold text-slate-500 uppercase tracking-widest text-sm">{leftGateName}</span>
          </div>

          <div className="flex items-center justify-center font-black text-4xl text-slate-300">=</div>

          <div className={`flex-1 p-8 rounded-[2.5rem] border-4 flex flex-col items-center justify-center transition-all ${hardwareMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-50 border-slate-200'}`}>
            <span className="font-black text-xl mb-4 text-slate-400 font-mono">{rightLabel}</span>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${rightSide === 1 ? 'bg-emerald-400 border-white text-emerald-950 scale-110 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-800' : 'bg-slate-200 border-slate-300'}`}>
              <span className={`text-4xl font-black`}>{rightSide}</span>
            </div>
            <span className="mt-4 font-bold text-slate-500 uppercase tracking-widest text-sm">{rightGateName}</span>
          </div>
        </div>
      </div>

      <div className={`mt-6 w-full max-w-2xl p-6 rounded-3xl border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Concept Check</h4>
        <p className="font-bold">
          {activeTheorem === 1 
            ? "Theorem 1 shows that taking the complement of an AND operation (NAND) yields the exact same result as taking an OR operation of the complemented variables. A NAND gate is functionally identical to an OR gate with inverted inputs." 
            : "Theorem 2 shows that taking the complement of an OR operation (NOR) yields the exact same result as taking an AND operation of the complemented variables. A NOR gate is functionally identical to an AND gate with inverted inputs."}
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 12. ENCODER (4-to-2 Priority)
// ==========================================
export const Encoder = ({ hardwareMode }) => {
  const [inputs, setInputs] = useState([0, 0, 0, 0]);

  const getOutputs = () => {
    if (inputs[3] === 1) return { y1: 1, y0: 1, valid: 1 };
    if (inputs[2] === 1) return { y1: 1, y0: 0, valid: 1 };
    if (inputs[1] === 1) return { y1: 0, y0: 1, valid: 1 };
    if (inputs[0] === 1) return { y1: 0, y0: 0, valid: 1 };
    return { y1: 0, y0: 0, valid: 0 }; 
  };

  const toggleInput = (idx) => {
    const newInputs = [...inputs];
    newInputs[idx] = newInputs[idx] === 0 ? 1 : 0;
    setInputs(newInputs);
  };

  const { y1, y0, valid } = getOutputs();

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>4-to-2 Priority Encoder</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Combinational Circuit</span>
          {hardwareMode ? "Compresses 4 lines into 2. If multiple buttons are pressed, the highest number wins (Priority)." : "Converts 2^n inputs into an n-bit binary code. Includes a 'Valid' bit for when no inputs are active."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        <div className="flex flex-col gap-4 z-10 w-full lg:w-1/4 justify-center items-center">
          {[3, 2, 1, 0].map((idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>D{idx}</span>
              <button onClick={() => toggleInput(idx)} className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${inputs[idx] === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{inputs[idx]}</button>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center z-10 w-full lg:w-2/4 relative lg:px-10 min-h-[320px]">
          <div className={`w-full max-w-[280px] sm:max-w-[320px] h-72 flex-shrink-0 rounded-[2rem] flex flex-col items-center justify-center text-white border-8 transition-colors duration-500 ${hardwareMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-700 border-slate-800'}`}>
            <span className="tracking-widest font-black text-3xl">ENCODER</span>
            <span className="text-slate-400 text-xs mt-3 font-black tracking-widest uppercase bg-slate-950/50 px-4 py-2 rounded-xl">Priority 4x2</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-4 flex-shrink-0 ${y1 === 1 ? 'bg-emerald-400 border-white shadow-[0_0_20px_rgba(52,211,153,0.5)] text-emerald-950' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
              <span className={`font-black`}>{y1}</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm ${y1 === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>Y1</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-4 flex-shrink-0 ${y0 === 1 ? 'bg-emerald-400 border-white shadow-[0_0_20px_rgba(52,211,153,0.5)] text-emerald-950' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
              <span className={`font-black`}>{y0}</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm ${y0 === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>Y0</span>
          </div>
          <div className="flex items-center gap-4 mt-2 pt-4 border-t-4 border-slate-200/20">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4 flex-shrink-0 ${valid === 1 ? 'bg-rose-500 border-rose-300 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
              <span className={`font-black text-sm`}>{valid}</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-xs ${valid === 1 ? 'text-rose-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>VALID (V)</span>
          </div>
        </div>

      </div>

      <div className={`mt-6 w-full max-w-2xl p-6 rounded-3xl border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Concept Check</h4>
        <p className="font-bold">
          An Encoder does the opposite of a Decoder: it compresses multiple input lines into a smaller binary code. A "Priority" encoder resolves conflicts by only outputting the code for the highest-value active input. The Valid (V) bit ensures we know the difference between "Input D0 is pressed" and "No inputs are pressed."
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 13. JK FLIP-FLOP
// ==========================================
export const JKFlipFlop = ({ hardwareMode }) => {
  const [J, setJ] = useState(0);
  const [K, setK] = useState(0);
  const [CLK, setCLK] = useState(0);
  const [Q, setQ] = useState(0);

  const triggerClock = () => {
    setCLK(1);
    
    setQ((prevQ) => {
      if (J === 0 && K === 0) return prevQ; 
      if (J === 1 && K === 0) return 1;     
      if (J === 0 && K === 1) return 0;     
      if (J === 1 && K === 1) return prevQ === 1 ? 0 : 1; 
      return prevQ;
    });
    
    setTimeout(() => {
      setCLK(0);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>JK Flip-Flop</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Universal Sequential Element</span>
          {hardwareMode ? "Solves the SR Latch crash! Set J and K both to 1, then hit Pulse to watch it Toggle." : "Improves upon the SR Flip-Flop. The J=1, K=1 condition is no longer invalid; it toggles the output state."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        <div className="flex flex-col gap-6 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex items-center gap-4">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>J</span>
            <button onClick={() => setJ(J === 0 ? 1 : 0)} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${J === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{J}</button>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>K</span>
            <button onClick={() => setK(K === 0 ? 1 : 0)} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${K === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{K}</button>
          </div>
          <div className="flex flex-col items-center gap-3 mt-4">
            <button onClick={triggerClock} disabled={CLK === 1} className={`w-24 h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${CLK === 1 ? 'bg-rose-500 text-white border-rose-700 scale-95' : 'bg-white text-rose-500 border-rose-200 hover:bg-rose-50'}`}>PULSE</button>
            <span className={`font-black uppercase tracking-widest text-xs text-rose-500`}>CLK ⚡</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center z-10 w-full lg:w-2/4 relative lg:px-10 min-h-[320px]">
          <div className={`w-full max-w-[280px] sm:max-w-[320px] h-64 flex-shrink-0 rounded-[3rem] flex flex-col items-center justify-center text-white border-8 transition-colors duration-500 ${CLK === 1 ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.5)]' : hardwareMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-700 border-slate-800'}`}>
            <span className="tracking-widest font-black text-4xl">JK FLIP-FLOP</span>
            <div className="flex items-center gap-2 mt-4 text-slate-300">
               {CLK === 1 ? (
                 <span className="font-black bg-white/20 px-4 py-2 rounded-xl uppercase">
                   {J === 0 && K === 0 ? "HOLDING" : J === 1 && K === 0 ? "SETTING" : J === 0 && K === 1 ? "RESETTING" : "TOGGLING"}
                 </span>
               ) : (
                 <span className="font-black bg-black/30 px-4 py-2 rounded-xl">WAITING FOR CLOCK</span>
               )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${Q === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>Q (Out)</span>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${Q === 1 ? 'bg-emerald-400 border-white shadow-[0_0_30px_rgba(52,211,153,0.5)] text-emerald-950 scale-110' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
              <span className={`text-5xl font-black`}>{Q}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${Q === 0 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>Q' (Inv)</span>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${Q === 0 ? 'bg-emerald-400 border-white text-emerald-950' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
              <span className={`text-2xl font-black`}>{Q === 0 ? 1 : 0}</span>
            </div>
          </div>
        </div>

      </div>

      <div className={`mt-6 w-full max-w-2xl p-6 rounded-3xl border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Concept Check</h4>
        <p className="font-bold">
          The JK Flip-Flop resolves the "Invalid State" problem found in SR memory circuits. By feeding the outputs back into the inputs internally, setting J=1 and K=1 creates a "Toggle" state, meaning the output Q flips to its opposite value on every clock edge.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 14. HALF SUBTRACTOR
// ==========================================
export const HalfSubtractor = ({ hardwareMode }) => {
  const [subA, setSubA] = useState(0);
  const [subB, setSubB] = useState(0);
  
  const diffOut = subA !== subB ? 1 : 0; 
  const borrowOut = (subA === 0 && subB === 1) ? 1 : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>Half Subtractor</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Combinational Circuit</span>
          {hardwareMode ? "Calculates A minus B. Notice how the Borrow bit activates when subtracting 1 from 0!" : "Subtracts two binary bits. XOR computes the Difference, while an inverted A ANDed with B computes the Borrow."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-row lg:flex-col gap-6 sm:gap-12 z-10 w-full lg:w-1/4 justify-center">
          <div className="flex flex-col gap-3 w-1/2 lg:w-auto">
            <span className={`font-black uppercase tracking-widest text-center text-sm sm:text-base ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Input A (Minuend)</span>
            <button onClick={() => setSubA(subA === 0 ? 1 : 0)} className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${subA === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{subA}</button>
          </div>
          <div className="flex flex-col gap-3 w-1/2 lg:w-auto">
            <span className={`font-black uppercase tracking-widest text-center text-sm sm:text-base ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Input B (Subtrahend)</span>
            <button onClick={() => setSubB(subB === 0 ? 1 : 0)} className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${subB === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{subB}</button>
          </div>
        </div>

        <div className={`flex flex-col gap-4 sm:gap-8 z-10 w-full lg:w-2/4 items-center justify-center min-h-[320px] py-8 px-6 rounded-[3rem] border-4 shadow-inner ${hardwareMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          <div className={`w-full max-w-[250px] h-24 sm:h-32 flex-shrink-0 rounded-[2rem] flex flex-col items-center justify-center text-white font-black text-2xl sm:text-3xl border-8 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-700 border-slate-600'}`}>
            <span className="tracking-widest">XOR</span>
            <span className="text-slate-400 text-xs sm:text-sm mt-1 uppercase tracking-widest">Calculates Difference</span>
          </div>
          <div className={`w-full max-w-[250px] h-24 sm:h-32 flex-shrink-0 rounded-[2rem] flex flex-col items-center justify-center text-white font-black text-2xl sm:text-3xl border-8 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-700 border-slate-600'}`}>
            <span className="tracking-widest">!A AND B</span>
            <span className="text-slate-400 text-xs sm:text-sm mt-1 uppercase tracking-widest">Calculates Borrow</span>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-6 sm:gap-12 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-5 w-1/2 lg:w-auto">
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${diffOut === 1 ? 'bg-emerald-400 border-white text-emerald-950 scale-110 shadow-[0_0_30px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
              <span className={`text-4xl sm:text-5xl font-black`}>{diffOut}</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm sm:text-xl ${diffOut === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>DIFF</span>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-5 w-1/2 lg:w-auto">
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${borrowOut === 1 ? 'bg-rose-400 border-white text-rose-950 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
              <span className={`text-4xl sm:text-5xl font-black`}>{borrowOut}</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm sm:text-xl ${borrowOut === 1 ? 'text-rose-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>BORROW</span>
          </div>
        </div>
      </div>

      <div className={`mt-6 w-full max-w-2xl p-6 rounded-3xl border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Concept Check</h4>
        <p className="font-bold">
          The Half Subtractor is the mirror to the Half Adder. While the Difference uses the same XOR logic as a Sum, the Borrow bit requires an inverted A. If you try to subtract 1 from 0 (A=0, B=1), the Difference is 1, but you must "Borrow" a 1 from the next column!
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 15. DEMULTIPLEXER (1-to-2)
// ==========================================
export const Demultiplexer = ({ hardwareMode }) => {
  const [dataInput, setDataInput] = useState(0);
  const [demuxSelect, setDemuxSelect] = useState(0);
  
  const y0 = demuxSelect === 0 ? dataInput : 0;
  const y1 = demuxSelect === 1 ? dataInput : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>1-to-2 Demultiplexer</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Combinational Circuit</span>
          {hardwareMode ? "The Data Router. Routes a single input signal to one of multiple output destinations." : "Takes one input data line and routes it to one of 2^n possible output lines based on the Select signal."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-14 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        {/* INPUT */}
        <div className="flex flex-col lg:flex-row items-center gap-4 z-10 w-full lg:w-1/4 justify-center mt-12 lg:mt-0">
          <span className={`font-black uppercase tracking-widest text-xl sm:text-2xl text-center lg:text-right ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>DATA IN</span>
          <button onClick={() => setDataInput(dataInput === 0 ? 1 : 0)} className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${dataInput === 1 ? 'bg-emerald-400 border-white scale-110 text-emerald-950 shadow-[0_0_30px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
            <span className={`text-5xl sm:text-6xl font-black`}>{dataInput}</span>
          </button>
          <div className={`hidden lg:block h-4 w-16 transition-colors duration-300 ${dataInput === 1 ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
        </div>

        {/* CHIP */}
        <div className="flex flex-col items-center justify-center z-10 w-full lg:w-2/4 relative mt-6 lg:mt-0 min-h-[320px]">
          <div className={`w-48 sm:w-56 h-56 sm:h-72 flex-shrink-0 flex flex-col items-center justify-center text-white border-x-8 border-y-0 shadow-xl transition-colors duration-500 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-700 border-slate-600'}`} style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 80%)' }}>
            <span className="tracking-widest font-black text-3xl">DEMUX</span>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2 sm:gap-3">
            <span className="font-black text-rose-500 text-xs sm:text-sm tracking-widest uppercase text-center bg-rose-100/50 px-3 py-1 rounded-lg">SELECT</span>
            <button onClick={() => setDemuxSelect(demuxSelect === 0 ? 1 : 0)} className={`w-16 h-12 sm:w-20 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 bg-rose-500 text-white border-rose-700`}>{demuxSelect}</button>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="flex flex-row lg:flex-col gap-10 sm:gap-16 z-10 w-full lg:w-1/4 justify-center">
          <div className="flex flex-col lg:flex-row items-center gap-4 relative w-1/2 lg:w-auto">
            <div className={`hidden lg:block h-4 w-full transition-colors duration-300 rounded-l-none ${demuxSelect === 0 ? (y0 === 1 ? 'bg-emerald-400' : 'bg-slate-400') : (hardwareMode ? 'bg-slate-700' : 'bg-slate-200')}`}></div>
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all border-4 z-10 mx-auto lg:mx-0 flex-shrink-0 ${y0 === 1 ? 'bg-emerald-400 text-emerald-950 border-emerald-600 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{y0}</div>
            <span className={`font-black uppercase tracking-widest lg:absolute lg:-top-8 text-sm text-center w-full lg:text-right ${y0 === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-500' : 'text-slate-400')}`}>Out 0</span>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-4 relative w-1/2 lg:w-auto">
            <div className={`hidden lg:block h-4 w-full transition-colors duration-300 rounded-l-none ${demuxSelect === 1 ? (y1 === 1 ? 'bg-emerald-400' : 'bg-slate-400') : (hardwareMode ? 'bg-slate-700' : 'bg-slate-200')}`}></div>
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all border-4 z-10 mx-auto lg:mx-0 flex-shrink-0 ${y1 === 1 ? 'bg-emerald-400 text-emerald-950 border-emerald-600 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{y1}</div>
            <span className={`font-black uppercase tracking-widest lg:absolute lg:-bottom-8 text-sm text-center w-full lg:text-right ${y1 === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-500' : 'text-slate-400')}`}>Out 1</span>
          </div>
        </div>

      </div>

      <div className={`mt-6 w-full max-w-2xl p-6 rounded-3xl border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Concept Check</h4>
        <p className="font-bold">
          The DEMUX is the exact opposite of the MUX. Instead of choosing which input gets through, it chooses where a single input goes. If SELECT = 0, the Data travels to Out 0 (and Out 1 is forced to 0).
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 16. T FLIP-FLOP (Toggle)
// ==========================================
export const TFlipFlop = ({ hardwareMode }) => {
  const [T, setT] = useState(0);
  const [CLK, setCLK] = useState(0);
  const [Q, setQ] = useState(0);

  const toggleT = () => setT(T === 0 ? 1 : 0);

  const triggerClock = () => {
    setCLK(1);
    
    setQ((prevQ) => {
      if (T === 1) return prevQ === 1 ? 0 : 1;
      return prevQ;
    });
    
    setTimeout(() => setCLK(0), 500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mt-4 mb-20 animate-fade-in">
      <div className="text-center mb-10 w-full">
        <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${hardwareMode ? 'text-white' : 'text-slate-800'}`}>T Flip-Flop</h2>
        <div className={`p-6 rounded-[2rem] border-4 font-bold text-base sm:text-lg mx-auto max-w-2xl ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-500'}`}>
          <span className={`block text-xs uppercase tracking-widest mb-1 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Edge-Triggered Memory</span>
          {hardwareMode ? "The Counter core. Set T=1 and spam the Clock to watch the output alternate!" : "Toggle Flip-Flop. When T=1, the output toggles state on every clock edge. When T=0, it holds state."}
        </div>
      </div>

      <div className={`p-8 sm:p-14 rounded-[3rem] shadow-xl flex flex-col lg:flex-row items-center justify-between w-full border-4 transition-colors duration-500 gap-10 lg:gap-12 ${hardwareMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        
        {/* INPUTS */}
        <div className="flex flex-col gap-10 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${hardwareMode ? 'text-slate-500' : 'text-slate-400'}`}>Toggle (T)</span>
            <button onClick={toggleT} className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${T === 1 ? hardwareMode ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-indigo-500 text-white border-indigo-700' : hardwareMode ? 'bg-slate-700 text-slate-500 border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-300'}`}>{T}</button>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm text-rose-500`}>Clock Edge ⚡</span>
            <button 
              onClick={triggerClock} 
              disabled={CLK === 1}
              className={`w-24 h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black transition-all border-4 border-b-8 active:border-b-4 active:translate-y-1 flex-shrink-0 ${CLK === 1 ? 'bg-rose-500 text-white border-rose-700 scale-95' : 'bg-white text-rose-500 border-rose-200 hover:bg-rose-50'}`}
            >
              PULSE
            </button>
          </div>
        </div>

        {/* CHIP */}
        <div className="flex flex-col items-center justify-center z-10 w-full lg:w-2/4 relative lg:px-10 min-h-[320px]">
          <div className={`w-full max-w-[280px] sm:max-w-[320px] h-64 flex-shrink-0 rounded-[3rem] flex flex-col items-center justify-center text-white border-8 transition-colors duration-500 ${CLK === 1 ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.5)]' : hardwareMode ? 'bg-slate-900 border-slate-950' : 'bg-slate-700 border-slate-800'}`}>
            <span className="tracking-widest font-black text-4xl text-center">T FLIP-FLOP</span>
            <div className="flex items-center gap-2 mt-4 text-slate-300">
               {CLK === 1 ? (
                 <span className="font-black bg-white/20 px-4 py-2 rounded-xl text-center">
                   {T === 1 ? "TOGGLING STATE" : "HOLDING STATE"}
                 </span>
               ) : (
                 <span className="font-black bg-black/30 px-4 py-2 rounded-xl text-center">WAITING FOR CLOCK</span>
               )}
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="flex flex-col gap-10 z-10 w-full lg:w-1/4 justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <span className={`font-black uppercase tracking-widest text-sm ${Q === 1 ? 'text-emerald-500' : (hardwareMode ? 'text-slate-600' : 'text-slate-400')}`}>Q (Out)</span>
            <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 border-8 flex-shrink-0 ${Q === 1 ? 'bg-emerald-400 border-white shadow-[0_0_30px_rgba(52,211,153,0.5)] text-emerald-950 scale-110' : hardwareMode ? 'bg-slate-700 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
              <span className={`text-5xl font-black`}>{Q}</span>
            </div>
          </div>
        </div>

      </div>

      <div className={`mt-6 w-full max-w-2xl p-6 rounded-3xl border-4 ${hardwareMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${hardwareMode ? 'text-amber-500' : 'text-indigo-500'}`}>Concept Check</h4>
        <p className="font-bold">
          The T (Toggle) Flip-Flop is actually just a JK Flip-Flop where both the J and K inputs are tied together. If T=0, it holds its state. If T=1, it toggles (flips to the opposite state) exactly once per clock pulse. This makes it perfect for building binary counters!
        </p>
      </div>
    </div>
  );
};