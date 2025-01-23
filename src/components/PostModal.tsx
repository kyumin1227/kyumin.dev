"use client";

import { Box, Button, Divider, Grid2, styled, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "../styles/github-markdown.css"; // 기존 모듈 수정 필요 (색상 선택을 위한 클래스 추가 및 조건 변경)
import Comments from "./Comments";
import Link from "next/link";
import CommentIcon from "@mui/icons-material/Comment";
import Footer from "./Footer";
import { formatDate, formatReadingTime } from "@/utils/dataFormatter";
import readingTime from "reading-time";
import { IconAndText } from "./PostCard";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import useCodeTheme from "@/hooks/useCodeTheme";
import useResizeObserver from "@/hooks/useResizeObserver";
import useScrollPercentage from "@/hooks/useScrollPercentage";
import useExtractToc from "@/hooks/useExtractToc";
import useActiveSections from "@/hooks/useActiveSections";

const CONTENTS_ID = "contents"; // 목차로 이용할 ID

interface PostModalProps {
  closeModal: () => void;
  postData: iPost;
}

const ModalWrapper = styled(motion(Grid2))`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto auto;
  padding-top: 10px;
  max-height: 94vh;
  width: min(94vw, 1200px);
  border: 2px solid ${({ theme }) => theme.palette.divider};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  overflow-y: scroll;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const MarkdownBody = styled(Box)`
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
    scroll-margin-top: 10px;
  }
`;

export const ContentBody = styled(Box)`
  width: min(100%, 750px);
`;

// 목차 스타일링
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

const ScrollPercentageWrapper = styled(Box)`
  position: fixed;
  top: 3vh;
  height: 10px;
  width: min(94vw, 1200px);
  max-width: 1200px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  z-index: 100;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.palette.divider};
  border-bottom: none;
  box-sizing: border-box;
`;

const ScrollPercentage = styled(Box)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  height: 80%;
`;

export const TagWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

export const Tag = styled(Box)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin: 4px;
  padding: 8px;
  border-radius: 4px;
  color: ${({ theme }) => (theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white)};
`;

function PostModal({ closeModal, postData }: PostModalProps) {
  const theme = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  // const [activeIds, setActiveIds] = useState<string[]>([]);
  const { text } = readingTime(postData.content);
  const date = new Date(postData.data.date);
  const [dateString, setDateString] = useState<string>("");
  const [readingTimeString, setReadingTimeString] = useState<string>("");
  const [tagOpen, setTagOpen] = useState(false);
  const isWide = useResizeObserver(wrapperRef, 1150); // 넓이가 1150px 이상인지 여부
  const scrollPercentage = useScrollPercentage(wrapperRef); // 현재 스크롤 비율
  const toc = useExtractToc(postData.compiledMdx, CONTENTS_ID); // 목차 추출
  const activeIds = useActiveSections(".markdown-body h1, .markdown-body h2, .markdown-body h3"); // 현재 보이는 섹션

  useCodeTheme(theme.palette.mode);

  useEffect(() => {
    setDateString(formatDate(date, postData.lang));
    setReadingTimeString(formatReadingTime(text, postData.lang));
  }, [postData.lang, date, text]);

  return (
    <>
      <ModalWrapper
        layoutId={`${postData.path}`}
        className="modal"
        ref={wrapperRef}
        sx={{ backgroundColor: theme.palette.mode === "dark" ? "#0d1117" : "#ffffff" }}
        position="relative"
      >
        <ScrollPercentageWrapper>
          <ScrollPercentage width={`${scrollPercentage}%`} />
        </ScrollPercentageWrapper>
        {postData ? (
          <Grid2
            display="flex"
            justifyContent={isWide ? "end" : "center"}
            width={isWide ? "950px" : "min(100%, 1150px)"}
            className="modal-content"
          >
            <ContentBody paddingX={isWide ? "0" : "24px"}>
              <Typography fontWeight={"bold"} variant="h4" paddingTop={5} paddingBottom={1}>
                {postData.data.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" paddingBottom={1}>
                {postData.data.description}
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
                    {postData.lang === "ko" ? "태그 보기" : !tagOpen ? "タグを見る" : "タグを閉じる"}
                  </Button>
                </Grid2>
              </Grid2>
              {tagOpen && (
                <TagWrapper>
                  {postData.data.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagWrapper>
              )}
              <Divider sx={{ marginBottom: "32px" }} />
              <MarkdownBody
                className={`markdown-body ${theme.palette.mode === "dark" ? "markdown-dark" : "markdown-light"}`}
              >
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
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{postData.compiledMdx}</ReactMarkdown>
                <Comments />
              </MarkdownBody>
              <Footer />
            </ContentBody>
          </Grid2>
        ) : (
          <div>로딩 중...</div>
        )}
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
        <div className="modal-overlay" onClick={closeModal}></div>
      </ModalWrapper>
    </>
  );
}

export default PostModal;
