import React, { useState, useEffect } from 'react';

export default function SidebarTools({ type }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(() => localStorage.getItem('paromechanic_notes') || "");
  const [calcInput, setCalcInput] = useState("");

  useEffect(() => {
    if (type === 'notes') localStorage.setItem('paromechanic_notes', notes);
  }, [notes, type]);

  const toggle = () => setIsOpen(!isOpen);

  // Логика калькулятора
  const addToCalc = (val) => setCalcInput(prev => prev + val);
  const calculateResult = () => {
    try {
      // Использование Function вместо eval чуть безопаснее для простых расчетов
      const result = new Function(`return ${calcInput}`)();
      setCalcInput(result.toString());
    } catch {
      setCalcInput("Ошибка");
      setTimeout(() => setCalcInput(""), 1000);
    }
  };

  const buttonStyles = {
    info: "w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-2 rounded mb-2 text-[10px] uppercase transition-colors shadow-lg",
    calc: "px-3 py-1.5 border border-amber-800/40 text-amber-500 font-bold text-[9px] uppercase hover:border-amber-500 transition-all rounded",
    notes: "px-3 py-1.5 border border-amber-800/40 text-amber-500 font-bold text-[9px] uppercase hover:border-amber-500 transition-all rounded"
  };

  const labels = { info: "ИНФО ПАРОМЕХАНИКА", calc: "КАЛЬКУЛЯТОР", notes: "БЛОКНОТ" };

  return (
    <>
      <button onClick={toggle} className={buttonStyles[type]}>{labels[type]}</button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={toggle}>
          <div className="bg-[#efe7d6] border-4 border-[#3d2314] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            
            <div className="bg-[#3d2314] p-3 flex justify-between items-center">
              <span className="text-amber-500 font-black text-xs uppercase tracking-widest">{labels[type]}</span>
              <button onClick={toggle} className="text-amber-500 hover:text-white font-black">✕</button>
            </div>

            <div className="p-4 text-[#3d2314]">
              {type === 'info' && (
                <div className="space-y-4 overflow-y-auto max-h-[60vh] text-sm font-bold">
                  <p className="text-lg border-b-2 border-amber-900/20 pb-1">КЛАСС: ПАРОМЕХАНИК</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-amber-900/5 p-2 rounded">КЗ: 1к8</div>
                    <div className="bg-amber-900/5 p-2 rounded">Осн. хар-ка: Интеллект</div>
                  </div>
                  <p>Инженеры-волшебники, способные вдыхать магию в неодушевленные предметы. Твои инструменты — это твое оружие.</p>
                </div>
              )}

              {type === 'calc' && (
                <div className="flex flex-col gap-3">
                  {/* Экран калькулятора */}
                  <div className="bg-[#2a1a10] text-amber-500 p-4 text-3xl font-black text-right rounded-lg border-inner border-2 border-amber-900/30 h-16 flex items-center justify-end overflow-hidden">
                    {calcInput || "0"}
                  </div>
                  
                  {/* Сетка кнопок */}
                  <div className="grid grid-cols-4 gap-2">
                    {/* Первый ряд */}
                    {['7', '8', '9', '/'].map(b => (
                      <button key={b} onClick={() => addToCalc(b)} className="bg-[#3d2314] text-amber-500 py-3 rounded font-black hover:bg-black transition-colors">{b}</button>
                    ))}
                    {/* Второй ряд */}
                    {['4', '5', '6', '*'].map(b => (
                      <button key={b} onClick={() => addToCalc(b)} className="bg-[#3d2314] text-amber-500 py-3 rounded font-black hover:bg-black transition-colors">{b}</button>
                    ))}
                    {/* Третий ряд */}
                    {['1', '2', '3', '-'].map(b => (
                      <button key={b} onClick={() => addToCalc(b)} className="bg-[#3d2314] text-amber-500 py-3 rounded font-black hover:bg-black transition-colors">{b}</button>
                    ))}
                    {/* Четвертый ряд */}
                    <button onClick={() => addToCalc('0')} className="bg-[#3d2314] text-amber-500 py-3 rounded font-black hover:bg-black transition-colors">0</button>
                    <button onClick={() => addToCalc('.')} className="bg-[#3d2314] text-amber-500 py-3 rounded font-black hover:bg-black transition-colors">.</button>
                    <button onClick={() => setCalcInput("")} className="bg-red-900 text-white py-3 rounded font-black hover:bg-red-800 transition-colors uppercase text-[10px]">C</button>
                    <button onClick={() => addToCalc('+')} className="bg-[#3d2314] text-amber-500 py-3 rounded font-black hover:bg-black transition-colors">+</button>
                    
                    {/* Кнопка Равно */}
                    <button onClick={calculateResult} className="col-span-4 bg-amber-600 text-black py-3 rounded font-black hover:bg-amber-500 transition-colors mt-1 underline decoration-2">ВЫЧИСЛИТЬ</button>
                  </div>
                </div>
              )}

              {type === 'notes' && (
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-64 bg-white/50 border-2 border-[#3d2314] p-4 outline-none resize-none font-bold italic"
                  placeholder="Заметки инженера..."
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}