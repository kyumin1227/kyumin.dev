"use client";

import { Box, Grid2, styled, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import Footer from "./Footer";
import useScrollPercentage from "@/hooks/useScrollPercentage";
import useViewportHeight from "@/hooks/useViewportHeight";
import PostBody from "./PostBody";
import { iPost } from "@/types/posts";

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
  width: min(94vw, 1200px);
  border: 2px solid ${({ theme }) => theme.palette.divider};
  border-radius: 10px;
  overflow-y: scroll;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    display: none;
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
  height: 8px;
`;

function PostModal({ closeModal, postData }: PostModalProps) {
  const theme = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollPercentage = useScrollPercentage(wrapperRef); // 현재 스크롤 비율
  const viewportHeight = useViewportHeight();

  return (
    <>
      <ModalWrapper
        layoutId={`${postData.path}`}
        className="modal"
        ref={wrapperRef}
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#ffffff",
          maxHeight: `calc(${viewportHeight}px - 6vh)`,
        }}
        position="relative"
      >
        <ScrollPercentageWrapper>
          <ScrollPercentage width={`${scrollPercentage}%`} />
        </ScrollPercentageWrapper>
        <PostBody
          compiledMdx={postData.compiledMdx}
          data={postData.data}
          lang={postData.lang}
          readingTime={postData.readingTime}
          width={1200}
          scrollTop={10}
          toc={postData.toc}
        />
        <Footer />
        <div className="modal-overlay" onClick={closeModal}></div>
      </ModalWrapper>
    </>
  );
}

export default PostModal;
