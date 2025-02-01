import { useEffect, useState } from "react";

/**
 * 전체 화면이 지정한 너비보다 넓은지 확인
 * @param targetWide 너비 기준 값 (기본값: 1150)
 * @returns
 */
const useCheckWide = (targetWide: number = 1150): boolean => {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsWide(window.innerWidth > targetWide);

      handleResize(); // 최초 렌더링 시 실행

      // 이벤트 리스너 추가
      window.addEventListener("resize", handleResize);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [targetWide]);

  return isWide;
};

export default useCheckWide;
