import React, { useState } from 'react';

const Die = ({ sides, clip, isRound }) => {
  const [result, setResult] = useState(`1к${sides}`);
  const [isRolling, setIsRolling] = useState(false);

  const roll = () => {
    setIsRolling(true);
    const val = Math.floor(Math.random() * sides) + 1;
    setResult(val);
    setTimeout(() => setIsRolling(false), 200);
  };

  return (
    <div className="relative flex items-center group">
      <button
        onClick={roll}
        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-[11px] md:text-[13px] font-black border border-white/10 transition-all active:scale-95 shadow-xl
          ${isRound ? 'rounded-full' : ''} 
          ${isRolling ? 'bg-red-700 text-white border-red-500' : 'bg-zinc-900 text-amber-50 hover:bg-zinc-800 hover:border-white/30'}`}
        style={{ clipPath: clip }}
      >
        {result}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setResult(`1к${sides}`);
        }}
        className="absolute -right-5 w-4 h-4 bg-red-900 text-white text-[8px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 border border-black z-10"
      >
        ×
      </button>
    </div>
  );
};

// ИСПРАВЛЕНО: Аргумент изменен на setShowDiceInfo, чтобы совпадать с App.jsx
export default function DiceRoller({ setShowDiceInfo }) {
  const diceConfig = [
    { sides: 100, isRound: true },
    { sides: 20, clip: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" },
    { sides: 12, clip: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" },
    { sides: 10, clip: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
    { sides: 8, clip: "polygon(50% 0%, 90% 50%, 50% 100%, 10% 50%)" },
    { sides: 6, clip: "inset(0%)" },
    { sides: 4, clip: "polygon(50% 0%, 100% 100%, 0% 100%)" },
  ];

  return (
    <div className="flex flex-col items-center gap-5 mt-2">
      <button 
        onClick={() => setShowDiceInfo(true)} // ИСПРАВЛЕНО: вызываем верную функцию
        className="w-8 h-8 bg-[#3d2314] rounded-full flex items-center justify-center text-amber-500 font-black italic text-xs shadow-lg hover:bg-black transition-colors border border-amber-900/20"
      >
        ?
      </button>
      
      {diceConfig.map(d => (
        <Die key={d.sides} {...d} />
      ))}
    </div>
  );
}