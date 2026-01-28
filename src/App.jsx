import React, { useMemo, useState, useEffect } from "react";
import { spellsData, categories } from "./data/spells";
import { getSpellTheme } from "./utils/themeEngine";
import SpellCard from "./components/SpellCard";
import SpellModal from "./components/SpellModal";
import CombatMode from "./modules/CombatMode";
import DiceRoller from "./components/DiceRoller"; // Подключили кости
import ikona from "./ikona.jpg";

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
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareResults, setShowCompareResults] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("paromechanic_favs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("paromechanic_favs", JSON.stringify(favorites));
  }, [favorites]);

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

  const toggleFav = (s) => setFavorites(p => p.find(f => f.name === s.name) ? p.filter(f => f.name !== s.name) : [...p, s]);

  const copyToClipboard = (spell) => {
    const cleanText = spell.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    navigator.clipboard.writeText(`${spell.name}\n${cleanText}`).then(() => alert("Чертеж скопирован"));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-serif flex flex-col h-screen overflow-hidden">
      <header className="p-6 pb-2 w-full flex-shrink-0 z-10">
        <div className="max-w-[1400px] mx-auto border-b border-amber-900/20 pb-2">
          <h1 className="text-3xl md:text-5xl font-black text-amber-500 uppercase italic tracking-tighter">АРХИВ ПАРОМЕХАНИКА</h1>
          <div className="flex justify-between items-center mt-1">
            <p className="text-amber-700 text-[10px] uppercase tracking-[0.3em] font-sans font-bold italic">Modular Engine v.0.8.7</p>
          </div>
        </div>
      </header>

      <div className="flex gap-4 px-4 md:px-10 pb-4 max-w-[1600px] mx-auto w-full flex-grow overflow-hidden relative">
        {/* ЛЕВАЯ ПАНЕЛЬ С ДАЙСАМИ */}
        <div className="w-20 md:w-28 flex-shrink-0 flex flex-col h-full z-[200]">
          <div className="bg-amber-600 py-2 rounded-t-xl text-center font-black text-[8px] text-black uppercase tracking-tighter">Система</div>
          <div className="bg-amber-500 flex-grow flex flex-col items-center py-4 rounded-b-xl border-x border-b border-amber-600/50 shadow-2xl overflow-y-auto no-scrollbar">
            <button onClick={() => setIsCombatMode(!isCombatMode)} className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all border-b-4 ${isCombatMode ? 'bg-red-700 border-red-950 translate-y-1' : 'bg-zinc-900 border-black hover:bg-zinc-800'}`}>
              <span className="text-white text-xl">⚔️</span>
            </button>
            <button onClick={() => setShowCombatInfo(true)} className="mt-2 w-8 h-8 bg-[#3d2314] rounded-full flex items-center justify-center text-amber-500 font-black italic text-xs shadow-lg hover:bg-black transition-colors border border-amber-900/20">i</button>
            <div className="w-full border-t border-black/10 my-4"></div>
            <DiceRoller />
          </div>
        </div>

        <div className="flex-grow flex flex-col gap-4 min-w-0 h-full overflow-hidden">
          {!isCombatMode && (
            <div className="bg-[#111] p-3 border border-amber-900/30 rounded-lg shadow-xl w-full max-w-[1200px] z-[150]">
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <input type="text" placeholder="Поиск чертежа..." className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 flex-grow text-xs outline-none focus:border-amber-500 transition-colors" value={search} onChange={e => setSearch(e.target.value)} />
                <select className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 text-[10px] font-bold uppercase outline-none cursor-pointer hover:border-amber-500" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
                  <option value="all">Все уровни</option>
                  <option value="Заговор">Заговоры</option>
                  {[1, 2, 3, 4].map(l => <option key={l} value={String(l)}>{l} уровень</option>)}
                </select>
                <select className="bg-black border border-amber-700/50 p-2 rounded text-amber-100 text-[10px] font-bold uppercase outline-none cursor-pointer hover:border-amber-500" value={distFilter} onChange={e => setDistFilter(e.target.value)}>
                  <option value="all">Дальность: Все</option>
                  <option value="self">На себя</option>
                  <option value="touch">Касание</option>
                  <option value="30">До 30 фт</option>
                  <option value="60">31-60 фт</option>
                  <option value="120">61-120 фт</option>
                  <option value="long">120+ фт</option>
                </select>
                <div className="flex bg-black border border-amber-900/50 rounded p-1 gap-1">
                  {['В', 'С', 'М'].map(c => (
                    <button key={c} onClick={() => setCompFilter(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])} className={`w-7 h-7 rounded text-[9px] font-black transition-all ${compFilter.includes(c) ? 'bg-amber-600 text-black shadow-inner' : 'text-amber-900 hover:text-amber-700'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 items-center border-t border-amber-900/10 pt-2 relative">
                  <button onClick={() => setShowCategories(!showCategories)} className={`px-3 py-1.5 border rounded font-bold text-[9px] uppercase transition-all ${showCategories ? 'bg-amber-500 text-black' : 'border-amber-800/40 text-amber-500 hover:border-amber-500'}`}>Категории ▼</button>
                  <div className="ml-auto flex gap-1">
                    <button onClick={() => { if(compareMode && compareList.length >= 2) setShowCompareResults(true); setCompareMode(!compareMode); }} className={`px-4 py-1.5 rounded font-black border-2 text-[9px] transition-all ${compareMode ? 'bg-amber-500 text-black border-white shadow-lg' : 'bg-black text-amber-500 border-amber-900 hover:border-amber-500'}`}>
                      {compareMode ? `АНАЛИЗ (${compareList.length}/3)` : 'СРАВНИТЬ'}
                    </button>
                    {compareMode && (
                      <button onClick={() => { setCompareMode(false); setCompareList([]); }} className="px-2 py-1.5 bg-red-950 text-red-500 rounded border-2 border-red-900 text-[9px] font-black hover:bg-red-800 transition-all">❌</button>
                    )}
                  </div>
                  {showCategories && (
                    <div className="absolute top-full left-0 mt-2 bg-[#efe7d6] text-black rounded-lg shadow-2xl z-[500] p-4 border-2 border-amber-700 w-[500px] grid grid-cols-3 gap-4 animate-in zoom-in-95 duration-200">
                        {Object.entries(categories).map(([cat, subs]) => (
                        <div key={cat} className="space-y-1">
                          <div className="font-black text-[8px] uppercase text-amber-900/40 mb-1 border-b border-black/5">{cat}</div>
                          {subs.map(s => <div key={s} onClick={() => {setCategoryFilter(s); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-400 px-1 py-0.5 text-[10px] font-bold rounded transition-colors">{s}</div>)}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar pb-10" onClick={() => setShowCategories(false)}>
            {isCombatMode ? (
              <CombatMode favorites={favorites} compareList={compareList} toggleFav={toggleFav} setActiveSpell={setActiveSpell} compareMode={compareMode} setCompareList={setCompareList} setCompareMode={setCompareMode} setShowCompareResults={setShowCompareResults} />
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                <main className="flex-grow space-y-10">
                  {Object.entries(filteredData).map(([letter, spells]) => (
                    <div key={letter} className="animate-in fade-in duration-500">
                      <h2 className="text-xl text-amber-600 font-black mb-4 uppercase border-l-4 border-amber-600 pl-3 tracking-tighter">{letter}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {spells.map(s => <SpellCard key={s.name} spell={s} isFav={favorites.some(f => f.name === s.name)} isSelected={compareList.some(cl => cl.name === s.name)} onClick={() => compareMode ? (compareList.some(cl => cl.name === s.name) ? setCompareList(p => p.filter(x => x.name !== s.name)) : compareList.length < 3 && setCompareList(p => [...p, s])) : setActiveSpell(s)} onFav={toggleFav} />)}
                      </div>
                    </div>
                  ))}
                </main>
                <aside className="w-full lg:w-[260px] sticky top-0 h-fit space-y-4">
                  <div className="bg-black border-2 border-amber-900/40 rounded-lg overflow-hidden shadow-2xl">
                    <img src={ikona} alt="Механик" className="w-full h-auto object-cover grayscale opacity-80" />
                    <div className="bg-amber-900/10 p-2 text-center border-t border-amber-900/20">
                      <p className="text-[8px] text-amber-600 font-black uppercase tracking-widest italic">Портрет паромеханика 1872г.</p>
                    </div>
                  </div>
                  <div className="bg-[#111] p-3 border border-amber-600/20 rounded-lg shadow-2xl">
                    <h3 className="text-amber-500 font-black text-center text-[9px] uppercase border-b border-amber-900/20 pb-1 mb-3 italic tracking-widest">★ Избранное</h3>
                    {favorites.map(f => (
                      <div key={f.name} onClick={() => setActiveSpell(f)} className="flex items-center justify-between bg-black p-2 mb-1 rounded border border-amber-900/20 hover:border-amber-500 cursor-pointer group transition-all">
                        <span className="text-[10px] font-bold text-amber-100 group-hover:text-amber-400 uppercase truncate pr-2">{f.name}</span>
                        <button onClick={e => {e.stopPropagation(); toggleFav(f);}} className="text-red-900 hover:text-red-500 text-lg">×</button>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeSpell && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" onClick={() => setActiveSpell(null)}>
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <SpellModal spell={activeSpell} theme={getSpellTheme(activeSpell)} onClose={() => setActiveSpell(null)} onCopy={copyToClipboard} />
          </div>
        </div>
      )}

      {showCompareResults && (
        <div className="fixed inset-0 z-[700] bg-black/80 backdrop-blur-xl p-6 overflow-y-auto flex flex-col items-center animate-in fade-in duration-300">
          <div className="w-full max-w-6xl flex justify-between mb-8 border-b border-amber-900/30 pb-4 items-center">
            <h2 className="text-2xl font-black text-amber-500 uppercase italic">Анализ систем</h2>
            <button onClick={() => {setShowCompareResults(false); setCompareList([]); setCompareMode(false);}} className="px-6 py-2 bg-amber-600 text-black font-black rounded text-xs uppercase hover:bg-amber-400 transition-colors">Закрыть</button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {compareList.map(s => (
              <div key={s.name} className="w-full max-w-[400px]">
                <SpellModal spell={s} theme={getSpellTheme(s)} isCompare={true} onCopy={copyToClipboard} onClose={() => {
                    const newList = compareList.filter(x => x.name !== s.name);
                    if (newList.length < 2) { setShowCompareResults(false); setCompareList([]); setCompareMode(false); } 
                    else { setCompareList(newList); }
                  }} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {showCombatInfo && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/90" onClick={() => setShowCombatInfo(false)}>
          <div className="bg-[#efe7d6] p-8 rounded-2xl max-w-sm w-full border-4 border-[#3d2314] text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-[#3d2314] font-black text-2xl uppercase mb-4 italic">Внимание</h3>
            <p className="text-[#4d2d1a] font-bold text-sm mb-6">Боевой протокол работает только с заклинаниями в ★ Избранном.</p>
            <button onClick={() => setShowCombatInfo(false)} className="w-full bg-[#3d2314] text-amber-500 py-4 rounded-lg font-black uppercase">Принято</button>
          </div>
        </div>
      )}
    </div>
  );
}