import React from 'react';
import SpellCard from '../components/SpellCard';

export default function CombatMode({ 
  favorites, 
  compareList, 
  toggleFav, 
  setActiveSpell, 
  compareMode, 
  setCompareList, 
  setCompareMode, 
  setShowCompareResults 
}) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {/* Боевой заголовок — Система управления интегрирована */}
      <div className="bg-red-950/20 border-2 border-red-600 p-6 rounded-xl mb-8 flex justify-between items-center shadow-[0_0_30px_rgba(220,38,38,0.1)]">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black text-red-500 uppercase italic tracking-tighter">Боевой протокол активен</h2>
          <p className="text-red-800 text-xs uppercase font-sans mt-1">Система вывела приоритетные модули на главный экран</p>
        </div>

        <div className="flex gap-6 items-center">
          {/* Индикатор Сравнения в режиме боя */}
          {compareMode && (
            <button 
              onClick={() => compareList.length >= 2 && setShowCompareResults(true)}
              className={`px-4 py-2 rounded font-black text-[10px] uppercase transition-all ${
                compareList.length >= 2 
                ? 'bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                : 'bg-zinc-800 text-red-900 border border-red-900/30'
              }`}
            >
              Анализ: {compareList.length}/3
            </button>
          )}

          <button 
            onClick={() => {
              if (compareMode && compareList.length >= 2) {
                setShowCompareResults(true);
              } else {
                setCompareMode(!compareMode);
                if (!compareMode) setCompareList([]); // Очистка при включении
              }
            }}
            className={`px-4 py-2 border-2 rounded font-black text-[10px] uppercase transition-all ${
              compareMode ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-red-900 text-red-900 hover:border-red-600 hover:text-red-600'
            }`}
          >
            {compareMode ? 'ОТМЕНА' : 'СРАВНИТЬ'}
          </button>

          <div className="text-right hidden md:block border-l border-red-900/30 pl-6">
            <span className="block text-red-500 font-black text-xl leading-none">{favorites.length}</span>
            <span className="text-[10px] text-red-900 uppercase">Чертежей</span>
          </div>
        </div>
      </div>

      {/* Сетка только для избранного */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map(spell => (
            <SpellCard 
              key={spell.name} 
              spell={spell} 
              isFav={true}
              isSelected={compareList.some(s => s.name === spell.name)}
              onClick={() => {
                if (compareMode) {
                  const isSelected = compareList.some(i => i.name === spell.name);
                  if (isSelected) {
                    setCompareList(prev => prev.filter(i => i.name !== spell.name));
                  } else if (compareList.length < 3) {
                    setCompareList(prev => [...prev, spell]);
                  }
                } else {
                  setActiveSpell(spell);
                }
              }}
              onFav={toggleFav}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border-2 border-dashed border-red-900/20 rounded-3xl bg-red-950/5">
          <div className="text-6xl mb-4 opacity-40">⚠️</div>
          <p className="text-red-900 uppercase font-black text-xl italic">Боевая память пуста</p>
          <p className="text-red-900 text-sm mt-2 max-w-xs mx-auto font-sans">
            Перейдите в архив и отметьте нужные модули символом ★ для активации протокола
          </p>
        </div>
      )}
    </div>
  );
}