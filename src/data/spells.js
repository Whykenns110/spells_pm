// src/data/spells.js

export const categories = {
  "Атакующие": ["Дальний", "Ближний", "Средний"],
  "Защитные": ["Баррикады", "Доп.Броня"],
  "Регенерирующие": ["Персональная", "Массовая"],
  "Созидание": ["Конструирование", "Модификация среды", "Утилитарные"],
  "Помехи": ["Обездвиживание", "Оглушение", "Паралич"]
};

// ВАЖНО: Просто добавляй новые объекты в этот массив. 
// Порядок здесь не важен — система сама отсортирует по алфавиту.
const spellsList = [
  {
    name: "Волшебная монетка",
    level: "Заговор",
    components: ["М"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic tracking-tighter">Волшебная монетка</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase tracking-widest">Заговор | Атакующие – Дальний</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 доп. действие</p>
          <p><strong>Дистанция:</strong> 5 футов</p>
          <p><strong>Компоненты:</strong> М (золотая монета)</p>
          <p><strong>Длительность:</strong> 1 секунда</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans">Вы достаёте из кармана золотую монету и эффектным щелчком подбрасываете её вверх. У вас есть ровно <strong>1 секунда</strong>, чтобы поразить монету другим атакующим заклинанием в воздухе.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          При попадании совершите спасбросок Ловкости. В случае успеха энергия заклинания резонирует с металлом, нанося <strong>x2 отдельный урон</strong> по цели. Использовать можно 1 раз за бой.
        </div>
      `
  },
  {
    name: "Вихревой болт",
    level: "1:УР",
    components: ["В", "С"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic">Вихревой болт</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase font-sans">1-й уровень | Атакующие – Средний</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Дистанция:</strong> 30 футов</p>
          <p><strong>Компоненты:</strong> В, С</p>
          <p><strong>Урон:</strong> 2d8 силовой</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans">Вы резко выбрасываете руку вперед, и из густого облака пара в вашей ладони материализуется вращающийся стальной снаряд, окутанный турбулентными потоками воздуха. Болт летит с пронзительным свистом, разрезая пространство.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Цель должна пройти спасбросок Силы. При провале она получает <strong>2d8 силового урона</strong>, отбрасывается на 5 футов и падает ничком. При успехе получает только половину урона.
        </div>
      `
  },
  {
    name: "Вакуумный рывок",
    level: "2:УР",
    components: ["В", "С"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic">Вакуумный рывок</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase font-sans">2-й уровень | Помехи – Обездвиживание</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Дистанция:</strong> 20 футов</p>
          <p><strong>Компоненты:</strong> В, С</p>
          <p><strong>Длительность:</strong> 1 раунд</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans italic">Сжав кулак, вы словно вырываете кусок пространства из реальности. Воздух в указанной точке мгновенно схлопывается, создавая область критического разрежения, которая затягивает в себя всё живое.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Существо должно совершить спасбросок Телосложения. При провале оно становится <strong>обездвиженным</strong> до конца вашего следующего хода, так как перепад давления сковывает его движения и легкие.
        </div>
      `
  },
  {
    name: "Верньерный щит",
    level: "3:УР",
    components: ["В", "С", "М"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic">Верньерный щит</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase font-sans">3-й уровень | Защитные – Баррикады</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Дистанция:</strong> на себя</p>
          <p><strong>Компоненты:</strong> В, С, М (латунная пластина)</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-serif">Вы активируете скрытые механизмы на доспехах, прижимая латунную пластину к груди. С резким шипением вокруг вас раскрываются прозрачные энергетические верньеры, вибрирующие в такт вашему пульсу.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Вы получаете <strong>+3 к КД</strong>. Любое существо, попавшее по вам атакой ближнего боя, получает <strong>1d6 огненного урона</strong> от встречного выброса раскаленного пара. Длительность: 2 хода.
        </div>
      `
  },
  {
    name: "Впрыск эфира",
    level: "4:УР",
    components: ["М"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic">Впрыск эфира</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase font-sans">4-й уровень | Регенерирующие – Персональная</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 бонусное действие</p>
          <p><strong>Дистанция:</strong> касание</p>
          <p><strong>Компоненты:</strong> М (ампула с эфиром)</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-serif">Вы резко вонзаете инъектор с сияющим эфиром в механизм или мягкие ткани. Голубоватая жидкость мгновенно разносится по системе, заставляя металл самовосстанавливаться, а раны затягиваться на глазах.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          В начале каждого вашего хода цель восстанавливает <strong>2d6 хитов</strong>. Эффект длится 3 раунда. Дополнительно дает преимущество на спасброски от истощения и отравления.
        </div>
      `
  },
  {
    name: "Вспышка клапана",
    level: "Заговор",
    components: ["В"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic">Вспышка клапана</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase tracking-widest">Заговор | Помехи – Оглушение</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Радиус:</strong> 10 футов</p>
          <p><strong>Компоненты:</strong> В</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-serif">Вы резко сбрасываете избыточное давление из резервуаров. С оглушительным свистом вокруг вас вырывается облако обжигающего белого пара, скрывающее вас из виду и дезориентирующее врагов.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Существа в радиусе 10 футов должны пройти спасбросок Ловкости или стать <strong>ослепленными</strong> до начала вашего следующего хода.
        </div>
      `
  },
  {
    name: "Гигантские трубы",
    level: "Заговор",
    components: ["В", "С"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic tracking-tighter">Гигантские трубы</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase tracking-widest">Заговор | Защитные – Баррикады</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Дистанция:</strong> 5 футов</p>
          <p><strong>Длительность:</strong> 15 минут</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans">Вы склоняетесь на одно колено, прижимая ладони к земле. С тяжелым гулом из почвы вырываются массивные медные трубы диаметром до 40 см, образуя непробиваемую преграду высотой в полтора метра.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Прочность стены: от 2 до 5 попаданий (зависит от спасброска). С уровнем прочность растет: 3-6 (5 ур), 4-7 (11 ур), 5-8 (17 ур).
        </div>
      `
  },
  {
    name: "Кристальный глаз",
    level: "Заговор",
    components: ["В", "М"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic tracking-tighter">Кристальный глаз</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase tracking-widest">Заговор | Созидание – Утилитарные</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Дистанция:</strong> Касание</p>
          <p><strong>Компоненты:</strong> В, М (хрустальный осколок)</p>
          <p><strong>Длительность:</strong> 5 минут</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans">Вы подносите острый осколок хрусталя к открытому глазу. С тихим щелчком кристалл сливается с вашей глазницей, превращаясь в сияющий аметистовый окуляр. Ваше зрение пронзает материю, открывая структуру молекул и скрытое за стенами.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          При активации наносит <strong>1к4 (-мод Телосложения)</strong> урона. Дает обзор сквозь стены и регулируемый зум. Любая атака, попавшая точно в глаз, отражается в отправителя. Наносит <strong>1 ед. урона</strong> каждую минуту. Команда "Реверто" досрочно завершает эффект, но хрусталь при этом уничтожается.
        </div>
      `
  },
  {
    name: "Лечебные травы",
    level: "Заговор",
    components: ["В"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic tracking-tighter">Лечебные травы</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase tracking-widest">Заговор | Регенерирующие – Персональная</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Дистанция:</strong> На себя</p>
          <p><strong>Длительность:</strong> 2 минуты</p>
          <p><strong>Компоненты:</strong> В</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans">В вашей руке из древесной щепы и эфирного пара материализуется курительная трубка, набитая светящимися травами. Вдыхая терпкий дым, вы чувствуете, как усталость уходит, а раны затягиваются теплой энергией.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Дает статус регенерации: <strong>0.42% макс. здоровья в секунду</strong>. Максимальный порог лечения: 50% ОЗ. Использовать 1 раз за бой. На 5 ур: до 60%, на 11 ур: до 80%, на 17 ур: до 100%. Курение вредит здоровью, но лечит душу.
        </div>
      `
  },
  {
    name: "Молот",
    level: "Заговор",
    components: ["В", "М"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic tracking-tighter">Молот</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase tracking-widest">Заговор | Помехи – Оглушение</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 10 сек</p>
          <p><strong>Дистанция:</strong> 10 футов</p>
          <p><strong>Компоненты:</strong> В, М (Медный молоток)</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans italic">Вы подбрасываете маленький молоток, который в воздухе раздувается до исполинских размеров и с грохотом обрушивается на голову врага.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Наносит <strong>1к6 дробящего урона</strong> и оглушает на 1 ход. При ударе о землю наносит 1к4 по области (до 2 целей) и раздробляет почву (помеха атаке). Урон растет: 2к6/2к4 (5 ур), 3к6/3к4 (11 ур), 4к6/4к4 (17 ур).
        </div>
      `
  },
  {
    name: "Механический кулак",
    level: "Заговор",
    components: ["В", "С"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic tracking-tighter">Механический кулак</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase tracking-widest">Заговор | Атакующие – Ближний</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Радиус:</strong> 10 футов</p>
          <p><strong>Длительность:</strong> Конец хода</p>
          <p><strong>Компоненты:</strong> В, С</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans">Ваши руки заковываются в тяжелую сталь, а кисти превращаются в огромные красные перчатки. Внутри слышно шипение поршней и лязг шестерен. Один мощный выброс — и противник отправляется в полет.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Ближняя атака: <strong>1к6 дробящего урона</strong>. Цель отбрасывается на <strong>30 футов</strong>. Следующее действие цели совершается с помехой. Урон растет: 2к6 (5 ур), 3к6 (11 ур), 4к6 (17 ур).
        </div>
      `
  },
  {
    name: "Медные Лозы",
    level: "1:УР",
    components: ["В", "М"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic tracking-tighter">Медные Лозы</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase tracking-widest">Заговор | Помехи – Обездвиживание</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 5 сек</p>
          <p><strong>Дистанция:</strong> 5 футов</p>
          <p><strong>Компоненты:</strong> С, М (Медная катушка)</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans italic">Вы крепко держите медную катушку в руках и совершаете рывок, тратя дополнительное действие. Приближаясь к врагу вы касаетесь его медной катушкой, трансформируя ее в толстые медные лозы, окутывающие врага.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Наносит <strong>1к4 колотого урона шипами</strong> при попытке действия. Урон растет: 1к8 (5 ур), 1к10 (11 ур), 1к12 (17 ур).
        </div>
      `
  },
  {
    name: "Хуечечебные травы",
    level: "Заговор",
    components: ["В"],
    description: `
        <h3 class="text-2xl font-black mb-2 uppercase italic tracking-tighter">Лечебные травы</h3>
        <p class="text-sm mb-1 opacity-80 font-bold uppercase tracking-widest">Заговор | Регенерирующие – Персональная</p>
        <div class="grid grid-cols-2 gap-2 text-sm bg-white/5 p-3 rounded border border-white/10 mb-4 font-sans text-white/90">
          <p><strong>Время:</strong> 1 действие</p>
          <p><strong>Дистанция:</strong> На себя</p>
          <p><strong>Длительность:</strong> 2 минуты</p>
          <p><strong>Компоненты:</strong> В</p>
        </div>
        <p class="mb-3 text-white/80 leading-relaxed font-sans">В вашей руке из древесной щепы и эфирного пара материализуется курительная трубка, набитая светящимися травами. Вдыхая терпкий дым, вы чувствуете, как усталость уходит, а раны затягиваются теплой энергией.</p>
        <div class="bg-white/5 border-l-4 border-current p-3 italic text-white/70 text-xs">
          Дает статус регенерации: <strong>0.42% макс. здоровья в секунду</strong>. Максимальный порог лечения: 50% ОЗ. Использовать 1 раз за бой. На 5 ур: до 60%, на 11 ур: до 80%, на 17 ур: до 100%. Курение вредит здоровью, но лечит душу.
        </div>
      `
  }
];

// ЭТА ФУНКЦИЯ ДЕЛАЕТ ВСЮ МАГИЮ:
// Она берет список, сортирует его и группирует по первой букве.
export const spellsData = spellsList.reduce((acc, spell) => {
  const firstLetter = spell.name[0].toUpperCase();
  if (!acc[firstLetter]) acc[firstLetter] = [];
  acc[firstLetter].push(spell);
  // Сортировка внутри буквы
  acc[firstLetter].sort((a, b) => a.name.localeCompare(b.name));
  return acc;
}, {});

// Сортировка самих ключей (букв), чтобы А было в начале, а Я в конце
export const sortedSpellsData = Object.keys(spellsData)
  .sort()
  .reduce((obj, key) => {
    obj[key] = spellsData[key];
    return obj;
  }, {});