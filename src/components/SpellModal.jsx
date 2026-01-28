import React from 'react';

export default function SpellModal({ spell, onClose, onCopy, theme, isCompare = false }) {
  return (
    <div className={`bg-[#1a1a1a] border-2 ${theme.modalBorder} rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all ${theme.glow || ''}`}>
      <div className={`${theme.header} p-4 flex justify-between items-center text-black font-black uppercase italic`}>
        <span className="text-sm">{isCompare ? spell.name : 'Спецификация чертежа'}</span>
        <div className="flex gap-4 items-center">
          <button onClick={() => onCopy(spell)} className="text-[10px] bg-black/20 px-3 py-1.5 rounded hover:bg-black/40 uppercase font-bold transition-colors">
            Копировать
          </button>
          <button onClick={onClose} className="text-3xl leading-none hover:opacity-70">&times;</button>
        </div>
      </div>
      
      <div className="p-10 text-amber-50/90 text-lg leading-relaxed max-h-[70vh] overflow-y-auto font-sans custom-scrollbar">
        <h2 className={`text-3xl font-black uppercase italic mb-4 ${theme.text || 'text-amber-400'}`}>
          {spell.name}
        </h2>
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: spell.description }} />
      </div>
    </div>
  );
}