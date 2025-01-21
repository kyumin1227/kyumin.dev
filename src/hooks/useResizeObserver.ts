import { useEffect, useState } from "react";

/**
 * 선택된 ref의 넓이가 targetWide 이상인지 확인
 * @param ref 목표 엘리먼트
 * @param targetWide 목표 넓이
 * @returns 넘는 경우 true, 넘지 않는 경우 false
 */
const useResizeObserver = (ref: React.RefObject<HTMLElement>, targetWide: number) => {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const wrapper = ref.current;

    if (!wrapper) return;

    const handleResize = () => {
      const width = wrapper.offsetWidth;
      setIsWide(width >= targetWide);
      console.log(width);
      console.log(isWide);
    };

    // 초기 크기 감지
    handleResize();

    // ResizeObserver 설정
    const observer = new ResizeObserver(handleResize);
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isWide;
};

export default useResizeObserver;
