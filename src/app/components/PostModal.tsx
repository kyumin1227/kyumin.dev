"use client";

import { Box, styled } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface PostModalProps {
  closeModal: () => void;
  postData: iPost;
}

const ModalWrapper = styled(motion(Box))`
  position: absolute;
  top: 10vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 80vh;
  aspect-ratio: 4 / 5;
  background-color: red;
  border-radius: 3%;
`;

function PostModal({ closeModal, postData }: PostModalProps) {
  return (
    <>
      <ModalWrapper layoutId={`${postData.path}`}>
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
