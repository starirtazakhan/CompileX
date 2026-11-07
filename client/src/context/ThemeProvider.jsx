import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("compilex_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("compilex_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) =>
      previous === "dark" ? "light" : "dark"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === "dark"
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;