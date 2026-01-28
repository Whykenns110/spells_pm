export const getSpellTheme = (spell) => {
  if (!spell) return {};
  const name = (spell.name || "").toLowerCase();
  const desc = (spell.description || "").toLowerCase();
  
  // ФИОЛЕТОВЫЙ: Кристальный глаз, Молот, Вспышка клапана, Вакуумный рывок и Прорицание
  const purpleKeywords = ["глаз", "молот", "вспышка клапана", "вакуумный рывок", "прорицание", "помехи"];
  if (purpleKeywords.some(key => name.includes(key) || desc.includes(key))) {
    return { 
      modalBorder: "border-purple-500", 
      header: "bg-purple-600", 
      text: "text-purple-500", 
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]" 
    };
  }

  // КРАСНЫЙ: Атака
  if (desc.includes("атакующие")) return { modalBorder: "border-red-500", header: "bg-red-600", text: "text-red-500" };
  // СИНИЙ: Защита
  if (desc.includes("защитные")) return { modalBorder: "border-blue-500", header: "bg-blue-600", text: "text-blue-500" };
  // ЗЕЛЕНЫЙ: Лечение
  if (desc.includes("регенерирующие")) return { modalBorder: "border-emerald-500", header: "bg-emerald-600", text: "text-emerald-500" };
  
  // СТАНДАРТ: Желтый/Янтарный
  return { modalBorder: "border-amber-500", header: "bg-amber-600", text: "text-amber-500" };
};