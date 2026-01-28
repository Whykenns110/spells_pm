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

  // Хэндлер для кнопки Сравнить/Отмена
  const handleCompareClick = () => {
    if (compareMode) {
      if (compareList.length >= 2) {
        setShowCompareResults(true);
      } else {
        // Если ничего не выбрали или только одно — просто выходим из режима
        setCompareMode(false);
        setCompareList([]);
      }
    } else {
      setCompareMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-serif overflow-x-hidden">
      <header className="p-10 pb-6 max-w-[1600px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-amber-500 uppercase italic leading-tight">АРХИВ ПАРОМЕХАНИКА</h1>
        <p className="text-amber-700 text-sm mt-2 uppercase tracking-widest font-sans">v.6.0 | Фикс геометрии</p>
      </header>

      <div className="flex gap-6 px-4 md:px-10 pb-10 max-w-[1600px] mx-auto relative">
        
        {/* ЛЕВАЯ ПАНЕЛЬ */}
        <div className="w-24 md:w-36 flex-shrink-0 flex flex-col items-center sticky top-6 h-[calc(100vh-48px)] z-[100]">
          <div className="w-full bg-amber-600 pt-5 pb-3 rounded-t-2xl border-b-2 border-black/20 flex flex-col items-center shadow-lg">
            <span className="text-[10px] md:text-xs font-black text-black uppercase text-center px-1">ПАНЕЛЬ УПРАВЛЕНИЯ</span>
          </div>
          <div className="w-full bg-amber-500 flex-grow flex flex-col items-center py-8 gap-8 shadow-2xl rounded-b-xl border-x border-b border-amber-600/50">
            <button onClick={() => setIsCombatMode(!isCombatMode)} className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center transition-all shadow-xl border-b-4 ${isCombatMode ? 'bg-red-700 border-red-950 scale-95' : 'bg-zinc-900 border-black hover:bg-zinc-800'}`}>
              <span className="text-white text-3xl">⚔️</span>
              <span className="text-[9px] text-white font-black mt-1 uppercase">БОЙ</span>
            </button>
            <button onClick={() => setShowCombatInfo(true)} className="w-10 h-10 md:w-14 md:h-14 bg-[#3d2314] border-b-4 border-[#1a0f08] rounded-full flex items-center justify-center hover:bg-[#4d2d1a] transition-all shadow-lg group">
              <span className="text-amber-500 font-black text-xl italic group-hover:scale-110 transition-transform">i</span>
            </button>
            <div className="mt-auto pb-8 opacity-50 select-none">
               <div className="text-black font-black text-[11px] uppercase vertical-text tracking-[0.2em]">ENGINEER_OS</div>
            </div>
          </div>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="flex-grow flex flex-col gap-6 min-w-0">
          {isCombatMode ? (
            <CombatMode favorites={favorites} compareList={compareList} toggleFav={toggleFav} setActiveSpell={setActiveSpell} compareMode={compareMode} setCompareList={setCompareList} setCompareMode={setCompareMode} setShowCompareResults={setShowCompareResults} />
          ) : (
            <>
              {/* ПОИСКОВАЯ СТРОКА */}
              <div className="sticky top-0 z-[60] bg-[#0a0a0a] pt-2 pb-4 border-b-2 border-amber-500/50">
                <div className="flex flex-wrap gap-4 bg-[#111] p-4 border border-amber-900/30 rounded-lg items-center shadow-2xl relative">
                  <input type="text" placeholder="Поиск чертежа..." className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 flex-grow outline-none focus:border-amber-400 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <div className="flex gap-2 items-center">
                    <select className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 text-sm outline-none" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                      <option value="all">Все уровни</option>
                      <option value="Заговор">Заговоры</option>
                      {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={String(l)}>{l} уровень</option>)}
                    </select>
                    
                    <button onClick={handleCompareClick} className={`px-4 py-3 rounded font-black border-2 text-[10px] transition-all ${compareMode ? 'bg-amber-500 text-black border-white' : 'bg-black text-amber-500 border-amber-900'}`}>
                        {compareMode ? (compareList.length >= 2 ? 'АНАЛИЗ' : 'ОТМЕНА') : 'СРАВНИТЬ'}
                    </button>

                    <button onClick={() => setShowCategories(!showCategories)} className={`px-4 py-3 border rounded font-bold text-[10px] uppercase transition-all ${categoryFilter ? 'bg-amber-600 text-black border-amber-400' : 'border-amber-800/40 text-amber-500'}`}>
                      {categoryFilter || 'Категории'}
                    </button>
                  </div>

                  {/* ВЫПАДАЮЩЕЕ ОКНО КАТЕГОРИЙ */}
                  {showCategories && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a1a] border-2 border-amber-600 shadow-[0_10px_50px_rgba(0,0,0,0.8)] p-4 grid grid-cols-1 gap-2 z-[210] rounded-xl">
                      <button onClick={() => {setCategoryFilter(null); setShowCategories(false);}} className="text-left p-2 hover:bg-amber-900/30 text-xs uppercase font-bold text-amber-500">Все категории</button>
                      {categories.map(cat => (
                        <button key={cat} onClick={() => {setCategoryFilter(cat); setShowCategories(false);}} className="text-left p-2 hover:bg-amber-600 hover:text-black text-xs uppercase font-bold transition-colors rounded">
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-grow space-y-12">
                  {Object.entries(filteredData).map(([letter, spells]) => (
                    <div key={letter}>
                      <h2 className="text-2xl text-amber-600 font-black mb-6 uppercase border-l-4 border-amber-600 pl-4 tracking-tighter">{letter}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {spells.map(spell => (
                          <div key={spell.name} className="w-full max-w-[300px]">
                            <SpellCard 
                              spell={spell} 
                              isSelected={compareList.some(s => s.name === spell.name)} 
                              isFav={favorites.some(f => f.name === spell.name)} 
                              onClick={(s) => compareMode 
                                ? (compareList.some(i => i.name === s.name) 
                                    ? setCompareList(prev => prev.filter(i => i.name !== s.name)) 
                                    : compareList.length < 3 && setCompareList(prev => [...prev, s])) 
                                : setActiveSpell(s)
                              } 
                              onFav={toggleFav} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </main>

                <aside className="w-full lg:w-[300px] flex-shrink-0 sticky top-[120px] max-h-[calc(100vh-160px)] overflow-y-auto pr-2 custom-scrollbar font-sans">
                  <button onClick={() => setShowFavPane(!showFavPane)} className={`w-full py-3 rounded-t-lg border-2 font-black text-sm transition-all ${showFavPane ? 'bg-amber-600 text-black border-amber-400 shadow-lg' : 'bg-black text-amber-600 border-amber-900'}`}>★ АРХИВ</button>
                  {showFavPane && (
                    <div className="bg-[#111] border-2 border-t-0 border-amber-600/30 rounded-b-xl p-3 space-y-2">
                      {favorites.length === 0 ? <p className="text-center text-amber-900 text-[10px] uppercase py-4 italic">Система ожидания...</p> :
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
                  )}
                </aside>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* РЕНДЕР МОДАЛЬНОГО ОКНА (ТОТ САМЫЙ ПРОПАВШИЙ БЛОК) */}
      {activeSpell && (
        <SpellModal 
          spell={activeSpell} 
          onClose={() => setActiveSpell(null)} 
          isFav={favorites.some(f => f.name === activeSpell.name)}
          onFav={toggleFav}
        />
      )}

      {showCombatInfo && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowCombatInfo(false)}>
          <div className="bg-[#efe7d6] p-8 rounded-2xl max-w-sm w-full border-4 border-[#3d2314] shadow-[0_0_60px_rgba(0,0,0,0.8)] text-center" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-4 grayscale">🛠️</div>
            <h3 className="text-[#3d2314] font-black text-2xl uppercase mb-4 italic leading-none">Система Боя</h3>
            <p className="text-[#4d2d1a] font-bold leading-tight text-sm">Добавьте модули в избранное для активации протокола.</p>
            <button onClick={() => setShowCombatInfo(false)} className="mt-8 w-full bg-[#3d2314] text-amber-500 py-4 rounded-lg font-black uppercase hover:bg-[#2a180e] transition-all">ПРИНЯТО</button>
          </div>
        </div>
      )}
    </div>
  );
}