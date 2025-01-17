"use client";

import { useColorScheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeSwitch = () => {
  const { mode, setMode } = useColorScheme();

  return (
    <>
      <p
        onClick={() => {
          setMode(mode === "light" ? "dark" : "light");
        }}
      >
        {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
      </p>
    </>
  );
};

export default ThemeSwitch;
