"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "@/app/components/Modal";

interface ClientSideFeaturesProps {
  lang: string;
  postId: string;
}

export default function ClientSideFeatures({ lang, postId }: ClientSideFeaturesProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    router.push(`/${lang}/posts/${postId}`); // URL 변경 (shallow)
  };

  const closeModal = () => {
    setIsOpen(false);
    router.push(`/${lang}`); // URL 복구
  };

  return (
    <>
      <button onClick={openModal}>Open Modal</button>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <h2>Modal for Post</h2>
          <p>Post ID: {postId}</p>
        </Modal>
      )}
    </>
  );
}
