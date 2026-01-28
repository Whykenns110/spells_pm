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
  
  // ФИЛЬТРЫ (ТЕПЕРЬ НА РУССКОМ)
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
    const desc = spell.description || "";
    const name = spell.name.toLowerCase();
    if (desc.includes("Помехи") || desc.includes("Прорицание") || name.includes("глаз")) {
      return { modalBorder: "border-purple-500", header: "bg-purple-600", text: "text-purple-400" };
    }
    if (desc.includes("Атакующие")) return { modalBorder: "border-red-500", header: "bg-red-600", text: "text-red-400" };
    if (desc.includes("Защитные")) return { modalBorder: "border-blue-500", header: "bg-blue-600", text: "text-blue-400" };
    if (desc.includes("Регенерирующие")) return { modalBorder: "border-emerald-500", header: "bg-emerald-600", text: "text-emerald-400" };
    return { modalBorder: "border-amber-500", header: "bg-amber-600", text: "text-amber-400" };
  };

  const filteredData = useMemo(() => {
    const result = {};
    Object.entries(spellsData).forEach(([letter, spells]) => {
      const filtered = spells.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = levelFilter === "all" || s.level === levelFilter;
        const matchesCat = !categoryFilter || s.description.includes(categoryFilter);
        
        // 1. ЛОГИКА КОМПОНЕНТОВ (В, С, М)
        const matchesComp = compFilter.length === 0 || compFilter.every(c => s.components?.includes(c));

        // 2. ИСПРАВЛЕННАЯ ЛОГИКА ДИСТАНЦИИ
        let matchesDist = true;
        if (distFilter !== "all") {
          const rangeStr = s.range?.toLowerCase() || "";
          // Вытаскиваем только число из строки (например "30 футов" -> 30)
          const numericRange = parseInt(rangeStr.replace(/[^0-9]/g, "")) || 0;

          if (distFilter === "self") matchesDist = rangeStr.includes("на себя");
          else if (distFilter === "touch") matchesDist = rangeStr.includes("касание");
          else {
            const limit = parseInt(distFilter);
            // Если в строке есть цифры — сравниваем, если "на себя/касание" — не пропускаем в числовой фильтр
            matchesDist = numericRange > 0 && numericRange <= limit && !rangeStr.includes("на себя") && !rangeStr.includes("касание");
          }
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
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-serif overflow-x-hidden">
      <header className="p-10 pb-6 max-w-[1600px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-amber-500 uppercase italic leading-tight">АРХИВ ПАРОМЕХАНИКА</h1>
        <p className="text-amber-700 text-sm mt-2 uppercase tracking-widest font-sans font-bold">v.6.8 | Фикс парсера дистанции</p>
      </header>

      <div className="flex gap-6 px-4 md:px-10 pb-10 max-w-[1600px] mx-auto relative">
        
        {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
        <div className="w-24 md:w-36 flex-shrink-0 flex flex-col items-center sticky top-6 h-[calc(100vh-48px)] z-[150]">
          <div className="w-full bg-amber-600 pt-5 pb-3 rounded-t-2xl border-b-2 border-black/20 flex flex-col items-center shadow-lg">
             <span className="text-[10px] md:text-xs font-black text-black">СИСТЕМА</span>
          </div>
          <div className="w-full bg-amber-500 flex-grow flex flex-col items-center py-8 gap-8 shadow-2xl rounded-b-xl border-x border-b border-amber-600/50">
            <button onClick={() => setIsCombatMode(!isCombatMode)} className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center transition-all shadow-xl border-b-4 ${isCombatMode ? 'bg-red-700 border-red-950 translate-y-1' : 'bg-zinc-900 border-black hover:bg-zinc-800'}`}>
              <span className="text-white text-3xl">⚔️</span>
              <span className="text-[9px] text-white font-black mt-1 uppercase italic">Бой</span>
            </button>
            <button onClick={() => setShowCombatInfo(true)} className="w-10 h-10 md:w-14 md:h-14 bg-[#3d2314] border-b-4 border-[#1a0f08] rounded-full flex items-center justify-center hover:bg-[#4d2d1a] transition-all">
              <span className="text-amber-500 font-black text-xl italic">i</span>
            </button>
            <div className="mt-auto pb-8 opacity-40 select-none">
               <div className="text-black font-black text-[11px] uppercase vertical-text tracking-widest">ARCHIVE_OS</div>
            </div>
          </div>
        </div>

        {/* ОСНОВНАЯ ЗОНА */}
        <div className="flex-grow flex flex-col gap-6 min-w-0">
          
          {isCombatMode ? (
            <CombatMode favorites={favorites} compareList={compareList} toggleFav={toggleFav} setActiveSpell={setActiveSpell} compareMode={compareMode} setCompareList={setCompareList} setCompareMode={setCompareMode} setShowCompareResults={setShowCompareResults} />
          ) : (
            <>
              {/* ПАНЕЛЬ ПОИСКА */}
              <div className="sticky top-0 z-[110] bg-[#0a0a0a] pt-2 pb-4 border-b-2 border-amber-500/50">
                <div className="flex flex-col gap-3 bg-[#111] p-4 border border-amber-900/30 rounded-lg shadow-2xl">
                  
                  <div className="flex flex-wrap gap-3 items-center">
                    <input type="text" placeholder="Поиск по названию..." className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 flex-grow outline-none focus:border-amber-400 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
                    
                    {/* ТУМБЛЕРЫ КОМПОНЕНТОВ (В, С, М) */}
                    <div className="flex bg-black border border-amber-900/50 rounded p-1 gap-1">
                      {['В', 'С', 'М'].map(c => (
                        <button key={c} onClick={() => setCompFilter(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} className={`w-8 h-8 rounded text-[10px] font-black transition-all ${compFilter.includes(c) ? 'bg-amber-600 text-black' : 'text-amber-900 hover:text-amber-600'}`}>
                          {c}
                        </button>
                      ))}
                    </div>

                    <select className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 text-xs outline-none font-bold uppercase" value={distFilter} onChange={(e) => setDistFilter(e.target.value)}>
                      <option value="all">Дистанция</option>
                      <option value="self">На себя</option>
                      <option value="touch">Касание</option>
                      <option value="30">≤ 30 фт.</option>
                      <option value="60">≤ 60 фт.</option>
                      <option value="90">≤ 90 фт.</option>
                      <option value="120">≤ 120 фт.</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center border-t border-amber-900/20 pt-2">
                    <select className="bg-black border border-amber-700/50 px-3 py-2 rounded text-amber-500 text-xs outline-none font-bold" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                      <option value="all">Уровни</option>
                      <option value="Заговор">Заговоры</option>
                      {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={String(l)}>{l} ур.</option>)}
                    </select>

                    <button onClick={() => setShowCategories(!showCategories)} className={`px-4 py-2 border rounded font-bold text-[10px] uppercase transition-colors ${showCategories ? 'bg-amber-500 text-black' : 'border-amber-800/40 text-amber-500'}`}>Категории</button>

                    <div className="flex gap-1 ml-auto">
                      <button onClick={() => { if(compareMode && compareList.length >= 2) setShowCompareResults(true); setCompareMode(!compareMode); }} className={`px-4 py-2 rounded font-black border-2 text-[10px] transition-all ${compareMode ? 'bg-amber-500 text-black border-white' : 'bg-black text-amber-500 border-amber-900'}`}>
                        {compareMode ? `АНАЛИЗ (${compareList.length})` : 'СРАВНИТЬ'}
                      </button>
                      {compareMode && (
                        <button onClick={() => { setCompareMode(false); setCompareList([]); }} className="px-3 py-2 bg-red-950 text-red-500 rounded border-2 border-red-900 text-[10px] font-black hover:bg-red-800">❌</button>
                      )}
                    </div>
                  </div>

                  {showCategories && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#efe7d6] text-black rounded-lg shadow-2xl z-[300] p-5 border-2 border-amber-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div onClick={() => {setCategoryFilter(null); setShowCategories(false);}} className="col-span-full cursor-pointer hover:bg-amber-200 p-2 font-black border-b-2 border-amber-900/10 mb-2 uppercase text-xs">Все модули</div>
                      {Object.entries(categories).map(([cat, subs]) => (
                        <div key={cat}>
                          <div className="font-black text-[9px] uppercase text-amber-900/50 mb-2 tracking-tighter">{cat}</div>
                          <div className="space-y-1">
                            {subs.map(s => <div key={s} onClick={() => {setCategoryFilter(s); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-300 px-2 py-1 text-[11px] font-bold rounded transition-all">{s}</div>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-grow space-y-12">
                  {Object.entries(filteredData).map(([letter, spells]) => (
                    <div key={letter}>
                      <h2 className="text-2xl text-amber-600 font-black mb-6 uppercase border-l-4 border-amber-600 pl-4">{letter}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {spells.map(spell => (
                          <div key={spell.name} className="w-full max-w-[300px]">
                            <SpellCard spell={spell} isSelected={compareList.some(s => s.name === spell.name)} isFav={favorites.some(f => f.name === spell.name)} onClick={() => handleSpellClick(spell)} onFav={toggleFav} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </main>

                <aside className="w-full lg:w-[320px] flex-shrink-0 sticky top-[160px] max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar font-sans">
                  <div className="bg-[#111] border-2 border-amber-600/30 rounded-xl p-3 space-y-2 shadow-2xl">
                    <h3 className="text-amber-500 font-black text-center text-[10px] uppercase mb-3 tracking-widest pb-2 border-b border-amber-900/30">★ ИЗБРАННОЕ</h3>
                    {favorites.length === 0 ? <p className="text-center text-amber-900 text-[10px] uppercase py-4">Пусто</p> :
                      favorites.map(f => (
                        <div key={f.name} onClick={() => setActiveSpell(f)} className="flex items-start justify-between bg-black p-3 rounded border border-amber-900/30 hover:border-amber-500 cursor-pointer group transition-all">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-[8px] text-amber-700 font-bold uppercase">{f.level}</span>
                            <span className="text-[11px] font-bold text-amber-100 group-hover:text-amber-400 uppercase break-words leading-tight">{f.name}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleFav(f); }} className="text-red-900 hover:text-red-500 text-xl">×</button>
                        </div>
                      ))}
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </div>

      {/* МОДАЛКИ */}
      {showCompareResults && (
        <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-amber-900/30 pb-4">
              <h2 className="text-3xl font-black text-amber-500 uppercase italic">Сличительный анализ</h2>
              <button onClick={() => { setShowCompareResults(false); setCompareList([]); setCompareMode(false); }} className="px-8 py-3 bg-amber-600 text-black font-black rounded-lg">ЗАКРЫТЬ</button>
            </div>
            <div className={`grid gap-6 ${compareList.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
              {compareList.map(spell => (
                <SpellModal key={spell.name} spell={spell} isCompare={true} theme={getTheme(spell)} onCopy={copyToClipboard} onClose={() => {
                  const nl = compareList.filter(s => s.name !== spell.name);
                  if(nl.length < 2) { setShowCompareResults(false); setCompareList([]); setCompareMode(false); }
                  else setCompareList(nl);
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSpell && !showCompareResults && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveSpell(null)}>
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <SpellModal spell={activeSpell} onClose={() => setActiveSpell(null)} onCopy={copyToClipboard} theme={getTheme(activeSpell)} />
          </div>
        </div>
      )}

      {showCombatInfo && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowCombatInfo(false)}>
          <div className="bg-[#efe7d6] p-8 rounded-2xl max-w-sm w-full border-4 border-[#3d2314] text-center">
            <h3 className="text-[#3d2314] font-black text-2xl uppercase mb-4 italic">Инфо</h3>
            <p className="text-[#4d2d1a] font-bold text-sm">Добавляйте модули в избранное через кнопку ★, чтобы они появились в режиме боя.</p>
            <button onClick={() => setShowCombatInfo(false)} className="mt-8 w-full bg-[#3d2314] text-amber-500 py-4 rounded-lg font-black uppercase">Принято</button>
          </div>
        </div>
      )}
    </div>
  );
}