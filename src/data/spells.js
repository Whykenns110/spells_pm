// src/data/spells.js

export const categories = {
  "Атакующие": ["Дальний", "Ближний", "Средний"],
  "Защитные": ["Баррикады", "Доп.Броня"],
  "Регенерирующие": ["Персональная", "Массовая"],
  "Помехи": ["Обездвиживание", "Оглушение", "Паралич"]
};

export const spellsData = {
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
          <p><strong>Компоненты:</strong> М (золотая монета)</p>
          <p><strong>Длительность:</strong> 1 сек</p>
        </div>
        <p class="mb-3 text-amber-100/90 leading-relaxed font-sans">Вы подбрасываете монету вверх. У вас есть 1 секунда, чтобы ударить по ней атакующим заклинанием. При успехе монета наносит x2 отдельный урон.</p>
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
          <p><strong>Урон:</strong> 2d8 силовой</p>
        </div>
        <p class="text-amber-100/90 leading-relaxed font-sans">Цель получает урон и должна пройти спасбросок Силы, иначе будет отброшена на 5 футов.</p>
      `
    },
    {
      name: "Вакуумный рывок",
      level: "2",
      components: ["В", "С"],
      description: `
        <h3 class="text-purple-500 text-2xl font-black mb-2 uppercase italic">Вакуумный рывок</h3>
        <p class="text-sm mb-1 text-purple-900 font-bold uppercase font-sans">2-й уровень | Помехи – Обездвиживание</p>
        <p class="text-amber-100/90 leading-relaxed font-sans italic">Зона разрежения воздуха. Существо становится обеждвиженным при провале спасброска.</p>
      `
    },
    {
      name: "Верньерный щит",
      level: "3",
      components: ["В", "С", "М"],
      description: `
        <h3 class="text-blue-500 text-2xl font-black mb-2 uppercase italic">Верньерный щит</h3>
        <p class="text-sm mb-1 text-blue-900 font-bold uppercase font-sans">3-й уровень | Защитные – Баррикады</p>
        <p class="text-amber-100/90 leading-relaxed font-serif">Дает +3 к КД. При попадании по вам щит наносит 1d6 огненного урона.</p>
      `
    },
    {
      name: "Впрыск эфира",
      level: "4",
      components: ["М"],
      description: `
        <h3 class="text-emerald-500 text-2xl font-black mb-2 uppercase italic">Впрыск эфира</h3>
        <p class="text-sm mb-1 text-emerald-900 font-bold uppercase font-sans">4-й уровень | Регенерирующие – Персональная</p>
        <p class="text-amber-100/90 leading-relaxed font-serif">Восстанавливает 2d6 хитов в начале хода. Дает преимущество на спасброски от истощения.</p>
      `
    },
    {
      name: "Вспышка клапана",
      level: "Заговор",
      components: ["В"],
      description: `
        <h3 class="text-purple-500 text-2xl font-black mb-2 uppercase italic">Вспышка клапана</h3>
        <p class="text-sm mb-1 text-purple-900 font-bold uppercase tracking-widest">Заговор | Помехи – Оглушение</p>
        <p class="text-amber-100/90 leading-relaxed font-serif">Ослепляющее облако пара. Существа в радиусе 10 футов могут стать ослепленными.</p>
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
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Дистанция:</strong> 5 футов</p>
          <p><strong>Длительность:</strong> 15 мин</p>
        </div>
        <p class="mb-3 text-amber-100/90 leading-relaxed">Медные трубы из под земли. Прочность 2-5 попаданий. Растет с уровнем (3-6 на 5-м, 4-7 на 11-м, 5-8 на 17-м).</p>
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
          <p><strong>Время:</strong> 10 сек</p>
          <p><strong>Дистанция:</strong> 10 футов</p>
        </div>
        <p class="mb-3 text-amber-100/90 leading-relaxed">Удар молотом: 1к6 урона + оглушение. Урон растет с уровнем (2к6 на 5-м, 3к6 на 11-м, 4к6 на 17-м).</p>
      `
    }
  ]
};