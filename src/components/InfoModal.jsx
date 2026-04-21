import React, { useRef } from 'react';

const INFO_SECTIONS = [
  { id: 'lore', icon: '📜', label: 'Лор' },
  { id: 'stats', icon: '⚙️', label: 'Хиты' },
  { id: 'equip', icon: '🎒', label: 'Снаряжение' },
  { id: 'debuffs', icon: '⚠️', label: 'Дебаффы' },
  { id: 'lvls', icon: '📈', label: 'Уровни' },
];

// Добавили пропс isClosing
export default function InfoModal({ isOpen, isClosing, onClose }) {
  const scrollRef = useRef(null);
  const scrollToSection = (id) => {
    const element = document.getElementById(`info-${id}`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
      onClick={onClose}
    >
      <div 
        className={`bg-[#121212] border-2 border-amber-900/50 rounded-3xl w-full max-w-4xl h-[85vh] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col font-mono modal-animate ${isClosing ? 'modal-exit' : ''}`}
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
            <p className="leading-relaxed text-amber-100/70">Паромеханики — Одни из величайших мастеров во всем мире, их изобретения созданные исключительно из магии могут работать веками. Пропуская магию через воздух, она меняет его структуру на атомном уровне. Их изобретения могут работать как автономно, так и дистанционно с помощью особых перчаток</p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-emerald-900/20 p-3 rounded-xl border border-emerald-500/30">
                <span className="block font-black text-[16px] text-emerald-500 uppercase">Рекомендация:</span>
                <p className="text-sm font-bold">Интеллект ≥ 14, Ловкость ≥ 13.</p>
              </div>
              <div className="bg-red-900/20 p-3 rounded-xl border border-red-500/30">
                <span className="block font-black text-[16px] text-red-500 uppercase">Ограничение:</span>
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
                <p className="text-sm">• 1к8 за уровень</p>
                <p className="text-sm">• На 1 уровне: 8 + мод. Телосложения</p>
                <p className="text-sm">• Макс кол-во хитов способно уменьшаться</p>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                <h3 className="font-black text-amber-600 text-sm uppercase mb-2">Владение</h3>
                <p className="text-sm">• Доспехи: Кожаный доспех</p>
                <p className="text-sm">• Спасброски: ИНТ, ЛОВ</p>
                <p className="text-sm">• Особый навык "Удача". Зависит от Харизмы</p>
              </div>
            </div>
          </section>

          {/* EQUIP */}
          <section id="info-equip" className="bg-amber-950/40 p-3 rounded-lg border border-amber-800/50 mt-4">
            <h3 className="text-[20px] font-black uppercase text-amber-500 mb-1 flex items-center gap-2">
              🎒 Снаряжение
            </h3>
            <p className="text-xs text-amber-100/90 leading-relaxed">
               <span className="text-amber-400 font-bold">Простое оружие, Кожаный доспех, Инструменты, Легкий Арбалет, 14 зм</span>
            </p>
          </section>

          {/* DEBUFFS & MADNESS */}
          <section id="info-debuffs" className="space-y-8 bg-red-950/20 p-6 rounded-2xl border border-red-900/30 shadow-[inset_0_0_20px_rgba(127,29,29,0.1)]">
            <h2 className="text-2xl font-black uppercase italic text-red-600">⚠️ Дебаффы и Проклятия</h2>
            <div className="space-y-6">
              <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
                <h4 className="font-black uppercase text-red-500 flex items-center gap-2">🚫 Бездарный мастер</h4>
                <p className="text-sm text-red-100/80 mt-2 leading-relaxed">
                  Сложность ко всем спасброскам автоматически <span className="text-red-400 font-bold underline">увеличивается на 2</span> в пределах 20.
                </p>
              </div>
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
              <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
                <h4 className="font-black uppercase text-red-500 flex items-center gap-2">😭 Чувство неполноценности</h4>
                <p className="text-sm text-red-100/80 mt-2 leading-relaxed">
                  Слабая атака (≤4) снижает макс. ХП до конца боя. <span className="text-red-400 font-bold underline">1ур:-1ХП | 5ур:-3ХП | 11ур:-7ХП | 20ур:-16ХП</span>.
                </p>
              </div>
            </div>
          </section>

          {/* PROGRESSION */}
          <section id="info-lvls" className="space-y-8 pb-10">
            <h2 className="text-2xl font-black uppercase italic text-emerald-500 underline decoration-emerald-900/50">📈 Прогрессия уровней</h2>
            {[
              { lv: '1', title: 'Вместительный рюкзак', desc: 'Вы носите пространственный рюкзак, куда поместится либо 9 маленьких вещей, либо одна большая туша' },
              { lv: '2', title: 'Лудоман', desc: 'Бросок монетки 2 раза за бой с вероятностью 1к2 где 1-удача а 2-неудача. Удача стирает дебафф "Бездарный мастер" на 1 ход.' },
              { lv: '3', title: 'ДаблДжамп!', desc: 'Двойной прыжок по облаку дыма. Сбасбросок Ловкости.' },
              { lv: '4', title: 'Апгрейд', desc: 'При достижении 4-го, 8-го, 12-го, 16-го и 19-го уровней вы можете повысить значение одной из ваших характеристик на 2 или двух характеристик на 1. Как обычно, значение характеристики при этом не должно превысить 20.' },
              { lv: '5', title: 'Четырехмерный взгляд', desc: (
                <div className="space-y-2">
                  <p>Видны ХП, КД и спасброски врагов. Создаются из золотой окантовки, кожанного ремешка, платиновой основы и комплекта магических линз.</p>
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