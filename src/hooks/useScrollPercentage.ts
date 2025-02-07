import React, { useEffect, useState } from "react";

/**
 * 현재 스크롤 위치의 비율 계산
 * @param ref
 * @returns
 */
const useScrollPercentage = (ref: React.RefObject<HTMLElement>) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // 현재 스크롤 비율 감지
  useEffect(() => {
    const modalElement = ref.current;

    if (!modalElement) return;

    const updateHeights = () => {
      const maxScroll = modalElement.scrollHeight - modalElement.clientHeight; // 최대 스크롤 위치

      const scrollPercentage = maxScroll > 0 ? (modalElement.scrollTop / maxScroll) * 100 : 0; // 스크롤 비율 계산
      setScrollPercentage(scrollPercentage);
    };

    // 초기 높이 및 스크롤 위치 설정
    updateHeights();

    // ResizeObserver로 높이 변화 감지
    const observer = new ResizeObserver(() => {
      updateHeights();
    });

    observer.observe(modalElement);

    // 스크롤 이벤트 처리
    const handleScroll = () => {
      updateHeights();
    };

    modalElement.addEventListener("scroll", handleScroll);

    // 정리 함수
    return () => {
      observer.disconnect();
      modalElement.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);

  return scrollPercentage;
};

export default useScrollPercentage;
