"use client";

import { Box, Button, Divider, Grid2, Link, styled, Typography, useTheme } from "@mui/material";
import Comments from "./Comments";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "../styles/github-markdown.css"; // 기존 모듈 수정 필요 (색상 선택을 위한 클래스 추가 및 조건 변경)
import useCodeTheme from "@/hooks/useCodeTheme";
import { useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import { formatDate, formatReadingTime } from "@/utils/dataFormatter";
import { ContentBody, Tag, TagWrapper } from "./PostModal";
import { IconAndText } from "./PostCard";
import useExtractToc from "@/hooks/useExtractToc";
import useActiveSections from "@/hooks/useActiveSections";

const CONTENTS_ID = "contents"; // 목차로 이용할 ID

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

const Toc = styled(Box)`
  max-width: 180px;
  width: 180px;
  position: sticky;
  padding-left: 24px;
  top: 200px;
  right: 0;

  h1 {
    font-size: 28px;
    font-weight: bold;
    padding-left: 8px;
    margin-bottom: 8px;
  }

  a {
    text-decoration: none;
    padding: 5px;
    display: inline-block;
    border-left: 3px solid transparent;
    font-size: 14px;
    line-height: 14px;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  .active {
    font-weight: bold;
    color: ${({ theme }) => theme.palette.primary.main};
    border-left: 3px solid ${({ theme }) => theme.palette.primary.main};
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
  lang: string;
  readingTime: string;
}) => {
  console.log(typeof compiledMdx);
  const date = new Date(data.date);
  const theme = useTheme();
  const [tagOpen, setTagOpen] = useState(false);
  const [dateString, setDateString] = useState<string>("");
  const [readingTimeString, setReadingTimeString] = useState<string>("");
  const [isWide, setIsWide] = useState(window.innerWidth > 1150);
  const toc = useExtractToc(compiledMdx, CONTENTS_ID); // 목차 추출
  const activeIds = useActiveSections(".markdown-body h1, .markdown-body h2, .markdown-body h3"); // 현재 보이는 섹션

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth > 1150);

    // 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  useEffect(() => {
    setDateString(formatDate(date, lang));
    setReadingTimeString(formatReadingTime(readingTime, lang));
  }, [lang, date, readingTime]);

  useCodeTheme(theme.palette.mode);

  return (
    <>
      <ContentBody paddingX={isWide ? "0" : "24px"} height={"auto"} position={"relative"}>
        <Typography fontWeight={"bold"} variant="h4" paddingTop={5} paddingBottom={1}>
          {data.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paddingBottom={1}>
          {data.description}
        </Typography>
        <Grid2 color="text.secondary" paddingBottom={1} display={"flex"} alignItems={"center"}>
          <IconAndText size={"auto"} color={"text.secondary"}>
            <CalendarMonthOutlinedIcon fontSize="small" sx={{ marginRight: "4px" }} />
            <Typography fontSize={14}>{dateString}</Typography>
          </IconAndText>
          <Typography fontSize={14} sx={{ marginX: "8px" }}>
            •
          </Typography>
          <IconAndText size={"auto"} color={"text.secondary"}>
            <AccessTimeIcon fontSize="small" sx={{ marginRight: "4px" }} />
            <Typography fontSize={14}>{readingTimeString}</Typography>
          </IconAndText>
          <Grid2 size={"grow"} display={"flex"} justifyContent={"flex-end"}>
            <Button
              onClick={() => {
                setTagOpen(!tagOpen);
              }}
            >
              {tagOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              {lang === "ko" ? "태그 보기" : !tagOpen ? "タグを見る" : "タグを閉じる"}
            </Button>
          </Grid2>
        </Grid2>
        <TocWrapper position={"absolute"} top={300} right={-200} height={"100%"}>
          {isWide && (
            <Toc>
              {toc && (
                <>
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({ node, ...props }) => {
                        // id가 "contents"인 경우 렌더링하지 않음
                        if (props.id === "contents") {
                          return null;
                        }
                        return <h1 {...props} />;
                      },
                    }}
                  >
                    {`${toc.replace(/<li><a href="#(.*?)"([^>]*)>/g, (match, id, attributes) => {
                      const activeClass = activeIds.includes(id) ? "active" : "";
                      return `<li><a class="${activeClass}" href="#${id}" ${attributes}>`;
                    })}`}
                  </ReactMarkdown>
                  <Link href={`#comments`}>
                    <CommentIcon />
                  </Link>
                </>
              )}
            </Toc>
          )}
        </TocWrapper>
        <MarkdownBodyStyle
          className={`markdown-body ${theme.palette.mode === "dark" ? "markdown-dark" : "markdown-light"}`}
        >
          {tagOpen && (
            <TagWrapper>
              {data.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagWrapper>
          )}
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
                      // id가 "contents"인 경우 렌더링하지 않음
                      if (props.id === "contents") {
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
