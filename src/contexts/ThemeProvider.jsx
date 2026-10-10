import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./contexts";
import { getSystemTheme } from "../utils/themeUtilty/themeUtilty";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system",
  );

  const applyTheme = useCallback((selectTheme) => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    let actualTheme = selectTheme;
    if (selectTheme === "system") {
      actualTheme = getSystemTheme();
    }
    root.classList.add(actualTheme);
    root.setAttribute("data-theme", actualTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);

    const handleTheme = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleTheme);

    return () => {
      mediaQuery.removeEventListener("change", handleTheme);
    };
  }, [theme, applyTheme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
