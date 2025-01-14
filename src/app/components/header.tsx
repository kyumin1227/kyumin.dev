import GitHubIcon from "@mui/icons-material/GitHub";
import { Box, Button, Container, Grid2, Typography } from "@mui/material";
import ThemeSwitch from "./ThemeSwitch";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["vietnamese"], // 지원하는 언어 세트
  weight: ["400", "700"], // 사용할 폰트 굵기
});

const Header = () => {
  return (
    <Grid2 container maxWidth="lg" padding={2}>
      <Grid2 size="auto">
        <Typography className={playfair.className}>Kyumin.dev</Typography>
      </Grid2>
      <Grid2 size="grow"></Grid2>
      <Grid2 size="auto">
        <Link href="https://github.com/kyumin1227" target="_blank">
          <Button variant="text" color="primary">
            <GitHubIcon sx={{ width: "15px" }} />
          </Button>
        </Link>
      </Grid2>
      <Grid2 size="auto">
        <ThemeSwitch />
      </Grid2>
    </Grid2>
  );
};

export default Header;
