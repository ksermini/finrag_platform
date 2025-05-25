import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="layout-tab-btn"
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀ Light Mode"}
    </button>
  );
};

export default ThemeToggle;
