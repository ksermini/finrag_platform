import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    loadThemeFromJson("/themes/navy.json"); // default
  }, []);

  const loadThemeFromJson = async (path) => {
    try {
      const res = await fetch(path);
      const json = await res.json();
      setTheme(json);

      const root = document.documentElement.style;

      // Terminal overrides
      root.setProperty("--theme-fg", json.terminal?.foreground || "#aacfd1");
      root.setProperty("--theme-bg", json.terminal?.background || "#05080d");

      // RGB glow colors
      root.setProperty("--color_r", json.colors?.r ?? 0);
      root.setProperty("--color_g", json.colors?.g ?? 255);
      root.setProperty("--color_b", json.colors?.b ?? 255);

      root.setProperty("--color_black", json.colors?.black ?? "#000000");
      root.setProperty("--color_grey", json.colors?.grey ?? "#888888");

      // Fonts
      if (json.cssvars?.font_main)
        root.setProperty("--font_main", json.cssvars.font_main);
      if (json.cssvars?.font_mono)
        root.setProperty("--font_mono", json.cssvars.font_mono);

      // Inject any custom vars from cssvars
      if (json.cssvars) {
        Object.entries(json.cssvars).forEach(([key, val]) => {
          root.setProperty(`--${key}`, val);
        });
      }
    } catch (err) {
      console.error("Failed to load theme:", err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, loadThemeFromJson }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
