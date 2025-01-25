"use client";

import { Grid2, Link, Typography, useTheme } from "@mui/material";
import ThemeSwitch from "./ThemeSwitch";
import LanguageSwitch from "./LanguageSwitch";
import MotionGitHubIcon from "./MotionGitHub";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true); // 헤더 보임 상태
  const [lastScrollY, setLastScrollY] = useState(0); // 마지막 스크롤 위치
  const [language, setLanguage] = useState("ja"); // 언어
  const [path, setPath] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // 아래로 스크롤: 헤더 숨기기
        setIsVisible(false);
      } else {
        // 위로 스크롤: 헤더 보이기
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    // 루트 바로 다음의 값을 가져옴
    const pathSegments = pathname.split("/"); // 경로를 '/'로 분리
    if (pathSegments.length > 1) {
      const lang = pathSegments[1]; // 루트 바로 다음 값
      if (lang === "ko" || lang === "ja") {
        setLanguage(lang);

        const postPath = pathSegments.slice(2).join("/");
        setPath(postPath);
      }
    }
  }, [pathname]); // 경로가 변경될 때마다 실행

  return (
    <Grid2
      width={"100%"}
      position="fixed"
      top={isVisible ? 0 : "-100px"}
      left={0}
      right={0}
      sx={{
        backgroundColor: theme.palette.background.default,
        transition: "top 0.3s ease-in-out",
      }}
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      zIndex={1000}
      display={"flex"}
      justifyContent={"center"}
      borderBottom={"1px solid"}
    >
      <Grid2 container width={"100%"} maxWidth="xl" padding={1}>
        <Grid2 size="auto" display={"flex"} alignItems={"center"} marginLeft={1}>
          <Typography variant="h5">
            <Link href={`/${language}`} sx={{ textDecoration: "none" }}>
              Kyumin.dev
            </Link>
          </Typography>
        </Grid2>
        <Grid2 size="grow"></Grid2>
        <Grid2 size="auto" padding={2}>
          <LanguageSwitch language={language} path={path} />
        </Grid2>
        <Grid2 size="auto" padding={2}>
          <ThemeSwitch />
        </Grid2>
        <Grid2 size="auto" padding={2}>
          <Link href="https://github.com/kyumin1227" target="_blank">
            <MotionGitHubIcon />
          </Link>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default Header;
