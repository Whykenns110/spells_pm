import React from 'react';
import SidebarTools from "./SidebarTools";

export default function FilterPanel({ 
  search, setSearch, 
  levelFilter, setLevelFilter, 
  distFilter, setDistFilter, 
  compFilter, setCompFilter,
  showCategories, setShowCategories,
  categoryFilter,
  compareMode, compareList, setCompareMode, setCompareList, setShowCompareResults
}) {
  return (
    <div className="bg-[#111] p-3 border border-amber-900/30 rounded-lg shadow-xl w-full max-w-[1200px] z-20">
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <input 
          type="text" 
          placeholder="Поиск чертежа..." 
          className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 flex-grow text-xs outline-none focus:border-amber-500 transition-colors" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        
        {/* УРОВНИ */}
        <select 
          className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 text-[10px] font-bold uppercase outline-none cursor-pointer hover:border-amber-500" 
          value={levelFilter} 
          onChange={e => setLevelFilter(e.target.value)}
        >
          <option value="all">Все уровни</option>
          <option value="Заговор">Заговоры</option>
          {[1, 2, 3, 4].map(l => <option key={l} value={String(l)}>{l} уровень</option>)}
        </select>

        {/* ПЕРЕПИСАННАЯ ДАЛЬНОСТЬ */}
        <select 
          className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 text-[10px] font-bold uppercase outline-none cursor-pointer hover:border-amber-500" 
          value={distFilter} 
          onChange={e => setDistFilter(e.target.value)}
        >
          <option value="all">📡 Дальность: Любая</option>
          <optgroup label="Ближний бой" className="bg-zinc-900 text-amber-600">
            <option value="self">На себя</option>
            <option value="touch">Касание</option>
          </optgroup>
          <optgroup label="Дистанция (футы)" className="bg-zinc-900 text-amber-600">
            <option value="30">До 30 фт</option>
            <option value="60">30 - 60 фт</option>
            <option value="120">60 - 120 фт</option>
            <option value="long">Сверхдальние (120+)</option>
          </optgroup>
        </select>

        {/* КОМПОНЕНТЫ */}
        <div className="flex bg-black border border-amber-900/50 rounded p-1 gap-1">
          {['В', 'С', 'М'].map(c => (
            <button 
              key={c} 
              onClick={() => setCompFilter(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])} 
              className={`w-7 h-7 rounded text-[9px] font-black transition-all ${compFilter.includes(c) ? 'bg-amber-600 text-black shadow-inner' : 'text-amber-900 hover:text-amber-700'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <SidebarTools type="calc" />
          <SidebarTools type="notes" />
        </div>
      </div>

      <div className="flex gap-2 items-center border-t border-amber-900/10 pt-2 relative">
          <button 
            onClick={() => setShowCategories(!showCategories)} 
            className={`px-3 py-1.5 border rounded font-bold text-[9px] uppercase transition-all ${showCategories || categoryFilter ? 'bg-amber-500 text-black' : 'border-amber-800/40 text-amber-500 hover:border-amber-500'}`}
          >
            {categoryFilter ? `Категория: ${categoryFilter} ▼` : 'Категории ▼'}
          </button>

          <div className="ml-auto flex gap-1">
            <button 
              onClick={() => { if(compareMode && compareList.length >= 2) setShowCompareResults(true); setCompareMode(!compareMode); }} 
              className={`px-4 py-1.5 rounded font-black border-2 text-[9px] transition-all ${compareMode ? 'bg-amber-500 text-black border-white shadow-lg' : 'bg-black text-amber-500 border-amber-900 hover:border-amber-500'}`}
            >
              {compareMode ? `АНАЛИЗ (${compareList.length}/3)` : 'СРАВНИТЬ'}
            </button>
            {compareMode && (
              <button onClick={() => { setCompareMode(false); setCompareList([]); }} className="px-2 py-1.5 bg-red-950 text-red-500 rounded border-2 border-red-900 text-[9px] font-black hover:bg-red-800 transition-all">❌</button>
            )}
          </div>
      </div>
    </div>
  );
}