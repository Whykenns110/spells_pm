import React, { useMemo, useState } from "react";
import { spellsData, categories } from "./data/spells";
import SpellCard from "./components/SpellCard";
import SpellModal from "./components/SpellModal";

export default function App() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [activeSpell, setActiveSpell] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavPane, setShowFavPane] = useState(true);

  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareResults, setShowCompareResults] = useState(false);

  const copyToClipboard = (spell) => {
    const cleanText = spell.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    navigator.clipboard.writeText(`${spell.name}\n${cleanText}`).then(() => alert("Скопировано!"));
  };

  const getTheme = (description) => {
    if (description?.includes("Атакующие")) return { modalBorder: "border-red-500", header: "bg-red-600" };
    if (description?.includes("Защитные")) return { modalBorder: "border-blue-500", header: "bg-blue-600" };
    if (description?.includes("Регенерирующие")) return { modalBorder: "border-emerald-500", header: "bg-emerald-600" };
    if (description?.includes("Помехи")) return { modalBorder: "border-purple-500", header: "bg-purple-600" };
    return { modalBorder: "border-amber-500", header: "bg-amber-600" };
  };

  const filteredData = useMemo(() => {
    const result = {};
    Object.entries(spellsData).forEach(([letter, spells]) => {
      const filtered = spells.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = levelFilter === "all" || s.level === levelFilter;
        const matchesCat = !categoryFilter || s.description.includes(categoryFilter);
        return matchesSearch && matchesLevel && matchesCat;
      });
      if (filtered.length) result[letter] = filtered;
    });
    return result;
  }, [search, levelFilter, categoryFilter]);

  const toggleFav = (spell) => {
    setFavorites(prev => prev.find(f => f.name === spell.name) ? prev.filter(f => f.name !== spell.name) : [...prev, spell]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 p-4 md:p-10 font-serif">
      <div className="max-w-7xl mx-auto">
        <header className="border-b-2 border-amber-700/50 pb-6 mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-amber-500 uppercase italic">ЗАКЛИНАНИЯ ПАРОМЕХАНИКА</h1>
          <p className="text-amber-700 text-sm mt-2 uppercase tracking-widest font-sans">v.3.0 | Модульная архитектура</p>
        </header>

        {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
        <div className="flex flex-wrap gap-4 mb-10 bg-[#111] p-6 border border-amber-900/30 rounded-lg items-center shadow-2xl relative">
          <input type="text" placeholder="Поиск..." className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 flex-grow outline-none focus:border-amber-400" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex gap-2 w-full md:w-auto">
            <select className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 flex-grow" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              <option value="all">Все уровни</option>
              <option value="Заговор">Заговоры</option>
              {[1,2,3,4].map(l => <option key={l} value={String(l)}>{l} уровень</option>)}
            </select>
            <button onClick={() => { if(compareMode && compareList.length >= 2) setShowCompareResults(true); setCompareMode(!compareMode); }} className={`px-6 py-3 rounded font-black border-2 transition-all ${compareMode ? 'bg-amber-500 text-black border-white' : 'bg-black text-amber-500 border-amber-900'}`}>
              {compareMode ? `ГОТОВО (${compareList.length})` : 'СРАВНИТЬ'}
            </button>
            <div className="relative">
              <button onClick={() => setShowCategories(!showCategories)} className="px-6 py-3 border border-amber-800/40 rounded hover:bg-amber-900/10 font-bold h-full">Категории</button>
              {showCategories && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-amber-100 text-black rounded-lg shadow-2xl z-[110] p-4 font-sans">
                  <div onClick={() => {setCategoryFilter(null); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-300 px-2 py-1 font-black border-b border-amber-900/20 mb-2 uppercase">Все модули</div>
                  {Object.entries(categories).map(([cat, subs]) => (
                    <div key={cat} className="mb-3">
                      <div className="font-black text-[10px] uppercase text-amber-900/50 mb-1">{cat}</div>
                      {subs.map(s => <div key={s} onClick={() => {setCategoryFilter(s); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-300 px-2 py-1 text-sm font-bold">{s}</div>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <main className="lg:col-span-3 space-y-12">
            {Object.entries(filteredData).map(([letter, spells]) => (
              <div key={letter}>
                <h2 className="text-4xl text-amber-600 font-black mb-6 border-b border-amber-900/20 pb-2 uppercase">{letter}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {spells.map(spell => (
                    <SpellCard 
                      key={spell.name} 
                      spell={spell} 
                      isSelected={compareList.some(s => s.name === spell.name)}
                      isFav={favorites.some(f => f.name === spell.name)}
                      onClick={(s) => compareMode ? (compareList.some(i => i.name === s.name) ? setCompareList(prev => prev.filter(i => i.name !== s.name)) : compareList.length < 3 && setCompareList(prev => [...prev, s])) : setActiveSpell(s)}
                      onFav={toggleFav}
                    />
                  ))}
                </div>
              </div>
            ))}
          </main>

          <aside className="lg:col-span-1 space-y-4">
            <button onClick={() => setShowFavPane(!showFavPane)} className={`w-full py-4 rounded-lg border-2 font-black transition-all ${showFavPane ? 'bg-amber-600 text-black border-amber-400' : 'bg-black text-amber-600 border-amber-900'}`}>★ ИЗБРАННОЕ</button>
            {showFavPane && (
              <div className="bg-[#111] border-2 border-amber-600/30 rounded-xl p-4 space-y-2 shadow-2xl">
                {favorites.length === 0 ? <p className="text-center text-amber-900 text-[10px] uppercase py-4">Пусто</p> :
                  favorites.map(f => (
                    <div key={f.name} onClick={() => setActiveSpell(f)} className="flex items-center justify-between bg-black p-3 rounded border border-amber-900/30 hover:border-amber-500 cursor-pointer">
                      <div className="flex flex-col"><span className="text-[9px] text-amber-700 font-bold uppercase">{f.level}</span><span className="text-sm font-bold text-amber-100 truncate w-32">{f.name}</span></div>
                      <button onClick={(e) => { e.stopPropagation(); toggleFav(f); }} className="text-red-900 hover:text-red-500 text-xl px-2">×</button>
                    </div>
                  ))}
              </div>
            )}
          </aside>
        </div>

        {/* МОДАЛКА СРАВНЕНИЯ */}
        {showCompareResults && (
          <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto flex flex-col h-full">
              <div className="flex justify-between items-center mb-8 border-b border-amber-900/30 pb-4">
                <h2 className="text-3xl font-black text-amber-500 italic uppercase">Анализ модулей</h2>
                <button onClick={() => { setShowCompareResults(false); setCompareList([]); }} className="px-8 py-3 bg-amber-600 text-black font-black rounded-lg">ЗАКРЫТЬ</button>
              </div>
              <div className={`grid gap-6 flex-grow ${compareList.length === 3 ? 'lg:grid-cols-6' : 'lg:grid-cols-2'}`}>
                {compareList.map((spell, idx) => (
                  <div key={spell.name} className={compareList.length === 3 && idx === 0 ? 'lg:col-span-6 lg:max-w-2xl lg:mx-auto w-full' : 'lg:col-span-3'}>
                    <SpellModal 
                      spell={spell} 
                      isCompare={true}
                      theme={getTheme(spell.description)}
                      onCopy={copyToClipboard}
                      onClose={() => { const newList = compareList.filter(s => s.name !== spell.name); newList.length < 2 ? (setShowCompareResults(false), setCompareList([])) : setCompareList(newList); }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ОБЫЧНАЯ МОДАЛКА */}
        {activeSpell && !showCompareResults && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveSpell(null)}>
            <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
              <SpellModal spell={activeSpell} onClose={() => setActiveSpell(null)} onCopy={copyToClipboard} theme={getTheme(activeSpell.description)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}