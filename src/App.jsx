import React, { useMemo, useState, useEffect } from "react";
import { spellsData, categories } from "./data/spells";
import SpellCard from "./components/SpellCard";
import SpellModal from "./components/SpellModal";
import CombatMode from "./modules/CombatMode";

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

  // Исправленная функция клика по карточке
  const handleSpellClick = (spell) => {
    if (compareMode) {
      const alreadySelected = compareList.some(s => s.name === spell.name);
      if (alreadySelected) {
        setCompareList(prev => prev.filter(s => s.name !== spell.name));
      } else if (compareList.length < 3) {
        setCompareList(prev => [...prev, spell]);
      }
    } else {
      setActiveSpell(spell);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-serif overflow-x-hidden">
      <header className="p-10 pb-6 max-w-[1600px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-amber-500 uppercase italic leading-tight">АРХИВ ПАРОМЕХАНИКА</h1>
        <p className="text-amber-700 text-sm mt-2 uppercase tracking-widest font-sans">v.6.5 | Фикс багов клика</p>
      </header>

      <div className="flex gap-6 px-4 md:px-10 pb-10 max-w-[1600px] mx-auto relative">
        
        {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
        <div className="w-24 md:w-36 flex-shrink-0 flex flex-col items-center sticky top-6 h-[calc(100vh-48px)] z-[100]">
          <div className="w-full bg-amber-600 pt-5 pb-3 rounded-t-2xl border-b-2 border-black/20 flex flex-col items-center">
             <span className="text-[10px] md:text-xs font-black text-black text-center">ПАНЕЛЬ</span>
          </div>
          <div className="w-full bg-amber-500 flex-grow flex flex-col items-center py-8 gap-8 shadow-2xl rounded-b-xl border-x border-b border-amber-600/50">
            <button onClick={() => setIsCombatMode(!isCombatMode)} className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center transition-all shadow-xl border-b-4 ${isCombatMode ? 'bg-red-700 border-red-950 translate-y-1' : 'bg-zinc-900 border-black hover:bg-zinc-800'}`}>
              <span className="text-white text-3xl">⚔️</span>
              <span className="text-[9px] text-white font-black mt-1 uppercase italic">БОЙ</span>
            </button>
            <button onClick={() => setShowCombatInfo(true)} className="w-10 h-10 md:w-14 md:h-14 bg-[#3d2314] border-b-4 border-[#1a0f08] rounded-full flex items-center justify-center hover:bg-[#4d2d1a] transition-all shadow-lg">
              <span className="text-amber-500 font-black text-xl italic">i</span>
            </button>
            <div className="mt-auto pb-8 opacity-40 select-none">
               <div className="text-black font-black text-[11px] uppercase vertical-text tracking-widest">SYSTEM</div>
            </div>
          </div>
        </div>

        {/* ОСНОВНАЯ ЗОНА */}
        <div className="flex-grow flex flex-col gap-6 min-w-0">
          
          {isCombatMode ? (
            <CombatMode favorites={favorites} compareList={compareList} toggleFav={toggleFav} setActiveSpell={setActiveSpell} compareMode={compareMode} setCompareList={setCompareList} setCompareMode={setCompareMode} setShowCompareResults={setShowCompareResults} />
          ) : (
            <>
              {/* ПОИСК + КАТЕГОРИИ + СРАВНЕНИЕ */}
              <div className="sticky top-0 z-[110] bg-[#0a0a0a] pt-2 pb-4 border-b-2 border-amber-500/50">
                <div className="flex flex-wrap gap-4 bg-[#111] p-4 border border-amber-900/30 rounded-lg items-center shadow-2xl relative">
                  <input type="text" placeholder="Поиск чертежа..." className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 flex-grow outline-none focus:border-amber-400 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
                  
                  <div className="flex gap-2 items-center">
                    <select className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 text-sm outline-none" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                      <option value="all">Уровни</option>
                      <option value="Заговор">Заговоры</option>
                      {[1,2,3,4].map(l => <option key={l} value={String(l)}>{l} ур.</option>)}
                    </select>

                    {/* СРАВНЕНИЕ С КНОПКОЙ ОТМЕНЫ */}
                    <div className="flex gap-1">
                      <button onClick={() => { if(compareMode && compareList.length >= 2) setShowCompareResults(true); setCompareMode(!compareMode); }} className={`px-4 py-3 rounded font-black border-2 text-[10px] transition-all ${compareMode ? 'bg-amber-500 text-black border-white shadow-[0_0_15px_white]' : 'bg-black text-amber-500 border-amber-900'}`}>
                        {compareMode ? `АНАЛИЗ (${compareList.length})` : 'СРАВНИТЬ'}
                      </button>
                      {compareMode && (
                        <button onClick={() => { setCompareMode(false); setCompareList([]); }} className="px-3 py-3 bg-red-950 text-red-500 rounded border-2 border-red-900 text-[10px] font-black hover:bg-red-800 transition-colors">
                          ❌
                        </button>
                      )}
                    </div>

                    {/* КАТЕГОРИИ */}
                    <div className="relative">
                        <button onClick={() => setShowCategories(!showCategories)} className={`px-4 py-3 border rounded font-bold text-[10px] uppercase transition-colors ${showCategories ? 'bg-amber-500 text-black' : 'border-amber-800/40 text-amber-500 hover:bg-amber-900/10'}`}>
                            Категории
                        </button>
                        {showCategories && (
                        <div className="absolute top-full right-0 mt-3 w-64 bg-[#efe7d6] text-black rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-[300] p-4 font-sans border-2 border-amber-700">
                            <div onClick={() => {setCategoryFilter(null); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-200 px-2 py-2 font-black border-b border-amber-900/20 mb-2 uppercase text-xs">Все модули</div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar-light">
                                {Object.entries(categories).map(([cat, subs]) => (
                                <div key={cat} className="mb-3">
                                    <div className="font-black text-[10px] uppercase text-amber-900/50 mb-1 tracking-widest">{cat}</div>
                                    {subs.map(s => <div key={s} onClick={() => {setCategoryFilter(s); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-300 px-2 py-1.5 text-[11px] font-bold border-l-2 border-transparent hover:border-amber-600 transition-all">{s}</div>)}
                                </div>
                                ))}
                            </div>
                        </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-grow space-y-12">
                  {Object.entries(filteredData).map(([letter, spells]) => (
                    <div key={letter} className="animate-in fade-in duration-500">
                      <h2 className="text-2xl text-amber-600 font-black mb-6 uppercase border-l-4 border-amber-600 pl-4">{letter}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {spells.map(spell => (
                          <div key={spell.name} className="w-full max-w-[300px]">
                            <SpellCard 
                                spell={spell} 
                                isSelected={compareList.some(s => s.name === spell.name)}
                                isFav={favorites.some(f => f.name === spell.name)}
                                onClick={() => handleSpellClick(spell)} 
                                onFav={toggleFav}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </main>

                {/* АРХИВ БЕЗ ТРОЕТОЧИЯ */}
                <aside className="w-full lg:w-[320px] flex-shrink-0 sticky top-[120px] max-h-[calc(100vh-160px)] overflow-y-auto pr-2 custom-scrollbar font-sans">
                  <div className="bg-[#111] border-2 border-amber-600/30 rounded-xl p-3 space-y-2 shadow-inner">
                    <h3 className="text-amber-500 font-black text-center text-xs uppercase mb-3 tracking-widest">★ АРХИВ МОДУЛЕЙ</h3>
                    {favorites.length === 0 ? <p className="text-center text-amber-900 text-[10px] uppercase py-4">Пусто</p> :
                      favorites.map(f => (
                        <div key={f.name} onClick={() => setActiveSpell(f)} className="flex items-start justify-between bg-black p-3 rounded border border-amber-900/30 hover:border-amber-500 cursor-pointer group transition-all">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-[8px] text-amber-700 font-bold uppercase">{f.level}</span>
                            <span className="text-[11px] font-bold text-amber-100 group-hover:text-amber-400 uppercase tracking-tighter break-words leading-tight">{f.name}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleFav(f); }} className="text-red-900 hover:text-red-500 text-xl leading-none">×</button>
                        </div>
                      ))}
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </div>

      {/* МОДАЛКИ (ВЫСОКИЙ Z-INDEX) */}
      {showCompareResults && (
        <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto flex flex-col h-full">
            <div className="flex justify-between items-center mb-8 border-b border-amber-900/30 pb-4">
              <h2 className="text-3xl font-black text-amber-500 uppercase italic">Сличительный анализ</h2>
              <button onClick={() => { setShowCompareResults(false); setCompareList([]); setCompareMode(false); }} className="px-8 py-3 bg-amber-600 text-black font-black rounded-lg">ЗАКРЫТЬ</button>
            </div>
            <div className={`grid gap-6 ${compareList.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
              {compareList.map(spell => (
                <SpellModal key={spell.name} spell={spell} isCompare={true} theme={getTheme(spell.description)} onCopy={copyToClipboard} onClose={() => { const nl = compareList.filter(s => s.name !== spell.name); if(nl.length < 2) {setShowCompareResults(false); setCompareList([]); setCompareMode(false);} else setCompareList(nl); }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSpell && !showCompareResults && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveSpell(null)}>
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <SpellModal spell={activeSpell} onClose={() => setActiveSpell(null)} onCopy={copyToClipboard} theme={getTheme(activeSpell.description)} />
          </div>
        </div>
      )}

      {showCombatInfo && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowCombatInfo(false)}>
          <div className="bg-[#efe7d6] p-8 rounded-2xl max-w-sm w-full border-4 border-[#3d2314] text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-[#3d2314] font-black text-2xl uppercase mb-4 italic">Инфо</h3>
            <p className="text-[#4d2d1a] font-bold text-sm">Нажмите "Сравнить", затем выберите 2-3 модуля. Нажмите "Категории" для фильтрации по типу эффекта.</p>
            <button onClick={() => setShowCombatInfo(false)} className="mt-8 w-full bg-[#3d2314] text-amber-500 py-4 rounded-lg font-black uppercase">ПРИНЯТО</button>
          </div>
        </div>
      )}
    </div>
  );
}