"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 브라우저 언어 확인
    const userLanguage = navigator.language;

    // 언어에 따른 경로 설정
    const langRoute = userLanguage.startsWith("ko") ? "/ko" : "/ja";

    // 해당 언어 경로로 리다이렉트
    router.push(langRoute);
  }, [router]);

  return (
    <>
      <div>使用者の言語を確認しています...</div>
      <div>사용자의 언어를 확인 중 입니다...</div>
    </>
  );
}
