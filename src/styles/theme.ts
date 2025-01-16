"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
