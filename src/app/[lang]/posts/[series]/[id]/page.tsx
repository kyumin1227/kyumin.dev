"use client";

import Modal from "@/app/components/Modal";
import { useRouter } from "next/navigation";

export default function PostDetails({ params }: { params: { lang: string; series: string; id: string } }) {
  console.log("Params:", params);

  const router = useRouter();
  const { lang, series, id } = params;

  const closeModal = () => {
    router.push(`/${lang}`); // 이전 경로로 복귀
  };

  return (
    <Modal isOpen={true} onClose={closeModal}>
      <h2>Post Details</h2>
      <p>Lang: {lang}</p>
      <p>Series: {series}</p>
      <p>ID: {id}</p>
    </Modal>
  );
}
