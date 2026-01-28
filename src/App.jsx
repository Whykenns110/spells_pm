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

  // УЛУЧШЕННЫЙ ТЕМАТИЗАТОР
  const getTheme = (spell) => {
    const desc = spell.description || "";
    const name = (spell.name || "").toLowerCase();
    
    // Приоритет фиолетового для Кристального глаза и Прорицания
    if (name.includes("кристальный глаз") || name.includes("глаз") || desc.includes("Прорицание") || desc.includes("Помехи")) {
      return { modalBorder: "border-purple-500", header: "bg-purple-600", text: "text-purple-400", bg: "bg-purple-900/10" };
    }
    if (desc.includes("Атакующие")) return { modalBorder: "border-red-500", header: "bg-red-600", text: "text-red-400", bg: "bg-red-900/10" };
    if (desc.includes("Защитные")) return { modalBorder: "border-blue-500", header: "bg-blue-600", text: "text-blue-400", bg: "bg-blue-900/10" };
    if (desc.includes("Регенерирующие")) return { modalBorder: "border-emerald-500", header: "bg-emerald-600", text: "text-emerald-400", bg: "bg-emerald-900/10" };
    
    return { modalBorder: "border-amber-500", header: "bg-amber-600", text: "text-amber-400", bg: "bg-amber-900/10" };
  };

  const filteredData = useMemo(() => {
    const result = {};
    Object.entries(spellsData).forEach(([letter, spells]) => {
      const filtered = spells.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = levelFilter === "all" || s.level === levelFilter;
        const matchesCat = !categoryFilter || s.description.includes(categoryFilter);
        const matchesComp = compFilter.length === 0 || compFilter.every(c => s.components?.includes(c));

        // ИСПРАВЛЕННЫЙ ПАРСЕР ДИСТАНЦИИ
        let matchesDist = true;
        if (distFilter !== "all") {
          const rangeStr = (s.range || "").toLowerCase();
          // Извлекаем первое попавшееся число из строки
          const match = rangeStr.match(/\d+/);
          const num = match ? parseInt(match[0]) : 0;

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

  const handleSpellClick = (spell) => {
    if (compareMode) {
      const alreadySelected = compareList.some(s => s.name === spell.name);
      if (alreadySelected) setCompareList(prev => prev.filter(s => s.name !== spell.name));
      else if (compareList.length < 3) setCompareList(prev => [...prev, spell]);
    } else setActiveSpell(spell);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-serif flex flex-col h-screen overflow-hidden">
      {/* HEADER */}
      <header className="p-6 pb-2 flex-shrink-0">
        <h1 className="text-3xl md:text-5xl font-black text-amber-500 uppercase italic tracking-tighter">АРХИВ ПАРОМЕХАНИКА</h1>
        <p className="text-amber-700 text-[10px] uppercase tracking-[0.3em] font-sans font-bold">v.7.0 | Исправленная архитектура</p>
      </header>

      <div className="flex gap-4 px-4 md:px-10 pb-4 flex-grow overflow-hidden relative">
        
        {/* ЛЕВАЯ ПАНЕЛЬ (ИГРОВАЯ СИСТЕМА) */}
        <div className="w-20 md:w-28 flex-shrink-0 flex flex-col h-full z-[150]">
          <div className="bg-amber-600 py-2 rounded-t-xl border-b-2 border-black/20 text-center">
             <span className="text-[8px] font-black text-black uppercase">Игровая Система</span>
          </div>
          <div className="bg-amber-500 flex-grow flex flex-col items-center py-6 gap-6 shadow-2xl rounded-b-xl border-x border-b border-amber-600/50">
            <button onClick={() => setIsCombatMode(!isCombatMode)} className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center transition-all shadow-xl border-b-4 ${isCombatMode ? 'bg-red-700 border-red-950 translate-y-1' : 'bg-zinc-900 border-black hover:bg-zinc-800'}`}>
              <span className="text-white text-xl">⚔️</span>
              <span className="text-[7px] text-white font-black mt-1 uppercase italic">Бой</span>
            </button>
            <button onClick={() => setShowCombatInfo(true)} className="w-10 h-10 bg-[#3d2314] border-b-4 border-[#1a0f08] rounded-full flex items-center justify-center hover:bg-[#4d2d1a] transition-all shadow-md">
              <span className="text-amber-500 font-black text-lg italic italic">i</span>
            </button>
            <div className="mt-auto pb-6 opacity-30 select-none">
               <div className="text-black font-black text-[9px] uppercase vertical-text tracking-widest">STABLE_V7</div>
            </div>
          </div>
        </div>

        {/* ЦЕНТРАЛЬНЫЙ БЛОК */}
        <div className="flex-grow flex flex-col gap-4 min-w-0 h-full overflow-hidden">
          
          {/* ФИЛЬТРЫ (ЗАКРЕПЛЕНО) */}
          <div className="flex-shrink-0 bg-[#0a0a0a] z-[200] relative">
            <div className="flex flex-col gap-2 bg-[#111] p-3 border border-amber-900/30 rounded-lg shadow-xl">
              <div className="flex flex-wrap gap-2 items-center">
                <input type="text" placeholder="Поиск чертежа..." className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 flex-grow outline-none text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
                
                <div className="flex bg-black border border-amber-900/50 rounded p-1 gap-1">
                  {['В', 'С', 'М'].map(c => (
                    <button key={c} onClick={() => setCompFilter(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} className={`w-7 h-7 rounded text-[9px] font-black transition-all ${compFilter.includes(c) ? 'bg-amber-600 text-black' : 'text-amber-900 hover:text-amber-600'}`}>
                      {c}
                    </button>
                  ))}
                </div>

                <select className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 text-[10px] outline-none font-bold uppercase cursor-pointer" value={distFilter} onChange={(e) => setDistFilter(e.target.value)}>
                  <option value="all">Дистанция: Все</option>
                  <option value="self">На себя</option>
                  <option value="touch">Касание</option>
                  <option value="30">До 30 фт</option>
                  <option value="60">31-60 фт</option>
                  <option value="120">61-120 фт</option>
                  <option value="long">120+ фт</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2 items-center border-t border-amber-900/10 pt-2">
                <select className="bg-black border border-amber-700/50 px-2 py-1.5 rounded text-amber-500 text-[10px] outline-none font-bold uppercase" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                  <option value="all">Все уровни</option>
                  <option value="Заговор">Заговоры</option>
                  {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={String(l)}>{l} уровень</option>)}
                </select>

                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setShowCategories(!showCategories); }} className={`px-3 py-1.5 border rounded font-bold text-[9px] uppercase transition-all z-[210] ${showCategories ? 'bg-amber-500 text-black border-amber-400' : 'border-amber-800/40 text-amber-500 hover:border-amber-500'}`}>
                    Категории {showCategories ? '▲' : '▼'}
                  </button>
                  
                  {showCategories && (
                    <div className="absolute top-full left-0 mt-2 bg-[#efe7d6] text-black rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[300] p-4 border-2 border-amber-700 w-[600px] grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
                       <div onClick={() => {setCategoryFilter(null); setShowCategories(false);}} className="col-span-full cursor-pointer hover:bg-amber-200 p-1.5 font-black border-b border-amber-900/10 mb-1 uppercase text-[10px]">Сбросить фильтр</div>
                       {Object.entries(categories).map(([cat, subs]) => (
                        <div key={cat} className="space-y-1">
                          <div className="font-black text-[8px] uppercase text-amber-900/50 border-b border-amber-900/5 tracking-tighter mb-1">{cat}</div>
                          {subs.map(s => <div key={s} onClick={() => {setCategoryFilter(s); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-400 px-1.5 py-1 text-[10px] font-bold rounded transition-colors">{s}</div>)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-1 ml-auto">
                  <button onClick={() => { if(compareMode && compareList.length >= 2) setShowCompareResults(true); setCompareMode(!compareMode); }} className={`px-4 py-1.5 rounded font-black border-2 text-[9px] transition-all ${compareMode ? 'bg-amber-500 text-black border-white' : 'bg-black text-amber-500 border-amber-900 hover:border-amber-500'}`}>
                    {compareMode ? `АНАЛИЗ (${compareList.length}/3)` : 'СРАВНИТЬ'}
                  </button>
                  {compareMode && (
                    <button onClick={() => { setCompareMode(false); setCompareList([]); }} className="px-2 py-1.5 bg-red-950 text-red-500 rounded border-2 border-red-900 text-[9px] font-black">❌</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* КОНТЕНТ (СКРОЛЛ) */}
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar pb-10" onClick={() => setShowCategories(false)}>
            {isCombatMode ? (
              <CombatMode favorites={favorites} compareList={compareList} toggleFav={toggleFav} setActiveSpell={setActiveSpell} compareMode={compareMode} setCompareList={setCompareList} setCompareMode={setCompareMode} setShowCompareResults={setShowCompareResults} />
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                <main className="flex-grow space-y-10">
                  {Object.entries(filteredData).map(([letter, spells]) => (
                    <div key={letter}>
                      <h2 className="text-xl text-amber-600 font-black mb-4 uppercase border-l-4 border-amber-600 pl-3 tracking-tighter">{letter}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {spells.map(spell => (
                          <div key={spell.name} className="w-full">
                            <SpellCard spell={spell} isSelected={compareList.some(s => s.name === spell.name)} isFav={favorites.some(f => f.name === spell.name)} onClick={() => handleSpellClick(spell)} onFav={toggleFav} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(filteredData).length === 0 && <p className="text-center py-20 opacity-20 italic uppercase font-black tracking-widest">Архив не выдает результатов</p>}
                </main>

                {/* ПРАВАЯ ПАНЕЛЬ (ЗАКРЕПЛЕНА) */}
                <aside className="w-full lg:w-[260px] flex-shrink-0 sticky top-0 h-fit max-h-full overflow-y-auto pr-1 font-sans">
                  <div className="bg-[#111] border border-amber-600/20 rounded-lg p-3 space-y-2 shadow-2xl">
                    <h3 className="text-amber-500 font-black text-center text-[9px] uppercase mb-2 tracking-widest border-b border-amber-900/20 pb-1">★ БЫСТРЫЙ ДОСТУП ★</h3>
                    {favorites.length === 0 ? <p className="text-center text-amber-900 text-[8px] uppercase py-4">Нет активных модулей</p> :
                      favorites.map(f => (
                        <div key={f.name} onClick={() => setActiveSpell(f)} className="flex items-start justify-between bg-black p-2 rounded border border-amber-900/20 hover:border-amber-500 cursor-pointer group transition-all">
                          <div className="flex flex-col min-w-0 pr-1">
                            <span className="text-[7px] text-amber-700 font-bold uppercase">{f.level}</span>
                            <span className="text-[10px] font-bold text-amber-100 group-hover:text-amber-400 uppercase truncate leading-tight">{f.name}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleFav(f); }} className="text-red-900 hover:text-red-500 text-lg leading-none">×</button>
                        </div>
                      ))}
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ОКНО СРАВНЕНИЯ (ИСПРАВЛЕН РАЗМЕР КАРТОЧЕК) */}
      {showCompareResults && (
        <div className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-2xl p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-amber-900/30 pb-4">
              <div>
                <h2 className="text-3xl font-black text-amber-500 uppercase italic leading-none">Сличительный Анализ</h2>
                <p className="text-amber-700 text-[10px] uppercase mt-1">Параллельное сравнение характеристик</p>
              </div>
              <button onClick={() => { setShowCompareResults(false); setCompareList([]); setCompareMode(false); }} className="px-8 py-3 bg-amber-600 text-black font-black rounded hover:bg-amber-400 transition-all uppercase text-sm">Выход</button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 items-start">
              {compareList.map(spell => (
                <div key={spell.name} className="w-full md:w-[400px] flex-shrink-0 animate-in zoom-in-95 duration-300">
                  <SpellModal spell={spell} isCompare={true} theme={getTheme(spell)} onCopy={copyToClipboard} onClose={() => {
                    const nl = compareList.filter(s => s.name !== spell.name);
                    if(nl.length < 2) { setShowCompareResults(false); setCompareList([]); setCompareMode(false); }
                    else setCompareList(nl);
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ОДИНОЧНОЕ ОКНО */}
      {activeSpell && !showCompareResults && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveSpell(null)}>
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <SpellModal spell={activeSpell} onClose={() => setActiveSpell(null)} onCopy={copyToClipboard} theme={getTheme(activeSpell)} />
          </div>
        </div>
      )}
    </div>
  );
}
