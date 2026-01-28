import React, { useMemo, useState } from "react";

export default function ParomechanicSpells() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [activeSpell, setActiveSpell] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavPane, setShowFavPane] = useState(true);

  // Сравнение
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareResults, setShowCompareResults] = useState(false);

  const categories = {
    "Атакующие": ["Дальний", "Ближний", "Средний"],
    "Защитные": ["Баррикады", "Доп.Броня"],
    "Регенерирующие": ["Персональная", "Массовая"],
    "Помехи": ["Обездвиживание", "Оглушение", "Паралич"]
  };

  const copyToClipboard = (spell) => {
    const cleanText = spell.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const formattedText = `${spell.name.toUpperCase()}\nУровень: ${spell.level}\n${cleanText}`;
    navigator.clipboard.writeText(formattedText).then(() => alert("Описание скопировано!"));
  };

  const getTheme = (description) => {
    if (description?.includes("Атакующие")) return { modalBorder: "border-red-500", header: "bg-red-600" };
    if (description?.includes("Защитные")) return { modalBorder: "border-blue-500", header: "bg-blue-600" };
    if (description?.includes("Регенерирующие")) return { modalBorder: "border-emerald-500", header: "bg-emerald-600" };
    if (description?.includes("Помехи")) return { modalBorder: "border-purple-500", header: "bg-purple-600" };
    return { modalBorder: "border-amber-500", header: "bg-amber-600" };
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
            <p><strong>Время накладывания:</strong> 1 доп. действие</p>
            <p><strong>Дистанция:</strong> 5 футов</p>
            <p><strong>Компоненты:</strong> М (золотая монета)</p>
            <p><strong>Длительность:</strong> 1 секунда</p>
          </div>
          <p class="mb-3 text-amber-100/90 leading-relaxed font-sans">Вы достаёте из кармана одну золотую монету, кладёте её на большой палец и подбрасываете вверх. У вас есть <strong>1 секунда</strong>, чтобы ударить по монете другим атакующим заклинанием.</p>
          <div class="bg-red-900/10 border-l-4 border-red-600 p-3 italic text-amber-200/80">
            При попадании совершите спасбросок Ловкости. При успехе монета наносит <strong>x2 отдельный урон</strong> по цели. Монету можно использовать 1 раз за бой.
          </div>
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
            <p><strong>Длительность:</strong> Мгновенно</p>
          </div>
          <p class="text-amber-100/90 leading-relaxed font-sans">Вы формируете сгусток вращающегося пара и металла. При попадании цель получает 2d8 силового урона и должна пройти спасбросок Силы, иначе будет отброшена на 5 футов и сбита с ног.</p>
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
            <p><strong>Компоненты:</strong> В, С</p>
            <p><strong>Длительность:</strong> 1 раунд</p>
          </div>
          <p class="text-amber-100/90 leading-relaxed font-sans italic">Вы создаете зону мгновенного разрежения воздуха. Существо в этой зоне должно совершить спасбросок Телосложения. При провале оно становится <strong>обездвиженным</strong>, так как его легкие и суставы сковывает перепад давления.</p>
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
            <p><strong>Дистанция:</strong> на себя</p>
            <p><strong>Длительность:</strong> 10 минут (концентрация)</p>
            <p><strong>Компоненты:</strong> В, С, М (латунная пластина)</p>
          </div>
          <p class="text-amber-100/90 leading-relaxed font-serif">Микродвигатели на вашем доспехе или одежде активируются, создавая защитную вибрацию. Вы получаете +3 к КД. Если существо попадает по вам атакой ближнего боя, щит выбрасывает струю пара, наносящую 1d6 огненного урона.</p>
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
            <p><strong>Время:</strong> 1 бонусное действие</p>
            <p><strong>Дистанция:</strong> касание</p>
            <p><strong>Длительность:</strong> 3 раунда</p>
            <p><strong>Компоненты:</strong> М (ампула с эфиром)</p>
          </div>
          <p class="text-amber-100/90 leading-relaxed font-serif">Вы вводите концентрированный эфир в механизмы или тело. В начале каждого вашего хода цель восстанавливает 2d6 хитов. Кроме того, цель получает преимущество на спасброски от истощения и отравления на время действия заклинания.</p>
        `
      },
      {
        name: "Вспышка клапана",
        level: "Заговор",
        components: ["В"],
        description: `
          <h3 class="text-purple-500 text-2xl font-black mb-2 uppercase italic font-serif">Вспышка клапана</h3>
          <p class="text-sm mb-1 text-purple-900 font-bold uppercase font-sans tracking-widest">Заговор | Помехи – Оглушение</p>
          <div class="grid grid-cols-2 gap-2 text-sm bg-purple-950/20 p-3 rounded border border-purple-900/30 mb-4 font-sans">
            <p><strong>Время:</strong> 1 действие</p>
            <p><strong>Дистанция:</strong> 10 футов (радиус)</p>
            <p><strong>Длительность:</strong> Мгновенно</p>
            <p><strong>Компоненты:</strong> В</p>
          </div>
          <p class="text-amber-100/90 leading-relaxed font-serif">Вы резко стравливаете давление из основного котла. Ослепляющее и шумное облако пара вырывается вокруг вас. Все существа в радиусе 10 футов должны пройти спасбросок Ловкости или стать <strong>ослепленными</strong> до начала вашего следующего хода.</p>
        `
      }
    ],
    "Г": [
      {
        name: "Гигантские трубы",
        level: "Заговор",
        components: ["В", "С"],
        description: `
          <h3 class="text-blue-500 text-2xl font-black mb-2 uppercase italic tracking-tighter">Гигантские трубы</h3>
          <p class="text-sm mb-1 text-blue-900 font-bold uppercase tracking-widest">Заговор | Защитные – Баррикады</p>
          <div class="grid grid-cols-2 gap-2 text-sm bg-blue-950/20 p-3 rounded border border-blue-900/30 mb-4 font-sans">
            <p><strong>Время накладывания:</strong> 1 действие</p>
            <p><strong>Дистанция:</strong> 5 футов</p>
            <p><strong>Компоненты:</strong> В, С</p>
            <p><strong>Длительность:</strong> 15 минут</p>
          </div>
          <p class="mb-3 text-amber-100/90 leading-relaxed font-sans">Вы склоняетесь на 1 колено и с трудом поднимаете руки. Из-под земли возвышаются гигантские медные трубы (ширина до 40 см, высота до 1.5 м). Прочность стены зависит от спасброска (от 2 до 5 попаданий).</p>
          <div class="bg-blue-950/30 border-l-4 border-blue-500 p-3 italic text-amber-200/90 text-sm">
            Уровневая шкала: 3-6 (5 ур), 4-7 (11 ур), 5-8 (17 ур). Мощные удары могут сносить больше прочности.
          </div>
        `
      }
    ],
    "М": [
      {
        name: "Молот",
        level: "Заговор",
        components: ["В", "М"],
        description: `
          <h3 class="text-purple-500 text-2xl font-black mb-2 uppercase italic tracking-tighter">Молот</h3>
          <p class="text-sm mb-1 text-purple-900 font-bold uppercase tracking-widest">Заговор | Помехи – Оглушение</p>
          <div class="grid grid-cols-2 gap-2 text-sm bg-purple-950/20 p-3 rounded border border-purple-900/30 mb-4 font-sans">
            <p><strong>Время накладывания:</strong> 10 секунд</p>
            <p><strong>Дистанция:</strong> 10 футов</p>
            <p><strong>Компоненты:</strong> В, М (Медный молоток)</p>
            <p><strong>Длительность:</strong> 1 ход</p>
          </div>
          <p class="mb-3 text-amber-100/90 leading-relaxed">Молоток увеличивается и бьет цель сверху, нанося 1к6 дробящего урона и оглушая на 1 ход. При ударе о землю наносит 1к4 по площади (до 2 целей) и раздробляет почву, создавая помеху для атак врагов.</p>
          <p class="text-sm text-purple-400 font-bold">Рост урона: 5 ур (2к6/2к4), 11 ур (3к6/3к4), 17 ур (4к6/4к4).</p>
        `
      }
    ]
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

  const toggleCompareMode = () => {
    if (compareMode) {
      if (compareList.length >= 2) setShowCompareResults(true);
      setCompareMode(false);
    } else {
      setCompareMode(true);
      setShowCompareResults(false);
      setCompareList([]);
    }
  };

  const handleSpellClick = (spell) => {
    if (compareMode) {
      if (compareList.find(s => s.name === spell.name)) {
        setCompareList(prev => prev.filter(s => s.name !== spell.name));
      } else if (compareList.length < 3) {
        setCompareList(prev => [...prev, spell]);
      }
    } else {
      setActiveSpell(spell);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 p-4 md:p-10 font-serif">
      <div className="max-w-7xl mx-auto">
        
        <header className="border-b-2 border-amber-700/50 pb-6 mb-10">
          <h1 className="text-4xl md:text-6xl font-black text-amber-500 uppercase italic">ЗАКЛИНАНИЯ ПАРОМЕХАНИКА</h1>
          <p className="text-amber-700 text-sm mt-2 tracking-widest font-sans uppercase">v.2.8 | Система сравнения и копирования</p>
        </header>

        {/* ПАНЕЛЬ */}
        <div className="flex flex-wrap gap-4 mb-10 bg-[#111] p-6 border border-amber-900/30 rounded-lg items-center shadow-2xl relative">
          <input 
            type="text" placeholder="Поиск модуля..." 
            className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 flex-grow outline-none focus:border-amber-400"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          
          <div className="flex gap-2">
            <select className="bg-black border border-amber-700/50 p-3 rounded text-amber-100 cursor-pointer" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              <option value="all">Все уровни</option>
              <option value="Заговор">Заговоры</option>
              {[1,2,3,4].map(l => <option key={l} value={String(l)}>{l} уровень</option>)}
            </select>

            <button onClick={toggleCompareMode} className={`px-6 py-3 rounded font-black border-2 transition-all ${compareMode ? 'bg-amber-500 text-black border-white animate-pulse' : 'bg-black text-amber-500 border-amber-900 hover:border-amber-500'}`}>
              {compareMode ? `ГОТОВО (${compareList.length})` : 'СРАВНИТЬ'}
            </button>

            {compareMode && (
              <button onClick={() => {setCompareMode(false); setCompareList([]);}} className="px-6 py-3 bg-red-950 text-red-500 border-2 border-red-900 rounded font-black uppercase text-sm">Отменить</button>
            )}

            <div className="relative">
              <button onClick={() => setShowCategories(!showCategories)} className="px-6 py-3 border border-amber-800/40 rounded hover:bg-amber-900/10 font-bold h-full transition-colors">
                Категории {categoryFilter ? `(${categoryFilter})` : ""}
              </button>
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-amber-100 text-black rounded-lg shadow-2xl z-[110] p-4">
                  <div onClick={() => {setCategoryFilter(null); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-300 px-2 py-1 text-sm font-black border-b border-amber-900/20 mb-2 uppercase">Все модули</div>
                  {Object.entries(categories).map(([cat, subs]) => (
                    <div key={cat} className="mb-3">
                      <div className="font-black text-[10px] uppercase text-amber-900/50 border-b border-amber-900/10 mb-1">{cat}</div>
                      {subs.map(s => (
                        <div key={s} onClick={() => {setCategoryFilter(s); setShowCategories(false);}} className="cursor-pointer hover:bg-amber-300 px-2 py-1 text-sm font-bold">{s}</div>
                      ))}
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
                <h2 className="text-4xl text-amber-600 font-black mb-6 border-b border-amber-900/20 pb-2 uppercase tracking-tighter">{letter}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {spells.map((spell) => {
                    const isSelected = compareList.find(s => s.name === spell.name);
                    const isFav = favorites.find(f => f.name === spell.name);
                    return (
                      <div key={spell.name} onClick={() => handleSpellClick(spell)}
                        className={`group relative p-6 bg-[#141414] border-2 rounded-xl cursor-pointer transition-all duration-300 shadow-xl ${isSelected ? 'border-amber-400 scale-[1.02] bg-amber-900/10' : 'border-amber-900/30 hover:border-amber-500'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-amber-100 uppercase group-hover:text-amber-400 leading-tight">{spell.name}</h3>
                          <span className="text-[10px] font-black py-1 px-2 bg-amber-950 text-amber-500 rounded border border-amber-700 whitespace-nowrap">{spell.level}</span>
                        </div>
                        <div className="flex justify-between items-end mt-8">
                          <div className="flex gap-1">
                            {spell.components.map(c => <span key={c} className="text-[10px] px-2 py-0.5 bg-black border border-amber-900 text-amber-700 rounded font-bold">{c}</span>)}
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setFavorites(prev => prev.find(f => f.name === spell.name) ? prev.filter(f => f.name !== spell.name) : [...prev, spell]); }} 
                            className={`text-2xl transition-transform hover:scale-125 ${isFav ? 'text-amber-400' : 'text-amber-900 hover:text-amber-500'}`}>★</button>
                        </div>
                        {isSelected && <div className="absolute inset-0 border-2 border-amber-400 rounded-xl animate-ping opacity-20 pointer-events-none"></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </main>

          <aside className="lg:col-span-1 space-y-4">
            <button onClick={() => setShowFavPane(!showFavPane)} className={`w-full py-4 rounded-lg border-2 font-black transition-all ${showFavPane ? 'bg-amber-600 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-black text-amber-600 border-amber-900'}`}>★ ИЗБРАННОЕ</button>
            <div className={`overflow-hidden transition-all duration-500 ${showFavPane ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-[#111] border-2 border-amber-600/30 rounded-xl p-4 space-y-2 shadow-2xl">
                {favorites.length === 0 ? <p className="text-center text-amber-900 text-[10px] uppercase py-4 italic">Архив пуст</p> :
                  favorites.map(spell => (
                    <div key={spell.name} onClick={() => setActiveSpell(spell)} className="flex items-center justify-between bg-black p-3 rounded border border-amber-900/30 hover:border-amber-500 cursor-pointer group">
                      <div className="flex flex-col"><span className="text-[9px] text-amber-700 font-bold uppercase">{spell.level}</span><span className="text-sm font-bold text-amber-100 truncate w-32">{spell.name}</span></div>
                      <button onClick={(e) => { e.stopPropagation(); setFavorites(prev => prev.filter(f => f.name !== spell.name)); }} className="text-red-900 hover:text-red-500 text-xl px-2">×</button>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </div>

        {/* СРАВНЕНИЕ (ПИРАМИДА) */}
        {showCompareResults && (
          <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto flex flex-col h-full">
              <div className="flex justify-between items-center mb-8 border-b border-amber-900/30 pb-4">
                <h2 className="text-3xl font-black text-amber-500 italic uppercase">Анализ модулей</h2>
                <button onClick={() => { setShowCompareResults(false); setCompareList([]); }} className="px-8 py-3 bg-amber-600 text-black font-black rounded-lg hover:bg-amber-400 shadow-lg transition-all">ЗАКРЫТЬ ВСЁ</button>
              </div>
              <div className={`grid gap-6 flex-grow ${compareList.length === 3 ? 'grid-cols-2 lg:grid-cols-6' : 'grid-cols-1 lg:grid-cols-2'}`}>
                {compareList.map((spell, idx) => {
                  const theme = getTheme(spell.description);
                  const isSpanning = compareList.length === 3 && idx === 0;
                  return (
                    <div key={spell.name} className={`bg-[#1a1a1a] border-2 ${theme.modalBorder} rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all duration-500 ${isSpanning ? 'lg:col-span-6 lg:max-w-2xl lg:mx-auto w-full' : 'lg:col-span-3'}`}>
                      <div className={`${theme.header} p-3 flex justify-between items-center text-black font-black uppercase`}>
                        <span className="text-xs">{spell.name}</span>
                        <div className="flex gap-4 items-center">
                          <button onClick={() => copyToClipboard(spell)} className="text-[10px] bg-black/20 px-2 py-1 rounded hover:bg-black/40 transition-colors uppercase">Копировать</button>
                          <button onClick={() => { const newList = compareList.filter(s => s.name !== spell.name); newList.length < 2 ? (setShowCompareResults(false), setCompareList([])) : setCompareList(newList); }} className="text-2xl leading-none">&times;</button>
                        </div>
                      </div>
                      <div className="p-8 overflow-y-auto max-h-[65vh] font-sans" dangerouslySetInnerHTML={{ __html: spell.description }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* МОДАЛКА */}
        {activeSpell && !showCompareResults && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveSpell(null)}>
            <div className={`bg-[#1a1a1a] border-2 ${getTheme(activeSpell.description).modalBorder} max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl`} onClick={e => e.stopPropagation()}>
              <div className={`${getTheme(activeSpell.description).header} p-4 flex justify-between items-center text-black font-black uppercase italic`}>
                <span className="text-sm">Спецификация</span>
                <div className="flex gap-6 items-center">
                  <button onClick={() => copyToClipboard(activeSpell)} className="text-[10px] bg-black/20 px-3 py-1.5 rounded hover:bg-black/40 transition-all uppercase font-bold">Скопировать</button>
                  <button onClick={() => setActiveSpell(null)} className="text-3xl leading-none hover:rotate-90 transition-transform">&times;</button>
                </div>
              </div>
              <div className="p-10 text-amber-50/90 text-lg leading-relaxed max-h-[75vh] overflow-y-auto font-sans" dangerouslySetInnerHTML={{ __html: activeSpell.description }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}