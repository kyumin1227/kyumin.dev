"use client";

import { Box, styled } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface PostModalProps {
  seriesId: string;
  postId: string;
  closeModal: () => void;
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

function PostModal({ seriesId, postId, closeModal }: PostModalProps) {
  const [post, setPost] = useState<iPost>();
  const { lang } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      console.log(`/api/${lang}/posts/${seriesId}/${postId}`);

      const response: iPost = await fetch(`/api/${lang}/posts/${seriesId}/${postId}`).then((res) => res.json());

      console.log(response);

      setPost(response);
    };

    fetchPost();
  }, [seriesId, postId]);

  return (
    <>
      <ModalWrapper layoutId={`${seriesId}/${postId}`}>
        <p>성공</p>
        {post ? (
          <div className="modal">
            <div className="modal-content">
              <button onClick={closeModal}>닫기</button>
              <h1>{post.data.title}</h1>
              <article>{post.content}</article>
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
