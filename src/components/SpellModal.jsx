import React from 'react';

export default function SpellModal({ spell, onClose, onCopy, theme, isCompare = false }) {
  if (!spell || !theme) return null;

  const cleanDescription = spell.description.replace(/<h[1-3][^>]*>.*?<\/h[1-3]>/i, '');

  return (
    <div className={`bg-[#121212] border-2 ${theme.modalBorder} rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${theme.glow || ''}`}>
      {/* Шапка модалки */}
      <div className={`${theme.header} p-4 flex justify-between items-center text-black font-black uppercase italic shadow-md`}>
        <span className="text-xs tracking-widest">{isCompare ? spell.name : 'Спецификация чертежа'}</span>
        <div className="flex gap-4 items-center">
          {/* Добавлена проверка на наличие функции onCopy */}
          {onCopy && (
            <button onClick={() => onCopy(spell)} className="text-[10px] bg-black/20 px-3 py-1.5 rounded hover:bg-black/40 uppercase font-bold transition-colors">Копировать</button>
          )}
          <button onClick={onClose} className="text-3xl leading-none hover:scale-110 transition-transform">&times;</button>
        </div>
      </div>
      
      <div className="p-8 md:p-10 text-amber-50/90 text-lg leading-relaxed max-h-[75vh] overflow-y-auto font-sans custom-scrollbar">
        {/* Заголовок внутри */}
        <h2 className={`text-4xl font-black uppercase italic mb-6 tracking-tighter ${theme.text}`}>
          {spell.name}
        </h2>
        
        {/* Динамические стили для внутреннего HTML заклинания */}
        <style dangerouslySetInnerHTML={{ __html: `
          .spell-desc b, .spell-desc strong { color: ${theme.accent}; font-weight: 800; }
          .spell-desc i { color: ${theme.accent}; opacity: 0.9; font-style: italic; }
          .spell-desc br { margin-bottom: 0.5rem; }
        `}} />
        
        <div 
          className="spell-desc space-y-2 text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: cleanDescription }} 
        />
      </div>
    </div>
  );
}