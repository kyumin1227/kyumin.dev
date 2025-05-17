"use client";

import { Box, Divider, styled, Typography, useTheme } from "@mui/material";
import Comments from "./Comments";
import "github-markdown-css";
import "../styles/github-markdown.css"; // 기존 모듈 수정 필요 (색상 선택을 위한 클래스 추가 및 조건 변경)
import useCodeTheme from "@/hooks/useCodeTheme";
import useActiveSections from "@/hooks/useActiveSections";
import useCheckWide from "@/hooks/useCheckWide";
import PostInfo from "./PostInfo";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { iData, iToc, LangType } from "@/types/posts";
import useMDXComponents from "../../mdx-components";
import dynamic from "next/dynamic";
import TocSide from "./TocSide";
import { useEffect, useRef, useState } from "react";
import TocTop from "./TocTop";

const MDXRemoteClient = dynamic(
  () => import("next-mdx-remote").then((mod) => mod.MDXRemote),
  { ssr: false } // 서버 사이드 렌더링을 비활성화합니다.
);

const TocWrapper = styled(Box)``;

const ContentBody = styled(Box)`
  width: min(100%, 750px);
  box-sizing: border-box;
`;

const PostBodyWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  position: relative;
  overflow: visible;
`;

const MarkdownBodyStyle = styled(Box)`
  width: min(100%, 750px);
  position: relative;

  /* 이미지 중앙 정렬 */
  img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    height: auto;
  }

  /* 글 */
  p {
    margin-bottom: 1.5rem;
  }

  /* 이미지 및 코드 블럭 */
  figure {
    margin: 0;
    margin-bottom: 1.5rem;
  }

  /* 이미지 캡션 */
  figcaption {
    text-align: center;
    margin-top: 0.5rem;
  }
`;

const PostBody = ({
  compiledMdx,
  data,
  lang,
  readingTime,
  width = 1150,
  scrollTop = 80,
  toc,
}: {
  compiledMdx: MDXRemoteSerializeResult;
  data: iData;
  lang: LangType;
  readingTime: string;
  width?: number;
  scrollTop?: number;
  toc: iToc[];
}) => {
  const theme = useTheme();
  const isWide = useCheckWide(width); // 너비 체크
  const mdxContainerRef = useRef<HTMLDivElement>(null);
  const [mdxLoaded, setMdxLoaded] = useState(false);
  const activeIds = useActiveSections("h1, h2, h3", mdxLoaded, mdxContainerRef); // 현재 보이는 섹션

  useCodeTheme(theme.palette.mode);

  useEffect(() => {
    if (mdxContainerRef.current && mdxContainerRef.current.childElementCount > 0) {
      setMdxLoaded(true);
    }
  }, [mdxContainerRef.current?.childElementCount]);

  return (
    <>
      <PostBodyWrapper>
        <ContentBody paddingX={isWide ? "0" : "24px"} height={"auto"} position={"relative"}>
          <PostInfo data={data} lang={lang} readingTime={readingTime} />
          <TocWrapper position={"absolute"} top={300} right={-200} height={"100%"}>
            {isWide && <TocSide toc={toc} activeIds={activeIds} />}
          </TocWrapper>
          <MarkdownBodyStyle
            sx={{ "& h1, & h2, & h3": { scrollMarginTop: `${scrollTop}px` } }}
            className={`markdown-body ${theme.palette.mode === "dark" ? "markdown-dark" : "markdown-light"}`}
          >
            <Divider sx={{ marginBottom: "32px" }} />
            <Box position={"relative"} height={"auto"}>
              {!isWide && toc && (
                <>
                  <Typography variant="h1" fontWeight={"bold"}>
                    목차
                  </Typography>
                  <TocTop toc={toc} />
                </>
              )}
              <Box ref={mdxContainerRef} marginBottom={"32px"}>
                <MDXRemoteClient components={useMDXComponents({})} {...compiledMdx} />
              </Box>
              <Comments />
            </Box>
          </MarkdownBodyStyle>
        </ContentBody>
      </PostBodyWrapper>
    </>
  );
};

export default PostBody;
