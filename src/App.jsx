import React, { useMemo, useState, useEffect } from "react";
import { spellsData, categories } from "./data/spells";
import { getSpellTheme } from "./utils/themeEngine";
import SpellCard from "./components/SpellCard";
import SpellModal from "./components/SpellModal";
import CombatMode from "./modules/CombatMode";
import DiceRoller from "./components/DiceRoller";
import ikona from "./ikona.jpg";
import InfoModal from "./components/InfoModal";
import FilterPanel from "./components/FilterPanel"; 

export default function App() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [activeSpell, setActiveSpell] = useState(null);
  const [isCombatMode, setIsCombatMode] = useState(false);
  const [showCombatInfo, setShowCombatInfo] = useState(false);
  const [showDiceInfo, setShowDiceInfo] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [compFilter, setCompFilter] = useState([]); 
  const [distFilter, setDistFilter] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareResults, setShowCompareResults] = useState(false);

  // --- НОВАЯ СТРОЧКА ДЛЯ АНИМАЦИИ ---
  const [isClosing, setIsClosing] = useState(false);

  // --- НОВАЯ ФУНКЦИЯ ЗАКРЫТИЯ (ЕДИНАЯ ДЛЯ ВСЕХ) ---
  const closeWithAnim = (setter) => {
    setIsClosing(true);
    setTimeout(() => {
      setter(false);
      if (setter === setActiveSpell) setter(null);
      setIsClosing(false);
    }, 250);
  };

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
          const rangeStr = (s.distance || s.range || "").toLowerCase();
          const match = rangeStr.match(/\d+/); 
          const num = match ? parseInt(match[0]) : 0;
          
          if (distFilter === "self") matchesDist = rangeStr.includes("на себя") || rangeStr.includes("self");
          else if (distFilter === "touch") matchesDist = rangeStr.includes("касание") || rangeStr.includes("touch");
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-serif flex flex-col h-screen overflow-hidden">
      <header className="p-6 pb-2 w-full flex-shrink-0 z-10">
        <div className="max-w-[1400px] mx-auto border-b border-amber-900/20 pb-2">
          <h1 className="text-3xl md:text-5xl font-black text-amber-500 uppercase italic tracking-tighter">АРХИВ ПАРОМЕХАНИКА</h1>
          <p className="text-amber-700 text-[10px] uppercase tracking-[0.3em] font-sans font-bold italic mt-1">Онямашки2.0! v.0.9.3.1 • Тупой-Вайбкодер: Whykenns</p>
        </div>
      </header>

      <div className="flex gap-4 px-4 md:px-10 pb-4 max-w-[1600px] mx-auto w-full flex-grow overflow-hidden relative">
        <div className="w-20 md:w-28 flex-shrink-0 flex flex-col h-full z-10">
          <div className="bg-amber-600 py-2 rounded-t-xl text-center font-black text-[14px] text-black uppercase tracking-tighter">Система</div>
          <div className="bg-amber-500 flex-grow flex flex-col items-center py-4 rounded-b-xl border-x border-b border-amber-600/50 shadow-2xl overflow-y-auto no-scrollbar">
            <button onClick={() => setIsCombatMode(!isCombatMode)} className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all border-b-4 ${isCombatMode ? 'bg-red-700 border-red-950 translate-y-1' : 'bg-zinc-900 border-black hover:bg-zinc-800'}`}>
              <span className="text-white text-xl">⚔️</span>
            </button>
            <button onClick={() => setShowCombatInfo(true)} className="mt-2 w-8 h-8 bg-[#3d2314] rounded-full flex items-center justify-center text-amber-500 font-black italic border border-amber-900/20">i</button>
            <div className="w-full border-t border-black/10 my-4" />
            <DiceRoller setShowDiceInfo={setShowDiceInfo} />
          </div>
        </div>

        <div className="flex-grow flex flex-col gap-4 min-w-0 h-full overflow-hidden">
          {!isCombatMode && (
            <FilterPanel 
              search={search} setSearch={setSearch}
              levelFilter={levelFilter} setLevelFilter={setLevelFilter}
              distFilter={distFilter} setDistFilter={setDistFilter}
              compFilter={compFilter} setCompFilter={setCompFilter}
              showCategories={showCategories} setShowCategories={setShowCategories}
              categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
              categories={categories}
              compareMode={compareMode} setCompareMode={setCompareMode}
              compareList={compareList} setCompareList={setCompareList}
              setShowCompareResults={setShowCompareResults}
            />
          )}

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar pb-10" onClick={() => setShowCategories(false)}>
            {isCombatMode ? (
              <CombatMode favorites={favorites} compareList={compareList} toggleFav={toggleFav} setActiveSpell={setActiveSpell} compareMode={compareMode} setCompareList={setCompareList} setCompareMode={setCompareMode} setShowCompareResults={setShowCompareResults} />
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                <main className="flex-grow space-y-10">
                  {Object.entries(filteredData).map(([letter, spells]) => (
                    <div key={letter}>
                      <h2 className="text-xl text-amber-600 font-black mb-4 uppercase border-l-4 border-amber-600 pl-3">{letter}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {spells.map(s => <SpellCard key={s.name} spell={s} isFav={favorites.some(f => f.name === s.name)} isSelected={compareList.some(cl => cl.name === s.name)} onClick={() => compareMode ? (compareList.some(cl => cl.name === s.name) ? setCompareList(p => p.filter(x => x.name !== s.name)) : compareList.length < 3 && setCompareList(p => [...p, s])) : setActiveSpell(s)} onFav={toggleFav} />)}
                      </div>
                    </div>
                  ))}
                </main>
                
                <aside className="w-full lg:w-[260px] space-y-4">
                  <button onClick={() => setShowInfoModal(true)} className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-2 rounded text-[10px] uppercase shadow-lg">ИНФО ПАРОМЕХАНИКА</button>
                  <div className="bg-black border-2 border-amber-900/40 rounded-lg overflow-hidden shadow-2xl">
                    <img src={ikona} alt="Механик" className="w-full grayscale opacity-80" />
                  </div>
                  <div className="bg-[#111] p-3 border border-amber-600/20 rounded-lg shadow-2xl">
                    <h3 className="text-amber-500 font-black text-center text-[9px] uppercase border-b border-amber-900/20 pb-1 mb-3 italic">★ Избранное</h3>
                    {favorites.map(f => (
                      <div key={f.name} onClick={() => setActiveSpell(f)} className="flex items-center justify-between bg-black p-2 mb-1 rounded border border-amber-900/20 hover:border-amber-500 cursor-pointer transition-all group">
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

      {/* --- МОДАЛЬНЫЕ ОКНА С АНИМАЦИЕЙ --- */}
      <InfoModal isOpen={showInfoModal} isClosing={isClosing} onClose={() => closeWithAnim(setShowInfoModal)} />
      
      {showCombatInfo && (
        <div className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={() => closeWithAnim(setShowCombatInfo)}>
           <div className={`bg-zinc-900 border-2 border-red-600 p-6 rounded-2xl max-w-lg modal-animate ${isClosing ? 'modal-exit' : ''}`} onClick={e => e.stopPropagation()}>
              <h2 className="text-red-500 font-black text-2xl mb-4">ИНФО БИТВЫ</h2>
              <p className="text-amber-100 text-sm italic leading-relaxed">Здесь находятся протоколы ведения боя. Следите за дебаффами и состоянием безумия при использовании систем.</p>
              <button onClick={() => closeWithAnim(setShowCombatInfo)} className="mt-6 w-full py-2 bg-red-600 text-white font-black rounded uppercase">Понял</button>
           </div>
        </div>
      )}

      {showDiceInfo && (
        <div className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={() => closeWithAnim(setShowDiceInfo)}>
           <div className={`bg-zinc-900 border-2 border-red-600 p-6 rounded-2xl max-w-lg modal-animate ${isClosing ? 'modal-exit' : ''}`} onClick={e => e.stopPropagation()}>
              <h2 className="text-red-500 font-black text-2xl mb-4 uppercase">Система рандома</h2>
              <p className="text-red-100 text-sm italic leading-relaxed">Используйте модули костей ниже для расчёта вероятностей и повреждений механизмов. Сброс числа по красной кнопке при наведении на кость.</p>
              <button onClick={() => closeWithAnim(setShowDiceInfo)} className="mt-6 w-full py-2 bg-red-600 text-white font-black rounded uppercase">Принято</button>
           </div>
        </div>
      )}

      {activeSpell && (
        <div className={`fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={() => closeWithAnim(setActiveSpell)}>
          <div className={`max-w-2xl w-full modal-animate ${isClosing ? 'modal-exit' : ''}`} onClick={e => e.stopPropagation()}>
            <SpellModal spell={activeSpell} theme={getSpellTheme(activeSpell)} onClose={() => closeWithAnim(setActiveSpell)} />
          </div>
        </div>
      )}

      {showCompareResults && (
        <div className={`fixed inset-0 z-[700] bg-black/80 backdrop-blur-xl p-6 overflow-y-auto flex flex-col items-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-full max-w-6xl flex justify-between mb-8 border-b border-amber-900/30 pb-4 items-center">
            <h2 className="text-2xl font-black text-amber-500 uppercase italic">Анализ систем</h2>
            <button onClick={() => closeWithAnim(setShowCompareResults)} className="px-6 py-2 bg-amber-600 text-black font-black rounded text-xs uppercase">Закрыть</button>
          </div>
          <div className={`flex flex-wrap justify-center gap-6 w-full modal-animate ${isClosing ? 'modal-exit' : ''}`}>
            {compareList.map(s => (
              <div key={s.name} className="w-full max-w-[400px]">
                <SpellModal 
                  spell={s} 
                  theme={getSpellTheme(s)} 
                  isCompare={true} 
                  onClose={() => setCompareList(prev => prev.filter(item => item.name !== s.name))} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}