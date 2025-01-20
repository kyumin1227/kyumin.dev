import { Box, Link, Typography } from "@mui/material";
import { Email, Cloud } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      mt={3}
      py={2}
      px={4}
      style={{
        color: "#000", // 전체 텍스트 색상을 검은색으로 설정
      }}
      textAlign="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {/* Contact 정보 */}
      <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1} marginBottom={1}>
        <Email fontSize="small" />
        Contact{" "}
        <Link
          href="mailto:kyumin12271227@gmail.com"
          underline="hover"
          style={{
            color: "#000", // 링크 색상 검은색으로 설정
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
            color: "#000", // 링크 색상 검은색으로 설정
            fontWeight: "bold",
          }}
          target="_blank" // 새 탭에서 열기
        >
          Kyumin Kim
        </Link>{" "}
        All rights reserved.
      </Typography>

      {/* Vercel 제공 정보 */}
      <Typography variant="body2" fontWeight="500" display="flex" alignItems="center" gap={1} marginBottom={1}>
        Powered by{" "}
        <Link
          href="https://vercel.com"
          underline="hover"
          style={{
            color: "#000", // 링크 색상 검은색으로 설정
            fontWeight: "bold",
          }}
          target="_blank" // 새 탭에서 열기
        >
          Vercel
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
