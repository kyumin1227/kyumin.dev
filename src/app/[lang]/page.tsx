"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import PostModal from "../components/PostModal";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const router = useRouter();
  const { lang } = useParams();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSeriesId, setModalSeriesId] = useState<string | null>(null);
  const [modalPostId, setModalPostId] = useState<string | null>(null);

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
      setModalSeriesId(match[1]);
      setModalPostId(match[2]);
      console.log("match true");
      console.log(`${match[1]}/${match[2]}`);
    } else {
      setIsModalOpen(false);
      setModalSeriesId(null);
      setModalPostId(null);
      console.log("match false");
    }
  }, [pathname]);

  const openModal = (postId: string) => {
    window.history.pushState({}, "", `/${lang}/posts/${postId}`); // URL 변경
    setIsModalOpen(true);
    setModalSeriesId(postId);
  };

  const closeModal = () => {
    window.history.pushState({}, "", `/${lang}`); // URL 변경
    setIsModalOpen(false);
    setModalSeriesId(null);
  };

  return (
    <div>
      <h1>글 목록 ({lang})</h1>
      <ul>
        {posts.map((series) =>
          series.posts.map((post: iPost) => (
            <li key={post.path}>
              <button onClick={() => openModal(post.path)}>{post.data.title}</button>
            </li>
          ))
        )}
      </ul>

      {isModalOpen && modalSeriesId && modalPostId && (
        <PostModal seriesId={modalSeriesId} postId={modalPostId} closeModal={closeModal} />
      )}
    </div>
  );
}
