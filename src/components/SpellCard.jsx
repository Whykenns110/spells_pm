import React from 'react';

export default function SpellCard({ spell, isSelected, isFav, onClick, onFav }) {
  return (
    <div 
      onClick={() => onClick(spell)}
      className={`group relative p-6 bg-[#141414] border-2 rounded-xl cursor-pointer transition-all duration-300 shadow-xl 
      ${isSelected ? 'border-amber-400 scale-[1.02] bg-amber-900/10' : 'border-amber-900/30 hover:border-amber-500'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-amber-100 uppercase group-hover:text-amber-400 leading-tight">
          {spell.name}
        </h3>
        <span className="text-[10px] font-black py-1 px-2 bg-amber-950 text-amber-500 rounded border border-amber-700 whitespace-nowrap">
          {spell.level}
        </span>
      </div>
      
      <div className="flex justify-between items-end mt-8">
        <div className="flex gap-1">
          {spell.components.map(c => (
            <span key={c} className="text-[10px] px-2 py-0.5 bg-black border border-amber-900 text-amber-700 rounded font-bold">
              {c}
            </span>
          ))}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onFav(spell); }}
          className={`text-2xl transition-transform hover:scale-125 ${isFav ? 'text-amber-400' : 'text-amber-900 hover:text-amber-500'}`}
        >
          ★
        </button>
      </div>
      {isSelected && <div className="absolute inset-0 border-2 border-amber-400 rounded-xl animate-ping opacity-20 pointer-events-none"></div>}
    </div>
  );
}