"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import PostModal from "../components/PostModal";
import PostCard from "../components/PostCard";
import { Grid2, Modal, styled } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const MotionModal = motion(Modal);

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const { lang } = useParams();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState<any | null>(null);

  useEffect(() => {
    // 서버에서 글 목록 가져오기
    const fetchPosts = async () => {
      const data = await fetch(`/api/${lang}/posts`).then((res) => res.json());
      setPosts(data);
      console.log(data);
    };

    fetchPosts();
  }, [lang]);

  useEffect(() => {
    // URL에 따라 모달 상태 설정
    const match = pathname.match(/\/posts\/([^/]+)\/([^/]+)/); // 정규식 수정
    if (match) {
      setIsModalOpen(true);
      const selectedPost = posts
        .find((series) => series.series === match[1])
        ?.posts.find((post: any) => post.path === `${match[1]}/${match[2]}`);
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
    <div>
      <h1>글 목록 ({lang})</h1>
      <Grid2 container spacing={5}>
        {posts.map((series) =>
          series.posts.map((post: iPost) => (
            <React.Fragment key={post.path}>
              <PostCard
                path={post.path}
                title={post.data.title}
                description={post.data.description}
                modalFunc={openModal}
              />
            </React.Fragment>
          ))
        )}
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
    </div>
  );
}
