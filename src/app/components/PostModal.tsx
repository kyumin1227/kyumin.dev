"use client";

import { Box, styled, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

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
  overflow: hidden;
  background-color: red;
  border-radius: 3%;
`;

function PostModal({ closeModal, postData }: PostModalProps) {
  const isLandscape = useMediaQuery("(orientation: landscape)");

  console.log(isLandscape);

  return (
    <>
      <ModalWrapper layoutId={`${postData.path}`} sx={{ aspectRatio: isLandscape ? " 4 / 3.5" : "3 / 4" }}>
        {postData ? (
          <div className="modal">
            <div className="modal-content">
              <button onClick={closeModal}>닫기</button>
              <h1>{postData.data.title}</h1>
              <article>{postData.content}</article>
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
