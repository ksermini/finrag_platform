import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const { loadThemeFromJson } = useTheme();

  return (
    <div className="space-x-2">
      <button onClick={() => loadThemeFromJson("/themes/navy.json")}>Tron</button>
      <button onClick={() => loadThemeFromJson("/themes/dark.json")}>Dark</button>
    </div>
  );
};

export default ThemeSwitcher;
