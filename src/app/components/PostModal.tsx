"use client";

import { Box, Grid2, styled, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "github-markdown-css/github-markdown.css";

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
  width: min(100%, 800px);
  position: relative;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Toc = styled(Box)`
  max-width: 180px;
  position: sticky;
  padding-left: 20px;
  top: 150px;
  right: 0px;

  a {
    text-decoration: none;
  }

  .active {
    font-weight: bold;
    color: ${({ theme }) => (theme.palette.mode === "dark" ? "#ffcc00" : "#0056b3")};
  }
`;

function PostModal({ closeModal, postData }: PostModalProps) {
  const theme = useTheme();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const handleResize = () => {
      const width = wrapper.offsetWidth;
      setIsWide(width >= 1200); // 1200px 기준으로 상태 변경
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

  const [toc, setToc] = useState<string | null>(null);

  useEffect(() => {
    // 이미 생성된 목차 추출
    const container = document.querySelector(".markdown-body");
    if (container) {
      const tocElement = container.querySelector("h1#contents + ul");
      if (tocElement) {
        setToc(tocElement.innerHTML); // 목차 HTML을 추출
      }
    }
  }, [postData.compiledMdx]);

  const [activeIds, setActiveIds] = useState<string[]>([]);

  useEffect(() => {
    // 각 헤딩의 “현재 보임 여부”를 기록
    const visibilityMap = new Map<string, boolean>();
    // 최종적으로 active가 될 헤딩 id들을 추적
    const activeSet = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        let newlyVisibleCount = 0;

        // 1) 콜백에 들어온 항목들만 상태 갱신
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id") || "";
          if (entry.isIntersecting) {
            // 새로 보이게 된 헤딩
            visibilityMap.set(id, true);
            // 혹시 기존에 activeSet에 없었다면 → 새로 들어왔다고 판단
            if (!activeSet.has(id)) {
              newlyVisibleCount++;
            }
          } else {
            // 화면에서 벗어났거나 계속 안 보이는 헤딩
            visibilityMap.set(id, false);
          }
        });

        // 2) 새로 들어온 게 있으면
        if (newlyVisibleCount > 0) {
          // visibilityMap 전체를 스캔해서
          // false인 것들은 activeSet에서 제거, true인 것들은 추가
          visibilityMap.forEach((isVisible, id) => {
            if (isVisible) {
              activeSet.add(id);
            } else {
              activeSet.delete(id);
            }
          });
        }
        // (새로 들어온 게 없다면, 이전 상태(activeSet)를 유지)

        // 3) 만약 activeSet이 전부 비면 “최소 1개는 유지” 규칙을 적용할 수도 있음
        // (원하면 여기에 custom 로직 추가)

        // 4) state 업데이트
        setActiveIds(Array.from(activeSet));
      },
      {
        root: wrapperRef.current, // 모달 내부를 기준으로 한다면
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
            width={isWide ? "1000px" : "min(100%, 1200px)"}
            className="modal-content"
          >
            {/* 기존 모듈 수정 필요 */}
            {/* github-markdown-css/github-markdown.css 의 색상 선택 부분 클래스 및 조건 변경 */}
            <MarkdownBody
              className={`markdown-body ${theme.palette.mode === "dark" ? "markdown-dark" : "markdown-light"}`}
              width="min(100%, 800px)"
            >
              {/* <div dangerouslySetInnerHTML={{ __html: postData.compiledMdx }} /> */}
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{postData.compiledMdx}</ReactMarkdown>
            </MarkdownBody>
          </Grid2>
        ) : (
          <div>로딩 중...</div>
        )}
        {toc && isWide && (
          <Toc
          // dangerouslySetInnerHTML={{
          //   __html: toc.replace(/<li><a href="#(.*?)">/g, (match, id) => {
          //     const activeClass = activeIds.includes(id) ? "active" : "";
          //     return `<li><a class="${activeClass}" href="#${id}">`;
          //   }),
          // }}
          >
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {`<ul>${toc.replace(/<li><a href="#(.*?)">/g, (match, id) => {
                const activeClass = activeIds.includes(id) ? "active" : "";
                // 여기서 백틱 대신, 그대로 문자열 리터럴을 사용해서 문제 해소
                return `<li><a class="${activeClass}" href="#${id}">`;
              })}</ul>`}
            </ReactMarkdown>
          </Toc>
        )}
        <div className="modal-overlay" onClick={closeModal}></div>
      </ModalWrapper>
    </>
  );
}

export default PostModal;
