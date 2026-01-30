export const getSpellTheme = (spell) => {
  if (!spell) return {};
  const name = (spell.name || "").toLowerCase();
  const desc = (spell.description || "").toLowerCase();

  // 1. ПРИОРИТЕТ 1: Регенерация (Зеленый) - теперь выше всех
  if (desc.includes("регенерирующие")) {
    return {
      modalBorder: "border-emerald-600",
      header: "bg-emerald-700",
      text: "text-emerald-400",
      accent: "#34d399",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.2)]"
    };
  }

  // 2. ПРИОРИТЕТ 2: Атака (Красный)
  if (desc.includes("атакующие")) {
    return {
      modalBorder: "border-red-600",
      header: "bg-red-700",
      text: "text-red-500",
      accent: "#ef4444",
      glow: "shadow-[0_0_40px_rgba(239,68,68,0.2)]"
    };
  }

  // 3. ПРИОРИТЕТ 3: Защита (Синий)
  if (desc.includes("защитные")) {
    return {
      modalBorder: "border-blue-600",
      header: "bg-blue-700",
      text: "text-blue-400",
      accent: "#60a5fa",
      glow: "shadow-[0_0_40px_rgba(59,130,246,0.2)]"
    };
  }

  // 4. ПРИОРИТЕТ 4: Фиолетовая тема
  const purpleKeywords = ["помехи", "обездвиживание", "оглушение", "паралич"];
  if (purpleKeywords.some(key => name.includes(key) || desc.includes(key))) {
    return {
      modalBorder: "border-purple-600",
      header: "bg-purple-700",
      text: "text-purple-400",
      accent: "#c084fc",
      glow: "shadow-[0_0_40px_rgba(168,85,247,0.3)]"
    };
  }

  const creationKeywords = ["конструирование", "модификация среды", "утилитарные", "созидание"];
  if (creationKeywords.some(key => desc.includes(key))) {
    return {
      modalBorder: "border-orange-500",
      header: "bg-orange-600",
      text: "text-orange-400",
      accent: "#f97316",
      glow: "shadow-[0_0_40px_rgba(249,115,22,0.3)]"
    };
  }

  return {
    modalBorder: "border-amber-600", header: "bg-amber-600", text: "text-amber-500", accent: "#fbbf24", glow: ""
  };
};