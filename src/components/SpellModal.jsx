import React from 'react';

export default function SpellModal({ spell, onClose, onCopy, theme, isCompare = false }) {
  // Убираем из описания блоки, которые могут дублировать название (если они в тегах h1-h3)
  const cleanDescription = spell.description.replace(/<h[1-3][^>]*>.*?<\/h[1-3]>/i, '');

  return (
    <div className={`bg-[#1a1a1a] border-2 ${theme.modalBorder} rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all ${theme.glow || ''}`}>
      <div className={`${theme.header} p-4 flex justify-between items-center text-black font-black uppercase italic`}>
        <span className="text-sm">{isCompare ? spell.name : 'Спецификация чертежа'}</span>
        <div className="flex gap-4 items-center">
          <button onClick={() => onCopy(spell)} className="text-[10px] bg-black/20 px-3 py-1.5 rounded hover:bg-black/40 uppercase font-bold">Копировать</button>
          <button onClick={onClose} className="text-3xl leading-none">&times;</button>
        </div>
      </div>
      
      <div className="p-10 text-amber-50/90 text-lg leading-relaxed max-h-[70vh] overflow-y-auto font-sans custom-scrollbar">
        <h2 className={`text-3xl font-black uppercase italic mb-4 ${theme.text}`}>
          {spell.name}
        </h2>
        
        {/* Инъекция стилей, чтобы покрасить внутренние блоки данных в цвет темы */}
        <style>{`
          .spell-desc b, .spell-desc strong { color: inherit; opacity: 0.8; }
          .spell-desc i { color: ${theme.text.includes('purple') ? '#c084fc' : '#fbbf24'}; font-style: normal; font-weight: bold; }
        `}</style>
        
        <div 
          className="spell-desc"
          dangerouslySetInnerHTML={{ __html: cleanDescription }} 
        />
      </div>
    </div>
  );
}