"use client";

import { Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const MotionGitHubIcon = () => {
  const theme = useTheme();

  return (
    <>
      <MotionBox
        width={theme.palette.mode === "dark" ? "22px" : "21px"}
        height={theme.palette.mode === "dark" ? "22px" : "21px"}
        bgcolor={(theme) => theme.palette.primary.main}
        borderRadius="50%"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        padding={theme.palette.mode === "dark" ? "2px" : "3px"}
        whileHover={{ scale: 1.3 }}
      >
        <img
          width="100%"
          height="100%"
          src={theme.palette.mode === "dark" ? "/github-mark/github-mark.png" : "/github-mark/github-mark-white.png"}
        />
      </MotionBox>
    </>
  );
};

export default MotionGitHubIcon;
