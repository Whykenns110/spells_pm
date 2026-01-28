import React from 'react';

export default function SpellCard({ spell, isSelected, isFav, onClick, onFav }) {
  return (
    <div 
      onClick={() => onClick(spell)}
      className={`group relative p-3 bg-[#141414] border-2 rounded-lg cursor-pointer transition-all duration-300 shadow-lg 
      ${isSelected ? 'border-amber-400 scale-[1.02] bg-amber-900/10' : 'border-amber-900/30 hover:border-amber-500'}`}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-sm font-bold text-amber-100 uppercase group-hover:text-amber-400 leading-tight truncate">
          {spell.name}
        </h3>
        <span className="text-[8px] font-black py-0.5 px-1 bg-amber-950 text-amber-500 rounded border border-amber-700 uppercase">
          {spell.level}
        </span>
      </div>
      
      <div className="flex justify-between items-end mt-4">
        <div className="flex gap-1">
          {spell.components.map(c => (
            <span key={c} className="text-[8px] px-1.5 py-0.5 bg-black border border-amber-900 text-amber-700 rounded font-bold">
              {c}
            </span>
          ))}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onFav(spell); }}
          className={`text-lg transition-transform hover:scale-125 ${isFav ? 'text-amber-400' : 'text-amber-900 hover:text-amber-500'}`}
        >
          ★
        </button>
      </div>
    </div>
  );
}