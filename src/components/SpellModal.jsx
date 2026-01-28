import React from 'react';

export default function SpellModal({ spell, onClose, onCopy, theme, isCompare = false }) {
  return (
    <div className={`bg-[#1a1a1a] border-2 ${theme.modalBorder} rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all`}>
      <div className={`${theme.header} p-4 flex justify-between items-center text-black font-black uppercase italic`}>
        <span className="text-sm">{isCompare ? spell.name : 'Спецификация'}</span>
        <div className="flex gap-4 items-center">
          <button onClick={() => onCopy(spell)} className="text-[10px] bg-black/20 px-3 py-1.5 rounded hover:bg-black/40 uppercase font-bold">
            Копировать
          </button>
          <button onClick={onClose} className="text-3xl leading-none">&times;</button>
        </div>
      </div>
      <div className="p-10 text-amber-50/90 text-lg leading-relaxed max-h-[70vh] overflow-y-auto font-sans" 
           dangerouslySetInnerHTML={{ __html: spell.description }} />
    </div>
  );
}