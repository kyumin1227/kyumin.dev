import type { Metadata } from "next";
import Header from "../components/Header";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box, Container } from "@mui/material";
import "../styles/reset.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import Footer from "../components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Kyumin.dev",
  description: "개발, 기술, 프로그래밍, 취미 등 다양한 주제로 글을 쓰는 김규민의 블로그입니다.",
  authors: [{ name: "Kyumin Kim" }],
  keywords: ["개발", "프로그래밍", "React", "Next.js", "블로그"],
};

const gaId: string = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";

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
            <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
              <Container maxWidth="xl">
                <Header />
                <Box mt={"92px"}>{children}</Box>
                <Footer />
              </Container>
            </Box>
          </AppRouterCacheProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId={gaId} />
        <SpeedInsights />
      </body>
    </html>
  );
}
