import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const darkTheme = {
    background:
      "#212529 linear-gradient(135deg,rgba(33, 37, 41, 1) 0%, rgba(73, 80, 87, 1) 100%)",
    typography: {
      primary: "#FFFFFF",
      secondary: "#7A859A",
      highlight: "#FFC300",
    },
    ui: {
      icons: "#FFFFFF",
      iconsHover: "#FFFFFF26",
      divider: "#FFFFFF",
      input: "#FFFFFF",
    },
  };
  const lightTheme = {
    background:
      "#ADB5BD linear-gradient(135deg,rgba(173, 181, 189, 1) 0%, rgba(233, 236, 239, 1) 100%)",
    icon: "bi bi-moon-fill",
    typography: {
      primary: "#1F2124",
      secondary: "#FFFFFF",
      highlight: "#FF4F00",
    },
    ui: {
      icons: "#1F2124",
      iconsHover: "#46454526",
      divider: "rgb(33 37 41 / 0.5)",
      input: "rgb(33 37 41 / 0.5)",
    },
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
