"use client";

import Giscus from "@giscus/react";
import { useTheme } from "@mui/material";
import { usePathname } from "next/navigation";

const Comments = () => {
  const theme = useTheme();
  const currentPath = usePathname();

  // 경로에서 언어 추출 (첫 번째 경로 구분자 부분)
  const langMatch = currentPath.match(/^\/(ko|ja)/);
  const lang = langMatch ? langMatch[1] : "ja";

  // 언어 구분 제거한 통일된 경로
  const unifiedPath = currentPath.replace(/^\/(ko|ja)/, "");

  return (
    <Giscus
      id="comments"
      repo={`${process.env.NEXT_PUBLIC_GITHUB_USER_ID}/${process.env.NEXT_PUBLIC_GITHUB_REPOSITORY_NAME}`}
      repoId={process.env.NEXT_PUBLIC_GITHUB_REPOSITORY_ID ?? ""}
      category={process.env.NEXT_PUBLIC_GITHUB_CATEGORY}
      categoryId={process.env.NEXT_PUBLIC_GITHUB_CATEGORY_ID}
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
