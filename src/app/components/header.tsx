import { Grid2, Typography } from "@mui/material";
import ThemeSwitch from "./ThemeSwitch";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import LanguageSwitch from "./LanguageSwitch";
import MotionGitHubIcon from "./MotionGitHub";

const playfair = Playfair_Display({
  subsets: ["vietnamese"], // 지원하는 언어 세트
  weight: ["400", "700"], // 사용할 폰트 굵기
});

const Header = () => {
  return (
    <Grid2 container maxWidth="xl" padding={2}>
      <Grid2 size="auto">
        <Typography className={playfair.className}>Kyumin.dev</Typography>
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
  );
};

export default Header;
