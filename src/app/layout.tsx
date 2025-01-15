import type { Metadata } from "next";
import Header from "./components/header";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box } from "@mui/material";
import "../styles/reset.css";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider>
            <Box sx={{ width: "100vw", height: "100vh" }}>
              <Header />
              <main>{children}</main>
            </Box>
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
