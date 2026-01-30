import React, { useState } from 'react';

const Die = ({ sides, clip, isRound }) => {
  const [result, setResult] = useState(`1к${sides}`);
  const [isRolling, setIsRolling] = useState(false);
  const [status, setStatus] = useState('neutral');

  const roll = () => {
    setIsRolling(true);
    setStatus('neutral'); 
    
    const val = Math.floor(Math.random() * sides) + 1;
    
    setTimeout(() => {
      setResult(val);
      setIsRolling(false); // Останавливаем "золотую" фазу
      
      if (val === 1) {
        setStatus('fail');
        setTimeout(() => setStatus('neutral'), 2000);
      } else if (val === sides) {
        setStatus('success');
        setTimeout(() => setStatus('neutral'), 2000);
      } else {
        setStatus('neutral');
      }
    }, 200);
  };

  // Выбираем цвет для фазы броска и фазы результата
  let colorClasses = 'bg-zinc-900 text-amber-50 border-white/10 hover:bg-zinc-800 hover:border-white/30';
  
  if (isRolling) {
    // Цвет ПРИ НАЖАТИИ (нейтрально-янтарный, а не красный)
    colorClasses = 'bg-amber-600 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
  } else if (status === 'fail') {
    colorClasses = 'bg-red-600 text-white border-red-400';
  } else if (status === 'success') {
    colorClasses = 'bg-emerald-600 text-white border-emerald-400';
  }

  return (
    <div className="relative flex items-center group">
      <button
        onClick={roll}
        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-[11px] md:text-[13px] font-black border transition-all active:scale-95 shadow-xl ${isRound ? 'rounded-full' : ''} ${colorClasses}`}
        style={{ clipPath: clip }}
      >
        {result}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setResult(`1к${sides}`);
          setStatus('neutral');
        }}
        className="absolute -right-5 w-4 h-4 bg-red-900 text-white text-[8px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 border border-black z-10"
      >
        ×
      </button>
    </div>
  );
};

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
        onClick={() => setShowDiceInfo(true)}
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