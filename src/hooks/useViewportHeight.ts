import { useEffect, useState } from "react";

const useViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight); // 현재 뷰포트 높이
    };

    window.addEventListener("resize", updateHeight);
    updateHeight(); // 초기 설정

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return viewportHeight;
};

export default useViewportHeight;
