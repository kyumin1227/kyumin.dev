"use client";

import { Box, styled, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import "github-markdown-css/github-markdown.css";

interface PostModalProps {
  closeModal: () => void;
  postData: iPost;
}

const ModalWrapper = styled(motion(Box))`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto auto;
  max-height: 94vh;
  max-width: 94vw;
  overflow: scroll;
  background-color: red;
  border-radius: 3%;
  display: flex;
  justify-content: center;
`;

const MarkdownBody = styled(Box)`
  max-width: 700px;
  padding-left: 24px;
  padding-right: 24px;
`;

function PostModal({ closeModal, postData }: PostModalProps) {
  const isLandscape = useMediaQuery("(orientation: landscape)");

  const theme = useTheme();

  return (
    <>
      <ModalWrapper layoutId={`${postData.path}`} sx={{ aspectRatio: isLandscape ? " 4 / 3.5" : "3 / 4" }}>
        {postData ? (
          <div className="modal">
            <div className="modal-content">
              <button onClick={closeModal}>닫기</button>
              <h1>{postData.data.title}</h1>
              {/* 기존 모듈 수정 필요 */}
              {/* github-markdown-css/github-markdown.css 의 색상 선택 부분 클래스 및 조건 변경 */}
              <MarkdownBody
                className={`markdown-body ${theme.palette.mode === "dark" ? "markdown-dark" : "markdown-light"}`}
              >
                <div dangerouslySetInnerHTML={{ __html: postData.compiledMdx }} />
              </MarkdownBody>
            </div>
            <div className="modal-overlay" onClick={closeModal}></div>
          </div>
        ) : (
          <div>로딩 중...</div>
        )}
      </ModalWrapper>
    </>
  );
}

export default PostModal;
