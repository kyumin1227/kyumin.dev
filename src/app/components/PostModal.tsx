"use client";

import { Box, Grid2, styled, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "github-markdown-css/github-markdown.css"; // 기존 모듈 수정 필요 (색상 선택을 위한 클래스 추가 및 조건 변경)

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
  max-height: 94vh;
  width: min(94vw, 1200px);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  overflow: scroll;
`;

const MarkdownBody = styled(Box)`
  width: min(100%, 750px);
  position: relative;
  ::-webkit-scrollbar {
    display: none;
  }
`;

// 목차 스타일링
const Toc = styled(Box)`
  max-width: 180px;
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

function PostModal({ closeModal, postData }: PostModalProps) {
  const theme = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(false);
  const [toc, setToc] = useState<string | null>(null);
  const [activeIds, setActiveIds] = useState<string[]>([]);

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
        {postData ? (
          <Grid2
            display="flex"
            justifyContent={isWide ? "end" : "center"}
            width={isWide ? "950px" : "min(100%, 1150px)"}
            className="modal-content"
          >
            <MarkdownBody
              className={`markdown-body ${theme.palette.mode === "dark" ? "markdown-dark" : "markdown-light"}`}
            >
              {!isWide && toc && <ReactMarkdown rehypePlugins={[rehypeRaw]}>{toc}</ReactMarkdown>}
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{postData.compiledMdx}</ReactMarkdown>
            </MarkdownBody>
          </Grid2>
        ) : (
          <div>로딩 중...</div>
        )}
        {toc && isWide && (
          <Toc>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {`${toc.replace(/<li><a href="#(.*?)"([^>]*)>/g, (match, id, attributes) => {
                const activeClass = activeIds.includes(id) ? "active" : "";
                return `<li><a class="${activeClass}" href="#${id}" ${attributes}>`;
              })}`}
            </ReactMarkdown>
          </Toc>
        )}
        <div className="modal-overlay" onClick={closeModal}></div>
      </ModalWrapper>
    </>
  );
}

export default PostModal;
