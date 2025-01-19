"use client";

import Giscus from "@giscus/react";
import { useTheme } from "@mui/material";

const Comments = () => {
  const theme = useTheme();
  const currentPath = window.location.pathname;

  // 경로에서 언어 추출 (첫 번째 경로 구분자 부분)
  const langMatch = currentPath.match(/^\/(ko|ja)/);
  const lang = langMatch ? langMatch[1] : "ja";

  // 언어 구분 제거한 통일된 경로
  const unifiedPath = currentPath.replace(/^\/(ko|ja)/, "");

  return (
    <Giscus
      id="comments"
      repo="kyumin1227/kyumin.dev"
      repoId="R_kgDONXR2Mw"
      category="Comments"
      categoryId="DIC_kwDONXR2M84CmJpR"
      mapping="specific"
      term={unifiedPath}
      lang={lang}
      theme={theme.palette.mode === "dark" ? "dark" : "light"}
      inputPosition="bottom"
      emitMetadata="1"
      reactionsEnabled="1"
      strict="0"
    />
  );
};

export default Comments;
