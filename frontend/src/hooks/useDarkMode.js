import { useState, useEffect } from "react";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default to dark mode
    return true;
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isDark) {
      html.classList.add("dark");
      body.classList.add("dark");
      body.classList.remove("light");
    } else {
      html.classList.remove("dark");
      body.classList.remove("dark");
      body.classList.add("light");
    }

    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return { isDark, toggleDarkMode };
};

export default useDarkMode;