"use client";

import { GitHub } from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionGitHub = motion(GitHub);

const MotionGitHubIcon = () => {
  return (
    <>
      <MotionGitHub color="primary" whileHover={{ scale: 1.3 }} />
    </>
  );
};

export default MotionGitHubIcon;
