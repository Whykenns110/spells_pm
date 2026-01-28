import React, { useState } from 'react';

const Die = ({ sides, clip, isRound }) => {
  const [result, setResult] = useState(`1к${sides}`);

  const roll = () => {
    const val = Math.floor(Math.random() * sides) + 1;
    setResult(val);
  };

  return (
    <div className="relative flex items-center group">
      <button
        onClick={roll}
        className={`w-12 h-12 md:w-14 md:h-14 bg-black text-white flex items-center justify-center text-[10px] font-black border border-white/20 hover:border-white transition-all active:scale-90 shadow-xl ${isRound ? 'rounded-full' : ''}`}
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

export default function DiceRoller() {
  const diceConfig = [
    { sides: 100, isRound: true },
    { sides: 20, clip: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" },
    { sides: 12, clip: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" },
    { sides: 10, isRound: true },
    { sides: 8, clip: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
    { sides: 6, clip: "inset(0% round 10%)" },
    { sides: 4, clip: "polygon(50% 0%, 100% 100%, 0% 100%)" },
  ];

  return (
    <div className="flex flex-col items-center gap-5 mt-2">
      <button 
        onClick={() => alert("ТЕРМИНАЛ УДАЧИ:\n1. Нажми на кость для броска.\n2. Нажми на крестик для сброса.")}
        className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white font-bold text-xs border border-white/10 hover:bg-black transition-colors mb-2"
      >
        ?
      </button>
      
      {diceConfig.map(d => (
        <Die key={d.sides} {...d} />
      ))}
    </div>
  );
}