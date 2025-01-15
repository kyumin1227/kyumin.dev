import type { Metadata } from "next";
import Header from "./components/header";
import StyledComponentsRegistry from "@/lib/registry";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box, Container } from "@mui/material";
import "../styles/reset.css";
import { ThemeProvider } from "next-themes";

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
    <html lang="en">
      <body>
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
          <StyledComponentsRegistry>
            {/* <AppRouterCacheProvider> */}
            <Box sx={{ width: "100vw", height: "100vh" }}>
              <Header />
              {children}
            </Box>
            {/* </AppRouterCacheProvider> */}
          </StyledComponentsRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
