import React, { useMemo, useState } from "react";

export default function ParomechanicSpells() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [componentFilter, setComponentFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [activeSpell, setActiveSpell] = useState(null);

  const categories = {
    "Атакующие": ["Дальний", "Ближний", "Средний"],
    "Защитные": ["Баррикады", "Доп.Броня"],
    "Регенерирующие": ["Персональная", "Массовая"],
    "Помехи": ["Обездвиживание", "Оглушение", "Паралич"]
  };

  // Автоматическая настройка цветов в зависимости от категории
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
            <p><strong>Время накладывания:</strong> 1 доп. действие</p>
            <p><strong>Дистанция:</strong> 5 футов</p>
            <p><strong>Компоненты:</strong> М (золотая монета)</p>
            <p><strong>Длительность:</strong> 1 секунда</p>
          </div>
          <p class="mb-3 text-amber-100/90 leading-relaxed">Вы достаёте из кармана одну золотую монету, кладёте её на большой палец и подбрасываете вверх. У вас есть <strong>1 секунда</strong>, чтобы ударить по монете другим атакующим заклинанием.</p>
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
          <p class="text-amber-100/90 leading-relaxed">Вы формируете сгусток вращающегося пара и металла. При попадании цель получает 2d8 силового урона и должна пройти спасбросок Силы, иначе будет отброшена на 5 футов и сбита с ног.</p>
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
          <p class="text-amber-100/90 leading-relaxed italic">Вы создаете зону мгновенного разрежения воздуха. Существо в этой зоне должно совершить спасбросок Телосложения. При провале оно становится <strong>обездвиженным</strong>, так как его легкие и суставы сковывает перепад давления.</p>
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
    ]
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
        
        <header className="border-b-2 border-amber-700/50 pb-6 mb-10">
          <h1 className="text-4xl md:text-6xl font-black text-amber-500 tracking-tighter uppercase italic">
            ЗАКЛИНАНИЯ ПАРОМЕХАНИКА
          </h1>
          <p className="text-amber-700 text-sm mt-2 tracking-[0.3em] font-sans uppercase">Системы v.2.4 | Архив активен</p>
        </header>

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

          <div className="flex gap-2 bg-black p-2 border border-amber-800/40 rounded">
            {["В", "С", "М"].map(c => (
              <button 
                key={c} onClick={() => toggleComponent(c)}
                className={`w-10 h-10 rounded font-bold text-xl transition-all ${componentFilter.includes(c) ? 'bg-amber-600 text-black' : 'text-amber-700 hover:bg-amber-900/20'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className="px-6 py-3 border border-amber-800/40 rounded hover:bg-amber-900/10 text-lg font-bold"
            >
              Категории {categoryFilter ? `(${categoryFilter})` : ""}
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

          <button 
            onClick={() => {setSearch(""); setLevelFilter("all"); setComponentFilter([]); setCategoryFilter(null);}}
            className="px-4 py-2 bg-red-900/20 text-red-500 rounded border border-red-900/50 hover:bg-red-900/40 text-xs uppercase font-bold"
          >
            Сброс
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <main className="lg:col-span-3 space-y-16">
            {Object.entries(filteredData).map(([letter, spells]) => (
              <div key={letter}>
                <h2 className="text-4xl text-amber-600 font-black mb-8 border-b-2 border-amber-900/20 pb-2">{letter}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {spells.map((spell) => (
                    <div 
                      key={spell.name} onClick={() => setActiveSpell(spell)}
                      className="group relative p-6 bg-[#141414] border-2 border-amber-900/30 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-900/5 transition-all duration-300 shadow-xl"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold text-amber-100 uppercase group-hover:text-amber-400 leading-tight">{spell.name}</h3>
                          <div className="flex gap-2 mt-3">
                            {spell.components.map(c => (
                              <span key={c} className="text-xs px-2 py-1 border border-amber-800 text-amber-700 rounded font-bold bg-black">{c}</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs font-black py-1.5 px-3 bg-amber-950 text-amber-500 rounded border border-amber-700 uppercase tracking-tighter">
                          {spell.level === "Заговор" ? "Заговор" : `${spell.level}-ур`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </main>

          <aside className="lg:col-span-1">
            <div className="sticky top-10 p-8 border-2 border-amber-900/50 bg-[#0f0f0f] rounded-2xl shadow-2xl">
              <h3 className="text-amber-500 font-black uppercase text-lg tracking-widest mb-6 border-b-2 border-amber-900/50 pb-2 text-center">Статистика</h3>
              <div className="space-y-6 text-sm">
                <div className="flex justify-between items-center border-b border-amber-900/20 pb-2">
                  <span className="text-amber-700 uppercase font-bold">Модулей:</span>
                  <span className="text-amber-400 font-mono text-2xl font-black">{Object.values(filteredData).flat().length}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {activeSpell && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveSpell(null)}>
            <div className={`bg-[#1a1a1a] border-2 ${activeTheme.modalBorder} max-w-2xl w-full rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]`} onClick={e => e.stopPropagation()}>
              <div className={`${activeTheme.header} p-4 flex justify-between items-center text-black font-black uppercase italic`}>
                <span className="text-sm tracking-tighter">Спецификация заклинания</span>
                <button onClick={() => setActiveSpell(null)} className="text-3xl leading-none hover:rotate-90 transition-transform">&times;</button>
              </div>
              <div className="p-10 text-amber-50/90 text-lg leading-relaxed max-h-[75vh] overflow-y-auto font-sans" dangerouslySetInnerHTML={{ __html: activeSpell.description }} />
              <div className="p-6 bg-black/40 text-right border-t border-white/10">
                <button onClick={() => setActiveSpell(null)} className={`px-10 py-3 ${activeTheme.header} text-black font-black uppercase text-sm rounded-lg hover:opacity-80 transition-all shadow-lg`}>Закрыть</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}