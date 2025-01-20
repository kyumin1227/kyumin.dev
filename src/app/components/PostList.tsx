"use client";

import { Grid2, Modal } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import PostModal from "./PostModal";
import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { usePathname } from "next/navigation";

const MotionModal = motion(Modal);

const PostList = ({ posts, lang }: { posts: iPost[]; lang: string }) => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState<any | null>(null);

  useEffect(() => {
    // URL에 따라 모달 상태 설정
    const match = pathname.match(/\/posts\/([^/]+)\/([^/]+)/); // 정규식 수정
    if (match) {
      setIsModalOpen(true);
      const selectedPost = posts.find((post: any) => post.path === `${match[1]}/${match[2]}`);
      setModalPost(selectedPost);
      console.log("match true");
      console.log(`${match[1]}/${match[2]}`);
      document.body.style.overflow = "hidden";
    } else {
      setIsModalOpen(false);
      setModalPost(null);
      console.log("match false");
      document.body.style.overflow = "auto";
    }
  }, [pathname]);

  const openModal = (postId: string) => {
    window.history.pushState({}, "", `/${lang}/posts/${postId}`); // URL 변경
    setIsModalOpen(true);
  };

  const closeModal = () => {
    window.history.pushState({}, "", `/${lang}`); // URL 변경
    setIsModalOpen(false);
  };

  return (
    <>
      <Grid2 container spacing={5}>
        {posts.map((post: iPost) => (
          <React.Fragment key={post.path}>
            <PostCard data={post} modalFunc={openModal} />
          </React.Fragment>
        ))}
      </Grid2>

      {isModalOpen && modalPost && (
        <>
          <AnimatePresence>
            <MotionModal open={isModalOpen} onClose={closeModal}>
              <PostModal postData={modalPost} closeModal={closeModal} />
            </MotionModal>
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default PostList;
