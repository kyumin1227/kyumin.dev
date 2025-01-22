"use client";

import { Grid2, Link, Typography, useTheme } from "@mui/material";
import ThemeSwitch from "./ThemeSwitch";
import LanguageSwitch from "./LanguageSwitch";
import MotionGitHubIcon from "./MotionGitHub";
import { useEffect, useState } from "react";

const Header = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(true); // 헤더 보임 상태
  const [lastScrollY, setLastScrollY] = useState(0); // 마지막 스크롤 위치

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
            <Link href={"/"} sx={{ textDecoration: "none" }}>
              Kyumin.dev
            </Link>
          </Typography>
        </Grid2>
        <Grid2 size="grow"></Grid2>
        <Grid2 size="auto" padding={2}>
          <LanguageSwitch />
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
