import React from 'react';
import SpellCard from '../components/SpellCard';

export default function CombatMode({ favorites, compareList, toggleFav, setActiveSpell, compareMode, setCompareList, setCompareMode, setShowCompareResults }) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {/* Боевой заголовок */}
      <div className="bg-red-950/20 border-2 border-red-600 p-6 rounded-xl mb-8 flex justify-between items-center shadow-[0_0_30px_rgba(220,38,38,0.1)]">
        <div>
          <h2 className="text-3xl font-black text-red-500 uppercase italic tracking-tighter">Боевой протокол активен</h2>
          <p className="text-red-800 text-xs uppercase font-sans mt-1">Система вывела приоритетные модули на главный экран</p>
        </div>
        <div className="flex gap-4">
            <div className="text-right hidden md:block">
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
              onClick={(s) => compareMode ? (compareList.some(i => i.name === s.name) ? setCompareList(prev => prev.filter(i => i.name !== s.name)) : compareList.length < 3 && setCompareList(prev => [...prev, s])) : setActiveSpell(s)}
              onFav={toggleFav}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border-2 border-dashed border-red-900/20 rounded-3xl">
          <div className="text-6xl mb-4 opacity-20">⚠️</div>
          <p className="text-red-900 uppercase font-black text-xl italic">Архив пуст</p>
          <p className="text-red-950 text-sm mt-2 max-w-xs mx-auto">Для работы протокола необходимо предварительно добавить модули в избранное</p>
        </div>
      )}
    </div>
  );
}