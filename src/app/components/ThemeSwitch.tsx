"use client";

import { useTheme } from "next-themes";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <p
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      >
        {theme === "light" ? (
          <LightModeIcon sx={{ padding: 1, width: "15px" }} />
        ) : (
          <DarkModeIcon sx={{ padding: 1, width: "15px" }} />
        )}
      </p>
    </>
  );
};

export default ThemeSwitch;
