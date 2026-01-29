import React, { useRef } from 'react';

const INFO_SECTIONS = [
  { id: 'lore', icon: '📜', label: 'Лор' },
  { id: 'stats', icon: '⚙️', label: 'Хиты' },
  { id: 'equip', icon: '🎒', label: 'Снаряжение' },
  { id: 'debuffs', icon: '⚠️', label: 'Дебаффы' },
  { id: 'lvls', icon: '📈', label: 'Уровни' },
];

export default function InfoModal({ isOpen, onClose }) {
  const scrollRef = useRef(null);
  const scrollToSection = (id) => {
    const element = document.getElementById(`info-${id}`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-[#121212] border-2 border-amber-900/50 rounded-3xl w-full max-w-4xl h-[85vh] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col font-mono"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] p-4 flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/30">
          <div className="flex items-center gap-4">
            <span className="text-amber-500 font-black text-xl uppercase tracking-tighter italic">⚙️ СПРАВОЧНИК ПАРОМЕХАНИКА</span>
            <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-amber-900/20">
              {INFO_SECTIONS.map(sec => (
                <button key={sec.id} onClick={() => scrollToSection(sec.id)} className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] hover:bg-amber-600 hover:text-black rounded-md transition-all text-xl border border-amber-900/20">
                  {sec.icon}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-red-950 text-red-500 border border-red-900/50 rounded-full font-black hover:bg-red-600 hover:text-white transition-all">✕</button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 text-amber-50/80 custom-scrollbar space-y-12 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-900/5 via-transparent to-transparent" ref={scrollRef}>
          
          {/* LORE */}
          <section id="info-lore" className="space-y-4 border-l-2 border-amber-600/50 pl-6">
            <h2 className="text-2xl font-black uppercase italic text-amber-500">📜 История класса</h2>
            <p className="leading-relaxed text-amber-100/70">Паромеханики — Одни из величайших мастеров во всем мире, их изобретения созданные исключительно из магии могут работать веками, пассивно вырабатывая энергию. Они обладают довольно сложной магией созидания. Пропуская магию через воздух, она меняет его структуру на атомном уровне. Их изобретения могут работать как автономно, так и дистанционно с помощью особых перчаток</p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-emerald-900/20 p-3 rounded-xl border border-emerald-500/30">
                <span className="block font-black text-[10px] text-emerald-500 uppercase">Рекомендация:</span>
                <p className="text-sm font-bold">Интеллект ≥ 14, Ловкость ≥ 13.</p>
              </div>
              <div className="bg-red-900/20 p-3 rounded-xl border border-red-500/30">
                <span className="block font-black text-[10px] text-red-500 uppercase">Ограничение:</span>
                <p className="text-sm font-bold">Предыстория не может быть "Отшельник".</p>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section id="info-stats" className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic text-amber-500 underline decoration-amber-900">⚙️ Хиты и Владения</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                <h3 className="font-black text-amber-600 text-sm uppercase mb-2">Хиты</h3>
                <p className="text-sm italic">• 1к8 за уровень</p>
                <p className="text-sm italic">• На 1 уровне: 8 + мод. Телосложения</p>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                <h3 className="font-black text-amber-600 text-sm uppercase mb-2">Владение</h3>
                <p className="text-sm italic">• Доспехи: Только кожаный</p>
                <p className="text-sm italic">• Спасброски: ИНТ, ЛОВ</p>
              </div>
            </div>
          </section>

          {/* DEBUFFS & MADNESS (Добавлен блок Безумия) */}
          <section id="info-debuffs" className="space-y-8 bg-red-950/20 p-6 rounded-2xl border border-red-900/30 shadow-[inset_0_0_20px_rgba(127,29,29,0.1)]">
            <h2 className="text-2xl font-black uppercase italic text-red-600">⚠️ Дебаффы и Проклятия</h2>
            <div className="space-y-6">
              <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
                <h4 className="font-black uppercase text-red-500 flex items-center gap-2">🧠 Эффект "Безумия"</h4>
                <p className="text-sm text-red-100/80 mt-2 leading-relaxed">
                  При активации определенных способностей (или критических сбоях), персонаж впадает в ступор. Он перестает понимать речь и <span className="text-red-400 font-bold underline">пропускает ходы</span>.
                </p>
                <div className="mt-3 flex gap-4 text-[10px] font-black uppercase border-t border-red-900/30 pt-2">
                  <span className="text-red-400">Длительность: 1к10 минут / ходов</span>
                  <span className="text-red-600">Снятие: Покой или спец. зелье</span>
                </div>
              </div>
              <div className="border-l-2 border-red-900/30 pl-4">
                <h4 className="font-black uppercase text-red-400">Чувство неполноценности</h4>
                <p className="text-xs italic text-red-200/50">Слабая атака (≤4) снижает макс. ХП до конца боя.</p>
              </div>
            </div>
          </section>

          {/* PROGRESSION (Уточнено описание 5 уровня) */}
          <section id="info-lvls" className="space-y-8 pb-10">
            <h2 className="text-2xl font-black uppercase italic text-emerald-500 underline decoration-emerald-900/50">📈 Прогрессия уровней</h2>
            {[
              { lv: '1', title: 'Вместительный рюкзак', desc: 'Слоты: 9. Вмещает 10 мелких предметов.' },
              { lv: '2', title: 'Лудоман', desc: 'Бросок монетки 2 раза за бой. Удача стирает дебафф.' },
              { lv: '3', title: 'ДаблДжамп!', desc: 'Прыжок через облако дыма. Требует ЛОВ.' },
              { lv: '4', title: 'Апгрейд', desc: '+2 к одной характеристике.' },
              { lv: '5', title: 'Четырехмерный взгляд', desc: (
                <div className="space-y-2">
                  <p>Видны ХП, КД и спасброски врагов. Характеристики = +0.</p>
                  <div className="bg-red-950/40 p-2 rounded border border-red-500/20 text-[10px]">
                    <span className="text-red-400 font-black uppercase">⚠️ Опасно:</span> Активация взгляда мгновенно вызывает <span className="font-bold">Безумие (3 мин\1 ход)</span>.
                  </div>
                </div>
              )}
            ].map(item => (
              <div key={item.lv} className="relative pl-12 border-l-2 border-emerald-900/30 pb-4 group">
                <div className="absolute left-[-17px] top-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center font-black text-black border-4 border-[#121212] group-hover:bg-emerald-400 transition-colors">
                  {item.lv}
                </div>
                <h4 className="font-black uppercase text-emerald-500">{item.title}</h4>
                <div className="text-sm text-amber-50/60 mt-1">{item.desc}</div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}