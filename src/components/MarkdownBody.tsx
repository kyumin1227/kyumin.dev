"use client";

import { Box, Divider, styled, Typography, useTheme } from "@mui/material";
import Comments from "./Comments";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "github-markdown-css";
import "../styles/github-markdown.css"; // 기존 모듈 수정 필요 (색상 선택을 위한 클래스 추가 및 조건 변경)
import { ContentBody } from "./PostModal";
import Toc from "./Toc";
import useCodeTheme from "@/hooks/useCodeTheme";
import useExtractToc from "@/hooks/useExtractToc";
import useActiveSections from "@/hooks/useActiveSections";
import useCheckWide from "@/hooks/useCheckWide";
import PostInfo from "./PostInfo";

const CONTENTS_ID = process.env.TOC_HEADING || "Contents"; // 목차로 이용할 ID

const TocWrapper = styled(Box)``;

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

  h1,
  h2,
  h3 {
    scroll-margin-top: 80px;
  }
`;

const MarkdownBody = ({
  compiledMdx,
  data,
  lang,
  readingTime,
}: {
  compiledMdx: any;
  data: iData;
  lang: LangType;
  readingTime: string;
}) => {
  const theme = useTheme();
  const isWide = useCheckWide(1150); // 너비 체크
  const toc = useExtractToc(compiledMdx, CONTENTS_ID) || undefined; // 목차 추출
  const activeIds = useActiveSections(".markdown-body h1, .markdown-body h2, .markdown-body h3"); // 현재 보이는 섹션

  useCodeTheme(theme.palette.mode);

  return (
    <>
      <ContentBody paddingX={isWide ? "0" : "24px"} height={"auto"} position={"relative"}>
        <PostInfo data={data} lang={lang} readingTime={readingTime} />
        <TocWrapper position={"absolute"} top={300} right={-200} height={"100%"}>
          {isWide && <Toc content={toc} activeIds={activeIds} />}
        </TocWrapper>
        <MarkdownBodyStyle
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
                      if (props.id === CONTENTS_ID) {
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

            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{compiledMdx}</ReactMarkdown>
            <Comments />
          </Box>
        </MarkdownBodyStyle>
      </ContentBody>
    </>
  );
};

export default MarkdownBody;
