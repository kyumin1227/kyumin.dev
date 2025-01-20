"use client";

import { useColorScheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { motion } from "framer-motion";

const MotionLightModeIcon = motion(LightModeIcon);
const MotionDarkModeIcon = motion(DarkModeIcon);

const ThemeSwitch = () => {
  const { mode, setMode } = useColorScheme();

  return (
    <>
      <p
        onClick={() => {
          setMode(mode === "light" ? "dark" : "light");
        }}
      >
        {mode === "light" ? (
          <MotionLightModeIcon color="primary" whileHover={{ scale: 1.3 }} />
        ) : (
          <MotionDarkModeIcon color="primary" whileHover={{ scale: 1.3 }} />
        )}
      </p>
    </>
  );
};

export default ThemeSwitch;
