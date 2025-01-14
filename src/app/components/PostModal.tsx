"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface PostModalProps {
  seriesId: string;
  postId: string;
  closeModal: () => void;
}

export default function PostModal({ seriesId, postId, closeModal }: PostModalProps) {
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

  if (!post) return <div>로딩 중...</div>;

  return (
    <>
      <p>성공</p>
      <div className="modal">
        <div className="modal-content">
          <button onClick={closeModal}>닫기</button>
          <h1>{post.data.title}</h1>
          <article>{post.content}</article>
        </div>
        <div className="modal-overlay" onClick={closeModal}></div>
      </div>
    </>
  );
}
