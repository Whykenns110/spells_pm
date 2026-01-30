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
        setTimeout(() => setStatus('neutral'), 2500); // Увеличил время, чтобы насладиться анимацией
      } else if (val === sides) {
        setStatus('success');
        setTimeout(() => setStatus('neutral'), 2500);
      }
    }, 200);
  };

  // Настройка фильтров и анимаций
  let diceFilter = 'brightness(0.15) contrast(1.2)'; 
  let animationClass = '';
  let textGlow = '';

  if (status === 'fail') {
    diceFilter = 'sepia(1) saturate(20) hue-rotate(-50deg) drop-shadow(0 0 15px #ef4444) drop-shadow(0 0 25px #ef4444)';
    animationClass = 'animate-danger-pulse'; // Кастомный класс мигания
    textGlow = '0 0 10px #ef4444, 0 0 20px #ef4444';
  } else if (status === 'success') {
    diceFilter = 'sepia(1) saturate(20) hue-rotate(90deg) drop-shadow(0 0 15px #10b981) drop-shadow(0 0 25px #10b981)';
    textGlow = '0 0 10px #10b981, 0 0 20px #10b981';
  }

  return (
    <div className="relative flex items-center group">
      {/* Добавляем стили анимации прямо в компонент */}
      <style>{`
        @keyframes danger-pulse {
          0%, 100% { filter: sepia(1) saturate(20) hue-rotate(-50deg) drop-shadow(0 0 15px #ef4444) drop-shadow(0 0 25px #ef4444) brightness(1); }
          50% { filter: sepia(1) saturate(25) hue-rotate(-50deg) drop-shadow(0 0 25px #ff0000) drop-shadow(0 0 40px #ff0000) brightness(1.5); }
        }
        .animate-danger-pulse {
          animation: danger-pulse 0.8s infinite ease-in-out;
        }
      `}</style>

      <button
        onClick={roll}
        className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all active:scale-95 relative overflow-visible bg-transparent`}
      >
        {/* Слой с текстурой */}
        <div 
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${animationClass}`}
          style={{ 
            backgroundColor: sides === 100 ? '#18181b' : 'transparent',
            borderRadius: sides === 100 ? '9999px' : '0',
            border: sides === 100 ? '2px solid #27272a' : 'none',
            backgroundImage: texture ? `url(${texture})` : 'none',
            backgroundSize: 'contain', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: diceFilter
          }}
        />

        {/* Слой с текстом */}
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
               ${textGlow ? ', ' + textGlow : ''}
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
    { sides: 100 },
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