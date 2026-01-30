import React, { useState } from 'react';

// Импорты текстур
import img20 from '../assets/dice/d20.png';
import img12 from '../assets/dice/d12.png';
import img10 from '../assets/dice/d10.png';
import img8 from '../assets/dice/d8.png';
import img6 from '../assets/dice/d6.png';
import img4 from '../assets/dice/d4.png';

const Die = ({ sides, texture }) => {
  const [result, setResult] = useState(`D${sides}`); 
  const [isRolling, setIsRolling] = useState(false);
  const [status, setStatus] = useState('neutral');

  const roll = () => {
    setIsRolling(true);
    setStatus('neutral'); 
    const val = Math.floor(Math.random() * sides) + 1;
    
    setTimeout(() => {
      setResult(val);
      setIsRolling(false);
      
      if (val === 1) {
        setStatus('fail');
        setTimeout(() => setStatus('neutral'), 2500);
      } else if (val === sides) {
        setStatus('success');
        setTimeout(() => setStatus('neutral'), 2500);
      }
    }, 200);
  };

  return (
    <div className="relative flex items-center group">
      {/* Анимация пульсации для фейла */}
      <style>{`
        @keyframes danger-fade {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-danger {
          animation: danger-fade 0.8s infinite ease-in-out;
        }
      `}</style>

      <button
        onClick={roll}
        className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all active:scale-95 relative overflow-visible bg-transparent"
      >
        {/* СЛОЙ АУРЫ (свечение) — плавно появляется за счет opacity */}
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out blur-xl rounded-full
            ${status === 'fail' ? 'bg-red-600 opacity-60 animate-danger' : 
              status === 'success' ? 'bg-emerald-500 opacity-60' : 'opacity-0'}`}
        />

        {/* СЛОЙ ТЕКСТУРЫ (оригинальный цвет PNG) */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-300"
          style={{ 
            backgroundColor: sides === 100 ? '#000000' : 'transparent',
            borderRadius: sides === 100 ? '9999px' : '0',
            border: sides === 100 ? '2px solid #27272a' : 'none',
            backgroundImage: texture ? `url(${texture})` : 'none',
            backgroundSize: 'contain', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* СЛОЙ ТЕКСТА */}
        <span 
          className="z-10 font-black select-none leading-none flex items-center justify-center transition-all duration-700 ease-in-out"
          style={{
            fontSize: '1.2rem',
            color: '#18181b',
            WebkitTextFillColor: '#18181b',
            textShadow: `
               2px  2px 0 #f59e0b, -2px -2px 0 #f59e0b,
               2px -2px 0 #f59e0b, -2px  2px 0 #f59e0b,
               3px  0px 0 #f59e0b, -3px  0px 0 #f59e0b,
               0px  3px 0 #f59e0b,  0px -3px 0 #f59e0b
               ${status !== 'neutral' ? `, 0 0 15px ${status === 'fail' ? '#ef4444' : '#10b981'}` : ''}
            `
          }}
        >
          {result}
        </span>
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); setResult(`D${sides}`); setStatus('neutral'); }}
        className="absolute -right-2 w-5 h-5 bg-red-900 text-white text-[10px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 border border-black z-20"
      >
        ×
      </button>
    </div>
  );
};

export default function DiceRoller({ setShowDiceInfo }) {
  const diceConfig = [
    { sides: 100, texture: 'black' },
    { sides: 20, texture: img20 },
    { sides: 12, texture: img12 },
    { sides: 10, texture: img10 },
    { sides: 8, texture: img8 },
    { sides: 6, texture: img6 },
    { sides: 4, texture: img4 },
  ];

  return (
    <div className="flex flex-col items-center gap-6 mt-2">
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