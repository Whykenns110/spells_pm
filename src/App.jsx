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
  
  const [compFilter, setCompFilter] = useState([]); 
  const [distFilter, setDistFilter] = useState("all");

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("paromechanic_favs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("paromechanic_favs", JSON.stringify(favorites));
  }, [favorites]);

  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareResults, setShowCompareResults] = useState(false);

  const copyToClipboard = (spell) => {
    const cleanText = spell.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    navigator.clipboard.writeText(`${spell.name}\n${cleanText}`).then(() => alert("Скопировано!"));
  };

  const getTheme = (spell) => {
    if (!spell) return {};
    const name = (spell.name || "").toLowerCase();
    const desc = (spell.description || "").toLowerCase();
    
    if (name.includes("глаз") || desc.includes("прорицание")) {
      return { modalBorder: "border-purple-500", header: "bg-purple-600", text: "text-purple-500", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]" };
    }
    if (desc.includes("атакующие")) return { modalBorder: "border-red-500", header: "bg-red-600", text: "text-red-500" };
    if (desc.includes("защитные")) return { modalBorder: "border-blue-500", header: "bg-blue-600", text: "text-blue-500" };
    if (desc.includes("регенерирующие")) return { modalBorder: "border-emerald-500", header: "bg-emerald-600", text: "text-emerald-500" };
    return { modalBorder: "border-amber-500", header: "bg-amber-600", text: "text-amber-500" };
  };

  const filteredData = useMemo(() => {
    const result = {};
    Object.entries(spellsData).forEach(([letter, spells]) => {
      const filtered = spells.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = levelFilter === "all" || s.level === levelFilter;
        const matchesCat = !categoryFilter || s.description.includes(categoryFilter);
        const matchesComp = compFilter.length === 0 || compFilter.every(c => s.components?.includes(c));

        let matchesDist = true;
        if (distFilter !== "all") {
          const rangeStr = (s.range || "").toLowerCase();
          const num = parseInt(rangeStr.replace(/[^0-9]/g, "")) || 0;
          if (distFilter === "self") matchesDist = rangeStr.includes("на себя");
          else if (distFilter === "touch") matchesDist = rangeStr.includes("касание");
          else if (distFilter === "30") matchesDist = num > 0 && num <= 30;
          else if (distFilter === "60") matchesDist = num > 30 && num <= 60;
          else if (distFilter === "120") matchesDist = num > 60 && num <= 120;
          else if (distFilter === "long") matchesDist = num > 120;
        }
        return matchesSearch && matchesLevel && matchesCat && matchesComp && matchesDist;
      });
      if (filtered.length) result[letter] = filtered;
    });
    return result;
  }, [search, levelFilter, categoryFilter, compFilter, distFilter]);

  const toggleFav = (spell) => {
    setFavorites(prev => prev.find(f => f.name === spell.name) ? prev.filter(f => f.name !== spell.name) : [...prev, spell]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-serif flex flex-col h-screen overflow-hidden">
      {/* HEADER */}
      <header className="p-6 pb-2 w-full flex-shrink-0 z-10">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-amber-500 uppercase italic tracking-tighter">АРХИВ ПАРОМЕХАНИКА</h1>
          <p className="text-amber-700 text-[10px] uppercase tracking-[0.3em] font-sans font-bold italic">Terminal v.7.3 | Combat Link Fixed</p>
        </div>
      </header>

      <div className="flex gap-4 px-4 md:px-10 pb-4 max-w-[1600px] mx-auto w-full flex-grow overflow-hidden relative">
        
        {/* ЛЕВАЯ ПАНЕЛЬ — ИСПРАВЛЕНЫ КЛИКИ */}
        <div className="w-20 md:w-28 flex-shrink-0 flex flex-col h-full z-[200]">
          <div className="bg-amber-600 py-2 rounded-t-xl text-center border-b-2 border-black/20 font-black text-[8px] text-black uppercase select-none">Игровая Система</div>
          <div className="bg-amber-500 flex-grow flex flex-col items-center py-6 gap-6 shadow-2xl rounded-b-xl border-x border-b border-amber-600/50">
            <button 
              onClick={() => setIsCombatMode(!isCombatMode)} 
              className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all shadow-xl border-b-4 active:translate-y-1 ${isCombatMode ? 'bg-red-700 border-red-950 translate-y-0.5' : 'bg-zinc-900 border-black hover:bg-zinc-800'}`}
              title="Режим боя"
            >
              <span className="text-white text-xl">⚔️</span>
            </button>
            
            <button 
              onClick={() => setShowCombatInfo(true)} 
              className="w-10 h-10 bg-[#3d2314] hover:bg-[#4d2d1a] border-b-4 border-[#1a0f08] rounded-full flex items-center justify-center text-amber-500 font-black italic shadow-lg transition-colors"
              title="Информация"
            >
              i
            </button>

            <div className="mt-auto pb-6 opacity-40 select-none">
               <div className="text-black font-black text-[10px] uppercase vertical-text tracking-[0.2em]">STABLE_LINK</div>
            </div>
          </div>
        </div>

        {/* ЦЕНТРАЛЬНАЯ ЗОНА */}
        <div className="flex-grow flex flex-col gap-4 min-w-0 h-full overflow-hidden">
          
          {/* ФИЛЬТРЫ — ПОКАЗЫВАЮТСЯ ТОЛЬКО ВНЕ БОЯ */}
          {!isCombatMode && (
            <div className="flex-shrink-0 bg-[#0a0a0a] z-[100] relative w-full max-w-[1200px]">
              <div className="flex flex-col gap-2 bg-[#111] p-3 border border-amber-900/30 rounded-lg shadow-xl">
                <div className="flex flex-wrap gap-2 items-center">
                  <input type="text" placeholder="Поиск чертежа..." className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 flex-grow outline-none text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <div className="flex bg-black border border-amber-900/50 rounded p-1 gap-1">
                    {['В', 'С', 'М'].map(c => (
                      <button key={c} onClick={() => setCompFilter(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} className={`w-7 h-7 rounded text-[9px] font-black transition-all ${compFilter.includes(c) ? 'bg-amber-600 text-black shadow-inner' : 'text-amber-900 hover:text-amber-700'}`}>{c}</button>
                    ))}
                  </div>
                  <select className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 text-[10px] outline-none font-bold uppercase cursor-pointer" value={distFilter} onChange={(e) => setDistFilter(e.target.value)}>
                    <option value="all">Дальность: Любая</option>
                    <option value="self">На себя</option>
                    <option value="touch">Касание</option>
                    <option value="30">До 30 фт</option>
                    <option value="60">31-60 фт</option>
                    <option value="120">61-120 фт</option>
                    <option value="long">120+ фт</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-2 items-center border-t border-amber-900/10 pt-2">
                  <select className="bg-black border border-amber-700/50 px-2 py-1.5 rounded text-amber-500 text-[10px] font-bold uppercase" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                    <option value="all">Все уровни</option>
                    <option value="Заговор">Заговор</option>
                    {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={String(l)}>{l} уровень</option>)}
                  </select>
                  
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowCategories(!showCategories); }} className={`px-3 py-1.5 border rounded font-bold text-[9px] uppercase transition-all ${showCategories ? 'bg-amber-500 text-black border-amber-400 shadow-md' : 'text-amber-500 border-amber-800/40 hover:border-amber-500'}`}>Категории ▼</button>
                    {showCategories && (
                      <div className="absolute top-full left-0 mt-2 bg-[#efe7d6] text-black rounded-lg shadow-2xl z-[300] p-4 border-2 border-amber-700 w-[500px] grid grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-200">
                         {Object.entries(categories).map(([cat, subs]) => (
                          <div key={cat} className="space-y-1">
                            <div className="font-black text-[8px] uppercase text-amber-900/40 mb-1 border-b border-amber-900/5">{cat}</div>
                            {subs.map(s => <div key={s} onClick={() => {setCategoryFilter(s); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-400 px-1 py-0.5 text-[10px] font-bold rounded transition-colors">{s}</div>)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button onClick={() => { if(compareMode && compareList.length >= 2) setShowCompareResults(true); setCompareMode(!compareMode); }} className={`ml-auto px-4 py-1.5 rounded font-black border-2 text-[9px] transition-all ${compareMode ? 'bg-amber-500 text-black border-white shadow-lg' : 'bg-black text-amber-500 border-amber-900 hover:border-amber-500'}`}>
                    {compareMode ? `АНАЛИЗ (${compareList.length}/3)` : 'СРАВНИТЬ'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* КОНТЕНТ — ПЕРЕКЛЮЧЕНИЕ РАБОТАЕТ ТЕПЕРЬ ТУТ */}
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar pb-10">
            {isCombatMode ? (
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
              <div className="flex flex-col lg:flex-row gap-6">
                <main className="flex-grow space-y-10">
                  {Object.entries(filteredData).map(([letter, spells]) => (
                    <div key={letter} className="animate-in fade-in duration-500">
                      <h2 className="text-xl text-amber-600 font-black mb-4 uppercase border-l-4 border-amber-600 pl-3 tracking-tighter">{letter}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {spells.map(spell => (
                          <SpellCard key={spell.name} spell={spell} isSelected={compareList.some(s => s.name === spell.name)} isFav={favorites.some(f => f.name === spell.name)} onClick={() => {
                            if (compareMode) {
                              if (compareList.some(s => s.name === spell.name)) setCompareList(prev => prev.filter(s => s.name !== spell.name));
                              else if (compareList.length < 3) setCompareList(prev => [...prev, spell]);
                            } else setActiveSpell(spell);
                          }} onFav={toggleFav} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(filteredData).length === 0 && (
                    <div className="py-20 text-center opacity-20 italic uppercase font-black tracking-widest">Нет данных в текущем секторе поиска</div>
                  )}
                </main>

                <aside className="w-full lg:w-[260px] flex-shrink-0 sticky top-0 h-fit">
                  <div className="bg-[#111] border border-amber-600/20 rounded-lg p-3 space-y-2 shadow-2xl">
                    <h3 className="text-amber-500 font-black text-center text-[9px] uppercase border-b border-amber-900/20 pb-1 italic tracking-widest">★ Избранное</h3>
                    {favorites.length === 0 ? (
                      <p className="text-center py-4 text-amber-900 text-[8px] uppercase">Пусто</p>
                    ) : (
                      favorites.map(f => (
                        <div key={f.name} onClick={() => setActiveSpell(f)} className="flex items-center justify-between bg-black p-2 rounded border border-amber-900/20 hover:border-amber-500 cursor-pointer group transition-all">
                          <span className="text-[10px] font-bold text-amber-100 group-hover:text-amber-400 uppercase truncate pr-2">{f.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); toggleFav(f); }} className="text-red-900 hover:text-red-500 text-lg leading-none">×</button>
                        </div>
                      ))
                    )}
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* МОДАЛКА ИНФО */}
      {showCombatInfo && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setShowCombatInfo(false)}>
          <div className="bg-[#efe7d6] p-8 rounded-2xl max-w-sm w-full border-4 border-[#3d2314] text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-[#3d2314] font-black text-2xl uppercase mb-4 italic tracking-tighter">Справочник терминала</h3>
            <p className="text-[#4d2d1a] font-bold text-sm leading-relaxed mb-6">Чтобы использовать модули в боевом режиме (⚔️), сначала добавьте их в избранное через кнопку ★ на карточке.</p>
            <button onClick={() => setShowCombatInfo(false)} className="w-full bg-[#3d2314] text-amber-500 py-4 rounded-lg font-black uppercase hover:bg-[#2a180e] transition-colors">Понятно</button>
          </div>
        </div>
      )}

      {/* СРАВНЕНИЕ */}
      {showCompareResults && (
        <div className="fixed inset-0 z-[550] bg-black/98 p-6 overflow-y-auto flex flex-col items-center backdrop-blur-md">
          <div className="w-full max-w-6xl flex justify-between mb-8 border-b border-amber-900/30 pb-4 items-center">
            <h2 className="text-2xl font-black text-amber-500 uppercase italic">Сличительный терминал</h2>
            <button onClick={() => { setShowCompareResults(false); setCompareList([]); setCompareMode(false); }} className="px-6 py-2 bg-amber-600 text-black font-black rounded hover:bg-amber-500 transition-all text-xs uppercase">Закрыть</button>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {compareList.map(spell => (
              <div key={spell.name} className="w-[380px] shadow-2xl">
                <SpellModal spell={spell} isCompare={true} theme={getTheme(spell)} onCopy={copyToClipboard} onClose={() => {
                  const nl = compareList.filter(s => s.name !== spell.name);
                  if(nl.length < 2) { setShowCompareResults(false); setCompareList([]); setCompareMode(false); }
                  else setCompareList(nl);
                }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ОДИНОЧНОЕ ОКНО */}
      {activeSpell && !showCompareResults && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" onClick={() => setActiveSpell(null)}>
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <SpellModal spell={activeSpell} onClose={() => setActiveSpell(null)} onCopy={copyToClipboard} theme={getTheme(activeSpell)} />
          </div>
        </div>
      )}
    </div>
  );
}