import React, { useMemo, useState, useEffect } from "react";
import { spellsData, categories } from "./data/spells";
import SpellCard from "./components/SpellCard";
import SpellModal from "./components/SpellModal";
import CombatMode from "./modules/CombatMode"; // Импорт нового модуля

export default function App() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [activeSpell, setActiveSpell] = useState(null);
  const [isCombatMode, setIsCombatMode] = useState(false);
  const [showCombatInfo, setShowCombatInfo] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("paromechanic_favs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("paromechanic_favs", JSON.stringify(favorites));
  }, [favorites]);

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
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-serif">
      <header className="p-10 pb-6">
        <h1 className="text-4xl md:text-6xl font-black text-amber-500 uppercase italic">АРХИВ ПАРОМЕХАНИКА</h1>
        <p className="text-amber-700 text-sm mt-2 uppercase tracking-widest font-sans">v.5.2 | Модульная архитектура</p>
      </header>

      <div className="flex gap-4 px-4 md:px-10 pb-10 relative">
        
        {/* ЛЕВАЯ ПАНЕЛЬ С КРЫШЕЙ */}
        <div className="w-12 md:w-20 flex flex-col items-center sticky top-6 h-[calc(100vh-48px)] z-50">
          <div className="w-full bg-amber-600 pt-3 pb-2 rounded-t-2xl border-b-2 border-black/20 flex flex-col items-center shadow-lg">
            <div className="w-8 h-1 bg-black/30 rounded-full mb-2"></div>
            <span className="text-[7px] md:text-[8px] font-black text-black uppercase leading-none text-center px-1">ИГРОВАЯ ПАНЕЛЬ</span>
          </div>

          <div className="w-full bg-amber-500 flex-grow flex flex-col items-center py-6 gap-4 shadow-2xl rounded-b-xl">
            <button 
              onClick={() => setIsCombatMode(!isCombatMode)}
              className={`w-10 h-10 md:w-14 md:h-14 rounded-lg flex flex-col items-center justify-center transition-all shadow-xl border-b-4 
                ${isCombatMode ? 'bg-red-600 border-red-900 translate-y-1' : 'bg-black border-zinc-800 hover:bg-zinc-900'}`}
            >
              <span className="text-white text-xl">⚔️</span>
              <span className="text-[7px] text-white font-bold mt-1 uppercase">{isCombatMode ? 'ON' : 'OFF'}</span>
            </button>

            <button 
              onClick={() => setShowCombatInfo(true)}
              className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 border-b-4 border-blue-900 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg animate-pulse"
            >
              <span className="text-white font-black text-sm">i</span>
            </button>

            <div className="w-full h-[1px] bg-black/10 my-2"></div>
            <div className="text-black font-black text-[10px] uppercase vertical-text tracking-widest opacity-40 mt-auto pb-4">Action_Panel</div>
          </div>
        </div>

        {/* КОНТЕНТНАЯ ОБЛАСТЬ */}
        <div className="flex-grow flex flex-col gap-6 min-w-0">
          
          {isCombatMode ? (
            /* РЕЖИМ БОЯ (Внешний модуль) */
            <CombatMode 
              favorites={favorites} 
              compareList={compareList}
              toggleFav={toggleFav}
              setActiveSpell={setActiveSpell}
              compareMode={compareMode}
              setCompareList={setCompareList}
              setCompareMode={setCompareMode}
              setShowCompareResults={setShowCompareResults}
            />
          ) : (
            /* ОБЫЧНЫЙ РЕЖИМ */
            <>
              <div className="sticky top-0 z-[40] bg-[#0a0a0a] pt-2 pb-4 border-b-2 border-amber-500/50">
                <div className="flex flex-wrap gap-4 bg-[#111] p-4 border border-amber-900/30 rounded-lg items-center shadow-2xl">
                  <input type="text" placeholder="Поиск чертежа..." className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 flex-grow outline-none focus:border-amber-400 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <div className="flex gap-2 w-full md:w-auto">
                    <select className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 text-sm" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                      <option value="all">Все уровни</option>
                      <option value="Заговор">Заговоры</option>
                      {[1,2,3,4].map(l => <option key={l} value={String(l)}>{l} уровень</option>)}
                    </select>
                    <button onClick={() => { if(compareMode && compareList.length >= 2) setShowCompareResults(true); setCompareMode(!compareMode); }} className={`px-4 py-3 rounded font-black border-2 text-[10px] transition-all ${compareMode ? 'bg-amber-500 text-black border-white' : 'bg-black text-amber-500 border-amber-900'}`}>
                      {compareMode ? `ГОТОВО` : 'СРАВНИТЬ'}
                    </button>
                    <button onClick={() => setShowCategories(!showCategories)} className="px-4 py-3 border border-amber-800/40 rounded hover:bg-amber-900/10 font-bold text-[10px] uppercase text-amber-500">Категории</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                <main className="lg:col-span-3 space-y-10">
                  {Object.entries(filteredData).map(([letter, spells]) => (
                    <div key={letter}>
                      <h2 className="text-xl text-amber-600 font-black mb-4 uppercase border-l-4 border-amber-900 pl-3 tracking-tighter">{letter}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

                <aside className="lg:col-span-1 sticky top-[120px] max-h-[calc(100vh-160px)] overflow-y-auto pr-2 custom-scrollbar font-sans">
                  <button onClick={() => setShowFavPane(!showFavPane)} className={`w-full py-3 rounded-t-lg border-2 font-black text-sm transition-all ${showFavPane ? 'bg-amber-600 text-black border-amber-400 shadow-lg' : 'bg-black text-amber-600 border-amber-900'}`}>★ АРХИВ</button>
                  {showFavPane && (
                    <div className="bg-[#111] border-2 border-t-0 border-amber-600/30 rounded-b-xl p-3 space-y-2">
                      {favorites.length === 0 ? <p className="text-center text-amber-900 text-[10px] uppercase py-4 italic">Пусто</p> :
                        favorites.map(f => (
                          <div key={f.name} onClick={() => setActiveSpell(f)} className="flex items-center justify-between bg-black p-2 rounded border border-amber-900/30 hover:border-amber-500 cursor-pointer group">
                            <div className="flex flex-col"><span className="text-[8px] text-amber-700 font-bold uppercase">{f.level}</span><span className="text-[10px] font-bold text-amber-100 group-hover:text-amber-400 truncate w-24 uppercase">{f.name}</span></div>
                            <button onClick={(e) => { e.stopPropagation(); toggleFav(f); }} className="text-red-900 hover:text-red-500 text-lg px-1">×</button>
                          </div>
                        ))}
                    </div>
                  )}
                </aside>
              </div>
            </>
          )}
        </div>
      </div>

      {/* МОДАЛКА ИНФО */}
      {showCombatInfo && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowCombatInfo(false)}>
          <div className="bg-amber-100 p-8 rounded-2xl max-w-sm w-full border-4 border-amber-600 shadow-[0_0_50px_rgba(217,119,6,0.5)] text-center relative" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-4">⚒️</div>
            <h3 className="text-black font-black text-xl uppercase mb-4 italic leading-none">Система Боя</h3>
            <p className="text-amber-900 font-bold leading-tight text-sm">Добавьте нужные заклинания в <span className="text-amber-600 italic">избранное</span>, чтобы они отображались в боевом режиме. Нажмите на ⚔️ для активации.</p>
            <button onClick={() => setShowCombatInfo(false)} className="mt-8 w-full bg-black text-amber-500 py-3 rounded-lg font-black uppercase hover:bg-zinc-900 transition-all border-b-4 border-amber-800">ПОНЯЛ</button>
          </div>
        </div>
      )}

      {/* МОДАЛКИ МОДУЛЕЙ */}
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
                  <SpellModal spell={spell} isCompare={true} theme={getTheme(spell.description)} onCopy={copyToClipboard} onClose={() => { const newList = compareList.filter(s => s.name !== spell.name); newList.length < 2 ? (setShowCompareResults(false), setCompareList([])) : setCompareList(newList); }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeSpell && !showCompareResults && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveSpell(null)}>
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <SpellModal spell={activeSpell} onClose={() => setActiveSpell(null)} onCopy={copyToClipboard} theme={getTheme(activeSpell.description)} />
          </div>
        </div>
      )}
    </div>
  );
}