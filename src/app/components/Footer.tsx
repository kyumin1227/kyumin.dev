"use client";

import { Box, Link, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      mt={3}
      py={2}
      px={4}
      textAlign="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Link marginBottom={2} href="https://github.com/kyumin1227" target="_blank">
        <img
          width={32}
          height={32}
          src={theme.palette.mode === "dark" ? "/github-mark/github-mark-white.png" : "/github-mark/github-mark.png"}
        />
      </Link>
      {/* Contact 정보 */}
      <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1} marginBottom={1}>
        Contact{" "}
        <Link
          href="mailto:kyumin12271227@gmail.com"
          underline="hover"
          style={{
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
            fontWeight: "bold",
          }}
        >
          kyumin12271227@gmail.com
        </Link>
      </Typography>

      {/* Copyright 정보 */}
      <Typography variant="body2" fontWeight="500" display="flex" alignItems="center" gap={1} marginBottom={1}>
        ⓒ 2025.{" "}
        <Link
          href="https://github.com/kyumin1227"
          underline="hover"
          style={{
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
            fontWeight: "bold",
          }}
          target="_blank"
        >
          Kyumin Kim
        </Link>{" "}
        All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
