"use client";

import { Box, Divider, styled, Typography, useTheme } from "@mui/material";
import Comments from "./Comments";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "github-markdown-css";
import "../styles/github-markdown.css"; // 기존 모듈 수정 필요 (색상 선택을 위한 클래스 추가 및 조건 변경)
import Toc from "./Toc";
import useCodeTheme from "@/hooks/useCodeTheme";
import useExtractToc from "@/hooks/useExtractToc";
import useActiveSections from "@/hooks/useActiveSections";
import useCheckWide from "@/hooks/useCheckWide";
import PostInfo from "./PostInfo";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { iData, LangType } from "@/types/posts";
import useMDXComponents from "../../mdx-components";
import dynamic from "next/dynamic";

const MDXRemoteClient = dynamic(
  () => import("next-mdx-remote").then((mod) => mod.MDXRemote),
  { ssr: false } // 서버 사이드 렌더링을 비활성화합니다.
);

const CONTENTS_ID = process.env.TOC_HEADING || "Contents"; // 목차로 이용할 ID

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
`;

const PostBody = ({
  compiledMdx,
  data,
  lang,
  readingTime,
  width = 1150,
  scrollTop = 80,
}: {
  compiledMdx: MDXRemoteSerializeResult;
  data: iData;
  lang: LangType;
  readingTime: string;
  width?: number;
  scrollTop?: number;
}) => {
  const theme = useTheme();
  const isWide = useCheckWide(width); // 너비 체크
  const toc = useExtractToc(compiledMdx, CONTENTS_ID) || undefined; // 목차 추출
  const activeIds = useActiveSections(".markdown-body h1, .markdown-body h2, .markdown-body h3"); // 현재 보이는 섹션

  useCodeTheme(theme.palette.mode);

  return (
    <>
      <PostBodyWrapper>
        <ContentBody paddingX={isWide ? "0" : "24px"} height={"auto"} position={"relative"}>
          <PostInfo data={data} lang={lang} readingTime={readingTime} />
          <TocWrapper position={"absolute"} top={300} right={-200} height={"100%"}>
            {isWide && <Toc content={toc} activeIds={activeIds} />}
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

                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({ node, ...props }) => {
                        // CONTENTS_ID는 렌더링하지 않음
                        if (props.id === CONTENTS_ID.toLowerCase()) {
                          return null;
                        }
                        return <h1 {...props} />;
                      },
                    }}
                  >
                    {toc}
                  </ReactMarkdown>
                </>
              )}
              <MDXRemoteClient components={useMDXComponents({})} {...compiledMdx} />
              <Comments />
            </Box>
          </MarkdownBodyStyle>
        </ContentBody>
      </PostBodyWrapper>
    </>
  );
};

export default PostBody;
