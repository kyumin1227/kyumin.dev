"use client";

import { Box, Button, Divider, Grid2, styled, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "github-markdown-css/github-markdown.css"; // 기존 모듈 수정 필요 (색상 선택을 위한 클래스 추가 및 조건 변경)
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

const ContentBody = styled(Box)`
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
    color: ${({ theme }) => (theme.palette.mode === "dark" ? "#ffcc00" : "#0056b3")};
    border-left: 3px solid ${({ theme }) => (theme.palette.mode === "dark" ? "#ffcc00" : "#0056b3")};
  }
`;

const ScrollPercentageWrapper = styled(Box)`
  position: fixed;
  top: 3vh;
  height: 10px;
  width: min(94vw, 1200px);
  background-color: ${({ theme }) => theme.palette.background.paper};
  z-index: 100;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
`;

const ScrollPercentage = styled(Box)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  height: 60%;
`;

const TagWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Tag = styled(Box)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin: 4px;
  padding: 8px;
  border-radius: 4px;
  color: white;
`;

function PostModal({ closeModal, postData }: PostModalProps) {
  const theme = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [toc, setToc] = useState<string | null>(null);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const { text } = readingTime(postData.content);
  const date = new Date(postData.data.date);
  const [dateString, setDateString] = useState<string>("");
  const [readingTimeString, setReadingTimeString] = useState<string>("");
  const [tagOpen, setTagOpen] = useState(false);

  // 창 크기 변화 감지
  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const handleResize = () => {
      const width = wrapper.offsetWidth;
      setIsWide(width >= 1150); // 1150px 기준으로 상태 변경
      console.log(width);
      console.log(isWide);
    };

    // 초기 크기 감지
    handleResize();

    // ResizeObserver 설정
    const observer = new ResizeObserver(handleResize);
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 현재 스크롤 비율 감지
  useEffect(() => {
    const modalElement = wrapperRef.current;

    if (!modalElement) return;

    const updateHeights = () => {
      const maxScroll = modalElement.scrollHeight - modalElement.clientHeight; // 최대 스크롤 위치

      const scrollPercentage = maxScroll > 0 ? (modalElement.scrollTop / maxScroll) * 100 : 0; // 스크롤 비율 계산
      setScrollPercentage(scrollPercentage);
      console.log(`스크롤 비율: ${scrollPercentage}%`);
    };

    // 초기 높이 및 스크롤 위치 설정
    updateHeights();

    // ResizeObserver로 높이 변화 감지
    const observer = new ResizeObserver(() => {
      updateHeights();
    });

    observer.observe(modalElement);

    // 스크롤 이벤트 처리
    const handleScroll = () => {
      updateHeights();
    };

    modalElement.addEventListener("scroll", handleScroll);

    // 정리 함수
    return () => {
      observer.disconnect();
      modalElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // toc 추출
  useEffect(() => {
    const container = document.querySelector(".markdown-body");
    if (container) {
      const contentsHeading = container.querySelector(`h1#${CONTENTS_ID}`);
      const tocList = container.querySelector(`h1#${CONTENTS_ID} + ul`);
      if (contentsHeading && tocList) {
        // h1#contents + ul 통째로 추출
        const combinedHTML = contentsHeading.outerHTML + tocList.outerHTML;

        let ulCount = 0;

        // <ul>, </ul>, <a...>, </a> 각각을 정규식으로 구분
        // (기존 코드: /<\/?ul[^>]*>|<a[^>]*>|<\/a>/gi)
        // 여기서 <a([^>]*)> 식으로 캡처 그룹을 사용해
        // 기존 속성을 $1로 보존
        const parsed = combinedHTML.replace(/<ul[^>]*>|<\/ul>|<a([^>]*)>|<\/a>/gi, (match, aAttributes) => {
          // 소문자로 비교
          const tag = match.toLowerCase();

          if (tag.startsWith("<ul") && !tag.startsWith("</ul")) {
            // 열리는 <ul ...>
            ulCount++;
            return match; // 그대로 반환
          } else if (tag.startsWith("</ul")) {
            // 닫는 </ul>
            ulCount--;
            return match; // 그대로 반환
          } else if (tag.startsWith("<a")) {
            // a 태그 시작
            // aAttributes = " href="#..." class="..." 등
            const paddingValue = ulCount * 8;
            // 주의: 기존 style=""이 있으면 덮어쓰는 예시 (병합은 별도 로직 필요)
            return `<a${aAttributes} style="padding-left:${paddingValue}px;">`;
          } else if (tag.startsWith("</a")) {
            return "</a>";
          }

          return match; // 나머지는 변경 없이 반환
        });

        setToc(parsed);

        // 원본 DOM에서 제거
        contentsHeading.remove();
        tocList.remove();
      }
    }
  }, [postData.compiledMdx]);

  useEffect(() => {
    setDateString(formatDate(date, postData.lang));
    setReadingTimeString(formatReadingTime(text, postData.lang));
  }, [postData.lang, date, text]);

  // 현재 보이는 섹션 추적
  useEffect(() => {
    // 각 헤딩의 "현재 보임 여부"를 기록
    const visibilityMap = new Map<string, boolean>();
    const activeSet = new Set<string>();
    const allSections = Array.from(
      document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3")
    );
    let lastActiveId: string | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        let isChange = false;

        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id") || "";

          if (entry.isIntersecting) {
            visibilityMap.set(id, true);
            if (!activeSet.has(id)) {
              isChange = true;
            }
          } else {
            visibilityMap.set(id, false);
            isChange = true;
          }
        });

        if (isChange) {
          visibilityMap.forEach((isVisible, id) => {
            if (isVisible) {
              activeSet.add(id);
              lastActiveId = id; // 마지막으로 활성화된 ID를 업데이트
            } else {
              activeSet.delete(id);
            }
          });

          if (activeSet.size === 0 && lastActiveId) {
            // 현재 보이는 섹션이 없을 때
            const direction =
              (entries.find((entry) => entry.target.getAttribute("id") === lastActiveId)?.boundingClientRect.top ?? 0) <
              0
                ? "up"
                : "down";

            const lastIndex = allSections.findIndex((section) => section.getAttribute("id") === lastActiveId);
            if (direction === "up") {
              // 위로 사라졌으면 해당 항목을 활성화
              setActiveIds([lastActiveId]);
            } else if (direction === "down" && lastIndex > 0) {
              // 아래로 사라졌으면 바로 위 항목을 활성화
              const previousSection = allSections[lastIndex - 1];
              const previousId = previousSection?.getAttribute("id");
              setActiveIds([previousId || ""]);
            }
          } else {
            setActiveIds(Array.from(activeSet));
          }
        }
      },
      {
        root: wrapperRef.current, // 모달 내부를 기준
        threshold: 0.1,
      }
    );

    // 관찰 대상 지정
    const sections = document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

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
