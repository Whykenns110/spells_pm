export const getSpellTheme = (spell) => {
  if (!spell) return {};
  const name = (spell.name || "").toLowerCase();
  const desc = (spell.description || "").toLowerCase();
  
  const purpleKeywords = ["глаз", "молот", "вспышка клапана", "вакуумный рывок", "прорицание"];
  
  if (purpleKeywords.some(key => name.includes(key) || desc.includes(key))) {
    return { 
      modalBorder: "border-purple-500", 
      header: "bg-purple-600", 
      text: "text-purple-500", 
      accent: "text-purple-400", // Для внутренних инфо-блоков
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]" 
    };
  }

  // ... остальные цвета
  return { 
    modalBorder: "border-amber-500", 
    header: "bg-amber-600", 
    text: "text-amber-500",
    accent: "text-amber-400" 
  };
};