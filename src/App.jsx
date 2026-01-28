import React, { useMemo, useState, useEffect } from "react";

export default function ParomechanicSpells() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [componentFilter, setComponentFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [activeSpell, setActiveSpell] = useState(null);
  
  // Состояние для избранного
  const [favorites, setFavorites] = useState([]);
  const [showFavPane, setShowFavPane] = useState(true);

  const categories = {
    "Атакующие": ["Дальний", "Ближний", "Средний"],
    "Защитные": ["Баррикады", "Доп.Броня"],
    "Регенерирующие": ["Персональная", "Массовая"],
    "Помехи": ["Обездвиживание", "Оглушение", "Паралич"]
  };

  const getTheme = (description) => {
    if (description.includes("Атакующие")) return {
      text: "text-red-500", bg: "bg-red-950/20", border: "border-red-900/30",
      accent: "text-red-900", modalBorder: "border-red-500", header: "bg-red-600"
    };
    if (description.includes("Защитные")) return {
      text: "text-blue-500", bg: "bg-blue-950/20", border: "border-blue-900/30",
      accent: "text-blue-900", modalBorder: "border-blue-500", header: "bg-blue-600"
    };
    if (description.includes("Регенерирующие")) return {
      text: "text-emerald-500", bg: "bg-emerald-950/20", border: "border-emerald-900/30",
      accent: "text-emerald-900", modalBorder: "border-emerald-500", header: "bg-emerald-600"
    };
    if (description.includes("Помехи")) return {
      text: "text-purple-500", bg: "bg-purple-950/20", border: "border-purple-900/30",
      accent: "text-purple-900", modalBorder: "border-purple-500", header: "bg-purple-600"
    };
    return {
      text: "text-amber-500", bg: "bg-black/30", border: "border-amber-900/20",
      accent: "text-amber-700", modalBorder: "border-amber-500", header: "bg-amber-600"
    };
  };

  const spellsData = {
    "В": [
      {
        name: "Волшебная монетка",
        level: "Заговор",
        components: ["М"],
        description: `
          <h3 class="text-red-500 text-2xl font-black mb-2 uppercase italic tracking-tighter">Волшебная монетка</h3>
          <p class="text-sm mb-1 text-red-900 font-bold uppercase tracking-widest">Заговор | Атакующие – Дальний</p>
          <div class="grid grid-cols-2 gap-2 text-sm bg-red-950/20 p-3 rounded border border-red-900/30 mb-4 font-sans">
            <p><strong>Время:</strong> 1 доп. действие</p>
            <p><strong>Дистанция:</strong> 5 футов</p>
            <p><strong>Компоненты:</strong> М</p>
            <p><strong>Длительность:</strong> 1 сек</p>
          </div>
          <p class="mb-3 text-amber-100/90 leading-relaxed font-sans">Вы подбрасываете монету и бьете по ней заклинанием. При успехе урон x2.</p>
        `
      },
      {
        name: "Вихревой болт",
        level: "1",
        components: ["В", "С"],
        description: `
          <h3 class="text-red-500 text-2xl font-black mb-2 uppercase italic">Вихревой болт</h3>
          <p class="text-sm mb-1 text-red-900 font-bold uppercase font-sans">1-й уровень | Атакующие – Средний</p>
          <div class="grid grid-cols-2 gap-2 text-sm bg-red-950/20 p-3 rounded border border-red-900/30 mb-4 font-sans">
            <p><strong>Время:</strong> 1 действие</p>
            <p><strong>Дистанция:</strong> 30 футов</p>
            <p><strong>Компоненты:</strong> В, С</p>
          </div>
          <p class="text-amber-100/90 leading-relaxed font-sans">Сгусток пара наносит 2d8 урона и отбрасывает цель.</p>
        `
      },
      {
        name: "Вакуумный рывок",
        level: "2",
        components: ["В", "С"],
        description: `
          <h3 class="text-purple-500 text-2xl font-black mb-2 uppercase italic">Вакуумный рывок</h3>
          <p class="text-sm mb-1 text-purple-900 font-bold uppercase font-sans">2-й уровень | Помехи – Обездвиживание</p>
          <div class="grid grid-cols-2 gap-2 text-sm bg-purple-950/20 p-3 rounded border border-purple-900/30 mb-4 font-sans">
            <p><strong>Время:</strong> 1 действие</p>
            <p><strong>Дистанция:</strong> 20 футов</p>
          </div>
          <p class="text-amber-100/90 font-sans italic">Обездвиживает цель перепадом давления.</p>
        `
      },
      {
        name: "Верньерный щит",
        level: "3",
        components: ["В", "С", "М"],
        description: `
          <h3 class="text-blue-500 text-2xl font-black mb-2 uppercase italic">Верньерный щит</h3>
          <p class="text-sm mb-1 text-blue-900 font-bold uppercase font-sans">3-й уровень | Защитные – Баррикады</p>
          <div class="grid grid-cols-2 gap-2 text-sm bg-blue-950/20 p-3 rounded border border-blue-900/30 mb-4 font-sans">
            <p><strong>Время:</strong> 1 действие</p>
            <p><strong>КД:</strong> +3</p>
          </div>
          <p class="text-amber-100/90 font-sans leading-relaxed">Создает защитную вибрацию вокруг доспеха.</p>
        `
      },
      {
        name: "Впрыск эфира",
        level: "4",
        components: ["М"],
        description: `
          <h3 class="text-emerald-500 text-2xl font-black mb-2 uppercase italic">Впрыск эфира</h3>
          <p class="text-sm mb-1 text-emerald-900 font-bold uppercase font-sans">4-й уровень | Регенерирующие – Персональная</p>
          <div class="grid grid-cols-2 gap-2 text-sm bg-emerald-950/20 p-3 rounded border border-emerald-900/30 mb-4 font-sans">
            <p><strong>Длительность:</strong> 3 раунда</p>
            <p><strong>Лечение:</strong> 2d6</p>
          </div>
          <p class="text-amber-100/90 font-sans leading-relaxed">Восстанавливает хиты каждый ход.</p>
        `
      }
    ]
  };

  const toggleFavorite = (spell, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.find(f => f.name === spell.name) 
        ? prev.filter(f => f.name !== spell.name) 
        : [...prev, spell]
    );
  };

  const toggleComponent = (c) => {
    setComponentFilter(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const filteredData = useMemo(() => {
    const result = {};
    Object.entries(spellsData).forEach(([letter, spells]) => {
      const filtered = spells.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = levelFilter === "all" || s.level === levelFilter;
        const matchesComp = componentFilter.length === 0 || componentFilter.every(c => s.components.includes(c));
        const matchesCat = !categoryFilter || s.description.includes(categoryFilter);
        return matchesSearch && matchesLevel && matchesComp && matchesCat;
      });
      if (filtered.length) result[letter] = filtered;
    });
    return result;
  }, [search, levelFilter, componentFilter, categoryFilter]);

  const activeTheme = activeSpell ? getTheme(activeSpell.description) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 p-4 md:p-10 font-serif">
      <div className="max-w-6xl mx-auto">
        
        <header className="border-b-2 border-amber-700/50 pb-6 mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-amber-500 tracking-tighter uppercase italic">
              ЗАКЛИНАНИЯ ПАРОМЕХАНИКА
            </h1>
            <p className="text-amber-700 text-sm mt-2 tracking-[0.3em] font-sans uppercase">Системы v.2.5 | Архив активен</p>
          </div>
        </header>

        {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
        <div className="flex flex-wrap gap-4 mb-10 bg-[#111] p-6 border border-amber-900/30 rounded-lg items-center relative">
          <input 
            type="text" placeholder="Поиск модуля..." 
            className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 flex-grow outline-none focus:border-amber-400 text-lg"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          
          <select 
            className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 outline-none cursor-pointer text-lg"
            value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">Все уровни</option>
            <option value="Заговор">Заговоры</option>
            {[1,2,3,4].map(l => <option key={l} value={String(l)}>{l} уровень</option>)}
          </select>

          <div className="relative">
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className="px-6 py-3 border border-amber-800/40 rounded hover:bg-amber-900/10 text-lg font-bold"
            >
              Категории
            </button>
            {showCategories && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-amber-100 text-black rounded-lg shadow-2xl z-50 p-4">
                {Object.entries(categories).map(([cat, subs]) => (
                  <div key={cat} className="mb-3">
                    <div className="font-black text-xs uppercase text-amber-900 border-b border-amber-300 mb-1">{cat}</div>
                    {subs.map(s => (
                      <div key={s} onClick={() => {setCategoryFilter(s); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-300 px-2 py-1 text-sm font-bold">{s}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => {setSearch(""); setLevelFilter("all"); setComponentFilter([]); setCategoryFilter(null);}} className="px-4 py-2 bg-red-900/10 text-red-500 rounded border border-red-900/50 hover:bg-red-900/20 text-xs font-bold uppercase">Сброс</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <main className="lg:col-span-3 space-y-16">
            {Object.entries(filteredData).map(([letter, spells]) => (
              <div key={letter}>
                <h2 className="text-4xl text-amber-600 font-black mb-8 border-b-2 border-amber-900/20 pb-2">{letter}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {spells.map((spell) => {
                    const isFav = favorites.find(f => f.name === spell.name);
                    return (
                      <div 
                        key={spell.name} onClick={() => setActiveSpell(spell)}
                        className="group relative p-6 bg-[#141414] border-2 border-amber-900/30 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-900/5 transition-all shadow-xl"
                      >
                        <button 
                          onClick={(e) => toggleFavorite(spell, e)}
                          className={`absolute top-4 right-12 text-2xl transition-colors ${isFav ? 'text-amber-400' : 'text-amber-900 hover:text-amber-600'}`}
                        >
                          ★
                        </button>
                        <h3 className="text-2xl font-bold text-amber-100 uppercase group-hover:text-amber-400">{spell.name}</h3>
                        <span className="inline-block mt-2 text-xs font-black py-1 px-2 bg-amber-950 text-amber-500 rounded border border-amber-700">
                          {spell.level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </main>

          {/* БОКОВАЯ ПАНЕЛЬ */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFavPane(!showFavPane)}
                className={`flex-grow py-3 rounded border transition-all font-black flex items-center justify-center gap-2 ${showFavPane ? 'bg-amber-600 text-black border-amber-400' : 'bg-black text-amber-600 border-amber-900'}`}
              >
                ★ ИЗБРАННОЕ
              </button>
              <div className="bg-[#0f0f0f] border-2 border-amber-900/50 rounded-lg p-3 flex items-center justify-center min-w-[60px]">
                <span className="text-amber-500 font-mono text-xl font-black">{Object.values(filteredData).flat().length}</span>
              </div>
            </div>

            {/* ВЫПАДАЮЩИЙ БЛОК ИЗБРАННОГО */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFavPane ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-[#111] border-2 border-amber-600/30 rounded-xl p-4 shadow-2xl">
                <div className="flex justify-center mb-4 border-b border-amber-900/30 pb-2">
                  <span className="text-amber-600 text-xl animate-pulse">★</span>
                </div>
                
                <div className="space-y-2">
                  {favorites.length === 0 ? (
                    <p className="text-center text-amber-900 text-xs uppercase py-4 italic">Список пуст</p>
                  ) : (
                    favorites.map(spell => (
                      <div 
                        key={spell.name}
                        onClick={() => setActiveSpell(spell)}
                        className="flex items-center justify-between bg-black p-3 rounded border border-amber-900/30 hover:border-amber-500 cursor-pointer group transition-all"
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] text-amber-700 font-bold uppercase leading-none mb-1">{spell.level}</span>
                          <span className="text-sm font-bold text-amber-100 group-hover:text-amber-400 truncate w-32">{spell.name}</span>
                        </div>
                        <button onClick={(e) => toggleFavorite(spell, e)} className="text-red-900 hover:text-red-500 text-lg">×</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* МОДАЛКА */}
        {activeSpell && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveSpell(null)}>
            <div className={`bg-[#1a1a1a] border-2 ${activeTheme.modalBorder} max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl`} onClick={e => e.stopPropagation()}>
              <div className={`${activeTheme.header} p-4 flex justify-between items-center text-black font-black uppercase italic`}>
                <span className="text-sm">Спецификация</span>
                <button onClick={() => setActiveSpell(null)} className="text-3xl leading-none">&times;</button>
              </div>
              <div className="p-10 text-amber-50/90 max-h-[75vh] overflow-y-auto font-sans" dangerouslySetInnerHTML={{ __html: activeSpell.description }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}