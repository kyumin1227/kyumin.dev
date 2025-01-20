"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#fbc02d",
        },
        secondary: {
          main: "#9ccc65",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#fff9c4",
        },
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
